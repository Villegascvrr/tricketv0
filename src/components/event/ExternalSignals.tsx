import { TrendingUp, Mail, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExternalSignals = () => {
  const navigate = useNavigate();

  const signals = [
    {
      icon: <TrendingUp className="h-3.5 w-3.5 text-blue-500" />,
      label: "Trends",
      value: "+23%",
      detail: "Madrid",
      color: "text-green-500"
    },
    {
      icon: <span className="text-sm">☀️</span>,
      label: "Clima",
      value: "22°C",
      detail: "Favorable",
      color: "text-green-500"
    },
    {
      icon: <Mail className="h-3.5 w-3.5 text-purple-500" />,
      label: "Email",
      value: "4.2%",
      detail: "Mejor canal",
      color: "text-foreground"
    }
  ];

  return (
    <div 
      onClick={() => navigate("/integrations")}
      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 bg-card hover:bg-muted/40 cursor-pointer transition-all group"
    >
      <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">Señales externas</span>
      
      <div className="flex items-center gap-4 flex-1">
        {signals.map((signal, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {signal.icon}
            <span className="text-[11px] text-muted-foreground">{signal.label}</span>
            <span className={`text-[11px] font-semibold ${signal.color}`}>{signal.value}</span>
          </div>
        ))}
      </div>

      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
  );
};

export default ExternalSignals;
