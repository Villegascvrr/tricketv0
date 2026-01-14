import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Send,
  MousePointerClick,
  Eye,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  ExternalLink,
  BarChart3,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Email campaigns data
const emailCampaigns = [
  {
    id: 1,
    name: "Lanzamiento Early Bird",
    sentDate: "15 Nov 2024",
    status: "completed",
    recipients: 28500,
    delivered: 27930,
    opened: 9120,
    clicked: 2850,
    conversions: 285,
    revenue: 14250,
    openRate: 32.0,
    clickRate: 10.0,
    conversionRate: 1.0
  },
  {
    id: 2,
    name: "Black Friday Special",
    sentDate: "24 Nov 2024",
    status: "completed",
    recipients: 28500,
    delivered: 28215,
    opened: 11400,
    clicked: 4560,
    conversions: 456,
    revenue: 27360,
    openRate: 40.0,
    clickRate: 16.0,
    conversionRate: 1.6
  },
  {
    id: 3,
    name: "Cartel Reveal 2025",
    sentDate: "5 Dic 2024",
    status: "completed",
    recipients: 32000,
    delivered: 31680,
    opened: 12800,
    clicked: 3840,
    conversions: 192,
    revenue: 11520,
    openRate: 40.0,
    clickRate: 12.0,
    conversionRate: 0.6
  },
  {
    id: 4,
    name: "Últimas Plazas VIP",
    sentDate: "10 Dic 2024",
    status: "completed",
    recipients: 15000,
    delivered: 14850,
    opened: 5940,
    clicked: 1782,
    conversions: 89,
    revenue: 8900,
    openRate: 40.0,
    clickRate: 12.0,
    conversionRate: 0.6
  },
  {
    id: 5,
    name: "Recordatorio 1 Semana",
    sentDate: "15 Dic 2024",
    status: "sent",
    recipients: 35000,
    delivered: 34650,
    opened: 10395,
    clicked: 2772,
    conversions: 42,
    revenue: 2520,
    openRate: 30.0,
    clickRate: 8.0,
    conversionRate: 0.1
  }
];

// Performance evolution data
const performanceEvolution = [
  { campaign: "Early Bird", openRate: 32, clickRate: 10, conversionRate: 1.0 },
  { campaign: "Black Friday", openRate: 40, clickRate: 16, conversionRate: 1.6 },
  { campaign: "Cartel Reveal", openRate: 40, clickRate: 12, conversionRate: 0.6 },
  { campaign: "Últimas VIP", openRate: 40, clickRate: 12, conversionRate: 0.6 },
  { campaign: "Recordatorio", openRate: 30, clickRate: 8, conversionRate: 0.1 },
];

// Channel comparison data
const channelComparison = [
  { channel: "Email", conversions: 1064, revenue: 64550, cpa: 2.8, roi: 12.5 },
  { channel: "Instagram Ads", conversions: 420, revenue: 25200, cpa: 8.5, roi: 4.2 },
  { channel: "Facebook Ads", conversions: 280, revenue: 16800, cpa: 12.0, roi: 2.8 },
  { channel: "Influencers", conversions: 185, revenue: 11100, cpa: 15.0, roi: 2.2 },
];

import { useFestivalConfig } from "@/hooks/useFestivalConfig";

