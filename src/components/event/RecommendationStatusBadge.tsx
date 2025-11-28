import { Check, Circle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecommendationStatus } from "@/contexts/RecommendationStatusContext";
import { cn } from "@/lib/utils";

interface RecommendationStatusBadgeProps {
  status: RecommendationStatus;
  onStatusChange: (status: RecommendationStatus) => void;
}

export const RecommendationStatusBadge = ({ status, onStatusChange }: RecommendationStatusBadgeProps) => {
  const getStatusConfig = (s: RecommendationStatus) => {
    switch (s) {
      case 'pending':
        return {
          label: 'Pendiente',
          icon: Circle,
          className: 'bg-muted/50 text-muted-foreground hover:bg-muted border-muted'
        };
      case 'in_progress':
        return {
          label: 'En progreso',
          icon: PlayCircle,
          className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20'
        };
      case 'completed':
        return {
          label: 'Realizada',
          icon: Check,
          className: 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20'
        };
    }
  };

  const currentConfig = getStatusConfig(status);
  const StatusIcon = currentConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-7 gap-1.5 text-xs", currentConfig.className)}
        >
          <StatusIcon className="h-3 w-3" />
          {currentConfig.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onStatusChange('pending')} className="gap-2">
          <Circle className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Pendiente</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('in_progress')} className="gap-2">
          <PlayCircle className="h-3.5 w-3.5 text-blue-600" />
          <span>En progreso</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('completed')} className="gap-2">
          <Check className="h-3.5 w-3.5 text-green-600" />
          <span>Realizada</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
