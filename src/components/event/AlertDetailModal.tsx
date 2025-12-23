import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Users, FileDown, AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecommendationStatus } from "@/contexts/RecommendationStatusContext";
import { RecommendationStatusBadge } from "./RecommendationStatusBadge";

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

interface AlertDetailModalProps {
  recommendation: Recommendation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlertDetailModal = ({ recommendation, open, onOpenChange }: AlertDetailModalProps) => {
  const { getStatus, updateStatus } = useRecommendationStatus();

  if (!recommendation) return null;

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
        return null;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-lg leading-tight">
                {recommendation.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs h-5 px-2 gap-1">
                  {getCategoryIcon(recommendation.category)}
                  {getCategoryLabel(recommendation.category)}
                </Badge>
                <Badge variant="outline" className={cn(getPriorityColor(recommendation.priority), "text-xs h-5 px-2")}>
                  Prioridad: {getPriorityLabel(recommendation.priority)}
                </Badge>
                <RecommendationStatusBadge
                  status={getStatus(recommendation.id)}
                  onStatusChange={(status) => updateStatus(recommendation.id, status)}
                />
                {recommendation.targetKey && (
                  <Badge variant="secondary" className="text-xs h-5 px-2">
                    {recommendation.targetKey}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 py-2">
          {/* Full description */}
          <div className="space-y-2">
            <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
              {recommendation.description}
            </div>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(recommendation.id, 'in_progress')}
              disabled={getStatus(recommendation.id) === 'in_progress'}
              className="gap-2"
            >
              Marcar como en proceso
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(recommendation.id, 'completed')}
              disabled={getStatus(recommendation.id) === 'completed'}
              className="gap-2"
            >
              Marcar como completada
            </Button>
            {recommendation.scope !== 'global' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Ver segmento en Audiencia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Exportar CSV del segmento
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
