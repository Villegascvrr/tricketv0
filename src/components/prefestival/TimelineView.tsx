import { PreFestivalTask, PreFestivalMilestone, statusLabels } from "@/data/preFestivalMockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, AlertCircle, Flag } from "lucide-react";
import { format, differenceInDays, startOfWeek, addWeeks, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  tasks: PreFestivalTask[];
  milestones: PreFestivalMilestone[];
  onOpenTask: (task: PreFestivalTask) => void;
}

export function TimelineView({ tasks, milestones, onOpenTask }: TimelineViewProps) {
  const festivalDate = new Date('2025-03-29');
  const today = new Date();
  const daysToFestival = differenceInDays(festivalDate, today);
  
  // Generate weeks from today to festival
  const weeks: { start: Date; end: Date; label: string }[] = [];
  let currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  while (currentWeekStart <= festivalDate) {
    const weekEnd = addWeeks(currentWeekStart, 1);
    weeks.push({
      start: currentWeekStart,
      end: weekEnd,
      label: format(currentWeekStart, "d MMM", { locale: es })
    });
    currentWeekStart = weekEnd;
  }

  // Get tasks for a specific week
  const getTasksForWeek = (weekStart: Date, weekEnd: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.due_date);
      return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    });
  };

  // Get milestone for a specific week
  const getMilestoneForWeek = (weekStart: Date, weekEnd: Date) => {
    return milestones.find(m => {
      const mDate = parseISO(m.target_date);
      return isWithinInterval(mDate, { start: weekStart, end: weekEnd });
    });
  };

  // Calculate milestone progress
  const getMilestoneProgress = (milestone: PreFestivalMilestone) => {
    const milestoneTasks = tasks.filter(t => milestone.tasks.includes(t.id));
    const completed = milestoneTasks.filter(t => t.status === 'hecha').length;
    return milestoneTasks.length > 0 ? Math.round((completed / milestoneTasks.length) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      {/* Header with countdown */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/20">
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Primaverando Festival 2025</p>
            <p className="text-sm text-muted-foreground">29 de marzo de 2025 • La Cartuja, Sevilla</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{daysToFestival}</p>
          <p className="text-xs text-muted-foreground">días restantes</p>
        </div>
      </div>

      {/* Milestones Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hitos principales</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
              {milestones.map(milestone => {
                const progress = getMilestoneProgress(milestone);
                const isPast = parseISO(milestone.target_date) < today;
                const isComplete = progress === 100;
                
                return (
                  <div 
                    key={milestone.id}
                    className={cn(
                      "w-48 shrink-0 p-3 rounded-lg border transition-colors",
                      isComplete ? "bg-success/10 border-success/30" :
                      isPast && !isComplete ? "bg-destructive/10 border-destructive/30" :
                      "bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : isPast ? (
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {format(parseISO(milestone.target_date), "d MMM", { locale: es })}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium leading-tight mb-2">{milestone.title}</p>
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{progress}% completado</p>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Weekly Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Timeline semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="space-y-4 min-w-[800px]">
              {weeks.map((week, index) => {
                const weekTasks = getTasksForWeek(week.start, week.end);
                const milestone = getMilestoneForWeek(week.start, week.end);
                const isCurrentWeek = isWithinInterval(today, { start: week.start, end: week.end });
                const isFestivalWeek = isWithinInterval(festivalDate, { start: week.start, end: week.end });
                
                const completedTasks = weekTasks.filter(t => t.status === 'hecha').length;
                const blockedTasks = weekTasks.filter(t => t.status === 'bloqueada').length;
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      isCurrentWeek && "border-primary bg-primary/5",
                      isFestivalWeek && "border-primary/50 bg-gradient-to-r from-primary/10 to-transparent"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Week label */}
                      <div className="w-24 shrink-0">
                        <p className="font-medium text-sm">
                          {format(week.start, "d", { locale: es })} - {format(week.end, "d MMM", { locale: es })}
                        </p>
                        {isCurrentWeek && (
                          <Badge className="mt-1 text-[10px]">Esta semana</Badge>
                        )}
                        {isFestivalWeek && (
                          <Badge variant="outline" className="mt-1 text-[10px] border-primary text-primary">
                            🎉 Festival
                          </Badge>
                        )}
                      </div>
                      
                      {/* Milestone */}
                      <div className="w-48 shrink-0">
                        {milestone ? (
                          <div className="p-2 rounded border bg-accent/30">
                            <p className="text-xs font-medium">{milestone.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {format(parseISO(milestone.target_date), "d MMM", { locale: es })}
                            </p>
                          </div>
                        ) : (
                          <div className="p-2 text-xs text-muted-foreground">—</div>
                        )}
                      </div>
                      
                      {/* Tasks summary */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm">
                            <span className="font-medium">{weekTasks.length}</span>
                            <span className="text-muted-foreground"> tareas</span>
                          </span>
                          {completedTasks > 0 && (
                            <span className="text-xs text-success flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {completedTasks} completadas
                            </span>
                          )}
                          {blockedTasks > 0 && (
                            <span className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {blockedTasks} bloqueadas
                            </span>
                          )}
                        </div>
                        
                        {/* Task pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {weekTasks.slice(0, 6).map(task => (
                            <button
                              key={task.id}
                              onClick={() => onOpenTask(task)}
                              className={cn(
                                "text-xs px-2 py-1 rounded-full border transition-colors hover:bg-accent",
                                task.status === 'hecha' && "bg-success/10 border-success/30 text-success",
                                task.status === 'bloqueada' && "bg-destructive/10 border-destructive/30 text-destructive",
                                task.status === 'en_curso' && "bg-primary/10 border-primary/30 text-primary",
                                task.status === 'pendiente' && "bg-muted border-border"
                              )}
                            >
                              {task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title}
                            </button>
                          ))}
                          {weekTasks.length > 6 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{weekTasks.length - 6} más
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
