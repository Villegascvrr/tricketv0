import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  Target,
  Zap,
  Repeat,
  GraduationCap,
  Briefcase,
  Ticket,
  Euro,
  ArrowRight,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { festivalData } from "@/data/festivalData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Actionable segments data - based on festival audience patterns
const actionableSegments = [
  {
    id: 'jovenes_sevilla',
    name: 'Jóvenes Sevilla',
    description: 'Universitarios y jóvenes trabajadores de Sevilla capital',
    icon: GraduationCap,
    size: 4200,
    sizePercent: 28.3,
    ticketType: 'General + Early Bird',
    avgTicketPrice: 22,
    conversionPotential: 85,
    conversionLabel: 'Muy alto',
    characteristics: ['18-24 años', 'Sevilla ciudad', 'Email activo'],
    action: 'Campaña universitaria Instagram + WhatsApp',
    estimatedImpact: '+320 entradas',
    priority: 'high'
  },
  {
    id: 'repeat_buyers',
    name: 'Repeat Buyers',
    description: 'Asistentes a ediciones anteriores (2023-2024)',
    icon: Repeat,
    size: 2850,
    sizePercent: 19.2,
    ticketType: 'General + VIP',
    avgTicketPrice: 35,
    conversionPotential: 92,
    conversionLabel: 'Excelente',
    characteristics: ['Compra recurrente', 'Email verificado', 'Marketing consent'],
    action: 'Email personalizado con precio especial',
    estimatedImpact: '+180 entradas',
    priority: 'high'
  },
  {
    id: 'provincia_andalucia',
    name: 'Andalucía Exterior',
    description: 'Públicos de Cádiz, Málaga, Córdoba con historial de viaje',
    icon: MapPin,
    size: 2100,
    sizePercent: 14.1,
    ticketType: 'General',
    avgTicketPrice: 24,
    conversionPotential: 65,
    conversionLabel: 'Moderado',
    characteristics: ['Cádiz/Málaga/Córdoba', '18-30 años', 'Pack transporte'],
    action: 'Promoción bus + entrada combo',
    estimatedImpact: '+140 entradas',
    priority: 'medium'
  },
  {
    id: 'vip_seekers',
    name: 'VIP Seekers',
    description: 'Perfil alto gasto, interés en experiencia premium',
    icon: Sparkles,
    size: 890,
    sizePercent: 6.0,
    ticketType: 'VIP exclusivo',
    avgTicketPrice: 85,
    conversionPotential: 78,
    conversionLabel: 'Alto',
    characteristics: ['25-35 años', 'Compra VIP previa', 'Alto ticket medio'],
    action: 'Lanzamiento VIP exclusivo con ventajas',
    estimatedImpact: '+€25K revenue',
    priority: 'medium'
  },
  {
    id: 'jovenes_trabajadores',
    name: 'Jóvenes Profesionales',
    description: 'Trabajadores 25-30 años con capacidad de gasto',
    icon: Briefcase,
    size: 1650,
    sizePercent: 11.1,
    ticketType: 'General + Upgrades',
    avgTicketPrice: 45,
    conversionPotential: 70,
    conversionLabel: 'Alto',
    characteristics: ['25-30 años', 'Área metropolitana', 'Upgrade potencial'],
    action: 'Promoción upgrade VIP a mitad de precio',
    estimatedImpact: '+€15K revenue',
    priority: 'medium'
  },
  {
    id: 'cold_leads',
    name: 'Leads Fríos',
    description: 'Registrados sin compra, interacción hace +30 días',
    icon: Target,
    size: 3200,
    sizePercent: 21.5,
    ticketType: 'Early Bird / Descuento',
    avgTicketPrice: 18,
    conversionPotential: 25,
    conversionLabel: 'Bajo',
    characteristics: ['Sin compra', 'Registro web', 'Inactivos'],
    action: 'Reactivación con oferta flash 48h',
    estimatedImpact: '+95 entradas',
    priority: 'low'
  }
];

