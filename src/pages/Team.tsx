import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  UserPlus,
  Crown,
  Ticket,
  Megaphone,
  Clapperboard,
  DoorOpen,
  Wrench,
  Wine,
  TrendingUp,
  Settings,
  Plug,
  HardHat,
  Radio,
  Truck,
  Shield,
  Eye,
  Edit,
  Check,
  X
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Team members data
const teamMembers = [
  { name: "María García", role: "Director del Festival", email: "maria.garcia@primaverando.es", phone: "+34 612 345 678", status: "active", lastActivity: "Hace 2 horas" },
  { name: "Juan Pérez", role: "Ticketing Manager", email: "juan.perez@primaverando.es", phone: "+34 623 456 789", status: "active", lastActivity: "Hace 30 min" },
  { name: "Ana Martínez", role: "Marketing Manager", email: "ana.martinez@primaverando.es", phone: "+34 634 567 890", status: "active", lastActivity: "Hace 1 hora" },
  { name: "Carlos López", role: "Jefe de Producción", email: "carlos.lopez@primaverando.es", phone: "+34 645 678 901", status: "active", lastActivity: "Hace 15 min" },
  { name: "Laura Sánchez", role: "Coordinador de Accesos", email: "laura.sanchez@primaverando.es", phone: "+34 656 789 012", status: "active", lastActivity: "Ayer" },
  { name: "Pedro Ruiz", role: "Staff de Operaciones", email: "pedro.ruiz@primaverando.es", phone: "+34 667 890 123", status: "inactive", lastActivity: "Hace 3 días" },
  { name: "Elena Torres", role: "Equipo de Barras", email: "elena.torres@primaverando.es", phone: "+34 678 901 234", status: "active", lastActivity: "Hace 4 horas" },
];

// Festival roles with permissions
const festivalRoles = [
  {
    name: "Director del Festival",
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Control total sobre todas las áreas del festival",
    permissions: ["ventas", "marketing", "operaciones_pre", "operaciones_dia", "proveedores", "equipo", "integraciones", "config"]
  },
  {
    name: "Ticketing Manager",
    icon: Ticket,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Gestión de venta de entradas y previsiones",
    permissions: ["ventas", "integraciones"]
  },
  {
    name: "Marketing Manager",
    icon: Megaphone,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Campañas, audiencia y comunicación",
    permissions: ["ventas", "marketing"]
  },
  {
    name: "Jefe de Producción",
    icon: Clapperboard,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Escenarios, riders y logística técnica",
    permissions: ["operaciones_pre", "proveedores"]
  },
  {
    name: "Coordinador de Accesos",
    icon: DoorOpen,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Control de puertas y flujo de público",
    permissions: ["operaciones_dia"]
  },
  {
    name: "Staff de Operaciones",
    icon: Wrench,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    description: "Ejecución operativa durante el evento",
    permissions: ["operaciones_dia"]
  },
  {
    name: "Equipo de Barras",
    icon: Wine,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Gestión de consumos y puntos de venta",
    permissions: ["operaciones_dia"]
  }
];

// Permission categories
const permissionCategories = [
  { id: "ventas", name: "Ventas & BI", icon: TrendingUp, description: "Dashboard, previsiones, informes" },
  { id: "marketing", name: "Marketing", icon: Megaphone, description: "Campañas, audiencia, segmentación" },
  { id: "operaciones_pre", name: "Ops Pre-Festival", icon: HardHat, description: "Producción, logística, proveedores" },
  { id: "operaciones_dia", name: "Ops Día Festival", icon: Radio, description: "Accesos, incidencias, staff" },
  { id: "proveedores", name: "Proveedores", icon: Truck, description: "Contratos, entregas, pagos" },
  { id: "equipo", name: "Equipo & RRHH", icon: Users, description: "Miembros, roles, turnos" },
  { id: "integraciones", name: "Integraciones", icon: Plug, description: "Ticketeras, APIs, webhooks" },
  { id: "config", name: "Configuración", icon: Settings, description: "Ajustes generales del sistema" }
];

