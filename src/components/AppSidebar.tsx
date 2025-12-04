import { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Settings, Brain, FileText, Plug, Users, HelpCircle, Home, ChevronLeft, Menu, LogOut, Sparkles, Music } from "lucide-react";
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
  title: "Dashboard",
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
  title: "Equipo",
  url: "/team",
  icon: Users
}, {
  title: "Configuración",
  url: "/settings",
  icon: Settings
}, {
  title: "Ayuda",
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

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state");
    if (savedState && !isMobile) {
      if (savedState === "collapsed" && state === "expanded") {
        toggleSidebar();
      } else if (savedState === "expanded" && state === "collapsed") {
        toggleSidebar();
      }
    }
  }, []);

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
    return (
      <SidebarMenuItem key={item.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild className={cn("h-10 transition-colors", active && "bg-sidebar-accent")}>
              <NavLink 
                to={item.url} 
                className="hover:bg-sidebar-accent/50" 
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "", active && "text-primary")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="z-50">
              {item.title}
            </TooltipContent>
          )}
        </Tooltip>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-sidebar-border transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-festival flex items-center justify-center shadow-md">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-base font-display font-bold text-sidebar-foreground">
                  Primaverando
                </h1>
                <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Business Intelligence</p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn("h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "mx-auto")}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* CTA Button */}
        <div className={cn("px-3 py-4", collapsed && "px-2")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setTryModalOpen(true)} 
                className={cn(
                  "w-full gradient-festival hover:opacity-90 text-white shadow-lg transition-all duration-200",
                  collapsed ? "h-10 w-10 p-0" : "h-10"
                )}
              >
                <Sparkles className={cn("h-5 w-5", !collapsed && "mr-2")} />
                {!collapsed && <span className="font-semibold">Demo gratis</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Solicitar demo gratuita
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 px-4 uppercase tracking-wider">
              Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {mainItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="bg-sidebar-border" />
        </div>

        {/* Secondary Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 px-4 uppercase tracking-wider">
              Cuenta
            </SidebarGroupLabel>
          )}
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
                  "w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
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
          <div className="text-center space-y-1">
            <p className="text-[10px] text-sidebar-foreground/30 uppercase tracking-wider">
              Powered by
            </p>
            <p className="text-xs text-sidebar-foreground/50 font-medium">
              Tricket Brain © 2025
            </p>
          </div>
        )}
      </SidebarFooter>

      <TryTricketModal open={tryModalOpen} onOpenChange={setTryModalOpen} />
    </Sidebar>
  );
}

export default AppSidebar;
