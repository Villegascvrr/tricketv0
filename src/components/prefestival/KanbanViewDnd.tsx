import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskStatus } from '@/data/preFestivalMockData';
import { PreFestivalTask } from '@/hooks/usePreFestivalTasksSupabase';
import { TaskCard } from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Clock, CheckCircle2, AlertCircle, GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanViewDndProps {
  tasksByStatus: Record<TaskStatus, PreFestivalTask[]>;
  onOpenTask: (task: PreFestivalTask) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask?: (status?: TaskStatus) => void;
}

const columns: { status: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
  {
    status: 'solicitado',
    label: 'Solicitado',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'border-warning/50 bg-warning/5'
  },
  {
    status: 'pendiente',
    label: 'Pendiente',
    icon: <Clock className="h-4 w-4" />,
    color: 'border-muted-foreground/30 bg-muted/10'
  },
  {
    status: 'completado',
    label: 'Completado',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'border-success/50 bg-success/5'
  }
];

interface SortableTaskCardProps {
  task: PreFestivalTask;
  onOpen: (task: PreFestivalTask) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

function SortableTaskCard({ task, onOpen, onStatusChange, onDelete }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="pl-6">
        <TaskCard
          task={task}
          onOpen={onOpen}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          compact
        />
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  tasks: PreFestivalTask[];
  onOpenTask: (task: PreFestivalTask) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask?: (status?: TaskStatus) => void;
}

function DroppableColumn({
  status,
  label,
  icon,
  color,
  tasks,
  onOpenTask,
  onStatusChange,
  onDeleteTask,
  onCreateTask
}: DroppableColumnProps) {
  return (
    <div
      className={cn(
        "w-72 shrink-0 rounded-lg border-2",
        color
      )}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-sm">{label}</span>
            <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-1">
              {tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-muted"
            onClick={() => onCreateTask?.(status)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Column Content */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
          data-status={status}
        >
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onOpen={onOpenTask}
              onStatusChange={onStatusChange}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
              Arrastra tareas aquí
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanViewDnd({ tasksByStatus, onOpenTask, onStatusChange, onDeleteTask, onCreateTask }: KanbanViewDndProps) {
  const [activeTask, setActiveTask] = useState<PreFestivalTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findTaskById = (id: string): PreFestivalTask | undefined => {
    for (const status of Object.keys(tasksByStatus) as TaskStatus[]) {
      const task = tasksByStatus[status].find(t => t.id === id);
      if (task) return task;
    }
    return undefined;
  };

  const findColumnByTaskId = (id: string): TaskStatus | null => {
    for (const status of Object.keys(tasksByStatus) as TaskStatus[]) {
      if (tasksByStatus[status].some(t => t.id === id)) {
        return status;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback handled by CSS
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the column the task was dropped on
    let targetStatus: TaskStatus | null = null;

    // Check if dropped on a column directly
    if (['solicitado', 'pendiente', 'completado'].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      // Dropped on another task - find that task's column
      targetStatus = findColumnByTaskId(overId);
    }

    if (targetStatus) {
      const currentStatus = findColumnByTaskId(activeId);
      if (currentStatus !== targetStatus) {
        onStatusChange(activeId, targetStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {columns.map(column => (
            <DroppableColumn
              key={column.status}
              status={column.status}
              label={column.label}
              icon={column.icon}
              color={column.color}
              tasks={tasksByStatus[column.status]}
              onOpenTask={onOpenTask}
              onStatusChange={onStatusChange}
              onDeleteTask={onDeleteTask}
              onCreateTask={onCreateTask}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-2 scale-105">
            <TaskCard
              task={activeTask}
              onOpen={() => { }}
              onStatusChange={() => { }}
              onDelete={() => { }}
              compact
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
