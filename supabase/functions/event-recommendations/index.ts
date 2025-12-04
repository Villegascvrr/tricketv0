import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();
    
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch event data
    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId);

    if (eventError) throw eventError;
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Event not found',
          message: `No se encontró el evento con ID: ${eventId}. Crea un evento primero o verifica el ID.`
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const event = events[0];

    // Fetch provider allocations first
    const { data: allocations, error: allocationsError } = await supabase
      .from('ticket_provider_allocations')
      .select('*')
      .eq('event_id', eventId);

    if (allocationsError) throw allocationsError;

    // Use aggregated queries instead of fetching all tickets
    // Get total count and revenue
    const { count: totalTicketsSold, error: countError } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (countError) throw countError;

    const { data: revenueData, error: revenueError } = await supabase
      .from('tickets')
      .select('price')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Ensure we get all tickets

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
    const avgPrice = totalRevenue / (totalTicketsSold || 1);
    
    console.log(`Total tickets sold: ${totalTicketsSold}, Total revenue: ${totalRevenue}, Avg price: ${avgPrice}`);

    // Get sales by provider with ALL data
    const { data: providerData, error: providerError } = await supabase
      .from('tickets')
      .select('provider_name, price')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Critical: get ALL tickets, not just 1000

    if (providerError) throw providerError;

    const providerStats = providerData.reduce((acc, ticket) => {
      const provider = ticket.provider_name || 'Unknown';
      if (!acc[provider]) {
        acc[provider] = { count: 0, revenue: 0, allocated: 0 };
      }
      acc[provider].count++;
      acc[provider].revenue += Number(ticket.price) || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; allocated: number }>);

    // Add allocation data
    allocations?.forEach(alloc => {
      if (providerStats[alloc.provider_name]) {
        providerStats[alloc.provider_name].allocated = alloc.allocated_capacity;
      }
    });
    
    // Log provider stats for debugging
    console.log('Provider stats:', JSON.stringify(
      Object.entries(providerStats).map(([name, stats]) => {
        const s = stats as { count: number; revenue: number; allocated: number };
        return {
          name,
          tickets: s.count,
          allocated: s.allocated,
          occupancy: s.allocated ? ((s.count / s.allocated) * 100).toFixed(1) + '%' : 'N/A'
        };
      }),
      null, 2
    ));

    // Get sales by channel
    const { data: channelData, error: channelError } = await supabase
      .from('tickets')
      .select('channel, price')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Get ALL tickets

    if (channelError) throw channelError;

    const channelStats = channelData.reduce((acc, ticket) => {
      const channel = ticket.channel || 'Unknown';
      if (!acc[channel]) {
        acc[channel] = { count: 0, revenue: 0 };
      }
      acc[channel].count++;
      acc[channel].revenue += Number(ticket.price) || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Get geographic distribution
    const { data: geoData, error: geoError } = await supabase
      .from('tickets')
      .select('buyer_province')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Get ALL tickets

    if (geoError) throw geoError;

    const provinceStats = geoData.reduce((acc, ticket) => {
      const province = ticket.buyer_province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get age distribution
    const { data: ageData, error: ageError } = await supabase
      .from('tickets')
      .select('buyer_age')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Get ALL tickets

    if (ageError) throw ageError;

    const ageRanges = ageData.reduce((acc, ticket) => {
      if (ticket.buyer_age) {
        let range = 'Unknown';
        if (ticket.buyer_age < 18) range = '<18';
        else if (ticket.buyer_age < 25) range = '18-24';
        else if (ticket.buyer_age < 35) range = '25-34';
        else if (ticket.buyer_age < 45) range = '35-44';
        else range = '45+';
        acc[range] = (acc[range] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Get contact data
    const { data: contactData, error: contactError } = await supabase
      .from('tickets')
      .select('has_email, has_phone, marketing_consent')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(999999); // Get ALL tickets

    if (contactError) throw contactError;

    const contactStats = {
      withEmail: contactData.filter(t => t.has_email).length,
      withPhone: contactData.filter(t => t.has_phone).length,
      withMarketing: contactData.filter(t => t.marketing_consent).length,
    };

    // Prepare context for AI
    const eventContext = {
      event: {
        name: event.name,
        type: event.type,
        venue: event.venue,
        capacity: event.total_capacity,
        startDate: event.start_date,
        endDate: event.end_date,
      },
      sales: {
        totalTickets: totalTicketsSold || 0,
        totalRevenue,
        avgPrice,
        occupancyRate: (((totalTicketsSold || 0) / (event.total_capacity || 1)) * 100).toFixed(1),
      },
      channels: Object.entries(channelStats).map(([name, stats]) => ({
        name,
        tickets: (stats as { count: number; revenue: number }).count,
        revenue: (stats as { count: number; revenue: number }).revenue,
        percentage: (((stats as { count: number; revenue: number }).count / (totalTicketsSold || 1)) * 100).toFixed(1),
      })),
      providers: Object.entries(providerStats).map(([name, stats]) => ({
        name,
        tickets: (stats as { count: number; revenue: number; allocated: number }).count,
        revenue: (stats as { count: number; revenue: number; allocated: number }).revenue,
        allocated: (stats as { count: number; revenue: number; allocated: number }).allocated,
        occupancyRate: (stats as { count: number; revenue: number; allocated: number }).allocated 
          ? (((stats as { count: number; revenue: number; allocated: number }).count / (stats as { count: number; revenue: number; allocated: number }).allocated) * 100).toFixed(1) 
          : null,
      })),
      geography: Object.entries(provinceStats)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 10)
        .map(([province, count]) => ({
          province,
          count,
          percentage: (((count as number) / (totalTicketsSold || 1)) * 100).toFixed(1),
        })),
      demographics: {
        ageRanges: Object.entries(ageRanges).map(([range, count]) => ({
          range,
          count,
          percentage: (((count as number) / (totalTicketsSold || 1)) * 100).toFixed(1),
        })),
        contactData: {
          emailRate: ((contactStats.withEmail / (totalTicketsSold || 1)) * 100).toFixed(1),
          phoneRate: ((contactStats.withPhone / (totalTicketsSold || 1)) * 100).toFixed(1),
          marketingRate: ((contactStats.withMarketing / (totalTicketsSold || 1)) * 100).toFixed(1),
        },
      },
    };

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto analista de eventos y marketing de entretenimiento.

Analiza los datos del evento y genera recomendaciones accionables basadas en REGLAS ESPECÍFICAS de ocupación y rendimiento.

DATOS DEL EVENTO:
${JSON.stringify(eventContext, null, 2)}

REGLAS DE PRIORIDAD (CRÍTICO):

**CRÍTICAS (priority: "high"):**
1. Ocupación total < 50%
2. Alguna zona con < 30% ocupación
3. Alguna ticketera con > 80% capacidad sin vender (< 20% ocupación)
4. Ingresos proyectados < 70% del objetivo (objetivo: 5,000,000 €)

**IMPORTANTES (priority: "medium"):**
1. Ocupación total entre 50-70%
2. Zonas con ocupación entre 30-50%
3. Ticketeras con ocupación entre 20-50%

**SUGERENCIAS (priority: "low"):**
1. Precio medio por entrada < 100€ (considerar upselling)
2. Segmentos demográficos con < 10% de participación
3. Zonas o ticketeras con alta ocupación (>75%) para optimizar pricing

ESTRUCTURA DE RESPUESTA:
Cada recomendación debe incluir:
- id: identificador único (ej: "global-ocupacion-critica", "provider-ticketmaster-critico")
- title: título conciso que describe el problema o oportunidad
- description: 
  * Empieza con emoji apropiado (⚠️ para crítico, 📊 para datos, ✅ para éxito, 💡 para sugerencia)
  * Incluye DATOS ESPECÍFICOS del evento (porcentajes, números, ingresos)
  * Formato: "Situación actual + Datos + Acción sugerida"
  * Usa saltos de línea (\\n\\n) para separar secciones
  * Ejemplo: "⚠️ Ocupación crítica: 45.2%\\n\\n📊 Vendidas: 28,000 / 62,000 entradas\\n💰 Ingresos: 2,450,000 €\\n\\n🎯 Acción sugerida: Lanzar campaña urgente..."
- priority: "high", "medium" o "low" según las reglas arriba
- category: "marketing", "pricing" o "alert"
- scope: "global", "provider", "zone", "ageSegment", "channel"
- targetKey: nombre exacto si scope no es global (ej: "Ticketmaster", "VIP", "25-34")

IMPORTANTE:
- Genera TODAS las recomendaciones que apliquen según las reglas
- NO inventes datos, usa SOLO los datos proporcionados en eventContext
- Para ticketeras, MENCIONA TODAS las que existen (Ticketmaster, Entradas.com, Bclever, Forvenues) con sus datos reales
- Si una ticketera tiene 0 vendidas, es CRÍTICO y debe aparecer
- Usa números con formato español (separadores de miles con punto o coma)
- Emojis: ⚠️ 📊 💰 🎯 ✅ 💡 📈 📉

Genera entre 4-8 recomendaciones basadas estrictamente en las reglas de prioridad.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analiza estos datos y genera recomendaciones siguiendo ESTRICTAMENTE las reglas de prioridad definidas.` 
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_recommendations',
              description: 'Generate actionable recommendations based on event data',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                        category: { type: 'string', enum: ['marketing', 'pricing', 'alert'] },
                        scope: { type: 'string', enum: ['global', 'provider', 'channel', 'zone', 'ageSegment', 'city'] },
                        targetKey: { type: 'string' },
                      },
                      required: ['id', 'title', 'description', 'priority', 'category', 'scope'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['recommendations'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'generate_recommendations' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const aiResponse = await response.json();
    console.log('AI Response:', JSON.stringify(aiResponse, null, 2));

    // Extract recommendations from tool call
    const toolCall = aiResponse.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const recommendations = JSON.parse(toolCall.function.arguments).recommendations;

    return new Response(
      JSON.stringify({ 
        recommendations,
        eventContext,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in event-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});