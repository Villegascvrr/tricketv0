import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Calendar, Users, Euro, BarChart3, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Zap, Calculator, Database } from "lucide-react";
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
  LineChart,
  Line,
  Legend,
  ComposedChart
} from "recharts";
import { festivalData } from "@/data/festivalData";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { useTicketStats } from "@/hooks/useTicketStats";
import { useEvent } from "@/contexts/EventContext";
import { Skeleton } from "@/components/ui/skeleton";

const SalesForecasts = () => {
  const { selectedEvent } = useEvent();
  const eventId = selectedEvent?.id || "";
  const { stats, loading, error } = useTicketStats(eventId);
  
  // Use real data from stats or fallback to festivalData
  const ticketsSold = stats?.totalSold ?? festivalData.overview.entradasVendidas;
  const grossRevenue = stats?.grossRevenue ?? festivalData.overview.ingresosTotales;
  const occupancy = stats?.occupancyRate ?? festivalData.overview.ocupacion * 100;
  const avgPrice = stats?.avgTicketPrice ?? (festivalData.overview.ingresosTotales / festivalData.overview.entradasVendidas);
  const totalCapacity = festivalData.aforoTotal; // Use festivalData for capacity
  const ticketsRemaining = totalCapacity - ticketsSold;
  const targetRevenue = totalCapacity * festivalData.precios.general;
  const revenueProgress = (grossRevenue / targetRevenue) * 100;
  
  // Days until festival - use real data if available
  const daysRemaining = stats?.daysToFestival ?? (() => {
    const festivalDate = new Date('2025-03-29');
    const today = new Date();
    return Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  })();
  
  // Transform salesOverTime from stats for charts
  const dailySalesData = useMemo(() => {
    if (stats?.salesOverTime && stats.salesOverTime.length > 0) {
      let accumulated = 0;
      return stats.salesOverTime.map((item) => {
        accumulated += item.sales;
        return {
          date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          fullDate: new Date(item.date),
          ventas: item.sales,
          acumulado: accumulated,
          ingresos: item.revenue
        };
      });
    }
    // Fallback to demo data generation
    const data = [];
    const startDate = new Date('2024-11-01');
    const today = new Date();
    let accumulated = 0;
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      let dailySales = Math.floor(Math.random() * 150) + 80;
      if (isWeekend) dailySales *= 1.4;
      const daysFromStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysFromStart < 14) dailySales *= 1.8;
      if (d.getMonth() === 10 && d.getDate() >= 25 && d.getDate() <= 30) {
        dailySales *= 2.2;
      }
      accumulated += dailySales;
      data.push({
        date: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        fullDate: new Date(d),
        ventas: Math.floor(dailySales),
        acumulado: Math.min(accumulated, ticketsSold),
        ingresos: Math.floor(dailySales * 25)
      });
    }
    return data;
  }, [stats?.salesOverTime, ticketsSold]);

  // Calculate weekly comparison from real data
  const weeklyComparison = useMemo(() => {
    if (stats?.salesOverTime && stats.salesOverTime.length > 0) {
      // Group sales by week
      const weeklyData: { [key: string]: number } = {};
      stats.salesOverTime.forEach((item) => {
        const date = new Date(item.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + item.sales;
      });
      
      const weeks = Object.entries(weeklyData).sort(([a], [b]) => a.localeCompare(b));
      const lastWeeks = weeks.slice(-5);
      
      return lastWeeks.map(([_, tickets], index) => ({
        semana: index === lastWeeks.length - 1 ? 'Actual' : `Sem -${lastWeeks.length - 1 - index}`,
        actual: tickets,
        anterior: Math.floor(tickets * (0.7 + Math.random() * 0.4)),
        proyectado: Math.floor(tickets * 0.95)
      }));
    }
    // Fallback static data
    return [
      { semana: 'Sem -4', actual: 850, anterior: 720, proyectado: 800 },
      { semana: 'Sem -3', actual: 1120, anterior: 890, proyectado: 950 },
      { semana: 'Sem -2', actual: 1450, anterior: 1100, proyectado: 1200 },
      { semana: 'Sem -1', actual: 980, anterior: 1250, proyectado: 1100 },
      { semana: 'Actual', actual: 1280, anterior: 1050, proyectado: 1150 },
    ];
  }, [stats?.salesOverTime]);

  // Calculate week-over-week change
  const lastWeekSales = weeklyComparison[weeklyComparison.length - 2]?.actual ?? 0;
  const thisWeekSales = weeklyComparison[weeklyComparison.length - 1]?.actual ?? 0;
  const weekChange = lastWeekSales > 0 ? ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100 : 0;
  
  // Monthly projection data from real stats
  const projectionData = useMemo(() => {
    if (stats?.salesOverTime && stats.salesOverTime.length > 0) {
      const monthlyData: { [key: string]: number } = {};
      stats.salesOverTime.forEach((item) => {
        const date = new Date(item.date);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + item.sales;
      });
      
      const months = ['nov', 'dic', 'ene', 'feb', 'mar'];
      return months.map((mes) => {
        const real = monthlyData[mes] || null;
        const projected = Math.floor((stats.avgDailySales || 200) * 30);
        return {
          mes: mes.charAt(0).toUpperCase() + mes.slice(1),
          real,
          proyectado: projected
        };
      });
    }
    return [
      { mes: 'Nov', real: 4200, proyectado: 4000 },
      { mes: 'Dic', real: 3800, proyectado: 4500 },
      { mes: 'Ene', real: null, proyectado: 3500 },
      { mes: 'Feb', real: null, proyectado: 2800 },
      { mes: 'Mar', real: null, proyectado: 1950 },
    ];
  }, [stats?.salesOverTime, stats?.avgDailySales]);

  // ========== DECISION CALCULATIONS ==========
  const salesStartDate = new Date('2024-11-01');
  const festivalDate = new Date('2025-03-29');
  const today = new Date();
  const totalSalesDays = Math.ceil((festivalDate.getTime() - salesStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceLaunch = Math.ceil((today.getTime() - salesStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const targetOccupancy = 0.85; // 85% target
  const targetTickets = Math.floor(totalCapacity * targetOccupancy);
  
  // Use real stats for calculations when available
  const expectedTicketsToday = Math.floor((daysSinceLaunch / totalSalesDays) * targetTickets);
  const gapVsTarget = stats?.salesGap ?? (ticketsSold - expectedTicketsToday);
  const gapPercentage = expectedTicketsToday > 0 ? ((ticketsSold - expectedTicketsToday) / expectedTicketsToday) * 100 : 0;
  
  // Required daily pace - use real data when available
  const ticketsNeededToReachTarget = targetTickets - ticketsSold;
  const requiredDailyPace = stats?.requiredDailyRate ?? Math.ceil(ticketsNeededToReachTarget / Math.max(daysRemaining, 1));
  const currentDailyAverage = stats?.avgDailySales ?? Math.floor(ticketsSold / Math.max(daysSinceLaunch, 1));
  const paceRatio = currentDailyAverage > 0 ? requiredDailyPace / currentDailyAverage : 1;
  
  // Scenarios calculation
  const scenarios = useMemo(() => {
    const conservativeRate = currentDailyAverage * 0.8;
    const realisticRate = currentDailyAverage;
    const optimisticRate = currentDailyAverage * 1.3;
    
    return {
      conservative: {
        dailyRate: Math.floor(conservativeRate),
        finalTickets: ticketsSold + Math.floor(conservativeRate * daysRemaining),
        finalOccupancy: ((ticketsSold + Math.floor(conservativeRate * daysRemaining)) / totalCapacity) * 100,
        reachesTarget: (ticketsSold + Math.floor(conservativeRate * daysRemaining)) >= targetTickets
      },
      realistic: {
        dailyRate: Math.floor(realisticRate),
        finalTickets: ticketsSold + Math.floor(realisticRate * daysRemaining),
        finalOccupancy: ((ticketsSold + Math.floor(realisticRate * daysRemaining)) / totalCapacity) * 100,
        reachesTarget: (ticketsSold + Math.floor(realisticRate * daysRemaining)) >= targetTickets
      },
      optimistic: {
        dailyRate: Math.floor(optimisticRate),
        finalTickets: ticketsSold + Math.floor(optimisticRate * daysRemaining),
        finalOccupancy: ((ticketsSold + Math.floor(optimisticRate * daysRemaining)) / totalCapacity) * 100,
        reachesTarget: (ticketsSold + Math.floor(optimisticRate * daysRemaining)) >= targetTickets
      }
    };
  }, [currentDailyAverage, daysRemaining, ticketsSold, totalCapacity, targetTickets]);

  // Get sales by provider from real data
  const salesByProvider: { provider: string; tickets: number; revenue: number; percentage: number }[] = 
    stats?.salesByProvider?.map(p => ({
      provider: p.provider,
      tickets: p.sold,
      revenue: p.revenue,
      percentage: p.occupancy
    })) ?? festivalData.ticketingProviders.map(p => ({
      provider: p.nombre,
      tickets: p.vendidas,
      revenue: p.vendidas * 25,
      percentage: (p.vendidas / p.capacidad) * 100
    }));

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 md:p-4 theme-sales">
        <div className="max-w-7xl mx-auto space-y-3 md:space-y-4">
          <PageBreadcrumb items={[{ label: "Ventas & Previsiones" }]} />
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 md:p-4 theme-sales">
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4">
        <PageBreadcrumb items={[{ label: "Ventas & Previsiones" }]} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground mb-0.5">
                Ventas & Previsiones
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Análisis de ventas y proyecciones
              </p>
            </div>
            {/* Data source badge */}
            {stats?.hasRealData && (
              <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">
                <Database className="h-3 w-3 mr-1" />
                Datos Reales
              </Badge>
            )}
            {stats?.isDemo && (
              <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">
                Demo
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-[10px] md:text-xs px-2 py-0.5 w-fit">
            <Calendar className="h-3 w-3 mr-1" />
            {daysRemaining} días para el festival
          </Badge>
        </div>

        {/* Estado Actual vs Objetivo - Tarjeta Grande */}
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Estado Actual vs Objetivo
              </CardTitle>
              <Badge variant={occupancy >= 75 ? "default" : occupancy >= 50 ? "secondary" : "destructive"}>
                {occupancy >= 75 ? "En objetivo" : occupancy >= 50 ? "En progreso" : "Por debajo"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ocupación */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Ocupación del aforo</p>
                    <p className="text-4xl font-bold">{occupancy.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-lg font-semibold text-primary">85%</p>
                  </div>
                </div>
                <Progress value={occupancy} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Faltan <span className="font-medium text-foreground">{(85 - occupancy).toFixed(1)}%</span> para alcanzar el objetivo
                </p>
              </div>
              
              {/* Ingresos */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos totales</p>
                    <p className="text-4xl font-bold">€{(grossRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-lg font-semibold text-primary">€{(targetRevenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <Progress value={revenueProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{revenueProgress.toFixed(1)}%</span> del objetivo de ingresos
                </p>
              </div>
              
              {/* Entradas */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Entradas vendidas</p>
                    <p className="text-4xl font-bold">{ticketsSold.toLocaleString('es-ES')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Aforo total</p>
                    <p className="text-lg font-semibold text-primary">{totalCapacity.toLocaleString('es-ES')}</p>
                  </div>
                </div>
                <Progress value={occupancy} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Quedan <span className="font-medium text-foreground">{ticketsRemaining.toLocaleString('es-ES')}</span> entradas disponibles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DECISION BLOCKS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Target for Today */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-3">
              <div className="flex items-start justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px]">Día {daysSinceLaunch}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Objetivo a hoy</p>
              <p className="text-2xl font-bold">{expectedTicketsToday.toLocaleString('es-ES')}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Proyección lineal para {(targetOccupancy * 100).toFixed(0)}% de aforo
              </p>
            </CardContent>
          </Card>

          {/* Gap vs Target */}
          <Card className={`border-l-4 ${gapVsTarget >= 0 ? 'border-l-success' : 'border-l-destructive'}`}>
            <CardContent className="pt-3">
              <div className="flex items-start justify-between mb-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${gapVsTarget >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {gapVsTarget >= 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <Badge variant={gapVsTarget >= 0 ? "success" : "destructive"} className="text-[10px]">
                  {gapVsTarget >= 0 ? 'Por encima' : 'Por debajo'}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Gap vs Objetivo</p>
              <p className={`text-2xl font-bold ${gapVsTarget >= 0 ? 'text-success' : 'text-destructive'}`}>
                {gapVsTarget >= 0 ? '+' : ''}{gapVsTarget.toLocaleString('es-ES')}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {gapPercentage >= 0 ? '+' : ''}{gapPercentage.toFixed(1)}% respecto a proyección
              </p>
            </CardContent>
          </Card>

          {/* Required Daily Pace */}
          <Card className={`border-l-4 ${paceRatio <= 1 ? 'border-l-success' : paceRatio <= 1.5 ? 'border-l-warning' : 'border-l-destructive'}`}>
            <CardContent className="pt-3">
              <div className="flex items-start justify-between mb-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${paceRatio <= 1 ? 'bg-success/10' : paceRatio <= 1.5 ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                  <Zap className="h-4 w-4" />
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Actual: {currentDailyAverage}/día
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Ritmo Necesario</p>
              <p className="text-2xl font-bold">{requiredDailyPace.toLocaleString('es-ES')}<span className="text-sm font-normal text-muted-foreground">/día</span></p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {paceRatio <= 1 ? '✓ Alcanzable con ritmo actual' : 
                 paceRatio <= 1.5 ? `Requiere +${((paceRatio - 1) * 100).toFixed(0)}% más ritmo` :
                 `⚠ Requiere ${paceRatio.toFixed(1)}x el ritmo actual`}
              </p>
            </CardContent>
          </Card>

          {/* Quick Status */}
          <Card className="border-l-4 border-l-accent">
            <CardContent className="pt-3">
              <div className="flex items-start justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-accent-foreground" />
                </div>
                <Badge variant="outline" className="text-[10px]">{daysRemaining} días</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Faltan por vender</p>
              <p className="text-2xl font-bold">{ticketsNeededToReachTarget.toLocaleString('es-ES')}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Para alcanzar 85% ({targetTickets.toLocaleString('es-ES')} entradas)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scenarios Block */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Escenarios de Cierre
                </CardTitle>
                <CardDescription>Proyección final basada en diferentes ritmos de venta</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Base: {currentDailyAverage} entradas/día
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conservative */}
              <div className={`p-4 rounded-lg border-2 ${scenarios.conservative.reachesTarget ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Conservador</span>
                  <Badge variant={scenarios.conservative.reachesTarget ? "success" : "destructive"} className="text-[10px]">
                    {scenarios.conservative.reachesTarget ? 'Alcanza objetivo' : 'No alcanza'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ritmo diario</span>
                    <span className="font-semibold">{scenarios.conservative.dailyRate}/día</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Entradas finales</span>
                    <span className="font-semibold">{scenarios.conservative.finalTickets.toLocaleString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ocupación final</span>
                    <span className="text-lg font-bold">{scenarios.conservative.finalOccupancy.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={scenarios.conservative.finalOccupancy} className="h-2 mt-3" />
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  -20% respecto a ritmo actual
                </p>
              </div>

              {/* Realistic */}
              <div className={`p-4 rounded-lg border-2 ring-2 ring-primary/20 ${scenarios.realistic.reachesTarget ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">Realista ★</span>
                  <Badge variant={scenarios.realistic.reachesTarget ? "success" : "secondary"} className="text-[10px]">
                    {scenarios.realistic.reachesTarget ? 'Alcanza objetivo' : 'Ajustado'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ritmo diario</span>
                    <span className="font-semibold">{scenarios.realistic.dailyRate}/día</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Entradas finales</span>
                    <span className="font-semibold">{scenarios.realistic.finalTickets.toLocaleString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ocupación final</span>
                    <span className="text-lg font-bold">{scenarios.realistic.finalOccupancy.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={scenarios.realistic.finalOccupancy} className="h-2 mt-3" />
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Mantiene ritmo actual
                </p>
              </div>

              {/* Optimistic */}
              <div className={`p-4 rounded-lg border-2 ${scenarios.optimistic.reachesTarget ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Optimista</span>
                  <Badge variant="success" className="text-[10px]">
                    Alcanza objetivo
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ritmo diario</span>
                    <span className="font-semibold">{scenarios.optimistic.dailyRate}/día</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Entradas finales</span>
                    <span className="font-semibold">{scenarios.optimistic.finalTickets.toLocaleString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Ocupación final</span>
                    <span className="text-lg font-bold">{scenarios.optimistic.finalOccupancy.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={Math.min(scenarios.optimistic.finalOccupancy, 100)} className="h-2 mt-3" />
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  +30% respecto a ritmo actual
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Entradas Vendidas</p>
                  <p className="text-2xl font-bold">{ticketsSold.toLocaleString('es-ES')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                {weekChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span className={weekChange >= 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                  {weekChange >= 0 ? '+' : ''}{weekChange.toFixed(0)}%
                </span>
                <span className="text-muted-foreground">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">% Ocupación</p>
                  <p className="text-2xl font-bold">{occupancy.toFixed(1)}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-muted-foreground">Objetivo: 85%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Precio Medio</p>
                  <p className="text-2xl font-bold">€{avgPrice.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center">
                  <Euro className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+€1.20</span>
                <span className="text-muted-foreground">vs 2024</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos Estimados</p>
                  <p className="text-2xl font-bold">€{(grossRevenue / 1000).toFixed(0)}K</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+15%</span>
                <span className="text-muted-foreground">vs mismo periodo 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas Diarias */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ventas Diarias</CardTitle>
              <CardDescription>Evolución de ventas desde el lanzamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySalesData}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
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
                      formatter={(value: number) => [value.toLocaleString('es-ES'), 'Entradas']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorVentas)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Proyección de Ventas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Proyección de Ventas</CardTitle>
              <CardDescription>Real vs proyectado hasta el festival</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="mes" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                    />
                    <YAxis 
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
                      formatter={(value: number) => value ? [value.toLocaleString('es-ES'), ''] : ['—', '']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="real" 
                      name="Real" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proyectado" 
                      name="Proyectado"
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparativa Semanal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Comparativa de Ritmo Semanal</CardTitle>
                <CardDescription>Ventas semanales vs semanas anteriores y proyección</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
                  <span>Anterior</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full border-2 border-dashed border-accent" />
                  <span>Proyectado</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyComparison} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="semana" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                  />
                  <YAxis 
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
                    formatter={(value: number) => [value.toLocaleString('es-ES') + ' entradas', '']}
                  />
                  <Bar 
                    dataKey="actual" 
                    name="Actual"
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="anterior" 
                    name="Periodo anterior"
                    fill="hsl(var(--muted-foreground))" 
                    opacity={0.4}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="proyectado" 
                    name="Proyectado"
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumen por Canal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rendimiento por Canal</CardTitle>
              <CardDescription>Ventas por proveedor de ticketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {salesByProvider.map((provider, index) => {
                const pctSold = provider.percentage ?? ((provider.tickets / (totalCapacity / salesByProvider.length)) * 100);
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{provider.provider}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {provider.tickets.toLocaleString('es-ES')} entradas
                        </span>
                        <Badge variant={pctSold >= 80 ? "default" : pctSold >= 60 ? "secondary" : "outline"} className="w-14 justify-center">
                          {pctSold.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={Math.min(pctSold, 100)} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Métricas de Conversión</CardTitle>
              <CardDescription>Indicadores clave de rendimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Tasa de conversión web</p>
                  <p className="text-xl font-bold">4.2%</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> +0.8% vs objetivo
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Ticket medio VIP</p>
                  <p className="text-xl font-bold">€{festivalData.precios.vip}</p>
                  <p className="text-xs text-muted-foreground mt-1">12% del total vendido</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Ventas/día (media)</p>
                  <p className="text-xl font-bold">{currentDailyAverage}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> Ritmo actual
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Pico máximo diario</p>
                  <p className="text-xl font-bold">
                    {Math.max(...dailySalesData.map(d => d.ventas)).toLocaleString('es-ES')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dailySalesData.find(d => d.ventas === Math.max(...dailySalesData.map(x => x.ventas)))?.date || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesForecasts;
