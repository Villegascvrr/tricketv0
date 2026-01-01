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
import WeatherConditions from "./pages/WeatherConditions";
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
import Auth from "./pages/Auth";
import AppSidebar from "./components/AppSidebar";
import MobileHeader from "./components/MobileHeader";
import { ScrollToTop } from "./components/ScrollToTop";
import { RecommendationStatusProvider } from "./contexts/RecommendationStatusContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { themeClass } = useTheme();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`flex flex-col md:flex-row min-h-screen w-full ${themeClass}`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <MobileHeader />
          <main className="flex-1 overflow-auto">
            <ScrollToTop>{children}</ScrollToTop>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RecommendationStatusProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ThemeProvider>
              <Routes>
                {/* Auth page - public */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
                {/* Dashboard - Command Center */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Ventas & Previsiones */}
                <Route
                  path="/sales"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SalesForecasts />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Público y Audiencia */}
                <Route
                  path="/audience"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Audience />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Marketing & Campañas */}
                <Route
                  path="/marketing"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Marketing />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Condiciones Externas - Clima */}
                <Route
                  path="/weather"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <WeatherConditions />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Recomendaciones IA */}
                <Route
                  path="/ai-recommendations"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AIRecommendations />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Histórico & Comparativas */}
                <Route
                  path="/historical"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Historical />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Scenario Planner */}
                <Route
                  path="/scenario-planner"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ScenarioPlanner />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Operaciones Pre-Festival */}
                <Route
                  path="/operations/pre-festival"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PreFestivalOperations />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Operaciones Día del Festival */}
                <Route
                  path="/operations/event-day"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <EventDayOperations />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirect old operations route */}
                <Route path="/operations" element={<Navigate to="/operations/pre-festival" replace />} />

                {/* Equipo & Permisos */}
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Team />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Integraciones */}
                <Route
                  path="/integrations"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Integrations />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Configuración */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Mi Perfil */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Help - hidden from menu but accessible */}
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Help />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirect old routes */}
                <Route path="/events/*" element={<Navigate to="/dashboard" replace />} />
                <Route path="/ai-panel" element={<Navigate to="/ai-recommendations" replace />} />
                <Route path="/templates" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </RecommendationStatusProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;