import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Truck, 
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  HardHat,
  Music,
  ClipboardList,
  Euro,
  FileCheck,
  Wrench,
  MapPin,
  Timer,
  CircleDot,
  XCircle,
  ArrowRight
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Vendors
const vendors = [
  { 
    id: 1, 
    name: 'SoundPro Audio Systems', 
    category: 'Sonido',
    budget: 45000,
    paid: 22500,
    status: 'contracted',
    deliverables: 4,
    delivered: 2,
    deadline: '15 Mar'
  },
  { 
    id: 2, 
    name: 'LightStage Productions', 
    category: 'Iluminación',
    budget: 32000,
    paid: 16000,
    status: 'contracted',
    deliverables: 3,
    delivered: 1,
    deadline: '20 Mar'
  },
  { 
    id: 3, 
    name: 'SecurEvent Andalucía', 
    category: 'Seguridad',
    budget: 28000,
    paid: 14000,
    status: 'contracted',
    deliverables: 5,
    delivered: 3,
    deadline: '25 Mar'
  },
  { 
    id: 4, 
    name: 'FoodTruck Collective', 
    category: 'Catering',
    budget: 15000,
    paid: 0,
    status: 'pending',
    deliverables: 2,
    delivered: 0,
    deadline: '28 Mar'
  },
  { 
    id: 5, 
    name: 'CleanMax Services', 
    category: 'Limpieza',
    budget: 12000,
    paid: 6000,
    status: 'contracted',
    deliverables: 2,
    delivered: 1,
    deadline: '27 Mar'
  },
];

// Staff roles for pre-festival
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

// Production items
const productionItems = [
  { 
    id: 1, 
    name: 'Escenario Principal',
    category: 'Escenarios',
    status: 'in_progress',
    progress: 65,
    deadline: '26 Mar',
    responsible: 'SoundPro'
  },
  { 
    id: 2, 
    name: 'Rider Villalobos',
    category: 'Riders',
    status: 'pending',
    progress: 30,
    deadline: '20 Mar',
    responsible: 'Producción'
  },
  { 
    id: 3, 
    name: 'Rider Henry Méndez',
    category: 'Riders',
    status: 'completed',
    progress: 100,
    deadline: '15 Mar',
    responsible: 'Producción'
  },
  { 
    id: 4, 
    name: 'Sistema PA Pista',
    category: 'Sonido',
    status: 'in_progress',
    progress: 80,
    deadline: '27 Mar',
    responsible: 'SoundPro'
  },
  { 
    id: 5, 
    name: 'Iluminación VIP',
    category: 'Iluminación',
    status: 'completed',
    progress: 100,
    deadline: '22 Mar',
    responsible: 'LightStage'
  },
];

// Logistics & Permits
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

