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
        <div className="max-w-7xl mx-auto p-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a eventos
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {event.name}
                </h1>
                <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {event.type}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
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
            </div>

            <div className="flex flex-col gap-3">
              {/* First row - AI Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* AI Chat Button - Primary */}
                <Button 
                  onClick={() => setChatOpen(true)}
                  className="h-10 px-4 gap-2 rounded-full text-sm font-medium bg-primary hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat con IA</span>
                </Button>

                {/* AI Recommendations with Critical Badge - Primary */}
                <Button 
                  onClick={() => setDrawerOpen(true)}
                  className="h-10 px-4 gap-2 rounded-full text-sm font-medium bg-primary hover:bg-primary/90 transition-colors relative"
                >
                  <Brain className="h-4 w-4" />
                  <span>IA: {recommendations.length} recomendaciones</span>
                  {criticalCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="h-6 px-2 text-xs font-semibold rounded-full"
                    >
                      {criticalCount} críticas
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Second row - Management Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Ticket Provider Manager - Secondary */}
                <TicketProviderManager
                  eventId={event.id}
                  totalCapacity={event.total_capacity}
                />

                {/* Import Data - Secondary */}
                <Button 
                  variant="outline"
                  className="h-10 px-4 gap-2 rounded-full text-sm font-medium border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Importar Datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
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
              recommendations={recommendations}
              isLoading={aiLoading}
              onRefresh={() => refetchRecommendations()}
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
