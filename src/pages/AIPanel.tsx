import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Target, Clock, CheckCircle2, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageBreadcrumb from "@/components/PageBreadcrumb";

type AlertStatus = "pending" | "in_progress" | "completed";
type AlertPriority = "critical" | "high" | "medium";

interface Alert {
  id: string;
  event: string;
  title: string;
  description: string;
  category: string;
  priority: AlertPriority;
  status: AlertStatus;
  createdAt: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    event: "Primaverando Festival 2025",
    title: "Ocupación crítica en zona Pista",
    description: "La zona Pista está al 38% de ocupación a 45 días del evento. Requiere acción inmediata de marketing.",
    category: "Ocupación",
    priority: "critical",
    status: "pending",
    createdAt: "Hace 2h",
  },
  {
    id: "2",
    event: "Primaverando Festival 2025",
    title: "Precio promedio por debajo del objetivo",
    description: "El precio promedio actual (€52) está un 15% por debajo del objetivo (€61). Considerar ajuste de pricing.",
    category: "Pricing",
    priority: "critical",
    status: "in_progress",
    createdAt: "Hace 5h",
  },
  {
    id: "3",
    event: "Primaverando Festival 2025",
    title: "Conversión baja en canal online",
    description: "El canal online muestra una tasa de conversión del 2.1%, por debajo del benchmark del 3.5%.",
    category: "Ventas",
    priority: "high",
    status: "pending",
    createdAt: "Hace 1d",
  },
  {
    id: "4",
    event: "Primaverando Festival 2025",
    title: "Oportunidad de upselling en VIP",
    description: "Alta demanda detectada en zona VIP. Oportunidad de lanzar paquete premium adicional.",
    category: "Oportunidad",
    priority: "medium",
    status: "pending",
    createdAt: "Hace 1d",
  },
  {
    id: "5",
    event: "Primaverando Festival 2025",
    title: "Segmento 25-34 con baja penetración",
    description: "El segmento demográfico 25-34 representa solo el 18% vs objetivo del 30%.",
    category: "Audiencia",
    priority: "high",
    status: "in_progress",
    createdAt: "Hace 2d",
  },
  {
    id: "6",
    event: "Primaverando Festival 2025",
    title: "Campaña Meta Ads optimizada",
    description: "Se ha completado la optimización de la campaña con mejora del 25% en CTR.",
    category: "Marketing",
    priority: "medium",
    status: "completed",
    createdAt: "Hace 3d",
  },
];

const AIPanel = () => {
  const [statusFilter, setStatusFilter] = useState<AlertStatus[]>(["pending", "in_progress", "completed"]);
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority[]>(["critical", "high", "medium"]);

  const filteredAlerts = alerts
    .filter((alert) => statusFilter.includes(alert.status) && priorityFilter.includes(alert.priority))
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const groupedAlerts = {
    critical: filteredAlerts.filter((a) => a.priority === "critical"),
    high: filteredAlerts.filter((a) => a.priority === "high"),
    medium: filteredAlerts.filter((a) => a.priority === "medium"),
  };

  const stats = {
    critical: alerts.filter((a) => a.priority === "critical" && a.status !== "completed").length,
    inProgress: alerts.filter((a) => a.status === "in_progress").length,
    completed: alerts.filter((a) => a.status === "completed").length,
  };

  const getPriorityConfig = (priority: AlertPriority) => {
    switch (priority) {
      case "critical":
        return { label: "Crítica", color: "bg-danger/10 text-danger border-danger/30" };
      case "high":
        return { label: "Alta", color: "bg-warning/10 text-warning border-warning/30" };
      case "medium":
        return { label: "Media", color: "bg-primary/10 text-primary border-primary/30" };
    }
  };

  const getStatusConfig = (status: AlertStatus) => {
    switch (status) {
      case "pending":
        return { label: "Pendiente", icon: Clock, color: "text-muted-foreground" };
      case "in_progress":
        return { label: "En progreso", icon: TrendingUp, color: "text-warning" };
      case "completed":
        return { label: "Completada", icon: CheckCircle2, color: "text-success" };
    }
  };

  const toggleStatusFilter = (status: AlertStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const togglePriorityFilter = (priority: AlertPriority) => {
    setPriorityFilter((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const priorityConfig = getPriorityConfig(alert.priority);
    const statusConfig = getStatusConfig(alert.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className={`p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors ${
        alert.priority === "critical" ? "border-danger/30" : "border-border"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            alert.priority === "critical" ? "bg-danger/10" : 
            alert.priority === "high" ? "bg-warning/10" : "bg-primary/10"
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              alert.priority === "critical" ? "text-danger" : 
              alert.priority === "high" ? "text-warning" : "text-primary"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs ${priorityConfig.color}`}>
                {priorityConfig.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {alert.category}
              </Badge>
              <div className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
                <StatusIcon className="h-3 w-3" />
                <span>{statusConfig.label}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">{alert.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlertSection = ({ 
    title, 
    alerts, 
    priority 
  }: { 
    title: string; 
    alerts: Alert[]; 
    priority: AlertPriority;
  }) => {
    if (alerts.length === 0) return null;

    const config = getPriorityConfig(priority);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            priority === "critical" ? "bg-danger" : 
            priority === "high" ? "bg-warning" : "bg-primary"
          }`} />
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">{alerts.length}</Badge>
        </div>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Centro de Alertas IA" }]} />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Centro de Alertas IA</h1>
              <p className="text-sm text-muted-foreground">Recomendaciones y alertas inteligentes</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-danger/30 bg-danger/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Alertas Críticas</p>
                  <p className="text-2xl font-bold text-danger">{stats.critical}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-danger" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">En Progreso</p>
                  <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Completadas</p>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>
                <Target className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 pb-2 border-b">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Estado <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("pending")}
                onCheckedChange={() => toggleStatusFilter("pending")}
              >
                Pendiente
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("in_progress")}
                onCheckedChange={() => toggleStatusFilter("in_progress")}
              >
                En progreso
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("completed")}
                onCheckedChange={() => toggleStatusFilter("completed")}
              >
                Completada
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Prioridad <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("critical")}
                onCheckedChange={() => togglePriorityFilter("critical")}
              >
                Crítica
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("high")}
                onCheckedChange={() => togglePriorityFilter("high")}
              >
                Alta
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("medium")}
                onCheckedChange={() => togglePriorityFilter("medium")}
              >
                Media
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs text-muted-foreground ml-auto">
            {filteredAlerts.length} alertas
          </span>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          <AlertSection title="Alertas Críticas" alerts={groupedAlerts.critical} priority="critical" />
          <AlertSection title="Prioridad Alta" alerts={groupedAlerts.high} priority="high" />
          <AlertSection title="Prioridad Media" alerts={groupedAlerts.medium} priority="medium" />
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay alertas que coincidan con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
