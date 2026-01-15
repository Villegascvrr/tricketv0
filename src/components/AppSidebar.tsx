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
  User,
  CloudSun,
  Shield
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
import { EventSelector } from "@/components/EventSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useEvent } from "@/contexts/EventContext";
import { useUserProfile } from "@/hooks/useUserProfile";

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
    icon: Megaphone,
    items: [
      {
        title: "Estrategia & Campañas",
        url: "/marketing"
      },
      {
        title: "Gestión Influencers",
        url: "/marketing/influencers"
      }
    ]
  },
  {
    title: "Recomendaciones IA",
    url: "/ai-recommendations",
    icon: Brain
  },
  {
    title: "Condiciones Externas",
    url: "/weather",
    icon: CloudSun
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
    title: "Global Admin",
    url: "/admin",
    icon: Shield
  },
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
  const [operationsOpen, setOperationsOpen] = useState(true);
  const { signOut, user, isAdmin } = useAuth();
  const { selectedEvent } = useEvent();
  const { profile, teamMemberInfo } = useUserProfile();

  // Filter secondary items - only show admin link to global admins
  const filteredSecondaryItems = secondaryItems.filter(item => {
    if (item.url === "/admin") {
      return isAdmin;
    }
    return true;
  });

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

  const renderMenuItem = (item: any) => {
    const active = isActive(item.url);

    if (item.items) {
      return (
        <Collapsible key={item.title} defaultOpen={isActive(item.url) || item.items.some((sub: any) => isActive(sub.url))} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} className={cn(isActive(item.url) && "bg-sidebar-accent")}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 h-4 w-4" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem: any) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                      <NavLink to={subItem.url}>
                        <span>{subItem.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild className={cn("h-7", active && "bg-sidebar-accent")}>
              <NavLink
                to={item.url}
                className="hover:bg-sidebar-accent/50"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span className="text-[13px]">{item.title}</span>}
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border transition-all duration-300">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2">
          {!collapsed && (
            <div className="flex-1">
              <h1 className="text-sm font-bold text-sidebar-foreground leading-tight">
                Tricket
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60">Command Center</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-6 w-6 shrink-0", collapsed && "mx-auto")}
          >
            {collapsed ? <Menu className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>
        </div>
        {/* Event Selector */}
        <div className={cn("border-t border-sidebar-border", collapsed ? "py-2" : "px-1 py-1")}>
          <EventSelector collapsed={collapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        {/* Action buttons - horizontal on expanded, vertical on collapsed */}
        <div className={cn("px-2 py-1.5", collapsed ? "space-y-1" : "flex gap-1")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTryModalOpen(true)}
                size="sm"
                className={cn(
                  "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-sm h-7",
                  collapsed ? "w-full p-0" : "flex-1 px-2"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {!collapsed && <span className="text-[11px] font-semibold ml-1">Probar</span>}
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
                  "border-primary/30 hover:bg-primary/10 hover:border-primary/50 h-7",
                  collapsed ? "w-full p-0" : "flex-1 px-2"
                )}
              >
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                {!collapsed && <span className="text-[11px] font-medium text-primary ml-1">Chat IA</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="z-50">
                Chat con IA
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <SidebarGroup className="py-0">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] text-sidebar-foreground/60 px-3 py-0.5 h-5">
              Festival
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0 px-2">
              {mainItems.map(renderMenuItem)}

              {/* Operations Collapsible */}
              {!collapsed ? (
                <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={cn("h-7 w-full justify-between", isOperationsActive && "bg-sidebar-accent")}>
                        <div className="flex items-center">
                          <HardHat className="h-4 w-4 mr-2" />
                          <span className="text-[13px]">Operaciones</span>
                        </div>
                        <ChevronDown className={cn("h-3 w-3 transition-transform", operationsOpen && "rotate-180")} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 pl-2 border-l border-sidebar-border">
                        {operationsItems.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton asChild className={cn("h-6", isActive(item.url) && "bg-sidebar-accent")}>
                              <NavLink
                                to={item.url}
                                className="hover:bg-sidebar-accent/50"
                                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              >
                                <item.icon className="h-3 w-3 mr-1.5" />
                                <span className="text-[11px]">{item.title}</span>
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
                      <SidebarMenuButton asChild className={cn("h-7", isOperationsActive && "bg-sidebar-accent")}>
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

        <Separator className="mx-3 my-0.5" />

        <SidebarGroup className="py-0">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] text-sidebar-foreground/60 px-3 py-0.5 h-5">
              Administración
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0 px-2">
              {filteredSecondaryItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-1.5 border-t border-sidebar-border">
        <DropdownMenu>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start hover:bg-sidebar-accent/50 h-auto py-1",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0",
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
                      <p className="text-[11px] font-medium text-sidebar-foreground truncate leading-tight">
                        {profile?.full_name || (user ? 'Usuario' : 'Demo User')}
                      </p>
                      <p className="text-[9px] text-sidebar-foreground/60 truncate leading-tight">
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
        eventId={selectedEvent?.id || "demo"}
        eventName={selectedEvent?.name || "Evento"}
        open={chatOpen}
        onOpenChange={setChatOpen}
        isDemo={!selectedEvent}
      />
    </Sidebar>
  );
}

export default AppSidebar;