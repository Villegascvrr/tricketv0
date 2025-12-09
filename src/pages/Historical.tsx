import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, TrendingUp, Calendar, BarChart3 } from "lucide-react";

const Historical = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Histórico & Comparativas
          </h1>
          <p className="text-muted-foreground">
            Análisis histórico y comparativas entre ediciones del Primaverando
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Ediciones</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">2022-2025</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Crecimiento Medio</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+23%</div>
              <p className="text-xs text-success mt-1">Año sobre año</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Mejor Edición</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2024</div>
              <p className="text-xs text-muted-foreground mt-1">€2.1M ingresos</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Asistentes</CardDescription>
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">142K</div>
              <p className="text-xs text-muted-foreground mt-1">Acumulado histórico</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa por Edición</CardTitle>
              <CardDescription>Evolución de métricas clave</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico comparativo próximamente
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias Históricas</CardTitle>
              <CardDescription>Patrones de venta y asistencia</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              Análisis de tendencias próximamente
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Historical;