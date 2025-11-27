import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, MapPin, Users, Mail, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
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
import { toast } from "sonner";

interface EventAudienceProps {
  eventId: string;
}

interface GeographicData {
  location: string;
  count: number;
  percentage: number;
}

interface AgeRangeData {
  range: string;
  count: number;
  percentage: number;
}

interface ContactStats {
  emailPercentage: number;
  phonePercentage: number;
  marketingConsentPercentage: number;
  totalTickets: number;
}

interface Filters {
  province: string;
  city: string;
  ageRange: string;
  channel: string;
  ticketType: string;
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const EventAudience = ({ eventId }: EventAudienceProps) => {
  const [loading, setLoading] = useState(true);
  const [provinceData, setProvinceData] = useState<GeographicData[]>([]);
  const [cityData, setCityData] = useState<GeographicData[]>([]);
  const [ageData, setAgeData] = useState<AgeRangeData[]>([]);
  const [contactStats, setContactStats] = useState<ContactStats>({
    emailPercentage: 0,
    phonePercentage: 0,
    marketingConsentPercentage: 0,
    totalTickets: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    province: "all",
    city: "all",
    ageRange: "all",
    channel: "all",
    ticketType: "all",
  });
  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [availableTicketTypes, setAvailableTicketTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchAudienceData();
  }, [eventId]);

