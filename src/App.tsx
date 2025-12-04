import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
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
import Auth from "./pages/Auth";
import AppSidebar from "./components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
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
              {/* Auth route - public */}
              <Route path="/auth" element={<Auth />} />

              {/* Redirect root to Festival Primavera Sound 2024 */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/events/123e4567-e89b-12d3-a456-426614174000" replace />
                </ProtectedRoute>
              } />
              
              {/* Dashboard */}
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

              {/* Events */}
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Events />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/new"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <NewEvent />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EventDetail />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* AI Panel */}
              <Route
                path="/ai-panel"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AIPanel />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Templates */}
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Templates />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Integrations */}
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

              {/* Team */}
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

              {/* Settings */}
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

              {/* Help */}
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

              {/* 404 Not Found - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RecommendationStatusProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