// Geographic data for the chart
const geographicData = [
  { zona: 'Sevilla capital', asistentes: 5640, percent: 38, ticketMedio: 28 },
  { zona: 'Área metropolitana', asistentes: 2970, percent: 20, ticketMedio: 25 },
  { zona: 'Resto Andalucía', asistentes: 3570, percent: 24, ticketMedio: 24 },
  { zona: 'Resto España', asistentes: 1785, percent: 12, ticketMedio: 32 },
  { zona: 'Internacional', asistentes: 885, percent: 6, ticketMedio: 45 }
];

// Age segments with ticket preferences
const ageSegments = [
  { rango: '18-21', asistentes: 4455, percent: 30, ticketPref: 'Early Bird', avgPrice: 19 },
  { rango: '22-25', asistentes: 4950, percent: 33, ticketPref: 'General', avgPrice: 24 },
  { rango: '26-30', asistentes: 3465, percent: 23, ticketPref: 'General + VIP', avgPrice: 38 },
  { rango: '31+', asistentes: 1980, percent: 14, ticketPref: 'VIP', avgPrice: 65 }
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Audience = () => {
  const { audiencia, overview } = festivalData;
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  const totalAsistentes = overview.entradasVendidas;

  // Calculate total potential from segments
  const totalPotential = useMemo(() => {
    return actionableSegments.reduce((acc, seg) => {
      const match = seg.estimatedImpact.match(/\+(\d+)/);
      if (match && seg.estimatedImpact.includes('entradas')) {
        return acc + parseInt(match[1]);
      }
      return acc;
    }, 0);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-success/10 text-success border-success/30';
      case 'medium': return 'bg-warning/10 text-warning border-warning/30';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConversionColor = (potential: number) => {
    if (potential >= 80) return 'text-success';
    if (potential >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Público y Audiencia" }]} />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Público y Audiencia</h1>
            <p className="text-xs text-muted-foreground">Segmentos accionables para decisiones de marketing y ventas</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {totalAsistentes.toLocaleString('es-ES')} entradas vendidas
          </Badge>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Card>
            <CardContent className="pt-3 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase">Segmentos Activos</span>
              </div>
              <p className="text-xl font-bold">{actionableSegments.length}</p>
              <p className="text-[10px] text-muted-foreground">{actionableSegments.filter(s => s.priority === 'high').length} prioritarios</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-3 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-success" />
                <span className="text-[11px] text-muted-foreground uppercase">Potencial Total</span>
              </div>
              <p className="text-xl font-bold text-success">+{totalPotential}</p>
              <p className="text-[10px] text-muted-foreground">entradas estimadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-3 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Repeat className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase">Repeat Rate</span>
              </div>
              <p className="text-xl font-bold">38%</p>
              <p className="text-[10px] text-success">+12% vs 2024</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-3 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Euro className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase">Ticket Medio</span>
              </div>
              <p className="text-xl font-bold">€{(overview.ingresosTotales / totalAsistentes).toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground">por asistente</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-3 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-muted-foreground uppercase">Local vs Foráneo</span>
              </div>
              <p className="text-xl font-bold">58% / 42%</p>
              <p className="text-[10px] text-muted-foreground">Sevilla vs otros</p>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Segments - Main Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Segmentos Accionables
                </CardTitle>
                <CardDescription className="text-[11px]">Grupos definidos con acción concreta y potencial medible</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">Alto</Badge>
                <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">Medio</Badge>
                <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">Bajo</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {actionableSegments.map((segment) => {
                const IconComponent = segment.icon;
                const isSelected = selectedSegment === segment.id;
                
                return (
                  <div 
                    key={segment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedSegment(isSelected ? null : segment.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg shrink-0 ${getPriorityColor(segment.priority)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{segment.name}</span>
                          <Badge variant="outline" className={`text-[10px] ${getPriorityColor(segment.priority)}`}>
                            {segment.priority === 'high' ? 'Prioritario' : segment.priority === 'medium' ? 'Moderado' : 'Bajo'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{segment.description}</p>
                        
                        {/* Key Metrics Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{segment.size.toLocaleString('es-ES')}</span>
                            <span className="text-muted-foreground">({segment.sizePercent}%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Ticket className="h-3 w-3 text-muted-foreground" />
                            <span>{segment.ticketType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3 text-muted-foreground" />
                            <span>€{segment.avgTicketPrice} medio</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`h-3 w-3 ${getConversionColor(segment.conversionPotential)}`} />
                            <span className={`font-medium ${getConversionColor(segment.conversionPotential)}`}>
                              {segment.conversionPotential}% conversión
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Impact Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-success">{segment.estimatedImpact}</div>
                        <p className="text-[10px] text-muted-foreground">impacto est.</p>
                      </div>
                      
                      <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                    
                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Características</p>
                            <div className="flex flex-wrap gap-1">
                              {segment.characteristics.map((char, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px]">{char}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Potencial de Conversión</p>
                            <div className="flex items-center gap-2">
                              <Progress value={segment.conversionPotential} className="h-2 flex-1" />
                              <span className={`text-sm font-medium ${getConversionColor(segment.conversionPotential)}`}>
                                {segment.conversionLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">Acción Recomendada</span>
                          </div>
                          <p className="text-sm">{segment.action}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Geographic + Age Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Distribución Geográfica
              </CardTitle>
              <CardDescription className="text-[11px]">Origen y ticket medio por zona</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geographicData.map((zona, index) => (
                  <div key={zona.zona} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{zona.zona}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">{zona.asistentes.toLocaleString('es-ES')}</span>
                        <Badge variant="outline" className="text-[10px]">€{zona.ticketMedio}</Badge>
                        <span className="font-medium w-8 text-right">{zona.percent}%</span>
                      </div>
                    </div>
                    <Progress value={zona.percent} className="h-1.5" />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Oportunidad detectada:</span>
                  <span className="font-medium">Málaga y Cádiz con bajo ticket medio</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age Segments with Ticket Preferences */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Segmentos por Edad
              </CardTitle>
              <CardDescription className="text-[11px]">Preferencia de entrada y precio medio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ageSegments.map((age, index) => (
                  <div key={age.rango} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold text-sm">{age.rango} años</span>
                        <Badge variant="secondary" className="text-[10px]">{age.percent}%</Badge>
                      </div>
                      <span className="text-sm font-medium">{age.asistentes.toLocaleString('es-ES')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Ticket className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Preferencia:</span>
                        <span className="font-medium">{age.ticketPref}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">€{age.avgPrice}</span>
                        <span className="text-muted-foreground">medio</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Insight:</span>
                  <span className="font-medium">31+ años = 14% público pero 22% revenue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Quality */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Calidad de Datos de Contacto</CardTitle>
            <CardDescription className="text-[11px]">Base de datos disponible para activaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold">{((audiencia.contactStats.conEmail / audiencia.totalAsistentes) * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Con email válido</p>
                <p className="text-[10px] text-primary mt-1">{audiencia.contactStats.conEmail.toLocaleString('es-ES')} contactos</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold">{((audiencia.contactStats.conTelefono / audiencia.totalAsistentes) * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Con teléfono</p>
                <p className="text-[10px] text-primary mt-1">{audiencia.contactStats.conTelefono.toLocaleString('es-ES')} contactos</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold">{((audiencia.contactStats.consentimientoMarketing / audiencia.totalAsistentes) * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Marketing consent</p>
                <p className="text-[10px] text-success mt-1">Activables directamente</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">42%</p>
                <p className="text-xs text-muted-foreground">Datos completos</p>
                <p className="text-[10px] text-muted-foreground mt-1">Email + Tel + Consent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Audience;
