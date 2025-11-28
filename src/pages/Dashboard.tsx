import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Vista general de todos tus eventos y métricas clave
          </p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Eventos Activos</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Ingresos Totales</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42.5M €</div>
              <p className="text-xs text-success mt-1">
                +15% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Entradas Vendidas</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">485K</div>
              <p className="text-xs text-muted-foreground mt-1">
                78% ocupación media
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Alertas IA</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-danger mt-1">
                3 críticas pendientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recientes</CardTitle>
            <CardDescription>Actividad de los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Festival Primavera Sound 2024",
                  status: "Activo",
                  ocupacion: 63.5,
                  variant: "secondary" as const,
                },
                {
                  name: "Mad Cool Festival",
                  status: "Próximo",
                  ocupacion: 45.2,
                  variant: "default" as const,
                },
                {
                  name: "Sónar Barcelona",
                  status: "Activo",
                  ocupacion: 89.1,
                  variant: "default" as const,
                },
              ].map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Ocupación: {event.ocupacion}%
                    </p>
                  </div>
                  <Badge variant={event.variant}>{event.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
