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

  // Check if demo mode
  const isDemo = eventId?.startsWith("demo-") ?? false;

  useEffect(() => {
    fetchData();
  }, [eventId]);

  // Generate realistic simulated trend data for demo mode
  const generateSimulatedTrends = (totalSold: number, daysCount: number = 30) => {
    const trends: number[] = [];
    let cumulative = 0;
    const dailyAvg = totalSold / daysCount;
    
    for (let i = 0; i < daysCount; i++) {
      // Simulate realistic sales pattern: slow start, accelerating toward event
      const daysToEvent = daysCount - i;
      const accelerationFactor = 1 + (i / daysCount) * 1.5; // Sales increase closer to event
      const weekendBoost = (i % 7 === 5 || i % 7 === 6) ? 1.3 : 1; // Weekend bump
      const variance = 0.7 + Math.random() * 0.6; // 70%-130% variance
      
      const dailySales = Math.round(dailyAvg * accelerationFactor * weekendBoost * variance);
      trends.push(dailySales);
      cumulative += dailySales;
    }
    
    // Normalize to match total
    const scaleFactor = totalSold / cumulative;
    return trends.map(t => Math.round(t * scaleFactor));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use festivalData as single source of truth
      const totalSold = festivalData.overview.entradasVendidas;
      const grossRevenue = festivalData.overview.ingresosTotales;
      const occupancyRate = festivalData.overview.ocupacion * 100;

      setKpis({ totalSold, occupancyRate, grossRevenue });

      // Get last 30 days for trends (realistic sales window)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split("T")[0];
      });

      const last7Days = last30Days.slice(-7);

      if (isDemo) {
        // Generate realistic simulated data for demo mode
        const simulatedDailySales = generateSimulatedTrends(totalSold, 30);
        
        // Sales over time (last 30 days)
        const salesTimeData = last30Days.map((date, i) => ({
          date: new Date(date).toLocaleDateString("es-ES", {
            month: "short",
            day: "numeric",
          }),
          ventas: simulatedDailySales[i],
          acumulado: simulatedDailySales.slice(0, i + 1).reduce((a, b) => a + b, 0),
        }));
        setSalesOverTime(salesTimeData);

        // Simulate channel data based on realistic distribution
        const channels = [
          { canal: "Online", porcentaje: 45 },
          { canal: "App Móvil", porcentaje: 25 },
          { canal: "RRPP", porcentaje: 18 },
          { canal: "Taquilla", porcentaje: 8 },
          { canal: "Corporativo", porcentaje: 4 },
        ];
        
        const channelDataArray = channels.map((ch, idx) => {
          const entradas = Math.round(totalSold * (ch.porcentaje / 100));
          const ingresos = Math.round(grossRevenue * (ch.porcentaje / 100));
          // Generate trend for each channel
          const channelTrend = last7Days.map((_, i) => 
            Math.round(simulatedDailySales[23 + i] * (ch.porcentaje / 100) * (0.8 + Math.random() * 0.4))
          );
          return {
            canal: ch.canal,
            entradas,
            ingresos,
            porcentaje: ch.porcentaje.toFixed(1),
            trend: channelTrend,
          };
        });
        setChannelData(channelDataArray);

        // Provider data with realistic trends
        const providerDataArray: ProviderStats[] = festivalData.ticketingProviders.map((provider, idx) => {
          const occupancy = calculateProviderOccupancy(provider.vendidas, provider.capacidad);
          const remaining = calculateProviderRemaining(provider.capacidad, provider.vendidas);
          // Generate trend based on provider's share
          const providerShare = provider.vendidas / totalSold;
          const providerTrend = last7Days.map((_, i) => 
            Math.round(simulatedDailySales[23 + i] * providerShare * (0.7 + Math.random() * 0.6))
          );

          return {
            ticketera: provider.nombre,
            capacidad: provider.capacidad,
            vendidas: provider.vendidas,
            ocupacion: `${occupancy.toFixed(1)}%`,
            restantes: remaining.toLocaleString(),
            ingresos: provider.ingresos,
            trend: providerTrend,
          };
        });
        setProviderData(providerDataArray);

        // Zone data with realistic trends
        const zoneDataArray = festivalData.zones.map((zone) => {
          const porcentajeOcupacionZona = (zone.vendidas / zone.aforo) * 100;
          const zoneShare = zone.vendidas / totalSold;
          const zoneTrend = last7Days.map((_, i) => 
            Math.round(simulatedDailySales[23 + i] * zoneShare * (0.7 + Math.random() * 0.6))
          );

          return {
            zona: zone.zona,
            vendidas: zone.vendidas,
            aforo: zone.aforo,
            ocupacion: porcentajeOcupacionZona.toFixed(1),
            ingresos: zone.ingresos,
            trend: zoneTrend,
          };
        });
        setZoneData(zoneDataArray);
      } else {
        // Fetch real tickets from database
        const { data: tickets, error } = await supabase
          .from("tickets")
          .select("price, sale_date, channel, zone_name, provider_name")
          .eq("event_id", eventId)
          .eq("status", "confirmed");

        if (error) throw error;

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

        // Sales by CHANNEL
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

        // Provider stats
        const providerStats: { [key: string]: { dailySales: { [day: string]: number } } } = {};
        tickets?.forEach((ticket) => {
          const provider = ticket.provider_name || "Sin ticketera";
          const day = new Date(ticket.sale_date).toISOString().split("T")[0];
          if (!providerStats[provider]) {
            providerStats[provider] = { dailySales: {} };
          }
          providerStats[provider].dailySales[day] = (providerStats[provider].dailySales[day] || 0) + 1;
        });

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

        // Zone stats
        const zoneStats: { [key: string]: { dailySales: { [day: string]: number } } } = {};
        tickets?.forEach((ticket) => {
          const zone = ticket.zone_name || "Sin zona";
          const day = new Date(ticket.sale_date).toISOString().split("T")[0];
          if (!zoneStats[zone]) {
            zoneStats[zone] = { dailySales: {} };
          }
          zoneStats[zone].dailySales[day] = (zoneStats[zone].dailySales[day] || 0) + 1;
        });

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
      }
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
