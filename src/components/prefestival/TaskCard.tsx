import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Trash2,
  Edit
} from "lucide-react";
import { PreFestivalTask, statusLabels, priorityLabels, TaskStatus, PRE_FESTIVAL_AREAS } from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";
import { format, isPast, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface TaskCardProps {
  task: PreFestivalTask;
  onOpen: (task: PreFestivalTask) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  compact?: boolean;
}

export function TaskCard({ task, onOpen, onStatusChange, onDelete, compact = false }: TaskCardProps) {
  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && task.status !== 'completado';
  const daysUntilDue = differenceInDays(dueDate, new Date());

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completado': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'pendiente': return <Clock className="h-4 w-4 text-primary" />;
      case 'solicitado': return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'media': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completado': return 'bg-success/10 text-success border-success/30';
      case 'pendiente': return 'bg-primary/10 text-primary border-primary/30';
      case 'solicitado': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAreaInfo = (areaId: string) => {
    return PRE_FESTIVAL_AREAS.find(a => a.id === areaId);
  };

  const areaInfo = getAreaInfo(task.area);
  const AreaIcon = areaInfo?.icon;

  if (compact) {
    return (
      <div
        onClick={() => onOpen(task)}
        className={cn(
          "p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors cursor-pointer",
          isOverdue && "border-destructive/50",
          task.status === 'solicitado' && "border-warning/30 bg-warning/5"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {getStatusIcon(task.status)}
            <span className="text-sm font-medium truncate">{task.title}</span>
          </div>
          <Badge variant="outline" className={cn("shrink-0 text-xs", getPriorityColor(task.priority))}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{task.assignee_name.split(' ')[0]}</span>
          </div>
          <div className={cn("flex items-center gap-1", isOverdue && "text-destructive")}>
            <Calendar className="h-3 w-3" />
            <span>{format(dueDate, 'd MMM', { locale: es })}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors cursor-pointer",
        isOverdue && "border-destructive/50",
        task.status === 'solicitado' && "border-warning/30 bg-warning/5"
      )}
      onClick={() => onOpen(task)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {getStatusIcon(task.status)}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm leading-tight mb-1">{task.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {areaInfo && (
                <Badge variant="secondary" className={cn("text-xs gap-1", `text-${areaInfo.color}-500 bg-${areaInfo.color}-500/10`)}>
                  {AreaIcon && <AreaIcon className="h-3 w-3" />}
                  {areaInfo.label}
                </Badge>
              )}
              {!areaInfo && task.area && (
                <Badge variant="secondary" className="text-xs">
                  {task.area}
                </Badge>
              )}
              <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                {priorityLabels[task.priority]}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
                {statusLabels[task.status]}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onOpen(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'solicitado')}>
              Marcar como Solicitado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'pendiente')}>
              Marcar como Pendiente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completado')}>
              Marcar como Completado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {task.assignee_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">{task.assignee_name}</span>
        </div>

        <div className={cn(
          "flex items-center gap-1",
          isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
        )}>
          <Calendar className="h-3 w-3" />
          <span>
            {format(dueDate, 'd MMM yyyy', { locale: es })}
            {isOverdue && ` (${Math.abs(daysUntilDue)}d vencida)`}
            {!isOverdue && daysUntilDue <= 7 && daysUntilDue >= 0 && ` (${daysUntilDue}d)`}
          </span>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {task.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{task.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
