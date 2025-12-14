import { PreFestivalTask, statusLabels, TaskStatus } from "@/data/preFestivalMockData";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock, CheckCircle2, XCircle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanViewProps {
  tasksByStatus: Record<TaskStatus, PreFestivalTask[]>;
  onOpenTask: (task: PreFestivalTask) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

const columns: { status: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { 
    status: 'pendiente', 
    label: 'Pendiente', 
    icon: <CircleDot className="h-4 w-4" />,
    color: 'border-muted-foreground/30'
  },
  { 
    status: 'en_curso', 
    label: 'En curso', 
    icon: <Clock className="h-4 w-4" />,
    color: 'border-primary/50'
  },
  { 
    status: 'bloqueada', 
    label: 'Bloqueada', 
    icon: <XCircle className="h-4 w-4" />,
    color: 'border-destructive/50'
  },
  { 
    status: 'hecha', 
    label: 'Hecha', 
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'border-success/50'
  }
];

export function KanbanView({ tasksByStatus, onOpenTask, onStatusChange, onDeleteTask }: KanbanViewProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
        {columns.map(column => (
          <div 
            key={column.status}
            className={cn(
              "w-72 shrink-0 rounded-lg border-2 bg-muted/20",
              column.color
            )}
          >
            {/* Column Header */}
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <span className="font-medium text-sm">{column.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus[column.status].length}
                </Badge>
              </div>
            </div>
            
            {/* Column Content */}
            <div className="p-2 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {tasksByStatus[column.status].map(task => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  onOpen={onOpenTask}
                  onStatusChange={onStatusChange}
                  onDelete={onDeleteTask}
                  compact
                />
              ))}
              {tasksByStatus[column.status].length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay tareas
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
