import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, CheckCircle2, Clock, Settings2 } from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ExternalDataSection from "@/components/integrations/ExternalDataSection";

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Integraciones" }]} />
        
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-lg font-bold text-foreground">Integraciones</h1>
          <p className="text-xs text-muted-foreground">
            Conexiones configuradas y gestionadas por el equipo de Tricket
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Integraciones gestionadas por Tricket
                </p>
                <p className="text-xs text-muted-foreground">
                  Todas las conexiones con ticketeras, plataformas de marketing y fuentes de datos 
                  son configuradas y mantenidas por el equipo de Tricket. Los datos se sincronizan 
                  automáticamente según el plan acordado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticketing Providers */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Ticketeras</h2>
          <p className="text-xs text-muted-foreground mb-3">Conexiones con plataformas de venta de entradas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "Ticketmaster",
                connected: true,
                events: 8,
                lastSync: "Hace 2 horas",
                tickets: 12500,
              },
              {
                name: "Entradas.com",
                connected: true,
                events: 5,
                lastSync: "Hace 4 horas",
                tickets: 8200,
              },
              {
                name: "Bclever",
                connected: true,
                events: 3,
                lastSync: "Hace 1 hora",
                tickets: 3400,
              },
              {
                name: "Forvenues",
                connected: false,
                events: 0,
                lastSync: null,
                tickets: 0,
                pending: true,
              },
            ].map((provider, i) => (
              <Card key={i} className={!provider.connected ? 'opacity-60' : ''}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Plug className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                    </div>
                    {provider.connected ? (
                      <Badge className="bg-success/10 text-success border-success/20 text-[10px] px-1.5 py-0 gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Sincronizado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        En proceso
                      </Badge>
                    )}
                  </div>
                  
                  {provider.connected && (
                    <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-lg font-bold">{provider.tickets.toLocaleString('es-ES')}</p>
                        <p className="text-[10px] text-muted-foreground">Tickets sync</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{provider.events}</p>
                        <p className="text-[10px] text-muted-foreground">Eventos</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-1">
                    {provider.lastSync ? (
                      <span className="text-[10px] text-muted-foreground">Última sincronización: {provider.lastSync}</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Configuración por Tricket en proceso</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketing & Ads Integrations */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Marketing & Publicidad</h2>
          <p className="text-xs text-muted-foreground mb-3">Plataformas de publicidad digital y redes sociales</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "Meta Ads",
                description: "Facebook e Instagram",
                status: "pending",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ),
                color: "text-blue-500 bg-blue-500/10",
                dataType: "Campañas, conversiones, ROAS"
              },
              {
                name: "Google Ads",
                description: "Búsqueda y Display",
                status: "pending",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ),
                color: "text-green-500 bg-green-500/10",
                dataType: "Keywords, CPC, conversiones"
              },
              {
                name: "TikTok Ads",
                description: "Publicidad en TikTok",
                status: "planned",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                ),
                color: "text-foreground bg-muted",
                dataType: "Alcance, engagement, CPM"
              },
              {
                name: "Twitter Ads",
                description: "X Ads Manager",
                status: "planned",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ),
                color: "text-foreground bg-muted",
                dataType: "Impresiones, clics, engagement"
              }
            ].map((platform, i) => (
              <Card key={i} className="opacity-70">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${platform.color}`}>
                        {platform.icon}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{platform.name}</span>
                        <span className="text-[10px] text-muted-foreground">{platform.description}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">{platform.dataType}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {platform.status === 'pending' ? 'En configuración' : 'Próximamente'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Marketing */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Email Marketing</h2>
          <p className="text-xs text-muted-foreground mb-3">Automatización y gestión de campañas de email</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "Mailchimp",
                description: "Email automation",
                connected: true,
                campaigns: 5,
                subscribers: 32000,
                lastSync: "Hace 2h",
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.709 6.009c.426 0 .791.142 1.089.424l-5.485 4.252L19.8 6.009h-.091zm-.107 1.05l-5.42 4.205.016.013-1.197.928-1.198-.929.015-.012-5.419-4.205v7.932c0 .36.134.67.402.932.269.262.585.393.95.393h9.503c.365 0 .682-.131.95-.393.268-.262.402-.572.402-.932V7.059h-.004zm-13.188-.424c.298-.282.663-.424 1.089-.424h-.09l5.485 4.676-5.484-4.252z"/>
                  </svg>
                ),
                color: "text-yellow-600 bg-yellow-500/10"
              },
              {
                name: "Brevo",
                description: "Email + SMS",
                connected: false,
                campaigns: 0,
                subscribers: 0,
                lastSync: null,
                icon: (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                ),
                color: "text-indigo-500 bg-indigo-500/10"
              }
            ].map((platform, i) => (
              <Card key={i} className={!platform.connected ? 'opacity-60' : ''}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${platform.color}`}>
                        {platform.icon}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{platform.name}</span>
                        <span className="text-[10px] text-muted-foreground">{platform.description}</span>
                      </div>
                    </div>
                    {platform.connected ? (
                      <Badge className="bg-success/10 text-success border-success/20 text-[10px] px-1.5 py-0 gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Sincronizado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        En proceso
                      </Badge>
                    )}
                  </div>
                  
                  {platform.connected && (
                    <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-lg font-bold">{platform.campaigns}</p>
                        <p className="text-[10px] text-muted-foreground">Campañas</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{(platform.subscribers / 1000).toFixed(0)}K</p>
                        <p className="text-[10px] text-muted-foreground">Suscriptores</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    {platform.lastSync ? (
                      <span className="text-[10px] text-muted-foreground">Última sync: {platform.lastSync}</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Configuración por Tricket en proceso</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* UTM & Tracking */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Tracking & Atribución</h2>
          <p className="text-xs text-muted-foreground mb-3">Herramientas de seguimiento configuradas por Tricket</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <svg className="h-4 w-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Gestión UTMs</span>
                      <span className="text-[10px] text-muted-foreground">Tracking campañas</span>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px] px-1.5 py-0 gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Activo
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-lg font-bold">24</p>
                    <p className="text-[10px] text-muted-foreground">UTMs activos</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">8.5K</p>
                    <p className="text-[10px] text-muted-foreground">Clics tracked</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground">Gestionado por Tricket</p>
              </CardContent>
            </Card>
            
            <Card className="opacity-60">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Plug className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">API Custom</span>
                      <span className="text-[10px] text-muted-foreground">Fuente propia</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    En proceso
                  </Badge>
                </div>
                
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground">Conexión con API REST propia</p>
                </div>
                
                <p className="text-[10px] text-muted-foreground">Configuración por Tricket en proceso</p>
              </CardContent>
            </Card>
            
            <Card className="opacity-60">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-500/10">
                      <Plug className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Webhooks</span>
                      <span className="text-[10px] text-muted-foreground">Tiempo real</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Próximamente</Badge>
                </div>
                
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground">Notificaciones automáticas</p>
                </div>
                
                <p className="text-[10px] text-muted-foreground">Disponible próximamente</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* External Data Sources */}
        <ExternalDataSection />
      </div>
    </div>
  );
};

export default Integrations;