import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    ChevronRight,
    ArrowLeft,
    Plus,
    Instagram,
    Youtube,
    Twitter,
    Video,
    Share2,
    Users,
    Search,
    Filter,
    CheckCircle2,
    Clock
} from "lucide-react";

import {
    Influencer,
    demoInfluencers,
    ContentType,
    PostStatus
} from "@/data/influencerMockData";
import { cn } from "@/lib/utils";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";
import PageBreadcrumb from "../PageBreadcrumb";

export function InfluencerManager() {
    const { isDemo } = useFestivalConfig();
    const initialData = isDemo ? demoInfluencers : [];

    const [influencers, setInfluencers] = useState<Influencer[]>(initialData);
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInfluencers = influencers.filter(inf =>
        inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inf.niche.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'contacted': return 'secondary';
            case 'negotiating': return 'warning';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <Instagram className="h-3 w-3" />;
            case 'tiktok': return <Video className="h-3 w-3" />; // Using Video as close proxy for TikTok
            case 'youtube': return <Youtube className="h-3 w-3" />;
            default: return <Share2 className="h-3 w-3" />;
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    if (selectedInfluencer) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-6 space-y-4">
                <PageBreadcrumb items={[
                    { label: "Marketing", href: "/marketing" },
                    { label: "Influencers", href: "/marketing/influencers" },
                    { label: selectedInfluencer.name }
                ]} />

                <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedInfluencer(null)} className="h-8 gap-1 pl-1">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold leading-none flex items-center gap-2">
                            {selectedInfluencer.name}
                            <Badge variant={getStatusVariant(selectedInfluencer.status)} className="text-[10px] font-normal">
                                {selectedInfluencer.status.toUpperCase()}
                            </Badge>
                        </h2>
                        <span className="text-xs text-muted-foreground mt-1">
                            Responsable: {selectedInfluencer.assignedTo}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Column 1: Profile & Stats */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium uppercase tracking-wide">Perfil Social</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-xs text-muted-foreground font-semibold">Nichos</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedInfluencer.niche.map(n => (
                                            <Badge key={n} variant="secondary" className="text-[10px]">{n}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <h4 className="text-xs text-muted-foreground font-semibold">Métricas</h4>
                                    {selectedInfluencer.socials.map((social, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-background p-1.5 rounded-full border">
                                                    {getPlatformIcon(social.platform)}
                                                </div>
                                                <span className="font-medium">{social.handle}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{formatNumber(social.followers)}</div>
                                                <div className="text-[10px] text-muted-foreground">{social.engagementRate}% Eng.</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm font-semibold">Alcance Total</span>
                                        <span className="text-lg font-bold text-primary">{formatNumber(selectedInfluencer.totalReach)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2: Campaigns & Deliverables */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Card className="h-full">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium uppercase tracking-wide">Campañas Activas & Entregables</CardTitle>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                    <Plus className="h-3 w-3" /> Nueva Campaña
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {selectedInfluencer.campaigns.length > 0 ? (
                                    selectedInfluencer.campaigns.map(campaign => (
                                        <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-base flex items-center gap-2">
                                                        {campaign.name}
                                                        <Badge variant="outline" className="text-[10px]">{campaign.role}</Badge>
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">Fee: {campaign.fee ? `${campaign.fee} €` : 'N/A'}</p>
                                                </div>
                                                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                                            </div>

                                            <div className="space-y-2 mt-2">
                                                <h5 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> Checklist de Publicaciones
                                                </h5>
                                                <div className="grid gap-2">
                                                    {campaign.deliverables.map(post => (
                                                        <div key={post.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded hover:bg-muted/40 transition-colors">
                                                            <Checkbox checked={post.status === 'posted'} id={post.id} />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <label htmlFor={post.id} className={cn("text-sm font-medium cursor-pointer", post.status === 'posted' && "line-through text-muted-foreground")}>
                                                                        {post.concept}
                                                                    </label>
                                                                    <Badge variant="secondary" className="text-[9px] uppercase h-5">{post.type}</Badge>
                                                                </div>
                                                                <div className="flex justify-between mt-0.5">
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        Fecha límite: {format(new Date(post.dueDate), "d MMM yyyy", { locale: es })}
                                                                    </span>
                                                                    {post.status === 'posted' && (
                                                                        <span className="text-[10px] text-success font-medium flex items-center gap-1">
                                                                            <CheckCircle2 className="h-3 w-3" /> Publicado ({formatNumber(post.views || 0)} views)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                        No hay campañas asignadas
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
            <PageBreadcrumb items={[
                { label: "Marketing", href: "/marketing" },
                { label: "Influencers" }
            ]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Influencers</h1>
                    <p className="text-muted-foreground">Coordina campañas, asignaciones y entregables de contenido.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Perfil
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o nicho..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Global Status Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Alcance Potencial</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {formatNumber(influencers.reduce((acc, curr) => acc + curr.totalReach, 0))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Campañas Activas</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold">
                            {influencers.reduce((acc, curr) => acc + curr.campaigns.filter(c => c.status === 'active').length, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Acciones Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold text-amber-600">
                            {influencers.reduce((acc, curr) => acc + curr.campaigns.flatMap(c => c.deliverables).filter(d => d.status === 'pending').length, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Por subir/aprobar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Posts Publicados</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold text-success">
                            {influencers.reduce((acc, curr) => acc + curr.campaigns.flatMap(c => c.deliverables).filter(d => d.status === 'posted').length, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Estado</TableHead>
                            <TableHead>Perfil</TableHead>
                            <TableHead className="hidden md:table-cell">Nichos</TableHead>
                            <TableHead className="hidden md:table-cell">Alcance Total</TableHead>
                            <TableHead className="hidden md:table-cell">Responsable</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Campañas</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInfluencers.length > 0 ? (
                            filteredInfluencers.map((inf) => (
                                <TableRow
                                    key={inf.id}
                                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => setSelectedInfluencer(inf)}
                                >
                                    <TableCell>
                                        <Badge variant={getStatusVariant(inf.status)} className="scale-90 origin-left">
                                            {inf.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{inf.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            {inf.socials.slice(0, 2).map((s, i) => (
                                                <span key={i} className="flex items-center gap-0.5">
                                                    {getPlatformIcon(s.platform)} {formatNumber(s.followers)}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {inf.niche.slice(0, 2).map(n => (
                                                <Badge key={n} variant="secondary" className="text-[10px] border-none bg-muted h-5">{n}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell font-mono text-sm">
                                        {formatNumber(inf.totalReach)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                        {inf.assignedTo}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        {inf.campaigns.length > 0 ? (
                                            <Badge variant="outline">{inf.campaigns.length}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Users className="h-8 w-8 text-muted-foreground/30" />
                                        <p>No se encontraron influencers</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
