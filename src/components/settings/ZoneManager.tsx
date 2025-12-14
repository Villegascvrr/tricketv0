import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useZones, Zone } from "@/hooks/useZones";
import { MapPin, Plus, Pencil, Trash2, Users } from "lucide-react";

interface ZoneManagerProps {
  eventId?: string;
}

const ZoneManager = ({ eventId }: ZoneManagerProps) => {
  const { zones, isLoading, addZone, updateZone, deleteZone, totalCapacity, isAdding, isUpdating, isDeleting } = useZones(eventId);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [deletingZoneId, setDeletingZoneId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
  });

  const resetForm = () => {
    setFormData({ name: '', capacity: 0 });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (zone: Zone) => {
    setFormData({
      name: zone.name,
      capacity: zone.capacity || 0,
    });
    setEditingZone(zone);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    
    const success = await addZone({
      name: formData.name.trim(),
      capacity: formData.capacity || null,
    });

    if (success) {
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!editingZone || !formData.name.trim()) return;
    
    const success = await updateZone(editingZone.id, {
      name: formData.name.trim(),
      capacity: formData.capacity || null,
    });

    if (success) {
      setEditingZone(null);
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!deletingZoneId) return;
    
    await deleteZone(deletingZoneId);
    setDeletingZoneId(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Zonas del Recinto</CardTitle>
                <CardDescription>
                  Define las zonas y su capacidad para calcular ocupación
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5">
                <Users className="h-3 w-3" />
                {totalCapacity.toLocaleString('es-ES')} capacidad total
              </Badge>
              <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={openAddModal}>
                <Plus className="h-3 w-3" />
                Nueva Zona
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay zonas definidas</p>
              <p className="text-xs mt-1">Añade zonas para calcular la ocupación del recinto</p>
              <Button size="sm" variant="outline" className="mt-4 gap-1.5" onClick={openAddModal}>
                <Plus className="h-3.5 w-3.5" />
                Añadir primera zona
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Capacidad</TableHead>
                  <TableHead className="text-right">% del Total</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell className="text-right">
                      {zone.capacity?.toLocaleString('es-ES') || '—'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {zone.capacity && totalCapacity > 0
                        ? `${((zone.capacity / totalCapacity) * 100).toFixed(1)}%`
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEditModal(zone)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeletingZoneId(zone.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Zone Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nueva Zona</DialogTitle>
            <DialogDescription>
              Añade una nueva zona al recinto con su capacidad máxima.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zone-name">Nombre de la zona *</Label>
              <Input
                id="zone-name"
                placeholder="Ej: Pista, VIP, Grada Norte..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zone-capacity">Capacidad</Label>
              <Input
                id="zone-capacity"
                type="number"
                placeholder="Número de personas"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isAdding || !formData.name.trim()}>
              {isAdding ? "Creando..." : "Crear Zona"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Zone Modal */}
      <Dialog open={!!editingZone} onOpenChange={(open) => !open && setEditingZone(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Zona</DialogTitle>
            <DialogDescription>
              Modifica los datos de la zona.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-zone-name">Nombre de la zona *</Label>
              <Input
                id="edit-zone-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-zone-capacity">Capacidad</Label>
              <Input
                id="edit-zone-capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingZone(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating || !formData.name.trim()}>
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingZoneId} onOpenChange={(open) => !open && setDeletingZoneId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar zona?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la zona
              {deletingZoneId && zones.find(z => z.id === deletingZoneId) && (
                <span className="font-medium"> "{zones.find(z => z.id === deletingZoneId)?.name}"</span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ZoneManager;
