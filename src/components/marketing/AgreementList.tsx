
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Calendar, FileText, Euro, Handshake } from "lucide-react";
import { Agreement, agreementLabels, agreementStatusLabels } from "@/data/sponsorsMockData";
import { AgreementDialog } from "./AgreementDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface AgreementListProps {
    agreements: Agreement[];
    onAdd: (agreement: Omit<Agreement, "id">) => void;
    onUpdate: (id: string, updates: Partial<Agreement>) => void;
    onDelete: (id: string) => void;
}

export function AgreementList({ agreements, onAdd, onUpdate, onDelete }: AgreementListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleCreate = (data: Omit<Agreement, "id">) => {
        onAdd(data);
        setIsDialogOpen(false);
    };

    const handleEdit = (data: Omit<Agreement, "id">) => {
        if (editingAgreement) {
            onUpdate(editingAgreement.id, data);
            setEditingAgreement(null);
            setIsDialogOpen(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aceptado': return 'bg-success/10 text-success border-success/20';
            case 'cerrado': return 'bg-muted text-muted-foreground border-border';
            case 'propuesto': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Handshake className="h-4 w-4" />
                    Lista de Acuerdos ({agreements.length})
                </h3>
                <Button size="sm" onClick={() => { setEditingAgreement(null); setIsDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Acuerdo
                </Button>
            </div>

            <div className="grid gap-4">
                {agreements.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground text-sm">No hay acuerdos registrados para esta marca.</p>
                        </CardContent>
                    </Card>
                ) : (
                    agreements.map((agreement) => (
                        <Card key={agreement.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row border-l-4 border-l-primary/50">
                                {/* Left: Info */}
                                <div className="p-4 flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-base">{agreement.description}</h4>
                                                <Badge variant="outline" className={`font-normal text-[10px] ${getStatusColor(agreement.status)}`}>
                                                    {agreementStatusLabels[agreement.status]}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">{agreementLabels[agreement.type]}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        {(agreement.startDate || agreement.endDate) && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {agreement.startDate ? format(new Date(agreement.startDate), "d MMM yy", { locale: es }) : "?"}
                                                    {" - "}
                                                    {agreement.endDate ? format(new Date(agreement.endDate), "d MMM yy", { locale: es }) : "?"}
                                                </span>
                                            </div>
                                        )}
                                        {agreement.amount !== undefined && agreement.amount > 0 && (
                                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                <Euro className="h-3.5 w-3.5" />
                                                {agreement.amount.toLocaleString('es-ES')} €
                                            </div>
                                        )}
                                    </div>

                                    {agreement.notes && (
                                        <div className="bg-muted/30 p-2 rounded text-xs mt-2">
                                            {agreement.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Actions */}
                                <div className="bg-muted/10 p-2 sm:p-4 flex sm:flex-col items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingAgreement(agreement); setIsDialogOpen(true); }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(agreement.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <AgreementDialog
                open={isDialogOpen}
                onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingAgreement(null); }}
                onSubmit={editingAgreement ? handleEdit : handleCreate}
                initialData={editingAgreement}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar acuerdo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }} className="bg-destructive">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
