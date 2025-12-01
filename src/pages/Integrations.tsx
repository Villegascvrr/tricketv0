import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plug, CheckCircle2, XCircle } from "lucide-react";

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Integraciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona las conexiones con ticketeras y fuentes de datos externas
          </p>
        </div>

        {/* Ticketing Providers */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ticketeras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Other Integrations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Otras Integraciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default Integrations;