const getTrendIcon = (current: number, benchmark: number) => {
  if (current > benchmark * 1.1) return <TrendingUp className="h-3 w-3 text-success" />;
  if (current < benchmark * 0.9) return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const EmailMarketingSection = () => {
  const { isDemo, eventName } = useFestivalConfig();

  if (!isDemo) {
    return (
      <Card className="border-2 border-dashed border-muted p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 mb-4 rounded-full bg-muted/50">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No hay campañas de email activas</h3>
          <p className="max-w-md mt-2 text-sm text-muted-foreground">
            {eventName} aún no tiene historial de campañas de email marketing.
            Conecta tu cuenta de Mailchimp o inicia tu primera campaña para ver métricas aquí.
          </p>
          <Button variant="outline" className="mt-4 gap-2">
            <ExternalLink className="h-4 w-4" />
            Conectar Mailchimp
          </Button>
        </div>
      </Card>
    );
  }

  const totalSent = emailCampaigns.reduce((acc, c) => acc + c.recipients, 0);
  const totalOpened = emailCampaigns.reduce((acc, c) => acc + c.opened, 0);
  const totalClicked = emailCampaigns.reduce((acc, c) => acc + c.clicked, 0);
  const totalConversions = emailCampaigns.reduce((acc, c) => acc + c.conversions, 0);
  const totalRevenue = emailCampaigns.reduce((acc, c) => acc + c.revenue, 0);
  const avgOpenRate = (totalOpened / totalSent * 100).toFixed(1);
  const avgClickRate = (totalClicked / totalOpened * 100).toFixed(1);
  const avgConversionRate = (totalConversions / totalClicked * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Email Marketing (Mailchimp)
          </h3>
          <p className="text-xs text-muted-foreground">Gestión y rendimiento de campañas de email</p>
        </div>
        <Button size="sm" className="gap-1.5 h-7 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Crear nueva campaña
          <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-3 pb-2">
            <div className="flex items-center justify-between">
              <Send className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">5 campañas</Badge>
            </div>
            <p className="text-xl font-bold mt-1">{(totalSent / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-muted-foreground">Emails enviados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-3 pb-2">
            <div className="flex items-center justify-between">
              <Eye className="h-4 w-4 text-blue-500" />
              {getTrendIcon(parseFloat(avgOpenRate), 25)}
            </div>
            <p className="text-xl font-bold mt-1">{avgOpenRate}%</p>
            <p className="text-[10px] text-muted-foreground">Tasa apertura</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-3 pb-2">
            <div className="flex items-center justify-between">
              <MousePointerClick className="h-4 w-4 text-amber-500" />
              {getTrendIcon(parseFloat(avgClickRate), 10)}
            </div>
            <p className="text-xl font-bold mt-1">{avgClickRate}%</p>
            <p className="text-[10px] text-muted-foreground">Tasa clics</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-3 pb-2">
            <div className="flex items-center justify-between">
              <ShoppingCart className="h-4 w-4 text-success" />
              {getTrendIcon(parseFloat(avgConversionRate), 1)}
            </div>
            <p className="text-xl font-bold mt-1">{totalConversions}</p>
            <p className="text-[10px] text-muted-foreground">Conversiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-3 pb-2">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-4 w-4 text-primary" />
              <ArrowUpRight className="h-3 w-3 text-success" />
            </div>
            <p className="text-xl font-bold mt-1">€{(totalRevenue / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-muted-foreground">Ingresos generados</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Campaign List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campañas Enviadas</CardTitle>
            <CardDescription className="text-xs">Últimas campañas de email marketing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emailCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{campaign.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 shrink-0 ${campaign.status === 'completed'
                              ? 'border-success/50 text-success'
                              : 'border-blue-500/50 text-blue-500'
                            }`}
                        >
                          {campaign.status === 'completed' ? 'Completada' : 'Enviada'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {campaign.sentDate} · {campaign.recipients.toLocaleString('es-ES')} destinatarios
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-xs font-medium">{campaign.openRate}%</p>
                      <p className="text-[9px] text-muted-foreground">Apertura</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium">{campaign.clickRate}%</p>
                      <p className="text-[9px] text-muted-foreground">Clics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-success">{campaign.conversions}</p>
                      <p className="text-[9px] text-muted-foreground">Conv.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium">€{campaign.revenue.toLocaleString('es-ES')}</p>
                      <p className="text-[9px] text-muted-foreground">Ingresos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Evolution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Evolución de Rendimiento
            </CardTitle>
            <CardDescription className="text-xs">Métricas por campaña</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="campaign" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        openRate: 'Tasa Apertura',
                        clickRate: 'Tasa Clics',
                        conversionRate: 'Tasa Conversión'
                      };
                      return [`${value}%`, labels[name] || name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="openRate"
                    name="Apertura %"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="clickRate"
                    name="Clics %"
                    stroke="#f59e0b"
                    fill="rgba(245, 158, 11, 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Email vs Otros Canales
            </CardTitle>
            <CardDescription className="text-xs">Comparativa de rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'conversions') return [value, 'Conversiones'];
                      if (name === 'roi') return [`${value}x`, 'ROI'];
                      return [value, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar
                    dataKey="conversions"
                    name="Conversiones"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Comparison */}
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-2">ROI por canal</p>
              <div className="grid grid-cols-4 gap-2">
                {channelComparison.map((channel) => (
                  <div key={channel.channel} className="text-center">
                    <p className={`text-sm font-bold ${channel.channel === 'Email' ? 'text-success' : 'text-foreground'}`}>
                      {channel.roi}x
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate">{channel.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Email: Tu canal más rentable</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Con un ROI de <strong className="text-foreground">12.5x</strong>, el email marketing supera significativamente
                a otros canales. La campaña <strong className="text-foreground">Black Friday</strong> fue la más exitosa con
                456 conversiones y €27.3K en ingresos. Considera aumentar la frecuencia de envíos segmentados para maximizar resultados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailMarketingSection;
