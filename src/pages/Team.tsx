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
  ClipboardList,
  Shield,
  BarChart3,
  TrendingUp,
  Settings,
  Plug,
  HardHat,
  Radio,
  Truck,
  Eye,
  Edit,
  Check,
  X,
  Loader2
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { useTeamMembers, FestivalRole } from "@/hooks/useTeamMembers";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Icon mapping for festival roles
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown,
  Ticket,
  Megaphone,
  ClipboardList,
  Shield,
  Users,
  BarChart3,
};

// Permission categories (static - these are system-level)
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
  
  // Form state for new member
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberRoleId, setNewMemberRoleId] = useState("");

  const { 
    roles, 
    members, 
    isLoading, 
    inviteMember, 
    isInviting 
  } = useTeamMembers();

  const activeMembers = members.filter(m => m.status === "active").length;
  const invitedMembers = members.filter(m => m.status === "invited").length;
  const uniqueRoles = [...new Set(members.map(m => m.festival_role?.name).filter(Boolean))].length;

  const handleInviteMember = () => {
    if (!newMemberEmail) return;
    
    inviteMember({
      email: newMemberEmail,
      name: newMemberName || undefined,
      phone: newMemberPhone || undefined,
      festival_role_id: newMemberRoleId || undefined,
    });
    
    // Reset form
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPhone("");
    setNewMemberRoleId("");
    setAddMemberOpen(false);
  };

  const getRoleIcon = (role: FestivalRole | null | undefined) => {
    if (!role?.icon) return Users;
    return iconMap[role.icon] || Users;
  };

  const formatLastActivity = (dateStr: string | null) => {
    if (!dateStr) return "Sin actividad";
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: es });
    } catch {
      return "Sin actividad";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Equipo & Permisos" }]} />
        
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-lg font-bold text-foreground">Equipo & Permisos</h1>
          <p className="text-xs text-muted-foreground">Gestiona el equipo del festival y configura los permisos de acceso</p>
        </div>

        {/* Tabs for main sections */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="members" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Miembros del equipo
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" />
              Roles y permisos
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{members.length}</p>
                  <p className="text-xs text-muted-foreground">Total miembros</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-success">{activeMembers}</p>
                  <p className="text-xs text-muted-foreground">Activos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <UserPlus className="h-4 w-4 text-accent-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-accent-foreground">{invitedMembers}</p>
                  <p className="text-xs text-muted-foreground">Invitados pendientes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Shield className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{uniqueRoles}</p>
                  <p className="text-xs text-muted-foreground">Roles activos</p>
                </CardContent>
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
                          <Input 
                            placeholder="Nombre completo" 
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input 
                            type="email" 
                            placeholder="email@ejemplo.com" 
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input 
                            placeholder="+34 600 000 000" 
                            value={newMemberPhone}
                            onChange={(e) => setNewMemberPhone(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rol</Label>
                          <Select value={newMemberRoleId} onValueChange={setNewMemberRoleId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(role => (
                                <SelectItem key={role.id} value={role.id}>
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
                      <Button 
                        onClick={handleInviteMember} 
                        disabled={!newMemberEmail || isInviting}
                      >
                        {isInviting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Enviar invitación"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                {members.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No hay miembros en el equipo</p>
                    <p className="text-xs">Añade el primer miembro usando el botón de arriba</p>
                  </div>
                ) : (
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
                      {members.map((member) => {
                        const RoleIcon = getRoleIcon(member.festival_role);
                        return (
                          <TableRow key={member.id}>
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {(member.name || member.email).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{member.name || "Sin nombre"}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {member.festival_role ? (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs font-normal ${member.festival_role.bg_color || ''} ${member.festival_role.color || ''}`}
                                >
                                  <RoleIcon className="h-3 w-3 mr-1" />
                                  {member.festival_role.name}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs font-normal">
                                  Sin rol
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {member.phone || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${
                                  member.status === "active" ? "bg-emerald-500" : 
                                  member.status === "invited" ? "bg-amber-500" : "bg-muted-foreground"
                                }`} />
                                <span className="text-xs capitalize">
                                  {member.status === "active" ? "Activo" : 
                                   member.status === "invited" ? "Invitado" : "Inactivo"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                              {formatLastActivity(member.last_activity)}
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
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
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
              {roles.map((role) => {
                const RoleIcon = iconMap[role.icon || ''] || Users;
                return (
                  <Card key={role.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${role.bg_color || 'bg-muted'}`}>
                          <RoleIcon className={`h-5 w-5 ${role.color || 'text-muted-foreground'}`} />
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
                          const hasPermission = role.permissions?.includes(cat.id);
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
                );
              })}
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
                      {roles.slice(0, 5).map(role => {
                        const RoleIcon = iconMap[role.icon || ''] || Users;
                        return (
                          <TableHead key={role.id} className="text-center text-xs px-2">
                            <div className="flex flex-col items-center gap-1">
                              <RoleIcon className={`h-4 w-4 ${role.color || 'text-muted-foreground'}`} />
                              <span className="truncate max-w-[80px]">{role.name.split(" ").slice(-1)[0]}</span>
                            </div>
                          </TableHead>
                        );
                      })}
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
                        {roles.slice(0, 5).map(role => (
                          <TableCell key={role.id} className="text-center">
                            {role.permissions?.includes(cat.id) ? (
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
