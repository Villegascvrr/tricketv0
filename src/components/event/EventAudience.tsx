import { Card } from "@/components/ui/card";

interface EventAudienceProps {
  eventId: string;
}

const EventAudience = ({ eventId }: EventAudienceProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Módulo de Audiencia - En desarrollo
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Aquí verás distribución geográfica, rangos de edad y exportación de segmentos
        </p>
      </Card>
    </div>
  );
};

export default EventAudience;