  const fetchAudienceData = async () => {
    setLoading(true);
    try {
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", eventId)
        .eq("status", "confirmed");

      if (error) throw error;

      const total = tickets?.length || 0;

      // Process geographic data by province
      const provinceMap: { [key: string]: number } = {};
      tickets?.forEach((ticket) => {
        const province = ticket.buyer_province || "Sin provincia";
        provinceMap[province] = (provinceMap[province] || 0) + 1;
      });

      const provinceArray = Object.entries(provinceMap)
        .map(([location, count]) => ({
          location,
          count,
          percentage: (count / total) * 100,
        }))
        .sort((a, b) => b.count - a.count);

      setProvinceData(provinceArray);

      // Process geographic data by city (top 15)
      const cityMap: { [key: string]: number } = {};
      tickets?.forEach((ticket) => {
        const city = ticket.buyer_city || "Sin ciudad";
        cityMap[city] = (cityMap[city] || 0) + 1;
      });

      const cityArray = Object.entries(cityMap)
        .map(([location, count]) => ({
          location,
          count,
          percentage: (count / total) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      setCityData(cityArray);

      // Process age ranges
      const ageRanges = {
        "<18": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45+": 0,
      };

      tickets?.forEach((ticket) => {
        const age = ticket.buyer_age;
        if (age !== null) {
          if (age < 18) ageRanges["<18"]++;
          else if (age >= 18 && age <= 24) ageRanges["18-24"]++;
          else if (age >= 25 && age <= 34) ageRanges["25-34"]++;
          else if (age >= 35 && age <= 44) ageRanges["35-44"]++;
          else if (age >= 45) ageRanges["45+"]++;
        }
      });

      const totalWithAge = Object.values(ageRanges).reduce((a, b) => a + b, 0);
      const ageArray = Object.entries(ageRanges).map(([range, count]) => ({
        range,
        count,
        percentage: totalWithAge > 0 ? (count / totalWithAge) * 100 : 0,
      }));

      setAgeData(ageArray);

      // Process contact stats
      const withEmail = tickets?.filter((t) => t.has_email).length || 0;
      const withPhone = tickets?.filter((t) => t.has_phone).length || 0;
      const withConsent = tickets?.filter((t) => t.marketing_consent).length || 0;

      setContactStats({
        emailPercentage: (withEmail / total) * 100,
        phonePercentage: (withPhone / total) * 100,
        marketingConsentPercentage: (withConsent / total) * 100,
        totalTickets: total,
      });

      // Extract available filter options
      const provinces = [...new Set(tickets?.map((t) => t.buyer_province).filter(Boolean))];
      const cities = [...new Set(tickets?.map((t) => t.buyer_city).filter(Boolean))];
      const channels = [...new Set(tickets?.map((t) => t.channel).filter(Boolean))];
      const ticketTypes = [...new Set(tickets?.map((t) => t.ticket_type).filter(Boolean))];

      setAvailableProvinces(provinces.sort() as string[]);
      setAvailableCities(cities.sort() as string[]);
      setAvailableChannels(channels.sort() as string[]);
      setAvailableTicketTypes(ticketTypes.sort() as string[]);
    } catch (error) {
      console.error("Error fetching audience data:", error);
      toast.error("Error al cargar datos de audiencia");
    } finally {
      setLoading(false);
    }
  };

  const handleExportSegment = async () => {
    try {
      // Build query with filters
      let query = supabase
        .from("tickets")
        .select("*")
        .eq("event_id", eventId)
        .eq("status", "confirmed");

      if (filters.province !== "all") {
        query = query.eq("buyer_province", filters.province);
      }

      if (filters.city !== "all") {
        query = query.eq("buyer_city", filters.city);
      }

      if (filters.channel !== "all") {
        query = query.eq("channel", filters.channel);
      }

      if (filters.ticketType !== "all") {
        query = query.eq("ticket_type", filters.ticketType);
      }

      if (filters.ageRange !== "all") {
        const [min, max] = filters.ageRange.split("-").map(Number);
        if (max) {
          query = query.gte("buyer_age", min).lte("buyer_age", max);
        } else if (filters.ageRange === "<18") {
          query = query.lt("buyer_age", 18);
        } else if (filters.ageRange === "45+") {
          query = query.gte("buyer_age", 45);
        }
      }

      const { data: filteredTickets, error } = await query;

      if (error) throw error;

      if (!filteredTickets || filteredTickets.length === 0) {
        toast.error("No hay datos que cumplan los filtros seleccionados");
        return;
      }

      // Convert to CSV
      const headers = [
        "ID",
        "Fecha Venta",
        "Precio",
        "Zona",
        "Canal",
        "Tipo",
        "Ciudad",
        "Provincia",
        "País",
        "Edad",
        "Email",
        "Teléfono",
        "Consentimiento",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredTickets.map((ticket) =>
          [
            ticket.id,
            new Date(ticket.sale_date).toLocaleDateString("es-ES"),
            ticket.price,
            ticket.zone_name || "",
            ticket.channel || "",
            ticket.ticket_type || "",
            ticket.buyer_city || "",
            ticket.buyer_province || "",
            ticket.buyer_country || "",
            ticket.buyer_age || "",
            ticket.has_email ? "Sí" : "No",
            ticket.has_phone ? "Sí" : "No",
            ticket.marketing_consent ? "Sí" : "No",
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `segmento_audiencia_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exportados ${filteredTickets.length} registros`);
    } catch (error) {
      console.error("Error exporting segment:", error);
      toast.error("Error al exportar segmento");
    }
  };

  const hasActiveFilters = Object.values(filters).some((f) => f !== "all");

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cargando datos de audiencia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Stats KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Con Email</p>
              <p className="text-3xl font-bold text-foreground">
                {contactStats.emailPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (contactStats.emailPercentage / 100) * contactStats.totalTickets
                )}{" "}
                / {contactStats.totalTickets}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Con Teléfono</p>
              <p className="text-3xl font-bold text-foreground">
                {contactStats.phonePercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (contactStats.phonePercentage / 100) * contactStats.totalTickets
                )}{" "}
                / {contactStats.totalTickets}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Consentimiento Marketing
              </p>
              <p className="text-3xl font-bold text-foreground">
                {contactStats.marketingConsentPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (contactStats.marketingConsentPercentage / 100) *
                    contactStats.totalTickets
                )}{" "}
                / {contactStats.totalTickets}
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Province */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Distribución por Provincia</h3>
          </div>

          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={provinceData.slice(0, 5)}
                  dataKey="count"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.percentage.toFixed(1)}%`}
                >
                  {provinceData.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b">
                    <th className="text-left py-2">Provincia</th>
                    <th className="text-right py-2">Entradas</th>
                    <th className="text-right py-2">%</th>
                  </tr>
                </thead>
                <tbody>
                  {provinceData.map((item) => (
                    <tr key={item.location} className="border-b">
                      <td className="py-2">{item.location}</td>
                      <td className="text-right">{item.count}</td>
                      <td className="text-right">{item.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* By City */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Top 15 Ciudades
            </h3>
          </div>

          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>

            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b">
                    <th className="text-left py-2">Ciudad</th>
                    <th className="text-right py-2">Entradas</th>
                    <th className="text-right py-2">%</th>
                  </tr>
                </thead>
                <tbody>
                  {cityData.map((item) => (
                    <tr key={item.location} className="border-b">
                      <td className="py-2">{item.location}</td>
                      <td className="text-right">{item.count}</td>
                      <td className="text-right">{item.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Age Distribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Distribución por Edad</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--chart-3))" name="Entradas" />
            </BarChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Rango</th>
                  <th className="text-right py-2">Entradas</th>
                  <th className="text-right py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {ageData.map((item) => (
                  <tr key={item.range} className="border-b">
                    <td className="py-2 font-medium">{item.range} años</td>
                    <td className="text-right">{item.count}</td>
                    <td className="text-right">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Export Segment */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Exportar Segmento</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="filter-province">Provincia</Label>
            <Select
              value={filters.province}
              onValueChange={(value) =>
                setFilters({ ...filters, province: value })
              }
            >
              <SelectTrigger id="filter-province">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {availableProvinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-city">Ciudad</Label>
            <Select
              value={filters.city}
              onValueChange={(value) => setFilters({ ...filters, city: value })}
            >
              <SelectTrigger id="filter-city">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-age">Rango de Edad</Label>
            <Select
              value={filters.ageRange}
              onValueChange={(value) =>
                setFilters({ ...filters, ageRange: value })
              }
            >
              <SelectTrigger id="filter-age">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="<18">&lt;18 años</SelectItem>
                <SelectItem value="18-24">18-24 años</SelectItem>
                <SelectItem value="25-34">25-34 años</SelectItem>
                <SelectItem value="35-44">35-44 años</SelectItem>
                <SelectItem value="45+">45+ años</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-channel">Canal</Label>
            <Select
              value={filters.channel}
              onValueChange={(value) =>
                setFilters({ ...filters, channel: value })
              }
            >
              <SelectTrigger id="filter-channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableChannels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-type">Tipo de Entrada</Label>
            <Select
              value={filters.ticketType}
              onValueChange={(value) =>
                setFilters({ ...filters, ticketType: value })
              }
            >
              <SelectTrigger id="filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableTicketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleExportSegment} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Segmento a CSV
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  province: "all",
                  city: "all",
                  ageRange: "all",
                  channel: "all",
                  ticketType: "all",
                })
              }
            >
              Limpiar Filtros
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Filtros activos:</strong>{" "}
              {Object.entries(filters)
                .filter(([_, value]) => value !== "all")
                .map(([key, value]) => {
                  const labels: { [key: string]: string } = {
                    province: "Provincia",
                    city: "Ciudad",
                    ageRange: "Edad",
                    channel: "Canal",
                    ticketType: "Tipo",
                  };
                  return `${labels[key]}: ${value}`;
                })
                .join(", ")}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventAudience;
