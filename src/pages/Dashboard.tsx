import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, TrendingUp, Users, Music, MapPin, Clock } from "lucide-react";
import { festivalData } from "@/data/festivalData";

const Dashboard = () => {
  const { overview, artistas, operacional } = festivalData;
  
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                Primaverando 2025
              </h1>
              <p className="text-muted-foreground mt-1">
                Panel de control del festival universitario más grande de Andalucía
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>29 marzo 2025</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>La Cartuja, Sevilla</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{operacional.apertura} - {operacional.cierre}</span>
              </div>
            </div>
          </div>
          
          {/* Artists Banner */}
          <Card className="gradient-festival text-white border-0 overflow-hidden">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 shrink-0" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium shrink-0">Line-up:</span>
                  {artistas.map((artista, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30">
                      {artista}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium">Aforo Total</CardDescription>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">
                {festivalData.aforoTotal.toLocaleString('es-ES')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Capacidad del recinto
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium">Entradas Vendidas</CardDescription>
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">
                {overview.entradasVendidas.toLocaleString('es-ES')}
              </div>
              <p className="text-xs text-success mt-1">
                {(overview.ocupacion * 100).toFixed(0)}% ocupación
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium">Ingresos Totales</CardDescription>
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">
                {(overview.ingresosTotales / 1000).toFixed(0)}K €
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ~23€ precio medio
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium">Edición</CardDescription>
                <div className="p-2 rounded-lg bg-warning/10">
                  <Calendar className="h-4 w-4 text-warning" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">6ª</div>
              <p className="text-xs text-muted-foreground mt-1">
                Desde 2019
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">Festivales 2025</CardTitle>
              <CardDescription>Calendario de eventos de FESTIVALES OCIO JOVEN S.L.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold font-display">Primaverando Festival</p>
                    <p className="text-sm text-muted-foreground">
                      29 marzo • La Cartuja
                    </p>
                  </div>
                  <Badge className="gradient-festival text-white border-0">Activo</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold font-display">Bienvenida Fest</p>
                    <p className="text-sm text-muted-foreground">
                      4 octubre • La Cartuja
                    </p>
                  </div>
                  <Badge variant="secondary">Próximo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">Perfil de Audiencia</CardTitle>
              <CardDescription>Público universitario 20-30 años</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Principales provincias</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {festivalData.audiencia.provincias.slice(0, 4).map((prov, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{prov.nombre}</span>
                      <span className="text-sm text-muted-foreground">{(prov.asistentes / 10).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rango de edad principal</span>
                    <span className="font-medium">18-24 años (52%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
