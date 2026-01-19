import { useState } from "react";
import { ArrowLeft, Instagram, Video, Youtube, Share2, Mail, Phone, User, FileText, CheckCircle2, Package, LayoutList, ShieldCheck, Plus, Pencil, Trash2, Clock, ExternalLink, AlertCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Influencer, InfluencerStatus, PostStatus, InfluencerCampaign, PostDeliverable, AdminDeliverable } from "@/data/influencerMockData";
import { format, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { CreateCampaignDialog, CreatePostDialog, CreateDeliverableDialog } from "./InfluencerCreationDialogs";
import { useToast } from "@/hooks/use-toast";

interface InfluencerDetailProps {
    influencer: Influencer;
    onBack: () => void;
    onUpdateStatus: (id: string, status: InfluencerStatus) => void;
    onUpdatePostStatus: (influencerId: string, postId: string, newStatus: PostStatus) => void;
    onAddCampaign: (influencerId: string, campaign: InfluencerCampaign) => void;
    onEditCampaign: (influencerId: string, campaign: InfluencerCampaign) => void;
    onDeleteCampaign: (influencerId: string, campaignId: string) => void;
    onAddPost: (influencerId: string, post: PostDeliverable) => void;
    onAddDeliverable: (influencerId: string, deliverable: AdminDeliverable) => void;
    onUpdateDeliverableStatus: (influencerId: string, deliverableId: string, newStatus: 'Pendiente' | 'Entregado') => void;
    onUpdateInfluencer: (id: string, updates: Partial<Influencer>) => void;
}

export function InfluencerDetail({
    influencer,
    onBack,
    onUpdateStatus,
    onUpdatePostStatus,
    onAddCampaign,
    onEditCampaign,
    onDeleteCampaign,
    onAddPost,
    onAddDeliverable,
    onUpdateDeliverableStatus,
    onUpdateInfluencer
}: InfluencerDetailProps) {
    const { toast } = useToast();
    // Local state for status
    const [currentStatus, setCurrentStatus] = useState<InfluencerStatus>(influencer.status);

    // Dialog states
    const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [isDeliverableDialogOpen, setIsDeliverableDialogOpen] = useState(false);

    // Selection state for editing
    const [selectedCampaign, setSelectedCampaign] = useState<InfluencerCampaign | null>(null);

    // Inline editing states
    const [isEditingResp, setIsEditingResp] = useState(false);
    const [respValue, setRespValue] = useState(influencer.assignedTo);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesValue, setNotesValue] = useState(influencer.notes || "");

    const handleStatusChange = (value: string) => {
        const newStatus = value as InfluencerStatus;
        setCurrentStatus(newStatus);
        onUpdateStatus(influencer.id, newStatus);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Instagram': return <Instagram className="h-5 w-5" />;
            case 'TikTok': return <Video className="h-5 w-5" />;
            case 'YouTube': return <Youtube className="h-5 w-5" />;
            default: return <Share2 className="h-5 w-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Activo': return 'text-green-600 bg-green-50 border-green-200';
            case 'Pendiente': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Finalizado': return 'text-slate-600 bg-slate-50 border-slate-200';
            default: return 'text-slate-600';
        }
    };

    // Compliance Calculation
    const allPosts = influencer.campaigns.flatMap(c => c.deliverables);
    const allAdminDeliverables = influencer.campaigns.flatMap(c => c.adminDeliverables || []);

    const totalItems = allPosts.length + allAdminDeliverables.length;
    const completedItems = allPosts.filter(p => p.status === 'Publicada').length +
        allAdminDeliverables.filter(d => d.status === 'Entregado').length;

    const compliancePercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;

    const hasOverdue = allPosts.some(p => p.status === 'Pendiente' && p.committedDate && isBefore(new Date(p.committedDate), startOfToday())) ||
        allAdminDeliverables.some(d => d.status === 'Pendiente' && d.deadline && isBefore(new Date(d.deadline), startOfToday()));

    const getComplianceColor = () => {
        if (compliancePercent === 100) return "bg-green-500 hover:bg-green-600 text-white border-transparent";
        if (hasOverdue) return "bg-red-500 hover:bg-red-600 text-white border-transparent";
        return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight">{influencer.name}</h2>
                            <Badge className={getComplianceColor()}>
                                {compliancePercent}% Cumplimiento
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            {getPlatformIcon(influencer.primaryPlatform)}
                            {influencer.category} • {influencer.contact.socialHandle}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-[180px]">
                        <Select value={currentStatus} onValueChange={handleStatusChange}>
                            <SelectTrigger className={`font-medium border ${getStatusColor(currentStatus)}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Finalizado">Finalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Top Info Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact & Responsibility */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Información General</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Responsable Interno</p>
                                        {isEditingResp ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Input
                                                    value={respValue}
                                                    onChange={e => setRespValue(e.target.value)}
                                                    className="h-8 text-xs"
                                                    autoFocus
                                                />
                                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                                                    onUpdateInfluencer(influencer.id, { assignedTo: respValue });
                                                    setIsEditingResp(false);
                                                }}>
                                                    <Save className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                                                    setRespValue(influencer.assignedTo);
                                                    setIsEditingResp(false);
                                                }}>
                                                    <X className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingResp(true)}>
                                                <p className="text-sm text-muted-foreground">{influencer.assignedTo}</p>
                                                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{influencer.contact.email || "—"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Teléfono</p>
                                        <p className="text-sm text-muted-foreground">{influencer.contact.phone || "—"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Notas Rápidas</p>
                                            {!isEditingNotes && (
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingNotes(true)}>
                                                    <Pencil className="h-3 w-3 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
                                        {isEditingNotes ? (
                                            <div className="space-y-2 mt-1">
                                                <Textarea
                                                    value={notesValue}
                                                    onChange={e => setNotesValue(e.target.value)}
                                                    className="text-xs min-h-[80px]"
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" className="h-7" onClick={() => {
                                                        setNotesValue(influencer.notes || "");
                                                        setIsEditingNotes(false);
                                                    }}>
                                                        Cancelar
                                                    </Button>
                                                    <Button size="sm" className="h-7" onClick={() => {
                                                        onUpdateInfluencer(influencer.id, { notes: notesValue });
                                                        setIsEditingNotes(false);
                                                    }}>
                                                        <Save className="h-3 w-3 mr-1" /> Guardar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic min-h-[60px] p-2 bg-muted/30 rounded mt-1 cursor-pointer" onClick={() => setIsEditingNotes(true)}>
                                                {influencer.notes || "Sin notas rápidas. Haz clic para añadir."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Última actualización</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(influencer.updatedAt), "d MMM yyyy, HH:mm", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats / Quick Overview (Placeholder for now) */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Alcance Estimado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">
                            {(influencer.totalReach / 1000).toFixed(1)}K
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Seguidores totales</p>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Engagement</span>
                                <span className="font-medium">— %</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Campañas</span>
                                <span className="font-medium">{influencer.campaigns?.length || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Main Tabs */}
            <Tabs defaultValue="campaigns" className="w-full">
                <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
                    <TabsTrigger value="campaigns" className="gap-2">
                        <LayoutList className="h-4 w-4" /> Campañas
                    </TabsTrigger>
                    <TabsTrigger value="posts" className="gap-2">
                        <Share2 className="h-4 w-4" /> Publicaciones
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="gap-2">
                        <Package className="h-4 w-4" /> Entregables
                    </TabsTrigger>
                    <TabsTrigger value="compliance" className="gap-2">
                        <ShieldCheck className="h-4 w-4" /> Cumplimiento
                    </TabsTrigger>
                </TabsList>


                <div className="mt-6">
                    <TabsContent value="campaigns">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Campañas</h3>
                            <Button onClick={() => { setSelectedCampaign(null); setIsCampaignDialogOpen(true); }} size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Nueva Campaña
                            </Button>
                        </div>

                        {influencer.campaigns.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-muted/10 border-dashed">
                                <LayoutList className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground mb-4">No hay campañas asignadas a este influencer.</p>
                                <Button variant="outline" onClick={() => { setSelectedCampaign(null); setIsCampaignDialogOpen(true); }}>
                                    Crear primera campaña
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {influencer.campaigns.map((campaign) => (
                                    <Card key={campaign.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-base font-semibold">{campaign.name}</CardTitle>
                                                            <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={campaign.status === 'Activa' ? 'default' : campaign.status === 'Planificada' ? 'outline' : 'secondary'}>
                                                                {campaign.status}
                                                            </Badge>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelectedCampaign(campaign); setIsCampaignDialogOpen(true); }}>
                                                                    <Pencil className="h-3 w-3" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDeleteCampaign(influencer.id, campaign.id)}>
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Rol</p>
                                                    <p>{campaign.role}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Fechas</p>
                                                    <p>
                                                        {campaign.startDate ? format(new Date(campaign.startDate), 'd MMM', { locale: es }) : 'TBD'}
                                                        {' - '}
                                                        {campaign.endDate ? format(new Date(campaign.endDate), 'd MMM', { locale: es }) : 'TBD'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Fee</p>
                                                    <p>{campaign.fee ? `${campaign.fee}€` : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-muted-foreground">Entregables</p>
                                                    <p>{campaign.deliverables.length}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="posts">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Publicaciones</h3>
                            <Button onClick={() => setIsPostDialogOpen(true)} size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Nueva Publicación
                            </Button>
                        </div>

                        {(!influencer.campaigns || influencer.campaigns.every(c => c.deliverables.length === 0)) ? (
                            <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-muted/10 border-dashed">
                                <Share2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground mb-4">No hay publicaciones comprometidas.</p>
                                <Button variant="outline" onClick={() => setIsPostDialogOpen(true)}>
                                    Añadir publicación manual
                                </Button>
                            </div>
                        ) : (
                            <Card>
                                <CardHeader className="pb-3 px-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold">Checklist de Publicaciones</CardTitle>
                                        {(() => {
                                            const allPosts = influencer.campaigns.flatMap(c => c.deliverables);
                                            const pending = allPosts.filter(p => p.status === 'Pendiente').length;
                                            const published = allPosts.filter(p => p.status === 'Publicada').length;
                                            return (
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                        {pending} Pendientes
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        {published} Listas
                                                    </Badge>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {influencer.campaigns.flatMap(c => c.deliverables.map(d => ({ ...d, campaignName: c.name }))).sort((a, b) => new Date(a.committedDate).getTime() - new Date(b.committedDate).getTime()).map((post, index) => {
                                            const isOverdue = post.status === 'Pendiente' && isBefore(new Date(post.committedDate), startOfToday());

                                            return (
                                                <div key={index} className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${post.status === 'Publicada' ? 'opacity-70' : ''} ${isOverdue ? 'bg-red-50/50' : ''}`}>
                                                    <div
                                                        className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer flex-shrink-0 ${post.status === 'Publicada' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'} ${isOverdue ? 'border-red-500' : ''}`}
                                                        onClick={() => {
                                                            const newStatus = post.status === 'Publicada' ? 'Pendiente' : 'Publicada';
                                                            onUpdatePostStatus(influencer.id, post.id, newStatus);
                                                        }}
                                                    >
                                                        {post.status === 'Publicada' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-medium truncate ${post.status === 'Publicada' ? 'line-through text-muted-foreground' : ''}`}>{post.concept}</span>
                                                            <Badge variant="outline" className="text-[10px] h-5">{post.campaignName}</Badge>
                                                            {isOverdue && (
                                                                <Badge variant="destructive" className="text-[10px] h-5 gap-1">
                                                                    <AlertCircle className="h-3 w-3" /> Fuera de plazo
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1 capitalize">
                                                                {getPlatformIcon(post.platform)} {post.type}
                                                            </span>
                                                            <span>•</span>
                                                            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                                                                {format(new Date(post.committedDate), "d 'de' MMMM", { locale: es })}
                                                            </span>
                                                            {post.link && (
                                                                <>
                                                                    <span>•</span>
                                                                    <a href={post.link.startsWith('http') ? post.link : `https://${post.link}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium">
                                                                        <ExternalLink className="h-3 w-3" /> Ver Post
                                                                    </a>
                                                                </>
                                                            )}
                                                        </div>
                                                        {post.notes && (
                                                            <p className="mt-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md border border-muted italic">
                                                                {post.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Badge variant={post.status === 'Publicada' ? 'default' : isOverdue ? 'destructive' : 'secondary'} className="whitespace-nowrap">
                                                            {post.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="deliverables">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Entregables Admin</h3>
                            <Button onClick={() => setIsDeliverableDialogOpen(true)} size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Entregable
                            </Button>
                        </div>

                        {allAdminDeliverables.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-muted/10 border-dashed">
                                <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground mb-4">No hay entregables administrativos registrados</p>
                                <Button variant="outline" onClick={() => setIsDeliverableDialogOpen(true)}>
                                    Crear registro
                                </Button>
                            </div>
                        ) : (
                            <Card>
                                <CardHeader className="pb-3 px-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold">Seguimiento de Entregables</CardTitle>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                {allAdminDeliverables.filter(d => d.status === 'Pendiente').length} Pendientes
                                            </Badge>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {allAdminDeliverables.filter(d => d.status === 'Entregado').length} OK
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {influencer.campaigns.flatMap(c => (c.adminDeliverables || []).map(d => ({ ...d, campaignName: c.name }))).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map((del, index) => {
                                            const isOverdue = del.status === 'Pendiente' && isBefore(new Date(del.deadline), startOfToday());

                                            return (
                                                <div key={index} className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${del.status === 'Entregado' ? 'opacity-70' : ''} ${isOverdue ? 'bg-red-50/50' : ''}`}>
                                                    <div
                                                        className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center cursor-pointer flex-shrink-0 ${del.status === 'Entregado' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'} ${isOverdue ? 'border-red-500' : ''}`}
                                                        onClick={() => {
                                                            const newStatus = del.status === 'Entregado' ? 'Pendiente' : 'Entregado';
                                                            onUpdateDeliverableStatus(influencer.id, del.id, newStatus);
                                                        }}
                                                    >
                                                        {del.status === 'Entregado' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-medium truncate ${del.status === 'Entregado' ? 'line-through text-muted-foreground' : ''}`}>{del.name}</span>
                                                            <Badge variant="outline" className="text-[10px] h-5">{del.campaignName}</Badge>
                                                            {isOverdue && (
                                                                <Badge variant="destructive" className="text-[10px] h-5 gap-1">
                                                                    <AlertCircle className="h-3 w-3" /> Fuera de plazo
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                                                {del.type}
                                                            </span>
                                                            <span>•</span>
                                                            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                                                                Portalímite: {format(new Date(del.deadline), "d 'de' MMMM", { locale: es })}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" /> {del.responsible}
                                                            </span>
                                                        </div>
                                                        {del.notes && (
                                                            <p className="mt-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md border border-muted italic">
                                                                {del.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Badge variant={del.status === 'Entregado' ? 'default' : isOverdue ? 'destructive' : 'secondary'} className="whitespace-nowrap">
                                                            {del.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="compliance">
                        {(() => {
                            const allPosts = influencer.campaigns.flatMap(c => c.deliverables);
                            const allAdminDeliverables = influencer.campaigns.flatMap(c => (c.adminDeliverables || []));

                            const totalItems = allPosts.length + allAdminDeliverables.length;

                            const totalPublishedPosts = allPosts.filter(p => p.status === 'Publicada').length;
                            const totalEntregadosAdmin = allAdminDeliverables.filter(d => d.status === 'Entregado').length;

                            const totalOverduePosts = allPosts.filter(p => p.status === 'Pendiente' && isBefore(new Date(p.committedDate), startOfToday())).length;
                            const totalOverdueAdminDeliverables = allAdminDeliverables.filter(d => d.status === 'Pendiente' && isBefore(new Date(d.deadline), startOfToday())).length;

                            const totalCompletedItems = totalPublishedPosts + totalEntregadosAdmin;
                            const compliancePercent = totalItems > 0 ? (totalCompletedItems / totalItems) * 100 : 0;
                            const hasOverdue = totalOverduePosts > 0 || totalOverdueAdminDeliverables > 0;

                            return (
                                totalItems === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-muted/10 border-dashed">
                                        <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                        <p className="text-muted-foreground">No hay actividad para evaluar cumplimiento.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Publicaciones Social Media</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-2xl font-bold">{((totalPublishedPosts / allPosts.length) * 100 || 0).toFixed(0)}%</span>
                                                            <span className="text-sm text-muted-foreground">{totalPublishedPosts} de {allPosts.length}</span>
                                                        </div>
                                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all ${((totalPublishedPosts / allPosts.length) * 100 || 0) === 100 ? 'bg-green-500' : totalOverduePosts > 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                                                                style={{ width: `${((totalPublishedPosts / allPosts.length) * 100 || 0)}%` }}
                                                            />
                                                        </div>
                                                        {totalOverduePosts > 0 && (
                                                            <p className="text-xs text-red-500 mt-2 font-medium">⚠️ {totalOverduePosts} publicaciones fuera de plazo</p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Entregables Administrativos</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-2xl font-bold">{((totalEntregadosAdmin / allAdminDeliverables.length) * 100 || 0).toFixed(0)}%</span>
                                                            <span className="text-sm text-muted-foreground">{totalEntregadosAdmin} de {allAdminDeliverables.length}</span>
                                                        </div>
                                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all ${((totalEntregadosAdmin / allAdminDeliverables.length) * 100 || 0) === 100 ? 'bg-green-500' : totalOverdueAdminDeliverables > 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                                                                style={{ width: `${((totalEntregadosAdmin / allAdminDeliverables.length) * 100 || 0)}%` }}
                                                            />
                                                        </div>
                                                        {totalOverdueAdminDeliverables > 0 && (
                                                            <p className="text-xs text-red-500 mt-2 font-medium">⚠️ {totalOverdueAdminDeliverables} entregables fuera de plazo</p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card className="bg-muted/30">
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-1">Puntuación Total de Cumplimiento</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Basado en el compromiso total de {totalItems} ítems.
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-4xl font-black ${compliancePercent === 100 ? 'text-green-600' : hasOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                                                            {compliancePercent.toFixed(0)}%
                                                        </div>
                                                        <Badge variant="outline" className="mt-1">Nivel: {compliancePercent === 100 ? 'Excelente' : compliancePercent > 70 ? 'Bueno' : 'Crítico'}</Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            );
                        })()}
                    </TabsContent>
                </div>
            </Tabs>

            <CreateCampaignDialog
                open={isCampaignDialogOpen}
                onOpenChange={setIsCampaignDialogOpen}
                onSave={(campaign) => {
                    if (selectedCampaign) {
                        onEditCampaign(influencer.id, campaign);
                    } else {
                        onAddCampaign(influencer.id, campaign);
                    }
                }}
                initialData={selectedCampaign}
            />

            <CreatePostDialog
                open={isPostDialogOpen}
                onOpenChange={setIsPostDialogOpen}
                onSave={(post) => onAddPost(influencer.id, post)}
                campaigns={influencer.campaigns}
            />

            <CreateDeliverableDialog
                open={isDeliverableDialogOpen}
                onOpenChange={setIsDeliverableDialogOpen}
                onSave={(data) => onAddDeliverable ? onAddDeliverable(influencer.id, data) : null}
                campaigns={influencer.campaigns}
            />
        </div>
    );
}
