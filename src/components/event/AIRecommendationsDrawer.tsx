import { useState } from "react";
import { Brain, AlertCircle, TrendingUp, DollarSign, X, Filter, Download, RefreshCw, CloudSun, Mail, BarChart3, Settings } from "lucide-react";
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
import { useRecommendationStatus } from "@/contexts/RecommendationStatusContext";
import { RecommendationStatusBadge } from "./RecommendationStatusBadge";
import { AlertDetailModal } from "./AlertDetailModal";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert" | "operations";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
  rule?: string;
  dataPoint?: string;
  source?: "ventas" | "marketing" | "trends" | "clima" | "email" | "operations";
}

interface AIRecommendationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: Recommendation[];
  isLoading: boolean;
  eventName?: string;
  eventDate?: string;
  onRefresh?: () => void;
  context?: {
    type: 'provider' | 'zone' | 'ageSegment' | 'global';
    value: string;
  };
}

const AIRecommendationsDrawer = ({ 
  open, 
  onOpenChange, 
  recommendations,
  isLoading,
  eventName = "Evento",
  eventDate = new Date().toLocaleDateString("es-ES"),
  onRefresh,
  context
}: AIRecommendationsDrawerProps) => {
  const [priorityFilter, setPriorityFilter] = useState<"high" | "medium" | "low" | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"marketing" | "pricing" | "alert" | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const { toast } = useToast();
  const { getStatus, updateStatus } = useRecommendationStatus();
  
  // Extract action from description (looks for "🎯 Acción sugerida:" line)
  const extractAction = (description: string): string => {
    const lines = description.split('\n');
    const actionLine = lines.find(line => line.includes('🎯 Acción sugerida:'));
    if (actionLine) {
      return actionLine.replace('🎯 Acción sugerida:', '').trim();
    }
    // Fallback: return first line or truncated description
    return lines[0]?.substring(0, 80) + '...' || '';
  };

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

  const getSourceConfig = (source?: string) => {
    switch (source) {
      case 'ventas':
        return { label: 'Ventas', icon: BarChart3, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'marketing':
        return { label: 'Marketing', icon: TrendingUp, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      case 'trends':
        return { label: 'Trends', icon: TrendingUp, color: 'bg-green-500/10 text-green-600 border-green-500/20' };
      case 'clima':
        return { label: 'Clima', icon: CloudSun, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' };
      case 'email':
        return { label: 'Email', icon: Mail, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      case 'operations':
        return { label: 'Ops', icon: Settings, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
      default:
        return { label: 'Sistema', icon: Brain, color: 'bg-muted text-muted-foreground border-border' };
    }
  };

  // Apply filters including context filter
  const filteredRecommendations = recommendations.filter(r => {
    if (priorityFilter && r.priority !== priorityFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    
    // Apply context filter if present
    if (context) {
      if (context.type === 'provider' && r.scope === 'provider') {
        return r.targetKey === context.value;
      } else if (context.type === 'zone' && r.scope === 'zone') {
        return r.targetKey === context.value;
      } else if (context.type === 'ageSegment' && r.scope === 'ageSegment') {
        return r.targetKey === context.value;
      } else if (context.type === 'global') {
        return r.scope === 'global';
      }
      return false;
    }
    
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
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <SheetTitle className="text-base">Centro de Alertas IA</SheetTitle>
              {context && (
                <Badge variant="outline" className="text-xs">
                  {context.value}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="h-7 px-2 gap-1"
                >
                  <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                </Button>
              )}
              {!isLoading && recommendations.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportPDF}
                  className="h-7 px-2 gap-1"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <X className="h-3 w-3" />
                </Button>
              </SheetClose>
            </div>
          </div>
          {!isLoading && (
            <div className="flex gap-1.5 pt-1.5">
              {recommendations.filter(r => r.priority === 'high').length > 0 && (
                <Badge variant="outline" className="text-xs h-5 px-1.5 bg-danger/10 text-danger border-danger/20">
                  {recommendations.filter(r => r.priority === 'high').length} críticas
                </Badge>
              )}
              {recommendations.filter(r => r.priority === 'medium').length > 0 && (
                <Badge variant="outline" className="text-xs h-5 px-1.5 bg-warning/10 text-warning border-warning/20">
                  {recommendations.filter(r => r.priority === 'medium').length} importantes
                </Badge>
              )}
              {recommendations.filter(r => r.priority === 'low').length > 0 && (
                <Badge variant="outline" className="text-xs h-5 px-1.5 bg-primary/10 text-primary border-primary/20">
                  {recommendations.filter(r => r.priority === 'low').length} sugerencias
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        {/* Filters Section - Compact Toolbar */}
        {!isLoading && recommendations.length > 0 && (
          <div className="px-6 py-2 border-b bg-muted/30">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="h-6 px-2 gap-1.5 text-xs"
              >
                <Filter className="h-3 w-3" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="h-4 px-1 text-xs ml-1">
                    {(priorityFilter ? 1 : 0) + (categoryFilter ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              {filtersVisible && (
                <div className="flex items-center gap-2 flex-1">
                  {/* Priority Filters */}
                  <div className="flex gap-1">
                    <Button
                      variant={priorityFilter === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriorityFilter(priorityFilter === "high" ? null : "high")}
                      className={cn(
                        "h-6 px-2 text-xs",
                        priorityFilter === "high" && "bg-danger hover:bg-danger/90 text-white border-danger"
                      )}
                    >
                      Alta
                    </Button>
                    <Button
                      variant={priorityFilter === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriorityFilter(priorityFilter === "medium" ? null : "medium")}
                      className={cn(
                        "h-6 px-2 text-xs",
                        priorityFilter === "medium" && "bg-warning hover:bg-warning/90 text-white border-warning"
                      )}
                    >
                      Media
                    </Button>
                    <Button
                      variant={priorityFilter === "low" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriorityFilter(priorityFilter === "low" ? null : "low")}
                      className={cn(
                        "h-6 px-2 text-xs",
                        priorityFilter === "low" && "bg-primary hover:bg-primary/90 text-white"
                      )}
                    >
                      Baja
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-4" />

                  {/* Category Filters */}
                  <div className="flex gap-1">
                    <Button
                      variant={categoryFilter === "marketing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(categoryFilter === "marketing" ? null : "marketing")}
                      className="h-6 px-2 text-xs"
                    >
                      Marketing
                    </Button>
                    <Button
                      variant={categoryFilter === "pricing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(categoryFilter === "pricing" ? null : "pricing")}
                      className="h-6 px-2 text-xs"
                    >
                      Pricing
                    </Button>
                    <Button
                      variant={categoryFilter === "alert" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(categoryFilter === "alert" ? null : "alert")}
                      className="h-6 px-2 text-xs"
                    >
                      Alerta
                    </Button>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 px-2 text-xs ml-auto"
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-7rem)]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-3">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {/* Critical Recommendations */}
              {groupedRecommendations.high.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-danger flex items-center gap-1.5 px-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Críticas ({groupedRecommendations.high.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupedRecommendations.high.map((rec, index) => (
                      <Card 
                        key={rec.id}
                        className={cn(
                          "border hover:shadow-md transition-all animate-fade-in cursor-pointer",
                          "border-danger/30 bg-danger/5"
                        )}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <CardHeader className="p-3 pb-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-xs leading-tight flex-1">
                              {rec.title}
                            </CardTitle>
                            <div className="flex gap-1 flex-shrink-0">
                              {rec.source && (
                                <Badge variant="outline" className={cn("text-[10px] h-4 px-1", getSourceConfig(rec.source).color)}>
                                  {getSourceConfig(rec.source).label}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs h-4 px-1 bg-muted">
                                {getCategoryLabel(rec.category)}
                              </Badge>
                              <Badge variant="outline" className={cn(getPriorityColor(rec.priority), "text-xs h-4 px-1")}>
                                Alta
                              </Badge>
                              <RecommendationStatusBadge
                                status={getStatus(rec.id)}
                                onStatusChange={(status) => {
                                  updateStatus(rec.id, status);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            🎯 Acción: {extractAction(rec.description)}
                          </p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Recommendations */}
              {groupedRecommendations.medium.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-warning flex items-center gap-1.5 px-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Importantes ({groupedRecommendations.medium.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupedRecommendations.medium.map((rec, index) => (
                      <Card 
                        key={rec.id}
                        className="border hover:shadow-md transition-all animate-fade-in cursor-pointer"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <CardHeader className="p-3 pb-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-xs leading-tight flex-1">
                              {rec.title}
                            </CardTitle>
                            <div className="flex gap-1 flex-shrink-0">
                              {rec.source && (
                                <Badge variant="outline" className={cn("text-[10px] h-4 px-1", getSourceConfig(rec.source).color)}>
                                  {getSourceConfig(rec.source).label}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs h-4 px-1 bg-muted">
                                {getCategoryLabel(rec.category)}
                              </Badge>
                              <Badge variant="outline" className={cn(getPriorityColor(rec.priority), "text-xs h-4 px-1")}>
                                Media
                              </Badge>
                              <RecommendationStatusBadge
                                status={getStatus(rec.id)}
                                onStatusChange={(status) => {
                                  updateStatus(rec.id, status);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            🎯 Acción: {extractAction(rec.description)}
                          </p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority Recommendations */}
              {/* Suggestions */}
              {groupedRecommendations.low.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5 px-1">
                    <Brain className="h-3.5 w-3.5" />
                    Sugerencias ({groupedRecommendations.low.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupedRecommendations.low.map((rec, index) => (
                      <Card 
                        key={rec.id}
                        className="border hover:shadow-md transition-all animate-fade-in cursor-pointer"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <CardHeader className="p-3 pb-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-xs leading-tight flex-1">
                              {rec.title}
                            </CardTitle>
                            <div className="flex gap-1 flex-shrink-0">
                              <Badge variant="outline" className="text-xs h-4 px-1 bg-muted">
                                {getCategoryLabel(rec.category)}
                              </Badge>
                              <Badge variant="outline" className={cn(getPriorityColor(rec.priority), "text-xs h-4 px-1")}>
                                Baja
                              </Badge>
                              <RecommendationStatusBadge
                                status={getStatus(rec.id)}
                                onStatusChange={(status) => {
                                  updateStatus(rec.id, status);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            🎯 Acción: {extractAction(rec.description)}
                          </p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredRecommendations.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  {hasActiveFilters ? (
                    <>
                      <Filter className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-xs text-muted-foreground mb-2">
                        No hay recomendaciones con los filtros seleccionados
                      </p>
                      <Button variant="link" onClick={clearFilters} className="text-xs h-6">
                        Limpiar filtros
                      </Button>
                    </>
                  ) : recommendations.length === 0 ? (
                    <>
                      <Brain className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-xs text-muted-foreground">
                        Aún no hay suficientes datos para generar alertas inteligentes.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Importa ventas o conecta ticketeras para ver análisis en tiempo real.
                      </p>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>

      <AlertDetailModal 
        recommendation={selectedRecommendation}
        open={!!selectedRecommendation}
        onOpenChange={(open) => !open && setSelectedRecommendation(null)}
      />
    </Sheet>
  );
};

export default AIRecommendationsDrawer;
