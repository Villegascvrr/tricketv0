import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TicketProviderAllocation {
  id: string;
  event_id: string;
  provider_name: string;
  allocated_capacity: number;
  notes: string | null;
}

interface TicketProviderManagerProps {
  eventId: string;
  totalCapacity: number | null;
}

const TicketProviderManager = ({
  eventId,
  totalCapacity,
}: TicketProviderManagerProps) => {
  const [allocations, setAllocations] = useState<TicketProviderAllocation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAllocations, setEditingAllocations] = useState<
    Partial<TicketProviderAllocation>[]
  >([]);

  useEffect(() => {
    fetchAllocations();
  }, [eventId]);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ticket_provider_allocations")
        .select("*")
        .eq("event_id", eventId)
        .order("provider_name");

      if (error) throw error;
      setAllocations(data || []);
    } catch (error) {
      console.error("Error fetching allocations:", error);
      toast.error("Error al cargar asignaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    setEditingAllocations([...allocations]);
    setIsEditing(true);
  };

  const handleAddRow = () => {
    setEditingAllocations([
      ...editingAllocations,
      {
        event_id: eventId,
        provider_name: "",
        allocated_capacity: 0,
        notes: "",
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newAllocations = [...editingAllocations];
    newAllocations.splice(index, 1);
    setEditingAllocations(newAllocations);
  };

  const handleUpdateRow = (
    index: number,
    field: keyof TicketProviderAllocation,
    value: any
  ) => {
    const newAllocations = [...editingAllocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setEditingAllocations(newAllocations);
  };

  const handleSave = async () => {
    try {
      // Validate
      const hasEmpty = editingAllocations.some(
        (a) => !a.provider_name || !a.allocated_capacity
      );
      if (hasEmpty) {
        toast.error("Completa todos los campos obligatorios");
        return;
      }

      // Delete all existing allocations for this event
      const { error: deleteError } = await supabase
        .from("ticket_provider_allocations")
        .delete()
        .eq("event_id", eventId);

      if (deleteError) throw deleteError;

      // Insert new allocations
      if (editingAllocations.length > 0) {
        const { error: insertError } = await supabase
          .from("ticket_provider_allocations")
          .insert(
            editingAllocations.map((a) => ({
              event_id: eventId,
              provider_name: a.provider_name,
              allocated_capacity: a.allocated_capacity,
              notes: a.notes || null,
            }))
          );

        if (insertError) throw insertError;
      }

      toast.success("Asignaciones guardadas correctamente");
      setIsEditing(false);
      await fetchAllocations();
    } catch (error) {
      console.error("Error saving allocations:", error);
      toast.error("Error al guardar asignaciones");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAllocations([]);
  };

  const totalAllocated = allocations.reduce(
    (sum, a) => sum + a.allocated_capacity,
    0
  );

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="h-10 px-4 rounded-full border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
        >
          Gestionar Ticketeras
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignación por Ticketera</DialogTitle>
          <DialogDescription>
            Define cuántas entradas puede vender cada ticketera/proveedor para
            este evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Aforo Total</p>
              <p className="text-2xl font-bold">
                {totalCapacity?.toLocaleString() || "N/D"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Asignado a Ticketeras
              </p>
              <p className="text-2xl font-bold">
                {totalAllocated.toLocaleString()}
              </p>
              {totalCapacity && totalAllocated > totalCapacity && (
                <p className="text-sm text-danger mt-1">
                  ⚠️ Supera el aforo total
                </p>
              )}
            </div>
          </div>

          {/* Edit mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Ticketera *</th>
                      <th className="text-left p-2">Capacidad *</th>
                      <th className="text-left p-2">Notas</th>
                      <th className="w-10 p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingAllocations.map((allocation, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">
                          <Input
                            value={allocation.provider_name || ""}
                            onChange={(e) =>
                              handleUpdateRow(
                                index,
                                "provider_name",
                                e.target.value
                              )
                            }
                            placeholder="Ej: Ticketmaster"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={allocation.allocated_capacity || ""}
                            onChange={(e) =>
                              handleUpdateRow(
                                index,
                                "allocated_capacity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={allocation.notes || ""}
                            onChange={(e) =>
                              handleUpdateRow(index, "notes", e.target.value)
                            }
                            placeholder="Notas opcionales"
                          />
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button variant="outline" onClick={handleAddRow} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Ticketera
              </Button>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="space-y-4">
              {allocations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No hay ticketeras asignadas todavía
                  </p>
                  <Button onClick={handleStartEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Ticketeras
                  </Button>
                </div>
              ) : (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Ticketera</th>
                          <th className="text-right p-3">Capacidad Asignada</th>
                          <th className="text-left p-3">Notas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((allocation) => (
                          <tr key={allocation.id} className="border-t">
                            <td className="p-3 font-medium">
                              {allocation.provider_name}
                            </td>
                            <td className="p-3 text-right">
                              {allocation.allocated_capacity.toLocaleString()}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {allocation.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button onClick={handleStartEdit}>Editar Asignaciones</Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketProviderManager;
