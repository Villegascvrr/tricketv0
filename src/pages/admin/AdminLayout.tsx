import React from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Ticket,
  Shield,
  ScrollText,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/events", icon: Calendar, label: "Eventos" },
  { to: "/admin/users", icon: Users, label: "Usuarios" },
  { to: "/admin/invitation-codes", icon: Ticket, label: "Códigos" },
  { to: "/admin/roles", icon: Shield, label: "Roles" },
  { to: "/admin/audit-logs", icon: ScrollText, label: "Auditoría" },
];

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const { themeClass } = useTheme();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={`flex min-h-screen ${themeClass}`}>
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <NavLink to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Tricket
            </NavLink>
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t text-xs text-muted-foreground">
          Panel de administración global
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
