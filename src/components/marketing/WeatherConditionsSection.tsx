import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  History,
  Info,
  Megaphone
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

// Mock weather forecast data for festival dates
const forecastData = [
  { day: 'Vie 6 Jun', tempMax: 32, tempMin: 19, rain: 5, wind: 12, humidity: 45, condition: 'sunny' },
  { day: 'Sáb 7 Jun', tempMax: 34, tempMin: 20, rain: 10, wind: 15, humidity: 50, condition: 'partly_cloudy' },
  { day: 'Dom 8 Jun', tempMax: 30, tempMin: 18, rain: 25, wind: 20, humidity: 65, condition: 'cloudy' },
];

// Historical weather data for similar dates
const historicalData = [
  { year: '2022', tempAvg: 31, rainDays: 0, attendance: 98, notes: 'Condiciones ideales' },
  { year: '2023', tempAvg: 28, rainDays: 1, attendance: 92, notes: 'Lluvia leve el domingo' },
  { year: '2024', tempAvg: 35, rainDays: 0, attendance: 85, notes: 'Ola de calor - menor afluencia' },
];

// Temperature trend comparison
const temperatureTrend = [
  { week: 'Sem -4', historical: 26, current: 28 },
  { week: 'Sem -3', historical: 28, current: 29 },
  { week: 'Sem -2', historical: 30, current: 31 },
  { week: 'Sem -1', historical: 31, current: 33 },
  { week: 'Festival', historical: 32, current: 32 },
];

