
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Agreement, AgreementType, AgreementStatus, agreementLabels, agreementStatusLabels } from "@/data/sponsorsMockData";

interface AgreementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (agreement: Omit<Agreement, "id">) => void;
    initialData?: Agreement | null;
}

export function AgreementDialog({ open, onOpenChange, onSubmit, initialData }: AgreementDialogProps) {
    const [formData, setFormData] = useState<Omit<Agreement, "id">>({
        description: "",
        type: "economico",
        amount: 0,
        startDate: "",
        endDate: "",
        status: "propuesto",
        notes: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description,
                type: initialData.type,
                amount: initialData.amount,
                startDate: initialData.startDate,
                endDate: initialData.endDate,
                status: initialData.status,
                notes: initialData.notes || ""
            });
        } else {
            // Reset or set defaults for new entry
            setFormData({
                description: "",
                type: "economico",
                amount: 0,
                startDate: "",
                endDate: "",
                status: "propuesto",
                notes: ""
            });
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        if (!formData.description) return;
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Acuerdo" : "Nuevo Acuerdo"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Modifica los detalles del acuerdo." : "Registra un nuevo acuerdo para esta marca."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ej: Exclusividad barra VIP"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: AgreementType) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(agreementLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: AgreementStatus) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(agreementStatusLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Importe (€)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Fecha Inicio</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">Fecha Fin</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas / Observaciones</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Detalles sobre pagos, condiciones, etc..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>{initialData ? "Guardar" : "Crear"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
