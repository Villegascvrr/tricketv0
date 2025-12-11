import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Megaphone, 
  Settings, 
  Users, 
  Truck, 
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";

type StatusLevel = "good" | "warning" | "critical";

interface StatusItem {
  label: string;
  icon: React.ElementType;
  status: StatusLevel;
  detail: string;
}

const statusItems: StatusItem[] = [
  {
    label: "Ventas",
    icon: TrendingUp,
    status: "warning",
    detail: "72% del objetivo",
  },
  {
    label: "Marketing",
    icon: Megaphone,
    status: "good",
    detail: "Campañas activas",
  },
  {
    label: "Ops Pre-Festival",
    icon: Settings,
    status: "good",
    detail: "85% completado",
  },
  {
    label: "RRHH",
    icon: Users,
    status: "warning",
    detail: "Faltan 12 roles",
  },
  {
    label: "Proveedores",
    icon: Truck,
    status: "good",
    detail: "Todos confirmados",
  },
  {
    label: "Alertas IA",
    icon: AlertTriangle,
    status: "critical",
    detail: "3 críticas",
  },
];

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

const FestivalStatusOverview = () => {
  const overallStatus: StatusLevel = statusItems.some(i => i.status === "critical") 
    ? "critical" 
    : statusItems.some(i => i.status === "warning") 
      ? "warning" 
      : "good";

  const overallConfig = getStatusConfig(overallStatus);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Estado General del Festival</CardTitle>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${overallConfig.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${overallConfig.dot} animate-pulse`} />
            <span className={`text-[10px] font-medium ${overallConfig.color}`}>
              {overallStatus === "good" ? "Óptimo" : overallStatus === "warning" ? "Atención" : "Crítico"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {statusItems.map((item) => {
            const config = getStatusConfig(item.status);
            const ItemIcon = item.icon;
            
            return (
              <div 
                key={item.label} 
                className={`flex items-center gap-2 p-2 rounded-md border ${
                  item.status === "critical" ? "border-danger/30 bg-danger/5" :
                  item.status === "warning" ? "border-warning/30 bg-warning/5" :
                  "border-border bg-card"
                }`}
              >
                <div className={`p-1 rounded ${config.bg}`}>
                  <ItemIcon className={`h-3 w-3 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium truncate">{item.label}</span>
                    <div className={`w-1 h-1 rounded-full ${config.dot}`} />
                  </div>
                  <p className="text-[9px] text-muted-foreground truncate">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FestivalStatusOverview;
