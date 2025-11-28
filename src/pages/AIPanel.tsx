import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, TrendingUp, Target } from "lucide-react";

const AIPanel = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
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
              <div className="text-3xl font-bold text-danger">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requieren acción inmediata
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/30 bg-warning/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>En Progreso</CardDescription>
                <TrendingUp className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Siendo implementadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-success/30 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Completadas</CardDescription>
                <Target className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">34</div>
              <p className="text-xs text-muted-foreground mt-1">
                En las últimas 4 semanas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
            <CardDescription>
              Últimas recomendaciones generadas por la IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  event: "Festival Primavera Sound 2024",
                  title: "Ocupación por debajo del objetivo",
                  category: "Alerta",
                  priority: "high",
                  status: "pending",
                },
                {
                  event: "Mad Cool Festival",
                  title: "Oportunidad de upselling en VIP",
                  category: "Oportunidad",
                  priority: "medium",
                  status: "in_progress",
                },
                {
                  event: "Sónar Barcelona",
                  title: "Precio promedio bajo, ajustar estrategia",
                  category: "Pricing",
                  priority: "high",
                  status: "pending",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.priority === "high" ? "text-danger" : "text-warning"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold">{alert.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {alert.event}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          alert.priority === "high" ? "destructive" : "default"
                        }
                        className="text-xs"
                      >
                        {alert.priority === "high" ? "Alta" : "Media"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {alert.status === "pending"
                          ? "Pendiente"
                          : "En progreso"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPanel;
