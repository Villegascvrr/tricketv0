
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, User, Link, Eye, Instagram, Linkedin, Twitter, Video, Image as ImageIcon, MessageSquare, Clock } from "lucide-react";
import { Publication, PublicationStatus, publicationStatusLabels, publicationPlatformLabels, publicationTypeLabels, PublicationPlatform, PublicationType } from "@/data/sponsorsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PublicationListProps {
    publications: Publication[];
    onAdd: (p: Omit<Publication, "id">) => void;
    onUpdateStatus: (id: string, status: PublicationStatus) => void;
    onDelete: (id: string) => void;
}

export function PublicationList({ publications, onAdd, onUpdateStatus, onDelete }: PublicationListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newPublication, setNewPublication] = useState<Partial<Publication>>({
        platform: 'instagram',
        type: 'post',
        status: 'pendiente'
    });

    const handleAddSubmit = () => {
        if (!newPublication.account || !newPublication.date) return;

        onAdd({
            platform: newPublication.platform as PublicationPlatform,
            type: newPublication.type as PublicationType,
            account: newPublication.account,
            status: 'pendiente',
            date: newPublication.date, // Assuming YYYY-MM-DD from input
            url: newPublication.url,
            notes: newPublication.notes
        });

        setNewPublication({ platform: 'instagram', type: 'post', status: 'pendiente', account: '', date: '', url: '', notes: '' });
        setIsAddOpen(false);
    };

    const getPlatformIcon = (platform: PublicationPlatform) => {
        switch (platform) {
            case 'instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
            case 'tiktok': return <Video className="h-4 w-4 text-black" />; // No simple TikTok icon in lucide yet, using generic Video
            case 'x': return <Twitter className="h-4 w-4 text-primary" />;
            case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
            default: return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getTypeIcon = (type: PublicationType) => {
        switch (type) {
            case 'post': return <ImageIcon className="h-3 w-3" />;
            case 'story': return <Clock className="h-3 w-3" />;
            case 'reel': return <Video className="h-3 w-3" />;
            case 'video': return <Video className="h-3 w-3" />;
            case 'tweet': return <MessageSquare className="h-3 w-3" />;
            default: return <Link className="h-3 w-3" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Publicaciones ({publications.length})
                </h3>
                <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Nueva Publicación
                </Button>
            </div>

            <div className="space-y-3">
                {publications.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <Eye className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground text-sm">No hay publicaciones planificadas.</p>
                        </CardContent>
                    </Card>
                ) : (
                    publications.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-3 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                            {/* Icon & Platform */}
                            <div className="flex items-center gap-3 min-w-[120px]">
                                <div className="bg-muted p-2 rounded-full">
                                    {getPlatformIcon(item.platform)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium capitalize">{publicationPlatformLabels[item.platform]}</span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        {getTypeIcon(item.type)} {publicationTypeLabels[item.type]}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 w-full text-center sm:text-left grid grid-cols-2 sm:flex sm:items-center gap-4 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cuenta</span>
                                    <span className="font-medium truncate max-w-[120px]" title={item.account}>@{item.account}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Fecha</span>
                                    <span className="font-medium">
                                        {item.date ? format(new Date(item.date), "dd MMM", { locale: es }) : "—"}
                                    </span>
                                </div>

                                {/* Notes or Link */}
                                <div className="col-span-2 sm:col-span-1 min-w-[150px] flex items-center justify-center sm:justify-start">
                                    {item.url ? (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                                            <Link className="h-3 w-3" /> Ver Publicación
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic truncate max-w-[150px]">{item.notes || "Sin notas"}</span>
                                    )}
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0">
                                <Select
                                    value={item.status}
                                    onValueChange={(val) => onUpdateStatus(item.id, val as PublicationStatus)}
                                >
                                    <SelectTrigger className={`h-7 w-[110px] text-xs ${item.status === 'publicada' ? 'text-success border-success/30 bg-success/5' : 'text-muted-foreground'}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="publicada">Publicada</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva Publicación</DialogTitle>
                        <DialogDescription>Planifica un post o story comprometido.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Plataforma</Label>
                                <Select
                                    value={newPublication.platform}
                                    onValueChange={(val) => setNewPublication({ ...newPublication, platform: val as PublicationPlatform })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(publicationPlatformLabels).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={newPublication.type}
                                    onValueChange={(val) => setNewPublication({ ...newPublication, type: val as PublicationType })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(publicationTypeLabels).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cuenta / Perfil</Label>
                                <Input
                                    placeholder="Ej: Primaverando"
                                    value={newPublication.account}
                                    onChange={(e) => setNewPublication({ ...newPublication, account: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha Comprometida</Label>
                                <Input
                                    type="date"
                                    value={newPublication.date}
                                    onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Enlace (Opcional)</Label>
                            <Input
                                placeholder="https://..."
                                value={newPublication.url}
                                onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Textarea
                                placeholder="Detalles del copy, menciones obligatorias..."
                                value={newPublication.notes}
                                onChange={(e) => setNewPublication({ ...newPublication, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddSubmit}>Añadir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
