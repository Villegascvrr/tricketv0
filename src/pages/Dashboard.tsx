import { useState } from "react";
import { Upload, Brain, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EventSummary from "@/components/event/EventSummary";
import EventAudience from "@/components/event/EventAudience";
import EventExport from "@/components/event/EventExport";
import EventRecommendations from "@/components/event/EventRecommendations";
import TicketProviderManager from "@/components/event/TicketProviderManager";
import AIRecommendationsDrawer from "@/components/event/AIRecommendationsDrawer";
import ExecutiveDashboard from "@/components/event/ExecutiveDashboard";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import FestivalStatusOverview from "@/components/event/FestivalStatusOverview";
import { festivalData } from "@/data/festivalData";
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";

// Primaverando Festival 2025 - Single event configuration
const PRIMAVERANDO_EVENT = {
  id: "demo-primaverando-2025",
  name: festivalData.nombre,
  type: "Festival",
  venue: festivalData.ubicacion,
  start_date: "2025-03-29",
  end_date: "2025-03-29",
  total_capacity: festivalData.aforoTotal,
};

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Generate local recommendations
  const recommendations = generateAIRecommendations();
  const criticalCount = recommendations.filter((r: any) => r.priority === 'high').length;

  const event = PRIMAVERANDO_EVENT;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header with Festival Image - Compact */}
      <div className="relative h-36 md:h-44 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 gradient-festival opacity-30" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-sm">
                  {event.name}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary text-primary-foreground rounded-full shadow-md">
                  Command Center
                </span>
              </div>
              <div className="flex gap-3 text-xs text-foreground/80">
                <span className="font-medium">{event.venue}</span>
                <span>
                  {format(new Date(event.start_date), "d MMM yyyy", { locale: es })}
                </span>
                {event.total_capacity && (
                  <span>Aforo: {event.total_capacity.toLocaleString()}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setChatOpen(true)}
                size="sm"
                className="h-7 px-3 gap-1.5 rounded-full text-xs font-medium bg-card text-foreground hover:bg-card/90 shadow-lg transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat IA
              </Button>
              <Button 
                onClick={() => setDrawerOpen(true)}
                size="sm"
                className="h-7 px-3 gap-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg transition-all"
              >
                <Brain className="h-3.5 w-3.5" />
                {recommendations.length} Recomendaciones
                {criticalCount > 0 && (
                  <Badge variant="destructive" className="h-4 px-1 text-[10px] font-semibold rounded-full ml-1">
                    {criticalCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary actions bar - Compact */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end gap-2">
          <TicketProviderManager eventId={event.id} totalCapacity={event.total_capacity} />
          <Button 
            variant="outline"
            size="sm"
            className="h-7 px-2.5 gap-1 rounded-full text-[10px] font-medium"
          >
            <Upload className="h-3 w-3" />
            Importar
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Festival Status Overview */}
        <FestivalStatusOverview />

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-card border border-border h-8">
            <TabsTrigger value="summary" className="text-xs h-7">Resumen</TabsTrigger>
            <TabsTrigger value="executive" className="text-xs h-7">Panel Ejecutivo</TabsTrigger>
            <TabsTrigger value="audience" className="text-xs h-7">Audiencia</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs h-7">Recomendaciones IA</TabsTrigger>
            <TabsTrigger value="export" className="text-xs h-7">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <EventSummary 
              eventId={event.id} 
              totalCapacity={event.total_capacity}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="executive">
            <ExecutiveDashboard
              eventId={event.id}
              totalCapacity={event.total_capacity}
              eventStartDate={event.start_date}
              onOpenRecommendations={() => setDrawerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="audience">
            <EventAudience eventId={event.id} />
          </TabsContent>

          <TabsContent value="recommendations">
            <EventRecommendations 
              eventId={event.id} 
              recommendations={recommendations}
              isLoading={false}
              onRefresh={() => {}}
            />
          </TabsContent>

          <TabsContent value="export">
            <EventExport eventId={event.id} eventName={event.name} />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Recommendations Drawer */}
      <AIRecommendationsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendations={recommendations}
        isLoading={false}
        eventName={event.name}
        eventDate={format(new Date(event.start_date), "d 'de' MMMM 'de' yyyy", { locale: es })}
        onRefresh={() => {}}
      />

      {/* AI Chat Drawer */}
      <EventChatDrawer
        eventId={event.id}
        eventName={event.name}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={true}
      />
    </div>
  );
};

export default Dashboard;