const Team = () => {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);

  const activeMembers = teamMembers.filter(m => m.status === "active").length;
  const uniqueRoles = [...new Set(teamMembers.map(m => m.role))].length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageBreadcrumb items={[{ label: "Equipo & Permisos" }]} />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Equipo & Permisos
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona el equipo del festival y configura los permisos de acceso
            </p>
          </div>
        </div>

        {/* Tabs for main sections */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Miembros del equipo
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              Roles y permisos
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total miembros</p>
                    <p className="text-2xl font-bold">{teamMembers.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold text-emerald-500">{activeMembers}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Nuevos este mes</p>
                    <p className="text-2xl font-bold text-blue-500">+2</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Roles activos</p>
                    <p className="text-2xl font-bold text-purple-500">{uniqueRoles}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Members Table */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Miembros del equipo</CardTitle>
                  <CardDescription className="text-xs">
                    Personas con acceso a la plataforma Primaverando
                  </CardDescription>
                </div>
                <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Añadir miembro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Añadir nuevo miembro</DialogTitle>
                      <DialogDescription>
                        Invita a un nuevo miembro al equipo de Primaverando
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input placeholder="Nombre completo" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="email@ejemplo.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input placeholder="+34 600 000 000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Rol</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              {festivalRoles.map(role => (
                                <SelectItem key={role.name} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setAddMemberOpen(false)}>
                        Enviar invitación
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6">Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden lg:table-cell">Última actividad</TableHead>
                      <TableHead className="text-right pr-6">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs font-normal">
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {member.phone}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                            <span className="text-xs">{member.status === "active" ? "Activo" : "Inactivo"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {member.lastActivity}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            {/* Permissions Overview Panel */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Categorías de permisos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                  {permissionCategories.map(cat => (
                    <div key={cat.id} className="flex flex-col items-center text-center p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors cursor-pointer">
                      <cat.icon className="h-5 w-5 text-primary mb-1" />
                      <p className="text-xs font-medium">{cat.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Roles Grid */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Roles del festival</h2>
              <Dialog open={createRoleOpen} onOpenChange={setCreateRoleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear rol personalizado
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear rol personalizado</DialogTitle>
                    <DialogDescription>
                      Define un nuevo rol con permisos específicos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre del rol</Label>
                        <Input placeholder="Ej: Coordinador VIP" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input placeholder="Breve descripción del rol" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Permisos</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border rounded-lg">
                        {permissionCategories.map(cat => (
                          <div key={cat.id} className="flex items-center gap-2">
                            <Switch id={cat.id} />
                            <Label htmlFor={cat.id} className="text-sm cursor-pointer">{cat.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateRoleOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setCreateRoleOpen(false)}>
                      Crear rol
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {festivalRoles.map((role) => (
                <Card key={role.name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${role.bgColor}`}>
                        <role.icon className={`h-5 w-5 ${role.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">{role.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5 line-clamp-2">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Permisos:</p>
                    <div className="flex flex-wrap gap-1">
                      {permissionCategories.map(cat => {
                        const hasPermission = role.permissions.includes(cat.id);
                        return (
                          <Badge 
                            key={cat.id}
                            variant={hasPermission ? "default" : "outline"}
                            className={`text-[10px] px-1.5 py-0 ${!hasPermission && "opacity-40"}`}
                          >
                            {hasPermission ? (
                              <Check className="h-2.5 w-2.5 mr-0.5" />
                            ) : (
                              <X className="h-2.5 w-2.5 mr-0.5" />
                            )}
                            {cat.name.split(" ")[0]}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Permissions Matrix */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Matriz de permisos detallada</CardTitle>
                <CardDescription className="text-xs">
                  Vista completa de qué puede hacer cada rol
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 w-48">Permiso</TableHead>
                      {festivalRoles.slice(0, 5).map(role => (
                        <TableHead key={role.name} className="text-center text-xs px-2">
                          <div className="flex flex-col items-center gap-1">
                            <role.icon className={`h-4 w-4 ${role.color}`} />
                            <span className="truncate max-w-[80px]">{role.name.split(" ").slice(-1)[0]}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionCategories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{cat.name}</span>
                          </div>
                        </TableCell>
                        {festivalRoles.slice(0, 5).map(role => (
                          <TableCell key={role.name} className="text-center">
                            {role.permissions.includes(cat.id) ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Team;
