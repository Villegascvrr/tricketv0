import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AIBadge from "./AIBadge";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ui/progress-bar";
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
}

interface AIRecommendation {
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

const EventSummary = ({ eventId, totalCapacity }: EventSummaryProps) => {
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

  // Fetch AI recommendations
  const { data: aiData } = useQuery({
    queryKey: ['event-recommendations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('event-recommendations', {
        body: { eventId }
      });
      if (error) throw error;
      return data;
    },
  });

  const recommendations: AIRecommendation[] = aiData?.recommendations || [];

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

      const totalSold = tickets?.length || 0;
      const grossRevenue =
        tickets?.reduce((sum, t) => sum + Number(t.price), 0) || 0;
      const occupancyRate = totalCapacity
        ? (totalSold / totalCapacity) * 100
        : 0;

      setKpis({ totalSold, occupancyRate, grossRevenue });

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

      // Sales by CHANNEL (internal channel)
      const channelStats: {
        [key: string]: { count: number; revenue: number };
      } = {};
      tickets?.forEach((ticket) => {
        const channel = ticket.channel || "Sin canal";
        if (!channelStats[channel]) {
          channelStats[channel] = { count: 0, revenue: 0 };
        }
        channelStats[channel].count += 1;
        channelStats[channel].revenue += Number(ticket.price);
      });

      const channelDataArray = Object.entries(channelStats).map(
        ([channel, stats]) => ({
          canal: channel,
          entradas: stats.count,
          ingresos: Math.round(stats.revenue),
          porcentaje: ((stats.count / totalSold) * 100).toFixed(1),
        })
      );

      setChannelData(channelDataArray);

      // Sales by PROVIDER (ticketing platform)
      // Fetch allocations
      const { data: allocations } = await supabase
        .from("ticket_provider_allocations")
        .select("provider_name, allocated_capacity")
        .eq("event_id", eventId);

      const allocationMap: { [key: string]: number } = {};
      allocations?.forEach((a: ProviderAllocation) => {
        allocationMap[a.provider_name] = a.allocated_capacity;
      });

      const providerStats: {
        [key: string]: { count: number; revenue: number };
      } = {};
      tickets?.forEach((ticket) => {
        const provider = ticket.provider_name || "Sin ticketera";
        if (!providerStats[provider]) {
          providerStats[provider] = { count: 0, revenue: 0 };
        }
        providerStats[provider].count += 1;
        providerStats[provider].revenue += Number(ticket.price);
      });

      const providerDataArray: ProviderStats[] = Object.entries(
        providerStats
      ).map(([provider, stats]) => {
        const allocated = allocationMap[provider] || null;
        const occupancy =
          allocated !== null ? (stats.count / allocated) * 100 : null;
        const remaining =
          allocated !== null ? allocated - stats.count : null;

        return {
          ticketera: provider,
          capacidad: allocated,
          vendidas: stats.count,
          ocupacion:
            occupancy !== null ? `${occupancy.toFixed(1)}%` : "N/D",
          restantes:
            remaining !== null ? remaining.toLocaleString() : "N/D",
          ingresos: Math.round(stats.revenue),
        };
      });

      setProviderData(providerDataArray);

      // Sales by zone
      const zoneStats: { [key: string]: { count: number; revenue: number } } =
        {};
      tickets?.forEach((ticket) => {
        const zone = ticket.zone_name || "Sin zona";
        if (!zoneStats[zone]) {
          zoneStats[zone] = { count: 0, revenue: 0 };
        }
        zoneStats[zone].count += 1;
        zoneStats[zone].revenue += Number(ticket.price);
      });

      // Get zone capacities
      const { data: zones } = await supabase
        .from("zones")
        .select("name, capacity")
        .eq("event_id", eventId);

      const zoneDataArray = Object.entries(zoneStats).map(([zone, stats]) => {
        const zoneInfo = zones?.find((z) => z.name === zone);
        const capacity = zoneInfo?.capacity || null;
        const occupancy = capacity ? (stats.count / capacity) * 100 : null;

        return {
          zona: zone,
          vendidas: stats.count,
          aforo: capacity,
          ocupacion: occupancy ? occupancy.toFixed(1) : "N/D",
          ingresos: Math.round(stats.revenue),
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
    <div className="space-y-6">
      {/* KPIs - Enhanced with hierarchy and semantic colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn(
          "p-8 border-2 hover:border-primary/50 transition-colors",
          kpis.occupancyRate >= 50 ? "border-success/30" : "border-warning/30"
        )}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Entradas Vendidas
              </p>
              <p className={cn(
                "text-4xl font-bold mb-1",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )}>
                {kpis.totalSold.toLocaleString()}
              </p>
              {totalCapacity && (
                <p className="text-sm text-muted-foreground">
                  Objetivo: {totalCapacity.toLocaleString()} entradas
                </p>
              )}
            </div>
            <div className={cn(
              "p-4 rounded-xl",
              kpis.occupancyRate >= 70 ? "bg-success/10" :
              kpis.occupancyRate >= 30 ? "bg-warning/10" : "bg-danger/10"
            )}>
              <Users className={cn(
                "h-7 w-7",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )} />
            </div>
          </div>
        </Card>

        <Card className={cn(
          "p-8 border-2 hover:border-success/50 transition-colors",
          getOccupancyBgClass(kpis.occupancyRate).includes("success") ? "border-success/30" :
          getOccupancyBgClass(kpis.occupancyRate).includes("warning") ? "border-warning/30" : "border-danger/30"
        )}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Ocupación del Aforo
              </p>
              <p className={cn(
                "text-4xl font-bold mb-1",
                getOccupancyTextClass(kpis.occupancyRate).split(" ")[0]
              )}>
                {totalCapacity ? `${kpis.occupancyRate.toFixed(1)}%` : "N/D"}
              </p>
              {totalCapacity && (
                <p className="text-sm text-muted-foreground">
                  {kpis.totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}
                </p>
              )}
            </div>
            <div className={cn(
              "p-4 rounded-xl",
              getOccupancyBgClass(kpis.occupancyRate)
            )}>
              <Target className={cn(
                "h-7 w-7",
                kpis.occupancyRate >= 70 ? "text-success" :
                kpis.occupancyRate >= 30 ? "text-warning" : "text-danger"
              )} />
            </div>
          </div>
        </Card>

        <Card className="p-8 border-2 hover:border-primary/50 transition-colors border-primary/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Ingresos Brutos
              </p>
              <p className="text-4xl font-bold text-primary mb-1">
                {kpis.grossRevenue.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Precio promedio: {kpis.totalSold > 0 ? 
                  (kpis.grossRevenue / kpis.totalSold).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                  }) : "N/D"}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-xl">
              <DollarSign className="h-7 w-7 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Sales over time chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ventas en el tiempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Ventas por Ticketera / Proveedor
              <AIBadge 
                count={getRecommendationsForScope("provider").length}
                criticalCount={getCriticalCount(getRecommendationsForScope("provider"))}
              />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Plataformas de venta externas (Ticketmaster, Entradas.com, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ResponsiveContainer width="100%" height={250}>
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
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {providerData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={providerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ticketera" />
              <YAxis />
              <Tooltip />
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ticketera</th>
                <th className="text-left py-2 min-w-[180px]">Progreso</th>
                <th className="text-right py-2">Capacidad</th>
                <th className="text-right py-2">Vendidas</th>
                <th className="text-right py-2">% Ocupación</th>
                <th className="text-right py-2">Restantes</th>
                <th className="text-right py-2">Ingresos</th>
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
                      hasCritical && "bg-danger/5 border-danger/20",
                      !hasCritical && providerRecs.length > 0 && "bg-warning/5 border-warning/20"
                    )}
                  >
                    <td className="py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {row.ticketera}
                        {providerRecs.length > 0 && (
                          <AIBadge 
                            count={providerRecs.length}
                            criticalCount={getCriticalCount(providerRecs)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3">
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Ventas por Canal Interno
              <AIBadge 
                count={getRecommendationsForScope("channel").length}
                criticalCount={getCriticalCount(getRecommendationsForScope("channel"))}
              />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Canales de venta internos (App móvil, RRPP, Taquilla, Online, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" />
              <YAxis />
              <Tooltip />
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Canal</th>
                  <th className="text-right py-2">Entradas</th>
                  <th className="text-right py-2">%</th>
                  <th className="text-right py-2">Ingresos</th>
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
                        hasCritical && "bg-danger/5 border-danger/20",
                        !hasCritical && channelRecs.length > 0 && "bg-warning/5 border-warning/20"
                      )}
                    >
                      <td className="py-2 flex items-center gap-2">
                        {row.canal}
                        {channelRecs.length > 0 && (
                          <AIBadge 
                            count={channelRecs.length}
                            criticalCount={getCriticalCount(channelRecs)}
                          />
                        )}
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
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Zonas y aforos
          <AIBadge 
            count={getRecommendationsForScope("zone").length}
            criticalCount={getCriticalCount(getRecommendationsForScope("zone"))}
          />
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Zona</th>
                <th className="text-left py-2 min-w-[200px]">Progreso</th>
                <th className="text-right py-2">Aforo</th>
                <th className="text-right py-2">Vendidas</th>
                <th className="text-right py-2">% Ocupación</th>
                <th className="text-right py-2">Ingresos</th>
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
                      hasCritical && "bg-danger/5 border-danger/20",
                      !hasCritical && zoneRecs.length > 0 && "bg-warning/5 border-warning/20"
                    )}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {row.zona}
                        {zoneRecs.length > 0 && (
                          <AIBadge 
                            count={zoneRecs.length}
                            criticalCount={getCriticalCount(zoneRecs)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3">
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
    </div>
  );
};

export default EventSummary;
