import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target, Brain } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AIBadgePopover from "./AIBadgePopover";
import AIRecommendationsDrawer from "./AIRecommendationsDrawer";
import AIBadge from "./AIBadge";
import { useQuery } from "@tanstack/react-query";
import Sparkline from "@/components/ui/sparkline";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ui/progress-bar";
import { festivalData, calculateProviderOccupancy, calculateProviderRemaining } from "@/data/festivalData";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { Button } from "@/components/ui/button";
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
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

interface ProviderAllocation {
  provider_name: string;
  allocated_capacity: number;
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
  if (occupancy >= 70) return "hsl(var(--success))"; // Green - good
  if (occupancy >= 30) return "hsl(var(--warning))"; // Orange - attention
  return "hsl(var(--danger))"; // Red - critical
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

const getPerformanceColor = (percentage: number, isGood: boolean = true) => {
  // For metrics where high is good (sales, revenue)
  if (isGood) {
    if (percentage >= 15) return "hsl(var(--success))";
    if (percentage >= 5) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  }
  // For metrics where low might be concerning
  if (percentage < 5) return "hsl(var(--danger))";
  if (percentage < 15) return "hsl(var(--warning))";
  return "hsl(var(--success))";
};

const EventSummary = ({ eventId, totalCapacity, onOpenDrawer }: EventSummaryProps) => {
  const [kpis, setKpis] = useState({
    totalSold: 0,
    occupancyRate: 0,
    grossRevenue: 0,
  });
  const [salesOverTime, setSalesOverTime] = useState<any[]>([]);
  const [channelData, setChannelData] = useState<any[]>([]);
  const [providerData, setProviderData] = useState<ProviderStats[]>([]);
  const [zoneData, setZoneData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContext, setDrawerContext] = useState<{ type: 'provider' | 'zone' | 'ageSegment' | 'global'; value: string } | undefined>(undefined);

  // Generate AI recommendations from festivalData
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

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tickets
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("price, sale_date, channel, zone_name, provider_name")
        .eq("event_id", eventId)
        .eq("status", "confirmed");

      if (error) throw error;

      // Use festivalData as single source of truth
      const totalSold = festivalData.overview.entradasVendidas;
      const grossRevenue = festivalData.overview.ingresosTotales;
      const occupancyRate = festivalData.overview.ocupacion * 100;

      setKpis({ totalSold, occupancyRate, grossRevenue });

      // Get last 7 days for trends
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      // Sales over time
      const salesByDay: { [key: string]: number } = {};
      tickets?.forEach((ticket) => {
        const day = new Date(ticket.sale_date).toISOString().split("T")[0];
        salesByDay[day] = (salesByDay[day] || 0) + 1;
      });

      const salesTimeData = Object.entries(salesByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("es-ES", {
            month: "short",
            day: "numeric",
          }),
          ventas: count,
        }));

      setSalesOverTime(salesTimeData);

      // Sales by CHANNEL (internal channel) with trends
      const channelStats: {
        [key: string]: { count: number; revenue: number; dailySales: { [day: string]: number } };
      } = {};
      tickets?.forEach((ticket) => {
        const channel = ticket.channel || "Sin canal";
        const day = new Date(ticket.sale_date).toISOString().split("T")[0];
        if (!channelStats[channel]) {
          channelStats[channel] = { count: 0, revenue: 0, dailySales: {} };
        }
        channelStats[channel].count += 1;
        channelStats[channel].revenue += Number(ticket.price);
        channelStats[channel].dailySales[day] = (channelStats[channel].dailySales[day] || 0) + 1;
      });

      const channelDataArray = Object.entries(channelStats).map(
        ([channel, stats]) => ({
          canal: channel,
          entradas: stats.count,
          ingresos: Math.round(stats.revenue),
          porcentaje: ((stats.count / totalSold) * 100).toFixed(1),
          trend: last7Days.map(day => stats.dailySales[day] || 0),
        })
      );

      setChannelData(channelDataArray);

      // Sales by PROVIDER (ticketing platform) - FROM FESTIVALDATA
      // ÚNICA FUENTE DE DATOS: festivalData.ticketingProviders

      // Calculate trends for each provider
      const providerStats: {
        [key: string]: { dailySales: { [day: string]: number } };
      } = {};
      tickets?.forEach((ticket) => {
        const provider = ticket.provider_name || "Sin ticketera";
        const day = new Date(ticket.sale_date).toISOString().split("T")[0];
        if (!providerStats[provider]) {
          providerStats[provider] = { dailySales: {} };
        }
        providerStats[provider].dailySales[day] = (providerStats[provider].dailySales[day] || 0) + 1;
      });

      // Map festivalData.ticketingProviders to ProviderStats format
      const providerDataArray: ProviderStats[] = festivalData.ticketingProviders.map((provider) => {
        const stats = providerStats[provider.nombre] || { dailySales: {} };
        const occupancy = calculateProviderOccupancy(provider.vendidas, provider.capacidad);
        const remaining = calculateProviderRemaining(provider.capacidad, provider.vendidas);

        return {
          ticketera: provider.nombre,
          capacidad: provider.capacidad,
          vendidas: provider.vendidas,
          ocupacion: `${occupancy.toFixed(1)}%`,
          restantes: remaining.toLocaleString(),
          ingresos: provider.ingresos,
          trend: last7Days.map(day => stats.dailySales[day] || 0),
        };
      });

      setProviderData(providerDataArray);

      // Sales by ZONE - FROM FESTIVALDATA
      // ÚNICA FUENTE DE DATOS: festivalData.zones
      
      // Calculate trends for each zone from tickets (keep for sparkline)
      const zoneStats: { [key: string]: { dailySales: { [day: string]: number } } } = {};
      tickets?.forEach((ticket) => {
        const zone = ticket.zone_name || "Sin zona";
        const day = new Date(ticket.sale_date).toISOString().split("T")[0];
        if (!zoneStats[zone]) {
          zoneStats[zone] = { dailySales: {} };
        }
        zoneStats[zone].dailySales[day] = (zoneStats[zone].dailySales[day] || 0) + 1;
      });

      // Map festivalData.zones to zone data format
      const zoneDataArray = festivalData.zones.map((zone) => {
        const stats = zoneStats[zone.zona] || { dailySales: {} };
        const porcentajeOcupacionZona = (zone.vendidas / zone.aforo) * 100;

        return {
          zona: zone.zona,
          vendidas: zone.vendidas,
          aforo: zone.aforo,
          ocupacion: porcentajeOcupacionZona.toFixed(1),
          ingresos: zone.ingresos,
          trend: last7Days.map(day => stats.dailySales[day] || 0),
        };
      });

      setZoneData(zoneDataArray);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

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

      {/* Sales over time chart */}
      <Card className="p-4">
        <h3 className="text-base font-semibold mb-3">Ventas en el tiempo</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="ventas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
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
