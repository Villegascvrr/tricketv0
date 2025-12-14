import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Megaphone, 
  Mail, 
  Share2, 
  Target,
  TrendingUp,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Link2,
  Copy,
  Eye,
  MousePointerClick,
  ShoppingCart,
  ArrowUpRight,
  Calendar,
  BarChart3,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Euro,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Plus
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
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Campaign performance data
const campaignPerformanceData = [
  { date: '1 Nov', reach: 45000, clicks: 1200, conversions: 48 },
  { date: '8 Nov', reach: 62000, clicks: 1850, conversions: 72 },
  { date: '15 Nov', reach: 78000, clicks: 2400, conversions: 96 },
  { date: '22 Nov', reach: 125000, clicks: 4200, conversions: 185 },
  { date: '29 Nov', reach: 98000, clicks: 3100, conversions: 124 },
  { date: '6 Dic', reach: 85000, clicks: 2800, conversions: 112 },
];

// Enhanced campaigns with operational data
const campaignsData = [
  {
    id: 1,
    name: 'Black Friday - Early Bird',
    type: 'paid',
    platform: 'instagram',
    status: 'completed',
    startDate: '2024-11-22',
    endDate: '2024-11-30',
    budget: 2500,
    spent: 2480,
    reach: 185000,
    clicks: 5200,
    ticketsSold: 892,
    estimatedRevenue: 22300,
    ctr: 2.8,
    observation: 'Mejor campaña hasta la fecha. El timing de Black Friday fue clave. Replicar estrategia en Navidad.',
    teamNotes: 'Creativos de aftermovie funcionaron mejor que imágenes estáticas. CTR 40% superior.'
  },
  {
    id: 2,
    name: 'Retargeting Universitarios',
    type: 'paid',
    platform: 'facebook',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-15',
    budget: 1500,
    spent: 920,
    reach: 95000,
    clicks: 2800,
    ticketsSold: 312,
    estimatedRevenue: 7800,
    ctr: 2.9,
    observation: 'Segmento universitario responde bien. Considerar ampliar presupuesto.',
    teamNotes: 'Audiencia 18-24 Sevilla convierte mejor que Málaga/Cádiz.'
  },
  {
    id: 3,
    name: 'Cartel Reveal Orgánico',
    type: 'organic',
    platform: 'instagram',
    status: 'active',
    startDate: '2024-12-05',
    endDate: null,
    budget: 0,
    spent: 0,
    reach: 42000,
    clicks: 1250,
    ticketsSold: 145,
    estimatedRevenue: 3625,
    ctr: 3.0,
    observation: 'Buen engagement orgánico. Stories funcionando mejor que posts.',
    teamNotes: 'El reveal de Henry Méndez generó pico de tráfico. Planificar reveal de segundo cabeza de cartel.'
  },
  {
    id: 4,
    name: 'Newsletter Diciembre',
    type: 'email',
    platform: 'email',
    status: 'completed',
    startDate: '2024-12-01',
    endDate: '2024-12-01',
    budget: 0,
    spent: 0,
    reach: 28500,
    clicks: 4200,
    ticketsSold: 168,
    estimatedRevenue: 4200,
    ctr: 14.7,
    observation: 'Open rate del 32%, por encima de la media del sector.',
    teamNotes: 'Asunto "Últimas plazas Early Bird" tuvo mejor apertura que "Novedades Primaverando".'
  },
  {
    id: 5,
    name: 'Campaña Pre-Lanzamiento',
    type: 'paid',
    platform: 'instagram',
    status: 'completed',
    startDate: '2024-10-15',
    endDate: '2024-10-31',
    budget: 1800,
    spent: 1800,
    reach: 120000,
    clicks: 3600,
    ticketsSold: 520,
    estimatedRevenue: 9880,
    ctr: 3.0,
    observation: 'Fase de expectación cumplió objetivos. Generó base de leads para retargeting.',
    teamNotes: 'Teaser con cuenta atrás funcionó bien. Lista de espera alcanzó 4.200 emails.'
  },
  {
    id: 6,
    name: 'Influencers Locales',
    type: 'influencer',
    platform: 'instagram',
    status: 'active',
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    budget: 3500,
    spent: 2100,
    reach: 78000,
    clicks: 1890,
    ticketsSold: 95,
    estimatedRevenue: 2375,
    ctr: 2.4,
    observation: 'ROI más bajo que paid ads. Evaluar si continuar o reasignar presupuesto.',
    teamNotes: '@sevillaniando mejor conversion que @andaluciamola. Código descuento "INFLUENCER15" activo.'
  }
];

