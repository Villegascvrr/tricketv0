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
    const { data: allocations, error: allocationsError } = await supabase
      .from('ticket_provider_allocations')
      .select('*')
      .eq('event_id', eventId);

    if (allocationsError) throw allocationsError;

    // Calculate metrics
    const totalTicketsSold = tickets.length;
    const totalRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
    const avgPrice = totalRevenue / (totalTicketsSold || 1);

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

    // Contact data
    const contactStats = {
      withEmail: tickets.filter(t => t.has_email).length,
      withPhone: tickets.filter(t => t.has_phone).length,
      withMarketing: tickets.filter(t => t.marketing_consent).length,
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
        totalTickets: totalTicketsSold,
        totalRevenue,
        avgPrice,
        occupancyRate: ((totalTicketsSold / (event.total_capacity || 1)) * 100).toFixed(1),
      },
      channels: Object.entries(channelStats).map(([name, stats]) => ({
        name,
        tickets: (stats as { count: number; revenue: number }).count,
        revenue: (stats as { count: number; revenue: number }).revenue,
        percentage: (((stats as { count: number; revenue: number }).count / totalTicketsSold) * 100).toFixed(1),
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
          percentage: (((count as number) / totalTicketsSold) * 100).toFixed(1),
        })),
      demographics: {
        ageRanges: Object.entries(ageRanges).map(([range, count]) => ({
          range,
          count,
          percentage: (((count as number) / totalTicketsSold) * 100).toFixed(1),
        })),
        contactData: {
          emailRate: ((contactStats.withEmail / totalTicketsSold) * 100).toFixed(1),
          phoneRate: ((contactStats.withPhone / totalTicketsSold) * 100).toFixed(1),
          marketingRate: ((contactStats.withMarketing / totalTicketsSold) * 100).toFixed(1),
        },
      },
    };

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto analista de eventos y marketing digital. 
Tu tarea es analizar datos de ventas de entradas y proporcionar recomendaciones estratégicas accionables.
Genera exactamente 6 recomendaciones categorizadas así:
- 2 recomendaciones de MARKETING (category: "marketing")
- 2 recomendaciones de PRICING (category: "pricing")  
- 2 ALERTAS/OPORTUNIDADES (category: "alert")

Cada recomendación debe tener:
- title: título conciso (máximo 60 caracteres)
- description: descripción detallada con datos específicos (100-150 palabras)
- priority: "high", "medium", o "low"
- category: "marketing", "pricing", o "alert"

Basa las recomendaciones en los datos reales proporcionados. Sé específico con números y porcentajes.`;

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
            content: `Analiza estos datos del evento y genera recomendaciones:\n\n${JSON.stringify(eventContext, null, 2)}` 
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
                        title: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                        category: { type: 'string', enum: ['marketing', 'pricing', 'alert'] },
                      },
                      required: ['title', 'description', 'priority', 'category'],
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