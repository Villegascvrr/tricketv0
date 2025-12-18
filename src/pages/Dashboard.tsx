import { useState } from "react";
import { Brain, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EventSummary from "@/components/event/EventSummary";
import EventAudience from "@/components/event/EventAudience";
import EventExport from "@/components/event/EventExport";
import EventRecommendations from "@/components/event/EventRecommendations";
import AIRecommendationsDrawer from "@/components/event/AIRecommendationsDrawer";
import ExecutiveDashboard from "@/components/event/ExecutiveDashboard";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import FestivalStatusOverview from "@/components/event/FestivalStatusOverview";
import ExternalSignals from "@/components/event/ExternalSignals";
import { TodayQuickView } from "@/components/event/TodayQuickView";
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
    <div className="min-h-screen bg-background w-full">
      {/* Hero Header - Limpio y profesional */}
      <div className="relative h-32 md:h-40 overflow-hidden w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {event.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{event.venue}</span>
                <span className="text-foreground/60">•</span>
                <span className="font-medium text-foreground">
                  {format(new Date(event.start_date), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
                <span className="text-foreground/60">•</span>
                <span>{event.total_capacity?.toLocaleString()} personas</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setChatOpen(true)}
                variant="outline"
                size="sm"
                className="h-8 px-3 gap-2 rounded-lg text-xs font-medium bg-background/80 backdrop-blur-sm border-border/50"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar IA
              </Button>
              <Button 
                onClick={() => setDrawerOpen(true)}
                size="sm"
                className="h-8 px-3 gap-2 rounded-lg text-xs font-medium shadow-md"
              >
                <Brain className="h-4 w-4" />
                {criticalCount > 0 ? (
                  <span>{criticalCount} alertas críticas</span>
                ) : (
                  <span>{recommendations.length} recomendaciones</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Today's Quick View - 2 minute check-in */}
        <TodayQuickView 
          onOpenRecommendations={() => setDrawerOpen(true)} 
          onOpenChat={() => setChatOpen(true)} 
        />

        {/* Festival Status Overview - Priority 1 */}
        <FestivalStatusOverview />

        {/* External Signals - Compact, lower priority */}
        <ExternalSignals />

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-card border border-border h-9 p-1">
            <TabsTrigger value="summary" className="text-xs h-7 px-4">Ventas y Ticketeras</TabsTrigger>
            <TabsTrigger value="executive" className="text-xs h-7 px-4">Decisiones</TabsTrigger>
            <TabsTrigger value="audience" className="text-xs h-7 px-4">Público</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs h-7 px-4">Alertas IA</TabsTrigger>
            <TabsTrigger value="export" className="text-xs h-7 px-4">Exportar</TabsTrigger>
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