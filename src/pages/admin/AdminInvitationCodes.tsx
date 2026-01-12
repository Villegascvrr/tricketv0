import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, Plus, Copy, Search, Ban, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface InvitationCode {
  id: string;
  code: string;
  event_id: string;
  festival_role_id: string | null;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  created_at: string;
  event_name?: string;
  role_name?: string;
}

interface Event {
  id: string;
  name: string;
}

interface FestivalRole {
  id: string;
  name: string;
}

export default function AdminInvitationCodes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState({
    event_id: "",
    festival_role_id: "",
    max_uses: "",
    expires_days: "",
    is_owner: false,
  });

  // Fetch all invitation codes
  const { data: codes, isLoading } = useQuery({
    queryKey: ["admin-invitation-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch event and role names
      const codesWithInfo = await Promise.all(
        (data || []).map(async (code) => {
          const { data: event } = await supabase
            .from("events")
            .select("name")
            .eq("id", code.event_id)
            .single();

          let roleName = null;
          if (code.festival_role_id) {
            const { data: role } = await supabase
              .from("festival_roles")
              .select("name")
              .eq("id", code.festival_role_id)
              .single();
            roleName = role?.name;
          }

          return {
            ...code,
            event_name: event?.name,
            role_name: roleName,
          };
        })
      );

      return codesWithInfo as InvitationCode[];
    },
  });

  // Fetch events for dropdown
  const { data: events } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data as Event[];
    },
  });

  // Fetch festival roles
  const { data: roles } = useQuery({
    queryKey: ["festival-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festival_roles")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data as FestivalRole[];
    },
  });

  // Generate random code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create code mutation
  const createCodeMutation = useMutation({
    mutationFn: async () => {
      const code = generateCode();
      const expiresAt = newCode.expires_days
        ? new Date(Date.now() + parseInt(newCode.expires_days) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase.from("invitation_codes").insert({
        code,
        event_id: newCode.event_id,
        festival_role_id: newCode.is_owner ? null : newCode.festival_role_id || null,
        max_uses: newCode.max_uses ? parseInt(newCode.max_uses) : null,
        expires_at: expiresAt,
        created_by: user?.id,
        is_active: true,
      });

      if (error) throw error;
      return code;
    },
    onSuccess: (code) => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitation-codes"] });
      toast.success(`Código creado: ${code}`);
      navigator.clipboard.writeText(code);
      setIsDialogOpen(false);
      setNewCode({ event_id: "", festival_role_id: "", max_uses: "", expires_days: "", is_owner: false });
    },
    onError: (error: Error) => {
      toast.error("Error al crear código: " + error.message);
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("invitation_codes")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitation-codes"] });
      toast.success("Estado actualizado");
    },
    onError: (error: Error) => {
      toast.error("Error: " + error.message);
    },
  });

  const filteredCodes = codes?.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.event_name?.toLowerCase().includes(search.toLowerCase())
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Códigos de Invitación</h1>
        <p className="text-muted-foreground">
          Crea y gestiona códigos para invitar clientes y colaboradores
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Todos los Códigos
              </CardTitle>
              <CardDescription>
                {codes?.filter((c) => c.is_active).length || 0} códigos activos
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar códigos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Código
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Código de Invitación</DialogTitle>
                    <DialogDescription>
                      Genera un código para invitar a un nuevo cliente o colaborador
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Evento *</Label>
                      <Select
                        value={newCode.event_id}
                        onValueChange={(v) => setNewCode({ ...newCode, event_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {events?.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-owner"
                        checked={newCode.is_owner}
                        onCheckedChange={(checked) =>
                          setNewCode({ ...newCode, is_owner: checked, festival_role_id: "" })
                        }
                      />
                      <Label htmlFor="is-owner">Código Owner (acceso completo)</Label>
                    </div>

                    {!newCode.is_owner && (
                      <div className="space-y-2">
                        <Label>Rol del Festival</Label>
                        <Select
                          value={newCode.festival_role_id}
                          onValueChange={(v) => setNewCode({ ...newCode, festival_role_id: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sin rol específico" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles?.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Usos máximos</Label>
                        <Input
                          type="number"
                          placeholder="Ilimitado"
                          value={newCode.max_uses}
                          onChange={(e) => setNewCode({ ...newCode, max_uses: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expira en (días)</Label>
                        <Input
                          type="number"
                          placeholder="Sin expiración"
                          value={newCode.expires_days}
                          onChange={(e) => setNewCode({ ...newCode, expires_days: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => createCodeMutation.mutate()}
                      disabled={!newCode.event_id || createCodeMutation.isPending}
                    >
                      Crear Código
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Rol / Tipo</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes?.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="font-mono bg-muted px-2 py-1 rounded">
                          {code.code}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => copyCode(code.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{code.event_name}</TableCell>
                    <TableCell>
                      {code.festival_role_id === null && !code.role_name ? (
                        <Badge variant="default">Owner</Badge>
                      ) : (
                        <Badge variant="secondary">{code.role_name || "Sin rol"}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {code.current_uses}
                      {code.max_uses && ` / ${code.max_uses}`}
                    </TableCell>
                    <TableCell>
                      {code.expires_at
                        ? format(new Date(code.expires_at), "d MMM yyyy", { locale: es })
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      {code.is_active ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <Ban className="h-3 w-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleActiveMutation.mutate({
                            id: code.id,
                            is_active: !code.is_active,
                          })
                        }
                      >
                        {code.is_active ? "Desactivar" : "Activar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCodes?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron códigos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
