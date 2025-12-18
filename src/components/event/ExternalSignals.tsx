import { TrendingUp, CloudSun, Mail, Target, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ExternalSignals = () => {
  // Mock data - would come from real integrations
  const signals = {
    trends: {
      trend: "up" as const,
      change: "+23%",
      region: "Madrid",
      description: "Interés creciente"
    },
    weather: {
      icon: "☀️",
      temp: "22°C",
      description: "Soleado",
      impact: "favorable"
    },
    bestChannel: {
      name: "Email",
      conversion: "4.2%",
      vsAvg: "+1.8%"
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Señales Externas</h3>
          </div>
          <Badge variant="outline" className="text-[10px] h-5">
            Actualizado hace 2h
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Google Trends */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-foreground truncate">Trends</span>
                <span className="text-xs font-semibold text-green-500">{signals.trends.change}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                {signals.trends.description} en {signals.trends.region}
              </p>
            </div>
          </div>

          {/* Weather */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{signals.weather.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-foreground">{signals.weather.temp}</span>
                <span className="text-xs text-muted-foreground">{signals.weather.description}</span>
              </div>
              <p className="text-[10px] text-green-500 truncate">
                Clima favorable
              </p>
            </div>
          </div>

          {/* Best Channel */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-purple-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-foreground">{signals.bestChannel.name}</span>
                <span className="text-xs font-semibold text-green-500">{signals.bestChannel.vsAvg}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                Mejor conversión: {signals.bestChannel.conversion}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalSignals;
