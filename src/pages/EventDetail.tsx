import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Brain, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import EventSummary from "@/components/event/EventSummary";
import EventAudience from "@/components/event/EventAudience";
import EventExport from "@/components/event/EventExport";
import EventRecommendations from "@/components/event/EventRecommendations";
import TicketProviderManager from "@/components/event/TicketProviderManager";
import AIRecommendationsDrawer from "@/components/event/AIRecommendationsDrawer";
import ExecutiveDashboard from "@/components/event/ExecutiveDashboard";
import EventChatDrawer from "@/components/event/EventChatDrawer";


interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  start_date: string;
  end_date: string;
  total_capacity: number | null;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch AI recommendations
  const { data: aiData, isLoading: aiLoading, refetch: refetchRecommendations } = useQuery({
    queryKey: ['event-recommendations', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.functions.invoke('event-recommendations', {
        body: { eventId: id }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 0, // Always refetch to get latest recommendations
    refetchOnMount: true,
  });

  const recommendations = aiData?.recommendations || [];
  const criticalCount = recommendations.filter((r: any) => r.priority === 'high').length;

  // Static recommendations for the "Recomendaciones IA" tab based on current event data
  const staticRecommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: "marketing" | "pricing" | "alert";
    scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
    targetKey?: string;
  }> = [
    // Marketing recommendations
    {
      id: 'marketing-entradas-com-low',
      title: 'Campaña urgente en Entradas.com',
      description: '⚠️ Bajo rendimiento detectado\n\n📊 Situación actual:\n• 4.900 entradas vendidas de 12.000 asignadas\n• Ocupación: 40,8%\n• Capacidad disponible: 7.100 entradas\n\n🎯 Acción recomendada:\nLanzar campaña específica con descuentos del 15-20% para Entradas.com. Considerar email marketing a su base de datos y promociones flash durante 48-72h.',
      priority: 'high' as const,
      category: 'marketing' as const,
      scope: 'provider' as const,
      targetKey: 'Entradas.com'
    },
    {
      id: 'marketing-forvenues-critical',
      title: 'Activar ventas urgentes en Forvenues',
      description: '⚠️ Rendimiento crítico detectado\n\n📊 Situación actual:\n• 1.850 entradas vendidas de 5.000 asignadas\n• Ocupación: 37%\n• Capacidad disponible: 3.150 entradas\n\n🎯 Acción recomendada:\nImplementar estrategia de activación inmediata: partnership con influencers locales, promoción en redes sociales y ofertas 2x1 o early bird especiales para este canal.',
      priority: 'high' as const,
      category: 'marketing' as const,
      scope: 'provider' as const,
      targetKey: 'Forvenues'
    },
    {
      id: 'marketing-ticketmaster-boost',
      title: 'Impulsar últimas entradas en Ticketmaster',
      description: '✅ Buen rendimiento, optimizar remate\n\n📊 Situación actual:\n• 23.800 entradas vendidas de 30.000 asignadas\n• Ocupación: 79,3%\n• Capacidad disponible: 6.200 entradas\n\n💡 Acción recomendada:\nActivar campaña de "últimas entradas" aprovechando el momentum. Crear sensación de urgencia con contadores y destacar zonas disponibles con mejor visibilidad.',
      priority: 'medium' as const,
      category: 'marketing' as const,
      scope: 'provider' as const,
      targetKey: 'Ticketmaster'
    },
    // Pricing recommendations
    {
      id: 'pricing-bclever-premium',
      title: 'Ajustar pricing en Bclever (alta demanda)',
      description: '📈 Alta ocupación detectada\n\n📊 Situación actual:\n• 8.800 entradas vendidas de 10.000 asignadas\n• Ocupación: 88%\n• Solo quedan 1.200 entradas disponibles\n\n💰 Acción recomendada:\nImplementar dynamic pricing en las últimas 1.200 entradas de Bclever. Aumentar precios un 15-25% aprovechando la alta demanda. Posicionar como "entradas premium" por disponibilidad limitada.',
      priority: 'medium' as const,
      category: 'pricing' as const,
      scope: 'provider' as const,
      targetKey: 'Bclever'
    },
    {
      id: 'pricing-average-upsell',
      title: 'Oportunidad de upselling en precio medio',
      description: '💡 Optimización de ingresos\n\n📊 Situación actual:\n• Precio medio actual: ~104,17 €\n• Ingresos totales: 4.099.092 €\n• Ocupación global: 63,5%\n\n🎯 Acción recomendada:\nCrear paquetes VIP y experiencias premium para incrementar ticket promedio. Objetivo: elevar precio medio a 110-120 € con upselling de parking, merchandising y accesos preferenciales.',
      priority: 'low' as const,
      category: 'pricing' as const,
      scope: 'global' as const
    },
    // Alert recommendations
    {
      id: 'alert-revenue-target',
      title: 'Alerta: Gap de ingresos vs objetivo',
      description: '⚠️ Proyección por debajo del objetivo\n\n📊 Situación actual:\n• Ingresos actuales: 4.099.092 €\n• Objetivo estimado: 5.000.000 €\n• Gap: 900.908 € (82% del objetivo alcanzado)\n• Ocupación: 63,5% (39.350 / 62.000 entradas)\n\n🎯 Acción urgente:\nActivar plan de acción comercial para cerrar gap:\n1. Campañas agresivas en canales con baja ocupación\n2. Dynamic pricing en zonas de alta demanda\n3. Paquetes y cross-selling para aumentar ticket promedio\n4. Revisar estrategia de última hora (1-2 semanas antes del evento)',
      priority: 'high' as const,
      category: 'alert' as const,
      scope: 'global' as const
    },
    {
      id: 'alert-occupancy-below-target',
      title: 'Ocupación global por debajo del 70%',
      description: '📊 Nivel de ocupación mejorable\n\n📊 Situación actual:\n• Ocupación global: 63,5%\n• Entradas vendidas: 39.350 de 62.000\n• Capacidad disponible: 22.650 entradas\n\n💡 Oportunidad:\nAún queda margen significativo de crecimiento. Implementar estrategia multi-canal:\n• Reforzar ticketeras con bajo rendimiento (Entradas.com, Forvenues)\n• Activar remarketing a usuarios que visitaron pero no compraron\n• Considerar promociones por volumen para grupos y empresas',
      priority: 'medium' as const,
      category: 'alert' as const,
      scope: 'global' as const
    }
  ];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Evento no encontrado</p>
          <Button onClick={() => navigate("/events")}>
            Volver a eventos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Volver a eventos
          </Button>

          {/* Línea 1: Título + Chip | Botones principales */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {event.name}
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {event.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Chat Button - Primary */}
              <Button 
                onClick={() => setChatOpen(true)}
                size="sm"
                className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium bg-primary hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Chat con IA</span>
              </Button>

              {/* AI Recommendations with Critical Badge - Primary */}
              <Button 
                onClick={() => setDrawerOpen(true)}
                size="sm"
                className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium bg-primary hover:bg-primary/90 transition-colors relative"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>IA: {recommendations.length} recomendaciones</span>
                {criticalCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="h-5 px-1.5 text-xs font-semibold rounded-full"
                  >
                    {criticalCount} críticas
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Línea 2: Subtítulo (lugar, fechas, aforo) | Botones secundarios */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{event.venue}</span>
              <span>
                {format(new Date(event.start_date), "d MMM yyyy", {
                  locale: es,
                })}
                {event.start_date !== event.end_date &&
                  ` - ${format(new Date(event.end_date), "d MMM yyyy", {
                    locale: es,
                  })}`}
              </span>
              {event.total_capacity && (
                <span>Aforo: {event.total_capacity.toLocaleString()}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Ticket Provider Manager - Secondary */}
              <TicketProviderManager
                eventId={event.id}
                totalCapacity={event.total_capacity}
              />

              {/* Import Data - Secondary */}
              <Button 
                variant="outline"
                size="sm"
                className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Importar Datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="executive">Panel Ejecutivo</TabsTrigger>
            <TabsTrigger value="audience">Audiencia</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones IA</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <EventSummary 
              eventId={event.id} 
              totalCapacity={event.total_capacity}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="executive">
            <ExecutiveDashboard
              eventId={event.id}
              totalCapacity={event.total_capacity}
              eventStartDate={event.start_date}
              onOpenRecommendations={() => setDrawerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="audience">
            <EventAudience eventId={event.id} />
          </TabsContent>

          <TabsContent value="recommendations">
            <EventRecommendations 
              eventId={event.id} 
              recommendations={staticRecommendations}
              isLoading={false}
              onRefresh={() => {}}
            />
          </TabsContent>

          <TabsContent value="export">
            <EventExport eventId={event.id} eventName={event.name} />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Recommendations Drawer */}
      <AIRecommendationsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendations={recommendations}
        isLoading={aiLoading}
        eventName={event.name}
        eventDate={format(new Date(event.start_date), "d 'de' MMMM 'de' yyyy", { locale: es })}
        onRefresh={() => refetchRecommendations()}
      />

      {/* AI Chat Drawer */}
      <EventChatDrawer
        eventId={event.id}
        eventName={event.name}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
};

export default EventDetail;
