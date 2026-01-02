import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Target, 
  Euro,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTicketStats } from "@/hooks/useTicketStats";
import { generateAIRecommendations, Recommendation } from "@/utils/generateAIRecommendations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const STORAGE_KEY = "todayQuickView_minimized";

interface TodayQuickViewProps {
  eventId?: string;
  onOpenRecommendations: () => void;
  onOpenChat: () => void;
}

const getTopAlerts = (recommendations: Recommendation[]) => {
  return recommendations
    .filter(r => r.priority === 'high' || r.priority === 'medium')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
};

const getSuggestedActions = (recommendations: Recommendation[], stats: ReturnType<typeof useTicketStats>['stats']) => {
  const actions: { title: string; description: string; impact: string; urgent: boolean }[] = [];
  
  if (!stats) return actions;
  
  // Based on sales gap
  if (stats.salesGap > 0) {
    actions.push({
      title: "Activar campaña de conversión",
      description: `Faltan ${stats.salesGap.toLocaleString()} entradas para el objetivo`,
      impact: "+8-12% conversión esperada",
      urgent: stats.salesGap > 1000
    });
  }
  
  // Based on days to festival
  if (stats.daysToFestival < 30) {
    actions.push({
      title: "Revisar operaciones pre-festival",
      description: `Solo quedan ${stats.daysToFestival} días - verificar tareas críticas`,
      impact: "Prevenir bloqueos de última hora",
      urgent: stats.daysToFestival < 14
    });
  }
  
  // Based on sales trend
  if (stats.salesTrend > 15) {
    actions.push({
      title: "Aprovechar momentum de ventas",
      description: `Ayer +${stats.salesTrend.toFixed(0)}% sobre media - amplificar campañas activas`,
      impact: "Mantener ritmo positivo",
      urgent: false
    });
  }
  
  return actions.slice(0, 2);
};

export function TodayQuickView({ 
  eventId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  onOpenRecommendations, 
  onOpenChat 
}: TodayQuickViewProps) {
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? true : saved === "true";
  });

  const { stats, loading } = useTicketStats(eventId);
  const recommendations = generateAIRecommendations();
  const topAlerts = getTopAlerts(recommendations);
  const suggestedActions = getSuggestedActions(recommendations, stats);

  const toggleMinimized = () => {
    const newValue = !isMinimized;
    setIsMinimized(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-destructive/50 bg-destructive/5';
      case 'medium': return 'border-warning/50 bg-warning/5';
      default: return 'border-muted';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-[10px]">Crítica</Badge>;
      case 'medium': return <Badge variant="secondary" className="text-[10px] bg-warning/20 text-warning-foreground">Importante</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">Info</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className={cn("py-3 md:py-4 px-3 md:px-6", !isMinimized && "pb-3")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm md:text-base flex items-center gap-2 flex-wrap">
                <span className="truncate">Vista rápida del día</span>
                {stats.hasRealData && (
                  <Badge variant="outline" className="text-[10px] gap-1 hidden sm:flex">
                    <Database className="h-2.5 w-2.5" />
                    Datos reales
                  </Badge>
                )}
              </CardTitle>
              {!isMinimized && (
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <Badge variant="outline" className="gap-1 md:gap-1.5 text-[10px] md:text-xs whitespace-nowrap px-1.5 md:px-2.5 py-0.5 md:py-1">
              <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
              <span className="hidden sm:inline">{stats.daysToFestival} días</span>
              <span className="sm:hidden">{stats.daysToFestival}d</span>
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 md:h-8 md:w-8 p-0 flex-shrink-0" 
              onClick={toggleMinimized}
              title={isMinimized ? "Expandir vista rápida" : "Minimizar vista rápida"}
            >
              {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
      <CardContent className="space-y-4 px-3 md:px-6">
        {/* 3 Critical Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Metric 1: Sales vs Target */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Ventas vs Objetivo</span>
              </div>
              {stats.salesGap > 0 ? (
                <Badge variant="outline" className="text-[10px] border-warning text-warning">
                  Faltan {stats.salesGap.toLocaleString()}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-success text-success">
                  +{Math.abs(stats.salesGap).toLocaleString()}
                </Badge>
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{stats.totalSold.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground mb-0.5">/ {stats.targetSales.toLocaleString()}</span>
            </div>
            <Progress value={stats.targetProgress} className="h-1.5 mt-2" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {stats.targetProgress.toFixed(0)}% del objetivo de {stats.targetSales.toLocaleString()} entradas
            </p>
          </div>
          
          {/* Metric 2: Yesterday's Sales Trend */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {stats.salesTrend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className="text-xs font-medium text-muted-foreground">Ventas de ayer</span>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px]",
                  stats.salesTrend >= 0 ? "border-success text-success" : "border-destructive text-destructive"
                )}
              >
                {stats.salesTrend >= 0 ? '+' : ''}{stats.salesTrend.toFixed(0)}% vs media
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{stats.yesterdaySales}</span>
              <span className="text-sm text-muted-foreground mb-0.5">entradas vendidas</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Media últimos 7 días: {stats.avgDailySales} entradas/día
            </p>
          </div>
          
          {/* Metric 3: Revenue Progress */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-success" />
                <span className="text-xs font-medium text-muted-foreground">Ingresos totales</span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                €{stats.avgTicketPrice.toFixed(0)}/ticket
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">€{(stats.grossRevenue / 1000).toFixed(0)}K</span>
              <span className="text-sm text-muted-foreground mb-0.5">recaudados</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {stats.requiredDailyRate > 0 
                ? `Necesitas ${stats.requiredDailyRate}/día para objetivo`
                : "Objetivo de ventas alcanzado"}
            </p>
          </div>
        </div>

        {/* 3 Priority Alerts + 2 Suggested Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Alerts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Alertas prioritarias
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onOpenRecommendations}>
                Ver todas
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {topAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50",
                    getPriorityColor(alert.priority)
                  )}
                  onClick={onOpenRecommendations}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium leading-tight">{alert.title}</span>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.rule}</p>
                </div>
              ))}
              
              {topAlerts.length === 0 && (
                <div className="p-4 rounded-lg border bg-success/5 border-success/30 text-center">
                  <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                  <p className="text-sm font-medium text-success">Sin alertas críticas</p>
                  <p className="text-xs text-muted-foreground">Todo bajo control hoy</p>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Acciones sugeridas para hoy
            </h3>
            
            <div className="space-y-2">
              {suggestedActions.map((action, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
                    action.urgent && "border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium">{action.title}</span>
                    {action.urgent && (
                      <Badge className="text-[10px] bg-primary/20 text-primary border-0">Urgente</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-success font-medium">↑ {action.impact}</span>
                    <Button variant="outline" size="sm" className="h-6 text-xs" onClick={onOpenChat}>
                      Explorar con IA
                    </Button>
                  </div>
                </div>
              ))}
              
              {suggestedActions.length === 0 && (
                <div className="p-4 rounded-lg border text-center">
                  <Clock className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Ritmo de ventas óptimo</p>
                  <p className="text-xs text-muted-foreground">No hay acciones urgentes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
}
