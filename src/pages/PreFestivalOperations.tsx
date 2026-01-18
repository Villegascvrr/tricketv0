import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus, Search, List, LayoutGrid, Calendar, AlertTriangle,
  ClipboardList, Users, Euro, FileCheck, Settings,
  LucideIcon, Truck, HardHat, Music, Shield, Ticket, MessageSquare, Clapperboard,
  ArrowRight, AlertCircle, User
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { usePreFestivalTasksSupabase, ViewMode, PreFestivalTask, TaskFilters } from "@/hooks/usePreFestivalTasksSupabase";
import { TaskCard } from "@/components/prefestival/TaskCard";
import { TaskDetailDrawer } from "@/components/prefestival/TaskDetailDrawer";
import { TaskCreateDialog } from "@/components/prefestival/TaskCreateDialog";
import { KanbanViewDnd } from "@/components/prefestival/KanbanViewDnd";
import { TimelineView } from "@/components/prefestival/TimelineView";
import { AlertsPanel } from "@/components/prefestival/AlertsPanel";
import { statusLabels, priorityLabels, TaskStatus, TaskPriority, PRE_FESTIVAL_AREAS } from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";

import { AreaChecklistView } from "@/components/prefestival/AreaChecklistView";
import { ProviderManager } from "@/components/prefestival/ProviderManager";
import { ArtistManager } from "@/components/prefestival/ArtistManager";
import { mockProviders } from "@/data/providerMockData";
import { mockArtists } from "@/data/artistMockData";
import { initialNotes, Note } from "@/data/notesMockData";
import { NoteCreateDialog } from "@/components/prefestival/NoteCreateDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PreFestivalOperations = () => {
  const { isDemo, eventId } = useFestivalConfig();

  // Hooks
  const {
    tasks, allTasks, milestones, tasksByStatus, stats, alerts,
    viewMode, setViewMode, filters, setFilters,
    addTask, updateTask, deleteTask, addSubtask, toggleSubtask, addComment, addAttachment,
    isLoading, error
  } = usePreFestivalTasksSupabase(eventId, isDemo);

  // UI State
  const [selectedTask, setSelectedTask] = useState<PreFestivalTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [noteCreateOpen, setNoteCreateOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(isDemo ? initialNotes : []);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handlers
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

  const handleCreateTask = (taskData: any) => {
    addTask({ ...taskData, status: 'pendiente' });
  };

  const handleCreateNote = (noteData: Omit<Note, "id" | "createdAt" | "author">) => {
    const newNote: Note = {
      id: `new-${Date.now()}`,
      author: "Usuario Actual",
      createdAt: new Date().toISOString(),
      ...noteData
    };
    setNotes(prev => [newNote, ...prev]);
  };

  // Filter tasks locally by the active tab (Project Area)
  // This effectively updates the main "filters" state which drives the usePreFestivalTasksSupabase hook
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilters(prev => ({
      ...prev,
      area: (value === 'all' || value === 'dashboard') ? 'all' : value // Pass ID or 'all'
    }));
  };

  const currentArea = PRE_FESTIVAL_AREAS.find(a => a.id === activeTab);
  const activeAreaName = activeTab === 'all' ? 'Vista General' : activeTab === 'dashboard' ? 'Dashboard Operativo' : currentArea?.label || 'Area';

  // Dashboard Data Calculations
  // Dashboard Data Calculations
  const riskyProviders = isDemo ? mockProviders.filter(p => p.status === 'risk' || p.status === 'blocked') : [];
  const riskyArtists = isDemo ? mockArtists.filter(a => a.status === 'risk' || a.status === 'cancelled') : []; // Assuming cancelled/risk
  const allRisks = [
    ...riskyProviders.map(p => ({ type: 'Proveedor', name: p.name, status: p.status, id: p.id })),
    ...riskyArtists.map(a => ({ type: 'Artista', name: a.name, status: 'risk', id: a.id })) // Simplified mapping
  ];

  // Show High and Medium priority notes in the dashboard
  const visibleNotes = notes.filter(n => n.priority === 'high' || n.priority === 'medium');
  const upcomingMilestones = milestones.filter(m => !m.completed).slice(0, 3); // Top 3 incomplete

  // Stats for cards (Summary)
  // Note: For real environment, we'd ideally calculate these from real data exclusively
  // For now, we reuse the generic stats based on allTasks
  const completedCount = stats.completed;
  const totalCount = stats.total;
  const completionRate = stats.completionRate;

  return (
    <div className="min-h-screen bg-background p-3 md:p-4 theme-operations">
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4">
        <PageBreadcrumb items={[{ label: "Operaciones", href: "#" }, { label: "Pre-Festival" }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">Operaciones Pre-Festival</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground">Gestión centralizada de áreas, tareas y equipo</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 text-[10px] md:text-xs w-fit h-8">
              <Calendar className="h-3 w-3" />
              Faltan días para el festival
            </Badge>
          </div>
        </div>

        {/* Summary Cards - Dynamic Real Data */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Progreso Global</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                  <Progress value={completionRate} className="h-1 mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">{completedCount}/{totalCount} tareas</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Riesgos Operativos</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{allRisks.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Bloqueos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={cn("h-4 w-4", stats.overdue > 0 ? "text-warning" : "text-muted-foreground")} />
                <span className="text-xs text-muted-foreground">Vencidas</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className={cn("text-2xl font-bold", stats.overdue > 0 ? "text-warning" : "")}>{stats.overdue}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Equipo Activo</span>
              </div>
              {/* This would ideally come from assignments stats */}
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground mt-1">Personas asignadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Tabs based on Constants */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-3 md:space-y-4">
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <TabsList className="bg-card border flex-nowrap h-auto gap-1 p-1 w-max md:w-auto">
              <TabsTrigger value="dashboard" className="gap-2 text-[10px] md:text-xs px-3">
                <LayoutGrid className="h-3.5 w-3.5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2 text-[10px] md:text-xs px-3">
                <List className="h-3.5 w-3.5" />
                Vista General
              </TabsTrigger>
              {PRE_FESTIVAL_AREAS.map(area => {
                const Icon = area.icon;
                return (
                  <TabsTrigger key={area.id} value={area.id} className="gap-2 text-[10px] md:text-xs px-3">
                    <Icon className="h-3.5 w-3.5" />
                    {area.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>


          {/* Unified Task View for ALL tabs */}
          {/* We use a single layout controlled by the 'activeTab' filter state */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
            <div className="lg:col-span-3 space-y-4">

              {activeTab === 'all' ? (
                <>
                  {/* View Controls & Filters - Only for General View */}
                  <Card>
                    <CardContent className="py-3">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <h2 className="font-semibold text-sm">{activeAreaName}</h2>
                          {activeTab !== 'all' && (
                            <Badge variant="outline" className="text-[10px]">
                              {tasks.length} tareas
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                              placeholder="Buscar..."
                              className="pl-9 h-8 text-xs"
                              value={filters.search}
                              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                            />
                          </div>

                          <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
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

                          <Button onClick={() => setCreateOpen(true)} size="sm" className="h-8 gap-2 ml-auto sm:ml-0">
                            <Plus className="h-3.5 w-3.5" />
                            Nueva Tarea
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task Content - General View */}
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Card key={i}>
                          <CardContent className="py-4">
                            <Skeleton className="h-10 w-full mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      {viewMode === 'list' && (
                        <div className="space-y-3">
                          {tasks.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
                                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <h3 className="text-sm font-medium">No hay tareas</h3>
                              <p className="text-xs text-muted-foreground mt-1 mb-4">
                                No hay tareas registradas.
                              </p>
                              <Button onClick={() => setCreateOpen(true)} variant="outline" size="sm">
                                Crear Tarea
                              </Button>
                            </div>
                          ) : (
                            tasks.map(task => (
                              <TaskCard key={task.id} task={task} onOpen={handleOpenTask} onStatusChange={handleStatusChange} onDelete={deleteTask} />
                            ))
                          )}
                        </div>
                      )}
                      {viewMode === 'kanban' && (
                        <KanbanViewDnd tasksByStatus={tasksByStatus} onOpenTask={handleOpenTask} onStatusChange={handleStatusChange} onDeleteTask={deleteTask} onCreateTask={() => setCreateOpen(true)} />
                      )}
                      {viewMode === 'timeline' && (
                        <TimelineView tasks={allTasks} milestones={milestones} onOpenTask={handleOpenTask} />
                      )}
                    </>
                  )}
                </>
              ) : activeTab === 'dashboard' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* RISK PANEL */}
                  <Card className="md:col-span-1 border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-destructive" />
                        <h3 className="font-semibold text-sm">Atención Requerida</h3>
                      </div>
                      <div className="space-y-2">
                        {allRisks.length > 0 ? (
                          allRisks.map((risk, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded bg-background border border-destructive/20">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                                <div>
                                  <p className="text-sm font-medium">{risk.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{risk.type}</p>
                                </div>
                              </div>
                              <Badge variant="destructive" className="text-[10px] h-5">{risk.status}</Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No hay riesgos activos
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* MILESTONES PANEL */}
                  <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Próximos Hitos</h3>
                      </div>
                      <div className="space-y-3">
                        {upcomingMilestones.map((milestone) => (
                          <div key={milestone.id} className="relative pl-4 border-l-2 border-primary/20 pb-1">
                            <div className="absolute top-0 left-[-5px] h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                            <p className="text-xs font-semibold">{milestone.title}</p>
                            <p className="text-[10px] text-muted-foreground">{format(new Date(milestone.target_date), "d MMM yyyy", { locale: es })}</p>
                          </div>
                        ))}
                        {upcomingMilestones.length === 0 && (
                          <p className="text-sm text-muted-foreground">No hay hitos próximos</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* IMPORTANT NOTES PANEL */}
                  <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-amber-500" />
                          <h3 className="font-semibold text-sm">Notas Importantes</h3>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setNoteCreateOpen(true)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {visibleNotes.map((note) => (
                          <div key={note.id} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="flex justify-between items-start mb-1">
                              <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-700 bg-amber-500/5 px-1 py-0 h-4">
                                {note.entityType.toUpperCase()}
                              </Badge>
                              <span className="text-[9px] text-muted-foreground">
                                {format(new Date(note.createdAt), "d MMM", { locale: es })}
                              </span>
                            </div>
                            <p className="text-xs font-medium line-clamp-2">{note.content}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">Resp: {note.responsible || 'Sin asignar'}</span>
                            </div>
                          </div>
                        ))}
                        {visibleNotes.length === 0 && (
                          <p className="text-sm text-muted-foreground">No hay notas urgentes</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Shortcuts */}
                  <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center justify-center border-dashed" onClick={() => { handleTabChange('proveedores'); setCreateOpen(true); }}>
                      <Plus className="h-4 w-4 mb-1" />
                      <span className="text-xs">Nuevo Proveedor</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center justify-center border-dashed" onClick={() => { handleTabChange('artistas'); setCreateOpen(true); }}>
                      <Plus className="h-4 w-4 mb-1" />
                      <span className="text-xs">Nuevo Artista</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center justify-center border-dashed" onClick={() => setCreateOpen(true)}>
                      <Plus className="h-4 w-4 mb-1" />
                      <span className="text-xs">Nueva Tarea</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center justify-center border-dashed">
                      <FileCheck className="h-4 w-4 mb-1" />
                      <span className="text-xs">Ver Contratos</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center justify-center border-dashed" onClick={() => setNoteCreateOpen(true)}>
                      <MessageSquare className="h-4 w-4 mb-1" />
                      <span className="text-xs">Nueva Nota</span>
                    </Button>
                  </div>
                </div>
              ) : activeTab === 'proveedores' ? (
                /* Dedicated Provider Manager View */
                <ProviderManager onCreateTask={() => setCreateOpen(true)} />
              ) : activeTab === 'artistas' ? (
                /* Dedicated Artist Manager View */
                <ArtistManager onCreateTask={() => setCreateOpen(true)} />
              ) : (
                /* Area Specific Checklist View */
                <AreaChecklistView
                  tasks={tasks}
                  areaId={activeTab}
                  onOpenTask={handleOpenTask}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={deleteTask}
                  onCreateTask={() => setCreateOpen(true)}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <AlertsPanel alerts={alerts} onOpenTask={handleOpenTaskById} />
            </div>
          </div>
        </Tabs>
      </div>

      {/* Dialogs and Drawers */}
      <TaskDetailDrawer
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={updateTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onAddAttachment={addAttachment}
      />

      <TaskCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTask}
        defaultArea={activeTab !== 'all' ? activeTab : undefined}
      />

      <NoteCreateDialog
        open={noteCreateOpen}
        onOpenChange={setNoteCreateOpen}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};

export default PreFestivalOperations;
