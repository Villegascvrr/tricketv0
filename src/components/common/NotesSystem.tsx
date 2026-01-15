import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Send,
    AlertCircle,
    User,
    Calendar,
    Clock,
    Flag,
    Plus
} from "lucide-react";
import { Note, PriorityLevel, initialNotes } from "@/data/notesMockData";
import { cn } from "@/lib/utils";

interface NotesSystemProps {
    entityId: string;
    entityType: 'task' | 'artist' | 'provider' | 'sponsor';
    className?: string;
}

export function NotesSystem({ entityId, entityType, className }: NotesSystemProps) {
    // In a real app, this would be fetched from API filtered by entityId
    // For demo, we filter the mock data or just show all if matches
    const [notes, setNotes] = useState<Note[]>(
        initialNotes.filter(n => n.entityId === entityId || (n.entityType === entityType && n.entityId === 'all'))
    );

    const [newNote, setNewNote] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('medium');
    const [responsible, setResponsible] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: Date.now().toString(),
            entityId,
            entityType,
            content: newNote,
            author: "Usuario Demo", // Current user
            createdAt: new Date().toISOString(),
            priority,
            responsible: responsible || undefined,
            reminderDate: reminderDate || undefined
        };

        setNotes([note, ...notes]);
        setNewNote('');
        setPriority('medium');
        setResponsible('');
        setReminderDate('');
    };

    const getPriorityColor = (p: PriorityLevel) => {
        switch (p) {
            case 'high': return 'text-red-600 bg-red-100 border-red-200';
            case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200';
            case 'low': return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const getPriorityLabel = (p: PriorityLevel) => {
        switch (p) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
        }
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="space-y-4 mb-6">
                <Textarea
                    placeholder="Escribe una nota interna..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="resize-none min-h-[80px]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Flag className="h-3 w-3" /> Prioridad
                        </label>
                        <Select value={priority} onValueChange={(val: PriorityLevel) => setPriority(val)}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Baja</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" /> Responsable
                        </label>
                        <Input
                            placeholder="Nombre..."
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Recordatorio (Opcional)
                        </label>
                        <Input
                            type="datetime-local"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                >
                    <Plus className="h-4 w-4" /> Añadir Nota
                </Button>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-4 flex-1 overflow-auto pr-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Historial de Notas
                </h4>

                {notes.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                        No hay notas registradas para esta entidad.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <div key={note.id} className="group relative border rounded-lg bg-card p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                {note.author.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">{note.author}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {format(new Date(note.createdAt), "d MMM, HH:mm", { locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[10px] h-5", getPriorityColor(note.priority))}>
                                        {getPriorityLabel(note.priority)}
                                    </Badge>
                                </div>

                                <p className="text-sm text-foreground/90 whitespace-pre-wrap pl-8">
                                    {note.content}
                                </p>

                                {(note.responsible || note.reminderDate) && (
                                    <div className="mt-3 pl-8 flex flex-wrap gap-2">
                                        {note.responsible && (
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-muted text-muted-foreground font-normal gap-1">
                                                <User className="h-3 w-3" /> {note.responsible}
                                            </Badge>
                                        )}
                                        {note.reminderDate && (
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {format(new Date(note.reminderDate), "d MMM, HH:mm", { locale: es })}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
