import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Target, Calendar } from "lucide-react";

const SalesForecasts = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Ventas & Previsiones
          </h1>
          <p className="text-muted-foreground">
            Análisis de ventas, tendencias y proyecciones del Primaverando 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Ventas Totales</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€2.4M</div>
              <p className="text-xs text-success mt-1">+18% vs objetivo</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Entradas Vendidas</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">38,500</div>
              <p className="text-xs text-muted-foreground mt-1">77% del aforo</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Ticket Medio</CardDescription>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€62.34</div>
              <p className="text-xs text-success mt-1">+5% vs 2024</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Días para Festival</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">112</div>
              <p className="text-xs text-muted-foreground mt-1">29 Mar 2025</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Previsiones de Venta</CardTitle>
            <CardDescription>Proyección basada en tendencias históricas y actuales</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Gráficos de previsión próximamente
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesForecasts;