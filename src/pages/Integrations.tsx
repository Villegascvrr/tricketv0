import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plug, CheckCircle2, XCircle, Upload, FileSpreadsheet } from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { TicketImportDrawer } from "@/components/tickets/TicketImportDrawer";
import { TicketImportHistory } from "@/components/tickets/TicketImportHistory";
import ExternalDataSection from "@/components/integrations/ExternalDataSection";

// Event ID for the current festival
const EVENT_ID = "demo-primaverando-2025";

const Integrations = () => {
  const [importDrawerOpen, setImportDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Integraciones" }]} />
        
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-lg font-bold text-foreground">Integraciones</h1>
          <p className="text-xs text-muted-foreground">Gestiona las conexiones con ticketeras y fuentes de datos externas</p>
        </div>

        {/* External Data Sources */}
        <ExternalDataSection />

        {/* Manual Import Section */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Importación Manual de Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Importar desde CSV/Excel</CardTitle>
                      <CardDescription>
                        Sube archivos de ticketeras manualmente
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importa datos de ventas desde archivos CSV o Excel exportados de tus ticketeras
                </p>
                <Button onClick={() => setImportDrawerOpen(true)} className="w-full">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Importar Tickets
                </Button>
              </CardContent>
            </Card>

            {/* Import History Card */}
            <TicketImportHistory eventId={EVENT_ID} />
          </div>
        </div>

        {/* Ticketing Providers */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Ticketeras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                name: "Ticketmaster",
                connected: true,
                events: 8,
                lastSync: "Hace 2 horas",
              },
              {
                name: "Entradas.com",
                connected: true,
                events: 5,
                lastSync: "Hace 4 horas",
              },
              {
                name: "Bclever",
                connected: true,
                events: 3,
                lastSync: "Hace 1 hora",
              },
              {
                name: "Forvenues",
                connected: false,
                events: 0,
                lastSync: null,
              },
            ].map((provider, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Plug className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>
                          {provider.connected
                            ? `${provider.events} eventos activos`
                            : "No conectada"}
                        </CardDescription>
                      </div>
                    </div>
                    {provider.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {provider.lastSync && (
                    <p className="text-sm text-muted-foreground">
                      Última sincronización: {provider.lastSync}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {provider.connected ? "Conectada" : "Conectar"}
                    </span>
                    <Switch checked={provider.connected} />
                  </div>
                  {provider.connected && (
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketing & Ads Integrations */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Marketing & Publicidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Meta Ads</CardTitle>
                      <CardDescription>
                        Facebook e Instagram Ads
                      </CardDescription>
                    </div>
                  </div>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sincroniza campañas y métricas de conversión
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conectar</span>
                  <Switch checked={false} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Configurar cuenta
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Google Ads</CardTitle>
                      <CardDescription>
                        Campañas de búsqueda y display
                      </CardDescription>
                    </div>
                  </div>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importa conversiones y optimiza campañas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conectar</span>
                  <Switch checked={false} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Configurar cuenta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Marketing */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Email Marketing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.709 6.009c.426 0 .791.142 1.089.424l-5.485 4.252L19.8 6.009h-.091zm-.107 1.05l-5.42 4.205.016.013-1.197.928-1.198-.929.015-.012-5.419-4.205v7.932c0 .36.134.67.402.932.269.262.585.393.95.393h9.503c.365 0 .682-.131.95-.393.268-.262.402-.572.402-.932V7.059h-.004zm-13.188-.424c.298-.282.663-.424 1.089-.424h-.09l5.485 4.676-5.484-4.252z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Mailchimp</CardTitle>
                      <CardDescription>
                        Automatización de email marketing
                      </CardDescription>
                    </div>
                  </div>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sincroniza listas y segmentos automáticamente
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conectar</span>
                  <Switch checked={false} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Conectar Mailchimp
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <svg className="h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Brevo (Sendinblue)</CardTitle>
                      <CardDescription>
                        Email, SMS y automatización
                      </CardDescription>
                    </div>
                  </div>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gestiona campañas multicanal desde un solo lugar
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conectar</span>
                  <Switch checked={false} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Conectar Brevo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* UTM & Tracking */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Tracking & Atribución</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <svg className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Gestión de UTMs</CardTitle>
                      <CardDescription>
                        Tracking de campañas y fuentes
                      </CardDescription>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Genera y gestiona UTMs para todas tus campañas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activo</span>
                  <Switch checked={true} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Configurar UTMs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plug className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Personalizada</CardTitle>
                    <CardDescription>
                      Conecta tu propia fuente de datos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Webhooks */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Otras Integraciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plug className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Webhooks</CardTitle>
                    <CardDescription>
                      Recibe notificaciones en tiempo real
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Próximamente</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Import Drawer */}
      <TicketImportDrawer
        open={importDrawerOpen}
        onOpenChange={setImportDrawerOpen}
        eventId={EVENT_ID}
      />
    </div>
  );
};

export default Integrations;
