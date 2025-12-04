import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Contexto rico del festival Primaverando
const PRIMAVERANDO_CONTEXT = `
## CONTEXTO FESTIVAL PRIMAVERANDO

### Identidad
- **Festival universitario más grande de Andalucía**
- Celebrado anualmente desde 2019 en Sevilla
- Organizado por FESTIVALES OCIO JOVEN S.L.
- Slogan: "La mayor fiesta de Andalucía"

### Historia y Origen
- Fundado en 2019 por Manuel Vega, Manuel Castilla y Sergio de la Puente
- Nació como alternativa legal a las fiestas universitarias ilegales del Charco de la Pava
- Los fundadores son empresarios del sector hostelería sevillano
- Filosofía: Crear eventos con seguridad, producción profesional y artistas en directo

### Ediciones
- 2019: 1ª edición en Auditorio Rocío Jurado
- 2022: 2ª edición en Estadio La Cartuja
- 2023: 3ª edición en Estadio La Cartuja
- 2024: 4ª edición con 15.000 asistentes, 75% ocupación
- 2025: 5ª edición el 29 de marzo en Live Sur Stadium

### Público Objetivo
- Estudiantes universitarios (20-30 años)
- Principalmente de Sevilla y Andalucía
- Demanda inelástica impulsada por FOMO y socialización post-pandémica
- 72% tienen teléfono registrado, 58% consentimiento marketing
- Alta rotación de clientes (churn rate): depende de nuevas cohortes universitarias cada año

### Artistas 2025
Villalobos, Henry Méndez, Q2, Alvama Ice, Danny Romero, Lucho RK, Barce

### Géneros Musicales
Música Urbana/Trap, Reggaetón, Pop Comercial, Electrónica/DJ sets, Flamenquito (fusión)

### Precios 2025
- Anticipada (Early Bird): 15-20€ (blind tickets, venta a ciegas)
- General: 24€ + gastos
- VIP: 36,30€
- Sistema de tramos: precio sube hasta 300% del inicial en fase final

### Logística
- Ubicación: Live Sur Stadium, Estadio La Cartuja
- Capacidad: 20.000 personas
- Horario: 19:00 - 02:00 (7-8 horas)
- Acceso: Metro, bus TUSSAM (C1, C2), Cercanías (C-2, C-5)
- Parking: Cartuja 93 (840 plazas)

### Canales de Venta
Fever, El Corte Inglés, Bclever, Tiqets, Web Oficial

### Competidores en Sevilla
- Icónica Santalucía Fest (Plaza de España, mayo-julio)
- Puro Latino Fest (La Cartuja, julio)
- Interestelar (CAAC, mayo)
- Bienvenida Fest (su festival hermano en octubre)

---

## PROBLEMÁTICA OPERATIVA HISTÓRICA

### 1. Colapso Sistemático de Accesos (Punto Crítico Cero)
- Tiempos de espera de 90-180 minutos en horas punta
- Validación de entradas, seguridad y canje de pulseras en único cuello de botella
- Causas: Fallo tecnológico en PDAs, registro intrusivo unidireccional, canje manual de pulseras
- Consecuencias: Lipotimias y deshidratación antes de acceder, acumulación estática de masas

### 2. Crisis Hidráulica (Escasez Artificial)
- Denuncias de FACUA por prácticas de escasez artificial
- Grifos de baños inhabilitados para forzar compra de agua embotellada
- Roturas de stock de agua en horas pico
- Riesgo de golpes de calor

### 3. Infraestructuras Sanitarias
- Ratio asistentes/inodoro en límite legal mínimo, muy por debajo de estándares de confort
- Falta de equipos de limpieza itinerantes
- Inodoros inutilizables a mitad del evento por acumulación de residuos

### 4. Deficiencias Acústicas
- Solapamiento de frecuencias entre escenarios (sound bleed)
- Zonas muertas (sonido inaudible) y zonas calientes (presión sonora excesiva)
- Mala calibración de arrays de altavoces

---

## ESTRATEGIA COMERCIAL (YIELD MANAGEMENT)

### Fases de Precio (Pricing Dinámico)
1. **Early Bird (Blind Tickets)**: 15-20€ - Genera hype ("Agotado en 10 minutos"), capitalización temprana
2. **Fase 1-2**: Escalada por anclaje cognitivo
3. **Fase Final/Taquilla**: Hasta 300% del precio inicial

### Costes Ocultos (Drip Pricing)
- Gastos de gestión: 10-15% sobre precio base
- Re-nominación: 10-20€ por cambio de nombre
- Seguro de no asistencia: Cláusulas de exclusión muy estrictas

### Sistema Cashless (Retención de Capital)
- Pulseras RFID obligatorias
- Flotante financiero a coste cero para la organización
- Breakage: Ingresos por saldo no reclamado
- Ventanas de devolución restrictivas (3-5 días)
- Comisiones de reembolso que anulan pequeños saldos

---

## HISTORIAL DE INCIDENTES

| Año | Problema | Respuesta | Resultado |
|-----|----------|-----------|-----------|
| 2019 | Colapso accesos (>2h espera) | Sin comunicación oficial | Cientos de reclamaciones |
| 2022 | Fallo Cashless + Falta de agua | "Incidencia técnica puntual" | Usuarios sin bebida durante horas |
| 2023 | Cancelación artista principal | Sustituto menor + negativa devoluciones | Denuncias Consumo, daño reputacional |

---

## RIESGOS Y RECOMENDACIONES

### Riesgos Identificados
- Expedientes sancionadores acumulados (Ayuntamiento Sevilla, Junta de Andalucía)
- Erosión de lealtad de marca por alta rotación de clientes
- Activismo de consumidores organizados documentando fallos
- Posibles inhabilitaciones de licencias

### Recomendaciones Estratégicas
1. Dimensionar accesos, barras y baños para aforo real (no mínimo legal)
2. Eliminar tasas ocultas y simplificar estructura de precios
3. Formar personal en atención al cliente y desescalada
4. Implementar múltiples perímetros de seguridad escalonados
5. Garantizar acceso a agua potable gratuita
6. Aumentar ratio de inodoros al estándar de confort de la industria

### Para Comunicar a Consumidores
- Evitar fases de precios inflados
- Leer letra pequeña de condiciones de devolución
- Documentar incidencias in situ para reclamaciones
- Conocer derechos según Ley de Espectáculos Públicos
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, messages, localContext } = await req.json();
    
    if (!eventId || !messages || !Array.isArray(messages)) {
      throw new Error('Event ID and messages array are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if this is demo mode (local context provided)
    const isDemoMode = eventId.startsWith('demo-') || !!localContext;
    
    let event: any = null;
    let tickets: any[] = [];
    let allocations: any[] = [];
    let zones: any[] = [];

    if (!isDemoMode) {
      // Fetch real event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');
      
      event = eventData;

      // Fetch tickets data
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);

      if (ticketsError) throw ticketsError;
      tickets = ticketsData || [];

      // Fetch provider allocations
      const { data: allocationsData } = await supabase
        .from('ticket_provider_allocations')
        .select('*')
        .eq('event_id', eventId);
      allocations = allocationsData || [];

      // Fetch zones
      const { data: zonesData } = await supabase
        .from('zones')
        .select('*')
        .eq('event_id', eventId);
      zones = zonesData || [];
    } else {
      // Demo mode - use hardcoded Primaverando data
      event = {
        name: 'Primaverando Festival 2025',
        type: 'Festival',
        venue: 'Live Sur Stadium, Estadio La Cartuja, Sevilla',
        total_capacity: 20000,
        start_date: '2025-03-29',
        end_date: '2025-03-29',
      };
    }

    // For demo mode, use localContext directly
    let eventContext: any;
    
    if (isDemoMode && localContext) {
      // Use the rich context provided from the client
      eventContext = {
        event: {
          name: event.name,
          type: event.type,
          venue: event.venue,
          capacity: event.total_capacity,
          startDate: event.start_date,
          endDate: event.end_date,
        },
        localContext: localContext, // Rich Primaverando data
      };
    } else {
      // Calculate metrics from database data
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
          else if (ticket.buyer_age < 22) range = '18-21';
          else if (ticket.buyer_age < 26) range = '22-25';
          else if (ticket.buyer_age < 31) range = '26-30';
          else range = '31+';
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
      eventContext = {
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
    }

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Event context:', isDemoMode ? 'Demo mode with local context' : 'Real data mode');
    console.log('Event name:', event.name);

    const systemPrompt = `Eres un analista senior especializado en festivales universitarios y ticketing de eventos musicales. Tienes acceso a datos en tiempo real del evento "${event.name}".

