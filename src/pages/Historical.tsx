import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Users, 
  Euro,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Historical data by edition
const editionSummary = [
  { 
    year: 2022, 
    tickets: 28500, 
    revenue: 285000, 
    avgPrice: 10, 
    occupancy: 71, 
    satisfaction: 6.2,
    vipPct: 5
  },
  { 
    year: 2023, 
    tickets: 35200, 
    revenue: 422400, 
    avgPrice: 12, 
    occupancy: 78, 
    satisfaction: 5.8,
    vipPct: 8
  },
  { 
    year: 2024, 
    tickets: 42800, 
    revenue: 599200, 
    avgPrice: 14, 
    occupancy: 82, 
    satisfaction: 7.1,
    vipPct: 10
  },
  { 
    year: 2025, 
    tickets: 14850, 
    revenue: 371250, 
    avgPrice: 25, 
    occupancy: 74, 
    satisfaction: null,
    vipPct: 12,
    projected: true
  },
];

// Overlaid sales curves (days before event)
const salesCurvesData = [
  { day: -120, y2022: 2100, y2023: 3200, y2024: 4800, y2025: 5200 },
  { day: -100, y2022: 5800, y2023: 7500, y2024: 10200, y2025: 8400 },
  { day: -80, y2022: 9200, y2023: 12800, y2024: 16500, y2025: 11200 },
  { day: -60, y2022: 14500, y2023: 19200, y2024: 24800, y2025: 14850 },
  { day: -40, y2022: 19800, y2023: 25400, y2024: 32100, y2025: null },
  { day: -20, y2022: 24200, y2023: 30800, y2024: 38200, y2025: null },
  { day: -7, y2022: 26800, y2023: 33500, y2024: 41200, y2025: null },
  { day: 0, y2022: 28500, y2023: 35200, y2024: 42800, y2025: null },
];

// Same date comparison (60 days before)
const sameDateComparison = [
  { metric: 'Entradas vendidas', y2022: 14500, y2023: 19200, y2024: 24800, y2025: 14850 },
  { metric: 'Ingresos (K€)', y2022: 145, y2023: 230, y2024: 347, y2025: 371 },
  { metric: '% Ocupación', y2022: 36, y2023: 43, y2024: 55, y2025: 74 },
];

// Channel distribution by year
const channelDistribution = [
  { channel: 'Fever', y2022: 25, y2023: 28, y2024: 32, y2025: 36 },
  { channel: 'El Corte Inglés', y2022: 35, y2023: 30, y2024: 28, y2025: 27 },
  { channel: 'Bclever', y2022: 20, y2023: 22, y2024: 23, y2025: 23 },
  { channel: 'Tiqets', y2022: 15, y2023: 14, y2024: 12, y2025: 11 },
  { channel: 'Web Oficial', y2022: 5, y2023: 6, y2024: 5, y2025: 4 },
];

// Audience distribution by year
const audienceByAge = [
  { range: '18-21', y2022: 42, y2023: 40, y2024: 38, y2025: 34 },
  { range: '22-25', y2022: 35, y2023: 36, y2024: 37, y2025: 38 },
  { range: '26-30', y2022: 15, y2023: 16, y2024: 18, y2025: 20 },
  { range: '31+', y2022: 8, y2023: 8, y2024: 7, y2025: 9 },
];

// Radar comparison
const radarData = [
  { metric: 'Ventas', y2024: 100, y2025: 85 },
  { metric: 'Ingresos', y2024: 100, y2025: 120 },
  { metric: 'Precio Medio', y2024: 100, y2025: 178 },
  { metric: 'Ocupación', y2024: 100, y2025: 90 },
  { metric: '% VIP', y2024: 100, y2025: 120 },
  { metric: 'Digital', y2024: 100, y2025: 115 },
];

