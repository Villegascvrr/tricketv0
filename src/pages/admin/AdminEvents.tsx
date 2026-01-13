import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search, Trash2, Edit, Eye, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";

interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  start_date: string;
  end_date: string;
  total_capacity: number | null;
  owner_id: string | null;
  created_at: string;
  owner_email?: string;
  ticket_count?: number;
}

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);

  // Fetch all events with owner info and ticket count
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch owner emails and ticket counts
      const eventsWithInfo = await Promise.all(
        (eventsData || []).map(async (event) => {
          let ownerEmail = null;
          if (event.owner_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("email")
              .eq("id", event.owner_id)
              .single();
            ownerEmail = profile?.email;
          }

          const { count: ticketCount } = await supabase
            .from("tickets")
            .select("id", { count: "exact", head: true })
            .eq("event_id", event.id);

          return {
            ...event,
            owner_email: ownerEmail,
            ticket_count: ticketCount || 0,
          };
        })
      );

      return eventsWithInfo as Event[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (event: Event) => {
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) throw error;
      return event;
    },
    onSuccess: (deletedEvent) => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Evento eliminado correctamente");
      logAction({
        action: "delete",
        entity_type: "event",
        entity_id: deletedEvent.id,
        old_value: { name: deletedEvent.name, venue: deletedEvent.venue, type: deletedEvent.type },
      });
      setDeleteEvent(null);
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar: " + error.message);
    },
  });

  const filteredEvents = events?.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.owner_email?.toLowerCase().includes(search.toLowerCase())
  );

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (now < start) return { label: "Próximo", variant: "secondary" as const };
    if (now >= start && now <= end) return { label: "En curso", variant: "default" as const };
    return { label: "Finalizado", variant: "outline" as const };
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Eventos</h1>
        <p className="text-muted-foreground">
          Administra todos los eventos de la plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Todos los Eventos
              </CardTitle>
              <CardDescription>
                {events?.length || 0} eventos registrados
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents?.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>
                        {format(new Date(event.start_date), "d MMM", { locale: es })} -{" "}
                        {format(new Date(event.end_date), "d MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {event.owner_email || (
                          <span className="text-muted-foreground">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>{event.ticket_count?.toLocaleString("es-ES")}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteEvent(event)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredEvents?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron eventos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>Detalles del evento</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{selectedEvent.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{selectedEvent.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fechas</p>
                  <p className="font-medium">
                    {format(new Date(selectedEvent.start_date), "d MMM yyyy", { locale: es })} -{" "}
                    {format(new Date(selectedEvent.end_date), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium">
                    {selectedEvent.total_capacity?.toLocaleString("es-ES") || "No definida"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">{selectedEvent.owner_email || "Sin asignar"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tickets vendidos</p>
                  <p className="font-medium">{selectedEvent.ticket_count?.toLocaleString("es-ES")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEvent} onOpenChange={() => setDeleteEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente "{deleteEvent?.name}" y todos sus datos
              asociados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEvent && deleteMutation.mutate(deleteEvent)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
