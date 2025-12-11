import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Calendar, Users, Euro, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  ComposedChart
} from "recharts";
import { festivalData } from "@/data/festivalData";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Generate simulated daily sales data
const generateDailySalesData = () => {
  const data = [];
  const startDate = new Date('2024-11-01');
  const today = new Date('2024-12-07');
  let accumulated = 0;
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base sales with some randomness
    let dailySales = Math.floor(Math.random() * 150) + 80;
    
    // Weekend boost
    if (isWeekend) dailySales *= 1.4;
    
    // Early bird boost (first 2 weeks)
    const daysFromStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysFromStart < 14) dailySales *= 1.8;
    
    // Black Friday boost
    if (d.getMonth() === 10 && d.getDate() >= 25 && d.getDate() <= 30) {
      dailySales *= 2.2;
    }
    
    accumulated += dailySales;
    
    data.push({
      date: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      fullDate: new Date(d),
      ventas: Math.floor(dailySales),
      acumulado: Math.min(accumulated, festivalData.overview.entradasVendidas),
      ingresos: Math.floor(dailySales * 25)
    });
  }
  
  return data;
};

// Weekly comparison data
const weeklyComparison = [
  { semana: 'Sem -4', actual: 850, anterior: 720, proyectado: 800 },
  { semana: 'Sem -3', actual: 1120, anterior: 890, proyectado: 950 },
  { semana: 'Sem -2', actual: 1450, anterior: 1100, proyectado: 1200 },
  { semana: 'Sem -1', actual: 980, anterior: 1250, proyectado: 1100 },
  { semana: 'Actual', actual: 1280, anterior: 1050, proyectado: 1150 },
];

// Projection data
const projectionData = [
  { mes: 'Nov', real: 4200, proyectado: 4000 },
  { mes: 'Dic', real: 3800, proyectado: 4500 },
  { mes: 'Ene', real: null, proyectado: 3500 },
  { mes: 'Feb', real: null, proyectado: 2800 },
  { mes: 'Mar', real: null, proyectado: 1950 },
];

