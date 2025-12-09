import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
  Truck, 
  AlertTriangle,
  Clock,
  MapPin,
  Radio,
  Zap,
  Droplets,
  Volume2,
  DoorOpen,
  UtensilsCrossed,
  Wifi,
  ThermometerSun,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Activity,
  LayoutGrid,
  Calendar
} from "lucide-react";

// Staff by area
const staffByArea = [
  { area: 'Seguridad', total: 85, assigned: 78, icon: Shield, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { area: 'Accesos', total: 45, assigned: 42, icon: DoorOpen, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { area: 'Barras', total: 65, assigned: 58, icon: UtensilsCrossed, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { area: 'Limpieza', total: 35, assigned: 35, icon: Droplets, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { area: 'Técnico', total: 25, assigned: 22, icon: Zap, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { area: 'Coordinación', total: 12, assigned: 12, icon: Radio, color: 'text-green-500', bgColor: 'bg-green-500/10' },
];

// Staff schedule
const staffSchedule = [
  { time: '16:00', accesos: 15, seguridad: 25, barras: 10, limpieza: 10, tecnico: 15 },
  { time: '17:00', accesos: 30, seguridad: 45, barras: 25, limpieza: 15, tecnico: 20 },
  { time: '18:00', accesos: 45, seguridad: 65, barras: 45, limpieza: 20, tecnico: 22 },
  { time: '19:00', accesos: 45, seguridad: 85, barras: 65, limpieza: 25, tecnico: 25 },
  { time: '20:00', accesos: 35, seguridad: 85, barras: 65, limpieza: 30, tecnico: 25 },
  { time: '21:00', accesos: 25, seguridad: 85, barras: 65, limpieza: 35, tecnico: 25 },
  { time: '22:00', accesos: 15, seguridad: 80, barras: 60, limpieza: 35, tecnico: 22 },
  { time: '23:00', accesos: 10, seguridad: 75, barras: 55, limpieza: 35, tecnico: 20 },
  { time: '00:00', accesos: 5, seguridad: 70, barras: 45, limpieza: 30, tecnico: 18 },
  { time: '01:00', accesos: 0, seguridad: 60, barras: 30, limpieza: 25, tecnico: 15 },
  { time: '02:00', accesos: 0, seguridad: 45, barras: 15, limpieza: 35, tecnico: 12 },
];

// Venue zones
const venueZones = [
  { id: 'main-stage', name: 'Escenario Principal', capacity: 15000, status: 'ready', icon: Volume2 },
  { id: 'pista', name: 'Zona Pista', capacity: 25000, status: 'ready', icon: Users },
  { id: 'vip', name: 'Área VIP', capacity: 2000, status: 'ready', icon: Shield },
  { id: 'food-court', name: 'Food Court', capacity: 5000, status: 'pending', icon: UtensilsCrossed },
  { id: 'grada-lat', name: 'Grada Lateral', capacity: 4000, status: 'ready', icon: LayoutGrid },
  { id: 'grada-sup', name: 'Grada Superior', capacity: 2500, status: 'warning', icon: LayoutGrid },
];

// Access points
const accessPoints = [
  { id: 'A1', name: 'Acceso Principal Norte', lanes: 8, status: 'operational', flow: 1200 },
  { id: 'A2', name: 'Acceso Principal Sur', lanes: 6, status: 'operational', flow: 850 },
  { id: 'A3', name: 'Acceso VIP', lanes: 2, status: 'operational', flow: 120 },
  { id: 'A4', name: 'Acceso Proveedores', lanes: 2, status: 'operational', flow: 45 },
  { id: 'E1', name: 'Salida Emergencia 1', lanes: 4, status: 'standby', flow: 0 },
  { id: 'E2', name: 'Salida Emergencia 2', lanes: 4, status: 'standby', flow: 0 },
];

// Bar stations
const barStations = [
  { id: 'B1', name: 'Barra Central', staff: 12, status: 'ready', stock: 95 },
  { id: 'B2', name: 'Barra Pista Norte', staff: 8, status: 'ready', stock: 88 },
  { id: 'B3', name: 'Barra Pista Sur', staff: 8, status: 'ready', stock: 92 },
  { id: 'B4', name: 'Barra VIP', staff: 6, status: 'ready', stock: 100 },
  { id: 'B5', name: 'Barra Grada', staff: 6, status: 'warning', stock: 65 },
  { id: 'B6', name: 'Punto de Agua', staff: 4, status: 'ready', stock: 100 },
];

// Live incidents (simulated for event day)
const liveIncidents = [
  { 
    id: 1, 
    time: '20:45', 
    type: 'medical', 
    severity: 'medium',
    location: 'Zona Pista - Sector 3',
    description: 'Asistente con síntomas de deshidratación',
    status: 'attending',
    assignedTo: 'Equipo Médico 2'
  },
  { 
    id: 2, 
    time: '20:32', 
    type: 'security', 
    severity: 'low',
    location: 'Acceso Principal Norte',
    description: 'Intento de acceso con entrada duplicada',
    status: 'resolved',
    assignedTo: 'Seguridad Accesos'
  },
  { 
    id: 3, 
    time: '20:15', 
    type: 'technical', 
    severity: 'high',
    location: 'Barra Grada',
    description: 'Fallo en TPV - Sistema de pago caído',
    status: 'attending',
    assignedTo: 'Técnico IT 1'
  },
  { 
    id: 4, 
    time: '19:58', 
    type: 'logistics', 
    severity: 'medium',
    location: 'Barra Pista Norte',
    description: 'Stock bajo de agua embotellada',
    status: 'resolved',
    assignedTo: 'Logística'
  },
];

// Quick stats
const quickStats = [
  { label: 'Asistentes dentro', value: '12,450', max: '20,000', icon: Users, trend: '+850/h' },
  { label: 'Tiempo espera acceso', value: '8 min', max: '15 min', icon: Clock, trend: 'Normal' },
  { label: 'Incidencias activas', value: '2', max: '—', icon: AlertTriangle, trend: '2 resueltas' },
  { label: 'Staff operativo', value: '247', max: '267', icon: Shield, trend: '92%' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready':
    case 'operational':
    case 'resolved': return 'text-success bg-success/10';
    case 'warning':
    case 'attending': return 'text-warning bg-warning/10';
    case 'pending':
    case 'standby': return 'text-muted-foreground bg-muted';
    case 'critical': return 'text-destructive bg-destructive/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ready':
    case 'operational':
    case 'resolved': return <CheckCircle2 className="h-3.5 w-3.5" />;
    case 'warning':
    case 'attending': return <AlertCircle className="h-3.5 w-3.5" />;
    case 'critical': return <XCircle className="h-3.5 w-3.5" />;
    default: return <Clock className="h-3.5 w-3.5" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'border-destructive/50 bg-destructive/5';
    case 'medium': return 'border-warning/50 bg-warning/5';
    case 'low': return 'border-muted bg-muted/30';
    default: return 'border-muted';
  }
};

const Operations = () => {
  const totalStaff = staffByArea.reduce((acc, s) => acc + s.total, 0);
  const assignedStaff = staffByArea.reduce((acc, s) => acc + s.assigned, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Operaciones del Festival
            </h1>
            <p className="text-muted-foreground">
              Centro de control operativo - Primaverando 2025
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Sistema Operativo
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Emergencias
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.max !== '—' && <span className="text-foreground">/ {stat.max} </span>}
                  <span className="text-success">{stat.trend}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Incidents Panel */}
          <Card className="lg:col-span-2 border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <CardTitle className="text-base">Panel de Incidencias en Vivo</CardTitle>
                </div>
                <Badge variant="outline">
                  {liveIncidents.filter(i => i.status === 'attending').length} activas
                </Badge>
              </div>
              <CardDescription>Monitorización en tiempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(incident.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={incident.status === 'resolved' ? 'secondary' : 'default'}
                        className="text-[10px] uppercase"
                      >
                        {incident.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{incident.time}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)}
                      <span className="capitalize">{incident.status === 'attending' ? 'Atendiendo' : 'Resuelto'}</span>
                    </div>
                  </div>
                  <p className="font-medium text-sm mb-1">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {incident.location}
                    </div>
                    <span>→ {incident.assignedTo}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                Ver historial completo
              </Button>
            </CardContent>
          </Card>

          {/* Staff by Area */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Personal por Área</CardTitle>
                <Badge variant="secondary">{assignedStaff}/{totalStaff}</Badge>
              </div>
              <CardDescription>Staff asignado vs requerido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {staffByArea.map((area, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${area.bgColor}`}>
                        <area.icon className={`h-4 w-4 ${area.color}`} />
                      </div>
                      <span className="text-sm font-medium">{area.area}</span>
                    </div>
                    <span className="text-sm">
                      <span className="font-semibold">{area.assigned}</span>
                      <span className="text-muted-foreground">/{area.total}</span>
                    </span>
                  </div>
                  <Progress 
                    value={(area.assigned / area.total) * 100} 
                    className="h-1.5" 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Venue Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vista General del Recinto</CardTitle>
            <CardDescription>Estado de zonas, accesos y servicios</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="zones" className="space-y-4">
              <TabsList>
                <TabsTrigger value="zones">Zonas</TabsTrigger>
                <TabsTrigger value="access">Accesos</TabsTrigger>
                <TabsTrigger value="bars">Barras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="zones">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {venueZones.map((zone) => (
                    <div 
                      key={zone.id} 
                      className="p-4 rounded-lg border-2 bg-card hover:bg-accent/5 transition-colors text-center"
                    >
                      <div className={`h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${getStatusColor(zone.status)}`}>
                        <zone.icon className="h-6 w-6" />
                      </div>
                      <p className="font-medium text-sm mb-1">{zone.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Cap. {zone.capacity.toLocaleString('es-ES')}
                      </p>
                      <div className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(zone.status)}`}>
                        {getStatusIcon(zone.status)}
                        <span className="capitalize">
                          {zone.status === 'ready' ? 'Listo' : zone.status === 'pending' ? 'Pendiente' : 'Revisar'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="access">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {accessPoints.map((access) => (
                    <div 
                      key={access.id} 
                      className="p-4 rounded-lg border-2 bg-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            {access.id}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{access.name}</p>
                            <p className="text-xs text-muted-foreground">{access.lanes} carriles</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(access.status)}`}>
                          {getStatusIcon(access.status)}
                          <span className="capitalize">
                            {access.status === 'operational' ? 'Operativo' : 'En espera'}
                          </span>
                        </div>
                        {access.flow > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {access.flow}/h
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="bars">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {barStations.map((bar) => (
                    <div 
                      key={bar.id} 
                      className="p-4 rounded-lg border-2 bg-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-sm">
                            {bar.id}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{bar.name}</p>
                            <p className="text-xs text-muted-foreground">{bar.staff} personal</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Stock</span>
                          <span className={bar.stock < 70 ? 'text-warning font-medium' : 'text-foreground'}>
                            {bar.stock}%
                          </span>
                        </div>
                        <Progress 
                          value={bar.stock} 
                          className={`h-1.5 ${bar.stock < 70 ? '[&>div]:bg-warning' : ''}`} 
                        />
                        <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit ${getStatusColor(bar.status)}`}>
                          {getStatusIcon(bar.status)}
                          <span className="capitalize">
                            {bar.status === 'ready' ? 'Listo' : 'Revisar stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Staff Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Horarios del Staff
                </CardTitle>
                <CardDescription>Distribución de personal por hora</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Exportar Turnos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Hora</th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <DoorOpen className="h-3.5 w-3.5" />
                        Accesos
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="h-3.5 w-3.5" />
                        Seguridad
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        Barras
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="h-3.5 w-3.5" />
                        Limpieza
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        Técnico
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {staffSchedule.map((row, index) => {
                    const total = row.accesos + row.seguridad + row.barras + row.limpieza + row.tecnico;
                    const isPeak = total > 200;
                    return (
                      <tr 
                        key={index} 
                        className={`border-b border-border/50 ${isPeak ? 'bg-primary/5' : ''}`}
                      >
                        <td className="py-2.5 px-3 font-medium">{row.time}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={row.accesos === 0 ? 'text-muted-foreground' : ''}>{row.accesos}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-medium text-red-500">{row.seguridad}</td>
                        <td className="py-2.5 px-3 text-center">{row.barras}</td>
                        <td className="py-2.5 px-3 text-center">{row.limpieza}</td>
                        <td className="py-2.5 px-3 text-center">{row.tecnico}</td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant={isPeak ? 'default' : 'secondary'} className="text-xs">
                            {total}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Environment Sensors (Placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-dashed">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ThermometerSun className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="text-lg font-bold">22°C</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Humedad</p>
                <p className="text-lg font-bold">45%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nivel Sonoro</p>
                <p className="text-lg font-bold">92 dB</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Red WiFi</p>
                <p className="text-lg font-bold">Óptima</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Operations;