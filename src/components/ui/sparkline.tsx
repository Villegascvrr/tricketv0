import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

const Sparkline = ({ data, className, color = "hsl(var(--primary))" }: SparklineProps) => {
  // Transform data into recharts format
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

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
