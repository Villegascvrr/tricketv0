import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const EventSummary = ({ eventId, totalCapacity }: EventSummaryProps) => {
  const [kpis, setKpis] = useState({
    totalSold: 0,
    occupancyRate: 0,
    grossRevenue: 0,
  });
  const [salesOverTime, setSalesOverTime] = useState<any[]>([]);
  const [channelData, setChannelData] = useState<any[]>([]);
  const [zoneData, setZoneData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch KPIs
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("price, sale_date, channel, zone_name")
        .eq("event_id", eventId)
        .eq("status", "confirmed");

      if (error) throw error;

      const totalSold = tickets?.length || 0;
      const grossRevenue = tickets?.reduce((sum, t) => sum + Number(t.price), 0) || 0;
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

      // Sales by channel
      const channelStats: { [key: string]: { count: number; revenue: number } } =
        {};
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

      // Sales by zone
      const zoneStats: { [key: string]: { count: number; revenue: number } } = {};
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

      {/* Channel data */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por canal</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entradas" fill="hsl(var(--chart-1))" />
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
