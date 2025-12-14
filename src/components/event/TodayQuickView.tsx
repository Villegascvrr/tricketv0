import { useState, useEffect } from "react";
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
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { festivalData } from "@/data/festivalData";
import { generateAIRecommendations, Recommendation } from "@/utils/generateAIRecommendations";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";

const STORAGE_KEY = "todayQuickView_minimized";

interface TodayQuickViewProps {
  onOpenRecommendations: () => void;
  onOpenChat: () => void;
}

// Métricas derivadas de festivalData (fuente única de verdad)
const getCurrentMetrics = () => {
  const today = new Date();
  const festivalDate = new Date('2025-03-29');
  const daysToFestival = differenceInDays(festivalDate, today);
  
  const { overview } = festivalData;
  const objetivoVentas = overview.objetivoVentas || 18000;
  
  // Progreso actual vs objetivo
  const currentSales = overview.entradasVendidas;
  const targetProgress = (currentSales / objetivoVentas) * 100;
  const salesGap = objetivoVentas - currentSales;
  
  // Datos de ayer (desde festivalData)
  const yesterdaySales = overview.ventasAyer || 342;
  const avgDailySales = overview.mediaVentasDiaria || 285;
  const salesTrend = ((yesterdaySales - avgDailySales) / avgDailySales) * 100;
  
  // Ingresos coherentes con festivalData
  const currentRevenue = overview.ingresosTotales;
  const targetRevenue = objetivoVentas * 25; // Estimación €25 ticket promedio
  
  return {
    daysToFestival,
    currentSales,
    objetivoVentas,
    targetProgress,
    salesGap,
    yesterdaySales,
    avgDailySales,
    salesTrend,
    currentRevenue,
    targetRevenue,
    occupancy: overview.ocupacion * 100
  };
};

const getTopAlerts = (recommendations: Recommendation[]) => {
  // Get top 3 most critical recommendations
  return recommendations
    .filter(r => r.priority === 'high' || r.priority === 'medium')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
};

const getSuggestedActions = (recommendations: Recommendation[], metrics: ReturnType<typeof getCurrentMetrics>) => {
  const actions: { title: string; description: string; impact: string; urgent: boolean }[] = [];
  
  // Based on sales gap
  if (metrics.salesGap > 0) {
    actions.push({
      title: "Activar campaña de conversión",
      description: `Faltan ${metrics.salesGap.toLocaleString()} entradas para el objetivo de hoy`,
      impact: "+8-12% conversión esperada",
      urgent: metrics.salesGap > 1000
    });
  }
  
  // Based on days to festival
  if (metrics.daysToFestival < 30) {
    actions.push({
      title: "Revisar operaciones pre-festival",
      description: `Solo quedan ${metrics.daysToFestival} días - verificar tareas críticas`,
      impact: "Prevenir bloqueos de última hora",
      urgent: metrics.daysToFestival < 14
    });
  }
  
  // Based on sales trend
  if (metrics.salesTrend > 15) {
    actions.push({
      title: "Aprovechar momentum de ventas",
      description: `Ayer +${metrics.salesTrend.toFixed(0)}% sobre media - amplificar campañas activas`,
      impact: "Mantener ritmo positivo",
      urgent: false
    });
  }
  
  return actions.slice(0, 2);
};

export function TodayQuickView({ onOpenRecommendations, onOpenChat }: TodayQuickViewProps) {
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  });

  const metrics = getCurrentMetrics();
  const recommendations = generateAIRecommendations();
  const topAlerts = getTopAlerts(recommendations);
  const suggestedActions = getSuggestedActions(recommendations, metrics);

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

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className={cn("pb-3", isMinimized && "pb-0")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Qué debería estar revisando hoy</CardTitle>
              {!isMinimized && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })} • Vista rápida de 2 minutos
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {metrics.daysToFestival} días
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={toggleMinimized}
              title={isMinimized ? "Expandir vista rápida" : "Minimizar vista rápida"}
            >
              {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
      
      <CardContent className="space-y-4">
        {/* 3 Critical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Metric 1: Sales vs Target */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Ventas vs Objetivo</span>
              </div>
              {metrics.salesGap > 0 ? (
                <Badge variant="outline" className="text-[10px] border-warning text-warning">
                  Faltan {metrics.salesGap.toLocaleString()}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-success text-success">
                  +{Math.abs(metrics.salesGap).toLocaleString()}
                </Badge>
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{metrics.currentSales.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground mb-0.5">/ {metrics.objetivoVentas.toLocaleString()}</span>
            </div>
            <Progress value={metrics.targetProgress} className="h-1.5 mt-2" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {metrics.targetProgress.toFixed(0)}% del objetivo de {metrics.objetivoVentas.toLocaleString()} entradas
            </p>
          </div>
          
          {/* Metric 2: Yesterday's Sales Trend */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metrics.salesTrend >= 0 ? (
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
                  metrics.salesTrend >= 0 ? "border-success text-success" : "border-destructive text-destructive"
                )}
              >
                {metrics.salesTrend >= 0 ? '+' : ''}{metrics.salesTrend.toFixed(0)}% vs media
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{metrics.yesterdaySales}</span>
              <span className="text-sm text-muted-foreground mb-0.5">entradas vendidas</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Media últimos 30 días: {metrics.avgDailySales} entradas/día
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
                {((metrics.currentRevenue / metrics.targetRevenue) * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">€{(metrics.currentRevenue / 1000).toFixed(0)}K</span>
              <span className="text-sm text-muted-foreground mb-0.5">/ €{(metrics.targetRevenue / 1000).toFixed(0)}K</span>
            </div>
            <Progress value={(metrics.currentRevenue / metrics.targetRevenue) * 100} className="h-1.5 mt-2" />
            <p className="text-[10px] text-muted-foreground mt-1">
              Faltan €{((metrics.targetRevenue - metrics.currentRevenue) / 1000).toFixed(0)}K para objetivo
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
              {topAlerts.map((alert, index) => (
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
