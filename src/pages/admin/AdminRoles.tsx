import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Ticket,
  BarChart3,
  Settings,
  Megaphone,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";

interface FestivalRole {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  bg_color: string | null;
  permissions: string[];
  created_at: string;
}

const permissionCategories = [
  { id: "ventas", name: "Ventas", icon: Ticket, description: "Acceso a datos de ventas y tickets" },
  { id: "marketing", name: "Marketing", icon: Megaphone, description: "Gestión de campañas" },
  { id: "operaciones", name: "Operaciones", icon: Calendar, description: "Gestión operativa del festival" },
  { id: "audiencia", name: "Audiencia", icon: Users, description: "Datos de público y demografía" },
  { id: "reportes", name: "Reportes", icon: BarChart3, description: "Informes y análisis" },
  { id: "configuracion", name: "Configuración", icon: Settings, description: "Ajustes del evento" },
];

const iconOptions = ["Users", "Shield", "Ticket", "Megaphone", "Calendar", "Settings", "BarChart3"];

export default function AdminRoles() {
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<FestivalRole | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Users",
    color: "#6366f1",
    permissions: [] as string[],
  });

  // Fetch all roles
  const { data: roles, isLoading } = useQuery({
    queryKey: ["admin-festival-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festival_roles")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as FestivalRole[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        // Update
        const { error } = await supabase
          .from("festival_roles")
          .update({
            name: data.name,
            description: data.description || null,
            icon: data.icon,
            color: data.color,
            permissions: data.permissions,
          })
          .eq("id", data.id);
        if (error) throw error;
        return { ...data, isUpdate: true };
      } else {
        // Create
        const { data: newRole, error } = await supabase.from("festival_roles").insert({
          name: data.name,
          description: data.description || null,
          icon: data.icon,
          color: data.color,
          permissions: data.permissions,
        }).select().single();
        if (error) throw error;
        return { ...data, id: newRole.id, isUpdate: false };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-festival-roles"] });
      toast.success(result.isUpdate ? "Rol actualizado" : "Rol creado");
      logAction({
        action: result.isUpdate ? "update" : "create",
        entity_type: "festival_role",
        entity_id: result.id,
        old_value: result.isUpdate && editingRole ? { name: editingRole.name, permissions: editingRole.permissions } : undefined,
        new_value: { name: result.name, permissions: result.permissions },
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error("Error: " + error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (role: FestivalRole) => {
      const { error } = await supabase.from("festival_roles").delete().eq("id", role.id);
      if (error) throw error;
      return role;
    },
    onSuccess: (deletedRole) => {
      queryClient.invalidateQueries({ queryKey: ["admin-festival-roles"] });
      toast.success("Rol eliminado");
      logAction({
        action: "delete",
        entity_type: "festival_role",
        entity_id: deletedRole.id,
        old_value: { name: deletedRole.name, permissions: deletedRole.permissions },
      });
    },
    onError: (error: Error) => {
      toast.error("Error: " + error.message);
    },
  });

  const handleOpenDialog = (role?: FestivalRole) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || "",
        icon: role.icon || "Users",
        color: role.color || "#6366f1",
        permissions: role.permissions || [],
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        description: "",
        icon: "Users",
        color: "#6366f1",
        permissions: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      icon: "Users",
      color: "#6366f1",
      permissions: [],
    });
  };

  const togglePermission = (permId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    saveMutation.mutate({ ...formData, id: editingRole?.id });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles del Sistema</h1>
        <p className="text-muted-foreground">
          Gestiona los roles y permisos para miembros del equipo
        </p>
      </div>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Permisos</CardTitle>
          <CardDescription>Permisos disponibles para asignar a roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {permissionCategories.map((perm) => (
              <div key={perm.id} className="flex flex-col items-center p-4 border rounded-lg">
                <perm.icon className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium text-sm">{perm.name}</span>
                <span className="text-xs text-muted-foreground text-center mt-1">
                  {perm.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles de Festival
              </CardTitle>
              <CardDescription>{roles?.length || 0} roles configurados</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Rol
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles?.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: role.color || "#6366f1" }}
                        >
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {(!role.permissions || role.permissions.length === 0) && (
                          <span className="text-muted-foreground text-sm">Sin permisos</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(role)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {roles?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay roles configurados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permisos</CardTitle>
          <CardDescription>Visualiza qué permisos tiene cada rol</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                {permissionCategories.map((perm) => (
                  <TableHead key={perm.id} className="text-center">
                    <perm.icon className="h-4 w-4 mx-auto" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  {permissionCategories.map((perm) => (
                    <TableCell key={perm.id} className="text-center">
                      {role.permissions?.includes(perm.id) ? (
                        <Badge variant="default" className="h-6 w-6 p-0 rounded-full">
                          ✓
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Modifica los datos del rol" : "Crea un nuevo rol para el equipo"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Coordinador de Escenario"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del rol..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>Permisos</Label>
              <div className="grid grid-cols-2 gap-2">
                {permissionCategories.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={perm.id}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label htmlFor={perm.id} className="text-sm font-normal">
                      {perm.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {editingRole ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
