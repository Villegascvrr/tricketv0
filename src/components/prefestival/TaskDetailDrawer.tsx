import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  History,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Link2,
  Send,
  ListChecks
} from "lucide-react";
import {
  PreFestivalTask,
  statusLabels,
  priorityLabels,
  TaskStatus,
  TaskPriority,
  teamMembers,
  PRE_FESTIVAL_AREAS,
  TaskArea
} from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { NotesSystem } from "../common/NotesSystem";

interface TaskDetailDrawerProps {
  task: PreFestivalTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<PreFestivalTask>) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddAttachment: (taskId: string, name: string, url: string) => void;
}

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onAddAttachment
}: TaskDetailDrawerProps) {
  const [newSubtask, setNewSubtask] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  if (!task) return null;

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completado': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'pendiente': return <Clock className="h-5 w-5 text-primary" />;
      case 'solicitado': return <AlertCircle className="h-5 w-5 text-warning" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAreaLabel = (areaId: string) => {
    return PRE_FESTIVAL_AREAS.find(a => a.id === areaId)?.label || areaId;
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };


  const handleAddAttachment = () => {
    if (newAttachmentName.trim() && newAttachmentUrl.trim()) {
      onAddAttachment(task.id, newAttachmentName.trim(), newAttachmentUrl.trim());
      setNewAttachmentName('');
      setNewAttachmentUrl('');
    }
  };

  const subtasksCompleted = task.subtasks?.filter(s => s.completed).length || 0;
  const subtasksTotal = task.subtasks?.length || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
        <SheetHeader className="space-y-3">
          <div className="flex items-start gap-3">
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight">{task.title}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{getAreaLabel(task.area)}</Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Estado</label>
                <Select
                  value={task.status}
                  onValueChange={(value) => onUpdate(task.id, { status: value as TaskStatus })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Prioridad</label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => onUpdate(task.id, { priority: value as TaskPriority })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Área</label>
                <Select
                  value={task.area}
                  onValueChange={(value) => onUpdate(task.id, { area: value as TaskArea })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRE_FESTIVAL_AREAS.map((area) => (
                      <SelectItem key={area.id} value={area.id}>{area.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Responsable
                </label>
                <Select
                  value={task.assignee_name}
                  onValueChange={(value) => onUpdate(task.id, { assignee_name: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Fecha límite
                </label>
                <Input
                  type="date"
                  value={task.due_date}
                  onChange={(e) => onUpdate(task.id, { due_date: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Descripción</label>
              <Textarea
                value={task.description || ''}
                onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                placeholder="Añadir descripción..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <Separator />

            {/* Tabs for subtasks, comments, attachments, history */}
            <Tabs defaultValue="subtasks" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="subtasks" className="gap-1 text-xs">
                  <ListChecks className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Subtareas</span>
                  {subtasksTotal > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {subtasksCompleted}/{subtasksTotal}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-1 text-xs">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Notas</span>
                </TabsTrigger>
                <TabsTrigger value="attachments" className="gap-1 text-xs">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Archivos</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1 text-xs">
                  <History className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Historial</span>
                </TabsTrigger>
              </TabsList>

              {/* Subtasks */}
              <TabsContent value="subtasks" className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nueva subtarea..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="h-9"
                  />
                  <Button size="sm" onClick={handleAddSubtask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {task.subtasks?.map(subtask => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30"
                    >
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        subtask.completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                  {(!task.subtasks || task.subtasks.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay subtareas
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Comments / Notes */}
              <TabsContent value="comments" className="h-[400px]">
                <NotesSystem
                  entityId={task.id}
                  entityType="task"
                />
              </TabsContent>

              {/* Attachments */}
              <TabsContent value="attachments" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nombre del enlace..."
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      className="h-9"
                    />
                    <Input
                      placeholder="URL..."
                      value={newAttachmentUrl}
                      onChange={(e) => setNewAttachmentUrl(e.target.value)}
                      className="h-9"
                    />
                    <Button size="sm" onClick={handleAddAttachment}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {task.attachments?.map(attachment => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-accent/50 transition-colors"
                    >
                      <Link2 className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1">{attachment.name}</span>
                    </a>
                  ))}
                  {(!task.attachments || task.attachments.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay archivos adjuntos
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* History */}
              <TabsContent value="history" className="space-y-2">
                {task.history?.map(entry => (
                  <div key={entry.id} className="flex items-start gap-2 p-2 rounded-lg border bg-muted/30">
                    <History className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{entry.action}</span>
                        {entry.old_value && entry.new_value && (
                          <span className="text-muted-foreground">
                            : {entry.old_value} → {entry.new_value}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.changed_by} • {format(new Date(entry.created_at), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
                {(!task.history || task.history.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay historial
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
