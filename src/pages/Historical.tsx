import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History, 
  TrendingUp, 
  Calendar, 
  Users, 
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  Target
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

// Archivo histórico completo del Primaverando
const editionArchive = [
  { 
    year: 2019, 
    tickets: 18500, 
    revenue: 148000, 
    avgPrice: 8, 
    occupancy: 62, 
    satisfaction: 7.2,
    vipPct: 3,
    headline: 'Primera edición oficial',
    keyEvent: 'Nace como alternativa legal a las fiestas universitarias',
    incident: null
  },
  { 
    year: 2022, 
    tickets: 28500, 
    revenue: 285000, 
    avgPrice: 10, 
    occupancy: 71, 
    satisfaction: 6.2,
    vipPct: 5,
    headline: 'Regreso post-pandemia',
    keyEvent: 'Colapso en accesos (>2h espera)',
    incident: 'Cientos de reclamaciones por esperas'
  },
  { 
    year: 2023, 
    tickets: 35200, 
    revenue: 422400, 
    avgPrice: 12, 
    occupancy: 78, 
    satisfaction: 5.8,
    vipPct: 8,
    headline: 'Año de la polémica',
    keyEvent: 'Cancelación artista principal sin devoluciones',
    incident: 'Denuncias ante Consumo, daño reputacional severo'
  },
  { 
    year: 2024, 
    tickets: 42800, 
    revenue: 599200, 
    avgPrice: 14, 
    occupancy: 82, 
    satisfaction: 7.1,
    vipPct: 10,
    headline: 'Edición de la recuperación',
    keyEvent: 'Mejoras operativas parciales',
    incident: 'Fallo sistema Cashless durante 2 horas'
  },
  { 
    year: 2025, 
    tickets: 14850, 
    revenue: 371250, 
    avgPrice: 25, 
    occupancy: 74, 
    satisfaction: null,
    vipPct: 12,
    headline: 'En curso',
    keyEvent: 'Objetivo: edición sin incidentes',
    incident: null,
    projected: true
  },
];

// Datos de comparativa por fecha equivalente (60 días antes)
const sameDateData = {
  currentDate: '15 de enero',
  daysToEvent: 73,
  comparison: [
    { 
      year: 2022, 
      ticketsAtDate: 9200, 
      revenueAtDate: 92000,
      occupancyAtDate: 23,
      finalTickets: 28500,
      conversionRate: 32 // % de ventas que ya tenían a esta fecha
    },
    { 
      year: 2023, 
      ticketsAtDate: 12800, 
      revenueAtDate: 153600,
      occupancyAtDate: 29,
      finalTickets: 35200,
      conversionRate: 36
    },
    { 
      year: 2024, 
      ticketsAtDate: 16500, 
      revenueAtDate: 231000,
      occupancyAtDate: 38,
      finalTickets: 42800,
      conversionRate: 39
    },
    { 
      year: 2025, 
      ticketsAtDate: 14850, 
      revenueAtDate: 371250,
      occupancyAtDate: 74,
      finalTickets: null, // En curso
      conversionRate: null,
      projected: true
    },
  ]
};

// Aprendizajes clave del año pasado a esta altura
const keyLearnings2024 = [
  {
    id: 1,
    type: 'success',
    title: 'Early Bird agresivo funcionó',
    description: 'En 2024, el 39% de las ventas se cerraron en los primeros 60 días gracias a un precio de €8.50 en primera fase.',
    metric: '39% conversión temprana',
    action: 'Mantener precio bajo en Early Bird pero con stock limitado real (no artificial)'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Fever aceleró tarde',
    description: 'Fever no activó su algoritmo de recomendación hasta 45 días antes. Perdimos 3 semanas de visibilidad premium.',
    metric: '-18% alcance vs potencial',
    action: 'Negociar activación de "Trending" desde día 1 con el account manager'
  },
  {
    id: 3,
    type: 'failure',
    title: 'VIP se vendió demasiado tarde',
    description: 'El 60% de VIP se vendió en las últimas 3 semanas. Perdimos margen al no poder subir precio antes.',
    metric: '€12K menos de lo proyectable',
    action: 'Campaña VIP específica desde enero con beneficios exclusivos anunciados temprano'
  },
  {
    id: 4,
    type: 'success',
    title: 'Email marketing superó expectativas',
    description: 'La base de datos de 2023 (28.500 emails) convirtió al 8.2%, muy por encima del 3% del sector.',
    metric: '8.2% conversión email',
    action: 'Replicar secuencia de 4 emails: Teaser → Cartel → Urgencia → Última oportunidad'
  },
  {
    id: 5,
    type: 'warning',
    title: 'Segmento 31+ ignorado',
    description: 'Los asistentes originales de 2019 (ahora 31+) representaron solo 7% vs 12% potencial estimado.',
    metric: '~2.100 entradas perdidas',
    action: 'Campaña nostalgia "Los que empezamos esto" con pack especial'
  },
  {
    id: 6,
    type: 'failure',
    title: 'Web oficial infrautilizada',
    description: 'Solo 5% de ventas vino de web propia. Pagamos €48K en comisiones evitables.',
    metric: '€48K en comisiones',
    action: 'Código exclusivo + merchandising gratis solo en web oficial'
  }
];

