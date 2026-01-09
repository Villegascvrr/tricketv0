import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NewEvent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a eventos
        </Button>

        <Card className="p-8 text-center">
          <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings2 className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Configuración de nuevos eventos
          </h1>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            La creación y configuración de eventos es gestionada por el equipo de Tricket 
            como parte de nuestro servicio de consultoría personalizada.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2">¿Cómo funciona?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Contacta a tu account manager de Tricket con los detalles del nuevo evento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Nuestro equipo configura el evento, integraciones y fuentes de datos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Una vez listo, el evento aparecerá automáticamente en tu panel.</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            ¿Tienes dudas? Escríbenos a <span className="font-medium">soporte@tricket.io</span>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default NewEvent;