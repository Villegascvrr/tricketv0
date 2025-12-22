import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, Search, List, LayoutGrid, Calendar, AlertTriangle, 
  CheckCircle2, Clock, XCircle, Users, Truck, HardHat, Music,
  ClipboardList, Euro, FileCheck, MapPin, Shield, Ticket, MessageSquare,
  Clapperboard, ArrowRight, CircleDot, RefreshCw
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { usePreFestivalTasksSupabase, ViewMode, PreFestivalTask } from "@/hooks/usePreFestivalTasksSupabase";
import { TaskCard } from "@/components/prefestival/TaskCard";
import { TaskDetailDrawer } from "@/components/prefestival/TaskDetailDrawer";
import { TaskCreateDialog } from "@/components/prefestival/TaskCreateDialog";
import { KanbanViewDnd } from "@/components/prefestival/KanbanViewDnd";
import { TimelineView } from "@/components/prefestival/TimelineView";
import { AlertsPanel } from "@/components/prefestival/AlertsPanel";
import { areaLabels, statusLabels, priorityLabels, TaskArea, TaskStatus, TaskPriority } from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";

// ============ ORIGINAL DATA ============

const vendors = [
  { id: 1, name: 'SoundPro Audio Systems', category: 'Sonido', budget: 45000, paid: 22500, status: 'contracted', deliverables: 4, delivered: 2, deadline: '15 Mar' },
  { id: 2, name: 'LightStage Productions', category: 'Iluminación', budget: 32000, paid: 16000, status: 'contracted', deliverables: 3, delivered: 1, deadline: '20 Mar' },
  { id: 3, name: 'SecurEvent Andalucía', category: 'Seguridad', budget: 28000, paid: 14000, status: 'contracted', deliverables: 5, delivered: 3, deadline: '25 Mar' },
  { id: 4, name: 'FoodTruck Collective', category: 'Catering', budget: 15000, paid: 0, status: 'pending', deliverables: 2, delivered: 0, deadline: '28 Mar' },
  { id: 5, name: 'CleanMax Services', category: 'Limpieza', budget: 12000, paid: 6000, status: 'contracted', deliverables: 2, delivered: 1, deadline: '27 Mar' },
];

const staffRoles = [
  { role: 'Coordinador General', required: 2, confirmed: 2, pending: 0, docs: true },
  { role: 'Jefe de Seguridad', required: 3, confirmed: 3, pending: 0, docs: true },
  { role: 'Responsable Accesos', required: 4, confirmed: 3, pending: 1, docs: true },
  { role: 'Coordinador Barras', required: 2, confirmed: 2, pending: 0, docs: true },
  { role: 'Técnico de Sonido', required: 6, confirmed: 4, pending: 2, docs: false },
  { role: 'Técnico de Iluminación', required: 4, confirmed: 4, pending: 0, docs: true },
  { role: 'Personal Seguridad', required: 85, confirmed: 72, pending: 13, docs: false },
  { role: 'Personal Accesos', required: 45, confirmed: 38, pending: 7, docs: false },
  { role: 'Personal Barras', required: 65, confirmed: 52, pending: 13, docs: false },
  { role: 'Personal Limpieza', required: 35, confirmed: 30, pending: 5, docs: true },
];

const productionItems = [
  { id: 1, name: 'Escenario Principal', category: 'Escenarios', status: 'in_progress', progress: 65, deadline: '26 Mar', responsible: 'SoundPro' },
  { id: 2, name: 'Rider Villalobos', category: 'Riders', status: 'pending', progress: 30, deadline: '20 Mar', responsible: 'Producción' },
  { id: 3, name: 'Rider Henry Méndez', category: 'Riders', status: 'completed', progress: 100, deadline: '15 Mar', responsible: 'Producción' },
  { id: 4, name: 'Sistema PA Pista', category: 'Sonido', status: 'in_progress', progress: 80, deadline: '27 Mar', responsible: 'SoundPro' },
  { id: 5, name: 'Iluminación VIP', category: 'Iluminación', status: 'completed', progress: 100, deadline: '22 Mar', responsible: 'LightStage' },
];

