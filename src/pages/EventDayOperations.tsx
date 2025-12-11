import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
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
  Gauge,
  Timer,
  ArrowRight,
  UserCheck,
  TrendingUp
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Quick stats for event day
const liveStats = [
  { label: 'Asistentes dentro', value: '12,450', max: '20,000', icon: Users, percentage: 62, trend: '+850/h' },
  { label: 'Tiempo espera acceso', value: '8 min', max: '15 min', icon: Timer, percentage: 53, trend: 'Normal' },
  { label: 'Incidencias activas', value: '2', max: null, icon: AlertTriangle, percentage: null, trend: '2 resueltas' },
  { label: 'Staff operativo', value: '247', max: '267', icon: UserCheck, percentage: 92, trend: '92%' },
];

// Access points with real-time data
const accessPoints = [
  { id: 'A1', name: 'Acceso Principal Norte', lanes: 8, status: 'operational', flow: 1200, maxFlow: 1500, waitTime: 8, queue: 450 },
  { id: 'A2', name: 'Acceso Principal Sur', lanes: 6, status: 'operational', flow: 850, maxFlow: 1100, waitTime: 6, queue: 280 },
  { id: 'A3', name: 'Acceso VIP', lanes: 2, status: 'operational', flow: 120, maxFlow: 200, waitTime: 2, queue: 15 },
  { id: 'A4', name: 'Acceso Proveedores', lanes: 2, status: 'operational', flow: 45, maxFlow: 100, waitTime: 1, queue: 5 },
  { id: 'E1', name: 'Salida Emergencia 1', lanes: 4, status: 'standby', flow: 0, maxFlow: 2000, waitTime: 0, queue: 0 },
  { id: 'E2', name: 'Salida Emergencia 2', lanes: 4, status: 'standby', flow: 0, maxFlow: 2000, waitTime: 0, queue: 0 },
];

