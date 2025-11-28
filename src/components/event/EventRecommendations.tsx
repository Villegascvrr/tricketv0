import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, DollarSign, Sparkles, RefreshCw } from "lucide-react";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { useState } from "react";

interface EventRecommendationsProps {
  eventId: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

const EventRecommendations = ({ eventId }: EventRecommendationsProps) => {
  // Generate recommendations directly from festivalData
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Call generateAIRecommendations() to get dynamic recommendations
  const recommendations: Recommendation[] = generateAIRecommendations();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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

  // No loading states needed - recommendations are generated instantly from festivalData

  const groupedRecommendations = {
    marketing: recommendations.filter(r => r.category === 'marketing'),
    pricing: recommendations.filter(r => r.category === 'pricing'),
    alert: recommendations.filter(r => r.category === 'alert'),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Recomendaciones IA
          </h2>
          <p className="text-muted-foreground">
            Insights y sugerencias generadas automáticamente
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Marketing Recommendations */}
      {groupedRecommendations.marketing.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Marketing
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedRecommendations.marketing.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed whitespace-pre-line">
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedRecommendations.pricing.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed whitespace-pre-line">
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alertas y Oportunidades
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedRecommendations.alert.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed whitespace-pre-line">
                    {rec.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay recomendaciones disponibles en este momento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventRecommendations;