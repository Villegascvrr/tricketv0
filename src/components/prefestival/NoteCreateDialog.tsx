
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/data/notesMockData";

interface NoteCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (note: Omit<Note, "id" | "createdAt" | "author">) => void;
}

export function NoteCreateDialog({ open, onOpenChange, onSubmit }: NoteCreateDialogProps) {
    const [content, setContent] = useState("");
    const [entityType, setEntityType] = useState<Note['entityType']>("task");
    const [priority, setPriority] = useState<Note['priority']>("medium");
    const [responsible, setResponsible] = useState("");

    const handleSubmit = () => {
        if (!content) return;

        onSubmit({
            content,
            entityType,
            priority,
            responsible: responsible || "Sin asignar",
            entityId: "general" // Default for manual notes
        });

        onOpenChange(false);
        resetForm();
    };

    const resetForm = () => {
        setContent("");
        setEntityType("task");
        setPriority("medium");
        setResponsible("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nueva Nota</DialogTitle>
                    <DialogDescription>
                        Añade una nota rápida al dashboard operativo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="content">Contenido</Label>
                        <Textarea
                            id="content"
                            placeholder="Escribe tu nota aquí..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select value={entityType} onValueChange={(v: any) => setEntityType(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="task">Tarea</SelectItem>
                                    <SelectItem value="artist">Artista</SelectItem>
                                    <SelectItem value="provider">Proveedor</SelectItem>
                                    <SelectItem value="sponsor">Patrocinador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="priority">Prioridad</Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="responsible">Responsable (Opcional)</Label>
                        <Input
                            id="responsible"
                            placeholder="Nombre del responsable"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>Crear Nota</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