// Top performing posts
const topPosts = [
  {
    id: 1,
    platform: 'instagram',
    type: 'Reel',
    content: 'Aftermovie Teaser 2024',
    reach: 125000,
    likes: 8500,
    shares: 1200,
    conversions: 89,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80'
  },
  {
    id: 2,
    platform: 'instagram',
    type: 'Carrusel',
    content: 'Cartel Artistas 2025',
    reach: 98000,
    likes: 6200,
    shares: 850,
    conversions: 72,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80'
  },
  {
    id: 3,
    platform: 'facebook',
    type: 'Video',
    content: 'Entrevista Henry Méndez',
    reach: 45000,
    likes: 2100,
    shares: 420,
    conversions: 38,
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80'
  },
];

// Newsletter data
const newsletters = [
  { name: 'Lanzamiento Early Bird', sent: 28500, opened: 9120, clicked: 2850, conversions: 285, date: '15 Nov' },
  { name: 'Black Friday Special', sent: 28500, opened: 11400, clicked: 4560, conversions: 456, date: '24 Nov' },
  { name: 'Cartel Reveal', sent: 32000, opened: 12800, clicked: 3840, conversions: 192, date: '5 Dic' },
];

// UTM Templates
const utmTemplates = [
  { name: 'Instagram Bio', utm: 'utm_source=instagram&utm_medium=bio&utm_campaign=primaverando2025' },
  { name: 'Facebook Ads', utm: 'utm_source=facebook&utm_medium=cpc&utm_campaign=bf_earlybird' },
  { name: 'Email Newsletter', utm: 'utm_source=email&utm_medium=newsletter&utm_campaign=cartel_reveal' },
  { name: 'Influencer', utm: 'utm_source=influencer&utm_medium=stories&utm_campaign=collab_[name]' },
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram': return <Instagram className="h-4 w-4" />;
    case 'facebook': return <Facebook className="h-4 w-4" />;
    case 'twitter': return <Twitter className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    default: return <Share2 className="h-4 w-4" />;
  }
};

const Marketing = () => {
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'paid' as 'paid' | 'organic' | 'email' | 'influencer',
    platform: 'instagram' as 'instagram' | 'facebook' | 'twitter' | 'email',
    budget: 0,
    startDate: '',
    endDate: '',
    observation: '',
    teamNotes: ''
  });
  
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const totalTicketsSold = campaigns.reduce((acc, c) => acc + c.ticketsSold, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.estimatedRevenue, 0);
  const avgCtr = campaigns.reduce((acc, c) => acc + c.ctr, 0) / campaigns.length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length;
  const completedCampaignsCount = campaigns.filter(c => c.status === 'completed').length;

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.startDate) {
      toast({
        title: "Campos requeridos",
        description: "Nombre y fecha de inicio son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      type: newCampaign.type,
      platform: newCampaign.platform,
      status: 'active' as const,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate || null,
      budget: newCampaign.budget,
      spent: 0,
      reach: 0,
      clicks: 0,
      ticketsSold: 0,
      estimatedRevenue: 0,
      ctr: 0,
      observation: newCampaign.observation,
      teamNotes: newCampaign.teamNotes
    };

    setCampaigns([campaign, ...campaigns]);
    setIsNewCampaignOpen(false);
    setNewCampaign({
      name: '',
      type: 'paid',
      platform: 'instagram',
      budget: 0,
      startDate: '',
      endDate: '',
      observation: '',
      teamNotes: ''
    });

    toast({
      title: "Campaña creada",
      description: `"${campaign.name}" añadida correctamente`
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Marketing & Campañas" }]} />
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-0.5">
              Marketing & Campañas
            </h1>
            <p className="text-xs text-muted-foreground">
              Gestión de campañas y análisis de rendimiento
            </p>
          </div>
          <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 h-7 text-xs">
                <Megaphone className="h-3.5 w-3.5" />
                Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nueva Campaña</DialogTitle>
                <DialogDescription>
                  Crea una nueva campaña de marketing. Los datos de rendimiento se actualizarán manualmente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la campaña *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Black Friday - Últimas plazas"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newCampaign.type}
                      onValueChange={(value: 'paid' | 'organic' | 'email' | 'influencer') => 
                        setNewCampaign({ ...newCampaign, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid Ads</SelectItem>
                        <SelectItem value="organic">Orgánico</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="influencer">Influencer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select
                      value={newCampaign.platform}
                      onValueChange={(value: 'instagram' | 'facebook' | 'twitter' | 'email') => 
                        setNewCampaign({ ...newCampaign, platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Fecha inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Fecha fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Presupuesto (€)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={newCampaign.budget || ''}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observation">Observación</Label>
                  <Textarea
                    id="observation"
                    placeholder="Objetivo o notas iniciales de la campaña..."
                    value={newCampaign.observation}
                    onChange={(e) => setNewCampaign({ ...newCampaign, observation: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamNotes">Notas del equipo</Label>
                  <Textarea
                    id="teamNotes"
                    placeholder="Notas internas del equipo..."
                    value={newCampaign.teamNotes}
                    onChange={(e) => setNewCampaign({ ...newCampaign, teamNotes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewCampaignOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCampaign}>
                  <Plus className="h-4 w-4 mr-1" />
                  Crear Campaña
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Alcance Total</p>
                  <p className="text-2xl font-bold">{(totalReach / 1000).toFixed(0)}K</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+45%</span>
                <span className="text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">CTR Medio</p>
                  <p className="text-2xl font-bold">{avgCtr.toFixed(1)}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <MousePointerClick className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+0.4%</span>
                <span className="text-muted-foreground">vs benchmark</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Entradas Vendidas</p>
                  <p className="text-2xl font-bold">{totalTicketsSold}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-muted-foreground">€{totalSpent > 0 ? (totalSpent / totalTicketsSold).toFixed(2) : '0'} CPA</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Inversión Activa</p>
                  <p className="text-2xl font-bold">€{totalSpent.toLocaleString('es-ES')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-muted-foreground">De €4.000 presupuesto</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Rendimiento de Campañas</CardTitle>
                <CardDescription>Alcance, clics y conversiones por semana</CardDescription>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                  <span>Alcance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                  <span>Clics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>Conversiones</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={campaignPerformanceData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => {
                      const label = name === 'reach' ? 'Alcance' : name === 'clicks' ? 'Clics' : 'Conversiones';
                      return [value.toLocaleString('es-ES'), label];
                    }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="reach" 
                    stroke="hsl(var(--primary))" 
                    strokeOpacity={0.3}
                    strokeWidth={1}
                    fillOpacity={1} 
                    fill="url(#colorReach)" 
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--primary))" 
                    strokeOpacity={0.6}
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="none"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List & Top Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaigns */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Historial de Campañas</CardTitle>
                  <CardDescription>Todas las campañas con datos operativos</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="text-[10px]">{activeCampaignsCount} activas</Badge>
                  <Badge variant="secondary" className="text-[10px]">{completedCampaignsCount} finalizadas</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaigns.map((campaign) => {
                const isExpanded = expandedCampaign === campaign.id;
                const startDateFormatted = new Date(campaign.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                const endDateFormatted = campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'En curso';
                
                return (
                  <div 
                    key={campaign.id} 
                    className={`rounded-lg border transition-all ${isExpanded ? 'bg-muted/30 ring-1 ring-primary/20' : 'bg-card hover:bg-accent/5'}`}
                  >
                    {/* Campaign Header - Always Visible */}
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            campaign.platform === 'instagram' ? 'bg-pink-500/10 text-pink-500' :
                            campaign.platform === 'facebook' ? 'bg-blue-500/10 text-blue-500' :
                            campaign.platform === 'email' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-purple-500/10 text-purple-500'
                          }`}>
                            {getPlatformIcon(campaign.platform)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{campaign.name}</p>
                              <Badge 
                                variant={campaign.status === 'active' ? 'default' : 'secondary'}
                                className={`text-[10px] ${campaign.status === 'active' ? 'bg-success text-success-foreground' : ''}`}
                              >
                                {campaign.status === 'active' ? (
                                  <><Clock className="h-2.5 w-2.5 mr-1" />Activa</>
                                ) : (
                                  <><CheckCircle2 className="h-2.5 w-2.5 mr-1" />Finalizada</>
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>{startDateFormatted} → {endDateFormatted}</span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                                {campaign.type === 'paid' ? 'Pagada' : campaign.type === 'email' ? 'Email' : campaign.type === 'influencer' ? 'Influencer' : 'Orgánica'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quick Stats */}
                          <div className="hidden md:flex items-center gap-4 text-right">
                            <div>
                              <p className="text-sm font-semibold">{campaign.ticketsSold}</p>
                              <p className="text-[10px] text-muted-foreground">entradas</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-success">€{campaign.estimatedRevenue.toLocaleString('es-ES')}</p>
                              <p className="text-[10px] text-muted-foreground">ingresos</p>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-3">
                        <div className="h-px bg-border" />
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          <div className="p-2 rounded-lg bg-background text-center">
                            <p className="text-lg font-semibold">{(campaign.reach / 1000).toFixed(0)}K</p>
                            <p className="text-[10px] text-muted-foreground">Alcance</p>
                          </div>
                          <div className="p-2 rounded-lg bg-background text-center">
                            <p className="text-lg font-semibold">{campaign.clicks.toLocaleString('es-ES')}</p>
                            <p className="text-[10px] text-muted-foreground">Clics</p>
                          </div>
                          <div className="p-2 rounded-lg bg-background text-center">
                            <p className="text-lg font-semibold">{campaign.ctr}%</p>
                            <p className="text-[10px] text-muted-foreground">CTR</p>
                          </div>
                          <div className="p-2 rounded-lg bg-success/10 text-center">
                            <p className="text-lg font-semibold text-success">{campaign.ticketsSold}</p>
                            <p className="text-[10px] text-muted-foreground">Entradas</p>
                          </div>
                          <div className="p-2 rounded-lg bg-success/10 text-center">
                            <p className="text-lg font-semibold text-success">€{campaign.estimatedRevenue.toLocaleString('es-ES')}</p>
                            <p className="text-[10px] text-muted-foreground">Ingresos Est.</p>
                          </div>
                          <div className="p-2 rounded-lg bg-background text-center">
                            <p className="text-lg font-semibold">€{campaign.spent > 0 ? (campaign.spent / campaign.ticketsSold).toFixed(2) : '0'}</p>
                            <p className="text-[10px] text-muted-foreground">CPA</p>
                          </div>
                        </div>
                        
                        {/* Budget Progress (if paid) */}
                        {campaign.budget > 0 && (
                          <div className="p-2 rounded-lg bg-background">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Presupuesto</span>
                              <span className="font-medium">€{campaign.spent.toLocaleString('es-ES')} / €{campaign.budget.toLocaleString('es-ES')}</span>
                            </div>
                            <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
                          </div>
                        )}
                        
                        {/* Observation */}
                        <div className="p-3 rounded-lg border bg-background">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-primary mb-1">Observación</p>
                              <p className="text-sm text-foreground">{campaign.observation}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Team Notes */}
                        <div className="p-3 rounded-lg border bg-muted/30">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Notas del equipo</p>
                              <p className="text-sm text-muted-foreground">{campaign.teamNotes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Posts que Generan Ventas</CardTitle>
              <CardDescription>Contenido con mejor conversión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="relative">
                    <img 
                      src={post.thumbnail} 
                      alt={post.content}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getPlatformIcon(post.platform)}
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{post.type}</Badge>
                    </div>
                    <p className="text-sm font-medium truncate">{post.content}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{(post.reach / 1000).toFixed(0)}K vistas</span>
                      <span className="text-success font-medium">{post.conversions} ventas</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Newsletter & UTM Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Newsletters */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Newsletters Enviadas
                  </CardTitle>
                  <CardDescription>Rendimiento de campañas de email</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5" />
                  Nueva Newsletter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {newsletters.map((newsletter, index) => (
                <div key={index} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{newsletter.name}</p>
                      <p className="text-xs text-muted-foreground">{newsletter.date}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {newsletter.sent.toLocaleString('es-ES')} enviados
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-sm font-semibold">{((newsletter.opened / newsletter.sent) * 100).toFixed(0)}%</p>
                      <p className="text-[10px] text-muted-foreground">Apertura</p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-sm font-semibold">{((newsletter.clicked / newsletter.sent) * 100).toFixed(0)}%</p>
                      <p className="text-[10px] text-muted-foreground">Clics</p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-sm font-semibold">{newsletter.conversions}</p>
                      <p className="text-[10px] text-muted-foreground">Ventas</p>
                    </div>
                    <div className="p-2 rounded bg-success/10">
                      <p className="text-sm font-semibold text-success">€{(newsletter.conversions * 25).toLocaleString('es-ES')}</p>
                      <p className="text-[10px] text-muted-foreground">Ingresos</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* UTM & Tracked Links */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Links Trackeados (UTM)
                  </CardTitle>
                  <CardDescription>Generador y plantillas de UTMs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* UTM Generator */}
              <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Generador de Links</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://primaverando.com/tickets" 
                    className="text-sm"
                  />
                  <Button size="sm" className="gap-1.5 shrink-0">
                    <Copy className="h-3.5 w-3.5" />
                    Generar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="utm_source" className="text-xs h-8" />
                  <Input placeholder="utm_medium" className="text-xs h-8" />
                  <Input placeholder="utm_campaign" className="text-xs h-8" />
                  <Input placeholder="utm_content" className="text-xs h-8" />
                </div>
              </div>

              {/* UTM Templates */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Plantillas guardadas</p>
                {utmTemplates.map((template, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded bg-muted flex items-center justify-center shrink-0">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{template.utm}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Marketing;