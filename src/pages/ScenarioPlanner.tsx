import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Megaphone, 
  Calendar, 
  Target,
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const ScenarioPlanner = () => {
  // Pricing scenario
  const [priceChange, setPriceChange] = useState([0]);
  const basePrice = 55;
  const baseTickets = 12500;
  
  // Campaign scenario
  const [campaignBudget, setCampaignBudget] = useState([5000]);
  const [campaignDuration, setCampaignDuration] = useState([7]);
  
  // Prediction scenario
  const [daysRemaining, setDaysRemaining] = useState([30]);
  const [currentSales, setCurrentSales] = useState([8500]);
  const targetSales = 15000;

  // Calculate impacts (simulated)
  const priceImpact = {
    newPrice: basePrice * (1 + priceChange[0] / 100),
    ticketChange: Math.round(baseTickets * (-0.8 * priceChange[0] / 100)),
    revenueChange: Math.round(basePrice * baseTickets * (priceChange[0] / 100) * (1 - 0.3 * Math.abs(priceChange[0]) / 100)),
    elasticity: priceChange[0] > 0 ? "negativa" : "positiva"
  };

  const campaignImpact = {
    estimatedReach: Math.round(campaignBudget[0] * 150),
    estimatedClicks: Math.round(campaignBudget[0] * 8),
    estimatedConversions: Math.round(campaignBudget[0] * 0.12 * campaignDuration[0] / 7),
    estimatedRevenue: Math.round(campaignBudget[0] * 0.12 * campaignDuration[0] / 7 * basePrice),
    roi: ((campaignBudget[0] * 0.12 * campaignDuration[0] / 7 * basePrice) / campaignBudget[0] * 100 - 100).toFixed(0)
  };

  const predictionImpact = {
    dailyRate: Math.round(currentSales[0] / (60 - daysRemaining[0])),
    projectedFinal: Math.round(currentSales[0] + (currentSales[0] / (60 - daysRemaining[0])) * daysRemaining[0]),
    gapToTarget: targetSales - Math.round(currentSales[0] + (currentSales[0] / (60 - daysRemaining[0])) * daysRemaining[0]),
    requiredDailyRate: Math.round((targetSales - currentSales[0]) / daysRemaining[0]),
    probability: Math.min(95, Math.max(5, Math.round(100 - Math.abs(targetSales - (currentSales[0] + (currentSales[0] / (60 - daysRemaining[0])) * daysRemaining[0])) / targetSales * 100)))
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Scenario Planner" }]} />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Scenario Planner
              </h1>
              <Badge variant="secondary" className="ml-1 text-[10px]">Beta</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Simula escenarios y visualiza el impacto en tus ventas y revenue
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
            <RefreshCw className="h-3 w-3" />
            Resetear
          </Button>
        </div>

        {/* Pricing Scenario */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ajuste de Precios</CardTitle>
                  <CardDescription>
                    ¿Qué pasaría si modificamos el precio medio de entrada?
                  </CardDescription>
                </div>
              </div>
              <Badge variant={priceChange[0] > 0 ? "default" : priceChange[0] < 0 ? "secondary" : "outline"}>
                {priceChange[0] > 0 ? "+" : ""}{priceChange[0]}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Variación de precio</span>
                <span className="font-medium">{priceChange[0] > 0 ? "+" : ""}{priceChange[0]}%</span>
              </div>
              <Slider
                value={priceChange}
                onValueChange={setPriceChange}
                min={-30}
                max={30}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-30%</span>
                <span>0%</span>
                <span>+30%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Precio actual</p>
                <p className="text-2xl font-bold">€{basePrice}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Nuevo precio</p>
                <p className="text-2xl font-bold text-primary">€{priceImpact.newPrice.toFixed(0)}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Δ Entradas vendidas</p>
                <div className="flex items-center justify-center gap-1">
                  {priceImpact.ticketChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-2xl font-bold ${priceImpact.ticketChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {priceImpact.ticketChange >= 0 ? "+" : ""}{priceImpact.ticketChange}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">Δ Revenue estimado</p>
                <div className="flex items-center justify-center gap-1">
                  {priceImpact.revenueChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-2xl font-bold ${priceImpact.revenueChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {priceImpact.revenueChange >= 0 ? "+" : ""}€{priceImpact.revenueChange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Insight del modelo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    La elasticidad precio-demanda estimada es <strong>{priceImpact.elasticity}</strong>. 
                    {priceChange[0] > 10 
                      ? " Un incremento superior al 10% podría reducir significativamente la conversión." 
                      : priceChange[0] < -10 
                        ? " Una bajada agresiva de precio puede no compensarse con volumen adicional."
                        : " Este rango de ajuste se considera óptimo para el evento."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Scenario */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Megaphone className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Lanzamiento de Campaña</CardTitle>
                  <CardDescription>
                    ¿Cuántas ventas generaría una nueva campaña de marketing?
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline">
                €{campaignBudget[0].toLocaleString()} · {campaignDuration[0]} días
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Presupuesto de campaña</span>
                  <span className="font-medium">€{campaignBudget[0].toLocaleString()}</span>
                </div>
                <Slider
                  value={campaignBudget}
                  onValueChange={setCampaignBudget}
                  min={1000}
                  max={20000}
                  step={500}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>€1.000</span>
                  <span>€10.000</span>
                  <span>€20.000</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="font-medium">{campaignDuration[0]} días</span>
                </div>
                <Slider
                  value={campaignDuration}
                  onValueChange={setCampaignDuration}
                  min={3}
                  max={30}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 días</span>
                  <span>15 días</span>
                  <span>30 días</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Inversión</p>
                <p className="text-lg font-bold">€{campaignBudget[0].toLocaleString()}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Alcance estimado</p>
                <p className="text-lg font-bold">{campaignImpact.estimatedReach.toLocaleString()}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Conversiones</p>
                <p className="text-lg font-bold text-primary">{campaignImpact.estimatedConversions}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Revenue generado</p>
                <p className="text-lg font-bold text-emerald-500">€{campaignImpact.estimatedRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">CPM estimado</p>
                <p className="text-xl font-bold">€6.67</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">CTR esperado</p>
                <p className="text-xl font-bold">1.2%</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tasa conversión</p>
                <p className="text-xl font-bold">2.1%</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">ROI estimado</p>
                <p className={`text-xl font-bold ${Number(campaignImpact.roi) > 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {campaignImpact.roi}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Recomendación</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Number(campaignImpact.roi) > 100 
                      ? "Este escenario muestra un ROI muy positivo. Considera aumentar la inversión." 
                      : Number(campaignImpact.roi) > 0 
                        ? "El retorno es positivo pero moderado. Optimiza creativos para mejorar conversión."
                        : "El ROI es negativo. Reduce presupuesto o mejora el targeting."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Scenario */}
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Predicción de Ventas</CardTitle>
                  <CardDescription>
                    ¿Alcanzaremos el objetivo con el ritmo actual?
                  </CardDescription>
                </div>
              </div>
              <Badge variant={predictionImpact.probability >= 70 ? "default" : predictionImpact.probability >= 40 ? "secondary" : "destructive"}>
                {predictionImpact.probability}% probabilidad
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Días restantes</span>
                  <span className="font-medium">{daysRemaining[0]} días</span>
                </div>
                <Slider
                  value={daysRemaining}
                  onValueChange={setDaysRemaining}
                  min={1}
                  max={60}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 día</span>
                  <span>30 días</span>
                  <span>60 días</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ventas actuales</span>
                  <span className="font-medium">{currentSales[0].toLocaleString()} entradas</span>
                </div>
                <Slider
                  value={currentSales}
                  onValueChange={setCurrentSales}
                  min={1000}
                  max={14000}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1.000</span>
                  <span>7.500</span>
                  <span>14.000</span>
                </div>
              </div>
            </div>

            {/* Visual progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso hacia objetivo</span>
                <span className="font-medium">{currentSales[0].toLocaleString()} / {targetSales.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentSales[0] / targetSales) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span className="text-primary font-medium">Actual: {((currentSales[0] / targetSales) * 100).toFixed(0)}%</span>
                <span>Objetivo: {targetSales.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Ritmo actual</p>
                <p className="text-xl font-bold">{predictionImpact.dailyRate}/día</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Proyección final</p>
                <p className={`text-xl font-bold ${predictionImpact.projectedFinal >= targetSales ? "text-emerald-500" : "text-amber-500"}`}>
                  {predictionImpact.projectedFinal.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Gap vs objetivo</p>
                <p className={`text-xl font-bold ${predictionImpact.gapToTarget <= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {predictionImpact.gapToTarget <= 0 ? "+" : ""}{Math.abs(predictionImpact.gapToTarget).toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">Ritmo necesario</p>
                <p className={`text-xl font-bold ${predictionImpact.requiredDailyRate <= predictionImpact.dailyRate ? "text-emerald-500" : "text-amber-500"}`}>
                  {predictionImpact.requiredDailyRate}/día
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              predictionImpact.probability >= 70 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : predictionImpact.probability >= 40 
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-red-500/10 border-red-500/20"
            }`}>
              <div className="flex items-start gap-3">
                <Calendar className={`h-5 w-5 mt-0.5 ${
                  predictionImpact.probability >= 70 
                    ? "text-emerald-500" 
                    : predictionImpact.probability >= 40 
                      ? "text-amber-500"
                      : "text-red-500"
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    predictionImpact.probability >= 70 
                      ? "text-emerald-700 dark:text-emerald-400" 
                      : predictionImpact.probability >= 40 
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-red-700 dark:text-red-400"
                  }`}>
                    {predictionImpact.probability >= 70 
                      ? "En camino al objetivo" 
                      : predictionImpact.probability >= 40 
                        ? "Objetivo en riesgo"
                        : "Objetivo comprometido"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {predictionImpact.probability >= 70 
                      ? `Con el ritmo actual de ${predictionImpact.dailyRate} ventas/día, superarás el objetivo en ${Math.round((predictionImpact.projectedFinal - targetSales) / predictionImpact.dailyRate)} días antes.`
                      : predictionImpact.probability >= 40 
                        ? `Necesitas aumentar el ritmo a ${predictionImpact.requiredDailyRate} ventas/día (+${Math.round((predictionImpact.requiredDailyRate - predictionImpact.dailyRate) / predictionImpact.dailyRate * 100)}%).`
                        : `El gap de ${Math.abs(predictionImpact.gapToTarget).toLocaleString()} entradas requiere acciones urgentes de marketing.`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Las proyecciones se basan en datos históricos y modelos estadísticos. Los resultados reales pueden variar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
