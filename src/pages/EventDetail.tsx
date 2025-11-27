import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EventSummary from "@/components/event/EventSummary";
import EventAudience from "@/components/event/EventAudience";
import EventExport from "@/components/event/EventExport";
import EventRecommendations from "@/components/event/EventRecommendations";

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

            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Importar Datos
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="audience">Audiencia</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <EventSummary eventId={event.id} totalCapacity={event.total_capacity} />
          </TabsContent>

          <TabsContent value="audience">
            <EventAudience eventId={event.id} />
          </TabsContent>

          <TabsContent value="export">
            <EventExport eventId={event.id} eventName={event.name} />
          </TabsContent>

          <TabsContent value="recommendations">
            <EventRecommendations eventId={event.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventDetail;
