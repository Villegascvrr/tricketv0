import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  count: number;
  criticalCount?: number;
  onClick?: () => void;
  className?: string;
}

const AIBadge = ({ count, criticalCount = 0, onClick, className }: AIBadgeProps) => {
  if (count === 0) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 cursor-pointer hover:bg-primary/10 hover:scale-105 transition-all",
        criticalCount > 0 && "border-danger/50 bg-danger/10 text-danger animate-fade-in hover:bg-danger/15",
        criticalCount === 0 && "border-primary/30 text-primary",
        className
      )}
      onClick={onClick}
    >
      <Brain className="h-3.5 w-3.5" />
      <span className="font-semibold text-xs">{count}</span>
      {criticalCount > 0 && (
        <span className="text-xs font-semibold animate-scale-in">· {criticalCount} crítica{criticalCount > 1 ? 's' : ''}</span>
      )}
    </Badge>
  );
};

export default AIBadge;
