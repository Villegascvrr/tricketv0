import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  Megaphone, 
  Settings, 
  Users, 
  Truck, 
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronRight
} from "lucide-react";
import { useTicketStats } from "@/hooks/useTicketStats";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type StatusLevel = "good" | "warning" | "critical";

interface StatusItem {
  label: string;
  icon: React.ElementType;
  status: StatusLevel;
  detail: string;
  tooltip: string;
  route: string;
}

interface FestivalStatusOverviewProps {
  eventId?: string;
}

const getStatusConfig = (status: StatusLevel) => {
  switch (status) {
    case "good":
      return { 
        icon: CheckCircle2, 
        color: "text-success", 
        bg: "bg-success/10",
        dot: "bg-success"
      };
    case "warning":
      return { 
        icon: AlertCircle, 
        color: "text-warning", 
        bg: "bg-warning/10",
        dot: "bg-warning"
      };
    case "critical":
      return { 
        icon: XCircle, 
        color: "text-danger", 
        bg: "bg-danger/10",
        dot: "bg-danger"
      };
  }
};

const FestivalStatusOverview = ({ eventId = "demo-primaverando-2025" }: FestivalStatusOverviewProps) => {
  const navigate = useNavigate();
  const { stats, loading } = useTicketStats(eventId);
  const recommendations = generateAIRecommendations();
  
  // Build status items based on real/demo data
  const getStatusItems = (): StatusItem[] => {
    if (!stats) return [];
    
    const ocupacion = stats.targetProgress;
    const ventasStatus: StatusLevel = ocupacion >= 80 ? "good" : ocupacion >= 65 ? "warning" : "critical";
    
    // Count critical AI recommendations
    const criticalAlerts = recommendations.filter(r => r.priority === 'high').length;
    const alertStatus: StatusLevel = criticalAlerts >= 2 ? "critical" : criticalAlerts >= 1 ? "warning" : "good";
    
    return [
      {
        label: "Ventas",
        icon: TrendingUp,
        status: ventasStatus,
        detail: `${ocupacion.toFixed(0)}% del objetivo`,
        tooltip: `${stats.totalSold.toLocaleString()} de ${stats.targetSales.toLocaleString()} entradas objetivo`,
        route: "/sales",
      },
      {
        label: "Marketing",
        icon: Megaphone,
        status: "good" as StatusLevel,
        detail: "3 campañas activas",
        tooltip: "Instagram Ads, Retargeting 2024, Email Newsletter",
        route: "/marketing",
      },
      {
        label: "Operaciones",
        icon: Settings,
        status: "good" as StatusLevel,
        detail: "78% tareas cerradas",
        tooltip: "28 de 36 tareas pre-festival completadas",
        route: "/operations/pre-festival",
      },
      {
        label: "Personal",
        icon: Users,
        status: "warning" as StatusLevel,
        detail: "Faltan 12 roles",
        tooltip: "8 seguridad, 3 barra, 1 producción por confirmar",
        route: "/team",
      },
      {
        label: "Proveedores",
        icon: Truck,
        status: "good" as StatusLevel,
        detail: "100% confirmados",
        tooltip: "Sonido, catering, seguridad y limpieza OK",
        route: "/integrations",
      },
      {
        label: "Alertas IA",
        icon: AlertTriangle,
        status: alertStatus,
        detail: criticalAlerts > 0 ? `${criticalAlerts} críticas` : "Sin alertas",
        tooltip: criticalAlerts > 0 
          ? recommendations.filter(r => r.priority === 'high').map(r => r.title).slice(0, 2).join(', ')
          : "No hay alertas críticas pendientes",
        route: "/ai-recommendations",
      },
    ];
  };

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2 px-4 pt-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusItems = getStatusItems();
  
  const overallStatus: StatusLevel = statusItems.some(i => i.status === "critical") 
    ? "critical" 
    : statusItems.some(i => i.status === "warning") 
      ? "warning" 
      : "good";

  const overallConfig = getStatusConfig(overallStatus);
  
  const statusLabels = {
    good: "En buen estado",
    warning: "Requiere atención",
    critical: "Acción urgente"
  };

  return (
    <TooltipProvider>
      <Card className="border-border/60">
        <CardHeader className="pb-2 px-3 md:px-4 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs md:text-sm font-semibold text-foreground">Estado del Festival</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-xs">
                    Resumen rápido del estado de cada área. 
                    {stats?.isDemo && " (Datos de demostración)"}
                    {stats?.hasRealData && " (Datos reales de Supabase)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className={`flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full ${overallConfig.bg}`}>
              <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${overallConfig.dot}`} />
              <span className={`text-[10px] md:text-xs font-medium ${overallConfig.color}`}>
                {statusLabels[overallStatus]}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-4 pb-3 md:pb-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {statusItems.map((item) => {
              const config = getStatusConfig(item.status);
              const ItemIcon = item.icon;
              
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <div 
                      onClick={() => navigate(item.route)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all hover:shadow-sm group ${
                        item.status === "critical" ? "border-danger/40 bg-danger/5 hover:bg-danger/10" :
                        item.status === "warning" ? "border-warning/40 bg-warning/5 hover:bg-warning/10" :
                        "border-border/50 bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${config.bg}`}>
                        <ItemIcon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate">{item.label}</span>
                        <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs font-medium mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default FestivalStatusOverview;