const SalesForecasts = () => {
  const dailySalesData = useMemo(() => generateDailySalesData(), []);
  
  const { overview, aforoTotal, precios } = festivalData;
  const ticketsSold = overview.entradasVendidas;
  const ticketsRemaining = aforoTotal - ticketsSold;
  const occupancy = overview.ocupacion * 100;
  const avgPrice = overview.ingresosTotales / ticketsSold;
  const targetRevenue = aforoTotal * precios.general;
  const revenueProgress = (overview.ingresosTotales / targetRevenue) * 100;
  
  // Calculate week-over-week change
  const lastWeekSales = weeklyComparison[weeklyComparison.length - 2].actual;
  const thisWeekSales = weeklyComparison[weeklyComparison.length - 1].actual;
  const weekChange = ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
  
  // Days until festival
  const festivalDate = new Date('2025-03-29');
  const today = new Date();
  const daysRemaining = Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Ventas & Previsiones" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Ventas & Previsiones
            </h1>
            <p className="text-sm text-muted-foreground">
              Análisis de ventas y proyecciones
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            {daysRemaining} días para el festival
          </Badge>
        </div>

        {/* Estado Actual vs Objetivo - Tarjeta Grande */}
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Estado Actual vs Objetivo
              </CardTitle>
              <Badge variant={occupancy >= 75 ? "default" : occupancy >= 50 ? "secondary" : "destructive"}>
                {occupancy >= 75 ? "En objetivo" : occupancy >= 50 ? "En progreso" : "Por debajo"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ocupación */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Ocupación del aforo</p>
                    <p className="text-4xl font-bold">{occupancy.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-lg font-semibold text-primary">85%</p>
                  </div>
                </div>
                <Progress value={occupancy} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Faltan <span className="font-medium text-foreground">{(85 - occupancy).toFixed(1)}%</span> para alcanzar el objetivo
                </p>
              </div>
              
              {/* Ingresos */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos totales</p>
                    <p className="text-4xl font-bold">€{(overview.ingresosTotales / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-lg font-semibold text-primary">€{(targetRevenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <Progress value={revenueProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{revenueProgress.toFixed(1)}%</span> del objetivo de ingresos
                </p>
              </div>
              
              {/* Entradas */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Entradas vendidas</p>
                    <p className="text-4xl font-bold">{ticketsSold.toLocaleString('es-ES')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Aforo total</p>
                    <p className="text-lg font-semibold text-primary">{aforoTotal.toLocaleString('es-ES')}</p>
                  </div>
                </div>
                <Progress value={occupancy} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Quedan <span className="font-medium text-foreground">{ticketsRemaining.toLocaleString('es-ES')}</span> entradas disponibles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Entradas Vendidas</p>
                  <p className="text-2xl font-bold">{ticketsSold.toLocaleString('es-ES')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+{weekChange.toFixed(0)}%</span>
                <span className="text-muted-foreground">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">% Ocupación</p>
                  <p className="text-2xl font-bold">{occupancy.toFixed(1)}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-muted-foreground">Objetivo: 85%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Precio Medio</p>
                  <p className="text-2xl font-bold">€{avgPrice.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center">
                  <Euro className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+€1.20</span>
                <span className="text-muted-foreground">vs 2024</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos Estimados</p>
                  <p className="text-2xl font-bold">€{(overview.ingresosTotales / 1000).toFixed(0)}K</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+15%</span>
                <span className="text-muted-foreground">vs mismo periodo 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas Diarias */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ventas Diarias</CardTitle>
              <CardDescription>Evolución de ventas desde el lanzamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySalesData}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [value.toLocaleString('es-ES'), 'Entradas']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorVentas)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Proyección de Ventas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Proyección de Ventas</CardTitle>
              <CardDescription>Real vs proyectado hasta el festival</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="mes" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => value ? [value.toLocaleString('es-ES'), ''] : ['—', '']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="real" 
                      name="Real" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proyectado" 
                      name="Proyectado"
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparativa Semanal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Comparativa de Ritmo Semanal</CardTitle>
                <CardDescription>Ventas semanales vs semanas anteriores y proyección</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
                  <span>Anterior</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full border-2 border-dashed border-accent" />
                  <span>Proyectado</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyComparison} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="semana" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [value.toLocaleString('es-ES') + ' entradas', '']}
                  />
                  <Bar 
                    dataKey="actual" 
                    name="Actual"
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="anterior" 
                    name="Periodo anterior"
                    fill="hsl(var(--muted-foreground))" 
                    opacity={0.4}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="proyectado" 
                    name="Proyectado"
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumen por Canal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rendimiento por Canal</CardTitle>
              <CardDescription>Ventas por proveedor de ticketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {festivalData.ticketingProviders.map((provider, index) => {
                const pctSold = (provider.vendidas / provider.capacidad) * 100;
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{provider.nombre}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {provider.vendidas.toLocaleString('es-ES')} / {provider.capacidad.toLocaleString('es-ES')}
                        </span>
                        <Badge variant={pctSold >= 80 ? "default" : pctSold >= 60 ? "secondary" : "outline"} className="w-14 justify-center">
                          {pctSold.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={pctSold} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Métricas de Conversión</CardTitle>
              <CardDescription>Indicadores clave de rendimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Tasa de conversión web</p>
                  <p className="text-xl font-bold">4.2%</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> +0.8% vs objetivo
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Ticket medio VIP</p>
                  <p className="text-xl font-bold">€{festivalData.precios.vip}</p>
                  <p className="text-xs text-muted-foreground mt-1">12% del total vendido</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Ventas/día (media)</p>
                  <p className="text-xl font-bold">165</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> +23% vs 2024
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Pico de ventas</p>
                  <p className="text-xl font-bold">Black Friday</p>
                  <p className="text-xs text-muted-foreground mt-1">892 entradas en un día</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesForecasts;