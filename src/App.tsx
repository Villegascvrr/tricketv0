import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import NewEvent from "./pages/NewEvent";
import EventDetail from "./pages/EventDetail";
import AIPanel from "./pages/AIPanel";
import Templates from "./pages/Templates";
import Integrations from "./pages/Integrations";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import AppSidebar from "./components/AppSidebar";
import { RecommendationStatusProvider } from "./contexts/RecommendationStatusContext";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider defaultOpen={true}>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RecommendationStatusProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />

            {/* Events */}
            <Route
              path="/events"
              element={
                <AppLayout>
                  <Events />
                </AppLayout>
              }
            />
            <Route
              path="/events/new"
              element={
                <AppLayout>
                  <NewEvent />
                </AppLayout>
              }
            />
            <Route
              path="/events/:id"
              element={
                <AppLayout>
                  <EventDetail />
                </AppLayout>
              }
            />

            {/* AI Panel */}
            <Route
              path="/ai-panel"
              element={
                <AppLayout>
                  <AIPanel />
                </AppLayout>
              }
            />

            {/* Templates */}
            <Route
              path="/templates"
              element={
                <AppLayout>
                  <Templates />
                </AppLayout>
              }
            />

            {/* Integrations */}
            <Route
              path="/integrations"
              element={
                <AppLayout>
                  <Integrations />
                </AppLayout>
              }
            />

            {/* Team */}
            <Route
              path="/team"
              element={
                <AppLayout>
                  <Team />
                </AppLayout>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />

            {/* Help */}
            <Route
              path="/help"
              element={
                <AppLayout>
                  <Help />
                </AppLayout>
              }
            />

            {/* 404 Not Found - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RecommendationStatusProvider>
  </QueryClientProvider>
);

export default App;
