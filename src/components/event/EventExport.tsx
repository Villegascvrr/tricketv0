import { Card } from "@/components/ui/card";

interface EventExportProps {
  eventId: string;
  eventName: string;
}

const EventExport = ({ eventId, eventName }: EventExportProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Módulo de Exportación - En desarrollo
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Aquí podrás exportar informes en PDF y Excel
        </p>
      </Card>
    </div>
  );
};

export default EventExport;
