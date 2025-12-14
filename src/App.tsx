import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import SalesForecasts from "./pages/SalesForecasts";
import Audience from "./pages/Audience";
import Marketing from "./pages/Marketing";
import AIRecommendations from "./pages/AIRecommendations";
import Historical from "./pages/Historical";
import PreFestivalOperations from "./pages/PreFestivalOperations";
import EventDayOperations from "./pages/EventDayOperations";
import Team from "./pages/Team";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ScenarioPlanner from "./pages/ScenarioPlanner";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppSidebar from "./components/AppSidebar";
import { RecommendationStatusProvider } from "./contexts/RecommendationStatusContext";
import { AuthProvider } from "./contexts/AuthContext";

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
    <AuthProvider>
      <RecommendationStatusProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard - Command Center */}
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />

              {/* Ventas & Previsiones */}
              <Route
                path="/sales"
                element={
                  <AppLayout>
                    <SalesForecasts />
                  </AppLayout>
                }
              />

              {/* Público y Audiencia */}
              <Route
                path="/audience"
                element={
                  <AppLayout>
                    <Audience />
                  </AppLayout>
                }
              />

              {/* Marketing & Campañas */}
              <Route
                path="/marketing"
                element={
                  <AppLayout>
                    <Marketing />
                  </AppLayout>
                }
              />

              {/* Recomendaciones IA */}
              <Route
                path="/ai-recommendations"
                element={
                  <AppLayout>
                    <AIRecommendations />
                  </AppLayout>
                }
              />

              {/* Histórico & Comparativas */}
              <Route
                path="/historical"
                element={
                  <AppLayout>
                    <Historical />
                  </AppLayout>
                }
              />

              {/* Scenario Planner */}
              <Route
                path="/scenario-planner"
                element={
                  <AppLayout>
                    <ScenarioPlanner />
                  </AppLayout>
                }
              />

              {/* Operaciones Pre-Festival */}
              <Route
                path="/operations/pre-festival"
                element={
                  <AppLayout>
                    <PreFestivalOperations />
                  </AppLayout>
                }
              />

              {/* Operaciones Día del Festival */}
              <Route
                path="/operations/event-day"
                element={
                  <AppLayout>
                    <EventDayOperations />
                  </AppLayout>
                }
              />

              {/* Redirect old operations route */}
              <Route path="/operations" element={<Navigate to="/operations/pre-festival" replace />} />

              {/* Equipo & Permisos */}
              <Route
                path="/team"
                element={
                  <AppLayout>
                    <Team />
                  </AppLayout>
                }
              />

              {/* Integraciones */}
              <Route
                path="/integrations"
                element={
                  <AppLayout>
                    <Integrations />
                  </AppLayout>
                }
              />

              {/* Configuración */}
              <Route
                path="/settings"
                element={
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                }
              />

              {/* Mi Perfil */}
              <Route
                path="/profile"
                element={
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                }
              />

              {/* Help - hidden from menu but accessible */}
              <Route
                path="/help"
                element={
                  <AppLayout>
                    <Help />
                  </AppLayout>
                }
              />

              {/* Redirect old routes */}
              <Route path="/events/*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/ai-panel" element={<Navigate to="/ai-recommendations" replace />} />
              <Route path="/templates" element={<Navigate to="/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RecommendationStatusProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;