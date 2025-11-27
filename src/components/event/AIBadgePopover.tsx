import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Eye, Users, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AIBadge from "./AIBadge";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

interface AIBadgePopoverProps {
  count: number;
  criticalCount?: number;
  recommendations: Recommendation[];
  eventId: string;
  onOpenDrawer: () => void;
  className?: string;
}

const AIBadgePopover = ({
  count,
  criticalCount = 0,
  recommendations,
  eventId,
  onOpenDrawer,
  className,
}: AIBadgePopoverProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (count === 0) return null;

  // Get the top recommendation (highest priority)
  const topRecommendation = recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  })[0];

  // Create a short summary (first 120 chars)
  const summary = topRecommendation?.description.substring(0, 120) + 
    (topRecommendation?.description.length > 120 ? "..." : "");

  const handleViewDetails = () => {
    setOpen(false);
    onOpenDrawer();
  };

  const handleGoToAudience = () => {
    setOpen(false);
    // Navigate to audience with filters based on recommendation scope
    const filters = new URLSearchParams();
    if (topRecommendation?.scope === "provider" && topRecommendation?.targetKey) {
      filters.set("provider", topRecommendation.targetKey);
    } else if (topRecommendation?.scope === "channel" && topRecommendation?.targetKey) {
      filters.set("channel", topRecommendation.targetKey);
    } else if (topRecommendation?.scope === "zone" && topRecommendation?.targetKey) {
      filters.set("zone", topRecommendation.targetKey);
    } else if (topRecommendation?.scope === "ageSegment" && topRecommendation?.targetKey) {
      filters.set("ageSegment", topRecommendation.targetKey);
    } else if (topRecommendation?.scope === "city" && topRecommendation?.targetKey) {
      filters.set("city", topRecommendation.targetKey);
    }
    navigate(`/events/${eventId}/audience?${filters.toString()}`);
  };

  const handleExportCSV = async () => {
    setOpen(false);
    // TODO: Implement CSV export with filters
    // For now, just navigate to audience page which has export functionality
    handleGoToAudience();
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Crítica";
      case "medium":
        return "Importante";
      case "low":
        return "Sugerencia";
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "low":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("inline-block", className)}>
          <AIBadge
            count={count}
            criticalCount={criticalCount}
            onClick={() => setOpen(!open)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 animate-fade-in" align="start" side="bottom">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight mb-1">
                {topRecommendation?.title}
              </h4>
              <span className={cn(
                "text-xs font-medium",
                getPriorityColor(topRecommendation?.priority || "low")
              )}>
                {getPriorityLabel(topRecommendation?.priority || "low")}
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
              Ver detalle completo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleGoToAudience}
            >
              <Users className="h-4 w-4" />
              Ir a Audiencia con filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4" />
              Exportar CSV del segmento
            </Button>
          </div>

          {/* Additional recommendations indicator */}
          {count > 1 && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground text-center">
                +{count - 1} recomendación{count - 1 > 1 ? "es" : ""} más
              </p>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIBadgePopover;
