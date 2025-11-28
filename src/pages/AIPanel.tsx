import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Target, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const AIPanel = () => {
  // Fetch all events and their recommendations
  const { data: eventsData, isLoading, refetch } = useQuery({
    queryKey: ['all-events-recommendations'],
    queryFn: async () => {
      // Get all events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (eventsError) throw eventsError;
      
      // Get recommendations for all events
      const eventsWithRecommendations = await Promise.all(
        (events || []).map(async (event) => {
          try {
            const { data, error } = await supabase.functions.invoke('event-recommendations', {
              body: { eventId: event.id }
            });
            
            if (error) {
              console.error(`Error fetching recommendations for event ${event.id}:`, error);
              return { event, recommendations: [] };
            }
            
            return { event, recommendations: data?.recommendations || [] };
          } catch (err) {
            console.error(`Error fetching recommendations for event ${event.id}:`, err);
            return { event, recommendations: [] };
          }
        })
      );
      
      return eventsWithRecommendations;
    },
    staleTime: 0,
  });

  // Aggregate statistics across all events
  const aggregateStats = (eventsData || []).reduce(
    (acc, { recommendations }) => {
      recommendations.forEach((rec: any) => {
        if (rec.priority === 'high') acc.critical++;
        // We don't track status here, so we'll show total recommendations instead
      });
      acc.total += recommendations.length;
      return acc;
    },
    { critical: 0, total: 0 }
  );

  // Flatten all recommendations with event info
  const allAlerts = (eventsData || []).flatMap(({ event, recommendations }) =>
    recommendations.map((rec: any) => ({
      ...rec,
      eventName: event.name,
      eventId: event.id,
    }))
  );

  // Sort by priority and take most recent
  const recentAlerts = allAlerts
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
    })
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Centro de Alertas IA
              </h1>
              <p className="text-muted-foreground">
                Recomendaciones y alertas inteligentes de todos tus eventos
              </p>
            </div>
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Actualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-danger/30 bg-danger/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Alertas Críticas</CardDescription>
                <AlertTriangle className="h-4 w-4 text-danger" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-danger">
                {isLoading ? "..." : aggregateStats.critical}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requieren acción inmediata
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Recomendaciones</CardDescription>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? "..." : aggregateStats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                En todos los eventos activos
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-success/30 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Eventos Monitorizados</CardDescription>
                <Target className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {isLoading ? "..." : (eventsData?.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Con análisis de IA activo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
            <CardDescription>
              Últimas recomendaciones generadas por la IA en orden de prioridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-spin" />
                <p className="text-muted-foreground">Cargando recomendaciones...</p>
              </div>
            ) : recentAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hay alertas en este momento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert: any, i: number) => (
                  <div
                    key={`${alert.eventId}-${alert.id}-${i}`}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <AlertTriangle
                      className={cn(
                        "h-5 w-5 mt-0.5",
                        alert.priority === "high" && "text-danger",
                        alert.priority === "medium" && "text-warning",
                        alert.priority === "low" && "text-primary"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold">{alert.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {alert.eventName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            alert.priority === "high" ? "destructive" : 
                            alert.priority === "medium" ? "default" : 
                            "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.priority === "high" ? "Alta" : 
                           alert.priority === "medium" ? "Media" : 
                           "Baja"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.category === "marketing" ? "Marketing" :
                           alert.category === "pricing" ? "Pricing" :
                           "Alerta"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPanel;