// Incidentes históricos documentados
const historicalIncidents = [
  { 
    year: 2019, 
    severity: 'medium',
    incident: 'Colapso en accesos inicial',
    impact: 'Tiempos de 90 min, primeras quejas en RRSS',
    response: 'Sin comunicación oficial',
    learned: false
  },
  { 
    year: 2022, 
    severity: 'high',
    incident: 'Fallo masivo de accesos',
    impact: '>2h espera, lipotimias, 400+ reclamaciones',
    response: 'Incidencia técnica puntual (excusa)',
    learned: false
  },
  { 
    year: 2022, 
    severity: 'high',
    incident: 'Escasez de agua',
    impact: 'Denuncias FACUA, riesgo sanitario',
    response: 'Ninguna',
    learned: false
  },
  { 
    year: 2023, 
    severity: 'critical',
    incident: 'Cancelación cabeza de cartel sin aviso',
    impact: 'Sustituto menor, negativa a devoluciones',
    response: 'Términos y condiciones (legal pero dañino)',
    learned: false
  },
  { 
    year: 2024, 
    severity: 'medium',
    incident: 'Fallo sistema Cashless 2h',
    impact: 'Colas en barras, frustración',
    response: 'Compensación con 1 bebida gratis',
    learned: true
  },
];

// Curvas de ventas superpuestas
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

// Radar comparison
const radarData = [
  { metric: 'Ventas', y2024: 100, y2025: 85 },
  { metric: 'Ingresos', y2024: 100, y2025: 120 },
  { metric: 'Precio Medio', y2024: 100, y2025: 178 },
  { metric: 'Ocupación', y2024: 100, y2025: 90 },
  { metric: '% VIP', y2024: 100, y2025: 120 },
  { metric: 'Digital', y2024: 100, y2025: 115 },
];

// Channel distribution by year
const channelDistribution = [
  { channel: 'Fever', y2022: 25, y2023: 28, y2024: 32, y2025: 36 },
  { channel: 'El Corte Inglés', y2022: 35, y2023: 30, y2024: 28, y2025: 27 },
  { channel: 'Bclever', y2022: 20, y2023: 22, y2024: 23, y2025: 23 },
  { channel: 'Tiqets', y2022: 15, y2023: 14, y2024: 12, y2025: 11 },
  { channel: 'Web Oficial', y2022: 5, y2023: 6, y2024: 5, y2025: 4 },
];

