import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { NotesSystem } from "./NotesSystem";

interface NotesSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityId: string;
    entityType: 'task' | 'artist' | 'provider' | 'sponsor';
    entityName: string; // To display in header
}

export function NotesSheet({ open, onOpenChange, entityId, entityType, entityName }: NotesSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
                <SheetHeader className="pb-4 border-b mb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Notas & Comentarios
                    </SheetTitle>
                    <SheetDescription>
                        Historial para: <span className="font-semibold text-foreground">{entityName}</span>
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    <NotesSystem
                        entityId={entityId}
                        entityType={entityType}
                        className="pb-4"
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
