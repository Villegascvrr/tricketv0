import { useState } from 'react';
import { Check, ChevronDown, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useEvent } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface EventSelectorProps {
  collapsed?: boolean;
}

export function EventSelector({ collapsed = false }: EventSelectorProps) {
  const { events, selectedEvent, loading, isAdmin, selectEvent } = useEvent();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className={cn("px-3 py-2", collapsed && "px-1")}>
        <Skeleton className={cn("h-10 w-full", collapsed && "h-8 w-8")} />
      </div>
    );
  }

  // Festival cliente: mostrar solo info del evento sin selector
  // (cuando hay 1 evento O cuando el usuario no es admin)
  if (!isAdmin || events.length <= 1) {
    if (collapsed) {
      return (
        <div className="flex justify-center py-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
        </div>
      );
    }

    return (
      <div className="px-3 py-2">
        {selectedEvent ? (
          <div className="text-left">
            <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
              {selectedEvent.name}
            </p>
            <p className="text-[10px] text-sidebar-foreground/60 truncate leading-tight">
              {format(new Date(selectedEvent.start_date), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        ) : (
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Configurando...</p>
            <p className="text-[10px] text-muted-foreground/60">El equipo de Tricket está preparando tu evento</p>
          </div>
        )}
      </div>
    );
  }

  // Admin Tricket: mostrar selector con todos los eventos
  if (collapsed) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto relative"
          >
            <Calendar className="h-4 w-4" />
            <Shield className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-amber-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-72">
          <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3 text-amber-500" />
            Admin Tricket - {events.length} eventos
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {events.map((event) => (
            <DropdownMenuItem
              key={event.id}
              onClick={() => {
                selectEvent(event.id);
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.start_date), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
                {selectedEvent?.id === event.id && (
                  <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto py-2 px-3 hover:bg-sidebar-accent/50"
        >
          <div className="flex-1 text-left overflow-hidden">
            {selectedEvent ? (
              <>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
                    {selectedEvent.name}
                  </p>
                  <Badge variant="outline" className="h-4 px-1 text-[9px] border-amber-500/50 text-amber-600">
                    <Shield className="h-2 w-2 mr-0.5" />
                    Admin
                  </Badge>
                </div>
                <p className="text-[10px] text-sidebar-foreground/60 truncate leading-tight">
                  {format(new Date(selectedEvent.start_date), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Seleccionar evento</p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60 shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[240px]">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3 text-amber-500" />
          Admin Tricket - {events.length} eventos
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {events.map((event) => (
          <DropdownMenuItem
            key={event.id}
            onClick={() => {
              selectEvent(event.id);
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{event.name}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.start_date), "d MMM yyyy", { locale: es })} • {event.venue}
                </p>
              </div>
              {selectedEvent?.id === event.id && (
                <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
