import { useState } from "react";
import { Brain, MessageCircle, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventRecommendations from "@/components/event/EventRecommendations";
import AIRecommendationsDrawer from "@/components/event/AIRecommendationsDrawer";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import { festivalData } from "@/data/festivalData";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AIRecommendations = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const recommendations = generateAIRecommendations();
  const criticalCount = recommendations.filter((r: any) => r.priority === 'high').length;
  const importantCount = recommendations.filter((r: any) => r.priority === 'medium').length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Recomendaciones IA
            </h1>
            <p className="text-muted-foreground">
              Alertas y sugerencias inteligentes para optimizar el Primaverando 2025
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setChatOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat con IA
            </Button>
            <Button 
              onClick={() => setDrawerOpen(true)}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              Centro de Alertas
              {criticalCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {criticalCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-destructive">Alertas Críticas</CardDescription>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
              <p className="text-xs text-destructive/80 mt-1">Requieren acción inmediata</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-warning">Importantes</CardDescription>
                <Sparkles className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{importantCount}</div>
              <p className="text-xs text-warning/80 mt-1">Oportunidades de mejora</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Recomendaciones</CardDescription>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Generadas por IA</p>
            </CardContent>
          </Card>
        </div>

        <EventRecommendations 
          eventId="demo-primaverando-2025"
          recommendations={recommendations}
          isLoading={false}
          onRefresh={() => {}}
        />
      </div>

      <AIRecommendationsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendations={recommendations}
        isLoading={false}
        eventName={festivalData.nombre}
        eventDate={format(new Date("2025-03-29"), "d 'de' MMMM 'de' yyyy", { locale: es })}
        onRefresh={() => {}}
      />

      <EventChatDrawer
        eventId="demo-primaverando-2025"
        eventName={festivalData.nombre}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={true}
      />
    </div>
  );
};

export default AIRecommendations;