import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  priorityLabels,
  TaskPriority,
  PRE_FESTIVAL_AREAS
} from "@/data/preFestivalMockData";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface TaskCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: {
    title: string;
    description?: string;
    area: string;
    priority: TaskPriority;
    assignee_name: string;
    assignee_id?: string;
    due_date: string;
    tags: string[];
  }) => void;
  defaultArea?: string;
}

export function TaskCreateDialog({ open, onOpenChange, onSubmit, defaultArea }: TaskCreateDialogProps) {
  const { members } = useTeamMembers();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  // Update default area when dialog opens or defaultArea changes
  useEffect(() => {
    if (open) {
      if (defaultArea && defaultArea !== 'all') {
        setArea(defaultArea);
      } else if (!area) {
        setArea(PRE_FESTIVAL_AREAS[0].id);
      }
    }
  }, [open, defaultArea]);

  const handleSubmit = () => {
    if (!title.trim() || !assigneeId || !dueDate || !area) return;

    const selectedMember = members.find(m => m.id === assigneeId);

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      area: area,
      priority,
      assignee_name: selectedMember?.name || 'Usuario desconocido',
      assignee_id: assigneeId,
      due_date: dueDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('media');
    setAssigneeId('');
    setDueDate('');
    setTags('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
          <DialogDescription>
            Crea una nueva tarea para la preparación del festival
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Nombre de la tarea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Área *</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un área" />
                </SelectTrigger>
                <SelectContent>
                  {PRE_FESTIVAL_AREAS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridad *</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Responsable *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name || member.email}
                    </SelectItem>
                  ))}
                  {members.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Sin miembros en el equipo
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha límite *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
            <Input
              id="tags"
              placeholder="producción, crítico, sonido..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !assigneeId || !dueDate || !area}
          >
            Crear tarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
