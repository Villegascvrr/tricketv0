import PageBreadcrumb from "@/components/PageBreadcrumb";
import WeatherConditionsSection from "@/components/marketing/WeatherConditionsSection";

const WeatherConditions = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageBreadcrumb items={[{ label: "Condiciones Externas – Clima" }]} />
        
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground mb-0.5">
            Condiciones Externas – Clima
          </h1>
          <p className="text-xs text-muted-foreground">
            Previsión meteorológica, histórico y análisis de impacto en el festival
          </p>
        </div>

        <WeatherConditionsSection />
      </div>
    </div>
  );
};

export default WeatherConditions;
