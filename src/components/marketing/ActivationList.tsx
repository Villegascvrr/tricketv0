
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, User, Zap, Circle, CheckCircle2, Clock } from "lucide-react";
import { Activation, ActivationStatus, activationStatusLabels } from "@/data/sponsorsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ActivationListProps {
    activations: Activation[];
    onAdd: (a: Omit<Activation, "id">) => void;
    onUpdateStatus: (id: string, status: ActivationStatus) => void;
    onDelete: (id: string) => void;
}

export function ActivationList({ activations, onAdd, onUpdateStatus, onDelete }: ActivationListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newActivation, setNewActivation] = useState<Partial<Activation>>({
        status: 'pendiente'
    });

    const handleAddSubmit = () => {
        if (!newActivation.name) return;

        onAdd({
            name: newActivation.name,
            description: newActivation.description || '',
            status: 'pendiente',
            expectedDate: newActivation.expectedDate,
            responsible: newActivation.responsible || 'Sin asignar',
            notes: newActivation.notes
        });

        setNewActivation({ status: 'pendiente', name: '', description: '', responsible: '', notes: '' });
        setIsAddOpen(false);
    };

    const getStatusColor = (status: ActivationStatus) => {
        switch (status) {
            case 'completada': return 'bg-success/10 text-success border-success/20';
            case 'en_curso': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Activaciones ({activations.length})
                </h3>
                <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Nueva Acción
                </Button>
            </div>

            <div className="grid gap-3">
                {activations.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <Zap className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground text-sm">No hay acciones pactadas registradas.</p>
                        </CardContent>
                    </Card>
                ) : (
                    activations.map((activation) => (
                        <Accordion type="single" collapsible key={activation.id} className="w-full">
                            <AccordionItem value={activation.id} className="border rounded-lg bg-card px-3">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-3 text-left w-full pr-2">
                                        <div className={`h-2 w-2 rounded-full shrink-0 ${activation.status === 'completada' ? 'bg-success' : activation.status === 'en_curso' ? 'bg-blue-500 animate-pulse' : 'bg-muted-foreground'}`} />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{activation.name}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-1">{activation.description}</div>
                                        </div>
                                        <Badge variant="outline" className={`ml-auto shrink-0 text-[10px] font-normal ${getStatusColor(activation.status)}`}>
                                            {activationStatusLabels[activation.status]}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-3 pt-1 border-t mt-1">
                                    <div className="space-y-3">
                                        <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                                            {activation.description || "Sin descripción."}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                                                    <Calendar className="h-3.5 w-3.5" /> Fecha Prevista
                                                </span>
                                                <span className="text-muted-foreground pl-5 block">
                                                    {activation.expectedDate ? format(new Date(activation.expectedDate), "d MMMM yyyy", { locale: es }) : "Sin fecha"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                                                    <User className="h-3.5 w-3.5" /> Responsable
                                                </span>
                                                <span className="text-muted-foreground pl-5 block">
                                                    {activation.responsible || "Sin asignar"}
                                                </span>
                                            </div>
                                        </div>

                                        {activation.notes && (
                                            <div>
                                                <span className="font-semibold text-xs text-foreground mb-1 block">Notas:</span>
                                                <p className="text-xs text-muted-foreground">{activation.notes}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Cambiar estado:</span>
                                                <Select
                                                    value={activation.status}
                                                    onValueChange={(val) => onUpdateStatus(activation.id, val as ActivationStatus)}
                                                >
                                                    <SelectTrigger className="h-7 w-[120px] text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(activationStatusLabels).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs"
                                                onClick={() => onDelete(activation.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva Acción / Activación</DialogTitle>
                        <DialogDescription>Registra una acción pactada con la marca.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Acción</Label>
                            <Input
                                placeholder="Ej: Sorteo Meet & Greet"
                                value={newActivation.name}
                                onChange={(e) => setNewActivation({ ...newActivation, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                                placeholder="Detalles sobre qué consiste la acción..."
                                value={newActivation.description}
                                onChange={(e) => setNewActivation({ ...newActivation, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fecha Prevista</Label>
                                <Input
                                    type="date"
                                    value={newActivation.expectedDate}
                                    onChange={(e) => setNewActivation({ ...newActivation, expectedDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Responsable</Label>
                                <Input
                                    placeholder="Ej: Producción"
                                    value={newActivation.responsible}
                                    onChange={(e) => setNewActivation({ ...newActivation, responsible: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Input
                                placeholder="Observaciones extra..."
                                value={newActivation.notes}
                                onChange={(e) => setNewActivation({ ...newActivation, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddSubmit}>Crear Acción</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
