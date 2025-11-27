import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      index: number;
      value: number;
      day: string;
    };
  }>;
}

const Sparkline = ({ data, className, color = "hsl(var(--primary))" }: SparklineProps) => {
  // Get last 7 days labels
  const getDayLabel = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - daysAgo));
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Transform data into recharts format
  const chartData = data.map((value, index) => ({
    index,
    value,
    day: getDayLabel(index),
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-md">
          <p className="text-xs font-medium text-foreground mb-1">{data.day}</p>
          <p className="text-sm font-semibold text-primary">
            {data.value} {data.value === 1 ? "entrada" : "entradas"}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine trend color based on data
  const getTrendColor = () => {
    if (data.length < 2) return color;
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const trend = lastValue - firstValue;
    
    if (trend > 0) return "hsl(var(--success))"; // Upward trend
    if (trend < 0) return "hsl(var(--danger))"; // Downward trend
    return color; // Flat trend
  };

  const trendColor = getTrendColor();

  return (
    <div className={cn("w-full h-8", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: trendColor, strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