const Historical = () => {
  const current2025 = sameDateData.comparison.find(c => c.year === 2025);
  const last2024 = sameDateData.comparison.find(c => c.year === 2024);
  
  const ticketDiff = current2025 && last2024 
    ? current2025.ticketsAtDate - last2024.ticketsAtDate 
    : 0;
  const ticketDiffPct = last2024 
    ? ((ticketDiff / last2024.ticketsAtDate) * 100).toFixed(0) 
    : '0';

  return (
    <div className="min-h-screen bg-background p-4 theme-historical">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Histórico & Comparativas" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Archivo Histórico Primaverando
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comparativas entre ediciones, aprendizajes documentados y evolución del festival
            </p>
          </div>
          <Badge variant="secondary" className="text-xs gap-1.5">
            <History className="h-3 w-3" />
            5 ediciones (2019-2025)
          </Badge>
        </div>

        {/* Comparativa por fecha equivalente - Destacado */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Comparativa a fecha equivalente
                </CardTitle>
                <CardDescription className="mt-1">
                  <span className="font-medium text-foreground">{sameDateData.currentDate}</span> — {sameDateData.daysToEvent} días para el evento
                </CardDescription>
              </div>
              <Badge variant={parseInt(ticketDiffPct) >= 0 ? "default" : "destructive"} className="text-sm px-3 py-1">
                {parseInt(ticketDiffPct) >= 0 ? '+' : ''}{ticketDiffPct}% vs 2024
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {sameDateData.comparison.map((year) => (
                <div 
                  key={year.year} 
                  className={`p-4 rounded-lg border ${year.projected ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-bold ${year.projected ? 'text-primary' : ''}`}>
                      {year.year}
                    </span>
                    {year.projected && <Badge variant="outline" className="text-[10px]">Actual</Badge>}
                  </div>
                  <p className="text-2xl font-bold">{year.ticketsAtDate.toLocaleString('es-ES')}</p>
                  <p className="text-xs text-muted-foreground">entradas vendidas</p>
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-sm font-medium">€{(year.revenueAtDate / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">ingresos</p>
                  </div>
                  {year.conversionRate && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {year.conversionRate}% del total final
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Insight destacado */}
            <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-l-primary">
              <p className="text-sm">
                <span className="font-semibold">Insight:</span> A esta fecha en 2024, llevábamos 16.500 entradas (39% del total final). 
                Este año llevamos {current2025?.ticketsAtDate.toLocaleString('es-ES')} ({ticketDiff < 0 ? '' : '+'}{ticketDiff.toLocaleString('es-ES')} vs 2024), 
                pero con un ticket medio un 78% superior (€25 vs €14).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Aprendizajes Clave del Año Pasado */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              <CardTitle className="text-lg">Aprendizajes clave de 2024 a esta altura</CardTitle>
            </div>
            <CardDescription>
              Qué funcionó, qué falló y qué debemos hacer diferente este año
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {keyLearnings2024.map((learning) => (
                <div 
                  key={learning.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    learning.type === 'success' 
                      ? 'border-l-success bg-success/5' 
                      : learning.type === 'warning'
                        ? 'border-l-warning bg-warning/5'
                        : 'border-l-destructive bg-destructive/5'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {learning.type === 'success' && <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />}
                    {learning.type === 'warning' && <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />}
                    {learning.type === 'failure' && <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                    <div>
                      <h4 className="font-semibold text-sm">{learning.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{learning.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-primary mb-1">{learning.metric}</p>
                    <div className="flex items-start gap-1">
                      <Target className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{learning.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

        {/* Radar y Canales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evolución de Canales</CardTitle>
              <CardDescription>% de ventas por canal a lo largo de ediciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="channel" tick={{ fontSize: 10 }} tickLine={false} />
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
                    <Bar dataKey="y2022" name="2022" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="y2023" name="2023" fill="hsl(var(--muted-foreground))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="y2024" name="2024" fill="hsl(var(--muted-foreground))" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="y2025" name="2025" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de Incidentes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base">Historial de Incidentes Documentados</CardTitle>
            </div>
            <CardDescription>
              Registro de problemas operativos para no repetir errores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Año</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Incidente</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Impacto</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Respuesta</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Aprendido</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalIncidents.map((incident, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium">{incident.year}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] px-1.5 ${
                              incident.severity === 'critical' 
                                ? 'bg-destructive/10 text-destructive border-destructive/30' 
                                : incident.severity === 'high'
                                  ? 'bg-warning/10 text-warning border-warning/30'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {incident.severity}
                          </Badge>
                          <span>{incident.incident}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs max-w-[200px]">
                        {incident.impact}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs max-w-[200px]">
                        {incident.response}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {incident.learned ? (
                          <CheckCircle2 className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive/50 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Archivo completo por edición */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Archivo Completo por Edición</CardTitle>
            <CardDescription>Métricas finales y eventos destacados de cada año</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Edición</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Entradas</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Ingresos</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">€ Medio</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Satisf.</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Evento clave</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {editionArchive.map((edition, index) => {
                    const prevEdition = index > 0 ? editionArchive[index - 1] : null;
                    const growth = prevEdition 
                      ? ((edition.tickets / prevEdition.tickets) - 1) * 100 
                      : null;
                    
                    return (
                      <tr 
                        key={edition.year} 
                        className={`border-b border-border/50 ${edition.projected ? 'bg-primary/5' : ''}`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{edition.year}</span>
                              {edition.projected && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">En curso</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{edition.headline}</span>
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
                          {edition.satisfaction ? (
                            <span className={edition.satisfaction >= 7 ? 'text-success' : edition.satisfaction < 6 ? 'text-destructive' : ''}>
                              {edition.satisfaction}/10
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground max-w-[200px]">
                          {edition.keyEvent}
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
