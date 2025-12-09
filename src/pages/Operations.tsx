import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Shield, Truck, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Operations = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Operaciones del Festival
          </h1>
          <p className="text-muted-foreground">
            Gestión operativa, logística y seguridad del Primaverando 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Personal</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">245</div>
              <p className="text-xs text-muted-foreground mt-1">Staff confirmado</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Seguridad</CardDescription>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85</div>
              <p className="text-xs text-success mt-1">+15 vs 2024</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Proveedores</CardDescription>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">32</div>
              <p className="text-xs text-muted-foreground mt-1">Contratos activos</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-warning">Incidencias</CardDescription>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">3</div>
              <p className="text-xs text-warning/80 mt-1">Pendientes de resolver</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Zonas del Festival</CardTitle>
              <CardDescription>Estado operativo por zona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Escenario Principal", status: "Operativo", capacity: "15,000" },
                { name: "Zona Pista", status: "En preparación", capacity: "25,000" },
                { name: "Área VIP", status: "Operativo", capacity: "2,000" },
                { name: "Food Court", status: "Pendiente", capacity: "5,000" },
              ].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">Capacidad: {zone.capacity}</p>
                  </div>
                  <Badge variant={zone.status === "Operativo" ? "default" : zone.status === "Pendiente" ? "destructive" : "secondary"}>
                    {zone.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist Operativo</CardTitle>
              <CardDescription>Tareas críticas previas al festival</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { task: "Permisos municipales", completed: true },
                { task: "Contrato seguridad", completed: true },
                { task: "Plan de evacuación", completed: false },
                { task: "Prueba de sonido", completed: false },
                { task: "Coordinación sanitaria", completed: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <p className={item.completed ? "text-muted-foreground line-through" : "font-medium"}>
                    {item.task}
                  </p>
                  <Badge variant={item.completed ? "secondary" : "outline"}>
                    {item.completed ? "Completado" : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Operations;