${PRIMAVERANDO_CONTEXT}

## DATOS EN TIEMPO REAL DEL EVENTO
${JSON.stringify(eventContext, null, 2)}

## PERSONALIDAD Y TONO
- Eres un experto en el sector de festivales españoles
- Conoces profundamente a Primaverando y su historia
- Hablas con confianza sobre el público universitario andaluz
- Puedes comparar con otros festivales y dar contexto del mercado
- Eres directo y práctico en tus recomendaciones

## FORMATO DE RESPUESTA

**📊 Análisis**
[2-3 frases con el insight principal. Contextualiza con lo que sabes del festival y su público]

**📈 Métricas Clave**
• [Métrica 1]: **[valor]** — [interpretación específica para Primaverando]
• [Métrica 2]: **[valor]** — [comparación o contexto]
• [Métrica 3]: **[valor]** — [implicación práctica]

**🎯 Recomendaciones Estratégicas**
1. **[Título corto]**: [Acción específica considerando el público universitario, canales de venta, o artistas]
2. **[Título corto]**: [Segunda recomendación]
3. **[Título corto]**: [Tercera recomendación si aplica]

**💡 Contexto del Mercado**
[Insight sobre cómo se compara con otros festivales, tendencias del sector, o historial de Primaverando]

## REGLAS
1. USA SOLO DATOS REALES del contexto. Nunca inventes números.
2. Si no hay datos, di "Sin datos disponibles para [X]"
3. Formato español: 14.850 entradas, 371.250,00 €, 74,3%
4. Recomendaciones deben nombrar canales específicos (Fever, Bclever, etc.)
5. Menciona zonas específicas (Pista General, VIP, Grada) cuando sea relevante
6. Si ocupación <70%, es alerta. Si proveedor <50% de capacidad, es crítico.
7. Contextualiza con el público universitario (18-30 años, Andalucía)
8. Puedes mencionar artistas del cartel, competidores, o historial cuando sea relevante

## COMANDOS DISPONIBLES
/ventas - Análisis completo de ventas
/canales - Rendimiento por canal de venta
/ticketeras - Análisis por proveedor (Fever, Bclever, etc.)
/zonas - Ocupación y revenue por zona
/demografia - Perfil de compradores
/proyecciones - Estimaciones de cierre
/competencia - Comparativa con otros festivales sevillanos`;

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
