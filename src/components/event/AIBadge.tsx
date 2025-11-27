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
        "gap-1.5 cursor-pointer hover:bg-primary/10 transition-colors",
        criticalCount > 0 && "border-danger text-danger",
        className
      )}
      onClick={onClick}
    >
      <Brain className="h-3.5 w-3.5" />
      <span className="font-medium">{count}</span>
      {criticalCount > 0 && (
        <span className="text-xs">({criticalCount} críticas)</span>
      )}
    </Badge>
  );
};

export default AIBadge;
