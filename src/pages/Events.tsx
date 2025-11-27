import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  start_date: string;
  end_date: string;
  total_capacity: number | null;
  tickets_count?: number;
  last_import?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch ticket counts for each event
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count } = await supabase
            .from("tickets")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);

          const { data: lastImport } = await supabase
            .from("ticket_imports")
            .select("imported_at")
            .eq("event_id", event.id)
            .order("imported_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...event,
            tickets_count: count || 0,
            last_import: lastImport?.imported_at,
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mis Eventos
            </h1>
            <p className="text-muted-foreground">
              Gestiona y analiza tus eventos de ticketing
            </p>
          </div>
          <Link to="/events/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Evento
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No hay eventos todavía
            </h3>
            <p className="text-muted-foreground mb-6">
              Comienza creando tu primer evento
            </p>
            <Link to="/events/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {event.name}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(event.start_date), "d MMM yyyy", {
                          locale: es,
                        })}
                        {event.start_date !== event.end_date &&
                          ` - ${format(
                            new Date(event.end_date),
                            "d MMM yyyy",
                            { locale: es }
                          )}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Entradas cargadas
                      </span>
                      <span className="font-semibold text-foreground">
                        {event.tickets_count?.toLocaleString() || "0"}
                      </span>
                    </div>
                    {event.last_import && (
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">
                          Última importación
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(event.last_import),
                            "d MMM HH:mm",
                            { locale: es }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
