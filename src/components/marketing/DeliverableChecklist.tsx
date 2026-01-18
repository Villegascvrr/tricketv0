
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Loader2, AlertCircle, Plus, Trash2, Calendar, User } from "lucide-react";
import {
    Deliverable, DeliverableStatus, deliverableStatusLabels, deliverableTypeLabels, DeliverableType
} from "@/data/sponsorsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DeliverableChecklistProps {
    deliverables: Deliverable[];
    onAdd: (d: Omit<Deliverable, "id">) => void;
    onUpdateStatus: (id: string, status: DeliverableStatus) => void;
    onDelete: (id: string) => void;
}

export function DeliverableChecklist({ deliverables, onAdd, onUpdateStatus, onDelete }: DeliverableChecklistProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newDeliverable, setNewDeliverable] = useState<Partial<Deliverable>>({
        type: 'logo',
        status: 'pendiente'
    });

    const handleAddSubmit = () => {
        if (!newDeliverable.name) return;

        onAdd({
            name: newDeliverable.name,
            type: newDeliverable.type as DeliverableType,
            status: 'pendiente',
            deadline: newDeliverable.deadline,
            responsible: newDeliverable.responsible || 'Sin asignar',
            notes: newDeliverable.notes
        });

        setNewDeliverable({ type: 'logo', status: 'pendiente', name: '', responsible: '', notes: '' });
        setIsAddOpen(false);
    };

    const getStatusIcon = (status: DeliverableStatus) => {
        switch (status) {
            case 'entregado': return <CheckCircle2 className="h-5 w-5 text-success" />;
            case 'en_proceso': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin-slow" />; // animate-spin might be too fast
            default: return <Circle className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const cycleStatus = (current: DeliverableStatus) => {
        if (current === 'pendiente') return 'en_proceso';
        if (current === 'en_proceso') return 'entregado';
        return 'pendiente';
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Entregables & Compromisos</h3>
                <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo
                </Button>
            </div>

            <div className="space-y-2">
                {deliverables.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-muted/10">
                        No hay entregables definidos.
                    </div>
                ) : (
                    deliverables.map(item => (
                        <div
                            key={item.id}
                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border transition-all ${item.status === 'entregado' ? 'bg-muted/30 border-muted' : 'bg-card'}`}
                        >
                            <button
                                className="mt-0.5 sm:mt-0 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => onUpdateStatus(item.id, cycleStatus(item.status))}
                                title="Clic para cambiar estado"
                            >
                                {getStatusIcon(item.status)}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className={`font-medium text-sm ${item.status === 'entregado' ? 'text-muted-foreground line-through' : ''}`}>
                                        {item.name}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] font-normal h-5">
                                        {deliverableTypeLabels[item.type]}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    {item.deadline && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(item.deadline), "d MMM", { locale: es })}
                                        </span>
                                    )}
                                    {item.responsible && (
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {item.responsible}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <Badge
                                    variant="secondary"
                                    className={`text-[10px] ${item.status === 'entregado' ? 'bg-success/10 text-success hover:bg-success/20' :
                                            item.status === 'en_proceso' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' : ''
                                        }`}
                                >
                                    {deliverableStatusLabels[item.status]}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nuevo Entregable</DialogTitle>
                        <DialogDescription>Define un nuevo compromiso con la marca.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre / Descripción</Label>
                            <Input
                                placeholder="Ej: Logo en photocall"
                                value={newDeliverable.name}
                                onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={newDeliverable.type}
                                    onValueChange={(val) => setNewDeliverable({ ...newDeliverable, type: val as DeliverableType })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(deliverableTypeLabels).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha Límite</Label>
                                <Input
                                    type="date"
                                    value={newDeliverable.deadline}
                                    onChange={(e) => setNewDeliverable({ ...newDeliverable, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Responsable</Label>
                            <Input
                                placeholder="Ej: Equipo Diseño"
                                value={newDeliverable.responsible}
                                onChange={(e) => setNewDeliverable({ ...newDeliverable, responsible: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddSubmit}>Añadir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
