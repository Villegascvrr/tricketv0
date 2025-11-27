import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({ value, max, className, showLabel = true }: ProgressBarProps) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const getColorClass = (percent: number) => {
    if (percent >= 70) return "bg-success";
    if (percent >= 30) return "bg-warning";
    return "bg-danger";
  };

  const getBgColorClass = (percent: number) => {
    if (percent >= 70) return "bg-success/10";
    if (percent >= 30) return "bg-warning/10";
    return "bg-danger/10";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn(
        "relative h-2 w-full rounded-full overflow-hidden",
        getBgColorClass(clampedPercentage)
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            getColorClass(clampedPercentage)
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value.toLocaleString()}</span>
          <span className={cn(
            "font-semibold",
            clampedPercentage >= 70 ? "text-success" :
            clampedPercentage >= 30 ? "text-warning" : "text-danger"
          )}>
            {clampedPercentage.toFixed(1)}%
          </span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
