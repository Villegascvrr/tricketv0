import { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { profile, teamMemberInfo, isLoading, updateProfile, updatePhone, isUpdating } = useUserProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  // Notification preferences (local state for now)
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    dailySummary: true,
    productUpdates: false,
  });

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: teamMemberInfo?.phone || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (formData.full_name !== profile?.full_name) {
      updateProfile({ full_name: formData.full_name });
    }
    if (teamMemberInfo && formData.phone !== teamMemberInfo.phone) {
      updatePhone(formData.phone);
    }
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido guardados correctamente.",
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const festivalRole = teamMemberInfo?.festival_role;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb 
        items={[
          { label: 'Mi Perfil' }
        ]} 
      />

      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div 
          className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-semibold"
          style={{ 
            backgroundColor: festivalRole?.bg_color || 'hsl(var(--muted))',
            color: festivalRole?.color || 'hsl(var(--muted-foreground))'
          }}
        >
          {getInitials(profile?.full_name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name || 'Usuario'}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          {festivalRole && (
            <Badge 
              className="mt-1"
              style={{ 
                backgroundColor: festivalRole.bg_color || undefined,
                color: festivalRole.color || undefined
              }}
            >
              {festivalRole.icon} {festivalRole.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos Personales
            </CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Editar
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                Guardar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nombre completo
              </Label>
              {isEditing ? (
                <Input 
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Tu nombre"
                />
              ) : (
                <p className="text-sm">{profile?.full_name || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">El email no se puede modificar</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Teléfono
              </Label>
              {isEditing && teamMemberInfo ? (
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+34 612 345 678"
                />
              ) : (
                <p className="text-sm">{teamMemberInfo?.phone || '-'}</p>
              )}
              {!teamMemberInfo && (
                <p className="text-xs text-muted-foreground">Debes ser miembro del equipo para añadir teléfono</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Festival Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tu Rol en el Festival
            </CardTitle>
          </CardHeader>
          <CardContent>
            {festivalRole ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: festivalRole.bg_color || 'hsl(var(--muted))',
                      color: festivalRole.color || 'hsl(var(--muted-foreground))'
                    }}
                  >
                    {festivalRole.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{festivalRole.name}</p>
                    <p className="text-sm text-muted-foreground">{festivalRole.description}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2">Permisos</p>
                  <div className="flex flex-wrap gap-2">
                    {festivalRole.permissions?.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No estás asignado al equipo del festival</p>
                <p className="text-sm">Contacta con un administrador para obtener acceso</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Alertas IA críticas</p>
                  <p className="text-sm text-muted-foreground">Alertas urgentes del sistema</p>
                </div>
                <Switch 
                  checked={notifications.criticalAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, criticalAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Resumen diario</p>
                  <p className="text-sm text-muted-foreground">Email con el resumen del día</p>
                </div>
                <Switch 
                  checked={notifications.dailySummary}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, dailySummary: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Actualizaciones</p>
                  <p className="text-sm text-muted-foreground">Novedades del producto</p>
                </div>
                <Switch 
                  checked={notifications.productUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, productUpdates: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
