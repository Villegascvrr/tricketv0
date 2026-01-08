import { useState } from 'react';
import { Check, ChevronDown, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useEvent } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface EventSelectorProps {
  collapsed?: boolean;
}

export function EventSelector({ collapsed = false }: EventSelectorProps) {
  const { events, selectedEvent, loading, selectEvent } = useEvent();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className={cn("px-3 py-2", collapsed && "px-1")}>
        <Skeleton className={cn("h-10 w-full", collapsed && "h-8 w-8")} />
      </div>
    );
  }

  if (collapsed) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-64">
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate('/events/new');
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear evento
          </DropdownMenuItem>
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
                <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
                  {selectedEvent.name}
                </p>
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
      <DropdownMenuContent side="bottom" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
        {events.length === 0 ? (
          <div className="p-3 text-center">
            <p className="text-sm text-muted-foreground mb-2">No hay eventos</p>
            <Button 
              size="sm" 
              onClick={() => {
                navigate('/events/new');
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Crear primer evento
            </Button>
          </div>
        ) : (
          <>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigate('/events/new');
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear nuevo evento
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