// Calendar milestones
const milestones = [
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

// Pre-production checklist
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

// Issues/blockers
const preEventIssues = [
  { 
    id: 1, 
    title: 'Retraso entrega estructura escenario',
    severity: 'high',
    area: 'Producción',
    status: 'open',
    daysOpen: 5,
    assignedTo: 'Carlos M.'
  },
  { 
    id: 2, 
    title: 'Pendiente confirmación 13 guardias seguridad',
    severity: 'medium',
    area: 'RRHH',
    status: 'in_progress',
    daysOpen: 3,
    assignedTo: 'Laura S.'
  },
  { 
    id: 3, 
    title: 'Rider técnico Villalobos incompleto',
    severity: 'medium',
    area: 'Producción',
    status: 'in_progress',
    daysOpen: 8,
    assignedTo: 'Miguel R.'
  },
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
    default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const PreFestivalOperations = () => {
  const totalStaffRequired = staffRoles.reduce((acc, r) => acc + r.required, 0);
  const totalStaffConfirmed = staffRoles.reduce((acc, r) => acc + r.confirmed, 0);
  const totalBudget = vendors.reduce((acc, v) => acc + v.budget, 0);
  const totalPaid = vendors.reduce((acc, v) => acc + v.paid, 0);
  const checklistCompleted = preProductionChecklist.filter(c => c.completed).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Operaciones", href: "#" }, { label: "Pre-Festival" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-lg font-bold text-foreground">Operaciones Pre-Festival</h1>
            <p className="text-xs text-muted-foreground">Gestión de producción, proveedores y logística previa al evento</p>
          </div>
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Calendar className="h-3 w-3" />
            112 días para el festival
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{totalStaffConfirmed}/{totalStaffRequired}</p>
              <Progress value={(totalStaffConfirmed / totalStaffRequired) * 100} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Staff confirmado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Euro className="h-4 w-4 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold">€{(totalPaid / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground mt-1">
                de €{(totalBudget / 1000).toFixed(0)}K ({((totalPaid / totalBudget) * 100).toFixed(0)}%)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-accent/20">
                  <ClipboardList className="h-4 w-4 text-accent-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold">{checklistCompleted}/{preProductionChecklist.length}</p>
              <Progress value={(checklistCompleted / preProductionChecklist.length) * 100} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Checklist pre-prod</p>
            </CardContent>
          </Card>
          
          <Card className="border-warning/30">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertCircle className="h-4 w-4 text-warning" />
                </div>
              </div>
              <p className="text-2xl font-bold text-warning">{preEventIssues.filter(i => i.status !== 'resolved').length}</p>
              <p className="text-xs text-warning mt-1">Bloqueos activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="vendors" className="space-y-4">
          <TabsList className="bg-card border">
            <TabsTrigger value="vendors" className="gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Proveedores
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="production" className="gap-1.5">
              <Music className="h-3.5 w-3.5" />
              Producción
            </TabsTrigger>
            <TabsTrigger value="logistics" className="gap-1.5">
              <HardHat className="h-3.5 w-3.5" />
              Logística
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Calendario
            </TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
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

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rol</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Requerido</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Confirmado</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Pendiente</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Docs</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffRoles.map((role, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-3 px-2 font-medium">{role.role}</td>
                          <td className="py-3 px-2 text-center">{role.required}</td>
                          <td className="py-3 px-2 text-center text-success font-medium">{role.confirmed}</td>
                          <td className="py-3 px-2 text-center">
                            {role.pending > 0 ? (
                              <span className="text-warning font-medium">{role.pending}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {role.docs ? (
                              <CheckCircle2 className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive mx-auto" />
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Progress 
                              value={(role.confirmed / role.required) * 100} 
                              className="h-1.5 w-16 mx-auto" 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Producción y Riders</CardTitle>
                    <CardDescription>Escenarios, equipamiento técnico y asignaciones</CardDescription>
                  </div>
                  <Button size="sm">Añadir Item</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productionItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category} • {item.responsible}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">{item.deadline}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12 text-right">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Permisos y Licencias</CardTitle>
                  <CardDescription>Estado de documentación legal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {logisticsItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
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
                  <CardTitle className="text-base">Checklist Pre-Producción</CardTitle>
                  <CardDescription>{checklistCompleted} de {preProductionChecklist.length} completados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {preProductionChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5">
                      <Checkbox checked={item.completed} />
                      <div className="flex-1">
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Calendario Operativo</CardTitle>
                <CardDescription>Hitos y deadlines previos al festival</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="relative flex gap-4 pl-10">
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                          milestone.status === 'completed' ? 'bg-success border-success' :
                          milestone.status === 'in_progress' ? 'bg-warning border-warning' :
                          'bg-background border-muted-foreground'
                        }`} />
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${milestone.status === 'completed' ? 'text-muted-foreground' : ''}`}>
                              {milestone.title}
                            </p>
                            <Badge variant={milestone.status === 'completed' ? 'secondary' : 'outline'}>
                              {milestone.date}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Issues/Blockers */}
        <Card className="border-warning/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <CardTitle className="text-base">Incidencias y Bloqueos</CardTitle>
            </div>
            <CardDescription>Problemas que requieren resolución antes del evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {preEventIssues.map((issue) => (
              <div 
                key={issue.id} 
                className={`p-4 rounded-lg border-2 ${
                  issue.severity === 'high' ? 'border-destructive/50 bg-destructive/5' :
                  'border-warning/50 bg-warning/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {issue.severity === 'high' ? 'Alta' : 'Media'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{issue.area}</Badge>
                    </div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Abierto hace {issue.daysOpen} días • Asignado a: {issue.assignedTo}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Resolver</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreFestivalOperations;