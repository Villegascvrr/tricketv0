import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { InfluencerCampaign, PostDeliverable, InfluencerPlatform, ContentType, AdminDeliverable, AdminDeliverableType } from "@/data/influencerMockData";

// --- Types for Props ---

interface CreateCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (campaign: InfluencerCampaign) => void;
    initialData?: InfluencerCampaign | null;
}

interface CreatePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (post: PostDeliverable) => void;
    campaigns: InfluencerCampaign[]; // To select which campaign it belongs to
}

interface CreateDeliverableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: AdminDeliverable) => void;
    campaigns: InfluencerCampaign[];
}

// --- Component 1: Create Campaign Dialog ---

export function CreateCampaignDialog({ open, onOpenChange, onSave, initialData }: CreateCampaignDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState<'Ambassador' | 'One-off' | 'VIP Guest'>('One-off');
    const [status, setStatus] = useState<'Planificada' | 'Activa' | 'Cerrada'>('Planificada');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [fee, setFee] = useState("");

    // Effect to load initial data when open or initialData changes
    useEffect(() => {
        if (open && initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setRole(initialData.role);
            setStatus(initialData.status);
            setStartDate(initialData.startDate || "");
            setEndDate(initialData.endDate || "");
            setFee(initialData.fee ? initialData.fee.toString() : "");
        } else if (open && !initialData) {
            // Reset if opening in create mode
            setName("");
            setDescription("");
            setRole("One-off");
            setStatus("Planificada");
            setStartDate("");
            setEndDate("");
            setFee("");
        }
    }, [open, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCampaign: InfluencerCampaign = {
            id: initialData ? initialData.id : `cmp-${Date.now()}`, // Keep ID if editing
            name,
            description,
            role,
            status,
            startDate,
            endDate,
            fee: fee ? Number(fee) : undefined,
            deliverables: initialData ? initialData.deliverables : [] // Keep deliverables if editing
        };
        onSave(newCampaign);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Campaña" : "Nueva Campaña"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="camp-name">Nombre de la Campaña</Label>
                        <Input id="camp-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Lanzamiento Verano" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="camp-desc">Descripción</Label>
                        <Textarea id="camp-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalles de la campaña..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Rol del Influencer</Label>
                            <Select value={role} onValueChange={(val: any) => setRole(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="One-off">One-off</SelectItem>
                                    <SelectItem value="Ambassador">Ambassador</SelectItem>
                                    <SelectItem value="VIP Guest">VIP Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planificada">Planificada</SelectItem>
                                    <SelectItem value="Activa">Activa</SelectItem>
                                    <SelectItem value="Cerrada">Cerrada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Fecha Inicio</Label>
                            <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date">Fecha Fin</Label>
                            <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fee">Fee / Presupuesto</Label>
                        <Input id="fee" type="number" value={fee} onChange={e => setFee(e.target.value)} placeholder="0.00" />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit">{initialData ? "Guardar Cambios" : "Guardar Campaña"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- Component 2: Create Post Dialog ---

export function CreatePostDialog({ open, onOpenChange, onSave, campaigns }: CreatePostDialogProps) {
    const [campaignId, setCampaignId] = useState<string>("");
    const [concept, setConcept] = useState("");
    const [platform, setPlatform] = useState<InfluencerPlatform>('Instagram');
    const [type, setType] = useState<ContentType>('story');
    const [date, setDate] = useState("");
    const [status, setStatus] = useState<'Pendiente' | 'Publicada'>('Pendiente');
    const [link, setLink] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (open && campaigns.length > 0 && !campaignId) {
            setCampaignId(campaigns[0].id);
        }
    }, [open, campaigns, campaignId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPost: PostDeliverable = {
            id: `post-${Date.now()}`,
            campaignId,
            concept,
            platform,
            type,
            committedDate: date || new Date().toISOString(),
            status,
            link: link || undefined,
            notes: notes || undefined
        };
        onSave(newPost);
        onOpenChange(false);
        // Reset
        setConcept("");
        setDate("");
        setLink("");
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nueva Publicación</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="post-campaign">Campaña Asociada</Label>
                        <Select value={campaignId} onValueChange={setCampaignId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar campaña" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {campaigns.length === 0 && <p className="text-xs text-red-500">Crea una campaña primero.</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="post-concept">Concepto / Idea</Label>
                        <Input id="post-concept" required value={concept} onChange={e => setConcept(e.target.value)} placeholder="Ej. Story cuenta atrás" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Plataforma</Label>
                            <Select value={platform} onValueChange={(val: any) => setPlatform(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="TikTok">TikTok</SelectItem>
                                    <SelectItem value="YouTube">YouTube</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={type} onValueChange={(val: any) => setType(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="story">Story</SelectItem>
                                    <SelectItem value="reel">Reel</SelectItem>
                                    <SelectItem value="post">Post</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                    <SelectItem value="youtube">YouTube Video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="post-date">Fecha Comprometida</Label>
                            <Input id="post-date" type="date" required value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Estado Inicial</Label>
                            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                                    <SelectItem value="Publicada">Publicada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="post-link">Enlace (Opcional)</Label>
                        <Input id="post-link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="post-notes">Notas / Observaciones</Label>
                        <Textarea id="post-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Detalles adicionales..." />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={campaigns.length === 0}>Guardar Publicación</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- Component 3: Create Deliverable Dialog ---
export function CreateDeliverableDialog({ open, onOpenChange, onSave, campaigns }: CreateDeliverableDialogProps) {
    const [campaignId, setCampaignId] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState<AdminDeliverableType>('otro');
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState<'Pendiente' | 'Entregado'>('Pendiente');
    const [responsible, setResponsible] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (open && campaigns.length > 0 && !campaignId) {
            setCampaignId(campaigns[0].id);
        }
    }, [open, campaigns, campaignId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const deliverable: AdminDeliverable = {
            id: `del-${Date.now()}`,
            campaignId,
            name,
            type,
            deadline,
            status,
            responsible,
            notes: notes || undefined
        };
        onSave(deliverable);
        onOpenChange(false);
        // Reset
        setName("");
        setDeadline("");
        setResponsible("");
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Entregable</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="del-campaign">Campaña Asociada</Label>
                        <Select value={campaignId} onValueChange={setCampaignId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar campaña" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="del-name">Nombre del Entregable</Label>
                        <Input id="del-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Firma de contrato, Asistencia a cena..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={type} onValueChange={(val: any) => setType(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="post">Post</SelectItem>
                                    <SelectItem value="story">Story</SelectItem>
                                    <SelectItem value="asistencia">Asistencia</SelectItem>
                                    <SelectItem value="mención">Mención</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                                    <SelectItem value="Entregado">Entregado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="del-deadline">Fecha Límite</Label>
                            <Input id="del-deadline" type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="del-resp">Responsable Interno</Label>
                            <Input id="del-resp" required value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Ej. Marta C." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="del-notes">Notas / Observaciones</Label>
                        <Textarea id="del-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Detalles o instrucciones..." />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={!campaigns || campaigns.length === 0}>Guardar Entregable</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
