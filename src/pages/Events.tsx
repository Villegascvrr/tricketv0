import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { format, isBefore, isAfter, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { festivalData } from "@/data/festivalData";

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
  isDemo?: boolean;
}

type EventFilter = "all" | "active" | "upcoming" | "finished";

// Demo event from festivalData
const DEMO_EVENT: Event = {
  id: "demo-primaverando-2025",
  name: festivalData.nombre,
  type: "Festival",
  venue: festivalData.ubicacion,
  start_date: "2025-03-29",
  end_date: "2025-03-29",
  total_capacity: festivalData.aforoTotal,
  tickets_count: festivalData.overview.entradasVendidas,
  isDemo: true,
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventFilter>("all");

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
            .maybeSingle();

          return {
            ...event,
            tickets_count: count || 0,
            last_import: lastImport?.imported_at,
          };
        })
      );

      // If no events, show demo event
      if (eventsWithCounts.length === 0) {
        setEvents([DEMO_EVENT]);
      } else {
        setEvents(eventsWithCounts);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // On error, show demo event
      setEvents([DEMO_EVENT]);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event: Event): "active" | "upcoming" | "finished" => {
    const today = startOfDay(new Date());
    const startDate = startOfDay(new Date(event.start_date));
    const endDate = startOfDay(new Date(event.end_date));

    if (isBefore(endDate, today)) {
      return "finished";
    } else if (isAfter(startDate, today)) {
      return "upcoming";
    } else {
      return "active";
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return getEventStatus(event) === filter;
  });

  const filterCounts = {
    all: events.length,
    active: events.filter((e) => getEventStatus(e) === "active").length,
    upcoming: events.filter((e) => getEventStatus(e) === "upcoming").length,
    finished: events.filter((e) => getEventStatus(e) === "finished").length,
  };

  const getStatusBadge = (status: "active" | "upcoming" | "finished") => {
    const styles = {
      active: "bg-success/10 text-success border-success/20",
      upcoming: "bg-primary/10 text-primary border-primary/20",
      finished: "bg-muted text-muted-foreground border-border",
    };

    const labels = {
      active: "Activo",
      upcoming: "Próximo",
      finished: "Finalizado",
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
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

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-colors",
              filter === "all" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setFilter("all")}
          >
            Todos ({filterCounts.all})
          </Badge>
          <Badge
            variant={filter === "active" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-colors",
              filter === "active" && "bg-success text-white"
            )}
            onClick={() => setFilter("active")}
          >
            Activos ({filterCounts.active})
          </Badge>
          <Badge
            variant={filter === "upcoming" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-colors",
              filter === "upcoming" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setFilter("upcoming")}
          >
            Próximos ({filterCounts.upcoming})
          </Badge>
          <Badge
            variant={filter === "finished" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-colors",
              filter === "finished" && "bg-muted text-foreground"
            )}
            onClick={() => setFilter("finished")}
          >
            Finalizados ({filterCounts.finished})
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {filter === "all"
                ? "No hay eventos todavía"
                : `No hay eventos ${
                    filter === "active"
                      ? "activos"
                      : filter === "upcoming"
                      ? "próximos"
                      : "finalizados"
                  }`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all"
                ? "Comienza creando tu primer evento"
                : "Intenta con otro filtro"}
            </p>
            {filter === "all" && (
              <Link to="/events/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Evento
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              return (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                          {event.type}
                        </span>
                        {getStatusBadge(status)}
                      </div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
