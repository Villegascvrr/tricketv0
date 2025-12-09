import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Mail, Share2, Target } from "lucide-react";

const Marketing = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Marketing & Campañas
          </h1>
          <p className="text-muted-foreground">
            Gestión de campañas y rendimiento de marketing del Primaverando 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Campañas Activas</CardDescription>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">2 en redes, 3 email</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Tasa Conversión</CardDescription>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2%</div>
              <p className="text-xs text-success mt-1">+0.8% vs objetivo</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Emails Enviados</CardDescription>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45K</div>
              <p className="text-xs text-muted-foreground mt-1">32% apertura</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Social Reach</CardDescription>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.2M</div>
              <p className="text-xs text-success mt-1">+45% esta semana</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento de Campañas</CardTitle>
            <CardDescription>Análisis de conversión y ROI por canal</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Dashboard de campañas próximamente
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Marketing;