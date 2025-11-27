import { Card } from "@/components/ui/card";

interface EventRecommendationsProps {
  eventId: string;
}

const EventRecommendations = ({ eventId }: EventRecommendationsProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Módulo de Recomendaciones IA - En desarrollo
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Aquí verás recomendaciones automáticas de marketing, pricing y alertas
        </p>
      </Card>
    </div>
  );
};

export default EventRecommendations;
