import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, List, LayoutGrid, Calendar, AlertTriangle, 
  CheckCircle2, Clock, XCircle, ArrowUpDown, Filter,
  Clapperboard, Truck, Users, Shield, FileCheck, Ticket, MessageSquare, HardHat
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { usePreFestivalTasks, ViewMode } from "@/hooks/usePreFestivalTasks";
import { TaskCard } from "@/components/prefestival/TaskCard";
import { TaskDetailDrawer } from "@/components/prefestival/TaskDetailDrawer";
import { TaskCreateDialog } from "@/components/prefestival/TaskCreateDialog";
import { KanbanView } from "@/components/prefestival/KanbanView";
import { TimelineView } from "@/components/prefestival/TimelineView";
import { AlertsPanel } from "@/components/prefestival/AlertsPanel";
import { PreFestivalTask, areaLabels, statusLabels, priorityLabels, TaskArea, TaskStatus, TaskPriority } from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";

const areaIcons: Record<TaskArea, React.ReactNode> = {
  produccion: <Clapperboard className="h-4 w-4" />,
  logistica: <Truck className="h-4 w-4" />,
  proveedores: <HardHat className="h-4 w-4" />,
  rrhh: <Users className="h-4 w-4" />,
  seguridad: <Shield className="h-4 w-4" />,
  licencias: <FileCheck className="h-4 w-4" />,
  ticketing: <Ticket className="h-4 w-4" />,
  comunicacion: <MessageSquare className="h-4 w-4" />
};

const PreFestivalOperations = () => {
  const {
    tasks, allTasks, milestones, tasksByStatus, stats, alerts, teamMembers,
    viewMode, setViewMode, filters, setFilters, sortConfig, setSortConfig,
    addTask, updateTask, deleteTask, addSubtask, toggleSubtask, addComment, addAttachment
  } = usePreFestivalTasks();

  const [selectedTask, setSelectedTask] = useState<PreFestivalTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleOpenTask = (task: PreFestivalTask) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleOpenTaskById = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) handleOpenTask(task);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const handleCreateTask = (taskData: Omit<PreFestivalTask, 'id' | 'status' | 'subtasks' | 'comments' | 'attachments' | 'history'>) => {
    addTask({ ...taskData, status: 'pendiente' });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return 'bg-destructive text-destructive-foreground';
      case 'medio': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Operaciones", href: "#" }, { label: "Pre-Festival" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-foreground">Operaciones Pre-Festival</h1>
            <p className="text-xs text-muted-foreground">Gestión de tareas y preparación del festival</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva tarea
            </Button>
          </div>
        </div>

        {/* Executive Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Completado</span>
              </div>
              <p className="text-2xl font-bold">{stats.completedPercent}%</p>
              <p className="text-xs text-muted-foreground">{stats.completed}/{stats.total} tareas</p>
            </CardContent>
          </Card>
          <Card className={stats.critical > 0 ? "border-destructive/30" : ""}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Críticas abiertas</span>
              </div>
              <p className={cn("text-2xl font-bold", stats.critical > 0 && "text-destructive")}>{stats.critical}</p>
              <p className="text-xs text-muted-foreground">prioridad alta</p>
            </CardContent>
          </Card>
          <Card className={stats.overdue > 0 ? "border-destructive/30" : ""}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Vencidas</span>
              </div>
              <p className={cn("text-2xl font-bold", stats.overdue > 0 && "text-destructive")}>{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">requieren atención</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">Próx. 7 días</span>
              </div>
              <p className="text-2xl font-bold">{stats.next7Days}</p>
              <p className="text-xs text-muted-foreground">hitos pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4" />
                <span className="text-xs text-muted-foreground">Riesgo global</span>
              </div>
              <Badge className={cn("text-sm", getRiskColor(stats.riskLevel))}>
                {stats.riskLevel.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Tasks Section */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filters Bar */}
            <Card>
              <CardContent className="py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar tareas..." 
                        className="pl-9 h-9"
                        value={filters.search}
                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <Select value={filters.area} onValueChange={(v) => setFilters(f => ({ ...f, area: v as TaskArea | 'all' }))}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las áreas</SelectItem>
                      {Object.entries(areaLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v as TaskStatus | 'all' }))}>
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.priority} onValueChange={(v) => setFilters(f => ({ ...f, priority: v as TaskPriority | 'all' }))}>
                    <SelectTrigger className="w-[110px] h-9">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('kanban')}>
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'timeline' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('timeline')}>
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area Tabs + Content */}
            <Tabs value={filters.area} onValueChange={(v) => setFilters(f => ({ ...f, area: v as TaskArea | 'all' }))}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Todas ({allTasks.length})
                </TabsTrigger>
                {Object.entries(areaLabels).map(([key, label]) => {
                  const count = allTasks.filter(t => t.area === key).length;
                  return (
                    <TabsTrigger key={key} value={key} className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      {areaIcons[key as TaskArea]}
                      {label} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* View Content */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} onOpen={handleOpenTask} onStatusChange={handleStatusChange} onDelete={deleteTask} />
                ))}
                {tasks.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No hay tareas que coincidan con los filtros</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {viewMode === 'kanban' && (
              <KanbanView tasksByStatus={tasksByStatus} onOpenTask={handleOpenTask} onStatusChange={handleStatusChange} onDeleteTask={deleteTask} />
            )}

            {viewMode === 'timeline' && (
              <TimelineView tasks={allTasks} milestones={milestones} onOpenTask={handleOpenTask} />
            )}
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <AlertsPanel alerts={alerts} onOpenTask={handleOpenTaskById} />
          </div>
        </div>
      </div>

      <TaskDetailDrawer 
        task={selectedTask} 
        open={detailOpen} 
        onOpenChange={setDetailOpen}
        onUpdate={updateTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onAddComment={addComment}
        onAddAttachment={addAttachment}
      />
      
      <TaskCreateDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateTask} />
    </div>
  );
};

export default PreFestivalOperations;
