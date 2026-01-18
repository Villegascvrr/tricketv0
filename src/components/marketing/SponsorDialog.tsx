
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sponsor, SponsorCategory, SponsorStatus, AgreementType, teamMembers, categoryLabels, statusLabels, agreementLabels } from "@/data/sponsorsMockData";

interface SponsorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (sponsor: Omit<Sponsor, "id" | "created_at" | "updated_at">) => void;
    initialData?: Sponsor | null;
}

export function SponsorDialog({ open, onOpenChange, onSubmit, initialData }: SponsorDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        category: "bebidas" as SponsorCategory,
        internal_responsible: teamMembers[0],
        status: "pendiente" as SponsorStatus,
        agreement_type: "economico" as AgreementType,
        notes: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                internal_responsible: initialData.internal_responsible,
                status: initialData.status,
                agreement_type: initialData.agreement_type,
                notes: initialData.notes || ""
            });
        } else {
            setFormData({
                name: "",
                category: "bebidas",
                internal_responsible: teamMembers[0],
                status: "pendiente",
                agreement_type: "economico",
                notes: ""
            });
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        if (!formData.name) return;
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Modifica los datos del patrocinador." : "Añade un nuevo patrocinador a la lista."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre Marca *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Red Bull"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: SponsorCategory) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categoryLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: SponsorStatus) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tipo Acuerdo</Label>
                            <Select
                                value={formData.agreement_type}
                                onValueChange={(val: AgreementType) => setFormData({ ...formData, agreement_type: val })}
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
                            <Label>Responsable</Label>
                            <Select
                                value={formData.internal_responsible}
                                onValueChange={(val) => setFormData({ ...formData, internal_responsible: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamMembers.map((member) => (
                                        <SelectItem key={member} value={member}>{member}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas generales</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Detalles sobre el acuerdo o estado..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>{initialData ? "Guardar Cambios" : "Crear Marca"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
