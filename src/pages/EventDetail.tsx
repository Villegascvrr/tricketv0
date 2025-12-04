import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Brain, MessageCircle, Sparkles } from "lucide-react";
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
import { festivalData } from "@/data/festivalData";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";


interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  start_date: string;
  end_date: string;
  total_capacity: number | null;
  isDemo?: boolean;
}

// Demo event from festivalData
const DEMO_EVENT: Event = {
  id: "demo-primaverando-2025",
  name: festivalData.nombre,
  type: "Festival",
  venue: festivalData.ubicacion,
  start_date: "2025-03-29",
  end_date: "2025-03-29",
  total_capacity: festivalData.aforoTotal,
  isDemo: true,
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Detect demo mode synchronously from URL to prevent race conditions
  const isDemo = id?.startsWith("demo-") ?? false;

  // Generate local recommendations for demo mode
  const localRecommendations = generateAIRecommendations();

  // Fetch AI recommendations (only for non-demo events)
  const { data: aiData, isLoading: aiLoading, refetch: refetchRecommendations } = useQuery({
    queryKey: ['event-recommendations', id],
    queryFn: async () => {
      if (!id || isDemo) return null;
      const { data, error } = await supabase.functions.invoke('event-recommendations', {
        body: { eventId: id }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !isDemo,
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
  });

  // Use local recommendations for demo, API recommendations for real events
  const recommendations = isDemo 
    ? localRecommendations 
    : (aiData?.recommendations || []);
  const criticalCount = recommendations.filter((r: any) => r.priority === 'high').length;

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;

    // Check if this is a demo event
    if (isDemo) {
      setEvent(DEMO_EVENT);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setEvent(data);
      } else {
        // Event not found - redirect to demo
        navigate("/events/demo-primaverando-2025");
        return;
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      // On error, redirect to demo event
      navigate("/events/demo-primaverando-2025");
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
      {/* Hero Header with Festival Image */}
      {isDemo && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 gradient-festival opacity-30" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-8 pb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/events")}
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Volver a eventos
            </Button>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground drop-shadow-sm">
                    {event.name}
                  </h1>
                  <span className="text-xs font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-full shadow-md">
                    {event.type}
                  </span>
                  <span className="text-xs font-medium px-3 py-1 bg-accent text-accent-foreground rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Demo
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-foreground/80">
                  <span className="font-medium">{event.venue}</span>
                  <span>
                    {format(new Date(event.start_date), "d MMM yyyy", { locale: es })}
                  </span>
                  {event.total_capacity && (
                    <span>Aforo: {event.total_capacity.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setChatOpen(true)}
                  size="sm"
                  className="h-9 px-4 gap-2 rounded-full text-sm font-medium bg-card text-foreground hover:bg-card/90 shadow-lg transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat IA
                </Button>
                <Button 
                  onClick={() => setDrawerOpen(true)}
                  size="sm"
                  className="h-9 px-4 gap-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg transition-all"
                >
                  <Brain className="h-4 w-4" />
                  {recommendations.length} Recomendaciones
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs font-semibold rounded-full ml-1">
                      {criticalCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Header for non-demo events */}
      {!isDemo && (
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

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
                <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {event.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setChatOpen(true)}
                  size="sm"
                  className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat con IA
                </Button>
                <Button 
                  onClick={() => setDrawerOpen(true)}
                  size="sm"
                  className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium relative"
                >
                  <Brain className="h-3.5 w-3.5" />
                  IA: {recommendations.length} recomendaciones
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs font-semibold rounded-full">
                      {criticalCount} críticas
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{event.venue}</span>
                <span>
                  {format(new Date(event.start_date), "d MMM yyyy", { locale: es })}
                  {event.start_date !== event.end_date &&
                    ` - ${format(new Date(event.end_date), "d MMM yyyy", { locale: es })}`}
                </span>
                {event.total_capacity && (
                  <span>Aforo: {event.total_capacity.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TicketProviderManager eventId={event.id} totalCapacity={event.total_capacity} />
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Importar Datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary actions bar for demo */}
      {isDemo && (
        <div className="border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-8 py-3 flex justify-end gap-2">
            <TicketProviderManager eventId={event.id} totalCapacity={event.total_capacity} />
            <Button 
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium"
            >
              <Upload className="h-3.5 w-3.5" />
              Importar Datos
            </Button>
          </div>
        </div>
      )}

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
        isDemo={isDemo}
      />
    </div>
  );
};

export default EventDetail;
