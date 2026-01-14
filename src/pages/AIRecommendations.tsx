import { useState } from "react";
import { Brain, MessageCircle, Sparkles, AlertTriangle, TrendingUp, DollarSign, Users, Radio, Tag, CheckCircle2, Clock, Circle, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AIRecommendationsDrawer from "@/components/event/AIRecommendationsDrawer";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import { AlertDetailModal } from "@/components/event/AlertDetailModal";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRecommendationStatus, RecommendationStatus } from "@/contexts/RecommendationStatusContext";
import { cn } from "@/lib/utils";

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
}

const AIRecommendations = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('all');

  const { config: festivalData, isDemo } = useFestivalConfig();
  const { getStatus, updateStatus } = useRecommendationStatus();
  const recommendations = generateAIRecommendations(festivalData);

  // Filter by status
  const filteredRecommendations = recommendations.filter(rec => {
    if (statusFilter === 'all') return true;
    return getStatus(rec.id) === statusFilter;
  });

  // Group by priority
  const criticalRecs = filteredRecommendations.filter((r) => r.priority === 'high');
  const importantRecs = filteredRecommendations.filter((r) => r.priority === 'medium');
  const suggestionRecs = filteredRecommendations.filter((r) => r.priority === 'low');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <TrendingUp className="h-3.5 w-3.5" />;
      case 'pricing':
        return <DollarSign className="h-3.5 w-3.5" />;
      case 'alert':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'operations':
        return <Radio className="h-3.5 w-3.5" />;
      default:
        return <Sparkles className="h-3.5 w-3.5" />;
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
      case 'operations':
        return 'Operaciones';
      default:
        return category;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'global':
        return 'Global';
      case 'provider':
        return 'Canal';
      case 'channel':
        return 'Canal';
      case 'zone':
        return 'Zona';
      case 'ageSegment':
        return 'Audiencia';
      case 'city':
        return 'Ciudad';
      default:
        return scope;
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global':
        return <Radio className="h-3 w-3" />;
      case 'provider':
      case 'channel':
        return <Tag className="h-3 w-3" />;
      case 'zone':
        return <Radio className="h-3 w-3" />;
      case 'ageSegment':
        return <Users className="h-3 w-3" />;
      default:
        return <Tag className="h-3 w-3" />;
    }
  };

  const getStatusConfig = (status: RecommendationStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', icon: Circle, className: 'bg-muted text-muted-foreground' };
      case 'in_progress':
        return { label: 'En progreso', icon: Clock, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
      case 'completed':
        return { label: 'Realizada', icon: CheckCircle2, className: 'bg-green-500/10 text-green-600 dark:text-green-400' };
      default:
        return { label: 'Pendiente', icon: Circle, className: 'bg-muted text-muted-foreground' };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const RecommendationCard = ({ rec, variant }: { rec: Recommendation; variant: 'critical' | 'important' | 'suggestion' }) => {
    const status = getStatus(rec.id);
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    const borderClass = variant === 'critical'
      ? 'border-l-4 border-l-destructive'
      : variant === 'important'
        ? 'border-l-4 border-l-warning'
        : 'border-l-4 border-l-blue-400';

    // Extraer la acción del final de la descripción
    const actionMatch = rec.description.match(/Acción[^:]*:\s*(.+)$/s);
    const action = actionMatch ? actionMatch[1].trim() : '';

    // Extraer contexto (todo antes de la acción)
    const contextMatch = rec.description.match(/^([\s\S]*?)(?:Acción[^:]*:)/);
    const context = contextMatch ? contextMatch[1].trim() : rec.description;

    return (
      <Card
        className={cn(
          "hover:shadow-md transition-all cursor-pointer group",
          borderClass
        )}
        onClick={() => setSelectedRecommendation(rec)}
      >
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm font-semibold leading-tight flex-1">
              {rec.title}
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          {/* Rule that triggered this recommendation */}
          {rec.rule && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 border-l-2 border-primary/40">
              <span className="font-medium">Regla:</span> {rec.rule}
            </div>
          )}

          {/* Data point */}
          {rec.dataPoint && (
            <div className="mt-1.5 text-xs font-medium text-primary">
              📊 {rec.dataPoint}
            </div>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {/* Category tag */}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 gap-1 font-normal">
              {getCategoryIcon(rec.category)}
              {getCategoryLabel(rec.category)}
            </Badge>

            {/* Scope tag */}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 gap-1 font-normal">
              {getScopeIcon(rec.scope)}
              {getScopeLabel(rec.scope)}
              {rec.targetKey && <span className="font-medium">· {rec.targetKey}</span>}
            </Badge>

            {/* Priority tag */}
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-5 font-normal",
                variant === 'critical' && "bg-destructive/10 text-destructive border-destructive/20",
                variant === 'important' && "bg-warning/10 text-warning border-warning/20",
                variant === 'suggestion' && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              )}
            >
              {getPriorityLabel(rec.priority)}
            </Badge>

            {/* Status tag */}
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-5 gap-1 font-normal", statusConfig.className)}
              onClick={(e) => {
                e.stopPropagation();
                const nextStatus: RecommendationStatus =
                  status === 'pending' ? 'in_progress' :
                    status === 'in_progress' ? 'completed' : 'pending';
                updateStatus(rec.id, nextStatus);
              }}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-2">
          {/* Context / Why this recommendation */}
          <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {context}
          </div>

          {/* Action */}
          {action && (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
              <p className="text-xs text-primary font-medium mb-1">Acción recomendada:</p>
              <p className="text-sm leading-relaxed">{action}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SectionHeader = ({
    title,
    count,
    icon: Icon,
    variant
  }: {
    title: string;
    count: number;
    icon: React.ElementType;
    variant: 'critical' | 'important' | 'suggestion'
  }) => {
    const colorClass = variant === 'critical'
      ? 'text-destructive'
      : variant === 'important'
        ? 'text-warning'
        : 'text-blue-500';

    return (
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("h-5 w-5", colorClass)} />
        <h2 className="text-lg font-bold">{title}</h2>
        <Badge
          variant="secondary"
          className={cn(
            "text-xs",
            variant === 'critical' && "bg-destructive/10 text-destructive",
            variant === 'important' && "bg-warning/10 text-warning",
            variant === 'suggestion' && "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          )}
        >
          {count}
        </Badge>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Recomendaciones IA
            </h1>
            <p className="text-muted-foreground">
              Alertas y sugerencias inteligentes para optimizar el Primaverando 2025
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setChatOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat con IA
            </Button>
            <Button
              onClick={() => setDrawerOpen(true)}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              Centro de Alertas
              {criticalRecs.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {criticalRecs.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-destructive font-medium">Críticas</p>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{criticalRecs.length}</div>
              <p className="text-xs text-destructive/80 mt-1">Requieren acción inmediata</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-warning font-medium">Importantes</p>
                <Sparkles className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{importantRecs.length}</div>
              <p className="text-xs text-warning/80 mt-1">Oportunidades de mejora</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Sugerencias</p>
                <Brain className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{suggestionRecs.length}</div>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">Optimizaciones opcionales</p>
            </CardContent>
          </Card>
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
            Todas ({recommendations.length})
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

        {/* Critical Section */}
        {criticalRecs.length > 0 && (
          <div>
            <SectionHeader title="Críticas" count={criticalRecs.length} icon={AlertTriangle} variant="critical" />
            <div className="grid gap-4 md:grid-cols-2">
              {criticalRecs.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} variant="critical" />
              ))}
            </div>
          </div>
        )}

        {/* Important Section */}
        {importantRecs.length > 0 && (
          <div>
            <SectionHeader title="Importantes" count={importantRecs.length} icon={Sparkles} variant="important" />
            <div className="grid gap-4 md:grid-cols-2">
              {importantRecs.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} variant="important" />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {suggestionRecs.length > 0 && (
          <div>
            <SectionHeader title="Sugerencias" count={suggestionRecs.length} icon={Brain} variant="suggestion" />
            <div className="grid gap-4 md:grid-cols-2">
              {suggestionRecs.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} variant="suggestion" />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No hay recomendaciones con este filtro</p>
              <p className="text-sm text-muted-foreground">
                Cambia el filtro de estado para ver más recomendaciones
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AIRecommendationsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendations={recommendations}
        isLoading={false}
        eventName={festivalData.nombre}
        eventDate={format(new Date("2025-03-29"), "d 'de' MMMM 'de' yyyy", { locale: es })}
        onRefresh={() => { }}
      />

      <EventChatDrawer
        eventId="demo-primaverando-2025"
        eventName={festivalData.nombre}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={isDemo}
      />

      <AlertDetailModal
        recommendation={selectedRecommendation}
        open={!!selectedRecommendation}
        onOpenChange={(open) => !open && setSelectedRecommendation(null)}
      />
    </div>
  );
};

export default AIRecommendations;