import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, MoreVertical } from "lucide-react";

const Team = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Equipo y Permisos
            </h1>
            <p className="text-muted-foreground">
              Gestiona los miembros de tu equipo y sus roles
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Invitar Miembro
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Miembros Totales</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 administradores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Invitaciones Pendientes</CardDescription>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                Esperando aceptación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Roles Activos</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tipos de permisos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros del Equipo</CardTitle>
            <CardDescription>
              Personas con acceso a la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "María García",
                  email: "maria.garcia@example.com",
                  role: "Administrador",
                  status: "active",
                },
                {
                  name: "Juan Pérez",
                  email: "juan.perez@example.com",
                  role: "Editor",
                  status: "active",
                },
                {
                  name: "Ana Martínez",
                  email: "ana.martinez@example.com",
                  role: "Visualizador",
                  status: "active",
                },
                {
                  name: "Carlos López",
                  email: "carlos.lopez@example.com",
                  role: "Editor",
                  status: "pending",
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                    {member.status === "pending" && (
                      <Badge variant="outline">Pendiente</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Roles y Permisos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <Badge className="mt-1">Administrador</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Acceso completo a todas las funciones, incluyendo gestión de
                equipo y configuración
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-1" variant="secondary">
                Editor
              </Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Puede crear y editar eventos, ver informes y gestionar
                recomendaciones
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-1" variant="outline">
                Visualizador
              </Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Solo puede ver eventos e informes, sin permisos de edición
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Team;
