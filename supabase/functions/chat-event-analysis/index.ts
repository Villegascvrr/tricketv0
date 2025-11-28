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
    const { eventId, messages } = await req.json();
    
    if (!eventId || !messages || !Array.isArray(messages)) {
      throw new Error('Event ID and messages array are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch event data for context
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;

    // Fetch tickets data
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('event_id', eventId);

    if (ticketsError) throw ticketsError;

    // Fetch provider allocations
    const { data: allocations } = await supabase
      .from('ticket_provider_allocations')
      .select('*')
      .eq('event_id', eventId);

    // Fetch zones
    const { data: zones } = await supabase
      .from('zones')
      .select('*')
      .eq('event_id', eventId);

    // Calculate metrics
    const totalTicketsSold = tickets.length;
    const totalRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
    const avgPrice = totalRevenue / (totalTicketsSold || 1);
    const occupancyRate = event.total_capacity 
      ? ((totalTicketsSold / event.total_capacity) * 100).toFixed(1)
      : 'N/A';

    // Sales by channel
    const channelStats = tickets.reduce((acc, ticket) => {
      const channel = ticket.channel || 'Unknown';
      if (!acc[channel]) {
        acc[channel] = { count: 0, revenue: 0 };
      }
      acc[channel].count++;
      acc[channel].revenue += ticket.price || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Sales by provider
    const providerStats = tickets.reduce((acc, ticket) => {
      const provider = ticket.provider_name || 'Unknown';
      if (!acc[provider]) {
        acc[provider] = { count: 0, revenue: 0, allocated: 0 };
      }
      acc[provider].count++;
      acc[provider].revenue += ticket.price || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; allocated: number }>);

    // Add allocation data
    allocations?.forEach(alloc => {
      if (providerStats[alloc.provider_name]) {
        providerStats[alloc.provider_name].allocated = alloc.allocated_capacity;
      }
    });

    // Geographic distribution
    const provinceStats = tickets.reduce((acc, ticket) => {
      const province = ticket.buyer_province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Age distribution
    const ageRanges = tickets.reduce((acc, ticket) => {
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

    // Zone stats
    const zoneStats = tickets.reduce((acc, ticket) => {
      const zone = ticket.zone_name || 'Unknown';
      if (!acc[zone]) {
        acc[zone] = { count: 0, revenue: 0 };
      }
      acc[zone].count++;
      acc[zone].revenue += ticket.price || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Prepare context
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
        totalTickets: totalTicketsSold,
        totalRevenue: totalRevenue.toFixed(2),
        avgPrice: avgPrice.toFixed(2),
        occupancyRate,
      },
      channels: Object.entries(channelStats).map(([name, stats]) => ({
        name,
        tickets: (stats as { count: number; revenue: number }).count,
        revenue: (stats as { count: number; revenue: number }).revenue.toFixed(2),
        percentage: (((stats as { count: number; revenue: number }).count / totalTicketsSold) * 100).toFixed(1),
      })),
      providers: Object.entries(providerStats).map(([name, stats]) => ({
        name,
        tickets: (stats as { count: number; revenue: number; allocated: number }).count,
        revenue: (stats as { count: number; revenue: number; allocated: number }).revenue.toFixed(2),
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
          percentage: (((count as number) / totalTicketsSold) * 100).toFixed(1),
        })),
      demographics: {
        ageRanges: Object.entries(ageRanges).map(([range, count]) => ({
          range,
          count,
          percentage: (((count as number) / totalTicketsSold) * 100).toFixed(1),
        })),
      },
      zones: Object.entries(zoneStats).map(([name, stats]) => {
        const zoneInfo = zones?.find(z => z.name === name);
        return {
          name,
          tickets: (stats as { count: number; revenue: number }).count,
          revenue: (stats as { count: number; revenue: number }).revenue.toFixed(2),
          capacity: zoneInfo?.capacity || null,
          occupancyRate: zoneInfo?.capacity 
            ? (((stats as { count: number; revenue: number }).count / zoneInfo.capacity) * 100).toFixed(1)
            : null,
        };
      }),
    };

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un analista experto de eventos y ticketing con acceso a datos en tiempo real del evento "${event.name}".

IMPORTANTE: Respondes SOLO en español, de forma clara y profesional.

Tu misión es responder preguntas específicas sobre los datos del evento, proporcionar insights accionables y ayudar en la toma de decisiones.

DATOS DEL EVENTO (actualizado en tiempo real):
${JSON.stringify(eventContext, null, 2)}

ESTRUCTURA OBLIGATORIA DE TODAS LAS RESPUESTAS:

1. **Resumen ejecutivo** (1-2 frases)
   Una conclusión directa de la situación general.

2. **KPIs clave** (bullets con datos reales)
   • Lista 3-5 métricas numéricas específicas del evento
   • Usa SIEMPRE los datos reales proporcionados arriba
   • Formato: "Métrica: valor (contexto adicional)"
   • Ejemplo: "• Entradas vendidas: 38.350 (76,7% de ocupación)"

3. **Acciones recomendadas** (3 bullets concretos)
   • Proporciona 3 recomendaciones accionables basadas en los datos
   • Usa verbos de acción: "Potencia...", "Ajusta...", "Redistribuye..."
   • Sé específico con números y canales cuando sea relevante

4. **Sugerencia de comando** (solo si aplica)
   Si la respuesta corresponde con alguno de estos comandos, termina con:
   "💡 Tip: También puedes usar el comando /[comando] para ver esta información de forma visual."
   
   Comandos disponibles: /ventas, /canales, /ticketeras, /demografia, /proyecciones, /zonas

PAUTAS CRÍTICAS:
- Cuando menciones ticketeras o proveedores, LISTA TODAS las que aparecen en los datos, aunque tengan 0 ventas
- NUNCA digas "solo hay datos de X" si en los datos hay más proveedores
- Si un dato específico no existe o está vacío, responde: "No tengo datos de [X] para este evento."
- Usa números con separadores de miles y símbolos de moneda (€)
- Usa emojis solo en el Resumen y en las recomendaciones (📊 📈 💰 🎯 ⚠️ ✅)
- Mantén las respuestas CONCISAS: máximo 4-5 párrafos incluyendo la estructura

Si la pregunta no se puede responder con los datos disponibles, indícalo claramente y sugiere qué información adicional sería útil.`;

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
          ...messages,
        ],
        stream: true,
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

    // Return the streaming response
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat-event-analysis:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});