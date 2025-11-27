import { useState } from "react";
import { Brain, AlertCircle, TrendingUp, DollarSign, X, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { exportRecommendationsToPDF } from "@/lib/exportRecommendationsPDF";
import { useToast } from "@/hooks/use-toast";

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
  eventName?: string;
  eventDate?: string;
}

const AIRecommendationsDrawer = ({ 
  open, 
  onOpenChange, 
  recommendations,
  isLoading,
  eventName = "Evento",
  eventDate = new Date().toLocaleDateString("es-ES")
}: AIRecommendationsDrawerProps) => {
  const [priorityFilter, setPriorityFilter] = useState<"high" | "medium" | "low" | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"marketing" | "pricing" | "alert" | null>(null);
  const { toast } = useToast();
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

  // Apply filters
  const filteredRecommendations = recommendations.filter(r => {
    if (priorityFilter && r.priority !== priorityFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    return true;
  });

  const groupedRecommendations = {
    high: filteredRecommendations.filter(r => r.priority === 'high'),
    medium: filteredRecommendations.filter(r => r.priority === 'medium'),
    low: filteredRecommendations.filter(r => r.priority === 'low'),
  };

  const hasActiveFilters = priorityFilter !== null || categoryFilter !== null;
  const clearFilters = () => {
    setPriorityFilter(null);
    setCategoryFilter(null);
  };

  const handleExportPDF = () => {
    try {
      exportRecommendationsToPDF(recommendations, eventName, eventDate);
      toast({
        title: "PDF exportado",
        description: "Las recomendaciones se han exportado correctamente.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el PDF. Intenta de nuevo.",
        variant: "destructive",
      });
    }
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
            <div className="flex items-center gap-2">
              {!isLoading && recommendations.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="h-8 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>
          {!isLoading && (
            <div className="flex gap-2 pt-2">
              {recommendations.filter(r => r.priority === 'high').length > 0 && (
                <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
                  {recommendations.filter(r => r.priority === 'high').length} críticas
                </Badge>
              )}
              {recommendations.filter(r => r.priority === 'medium').length > 0 && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  {recommendations.filter(r => r.priority === 'medium').length} importantes
                </Badge>
              )}
              {recommendations.filter(r => r.priority === 'low').length > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {recommendations.filter(r => r.priority === 'low').length} sugerencias
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        {/* Filters Section */}
        {!isLoading && recommendations.length > 0 && (
          <div className="px-6 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 text-xs"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Priority Filters */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Prioridad</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={priorityFilter === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter(priorityFilter === "high" ? null : "high")}
                  className={cn(
                    "h-8 text-xs",
                    priorityFilter === "high" && "bg-danger hover:bg-danger/90 text-white border-danger"
                  )}
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Alta
                </Button>
                <Button
                  variant={priorityFilter === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter(priorityFilter === "medium" ? null : "medium")}
                  className={cn(
                    "h-8 text-xs",
                    priorityFilter === "medium" && "bg-warning hover:bg-warning/90 text-white border-warning"
                  )}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Media
                </Button>
                <Button
                  variant={priorityFilter === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter(priorityFilter === "low" ? null : "low")}
                  className={cn(
                    "h-8 text-xs",
                    priorityFilter === "low" && "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  <Brain className="h-3 w-3 mr-1" />
                  Baja
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Categoría</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === "marketing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(categoryFilter === "marketing" ? null : "marketing")}
                  className="h-8 text-xs"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Marketing
                </Button>
                <Button
                  variant={categoryFilter === "pricing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(categoryFilter === "pricing" ? null : "pricing")}
                  className="h-8 text-xs"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Pricing
                </Button>
                <Button
                  variant={categoryFilter === "alert" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(categoryFilter === "alert" ? null : "alert")}
                  className="h-8 text-xs"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Alerta
                </Button>
              </div>
            </div>

            <Separator />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-8rem)]">
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
                        "border-2 hover:shadow-md transition-shadow animate-fade-in",
                        "border-danger/30 bg-danger/5"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
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
                            <Badge variant="outline" className="text-xs bg-muted animate-scale-in" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                              {getCategoryLabel(rec.category)}
                            </Badge>
                            <Badge variant="outline" className={cn(getPriorityColor(rec.priority), "animate-scale-in")} style={{ animationDelay: `${index * 0.1 + 0.15}s` }}>
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
                      className="border hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
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
                      className="border hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
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

              {filteredRecommendations.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  {hasActiveFilters ? (
                    <>
                      <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No hay recomendaciones con los filtros seleccionados
                      </p>
                      <Button variant="link" onClick={clearFilters} className="text-xs">
                        Limpiar filtros
                      </Button>
                    </>
                  ) : (
                    <>
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No hay recomendaciones disponibles
                      </p>
                    </>
                  )}
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
