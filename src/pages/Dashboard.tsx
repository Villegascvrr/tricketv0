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
import { generateAIRecommendations } from "@/utils/generateAIRecommendations";
import { useEvent } from "@/contexts/EventContext";
import { Skeleton } from "@/components/ui/skeleton";

import { useFestivalConfig } from "@/hooks/useFestivalConfig";

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { selectedEvent, loading } = useEvent();
  const { config, isDemo } = useFestivalConfig();

  // Generate local recommendations
  const recommendations = generateAIRecommendations(config);
  const criticalCount = recommendations.filter((r: any) => r.priority === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Configurando tu festival</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de Tricket está preparando tu Command Center.
            Pronto tendrás acceso a todos los datos y análisis de tu evento.
          </p>
          <p className="text-xs text-muted-foreground">
            ¿Tienes dudas? Contacta a tu account manager de Tricket.
          </p>
        </div>
      </div>
    );
  }

  const event = selectedEvent;

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

        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1 truncate">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-muted-foreground">
                <span className="truncate max-w-[150px] md:max-w-none">{event.venue}</span>
                <span className="text-foreground/60 hidden md:inline">•</span>
                <span className="font-medium text-foreground">
                  {format(new Date(event.start_date), "d MMM, yyyy", { locale: es })}
                </span>
                <span className="text-foreground/60 hidden md:inline">•</span>
                <span className="hidden md:inline">{event.total_capacity?.toLocaleString()} personas</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setChatOpen(true)}
                variant="outline"
                size="sm"
                className="h-8 px-2 md:px-3 gap-1.5 md:gap-2 rounded-lg text-xs font-medium bg-background/80 backdrop-blur-sm border-border/50"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Consultar IA</span>
              </Button>
              <Button
                onClick={() => setDrawerOpen(true)}
                size="sm"
                className="h-8 px-2 md:px-3 gap-1.5 md:gap-2 rounded-lg text-xs font-medium shadow-md"
              >
                <Brain className="h-4 w-4" />
                {criticalCount > 0 ? (
                  <span className="hidden sm:inline">{criticalCount} alertas críticas</span>
                ) : (
                  <span className="hidden sm:inline">{recommendations.length} rec.</span>
                )}
                <span className="sm:hidden">{criticalCount > 0 ? criticalCount : recommendations.length}</span>
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
        <FestivalStatusOverview eventId={event.id} />

        {/* External Signals - Compact, lower priority */}
        <ExternalSignals />

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-card border border-border h-auto p-1 flex flex-wrap gap-1">
            <TabsTrigger value="summary" className="text-xs h-7 px-2 md:px-4">Ventas</TabsTrigger>
            <TabsTrigger value="executive" className="text-xs h-7 px-2 md:px-4">Decisiones</TabsTrigger>
            <TabsTrigger value="audience" className="text-xs h-7 px-2 md:px-4">Público</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs h-7 px-2 md:px-4">Alertas</TabsTrigger>
            <TabsTrigger value="export" className="text-xs h-7 px-2 md:px-4">Exportar</TabsTrigger>
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
              onRefresh={() => { }}
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
        onRefresh={() => { }}
      />

      {/* AI Chat Drawer */}
      <EventChatDrawer
        eventId={event.id}
        eventName={event.name}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={isDemo}
      />
    </div>
  );
};

export default Dashboard;