const logisticsItems = [
  { name: 'Permiso Ayuntamiento Sevilla', status: 'approved', date: '15 Ene' },
  { name: 'Licencia Espectáculos Públicos', status: 'approved', date: '28 Ene' },
  { name: 'Plan de Evacuación', status: 'pending', date: '10 Mar' },
  { name: 'Seguro de Responsabilidad Civil', status: 'approved', date: '5 Feb' },
  { name: 'Contrato Recinto La Cartuja', status: 'approved', date: '20 Dic' },
  { name: 'Coordinación Policía Local', status: 'in_progress', date: '20 Mar' },
  { name: 'Coordinación Servicios Sanitarios', status: 'approved', date: '1 Mar' },
  { name: 'Plan de Tráfico y Aparcamiento', status: 'pending', date: '15 Mar' },
];

const calendarMilestones = [
  { date: '15 Ene', title: 'Permisos municipales aprobados', status: 'completed' },
  { date: '1 Feb', title: 'Cierre contratos proveedores principales', status: 'completed' },
  { date: '15 Feb', title: 'Lanzamiento venta Early Bird', status: 'completed' },
  { date: '1 Mar', title: 'Confirmación cartel completo', status: 'completed' },
  { date: '10 Mar', title: 'Cierre contratación staff', status: 'in_progress' },
  { date: '20 Mar', title: 'Recepción riders artistas', status: 'pending' },
  { date: '25 Mar', title: 'Inicio montaje recinto', status: 'pending' },
  { date: '28 Mar', title: 'Pruebas técnicas generales', status: 'pending' },
  { date: '29 Mar', title: '🎉 DÍA DEL FESTIVAL', status: 'pending' },
];

const preProductionChecklist = [
  { id: 1, task: 'Contratos artistas firmados', completed: true, category: 'Legal' },
  { id: 2, task: 'Seguros contratados', completed: true, category: 'Legal' },
  { id: 3, task: 'Plan de seguridad aprobado', completed: true, category: 'Seguridad' },
  { id: 4, task: 'Equipos de sonido reservados', completed: true, category: 'Producción' },
  { id: 5, task: 'Catering confirmado', completed: false, category: 'Servicios' },
  { id: 6, task: 'Señalización diseñada', completed: true, category: 'Producción' },
  { id: 7, task: 'Acreditaciones impresas', completed: false, category: 'Accesos' },
  { id: 8, task: 'Formación staff completada', completed: false, category: 'RRHH' },
  { id: 9, task: 'Prueba sistemas ticketing', completed: true, category: 'Tecnología' },
  { id: 10, task: 'Comunicación emergencias establecida', completed: true, category: 'Seguridad' },
];

const preEventIssues = [
  { id: 1, title: 'Retraso entrega estructura escenario', severity: 'high', area: 'Producción', status: 'open', daysOpen: 5, assignedTo: 'Carlos M.' },
  { id: 2, title: 'Pendiente confirmación 13 guardias seguridad', severity: 'medium', area: 'RRHH', status: 'in_progress', daysOpen: 3, assignedTo: 'Laura S.' },
  { id: 3, title: 'Rider técnico Villalobos incompleto', severity: 'medium', area: 'Producción', status: 'in_progress', daysOpen: 8, assignedTo: 'Miguel R.' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'contracted':
      return <Badge variant="default" className="bg-success text-success-foreground">Completado</Badge>;
    case 'in_progress':
      return <Badge variant="secondary">En progreso</Badge>;
    case 'pending':
      return <Badge variant="outline">Pendiente</Badge>;
    case 'open':
      return <Badge variant="destructive">Abierto</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved': return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'in_progress': return <Clock className="h-4 w-4 text-warning" />;
    case 'pending': return <CircleDot className="h-4 w-4 text-muted-foreground" />;
    default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  }
};

