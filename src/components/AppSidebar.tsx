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
  MessageCircle,
  User
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TryTricketModal from "@/components/TryTricketModal";
import EventChatDrawer from "@/components/event/EventChatDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [tryModalOpen, setTryModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(
    currentPath.startsWith('/operations')
  );
  const { signOut, user } = useAuth();
  const { profile, teamMemberInfo } = useUserProfile();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const festivalRole = teamMemberInfo?.festival_role;

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
            <SidebarMenuButton asChild className={cn("h-8", active && "bg-sidebar-accent")}>
              <NavLink 
                to={item.url} 
                className="hover:bg-sidebar-accent/50" 
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span className="text-sm">{item.title}</span>}
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
    <Sidebar collapsible="icon" className={cn("border-r border-sidebar-border transition-all duration-300", collapsed ? "w-14" : "w-56")}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex-1">
              <h1 className="text-base font-bold text-sidebar-foreground leading-tight">
                Primaverando
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60">Command Center 2025</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn("h-7 w-7 shrink-0", collapsed && "mx-auto")}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <div className={cn("px-2 py-2 space-y-1", collapsed && "px-1")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setTryModalOpen(true)} 
                size="sm"
                className={cn(
                  "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-sm", 
                  collapsed ? "h-8 w-8 p-0" : "h-8"
                )}
              >
                <Sparkles className={cn("h-4 w-4", !collapsed && "mr-1.5")} />
                {!collapsed && <span className="text-xs font-semibold">Probar gratis</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Probar Tricket gratis
              </TooltipContent>
            )}
          </Tooltip>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setChatOpen(true)} 
                variant="outline"
                size="sm"
                className={cn(
                  "w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50", 
                  collapsed ? "h-8 w-8 p-0" : "h-8"
                )}
              >
                <MessageCircle className={cn("h-4 w-4 text-primary", !collapsed && "mr-1.5")} />
                {!collapsed && <span className="text-xs font-medium text-primary">Chat con IA</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Chat con IA
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <SidebarGroup className="py-1">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] text-sidebar-foreground/60 px-3 py-1">
              Festival
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-2">
              {mainItems.map(renderMenuItem)}
              
              {/* Operations Collapsible */}
              {!collapsed ? (
                <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={cn("h-8 w-full justify-between", isOperationsActive && "bg-sidebar-accent")}>
                        <div className="flex items-center">
                          <HardHat className="h-4 w-4 mr-2" />
                          <span className="text-sm">Operaciones</span>
                        </div>
                        <ChevronDown className={cn("h-3 w-3 transition-transform", operationsOpen && "rotate-180")} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 pl-2 border-l border-sidebar-border">
                        {operationsItems.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton asChild className={cn("h-7", isActive(item.url) && "bg-sidebar-accent")}>
                              <NavLink 
                                to={item.url}
                                className="hover:bg-sidebar-accent/50"
                                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              >
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span className="text-xs">{item.title}</span>
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
                      <SidebarMenuButton asChild className={cn("h-8", isOperationsActive && "bg-sidebar-accent")}>
                        <NavLink to="/operations/pre-festival" className="hover:bg-sidebar-accent/50">
                          <HardHat className="h-4 w-4 mx-auto" />
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50">
                    Operaciones
                  </TooltipContent>
                </Tooltip>
              )}
              
              {mainItemsAfterOps.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 my-1" />

        <SidebarGroup className="py-1">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] text-sidebar-foreground/60 px-3 py-1">
              Administración
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-2">
              {secondaryItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <DropdownMenu>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start hover:bg-sidebar-accent/50 h-auto py-1.5",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <div 
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                      !collapsed && "mr-2"
                    )}
                    style={{ 
                      backgroundColor: festivalRole?.bg_color || 'hsl(var(--primary))',
                      color: festivalRole?.color || 'hsl(var(--primary-foreground))'
                    }}
                  >
                    {getInitials(profile?.full_name || (user ? null : 'Demo User'))}
                  </div>
                  {!collapsed && (
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-xs font-medium text-sidebar-foreground truncate">
                        {profile?.full_name || (user ? 'Usuario' : 'Demo User')}
                      </p>
                      <p className="text-[10px] text-sidebar-foreground/60 truncate">
                        {festivalRole?.name || user?.email || 'Director Festival'}
                      </p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                {profile?.full_name || user?.email || 'Mi Perfil'}
              </TooltipContent>
            )}
          </Tooltip>
          <DropdownMenuContent side="top" align="start" className="w-48 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Ver mi perfil
            </DropdownMenuItem>
            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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