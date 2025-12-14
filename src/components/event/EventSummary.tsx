import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target, Brain, Database } from "lucide-react";
import AIBadgePopover from "./AIBadgePopover";
import AIRecommendationsDrawer from "./AIRecommendationsDrawer";
import AIBadge from "./AIBadge";
import Sparkline from "@/components/ui/sparkline";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ui/progress-bar";
import { festivalData, calculateProviderOccupancy, calculateProviderRemaining } from "@/data/festivalData";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTicketStats } from "@/hooks/useTicketStats";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EventSummaryProps {
  eventId: string;
  totalCapacity: number | null;
  onOpenDrawer?: () => void;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert" | "operations";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
  rule?: string;
  dataPoint?: string;
}

interface ProviderStats {
  ticketera: string;
  capacidad: number | null;
  vendidas: number;
  ocupacion: string;
  restantes: string;
  ingresos: number;
  trend: number[];
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Semantic color helpers
const getOccupancyColor = (occupancy: number) => {
  if (occupancy >= 70) return "hsl(var(--success))";
  if (occupancy >= 30) return "hsl(var(--warning))";
  return "hsl(var(--danger))";
};

const getOccupancyBgClass = (occupancy: number) => {
  if (occupancy >= 70) return "bg-success/10 border-success/20 text-success";
  if (occupancy >= 30) return "bg-warning/10 border-warning/20 text-warning";
  return "bg-danger/10 border-danger/20 text-danger";
};

const getOccupancyTextClass = (occupancy: number) => {
  if (occupancy >= 70) return "text-success font-semibold";
  if (occupancy >= 30) return "text-warning font-semibold";
  return "text-danger font-semibold";
};

const getPerformanceColor = (percentage: number) => {
  if (percentage >= 30) return "hsl(var(--chart-1))";
  if (percentage >= 15) return "hsl(var(--chart-2))";
  return "hsl(var(--chart-3))";
};

const EventSummary = ({ eventId, totalCapacity, onOpenDrawer }: EventSummaryProps) => {
  const { stats, loading } = useTicketStats(eventId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContext, setDrawerContext] = useState<{ type: 'provider' | 'zone' | 'ageSegment' | 'global'; value: string } | undefined>(undefined);

  // Generate AI recommendations
  const recommendations: AIRecommendation[] = generateAIRecommendations();

  const getRecommendationsForScope = (scope: string, targetKey?: string) => {
    return recommendations.filter(r => {
      if (r.scope !== scope) return false;
      if (targetKey && r.targetKey !== targetKey) return false;
      return true;
    });
  };

  const getCriticalCount = (recs: AIRecommendation[]) => {
    return recs.filter(r => r.priority === "high").length;
  };

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Derive data from stats
  const kpis = {
    totalSold: stats.totalSold,
    occupancyRate: stats.occupancyRate,
    grossRevenue: stats.grossRevenue,
  };

  const salesOverTime = stats.salesOverTime.map(d => ({
    date: d.dateLabel,
    ventas: d.sales,
    acumulado: d.cumulative,
  }));

  const channelData = stats.salesByChannel.map(c => ({
    canal: c.channel,
    entradas: c.sold,
    ingresos: c.revenue,
    porcentaje: c.percentage.toFixed(1),
    trend: stats.salesOverTime.slice(-7).map(d => Math.round(d.sales * (c.percentage / 100))),
  }));

  const providerData: ProviderStats[] = stats.salesByProvider.map(p => ({
    ticketera: p.provider,
    capacidad: p.capacity,
    vendidas: p.sold,
    ocupacion: p.capacity ? `${p.occupancy.toFixed(1)}%` : 'N/D',
    restantes: p.capacity ? (p.capacity - p.sold).toLocaleString() : 'N/D',
    ingresos: p.revenue,
    trend: stats.salesOverTime.slice(-7).map(d => 
      Math.round(d.sales * (stats.totalSold > 0 ? p.sold / stats.totalSold : 0))
    ),
  }));

  const zoneData = stats.salesByZone.map(z => ({
    zona: z.zone,
    vendidas: z.sold,
    aforo: z.capacity,
    ocupacion: z.capacity ? z.occupancy.toFixed(1) : '0',
    ingresos: z.revenue,
    trend: stats.salesOverTime.slice(-7).map(d => 
      Math.round(d.sales * (stats.totalSold > 0 ? z.sold / stats.totalSold : 0))
    ),
  }));


  // Data source indicator
  const dataSourceLabel = stats.hasRealData ? "Datos reales" : stats.isDemo ? "Demo" : "Sin datos";

  return (
    <div className="space-y-4">
      {/* KPIs - Enhanced with hierarchy and semantic colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(
          "p-4 border-2 hover:border-primary/50 transition-colors",
          kpis.occupancyRate >= 50 ? "border-success/30" : "border-warning/30"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Entradas Vendidas
              </p>
              <p className={cn(
                "text-2xl font-bold mb-0.5",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )}>
                {kpis.totalSold.toLocaleString()}
              </p>
              {totalCapacity && (
                <p className="text-xs text-muted-foreground">
                  Objetivo: {totalCapacity.toLocaleString()} entradas
                </p>
              )}
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              kpis.occupancyRate >= 70 ? "bg-success/10" :
              kpis.occupancyRate >= 30 ? "bg-warning/10" : "bg-danger/10"
            )}>
              <Users className={cn(
                "h-5 w-5",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )} />
            </div>
          </div>
        </Card>

        <Card className={cn(
          "p-4 border-2 hover:border-success/50 transition-colors",
          getOccupancyBgClass(kpis.occupancyRate).includes("success") ? "border-success/30" :
          getOccupancyBgClass(kpis.occupancyRate).includes("warning") ? "border-warning/30" : "border-danger/30"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Ocupación del Aforo
              </p>
              <p className={cn(
                "text-2xl font-bold mb-0.5",
                getOccupancyTextClass(kpis.occupancyRate).split(" ")[0]
              )}>
                {totalCapacity ? `${kpis.occupancyRate.toFixed(1)}%` : "N/D"}
              </p>
              {totalCapacity && (
                <p className="text-xs text-muted-foreground">
                  {kpis.totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}
                </p>
              )}
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              getOccupancyBgClass(kpis.occupancyRate)
            )}>
              <Target className={cn(
                "h-5 w-5",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )} />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 hover:border-primary/50 transition-colors border-primary/30">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Ingresos Brutos
              </p>
              <p className="text-2xl font-bold text-primary mb-0.5">
                {kpis.grossRevenue.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Precio promedio: {kpis.totalSold > 0 ? 
                  (kpis.grossRevenue / kpis.totalSold).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                  }) : "N/D"}
              </p>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Sales velocity & cumulative chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Ventas Diarias (últimos 30 días)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="ventas" fill="hsl(var(--primary))" name="Ventas diarias" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Evolución Acumulada</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="acumulado"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={false}
                name="Entradas acumuladas"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue by ticket type estimate */}
      <Card className="p-4">
        <h3 className="text-base font-semibold mb-3">Distribución de Ingresos por Tipo de Entrada</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[
                  { name: "General", value: Math.round(kpis.grossRevenue * 0.46), entradas: Math.round(kpis.totalSold * 0.50) },
                  { name: "Grada Lateral", value: Math.round(kpis.grossRevenue * 0.18), entradas: Math.round(kpis.totalSold * 0.20) },
                  { name: "VIP", value: Math.round(kpis.grossRevenue * 0.18), entradas: Math.round(kpis.totalSold * 0.12) },
                  { name: "Grada Superior", value: Math.round(kpis.grossRevenue * 0.11), entradas: Math.round(kpis.totalSold * 0.12) },
                  { name: "Acceso Preferente", value: Math.round(kpis.grossRevenue * 0.07), entradas: Math.round(kpis.totalSold * 0.06) },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={(entry) => `€${(entry.value / 1000).toFixed(0)}k`}
                style={{ fontSize: 10 }}
              >
                {CHART_COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ fontSize: 11 }} 
                formatter={(value: number) => `€${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5">Tipo</th>
                  <th className="text-right py-1.5">Precio Medio</th>
                  <th className="text-right py-1.5">Entradas</th>
                  <th className="text-right py-1.5">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "General", precio: festivalData.precios.general, entradas: Math.round(kpis.totalSold * 0.50), ingresos: Math.round(kpis.grossRevenue * 0.46) },
                  { tipo: "Grada Lateral", precio: 23, entradas: Math.round(kpis.totalSold * 0.20), ingresos: Math.round(kpis.grossRevenue * 0.18) },
                  { tipo: "VIP", precio: festivalData.precios.vip, entradas: Math.round(kpis.totalSold * 0.12), ingresos: Math.round(kpis.grossRevenue * 0.18) },
                  { tipo: "Grada Superior", precio: 23, entradas: Math.round(kpis.totalSold * 0.12), ingresos: Math.round(kpis.grossRevenue * 0.11) },
                  { tipo: "Acceso Preferente", precio: 29.40, entradas: Math.round(kpis.totalSold * 0.06), ingresos: Math.round(kpis.grossRevenue * 0.07) },
                ].map((row) => (
                  <tr key={row.tipo} className="border-b">
                    <td className="py-1.5 font-medium">{row.tipo}</td>
                    <td className="text-right">€{row.precio.toFixed(2)}</td>
                    <td className="text-right">{row.entradas.toLocaleString()}</td>
                    <td className="text-right font-medium">
                      {row.ingresos.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Sales by PROVIDER (ticketing platform) */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              Ventas por Ticketera / Proveedor
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDrawerContext(undefined);
                  setDrawerOpen(true);
                }}
                className="gap-2 h-7 text-xs"
              >
                <Brain className="h-3 w-3" />
                Centro de Alertas IA: {recommendations.length} · {getCriticalCount(recommendations)} críticas
              </Button>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plataformas de venta externas (Ticketmaster, Entradas.com, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={providerData.map((p) => ({
                  name: p.ticketera,
                  value: p.vendidas,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={(entry) => entry.name}
                style={{ fontSize: 11 }}
              >
                {providerData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={providerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ticketera" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="vendidas">
                {providerData.map((entry, index) => {
                  const occupancy = entry.capacidad 
                    ? (entry.vendidas / entry.capacidad) * 100 
                    : 50;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getOccupancyColor(occupancy)} 
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5">Ticketera</th>
                <th className="text-left py-1.5 min-w-[140px]">Progreso</th>
                <th className="text-left py-1.5 min-w-[100px]">Tendencia 7d</th>
                <th className="text-right py-1.5">Capacidad</th>
                <th className="text-right py-1.5">Vendidas</th>
                <th className="text-right py-1.5">% Ocupación</th>
                <th className="text-right py-1.5">Restantes</th>
                <th className="text-right py-1.5">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {providerData.map((row) => {
                const providerRecs = getRecommendationsForScope("provider", row.ticketera);
                const hasCritical = getCriticalCount(providerRecs) > 0;
                const occupancyNum = row.capacidad 
                  ? (row.vendidas / row.capacidad) * 100 
                  : 0;
                return (
                  <tr 
                    key={row.ticketera} 
                    className={cn(
                      "border-b transition-colors",
                      hasCritical && "bg-danger/5 border-danger/20 animate-fade-in",
                      !hasCritical && providerRecs.length > 0 && "bg-warning/5 border-warning/20"
                    )}
                  >
                    <td className="py-2 font-medium">
                      <div className="flex items-center gap-2">
                        {row.ticketera}
                        {providerRecs.length > 0 && (
                          <AIBadge
                            count={providerRecs.length}
                            criticalCount={getCriticalCount(providerRecs)}
                            onClick={() => {
                              setDrawerContext({ type: 'provider', value: row.ticketera });
                              setDrawerOpen(true);
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2">
                      {row.capacidad ? (
                        <ProgressBar 
                          value={row.vendidas} 
                          max={row.capacidad}
                          showLabel={false}
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">N/D</span>
                      )}
                    </td>
                    <td className="py-2">
                      <Sparkline data={row.trend} className="w-20" />
                    </td>
                    <td className="text-right">
                      {row.capacidad?.toLocaleString() || "N/D"}
                    </td>
                    <td className="text-right font-medium">{row.vendidas.toLocaleString()}</td>
                    <td className={cn(
                      "text-right font-semibold",
                      row.capacidad && getOccupancyTextClass(occupancyNum)
                    )}>
                      {row.ocupacion}
                    </td>
                    <td className="text-right">{row.restantes}</td>
                    <td className="text-right">
                      {row.ingresos.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sales by CHANNEL (internal) */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              Ventas por Canal Interno
              <AIBadgePopover
                count={getRecommendationsForScope("channel").length}
                criticalCount={getCriticalCount(getRecommendationsForScope("channel"))}
                recommendations={getRecommendationsForScope("channel")}
                eventId={eventId}
                onOpenDrawer={() => onOpenDrawer?.()}
              />
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Canales de venta internos (App móvil, RRPP, Taquilla, Online, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="entradas">
                {channelData.map((entry, index) => {
                  const percentage = parseFloat(entry.porcentaje);
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getPerformanceColor(percentage)} 
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5">Canal</th>
                  <th className="text-left py-1.5 min-w-[100px]">Tendencia 7d</th>
                  <th className="text-right py-1.5">Entradas</th>
                  <th className="text-right py-1.5">%</th>
                  <th className="text-right py-1.5">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {channelData.map((row) => {
                  const channelRecs = getRecommendationsForScope("channel", row.canal);
                  const hasCritical = getCriticalCount(channelRecs) > 0;
                  const percentage = parseFloat(row.porcentaje);
                  return (
                    <tr 
                      key={row.canal} 
                      className={cn(
                        "border-b transition-colors",
                        hasCritical && "bg-danger/5 border-danger/20 animate-fade-in",
                        !hasCritical && channelRecs.length > 0 && "bg-warning/5 border-warning/20"
                      )}
                    >
                      <td className="py-1.5 flex items-center gap-2">
                        {row.canal}
                        {channelRecs.length > 0 && (
                          <AIBadgePopover
                            count={channelRecs.length}
                            criticalCount={getCriticalCount(channelRecs)}
                            recommendations={channelRecs}
                            eventId={eventId}
                            onOpenDrawer={() => onOpenDrawer?.()}
                          />
                        )}
                      </td>
                      <td className="py-1.5">
                        <Sparkline data={row.trend} className="w-20" />
                      </td>
                      <td className="text-right">{row.entradas}</td>
                      <td className={cn(
                        "text-right font-semibold",
                        percentage >= 15 ? "text-success" :
                        percentage >= 5 ? "text-warning" : "text-danger"
                      )}>
                        {row.porcentaje}%
                      </td>
                      <td className="text-right">
                        {row.ingresos.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Zone data */}
      <Card className="p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          Zonas y aforos
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDrawerContext(undefined);
              setDrawerOpen(true);
            }}
            className="gap-2 h-7 text-xs"
          >
            <Brain className="h-3 w-3" />
            Centro de Alertas IA: {getRecommendationsForScope("zone").length} · {getCriticalCount(getRecommendationsForScope("zone"))} críticas
          </Button>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5">Zona</th>
                <th className="text-left py-1.5 min-w-[140px]">Progreso</th>
                <th className="text-left py-1.5 min-w-[100px]">Tendencia 7d</th>
                <th className="text-right py-1.5">Aforo</th>
                <th className="text-right py-1.5">Vendidas</th>
                <th className="text-right py-1.5">% Ocupación</th>
                <th className="text-right py-1.5">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {zoneData.map((row) => {
                const zoneRecs = getRecommendationsForScope("zone", row.zona);
                const hasCritical = getCriticalCount(zoneRecs) > 0;
                const occupancyNum = row.ocupacion !== "N/D" 
                  ? parseFloat(row.ocupacion) 
                  : 0;
                return (
                  <tr 
                    key={row.zona} 
                    className={cn(
                      "border-b transition-colors",
                      hasCritical && "bg-danger/5 border-danger/20 animate-fade-in",
                      !hasCritical && zoneRecs.length > 0 && "bg-warning/5 border-warning/20"
                    )}
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        {row.zona}
                        {zoneRecs.length > 0 && (
                          <AIBadge
                            count={zoneRecs.length}
                            criticalCount={getCriticalCount(zoneRecs)}
                            onClick={() => {
                              setDrawerContext({ type: 'zone', value: row.zona });
                              setDrawerOpen(true);
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2">
                      {row.aforo ? (
                        <ProgressBar 
                          value={row.vendidas} 
                          max={row.aforo}
                          showLabel={false}
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">N/D</span>
                      )}
                    </td>
                    <td className="py-2">
                      <Sparkline data={row.trend} className="w-20" />
                    </td>
                    <td className="text-right">
                      {row.aforo?.toLocaleString() || "N/D"}
                    </td>
                    <td className="text-right font-medium">{row.vendidas}</td>
                    <td className={cn(
                      "text-right font-semibold",
                      row.ocupacion !== "N/D" && getOccupancyTextClass(occupancyNum)
                    )}>
                      {row.ocupacion}%
                    </td>
                    <td className="text-right">
                      {row.ingresos.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Recommendations Drawer */}
      <AIRecommendationsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendations={recommendations}
        isLoading={false}
        eventName="Festival Primavera Sound 2024"
        eventDate={new Date().toLocaleDateString("es-ES")}
        context={drawerContext}
      />
    </div>
  );
};

export default EventSummary;
