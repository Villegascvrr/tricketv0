import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, type, venue, start_date, end_date, total_capacity')
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      const fetchedEvents = data || [];
      setEvents(fetchedEvents);

      // Try to restore previously selected event
      const savedEventId = localStorage.getItem(STORAGE_KEY);
      if (savedEventId) {
        const savedEvent = fetchedEvents.find(e => e.id === savedEventId);
        if (savedEvent) {
          setSelectedEvent(savedEvent);
        } else if (fetchedEvents.length > 0) {
          // Saved event not found, select first
          setSelectedEvent(fetchedEvents[0]);
          localStorage.setItem(STORAGE_KEY, fetchedEvents[0].id);
        }
      } else if (fetchedEvents.length > 0) {
        // No saved event, select first
        setSelectedEvent(fetchedEvents[0]);
        localStorage.setItem(STORAGE_KEY, fetchedEvents[0].id);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
    <EventContext.Provider value={{ events, selectedEvent, loading, selectEvent, refetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};