const WeatherConditionsSection = () => {
  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-amber-500" />;
      case 'partly_cloudy': return <Cloud className="h-5 w-5 text-slate-400" />;
      case 'cloudy': return <CloudRain className="h-5 w-5 text-blue-400" />;
      default: return <Sun className="h-5 w-5 text-amber-500" />;
    }
  };

  const getRiskLevel = (value: number, type: 'rain' | 'heat' | 'wind') => {
    if (type === 'rain') {
      if (value < 20) return { level: 'bajo', color: 'bg-success/10 text-success border-success/20' };
      if (value < 50) return { level: 'medio', color: 'bg-warning/10 text-warning border-warning/20' };
      return { level: 'alto', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    }
    if (type === 'heat') {
      if (value < 30) return { level: 'bajo', color: 'bg-success/10 text-success border-success/20' };
      if (value < 35) return { level: 'medio', color: 'bg-warning/10 text-warning border-warning/20' };
      return { level: 'alto', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    }
    if (type === 'wind') {
      if (value < 20) return { level: 'bajo', color: 'bg-success/10 text-success border-success/20' };
      if (value < 35) return { level: 'medio', color: 'bg-warning/10 text-warning border-warning/20' };
      return { level: 'alto', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    }
    return { level: 'bajo', color: 'bg-success/10 text-success border-success/20' };
  };

  // Calculate overall risk
  const avgRainProb = forecastData.reduce((acc, d) => acc + d.rain, 0) / forecastData.length;
  const maxTemp = Math.max(...forecastData.map(d => d.tempMax));
  const maxWind = Math.max(...forecastData.map(d => d.wind));

  const overallRisk = avgRainProb > 40 || maxTemp > 36 || maxWind > 30 ? 'alto' : 
                      avgRainProb > 20 || maxTemp > 33 || maxWind > 20 ? 'medio' : 'bajo';

  return (
    <div className="space-y-4">
      {/* Alerts Section */}
      {(avgRainProb > 20 || maxTemp > 33) && (
        <div className="space-y-2">
          {avgRainProb > 20 && (
            <Alert variant="destructive" className="border-warning/50 bg-warning/10 text-warning-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning font-medium">Posible impacto en asistencia</AlertTitle>
              <AlertDescription className="text-warning/80">
                La probabilidad de lluvia del {avgRainProb.toFixed(0)}% para el domingo podría reducir la asistencia entre un 5-15%. 
                Considere reforzar la comunicación sobre zonas cubiertas y plan de contingencia.
              </AlertDescription>
            </Alert>
          )}
          {maxTemp > 33 && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <Thermometer className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-600 font-medium">Recomendación: reforzar comunicación</AlertTitle>
              <AlertDescription className="text-amber-600/80">
                Temperaturas previstas de hasta {maxTemp}°C. Refuerce comunicación sobre hidratación, 
                puntos de agua y zonas de sombra. Históricamente, el calor extremo reduce consumo en food trucks.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Forecast Cards */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Previsión Meteorológica
                </CardTitle>
                <CardDescription className="text-xs">Festival 6-8 Junio 2025</CardDescription>
              </div>
              <Badge variant="outline" className={
                overallRisk === 'alto' ? 'border-destructive/50 text-destructive' :
                overallRisk === 'medio' ? 'border-warning/50 text-warning' :
                'border-success/50 text-success'
              }>
                Riesgo {overallRisk}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {forecastData.map((day, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{day.day}</span>
                    {getConditionIcon(day.condition)}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-bold">{day.tempMax}°</span>
                    <span className="text-xs text-muted-foreground mb-0.5">/{day.tempMin}°</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Droplets className="h-3 w-3" /> Lluvia
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getRiskLevel(day.rain, 'rain').color}`}>
                        {day.rain}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Wind className="h-3 w-3" /> Viento
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getRiskLevel(day.wind, 'wind').color}`}>
                        {day.wind} km/h
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Indicadores de Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                  Probabilidad Lluvia
                </span>
                <Badge variant="outline" className={getRiskLevel(avgRainProb, 'rain').color}>
                  {getRiskLevel(avgRainProb, 'rain').level}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${avgRainProb}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{avgRainProb.toFixed(0)}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                  Temperatura Máx
                </span>
                <Badge variant="outline" className={getRiskLevel(maxTemp, 'heat').color}>
                  {getRiskLevel(maxTemp, 'heat').level}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(maxTemp / 45) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{maxTemp}°C</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-cyan-500" />
                  Viento Máximo
                </span>
                <Badge variant="outline" className={getRiskLevel(maxWind, 'wind').color}>
                  {getRiskLevel(maxWind, 'wind').level}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${(maxWind / 50) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{maxWind} km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data & Temperature Trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Historical Weather */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Histórico Clima en Fechas Similares
            </CardTitle>
            <CardDescription className="text-xs">Comparativa con ediciones anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historicalData.map((year, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{year.year.slice(2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{year.tempAvg}°C media</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {year.rainDays === 0 ? 'Sin lluvia' : `${year.rainDays} día(s) lluvia`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{year.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {year.attendance >= 95 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      ) : year.attendance >= 90 ? (
                        <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span className="text-sm font-medium">{year.attendance}%</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">asistencia</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Temperature Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-500" />
              Evolución Temperatura
            </CardTitle>
            <CardDescription className="text-xs">Comparativa histórica vs previsión actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[20, 40]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="historical" 
                    name="Media histórica"
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted))" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    name="Previsión 2025"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Impacto Esperado en Asistencia y Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Factores de Riesgo
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                  <span><strong className="text-foreground">Lluvia domingo (25%):</strong> Históricamente reduce asistencia 10-15% y consumo en zonas descubiertas hasta 30%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span><strong className="text-foreground">Calor extremo (34°C):</strong> Aumenta consumo bebidas +40% pero reduce permanencia media 1-2 horas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  <span><strong className="text-foreground">Viento moderado:</strong> Sin impacto significativo en la experiencia del asistente.</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                Recomendaciones de Marketing
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Comunicar <strong className="text-foreground">zonas de sombra y puntos de hidratación</strong> en redes 48h antes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Preparar <strong className="text-foreground">email de contingencia</strong> si probabilidad lluvia supera 40%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Destacar experiencia <strong className="text-foreground">"Verano Andaluz"</strong> en creativos - el calor es parte del encanto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Activar <strong className="text-foreground">promoción last-minute</strong> si previsión mejora a 48h del evento.</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherConditionsSection;
