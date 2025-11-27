import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Entradas Vendidas
              </p>
              <p className="text-3xl font-bold text-foreground">
                {kpis.totalSold.toLocaleString()}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                % Aforo Ocupado
              </p>
              <p className="text-3xl font-bold text-foreground">
                {totalCapacity ? `${kpis.occupancyRate.toFixed(1)}%` : "N/D"}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <Target className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Ingresos Brutos
              </p>
              <p className="text-3xl font-bold text-foreground">
                {kpis.grossRevenue.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-warning" />
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
        <h3 className="text-lg font-semibold mb-4">
          Ventas por Ticketera / Proveedor
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Plataformas de venta externas (Ticketmaster, Entradas.com, etc.)
        </p>

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
              <Bar dataKey="vendidas" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ticketera</th>
                <th className="text-right py-2">Capacidad</th>
                <th className="text-right py-2">Vendidas</th>
                <th className="text-right py-2">% Ocupación</th>
                <th className="text-right py-2">Restantes</th>
                <th className="text-right py-2">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {providerData.map((row) => (
                <tr key={row.ticketera} className="border-b">
                  <td className="py-2 font-medium">{row.ticketera}</td>
                  <td className="text-right">
                    {row.capacidad?.toLocaleString() || "N/D"}
                  </td>
                  <td className="text-right">{row.vendidas.toLocaleString()}</td>
                  <td className="text-right">{row.ocupacion}</td>
                  <td className="text-right">{row.restantes}</td>
                  <td className="text-right">
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
      </Card>

      {/* Sales by CHANNEL (internal) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Ventas por Canal Interno
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Canales de venta internos (App móvil, RRPP, Taquilla, Online, etc.)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entradas" fill="hsl(var(--chart-2))" />
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
                {channelData.map((row) => (
                  <tr key={row.canal} className="border-b">
                    <td className="py-2">{row.canal}</td>
                    <td className="text-right">{row.entradas}</td>
                    <td className="text-right">{row.porcentaje}%</td>
                    <td className="text-right">
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

      {/* Zone data */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Zonas y aforos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Zona</th>
                <th className="text-right py-2">Aforo</th>
                <th className="text-right py-2">Vendidas</th>
                <th className="text-right py-2">% Ocupación</th>
                <th className="text-right py-2">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {zoneData.map((row) => (
                <tr key={row.zona} className="border-b">
                  <td className="py-2">{row.zona}</td>
                  <td className="text-right">
                    {row.aforo?.toLocaleString() || "N/D"}
                  </td>
                  <td className="text-right">{row.vendidas}</td>
                  <td className="text-right">{row.ocupacion}%</td>
                  <td className="text-right">
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
      </Card>
    </div>
  );
};

export default EventSummary;
