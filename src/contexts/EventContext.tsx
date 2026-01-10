import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  start_date: string;
  end_date: string;
  total_capacity: number | null;
}

interface EventContextType {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  isAdmin: boolean;
  selectEvent: (eventId: string) => void;
  refetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = 'selected-event-id';

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        // Admin Tricket: ver TODOS los eventos
        const { data, error } = await supabase
          .from('events')
          .select('id, name, type, venue, start_date, end_date, total_capacity')
          .order('start_date', { ascending: false });

        if (error) throw error;
        
        const fetchedEvents = data || [];
        setEvents(fetchedEvents);
        selectInitialEvent(fetchedEvents);
      } else if (user) {
        // Festival cliente: solo ver eventos asignados via team_members
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('event_id')
          .eq('user_id', user.id)
          .not('event_id', 'is', null);

        if (teamError) throw teamError;

        const eventIds = teamData?.map(t => t.event_id).filter(Boolean) as string[] || [];
        
        if (eventIds.length > 0) {
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('id, name, type, venue, start_date, end_date, total_capacity')
            .in('id', eventIds)
            .order('start_date', { ascending: false });

          if (eventsError) throw eventsError;
          
          const fetchedEvents = eventsData || [];
          setEvents(fetchedEvents);
          selectInitialEvent(fetchedEvents);
        } else {
          // Usuario sin eventos asignados - mostrar todos (demo/desarrollo)
          const { data, error } = await supabase
            .from('events')
            .select('id, name, type, venue, start_date, end_date, total_capacity')
            .order('start_date', { ascending: false });

          if (error) throw error;
          
          const fetchedEvents = data || [];
          setEvents(fetchedEvents);
          selectInitialEvent(fetchedEvents);
        }
      } else {
        // Usuario no autenticado - mostrar eventos públicos (demo)
        const { data, error } = await supabase
          .from('events')
          .select('id, name, type, venue, start_date, end_date, total_capacity')
          .order('start_date', { ascending: false });

        if (error) throw error;
        
        const fetchedEvents = data || [];
        setEvents(fetchedEvents);
        selectInitialEvent(fetchedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectInitialEvent = (fetchedEvents: Event[]) => {
    // Try to restore previously selected event
    const savedEventId = localStorage.getItem(STORAGE_KEY);
    if (savedEventId) {
      const savedEvent = fetchedEvents.find(e => e.id === savedEventId);
      if (savedEvent) {
        setSelectedEvent(savedEvent);
        return;
      }
    }
    
    // Select first event if available
    if (fetchedEvents.length > 0) {
      setSelectedEvent(fetchedEvents[0]);
      localStorage.setItem(STORAGE_KEY, fetchedEvents[0].id);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading before fetching events
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, isAdmin, user?.id]);

  const selectEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      localStorage.setItem(STORAGE_KEY, eventId);
    }
  };

  const refetchEvents = async () => {
    await fetchEvents();
  };

  return (
    <EventContext.Provider value={{ events, selectedEvent, loading, isAdmin, selectEvent, refetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};
