import { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Settings, Brain, FileText, Plug, Users, HelpCircle, Home, ChevronLeft, Menu, LogOut, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import TryTricketModal from "@/components/TryTricketModal";
import { useAuth } from "@/contexts/AuthContext";
const mainItems = [{
  title: "Inicio",
  url: "/dashboard",
  icon: Home
}, {
  title: "Eventos",
  url: "/events",
  icon: Calendar
}, {
  title: "Panel IA",
  url: "/ai-panel",
  icon: Brain
}, {
  title: "Plantillas",
  url: "/templates",
  icon: FileText
}, {
  title: "Integraciones",
  url: "/integrations",
  icon: Plug
}];
const secondaryItems = [{
  title: "Equipo y permisos",
  url: "/team",
  icon: Users
}, {
  title: "Configuración",
  url: "/settings",
  icon: Settings
}, {
  title: "Ayuda & Feedback",
  url: "/help",
  icon: HelpCircle
}];
export function AppSidebar() {
  const {
    state,
    toggleSidebar,
    isMobile
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [tryModalOpen, setTryModalOpen] = useState(false);
  const { signOut, user } = useAuth();

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state");
    if (savedState && !isMobile) {
      // Only apply saved state on desktop
      if (savedState === "collapsed" && state === "expanded") {
        toggleSidebar();
      } else if (savedState === "expanded" && state === "collapsed") {
        toggleSidebar();
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-state", state);
    }
  }, [state, isMobile]);
  const isActive = (path: string) => {
    if (path === "/events") {
      return currentPath === "/events" || currentPath.startsWith("/events/");
    }
    return currentPath === path;
  };
  const renderMenuItem = (item: typeof mainItems[0]) => {
    const active = isActive(item.url);
    return <SidebarMenuItem key={item.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild className={cn("h-10", active && "bg-sidebar-accent")}>
              <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right" className="z-50">
              {item.title}
            </TooltipContent>}
        </Tooltip>
      </SidebarMenuItem>;
  };
  return <Sidebar collapsible="icon" className={cn("border-r border-sidebar-border transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      {/* Header with Logo and Toggle */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && <div className="flex-1">
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Tricket Brain
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Festival Business Inteligence</p>
            </div>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("h-8 w-8 shrink-0", collapsed && "mx-auto")}>
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Try Tricket Free CTA */}
        <div className={cn("px-3 py-4", collapsed && "px-2")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button onClick={() => setTryModalOpen(true)} className={cn("w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200", collapsed ? "h-10 w-10 p-0" : "h-10")}>
                <Sparkles className={cn("h-5 w-5", !collapsed && "mr-2")} />
                {!collapsed && <span className="font-semibold">Probar gratis</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right" className="z-50">
                Probar Tricket gratis
              </TooltipContent>}
          </Tooltip>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs text-sidebar-foreground/60 px-4">
              Principal
            </SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {mainItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        <div className="px-4 py-2">
          <Separator />
        </div>

        {/* Secondary Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs text-sidebar-foreground/60 px-4">
              Cuenta
            </SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {secondaryItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={signOut}
                className={cn(
                  "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && "justify-center"
                )}
              >
                <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>Cerrar sesión</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Cerrar sesión
              </TooltipContent>
            )}
          </Tooltip>
        )}
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center">
            © 2024 Tricket Brain
          </p>
        )}
      </SidebarFooter>

      {/* Try Tricket Modal */}
      <TryTricketModal open={tryModalOpen} onOpenChange={setTryModalOpen} />
    </Sidebar>;
}
export default AppSidebar;