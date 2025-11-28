import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, DollarSign, Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRecommendationStatus, RecommendationStatus } from "@/contexts/RecommendationStatusContext";
import { RecommendationStatusBadge } from "./RecommendationStatusBadge";
import { AlertDetailModal } from "./AlertDetailModal";
import { cn } from "@/lib/utils";

interface EventRecommendationsProps {
  eventId: string;
  recommendations?: Recommendation[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

const EventRecommendations = ({ eventId, recommendations: propRecommendations, isLoading, onRefresh }: EventRecommendationsProps) => {
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const { getStatus, updateStatus } = useRecommendationStatus();
  
  // Static recommendations based on current event data
  const recommendations: Recommendation[] = [
    // Marketing
    {
      id: 'marketing-entradas-com',
      title: 'Potenciar ventas en Entradas.com',
      description: '⚠️ Rendimiento bajo detectado\n\n📊 Situación actual: 4.900 / 12.000 entradas vendidas (40,8%)\n💰 Capacidad disponible: 7.100 entradas sin vender\n\n🎯 Acción sugerida: Lanzar campaña específica en canales digitales asociados a Entradas.com para impulsar las ventas en esta ticketera.',
      priority: 'high',
      category: 'marketing',
      scope: 'provider',
      targetKey: 'Entradas.com'
    },
    {
      id: 'marketing-forvenues',
      title: 'Impulsar conversión en Forvenues',
      description: '⚠️ Ocupación crítica en este canal\n\n📊 Situación actual: 1.850 / 5.000 entradas vendidas (37%)\n💰 Gap de ventas: 3.150 entradas por vender\n\n🎯 Acción sugerida: Activar promociones específicas y reforzar presencia en los puntos de venta físicos asociados a Forvenues.',
      priority: 'high',
      category: 'marketing',
      scope: 'provider',
      targetKey: 'Forvenues'
    },
    {
      id: 'marketing-general-push',
      title: 'Campaña general de impulso',
      description: '📊 Situación general: 39.350 / 62.000 entradas vendidas (63,5%)\n💰 Potencial restante: 22.650 entradas disponibles\n\n💡 Oportunidad: Aunque el evento va por buen camino, hay margen significativo para incrementar ventas con una campaña coordinada en todos los canales.',
      priority: 'medium',
      category: 'marketing',
      scope: 'global'
    },
    // Pricing
    {
      id: 'pricing-premium-zones',
      title: 'Optimizar pricing en zonas premium',
      description: '✅ Alto rendimiento en Bclever\n\n📊 Ocupación: 8.800 / 10.000 (88%)\n💡 Insight: Este nivel de ocupación sugiere que el precio puede estar infravalorado\n\n🎯 Acción sugerida: Considerar incremento de precio en últimas entradas disponibles o crear paquetes premium con servicios adicionales.',
      priority: 'low',
      category: 'pricing',
      scope: 'provider',
      targetKey: 'Bclever'
    },
    {
      id: 'pricing-ticketmaster-optimization',
      title: 'Ajuste de precios en Ticketmaster',
      description: '✅ Buen rendimiento detectado\n\n📊 Ocupación: 23.800 / 30.000 (79,3%)\n💰 Margen restante: 6.200 entradas\n\n💡 Estrategia: Con este nivel de ocupación, es momento ideal para aplicar dynamic pricing en las entradas restantes para maximizar ingresos.',
      priority: 'low',
      category: 'pricing',
      scope: 'provider',
      targetKey: 'Ticketmaster'
    },
    // Alertas
    {
      id: 'alert-capacity-opportunity',
      title: 'Oportunidad: 36,5% de capacidad disponible',
      description: '📊 Estado actual del evento:\n• Vendidas: 39.350 entradas\n• Capacidad total: 62.000\n• Disponibles: 22.650 (36,5%)\n\n⚠️ Alerta: Hay una oportunidad significativa de incrementar ventas en las próximas semanas. Recomendamos activar estrategias de última hora.',
      priority: 'medium',
      category: 'alert',
      scope: 'global'
    },
    {
      id: 'alert-channel-imbalance',
      title: 'Desbalance entre ticketeras',
      description: '📊 Análisis comparativo:\n• Bclever: 88% ocupación ✅\n• Ticketmaster: 79,3% ocupación ✅\n• Entradas.com: 40,8% ocupación ⚠️\n• Forvenues: 37% ocupación ⚠️\n\n🎯 Alerta: Hay un desequilibrio notable. Enfocar esfuerzos en las ticketeras de bajo rendimiento para equilibrar la distribución.',
      priority: 'high',
      category: 'alert',
      scope: 'global'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <TrendingUp className="h-5 w-5" />;
      case 'pricing':
        return <DollarSign className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'marketing':
        return 'Marketing';
      case 'pricing':
        return 'Pricing';
      case 'alert':
        return 'Alerta';
      default:
        return category;
    }
  };

  // Filter by status
  const filteredRecommendations = recommendations.filter(rec => {
    if (statusFilter === 'all') return true;
    return getStatus(rec.id) === statusFilter;
  });

  const groupedRecommendations = {
    marketing: filteredRecommendations.filter(r => r.category === 'marketing'),
    pricing: filteredRecommendations.filter(r => r.category === 'pricing'),
    alert: filteredRecommendations.filter(r => r.category === 'alert'),
  };

  return (
    <>
      <AlertDetailModal 
        recommendation={selectedRecommendation}
        open={!!selectedRecommendation}
        onOpenChange={(open) => !open && setSelectedRecommendation(null)}
      />
      <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recomendaciones IA
            </h2>
            <p className="text-xs text-muted-foreground">
              Insights y sugerencias generadas automáticamente
            </p>
          </div>
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Actualizar
            </Button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Estado:</span>
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="h-8"
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
            className={cn("h-8", statusFilter === 'pending' && "bg-muted/50 text-foreground hover:bg-muted")}
          >
            Pendientes
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('in_progress')}
            className={cn("h-8", statusFilter === 'in_progress' && "bg-blue-500 hover:bg-blue-600")}
          >
            En progreso
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
            className={cn("h-8", statusFilter === 'completed' && "bg-green-500 hover:bg-green-600")}
          >
            Realizadas
          </Button>
        </div>
      </div>

      {/* Marketing Recommendations */}
      {groupedRecommendations.marketing.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Marketing
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {groupedRecommendations.marketing.map((rec, index) => (
              <Card 
                key={rec.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRecommendation(rec)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{rec.title}</CardTitle>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <RecommendationStatusBadge
                        status={getStatus(rec.id)}
                        onStatusChange={(status) => updateStatus(rec.id, status)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-xs leading-relaxed whitespace-pre-line">
                    {rec.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Recommendations */}
      {groupedRecommendations.pricing.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {groupedRecommendations.pricing.map((rec, index) => (
              <Card 
                key={rec.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedRecommendation(rec)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{rec.title}</CardTitle>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <RecommendationStatusBadge
                        status={getStatus(rec.id)}
                        onStatusChange={(status) => updateStatus(rec.id, status)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-xs leading-relaxed whitespace-pre-line">
                    {rec.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {groupedRecommendations.alert.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Alertas y Oportunidades
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {groupedRecommendations.alert.map((rec, index) => (
              <Card 
                key={rec.id} 
                className="hover:shadow-md transition-shadow border-2 cursor-pointer"
                onClick={() => setSelectedRecommendation(rec)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{rec.title}</CardTitle>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <RecommendationStatusBadge
                        status={getStatus(rec.id)}
                        onStatusChange={(status) => updateStatus(rec.id, status)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-xs leading-relaxed whitespace-pre-line">
                    {rec.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-xs text-muted-foreground mb-2">
              No hay recomendaciones disponibles en este momento
            </p>
            <p className="text-xs text-muted-foreground">
              Haz clic en "Actualizar" para generar nuevas recomendaciones basadas en los datos actuales del evento
            </p>
          </CardContent>
        </Card>
      )}
      
      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-10 w-10 text-muted-foreground mx-auto mb-3 animate-spin" />
            <p className="text-xs text-muted-foreground">
              Generando recomendaciones...
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
};

export default EventRecommendations;