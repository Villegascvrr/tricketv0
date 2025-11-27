import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  AlertCircle,
  Calendar,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import Sparkline from "@/components/ui/sparkline";

interface ExecutiveDashboardProps {
  eventId: string;
  totalCapacity: number | null;
  eventStartDate: string;
}

interface KPI {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  color: string;
}

interface Forecast {
  metric: string;
  prediction: string;
  confidence: "high" | "medium" | "low";
  impact: string;
}

const ExecutiveDashboard = ({ eventId, totalCapacity, eventStartDate }: ExecutiveDashboardProps) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [salesTrend, setSalesTrend] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [eventId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Calculate days until event
      const eventDate = new Date(eventStartDate);
      const today = new Date();
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilEvent(daysUntil);

      // Fetch tickets data
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("price, sale_date")
        .eq("event_id", eventId)
        .eq("status", "confirmed");

      if (error) throw error;

      const totalSold = tickets?.length || 0;
      const totalRevenue = tickets?.reduce((sum, t) => sum + Number(t.price), 0) || 0;
      const occupancyRate = totalCapacity ? (totalSold / totalCapacity) * 100 : 0;

      // Calculate average daily sales (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const dailySales = last7Days.map(day => {
        return tickets?.filter(t => 
          new Date(t.sale_date).toISOString().split("T")[0] === day
        ).length || 0;
      });

      setSalesTrend(dailySales);

      // Calculate trends (comparing last 7 days vs previous 7 days)
      const last7DaysTotal = dailySales.reduce((a, b) => a + b, 0);
      const previous7Days = tickets?.filter(t => {
        const date = new Date(t.sale_date);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        return daysAgo >= 7 && daysAgo < 14;
      }).length || 0;
      
      const salesTrend = previous7Days > 0 
        ? ((last7DaysTotal - previous7Days) / previous7Days) * 100 
        : 0;

      // Average ticket price
      const avgTicketPrice = totalSold > 0 ? totalRevenue / totalSold : 0;

      // Build KPIs
      const kpisData: KPI[] = [
        {
          label: "Ocupación",
          value: `${occupancyRate.toFixed(1)}%`,
          change: salesTrend,
          trend: salesTrend > 0 ? "up" : salesTrend < 0 ? "down" : "stable",
          icon: <Target className="h-4 w-4" />,
          color: occupancyRate >= 70 ? "success" : occupancyRate >= 30 ? "warning" : "danger"
        },
        {
          label: "Ingresos",
          value: `${(totalRevenue / 1000).toFixed(0)}K €`,
          change: salesTrend,
          trend: salesTrend > 0 ? "up" : salesTrend < 0 ? "down" : "stable",
          icon: <DollarSign className="h-4 w-4" />,
          color: "primary"
        },
        {
          label: "Entradas Vendidas",
          value: totalSold.toLocaleString(),
          change: salesTrend,
          trend: salesTrend > 0 ? "up" : salesTrend < 0 ? "down" : "stable",
          icon: <Users className="h-4 w-4" />,
          color: "primary"
        },
        {
          label: "Precio Medio",
          value: `${avgTicketPrice.toFixed(0)} €`,
          change: 0,
          trend: "stable",
          icon: <TrendingUp className="h-4 w-4" />,
          color: "primary"
        }
      ];

      setKpis(kpisData);

      // Generate forecasts based on current data
      const forecastsData: Forecast[] = [];

      // Sales velocity forecast
      if (daysUntil > 0 && totalCapacity) {
        const avgDailySales = last7DaysTotal / 7;
        const projectedSales = totalSold + (avgDailySales * daysUntil);
        const projectedOccupancy = (projectedSales / totalCapacity) * 100;
        
        forecastsData.push({
          metric: "Ocupación Final Estimada",
          prediction: `${Math.min(projectedOccupancy, 100).toFixed(1)}%`,
          confidence: avgDailySales > 5 ? "high" : avgDailySales > 2 ? "medium" : "low",
          impact: projectedOccupancy >= 90 ? "Sold Out probable" : 
                  projectedOccupancy >= 70 ? "Buena ocupación" : 
                  "Mejora recomendada"
        });
      }

      // Revenue forecast
      const avgDailySales = last7DaysTotal / 7;
      const projectedRevenue = totalRevenue + (avgDailySales * avgTicketPrice * daysUntil);
      forecastsData.push({
        metric: "Ingresos Finales",
        prediction: `${(projectedRevenue / 1000).toFixed(0)}K €`,
        confidence: "medium",
        impact: projectedRevenue > totalRevenue * 1.5 ? "Excepcional" : "Dentro de expectativas"
      });

      // Trend forecast
      if (salesTrend < -20) {
        forecastsData.push({
          metric: "Velocidad de Ventas",
          prediction: "Desaceleración detectada",
          confidence: "high",
          impact: "Acción inmediata requerida"
        });
      } else if (salesTrend > 20) {
        forecastsData.push({
          metric: "Velocidad de Ventas",
          prediction: "Aceleración positiva",
          confidence: "high",
          impact: "Mantener estrategia actual"
        });
      }

      setForecasts(forecastsData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-success" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-danger" />;
      default:
        return null;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-success/10 text-success border-success/20",
      medium: "bg-warning/10 text-warning border-warning/20",
      low: "bg-muted text-muted-foreground border-border"
    };
    return colors[confidence as keyof typeof colors] || colors.low;
  };

  if (loading) {
    return <div className="text-center py-12">Cargando resumen ejecutivo...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Resumen Ejecutivo
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vista consolidada de métricas clave y pronósticos
          </p>
        </div>
        {daysUntilEvent > 0 && (
          <Badge variant="outline" className="text-base px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {daysUntilEvent} días hasta el evento
          </Badge>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card 
            key={index} 
            className={cn(
              "p-4 hover:shadow-lg transition-all border-2",
              kpi.color === "success" && "border-success/30 bg-success/5",
              kpi.color === "warning" && "border-warning/30 bg-warning/5",
              kpi.color === "danger" && "border-danger/30 bg-danger/5",
              kpi.color === "primary" && "border-primary/30 bg-primary/5"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                kpi.color === "success" && "bg-success/20 text-success",
                kpi.color === "warning" && "bg-warning/20 text-warning",
                kpi.color === "danger" && "bg-danger/20 text-danger",
                kpi.color === "primary" && "bg-primary/20 text-primary"
              )}>
                {kpi.icon}
              </div>
              {kpi.change !== 0 && (
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={cn(
                    "text-xs font-semibold",
                    kpi.trend === "up" ? "text-success" : "text-danger"
                  )}>
                    {Math.abs(kpi.change).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Trends Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Tendencia de Ventas (últimos 7 días)
        </h3>
        <div className="h-32">
          <Sparkline data={salesTrend} className="w-full h-full" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{salesTrend.reduce((a, b) => a + b, 0)}</p>
            <p className="text-xs text-muted-foreground">Ventas últimos 7d</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(salesTrend.reduce((a, b) => a + b, 0) / 7).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Promedio diario</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{Math.max(...salesTrend)}</p>
            <p className="text-xs text-muted-foreground">Día pico</p>
          </div>
        </div>
      </Card>

      {/* Forecasts Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Pronósticos y Predicciones
        </h3>
        <div className="space-y-3">
          {forecasts.map((forecast, index) => (
            <div 
              key={index} 
              className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{forecast.metric}</p>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getConfidenceBadge(forecast.confidence))}
                  >
                    {forecast.confidence === "high" ? "Alta confianza" : 
                     forecast.confidence === "medium" ? "Media confianza" : "Baja confianza"}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary mb-1">{forecast.prediction}</p>
                <p className="text-sm text-muted-foreground">{forecast.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Acciones Recomendadas
        </h3>
        <ul className="space-y-2">
          {kpis[0]?.value && parseFloat(kpis[0].value) < 50 && (
            <li className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <span>
                <strong>Ocupación baja:</strong> Considera lanzar promociones o campañas de marketing adicionales
              </span>
            </li>
          )}
          {salesTrend.reduce((a, b) => a + b, 0) / 7 < 5 && daysUntilEvent > 7 && (
            <li className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
              <span>
                <strong>Velocidad de ventas baja:</strong> Revisa estrategia de precios y canales de distribución
              </span>
            </li>
          )}
          {salesTrend[salesTrend.length - 1] > salesTrend[0] * 2 && (
            <li className="flex items-start gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>
                <strong>Aceleración positiva:</strong> Mantén estrategia actual y considera aumentar capacidad si es posible
              </span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
