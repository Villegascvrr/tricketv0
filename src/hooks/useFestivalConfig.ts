import { useEvent } from '@/contexts/EventContext';
import { demoFestivalData } from '@/data/demoData';
import { realFestivalData } from '@/data/realData';
import { FestivalData } from '@/types/festival';

export const useFestivalConfig = () => {
    const { selectedEvent } = useEvent();

    // Logic to determine if it's a demo event
    const isDemo = selectedEvent?.id === 'demo-event-id' ||
        selectedEvent?.id?.startsWith('demo-') ||
        (selectedEvent as any)?.isDemo === true;

    const config: FestivalData = isDemo ? demoFestivalData : realFestivalData;

    return {
        config,
        isDemo: !!isDemo,
        eventId: selectedEvent?.id,
        eventName: selectedEvent?.name
    };
};
