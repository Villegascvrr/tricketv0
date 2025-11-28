import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, BookOpen, MessageCircle, Mail, ExternalLink } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Ayuda & Feedback
            </h1>
            <p className="text-muted-foreground">
              Encuentra respuestas y comparte tus sugerencias
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Documentación</CardTitle>
              <CardDescription>
                Guías completas y tutoriales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                Ver Documentación
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Centro de Ayuda</CardTitle>
              <CardDescription>
                Preguntas frecuentes y soluciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                Ir al Centro de Ayuda
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Soporte Directo</CardTitle>
              <CardDescription>
                Contacta con nuestro equipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                Enviar Email
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enviar Feedback</CardTitle>
            <CardDescription>
              Tus comentarios nos ayudan a mejorar Tricket Brain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Tipo de Feedback</Label>
              <select
                id="feedback-type"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Sugerencia de mejora</option>
                <option>Reporte de error</option>
                <option>Nueva funcionalidad</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-subject">Asunto</Label>
              <Input
                id="feedback-subject"
                placeholder="Describe brevemente tu feedback"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Mensaje</Label>
              <Textarea
                id="feedback-message"
                placeholder="Cuéntanos más detalles..."
                rows={6}
              />
            </div>

            <Button className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Enviar Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Common Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                q: "¿Cómo importo datos de mis ticketeras?",
                a: "Ve a la sección de Integraciones y conecta tus ticketeras. Luego podrás importar datos directamente desde cada evento.",
              },
              {
                q: "¿Qué significa cada prioridad en las alertas IA?",
                a: "Las alertas críticas requieren acción inmediata, las de prioridad media son importantes pero no urgentes, y las bajas son sugerencias de optimización.",
              },
              {
                q: "¿Puedo exportar los informes?",
                a: "Sí, desde cada evento puedes exportar informes en PDF con todos los datos y recomendaciones.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                <p className="font-semibold mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
