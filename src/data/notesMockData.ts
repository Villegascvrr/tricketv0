
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Note {
    id: string;
    entityId: string;
    entityType: 'task' | 'artist' | 'provider' | 'sponsor';
    content: string;
    author: string;
    createdAt: string; // ISO String
    priority: PriorityLevel;
    responsible?: string; // Name of the person responsible for the action in the note
    reminderDate?: string; // ISO String for reminder
}

export const initialNotes: Note[] = [
    {
        id: '1',
        entityId: 'a1', // Artist 1
        entityType: 'artist',
        content: "Revisar cláusula de cancelación por lluvia. Urgente coordinar con legal.",
        author: "Ana García",
        createdAt: "2024-05-10T10:00:00Z",
        priority: 'high',
        responsible: "Carlos Legal",
        reminderDate: "2024-05-12T09:00:00Z"
    },
    {
        id: '2',
        entityId: 'p1', // Provider 1
        entityType: 'provider',
        content: "El presupuesto incluye montaje pero no desmontaje. Confirmar coste extra.",
        author: "Juan Pérez",
        createdAt: "2024-05-15T14:30:00Z",
        priority: 'medium',
        responsible: "Lucía Ops"
    },
    {
        id: '3',
        entityId: 's1', // Sponsor 1
        entityType: 'sponsor',
        content: "Pendiente enviar logos vectorizados para el cartel principal.",
        author: "María Marketing",
        createdAt: "2024-06-01T11:20:00Z",
        priority: 'low',
        responsible: "Diseño Team"
    }
];