const Historical = () => {
  const currentEdition = editionSummary.find(e => e.year === 2025);
  const lastEdition = editionSummary.find(e => e.year === 2024);
  
  const ticketChange = lastEdition && currentEdition 
    ? ((currentEdition.tickets / (lastEdition.tickets * 0.35)) - 1) * 100 
    : 0;
  const revenueChange = lastEdition && currentEdition
    ? ((currentEdition.revenue / (lastEdition.revenue * 0.35)) - 1) * 100
    : 0;
  const priceChange = lastEdition && currentEdition
    ? ((currentEdition.avgPrice / lastEdition.avgPrice) - 1) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Histórico & Comparativas" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-lg font-bold text-foreground">Histórico & Comparativas</h1>
            <p className="text-xs text-muted-foreground">Análisis comparativo entre ediciones</p>
          </div>
          <Badge variant="secondary" className="text-xs gap-1.5">
            <History className="h-3 w-3" />
            4 ediciones
          </Badge>
        </div>

        {/* Edition KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {editionSummary.reduce((acc, e) => acc + e.tickets, 0).toLocaleString('es-ES')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Total histórico</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold">+23%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Crecimiento medio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold">2024</p>
              <p className="text-xs text-muted-foreground mt-0.5">Mejor edición</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-secondary">
                  <Euro className="h-4 w-4 text-secondary-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold">€1.68M</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ingresos totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Curvas de Ventas Superpuestas */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Curvas de Ventas por Edición</CardTitle>
                <CardDescription>Evolución de ventas (días antes del evento)</CardDescription>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                  <span>2022</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60" />
                  <span>2023</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                  <span>2024</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="font-medium">2025</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesCurvesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    tickFormatter={(value) => value === 0 ? 'Evento' : `${value}d`}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number | null) => value ? [value.toLocaleString('es-ES'), ''] : ['—', '']}
                    labelFormatter={(label) => label === 0 ? 'Día del evento' : `${label} días antes`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y2022" 
                    name="2022"
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1.5}
                    strokeOpacity={0.4}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y2023" 
                    name="2023"
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y2024" 
                    name="2024"
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y2025" 
                    name="2025"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparativa Misma Fecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Misma Fecha, Distintas Ediciones</CardTitle>
              <CardDescription>Comparativa a 60 días del evento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sameDateComparison} layout="vertical" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis 
                      dataKey="metric" 
                      type="category" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="y2022" name="2022" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="y2023" name="2023" fill="hsl(var(--muted-foreground))" fillOpacity={0.5} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="y2024" name="2024" fill="hsl(var(--muted-foreground))" fillOpacity={0.7} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="y2025" name="2025" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Radar 2025 vs 2024</CardTitle>
              <CardDescription>Comparativa normalizada (2024 = 100)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 200]} />
                    <Radar 
                      name="2024" 
                      dataKey="y2024" 
                      stroke="hsl(var(--muted-foreground))" 
                      fill="hsl(var(--muted-foreground))" 
                      fillOpacity={0.2} 
                    />
                    <Radar 
                      name="2025" 
                      dataKey="y2025" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para comparativas detalladas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comparativas Detalladas</CardTitle>
            <CardDescription>Evolución por categoría a lo largo de las ediciones</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="price" className="space-y-4">
              <TabsList>
                <TabsTrigger value="price">Precio Medio</TabsTrigger>
                <TabsTrigger value="channels">Canales</TabsTrigger>
                <TabsTrigger value="audience">Audiencia</TabsTrigger>
              </TabsList>
              
              <TabsContent value="price" className="space-y-4">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={editionSummary}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`€${value}`, 'Precio medio']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="avgPrice" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-2">
                  {editionSummary.map((edition) => (
                    <div key={edition.year} className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">{edition.year}</p>
                      <p className="text-xl font-bold">€{edition.avgPrice}</p>
                      {edition.year > 2022 && (
                        <p className="text-xs text-success flex items-center justify-center gap-0.5 mt-1">
                          <ArrowUpRight className="h-3 w-3" />
                          +{((edition.avgPrice / editionSummary.find(e => e.year === edition.year - 1)!.avgPrice - 1) * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="channels">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                      <XAxis dataKey="channel" tick={{ fontSize: 11 }} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value}%`, '']}
                      />
                      <Legend />
                      <Bar dataKey="y2022" name="2022" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2023" name="2023" fill="hsl(var(--muted-foreground))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2024" name="2024" fill="hsl(var(--muted-foreground))" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2025" name="2025" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="audience">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceByAge}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value}%`, '']}
                      />
                      <Legend />
                      <Bar dataKey="y2022" name="2022" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2023" name="2023" fill="hsl(var(--muted-foreground))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2024" name="2024" fill="hsl(var(--muted-foreground))" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="y2025" name="2025" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Tabla resumen por edición */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumen por Edición</CardTitle>
            <CardDescription>Métricas clave de cada año</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Edición</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Entradas</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Ingresos</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Precio Medio</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Ocupación</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">% VIP</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Crecimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {editionSummary.map((edition, index) => {
                    const prevEdition = index > 0 ? editionSummary[index - 1] : null;
                    const growth = prevEdition 
                      ? ((edition.tickets / prevEdition.tickets) - 1) * 100 
                      : null;
                    
                    return (
                      <tr 
                        key={edition.year} 
                        className={`border-b border-border/50 ${edition.year === 2025 ? 'bg-primary/5' : ''}`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{edition.year}</span>
                            {edition.projected && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">En curso</Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 font-medium">
                          {edition.tickets.toLocaleString('es-ES')}
                        </td>
                        <td className="text-right py-3 px-2">
                          €{(edition.revenue / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right py-3 px-2">
                          €{edition.avgPrice}
                        </td>
                        <td className="text-right py-3 px-2">
                          {edition.occupancy}%
                        </td>
                        <td className="text-right py-3 px-2">
                          {edition.vipPct}%
                        </td>
                        <td className="text-right py-3 px-2">
                          {growth !== null ? (
                            <span className={`flex items-center justify-end gap-0.5 ${growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {growth >= 0 ? '+' : ''}{growth.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Historical;