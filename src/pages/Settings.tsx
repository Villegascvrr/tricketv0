import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Save } from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Configuración" }]} />
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <SettingsIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Configuración</h1>
            <p className="text-xs text-muted-foreground">Gestiona las preferencias globales de tu cuenta</p>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Configuración básica de la cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la Empresa</Label>
              <Input
                id="company"
                placeholder="Tu empresa"
                defaultValue="Tricket Brain Events"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input
                id="email"
                type="email"
                placeholder="contacto@example.com"
                defaultValue="contacto@tricketbrain.com"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ca">Català</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select defaultValue="eur">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select defaultValue="europe-madrid">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-madrid">
                    Europe/Madrid (UTC+1)
                  </SelectItem>
                  <SelectItem value="europe-london">
                    Europe/London (UTC+0)
                  </SelectItem>
                  <SelectItem value="america-new-york">
                    America/New_York (UTC-5)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Configura cómo quieres recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas IA Críticas</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe emails cuando hay alertas de alta prioridad
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumen Diario</Label>
                <p className="text-sm text-muted-foreground">
                  Email con resumen de eventos y métricas
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Actualizaciones de Producto</Label>
                <p className="text-sm text-muted-foreground">
                  Novedades y mejoras de Tricket Brain
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Inteligencia Artificial</CardTitle>
            <CardDescription>
              Personaliza cómo la IA analiza tus eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recomendaciones Automáticas</Label>
                <p className="text-sm text-muted-foreground">
                  Genera recomendaciones cada 24 horas
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="sensitivity">Sensibilidad de Alertas</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="sensitivity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja - Solo críticas</SelectItem>
                  <SelectItem value="medium">Media - Equilibrada</SelectItem>
                  <SelectItem value="high">Alta - Todas las alertas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
