import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Search,
  MapPin,
  Calendar,
  Lightbulb,
  Info,
  BarChart3
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";

// Mock data: Tendencia de búsquedas semanal
const weeklyTrendData = [
  { week: "Sem 1", festival: 25, henryMendez: 18, flamenco: 12, urbano: 15 },
  { week: "Sem 2", festival: 28, henryMendez: 22, flamenco: 14, urbano: 18 },
  { week: "Sem 3", festival: 32, henryMendez: 25, flamenco: 16, urbano: 20 },
  { week: "Sem 4", festival: 38, henryMendez: 30, flamenco: 18, urbano: 24 },
  { week: "Sem 5", festival: 45, henryMendez: 42, flamenco: 20, urbano: 28 },
  { week: "Sem 6", festival: 52, henryMendez: 48, flamenco: 22, urbano: 32 },
  { week: "Sem 7", festival: 58, henryMendez: 55, flamenco: 25, urbano: 38 },
  { week: "Sem 8", festival: 68, henryMendez: 62, flamenco: 28, urbano: 45 },
];

// Mock data: Comparativa por ciudades
const cityComparisonData = [
  { city: "Sevilla", interest: 85, change: +12, trend: "up" },
  { city: "Madrid", interest: 62, change: +8, trend: "up" },
  { city: "Málaga", interest: 48, change: +15, trend: "up" },
  { city: "Córdoba", interest: 42, change: -2, trend: "down" },
];

// Mock data: Términos relacionados
const relatedTerms = [
  { term: "primaverando 2025 entradas", volume: 92, trend: "up" },
  { term: "henry mendez concierto", volume: 78, trend: "up" },
  { term: "festival andalucia marzo", volume: 65, trend: "stable" },
  { term: "primaverando cartel", volume: 58, trend: "up" },
  { term: "entradas primaverando precio", volume: 45, trend: "stable" },
];

// Indicador general de tendencia
const overallTrend = {
  status: "growing" as "growing" | "stable" | "declining",
  percentage: 45,
  description: "El interés ha crecido un 45% en las últimas 4 semanas",
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
    case "growing":
      return <TrendingUp className="h-4 w-4 text-success" />;
    case "down":
    case "declining":
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <Minus className="h-4 w-4 text-warning" />;
  }
};

const getTrendBadge = (status: "growing" | "stable" | "declining") => {
  switch (status) {
    case "growing":
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
          <TrendingUp className="h-3 w-3" />
          Interés Creciendo
        </Badge>
      );
    case "declining":
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1">
          <TrendingDown className="h-3 w-3" />
          Interés Cayendo
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 gap-1">
          <Minus className="h-3 w-3" />
          Interés Estable
        </Badge>
      );
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const GoogleTrendsSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="border-primary/20">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Interés del Público (Google Trends)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Datos simulados basados en patrones típicos de búsqueda para festivales similares.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription className="text-xs">
                  Tendencias de búsqueda del festival y artistas principales
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getTrendBadge(overallTrend.status)}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Indicador Principal */}
            <div className="flex items-center gap-4 p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-success">+{overallTrend.percentage}% de crecimiento</p>
                <p className="text-sm text-muted-foreground">{overallTrend.description}</p>
              </div>
            </div>

            {/* Grid de gráficas y datos */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Gráfica de Tendencia Semanal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">Evolución Semanal del Interés</h4>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        iconType="circle"
                      />
                      <Line
                        type="monotone"
                        dataKey="festival"
                        name="Primaverando"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="henryMendez"
                        name="Henry Méndez"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="flamenco"
                        name="Flamenco Fest"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="urbano"
                        name="Urbano Latino"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparativa por Ciudades */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">Interés por Ciudades Clave</h4>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                      />
                      <YAxis
                        type="category"
                        dataKey="city"
                        tick={{ fontSize: 11 }}
                        width={60}
                        className="text-muted-foreground"
                      />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-medium text-sm">{data.city}</p>
                                <p className="text-xs text-muted-foreground">
                                  Índice de interés: <span className="font-medium">{data.interest}</span>
                                </p>
                                <p className="text-xs flex items-center gap-1 mt-1">
                                  {getTrendIcon(data.trend)}
                                  <span className={data.change >= 0 ? "text-success" : "text-destructive"}>
                                    {data.change >= 0 ? "+" : ""}{data.change}% vs semana anterior
                                  </span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="interest"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Leyenda de ciudades con cambios */}
                <div className="grid grid-cols-2 gap-2">
                  {cityComparisonData.map((city) => (
                    <div
                      key={city.city}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                    >
                      <span className="font-medium">{city.city}</span>
                      <span className={`flex items-center gap-1 ${city.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {getTrendIcon(city.trend)}
                        {city.change >= 0 ? "+" : ""}{city.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Términos de búsqueda relacionados */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm">Términos de Búsqueda Relacionados</h4>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTerms.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{term.term}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${term.volume}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{term.volume}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      {getTrendIcon(term.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloque de Interpretación */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Cómo interpretar esta señal para ventas y marketing</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">📈 Tendencia al alza = Momento de capitalizar</p>
                      <p>Cuando el interés sube, es el momento ideal para lanzar campañas de conversión. El público ya está buscando, solo necesita el empujón final.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">🗺️ Ciudades con bajo interés = Oportunidad</p>
                      <p>Córdoba muestra menor interés relativo. Considera campañas geo-segmentadas o colaboraciones con influencers locales para activar esa demanda.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">🔍 Términos de búsqueda = Insights de contenido</p>
                      <p>Las búsquedas de "precio" y "entradas" indican intención de compra alta. Asegúrate de que tus anuncios y landing pages respondan a estas consultas directamente.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">👤 Artistas = Palanca de marketing</p>
                      <p>El interés en "Henry Méndez" sube casi a la par del festival. Usa su nombre y contenido como gancho principal en las próximas campañas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default GoogleTrendsSection;