// ============ COMPONENT ============

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
    viewMode, setViewMode, filters, setFilters,
    addTask, updateTask, deleteTask, addSubtask, toggleSubtask, addComment, addAttachment,
    isLoading, error
  } = usePreFestivalTasksSupabase();

  const [selectedTask, setSelectedTask] = useState<PreFestivalTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tareas');

  // Calculations for summary
  const totalStaffRequired = staffRoles.reduce((acc, r) => acc + r.required, 0);
  const totalStaffConfirmed = staffRoles.reduce((acc, r) => acc + r.confirmed, 0);
  const totalBudget = vendors.reduce((acc, v) => acc + v.budget, 0);
  const totalPaid = vendors.reduce((acc, v) => acc + v.paid, 0);
  const checklistCompleted = preProductionChecklist.filter(c => c.completed).length;

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
    <div className="min-h-screen bg-background p-4 theme-operations">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Operaciones", href: "#" }, { label: "Pre-Festival" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-foreground">Operaciones Pre-Festival</h1>
            <p className="text-xs text-muted-foreground">Gestión de producción, proveedores, personal y logística</p>
          </div>
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Calendar className="h-3 w-3" />
            Faltan días para el festival
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Tareas</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                  <Progress value={stats.completionRate} className="h-1 mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">{stats.completed}/{stats.total}</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Staff</span>
              </div>
              <p className="text-2xl font-bold">{totalStaffConfirmed}/{totalStaffRequired}</p>
              <Progress value={(totalStaffConfirmed / totalStaffRequired) * 100} className="h-1 mt-1" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Euro className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Proveedores</span>
              </div>
              <p className="text-2xl font-bold">€{(totalPaid / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">de €{(totalBudget / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="h-4 w-4 text-accent-foreground" />
                <span className="text-xs text-muted-foreground">Checklist</span>
              </div>
              <p className="text-2xl font-bold">{checklistCompleted}/{preProductionChecklist.length}</p>
              <Progress value={(checklistCompleted / preProductionChecklist.length) * 100} className="h-1 mt-1" />
            </CardContent>
          </Card>
          <Card className={stats.overdue > 0 ? "border-warning/30" : ""}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">Alertas</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <p className={cn("text-2xl font-bold", alerts.length > 0 && "text-warning")}>{alerts.length}</p>
                  <Badge className={cn("text-[10px]", stats.overdue > 0 ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground")}>
                    {stats.overdue > 0 ? `${stats.overdue} vencidas` : 'Sin alertas'}
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
          <TabsList className="bg-card border flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="tareas" className="gap-1.5 text-xs">
              <ClipboardList className="h-3.5 w-3.5" />
              Tareas
            </TabsTrigger>
            <TabsTrigger value="proveedores" className="gap-1.5 text-xs">
              <Truck className="h-3.5 w-3.5" />
              Proveedores
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="produccion" className="gap-1.5 text-xs">
              <Music className="h-3.5 w-3.5" />
              Producción
            </TabsTrigger>
            <TabsTrigger value="logistica" className="gap-1.5 text-xs">
              <HardHat className="h-3.5 w-3.5" />
              Logística
            </TabsTrigger>
            <TabsTrigger value="calendario" className="gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Calendario
            </TabsTrigger>
          </TabsList>

          {/* ============ TAREAS TAB ============ */}
          <TabsContent value="tareas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold">Gestión de Tareas</h2>
              <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva tarea
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 space-y-4">
                {/* Filters */}
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
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue placeholder="Área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {Object.entries(areaLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v as TaskStatus | 'all' }))}>
                        <SelectTrigger className="w-[110px] h-9">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {Object.entries(statusLabels).map(([key, label]) => (
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

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Card key={i}>
                        <CardContent className="py-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <p className="text-destructive font-medium">Error al cargar tareas</p>
                      <p className="text-sm text-muted-foreground mt-1">Intenta recargar la página</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {viewMode === 'list' && (
                      <div className="space-y-3">
                        {tasks.map(task => (
                          <TaskCard key={task.id} task={task as any} onOpen={handleOpenTask as any} onStatusChange={handleStatusChange} onDelete={deleteTask} />
                        ))}
                        {tasks.length === 0 && (
                          <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No hay tareas creadas</p>
                              <Button onClick={() => setCreateOpen(true)} variant="outline" size="sm" className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear primera tarea
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                    {viewMode === 'kanban' && <KanbanViewDnd tasksByStatus={tasksByStatus as any} onOpenTask={handleOpenTask as any} onStatusChange={handleStatusChange} onDeleteTask={deleteTask} />}
                    {viewMode === 'timeline' && <TimelineView tasks={allTasks as any} milestones={milestones as any} onOpenTask={handleOpenTask as any} />}
                  </>
                )}
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel alerts={alerts} onOpenTask={handleOpenTaskById} />
              </div>
            </div>
          </TabsContent>

          {/* ============ PROVEEDORES TAB ============ */}
          <TabsContent value="proveedores" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Gestión de Proveedores</CardTitle>
                    <CardDescription>Presupuestos, entregables y estado de contratación</CardDescription>
                  </div>
                  <Button size="sm">Añadir Proveedor</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{vendor.name}</p>
                            {getStatusBadge(vendor.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">{vendor.category} • Deadline: {vendor.deadline}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{vendor.budget.toLocaleString('es-ES')}</p>
                          <p className="text-xs text-muted-foreground">Pagado: €{vendor.paid.toLocaleString('es-ES')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Pagos</span>
                            <span>{((vendor.paid / vendor.budget) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(vendor.paid / vendor.budget) * 100} className="h-1.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Entregables</span>
                            <span>{vendor.delivered}/{vendor.deliverables}</span>
                          </div>
                          <Progress value={(vendor.delivered / vendor.deliverables) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ PERSONAL TAB ============ */}
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Gestión de Personal</CardTitle>
                    <CardDescription>Roles, confirmaciones y documentación</CardDescription>
                  </div>
                  <Button size="sm">Gestionar Turnos</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-center">Requerido</TableHead>
                      <TableHead className="text-center">Confirmado</TableHead>
                      <TableHead className="text-center">Pendiente</TableHead>
                      <TableHead className="text-center">Docs</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffRoles.map((role, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{role.role}</TableCell>
                        <TableCell className="text-center">{role.required}</TableCell>
                        <TableCell className="text-center text-success font-medium">{role.confirmed}</TableCell>
                        <TableCell className="text-center">
                          {role.pending > 0 ? <span className="text-warning font-medium">{role.pending}</span> : '—'}
                        </TableCell>
                        <TableCell className="text-center">
                          {role.docs ? <CheckCircle2 className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-destructive mx-auto" />}
                        </TableCell>
                        <TableCell className="text-center">
                          <Progress value={(role.confirmed / role.required) * 100} className="h-1.5 w-20 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ PRODUCCIÓN TAB ============ */}
          <TabsContent value="produccion" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Estado de Producción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {productionItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{item.category} • {item.responsible}</span>
                        <span>Deadline: {item.deadline}</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Checklist Pre-Producción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {preProductionChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox checked={item.completed} />
                      <span className={cn("text-sm flex-1", item.completed && "line-through text-muted-foreground")}>
                        {item.task}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ LOGÍSTICA TAB ============ */}
          <TabsContent value="logistica" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Permisos y Licencias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {logisticsItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Issues / Bloqueos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {preEventIssues.map((issue) => (
                    <div key={issue.id} className={cn(
                      "p-3 rounded-lg border",
                      issue.severity === 'high' ? "border-destructive/50 bg-destructive/5" : "border-warning/50 bg-warning/5"
                    )}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{issue.title}</span>
                        <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'}>
                          {issue.severity === 'high' ? 'Alta' : 'Media'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{issue.area}</span>
                        <span>Asignado: {issue.assignedTo}</span>
                        <span>{issue.daysOpen} días abierto</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ CALENDARIO TAB ============ */}
          <TabsContent value="calendario" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hitos Pre-Festival</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {calendarMilestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10",
                          milestone.status === 'completed' ? "bg-success text-success-foreground" :
                          milestone.status === 'in_progress' ? "bg-warning text-warning-foreground" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {milestone.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                           milestone.status === 'in_progress' ? <Clock className="h-4 w-4" /> :
                           <CircleDot className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{milestone.title}</span>
                            {getStatusBadge(milestone.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">{milestone.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
