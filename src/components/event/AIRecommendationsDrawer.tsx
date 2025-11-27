import { Brain, AlertCircle, TrendingUp, DollarSign, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

interface AIRecommendationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: Recommendation[];
  isLoading: boolean;
}

const AIRecommendationsDrawer = ({ 
  open, 
  onOpenChange, 
  recommendations,
  isLoading 
}: AIRecommendationsDrawerProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <TrendingUp className="h-4 w-4" />;
      case 'pricing':
        return <DollarSign className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
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

  const getScopeLabel = (scope: string, targetKey?: string) => {
    if (scope === 'global') return null;
    return targetKey || scope;
  };

  const groupedRecommendations = {
    high: recommendations.filter(r => r.priority === 'high'),
    medium: recommendations.filter(r => r.priority === 'medium'),
    low: recommendations.filter(r => r.priority === 'low'),
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <SheetTitle>Centro de Alertas IA</SheetTitle>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          {!isLoading && (
            <div className="flex gap-2 pt-2">
              {groupedRecommendations.high.length > 0 && (
                <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
                  {groupedRecommendations.high.length} críticas
                </Badge>
              )}
              {groupedRecommendations.medium.length > 0 && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  {groupedRecommendations.medium.length} importantes
                </Badge>
              )}
              {groupedRecommendations.low.length > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {groupedRecommendations.low.length} sugerencias
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              {/* Critical Recommendations */}
              {groupedRecommendations.high.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-danger flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Críticas ({groupedRecommendations.high.length})
                  </h3>
                  {groupedRecommendations.high.map((rec, index) => (
                    <Card 
                      key={index} 
                      className={cn(
                        "border-2 hover:shadow-md transition-shadow",
                        "border-danger/30 bg-danger/5"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {getCategoryIcon(rec.category)}
                            <div className="flex flex-col gap-1">
                              <CardTitle className="text-base leading-tight">
                                {rec.title}
                              </CardTitle>
                              {getScopeLabel(rec.scope, rec.targetKey) && (
                                <span className="text-xs text-muted-foreground">
                                  {getScopeLabel(rec.scope, rec.targetKey)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-xs bg-muted">
                              {getCategoryLabel(rec.category)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                              Alta
                            </Badge>
                          </div>
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
              )}

              {/* Important Recommendations */}
              {groupedRecommendations.medium.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-warning flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Importantes ({groupedRecommendations.medium.length})
                  </h3>
                  {groupedRecommendations.medium.map((rec, index) => (
                    <Card 
                      key={index} 
                      className="border hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {getCategoryIcon(rec.category)}
                            <div className="flex flex-col gap-1">
                              <CardTitle className="text-base leading-tight">
                                {rec.title}
                              </CardTitle>
                              {getScopeLabel(rec.scope, rec.targetKey) && (
                                <span className="text-xs text-muted-foreground">
                                  {getScopeLabel(rec.scope, rec.targetKey)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-xs bg-muted">
                              {getCategoryLabel(rec.category)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                              Media
                            </Badge>
                          </div>
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
              )}

              {/* Low Priority Recommendations */}
              {groupedRecommendations.low.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Sugerencias ({groupedRecommendations.low.length})
                  </h3>
                  {groupedRecommendations.low.map((rec, index) => (
                    <Card 
                      key={index} 
                      className="border hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {getCategoryIcon(rec.category)}
                            <div className="flex flex-col gap-1">
                              <CardTitle className="text-base leading-tight">
                                {rec.title}
                              </CardTitle>
                              {getScopeLabel(rec.scope, rec.targetKey) && (
                                <span className="text-xs text-muted-foreground">
                                  {getScopeLabel(rec.scope, rec.targetKey)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-xs bg-muted">
                              {getCategoryLabel(rec.category)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                              Baja
                            </Badge>
                          </div>
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
              )}

              {recommendations.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay recomendaciones disponibles
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AIRecommendationsDrawer;
