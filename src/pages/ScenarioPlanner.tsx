import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Euro, 
  Megaphone, 
  Calendar, 
  Target,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Ticket,
  Users,
  Layers,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { festivalData } from "@/data/festivalData";

const ScenarioPlanner = () => {
  // Base data from festival
  const { overview, aforoTotal, precios, zones } = festivalData;
  const currentTickets = overview.entradasVendidas;
  const currentRevenue = overview.ingresosTotales;
  const currentOccupancy = overview.ocupacion * 100;

  // Festival date calculations
  const festivalDate = new Date('2025-03-29');
  const today = new Date();
  const daysRemaining = Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // ========== PRICE ADJUSTMENTS BY TICKET TYPE ==========
  const [generalPriceChange, setGeneralPriceChange] = useState([0]);
  const [vipPriceChange, setVipPriceChange] = useState([0]);
  const [earlyBirdPriceChange, setEarlyBirdPriceChange] = useState([0]);

  // ========== CAMPAIGN ACTIVATION ==========
  const [campaigns, setCampaigns] = useState({
    blackFriday: false,
    lastMinute: false,
    influencer: false,
    localMedia: false
  });

  // ========== PHASE RELEASE ==========
  const [newPhase, setNewPhase] = useState({
    active: false,
    tickets: 1000,
    price: precios.general
  });
  const [phaseTickets, setPhaseTickets] = useState([1000]);

  // ========== ZONE CAPACITY INCREASE ==========
  const [zoneCapacityIncrease, setZoneCapacityIncrease] = useState({
    pista: 0,
    gradas: 0,
    vip: 0
  });
  const [pistaIncrease, setPistaIncrease] = useState([0]);
  const [gradasIncrease, setGradasIncrease] = useState([0]);
  const [vipIncrease, setVipIncrease] = useState([0]);

  // ========== IMPACT CALCULATIONS ==========
  const impactCalculations = useMemo(() => {
    // Price elasticity simulation (simplified)
    const generalElasticity = -0.8; // 1% price increase = 0.8% demand decrease
    const vipElasticity = -0.5; // VIP is less elastic
    const earlyBirdElasticity = -1.2; // Early bird is more elastic

    // Current ticket distribution (estimated)
    const generalTickets = Math.floor(currentTickets * 0.7);
    const vipTickets = Math.floor(currentTickets * 0.12);
    const earlyBirdTickets = Math.floor(currentTickets * 0.18);

    // Price impact on sales
    const generalTicketDelta = Math.round(generalTickets * generalElasticity * (generalPriceChange[0] / 100) * 0.3);
    const vipTicketDelta = Math.round(vipTickets * vipElasticity * (vipPriceChange[0] / 100) * 0.3);
    const earlyBirdTicketDelta = Math.round(earlyBirdTickets * earlyBirdElasticity * (earlyBirdPriceChange[0] / 100) * 0.3);
    
    // Price impact on revenue
    const newGeneralPrice = precios.general * (1 + generalPriceChange[0] / 100);
    const newVipPrice = precios.vip * (1 + vipPriceChange[0] / 100);
    const newEarlyBirdPrice = precios.anticipada * (1 + earlyBirdPriceChange[0] / 100);

    const priceRevenueDelta = 
      (generalTickets + generalTicketDelta) * newGeneralPrice - generalTickets * precios.general +
      (vipTickets + vipTicketDelta) * newVipPrice - vipTickets * precios.vip +
      (earlyBirdTickets + earlyBirdTicketDelta) * newEarlyBirdPrice - earlyBirdTickets * precios.anticipada;

    const priceTicketDelta = generalTicketDelta + vipTicketDelta + earlyBirdTicketDelta;

    // Campaign impact
    const campaignImpacts = {
      blackFriday: { tickets: 450, revenue: 450 * 52, cost: 2000 },
      lastMinute: { tickets: 280, revenue: 280 * 60, cost: 1500 },
      influencer: { tickets: 180, revenue: 180 * 55, cost: 3500 },
      localMedia: { tickets: 120, revenue: 120 * 55, cost: 800 }
    };

    let campaignTicketDelta = 0;
    let campaignRevenueDelta = 0;
    let campaignCost = 0;

    Object.entries(campaigns).forEach(([key, active]) => {
      if (active) {
        const impact = campaignImpacts[key as keyof typeof campaignImpacts];
        campaignTicketDelta += impact.tickets;
        campaignRevenueDelta += impact.revenue;
        campaignCost += impact.cost;
      }
    });

    // Phase release impact
    const phaseTicketDelta = newPhase.active ? phaseTickets[0] : 0;
    const phaseRevenueDelta = phaseTicketDelta * precios.general;
    const phaseCapacityDelta = phaseTicketDelta; // New phase adds to available capacity

    // Zone capacity impact (only affects available inventory, not immediate sales)
    const totalZoneIncrease = pistaIncrease[0] + gradasIncrease[0] + vipIncrease[0];
    // Assume 30% of new capacity sells in remaining time
    const zoneTicketDelta = Math.round(totalZoneIncrease * 0.3);
    const zoneRevenueDelta = zoneTicketDelta * precios.general;

    // TOTALS
    const totalTicketDelta = priceTicketDelta + campaignTicketDelta + phaseTicketDelta + zoneTicketDelta;
    const totalRevenueDelta = priceRevenueDelta + campaignRevenueDelta + phaseRevenueDelta + zoneRevenueDelta - campaignCost;
    const newTotalCapacity = aforoTotal + phaseCapacityDelta + totalZoneIncrease;
    const newTotalTickets = currentTickets + totalTicketDelta;
    const newOccupancy = (newTotalTickets / newTotalCapacity) * 100;

    return {
      price: {
        ticketDelta: priceTicketDelta,
        revenueDelta: priceRevenueDelta,
        newPrices: { general: newGeneralPrice, vip: newVipPrice, earlyBird: newEarlyBirdPrice }
      },
      campaigns: {
        ticketDelta: campaignTicketDelta,
        revenueDelta: campaignRevenueDelta,
        cost: campaignCost,
        netRevenue: campaignRevenueDelta - campaignCost
      },
      phase: {
        ticketDelta: phaseTicketDelta,
        revenueDelta: phaseRevenueDelta,
        capacityDelta: phaseCapacityDelta
      },
      zones: {
        ticketDelta: zoneTicketDelta,
        revenueDelta: zoneRevenueDelta,
        capacityDelta: totalZoneIncrease
      },
      totals: {
        ticketDelta: totalTicketDelta,
        revenueDelta: totalRevenueDelta,
        newTickets: newTotalTickets,
        newRevenue: currentRevenue + totalRevenueDelta,
        newCapacity: newTotalCapacity,
        newOccupancy: newOccupancy,
        occupancyDelta: newOccupancy - currentOccupancy
      }
    };
  }, [generalPriceChange, vipPriceChange, earlyBirdPriceChange, campaigns, newPhase.active, phaseTickets, pistaIncrease, gradasIncrease, vipIncrease, currentTickets, currentRevenue, currentOccupancy, aforoTotal, precios]);

  const resetAll = () => {
    setGeneralPriceChange([0]);
    setVipPriceChange([0]);
    setEarlyBirdPriceChange([0]);
    setCampaigns({ blackFriday: false, lastMinute: false, influencer: false, localMedia: false });
    setNewPhase({ active: false, tickets: 1000, price: precios.general });
    setPhaseTickets([1000]);
    setPistaIncrease([0]);
    setGradasIncrease([0]);
    setVipIncrease([0]);
  };

  const hasChanges = generalPriceChange[0] !== 0 || vipPriceChange[0] !== 0 || earlyBirdPriceChange[0] !== 0 ||
    Object.values(campaigns).some(v => v) || newPhase.active ||
    pistaIncrease[0] > 0 || gradasIncrease[0] > 0 || vipIncrease[0] > 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Simulador de Escenarios" }]} />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Simulador de Escenarios
              </h1>
              <Badge variant="outline" className="ml-1 text-[10px]">Primaverando 2025</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Simula cambios en precios, campañas, fases y aforo. Visualiza el impacto antes de decidir.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 h-7 text-xs"
            onClick={resetAll}
            disabled={!hasChanges}
          >
            <RefreshCw className="h-3 w-3" />
            Resetear
          </Button>
        </div>

        {/* Impact Summary - Always visible */}
        <Card className={`border-2 ${hasChanges ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10' : 'border-muted'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Impacto Estimado del Escenario
              </CardTitle>
              {hasChanges && (
                <Badge variant="default" className="text-[10px]">
                  {Object.values(campaigns).filter(v => v).length + (newPhase.active ? 1 : 0) + 
                   (generalPriceChange[0] !== 0 ? 1 : 0) + (vipPriceChange[0] !== 0 ? 1 : 0) + (earlyBirdPriceChange[0] !== 0 ? 1 : 0) +
                   (pistaIncrease[0] > 0 ? 1 : 0) + (gradasIncrease[0] > 0 ? 1 : 0) + (vipIncrease[0] > 0 ? 1 : 0)} cambios activos
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {/* Current vs Projected */}
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Ventas Actuales</p>
                <p className="text-lg font-bold">{currentTickets.toLocaleString('es-ES')}</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${impactCalculations.totals.ticketDelta >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Δ Ventas</p>
                <p className={`text-lg font-bold ${impactCalculations.totals.ticketDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {impactCalculations.totals.ticketDelta >= 0 ? '+' : ''}{impactCalculations.totals.ticketDelta.toLocaleString('es-ES')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Ingresos Actuales</p>
                <p className="text-lg font-bold">€{(currentRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${impactCalculations.totals.revenueDelta >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Δ Ingresos</p>
                <p className={`text-lg font-bold ${impactCalculations.totals.revenueDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {impactCalculations.totals.revenueDelta >= 0 ? '+' : ''}€{(impactCalculations.totals.revenueDelta / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Ocupación Actual</p>
                <p className="text-lg font-bold">{currentOccupancy.toFixed(1)}%</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${impactCalculations.totals.occupancyDelta >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Δ Ocupación</p>
                <p className={`text-lg font-bold ${impactCalculations.totals.occupancyDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {impactCalculations.totals.occupancyDelta >= 0 ? '+' : ''}{impactCalculations.totals.occupancyDelta.toFixed(1)}%
                </p>
              </div>
            </div>

            {hasChanges && (
              <div className="mt-4 p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Proyección Final</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Entradas totales</p>
                    <p className="text-xl font-bold">{impactCalculations.totals.newTickets.toLocaleString('es-ES')}</p>
                    <Progress value={(impactCalculations.totals.newTickets / impactCalculations.totals.newCapacity) * 100} className="h-1.5 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ingresos totales</p>
                    <p className="text-xl font-bold">€{(impactCalculations.totals.newRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ocupación final</p>
                    <p className="text-xl font-bold">{impactCalculations.totals.newOccupancy.toFixed(1)}%</p>
                    <p className="text-[10px] text-muted-foreground">de {impactCalculations.totals.newCapacity.toLocaleString('es-ES')} aforo</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PRICE ADJUSTMENTS */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Euro className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Ajuste de Precios</CardTitle>
                  <CardDescription className="text-[11px]">Por tipo de entrada</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* General */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>General</span>
                    <span className="text-xs text-muted-foreground">(€{precios.general})</span>
                  </div>
                  <Badge variant={generalPriceChange[0] !== 0 ? "default" : "outline"} className="text-[10px]">
                    {generalPriceChange[0] > 0 ? '+' : ''}{generalPriceChange[0]}% → €{impactCalculations.price.newPrices.general.toFixed(0)}
                  </Badge>
                </div>
                <Slider
                  value={generalPriceChange}
                  onValueChange={setGeneralPriceChange}
                  min={-20}
                  max={30}
                  step={5}
                  className="py-2"
                />
              </div>

              {/* VIP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>VIP</span>
                    <span className="text-xs text-muted-foreground">(€{precios.vip})</span>
                  </div>
                  <Badge variant={vipPriceChange[0] !== 0 ? "default" : "outline"} className="text-[10px]">
                    {vipPriceChange[0] > 0 ? '+' : ''}{vipPriceChange[0]}% → €{impactCalculations.price.newPrices.vip.toFixed(0)}
                  </Badge>
                </div>
                <Slider
                  value={vipPriceChange}
                  onValueChange={setVipPriceChange}
                  min={-20}
                  max={30}
                  step={5}
                  className="py-2"
                />
              </div>

              {/* Early Bird */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-blue-500" />
                    <span>Anticipada</span>
                    <span className="text-xs text-muted-foreground">(€{precios.anticipada})</span>
                  </div>
                  <Badge variant={earlyBirdPriceChange[0] !== 0 ? "default" : "outline"} className="text-[10px]">
                    {earlyBirdPriceChange[0] > 0 ? '+' : ''}{earlyBirdPriceChange[0]}% → €{impactCalculations.price.newPrices.earlyBird.toFixed(0)}
                  </Badge>
                </div>
                <Slider
                  value={earlyBirdPriceChange}
                  onValueChange={setEarlyBirdPriceChange}
                  min={-20}
                  max={30}
                  step={5}
                  className="py-2"
                />
              </div>

              {/* Price Impact Summary */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Impacto en ventas</span>
                  <span className={`font-medium ${impactCalculations.price.ticketDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {impactCalculations.price.ticketDelta >= 0 ? '+' : ''}{impactCalculations.price.ticketDelta} entradas
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Impacto en ingresos</span>
                  <span className={`font-medium ${impactCalculations.price.revenueDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {impactCalculations.price.revenueDelta >= 0 ? '+' : ''}€{impactCalculations.price.revenueDelta.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CAMPAIGN ACTIVATION */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Megaphone className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Activar Campañas</CardTitle>
                  <CardDescription className="text-[11px]">Selecciona las campañas a simular</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Black Friday */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={campaigns.blackFriday}
                    onCheckedChange={(checked) => setCampaigns(prev => ({ ...prev, blackFriday: checked }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Black Friday Flash</p>
                    <p className="text-[11px] text-muted-foreground">-15% durante 48h · €2.000 inversión</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">+450</p>
                  <p className="text-[10px] text-muted-foreground">entradas est.</p>
                </div>
              </div>

              {/* Last Minute */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={campaigns.lastMinute}
                    onCheckedChange={(checked) => setCampaigns(prev => ({ ...prev, lastMinute: checked }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Last Minute Push</p>
                    <p className="text-[11px] text-muted-foreground">Última semana · €1.500 inversión</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">+280</p>
                  <p className="text-[10px] text-muted-foreground">entradas est.</p>
                </div>
              </div>

              {/* Influencer */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={campaigns.influencer}
                    onCheckedChange={(checked) => setCampaigns(prev => ({ ...prev, influencer: checked }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Influencer Collab</p>
                    <p className="text-[11px] text-muted-foreground">3 influencers locales · €3.500</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">+180</p>
                  <p className="text-[10px] text-muted-foreground">entradas est.</p>
                </div>
              </div>

              {/* Local Media */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={campaigns.localMedia}
                    onCheckedChange={(checked) => setCampaigns(prev => ({ ...prev, localMedia: checked }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Medios Locales</p>
                    <p className="text-[11px] text-muted-foreground">Radio + prensa Sevilla · €800</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">+120</p>
                  <p className="text-[10px] text-muted-foreground">entradas est.</p>
                </div>
              </div>

              {/* Campaign Impact Summary */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ventas adicionales</span>
                  <span className="font-medium text-success">+{impactCalculations.campaigns.ticketDelta} entradas</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Inversión total</span>
                  <span className="font-medium">€{impactCalculations.campaigns.cost.toLocaleString('es-ES')}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Revenue neto</span>
                  <span className={`font-medium ${impactCalculations.campaigns.netRevenue >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {impactCalculations.campaigns.netRevenue >= 0 ? '+' : ''}€{impactCalculations.campaigns.netRevenue.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PHASE RELEASE */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Layers className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Liberar Nueva Fase</CardTitle>
                  <CardDescription className="text-[11px]">Añadir entradas adicionales al mercado</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={newPhase.active}
                    onCheckedChange={(checked) => setNewPhase(prev => ({ ...prev, active: checked }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Activar Fase 3</p>
                    <p className="text-[11px] text-muted-foreground">Liberar nuevas entradas a precio estándar</p>
                  </div>
                </div>
                {newPhase.active && (
                  <Badge variant="default" className="text-[10px]">Activo</Badge>
                )}
              </div>

              {newPhase.active && (
                <div className="space-y-3 p-3 rounded-lg border bg-card">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Entradas a liberar</span>
                      <span className="font-medium">{phaseTickets[0].toLocaleString('es-ES')}</span>
                    </div>
                    <Slider
                      value={phaseTickets}
                      onValueChange={setPhaseTickets}
                      min={500}
                      max={3000}
                      step={100}
                      className="py-2"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>500</span>
                      <span>1.500</span>
                      <span>3.000</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precio por entrada</span>
                      <span className="font-medium">€{precios.general}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ingresos potenciales</span>
                      <span className="font-medium text-success">+€{(phaseTickets[0] * precios.general).toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              )}

              {!newPhase.active && (
                <div className="p-3 rounded-lg border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">Activa para simular liberación de entradas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ZONE CAPACITY */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Users className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Ampliar Aforo por Zona</CardTitle>
                  <CardDescription className="text-[11px]">Aumentar capacidad en zonas específicas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pista */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pista</span>
                    <span className="text-xs text-muted-foreground">(actual: {zones[0].aforo.toLocaleString('es-ES')})</span>
                  </div>
                  <Badge variant={pistaIncrease[0] > 0 ? "default" : "outline"} className="text-[10px]">
                    +{pistaIncrease[0].toLocaleString('es-ES')}
                  </Badge>
                </div>
                <Slider
                  value={pistaIncrease}
                  onValueChange={setPistaIncrease}
                  min={0}
                  max={2000}
                  step={100}
                  className="py-2"
                />
              </div>

              {/* Gradas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Gradas</span>
                    <span className="text-xs text-muted-foreground">(actual: {zones[1].aforo.toLocaleString('es-ES')})</span>
                  </div>
                  <Badge variant={gradasIncrease[0] > 0 ? "default" : "outline"} className="text-[10px]">
                    +{gradasIncrease[0].toLocaleString('es-ES')}
                  </Badge>
                </div>
                <Slider
                  value={gradasIncrease}
                  onValueChange={setGradasIncrease}
                  min={0}
                  max={1500}
                  step={100}
                  className="py-2"
                />
              </div>

              {/* VIP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Zona VIP</span>
                    <span className="text-xs text-muted-foreground">(actual: {zones[2].aforo.toLocaleString('es-ES')})</span>
                  </div>
                  <Badge variant={vipIncrease[0] > 0 ? "default" : "outline"} className="text-[10px]">
                    +{vipIncrease[0].toLocaleString('es-ES')}
                  </Badge>
                </div>
                <Slider
                  value={vipIncrease}
                  onValueChange={setVipIncrease}
                  min={0}
                  max={500}
                  step={50}
                  className="py-2"
                />
              </div>

              {/* Zone Impact Summary */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Incremento de aforo</span>
                  <span className="font-medium">+{impactCalculations.zones.capacityDelta.toLocaleString('es-ES')}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Ventas estimadas (30%)</span>
                  <span className="font-medium text-success">+{impactCalculations.zones.ticketDelta} entradas</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Ingresos adicionales</span>
                  <span className="font-medium text-success">+€{impactCalculations.zones.revenueDelta.toLocaleString('es-ES')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Helper */}
        {hasChanges && (
          <Card className="border-2 border-dashed border-primary/30">
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${impactCalculations.totals.occupancyDelta >= 5 ? 'bg-success/10' : impactCalculations.totals.occupancyDelta >= 0 ? 'bg-amber-500/10' : 'bg-destructive/10'}`}>
                  {impactCalculations.totals.occupancyDelta >= 5 ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : impactCalculations.totals.occupancyDelta >= 0 ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {impactCalculations.totals.occupancyDelta >= 5 
                      ? "Escenario positivo" 
                      : impactCalculations.totals.occupancyDelta >= 0 
                        ? "Escenario moderado"
                        : "Escenario negativo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {impactCalculations.totals.occupancyDelta >= 5 
                      ? `Este escenario incrementaría la ocupación en ${impactCalculations.totals.occupancyDelta.toFixed(1)}% y generaría €${(impactCalculations.totals.revenueDelta / 1000).toFixed(1)}K adicionales.`
                      : impactCalculations.totals.occupancyDelta >= 0 
                        ? `Los cambios propuestos tendrían un impacto limitado. Considera activar más palancas.`
                        : `Este escenario reduciría ventas. Revisa los ajustes de precio o activa campañas compensatorias.`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Quedan</p>
                  <p className="text-lg font-bold text-primary">{daysRemaining} días</p>
                  <p className="text-[10px] text-muted-foreground">para el festival</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Las proyecciones son estimaciones basadas en elasticidad de demanda y datos históricos. Resultados reales pueden variar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
