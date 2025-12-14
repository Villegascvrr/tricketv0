import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Brain, 
  Plug, 
  Users, 
  ChevronLeft, 
  Menu, 
  LogOut, 
  Sparkles,
  TrendingUp,
  Users2,
  Megaphone,
  History,
  HardHat,
  Radio,
  ChevronDown,
  FlaskConical,
  MessageCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar, 
  SidebarHeader, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TryTricketModal from "@/components/TryTricketModal";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { festivalData } from "@/data/festivalData";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard
  }
];

const mainItemsAfterOps = [
  {
    title: "Ventas & Previsiones",
    url: "/sales",
    icon: TrendingUp
  },
  {
    title: "Público y Audiencia",
    url: "/audience",
    icon: Users2
  },
  {
    title: "Marketing & Campañas",
    url: "/marketing",
    icon: Megaphone
  },
  {
    title: "Recomendaciones IA",
    url: "/ai-recommendations",
    icon: Brain
  },
  {
    title: "Scenario Planner",
    url: "/scenario-planner",
    icon: FlaskConical
  },
  {
    title: "Histórico & Comparativas",
    url: "/historical",
    icon: History
  }
];

const operationsItems = [
  {
    title: "Pre-Festival",
    url: "/operations/pre-festival",
    icon: HardHat,
    description: "Tareas y preparación"
  },
  {
    title: "Día del Festival",
    url: "/operations/event-day",
    icon: Radio,
    description: "Control en vivo"
  }
];

// Operations items moved above mainItems

const secondaryItems = [
  {
    title: "Equipo & Permisos",
    url: "/team",
    icon: Users
  }, 
  {
    title: "Integraciones",
    url: "/integrations",
    icon: Plug
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings
  }
];

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
  const [chatOpen, setChatOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(
    currentPath.startsWith('/operations')
  );
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

  useEffect(() => {
    if (currentPath.startsWith('/operations')) {
      setOperationsOpen(true);
    }
  }, [currentPath]);

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const isOperationsActive = currentPath.startsWith('/operations');

  const renderMenuItem = (item: typeof mainItems[0]) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild className={cn("h-10", active && "bg-sidebar-accent")}>
              <NavLink 
                to={item.url} 
                className="hover:bg-sidebar-accent/50" 
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
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
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex-1">
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Primaverando
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Command Center 2025</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn("h-8 w-8 shrink-0", collapsed && "mx-auto")}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className={cn("px-3 py-4", collapsed && "px-2")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setTryModalOpen(true)} 
                className={cn(
                  "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200", 
                  collapsed ? "h-10 w-10 p-0" : "h-10"
                )}
              >
                <Sparkles className={cn("h-5 w-5", !collapsed && "mr-2")} />
                {!collapsed && <span className="font-semibold">Probar gratis</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Probar Tricket gratis
              </TooltipContent>
            )}
          </Tooltip>
          
          {/* AI Chat Button */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setChatOpen(true)} 
                variant="outline"
                className={cn(
                  "w-full mt-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200", 
                  collapsed ? "h-10 w-10 p-0" : "h-10"
                )}
              >
                <MessageCircle className={cn("h-5 w-5 text-primary", !collapsed && "mr-2")} />
                {!collapsed && <span className="font-medium text-primary">Chat con IA</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Chat con IA
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/60 px-4">
              Festival
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {mainItems.map(renderMenuItem)}
              
              {/* Operations Collapsible - Second position */}
              {!collapsed ? (
                <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={cn("h-10 w-full justify-between", isOperationsActive && "bg-sidebar-accent")}>
                        <div className="flex items-center">
                          <HardHat className="h-5 w-5 mr-2" />
                          <span>Operaciones</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", operationsOpen && "rotate-180")} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {operationsItems.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton asChild className={cn(isActive(item.url) && "bg-sidebar-accent")}>
                              <NavLink 
                                to={item.url}
                                className="hover:bg-sidebar-accent/50"
                                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              >
                                <item.icon className="h-4 w-4 mr-2" />
                                <span className="text-sm">{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={cn("h-10", isOperationsActive && "bg-sidebar-accent")}>
                        <NavLink to="/operations/pre-festival" className="hover:bg-sidebar-accent/50">
                          <HardHat className="h-5 w-5 mx-auto" />
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50">
                    Operaciones
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Rest of main items */}
              {mainItemsAfterOps.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator />
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/60 px-4">
              Administración
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {secondaryItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

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
            © 2025 Primaverando Festival
          </p>
        )}
      </SidebarFooter>

      <TryTricketModal open={tryModalOpen} onOpenChange={setTryModalOpen} />
      
      <EventChatDrawer
        eventId="demo-primaverando-2025"
        eventName={festivalData.nombre}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={true}
      />
    </Sidebar>
  );
}

export default AppSidebar;