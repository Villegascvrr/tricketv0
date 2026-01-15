export type LogisticsStatus = 'pending' | 'booked' | 'confirmed' | 'issue';
export type RiderStatus = 'pending' | 'approved' | 'modified';

export interface HotelInfo {
    id: string;
    rooms: number;
    roomType: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    status: LogisticsStatus;
}

export interface FlightInfo {
    id: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    airline: string;
    passengerCount: number;
    status: LogisticsStatus;
}

export interface TransportInfo {
    id: string;
    type: 'van' | 'car' | 'bus';
    pickUpTime: string;
    pickUpLocation: string;
    dropOffLocation: string;
    driverName?: string;
    status: LogisticsStatus;
}

export interface ScheduleItem {
    id: string;
    time: string;
    activity: string; // Soundcheck, Dinner, Show, etc.
    location: string;
    remindMe: boolean; // For "Recordatorios automáticos" simulation
}

export interface Artist {
    id: string;
    name: string;
    genre: string;
    stage: string;
    performanceTime: string;
    contactName: string;
    contactPhone: string;

    // Status Overview
    overallStatus: 'ok' | 'warning' | 'critical';
    pendingItemsCount: number;

    logistics: {
        hotels: HotelInfo[];
        flights: FlightInfo[];
        transports: TransportInfo[];
    };

    rider: {
        catering: { item: string; notes: string; status: boolean }[]; // status = fulfilled?
        technicalAttributes: { label: string; value: string }[];
        status: RiderStatus;
    };

    schedule: ScheduleItem[];
}

export const mockArtists: Artist[] = [
    {
        id: 'art-1',
        name: 'Villalobos',
        genre: 'Techno',
        stage: 'Main Stage',
        performanceTime: '2025-03-29T23:00:00',
        contactName: 'Hans Manager',
        contactPhone: '+49 123 456 789',
        overallStatus: 'warning',
        pendingItemsCount: 2,
        logistics: {
            hotels: [
                { id: 'h1', rooms: 2, roomType: 'Suite', hotelName: 'Hotel Colon', checkIn: '2025-03-28', checkOut: '2025-03-30', status: 'confirmed' },
                { id: 'h2', rooms: 4, roomType: 'Standard', hotelName: 'Hotel Colon', checkIn: '2025-03-28', checkOut: '2025-03-30', status: 'booked' }
            ],
            flights: [
                { id: 'f1', flightNumber: 'LH1120', departure: 'BER 10:00', arrival: 'SVQ 13:30', airline: 'Lufthansa', passengerCount: 6, status: 'confirmed' }
            ],
            transports: [
                { id: 'tr1', type: 'van', pickUpTime: '13:30', pickUpLocation: 'Aeropuerto SVQ', dropOffLocation: 'Hotel Colon', status: 'confirmed' },
                { id: 'tr2', type: 'van', pickUpTime: '20:00', pickUpLocation: 'Hotel', dropOffLocation: 'Recinto', status: 'pending' }
            ]
        },
        rider: {
            catering: [
                { item: 'Botellas Agua Premium', notes: 'Marca específica Fiji', status: true },
                { item: 'Fruta fresca cortada', notes: '', status: false },
                { item: 'Vino Tinto', notes: 'Rioja Alta', status: false }
            ],
            technicalAttributes: [
                { label: 'Mixer', value: 'Allen & Heath Xone:96' },
                { label: 'Monitores', value: 'L-Acoustics' }
            ],
            status: 'approved'
        },
        schedule: [
            { id: 'sch1', time: '20:30', activity: 'Recogida Hotel', location: 'Lobby Hotel', remindMe: true },
            { id: 'sch2', time: '21:30', activity: 'Prueba de Sonido', location: 'Main Stage', remindMe: true },
            { id: 'sch3', time: '23:00', activity: 'Show Start', location: 'Main Stage', remindMe: false }
        ]
    },
    {
        id: 'art-2',
        name: 'Henry Méndez',
        genre: 'Latino',
        stage: 'Second Stage',
        performanceTime: '2025-03-29T21:00:00',
        contactName: 'Pedro Booking',
        contactPhone: '+34 600 999 888',
        overallStatus: 'ok',
        pendingItemsCount: 0,
        logistics: {
            hotels: [
                { id: 'h3', rooms: 3, roomType: 'Double', hotelName: 'Hotel NH', checkIn: '2025-03-29', checkOut: '2025-03-30', status: 'confirmed' }
            ],
            flights: [], // Viene en furgo
            transports: [
                { id: 'tr3', type: 'van', pickUpTime: '19:00', pickUpLocation: 'Hotel NH', dropOffLocation: 'Recinto', status: 'confirmed' }
            ]
        },
        rider: {
            catering: [
                { item: 'Sandwiches variados', notes: 'Sin gluten para 1 persona', status: true },
                { item: 'Refrescos', notes: 'Coca Cola Zero', status: true }
            ],
            technicalAttributes: [
                { label: 'Micrófono', value: 'Shure SM58 Wireless' }
            ],
            status: 'approved'
        },
        schedule: [
            { id: 'sch4', time: '19:30', activity: 'Llegada Camerinos', location: 'Backstage', remindMe: false },
            { id: 'sch5', time: '21:00', activity: 'Show Start', location: 'Second Stage', remindMe: true }
        ]
    },
    {
        id: 'art-3',
        name: 'Local Hero',
        genre: 'Indie',
        stage: 'Third Stage',
        performanceTime: '2025-03-29T18:00:00',
        contactName: 'Ana Banda',
        contactPhone: '+34 611 222 333',
        overallStatus: 'critical',
        pendingItemsCount: 4,
        logistics: {
            hotels: [],
            flights: [],
            transports: []
        },
        rider: {
            catering: [],
            technicalAttributes: [],
            status: 'pending'
        },
        schedule: [
            { id: 'sch6', time: '16:00', activity: 'Prueba de Sonido', location: 'Third Stage', remindMe: true }
        ]
    }
];