// Staff by area (live)
const liveStaffByArea = [
  { area: 'Seguridad', expected: 85, present: 78, icon: Shield, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { area: 'Accesos', expected: 45, present: 42, icon: DoorOpen, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { area: 'Barras', expected: 65, present: 58, icon: UtensilsCrossed, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { area: 'Limpieza', expected: 35, present: 35, icon: Droplets, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { area: 'Técnico', expected: 25, present: 22, icon: Zap, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { area: 'Coordinación', expected: 12, present: 12, icon: Radio, color: 'text-green-500', bgColor: 'bg-green-500/10' },
];

// Live incidents
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

// Venue zones with live occupancy
const venueZones = [
  { id: 'main-stage', name: 'Escenario Principal', capacity: 15000, current: 8500, status: 'normal', icon: Volume2 },
  { id: 'pista', name: 'Zona Pista', capacity: 25000, current: 12000, status: 'normal', icon: Users },
  { id: 'vip', name: 'Área VIP', capacity: 2000, current: 1650, status: 'high', icon: Shield },
  { id: 'food-court', name: 'Food Court', capacity: 5000, current: 2800, status: 'normal', icon: UtensilsCrossed },
  { id: 'grada-lat', name: 'Grada Lateral', capacity: 4000, current: 2200, status: 'normal', icon: LayoutGrid },
  { id: 'grada-sup', name: 'Grada Superior', capacity: 2500, current: 1800, status: 'high', icon: LayoutGrid },
];

// Bar consumption data
const barStations = [
  { id: 'B1', name: 'Barra Central', transactions: 1250, revenue: 8750, stock: 72, staffPresent: 12 },
  { id: 'B2', name: 'Barra Pista Norte', transactions: 890, revenue: 6230, stock: 65, staffPresent: 8 },
  { id: 'B3', name: 'Barra Pista Sur', transactions: 920, revenue: 6440, stock: 78, staffPresent: 8 },
  { id: 'B4', name: 'Barra VIP', transactions: 420, revenue: 5040, stock: 85, staffPresent: 6 },
  { id: 'B5', name: 'Barra Grada', transactions: 380, revenue: 2660, stock: 45, staffPresent: 5 },
  { id: 'B6', name: 'Punto de Agua', transactions: 1800, revenue: 0, stock: 90, staffPresent: 4 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
    case 'normal':
    case 'resolved': return 'text-success bg-success/10';
    case 'high':
    case 'attending': return 'text-warning bg-warning/10';
    case 'standby': return 'text-muted-foreground bg-muted';
    case 'critical': return 'text-destructive bg-destructive/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
    case 'normal':
    case 'resolved': return <CheckCircle2 className="h-3.5 w-3.5" />;
    case 'high':
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

const EventDayOperations = () => {
  const totalExpected = liveStaffByArea.reduce((acc, s) => acc + s.expected, 0);
  const totalPresent = liveStaffByArea.reduce((acc, s) => acc + s.present, 0);
  const totalTransactions = barStations.reduce((acc, b) => acc + b.transactions, 0);
  const totalRevenue = barStations.reduce((acc, b) => acc + b.revenue, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Operaciones", href: "#" }, { label: "Día del Festival" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Operaciones en Vivo
            </h1>
            <p className="text-sm text-muted-foreground">
              Centro de control - 29 de marzo de 2025
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              En Directo
            </Badge>
            <Button variant="destructive" size="sm" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Emergencias
            </Button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {liveStats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs text-success font-medium">{stat.trend}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.max && <p className="text-xs text-muted-foreground">/ {stat.max}</p>}
                </div>
                {stat.percentage && <Progress value={stat.percentage} className="h-1.5 mt-2" />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incidents Panel */}
          <Card className="lg:col-span-2 border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <CardTitle className="text-base">Panel de Incidencias</CardTitle>
                </div>
                <Badge variant="outline">
                  {liveIncidents.filter(i => i.status === 'attending').length} activas
                </Badge>
              </div>
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
                      <span>{incident.status === 'attending' ? 'Atendiendo' : 'Resuelto'}</span>
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
            </CardContent>
          </Card>

          {/* Staff Present */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Staff Presente</CardTitle>
                <Badge variant={totalPresent >= totalExpected * 0.9 ? 'default' : 'destructive'}>
                  {totalPresent}/{totalExpected}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveStaffByArea.map((area, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${area.bgColor}`}>
                    <area.icon className={`h-4 w-4 ${area.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{area.area}</span>
                      <span className={area.present < area.expected ? 'text-warning font-medium' : ''}>
                        {area.present}/{area.expected}
                      </span>
                    </div>
                    <Progress value={(area.present / area.expected) * 100} className="h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Access & Zones */}
        <Tabs defaultValue="access" className="space-y-4">
          <TabsList className="bg-card border">
            <TabsTrigger value="access" className="gap-1.5">
              <DoorOpen className="h-3.5 w-3.5" />
              Accesos
            </TabsTrigger>
            <TabsTrigger value="zones" className="gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" />
              Zonas
            </TabsTrigger>
            <TabsTrigger value="bars" className="gap-1.5">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              Barras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accessPoints.map((access) => (
                <Card key={access.id} className={access.status === 'standby' ? 'opacity-60' : ''}>
                  <CardContent className="pt-4">
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
                    {access.status !== 'standby' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Flujo actual</span>
                          <span className="font-medium">{access.flow}/h</span>
                        </div>
                        <Progress value={(access.flow / access.maxFlow) * 100} className="h-1.5" />
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span>{access.waitTime} min espera</span>
                          </div>
                          <span>{access.queue} en cola</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full w-fit ${getStatusColor('standby')}`}>
                        {getStatusIcon('standby')}
                        <span>En espera</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="zones">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {venueZones.map((zone) => {
                const occupancy = (zone.current / zone.capacity) * 100;
                return (
                  <Card key={zone.id} className="text-center">
                    <CardContent className="pt-4">
                      <div className={`h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${getStatusColor(zone.status)}`}>
                        <zone.icon className="h-6 w-6" />
                      </div>
                      <p className="font-medium text-sm mb-1">{zone.name}</p>
                      <p className="text-xl font-bold">{(zone.current / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground mb-2">de {(zone.capacity / 1000).toFixed(0)}K</p>
                      <Progress 
                        value={occupancy} 
                        className={`h-2 ${occupancy > 80 ? '[&>div]:bg-warning' : ''}`} 
                      />
                      <p className="text-xs mt-1 font-medium">{occupancy.toFixed(0)}%</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bars">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Consumos en Barras</CardTitle>
                    <CardDescription>Transacciones y stock en tiempo real</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">€{totalRevenue.toLocaleString('es-ES')}</p>
                    <p className="text-xs text-muted-foreground">{totalTransactions.toLocaleString('es-ES')} transacciones</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {barStations.map((bar) => (
                    <div key={bar.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-sm">
                            {bar.id}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{bar.name}</p>
                            <p className="text-xs text-muted-foreground">{bar.staffPresent} personal</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded bg-muted/30">
                          <p className="text-sm font-bold">{bar.transactions}</p>
                          <p className="text-[10px] text-muted-foreground">ventas</p>
                        </div>
                        <div className="p-2 rounded bg-muted/30">
                          <p className="text-sm font-bold">€{bar.revenue}</p>
                          <p className="text-[10px] text-muted-foreground">ingresos</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Stock</span>
                          <span className={bar.stock < 50 ? 'text-destructive font-medium' : bar.stock < 70 ? 'text-warning font-medium' : ''}>
                            {bar.stock}%
                          </span>
                        </div>
                        <Progress 
                          value={bar.stock} 
                          className={`h-1.5 ${bar.stock < 50 ? '[&>div]:bg-destructive' : bar.stock < 70 ? '[&>div]:bg-warning' : ''}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Environment Sensors */}
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

export default EventDayOperations;