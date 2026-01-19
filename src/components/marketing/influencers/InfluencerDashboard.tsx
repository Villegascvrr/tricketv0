import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Influencer } from "@/data/influencerMockData";
import { AlertTriangle, CheckCircle2, LayoutList, Share2, Users2 } from "lucide-react";

interface InfluencerDashboardProps {
    influencers: Influencer[];
    onSelect: (influencer: Influencer) => void;
}

export function InfluencerDashboard({ influencers, onSelect }: InfluencerDashboardProps) {

    // Metrics Calculations
    const activeCampaignsCount = influencers.reduce((acc, inf) =>
        acc + (inf.campaigns ? inf.campaigns.filter(c => c.status === 'Activa').length : 0), 0);

    const activeInfluencersCount = influencers.filter(i => i.status === 'Activo').length;

    // Risk: Influencers with status 'Pendiente'
    const riskInfluencers = influencers.filter(i => i.status === 'Pendiente');

    // Content: Pending posts
    let totalPosts = 0;
    let pendingPosts = 0;

    influencers.forEach(inf => {
        inf.campaigns?.forEach(c => {
            c.deliverables?.forEach(d => {
                totalPosts++;
                if (d.status === 'Pendiente') {
                    pendingPosts++;
                }
            });
        });
    });

    return (
        <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Campañas Activas
                        </CardTitle>
                        <LayoutList className="h-3.5 w-3.5 text-blue-500 opacity-70" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold leading-none">{activeCampaignsCount}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">En curso actualmente</p>
                    </CardContent>
                </Card>

                <Card className={riskInfluencers.length > 0 ? "border-amber-200 bg-amber-50/50" : ""}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Influencers en Riesgo
                        </CardTitle>
                        <AlertTriangle className={`h-3.5 w-3.5 ${riskInfluencers.length > 0 ? "text-amber-500" : "text-muted-foreground opacity-70"}`} />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className={`text-xl font-bold leading-none ${riskInfluencers.length > 0 ? "text-amber-600" : ""}`}>
                            {riskInfluencers.length}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Pendientes de confirmación</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Publicaciones Pendientes
                        </CardTitle>
                        <Share2 className="h-3.5 w-3.5 text-primary opacity-70" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold leading-none">{pendingPosts}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">De un total de {totalPosts}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Entregables Críticos
                        </CardTitle>
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold leading-none">0</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Facturas pendientes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Risk / Action List */}
            {riskInfluencers.length > 0 && (
                <div className="bg-red-50/50 border border-red-100/50 rounded-lg p-3">
                    <h3 className="text-[11px] font-bold text-red-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Atención Requerida
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {riskInfluencers.slice(0, 3).map(inf => (
                            <div
                                key={inf.id}
                                className="bg-white p-2 rounded border border-red-100/50 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center"
                                onClick={() => onSelect(inf)}
                            >
                                <div>
                                    <p className="font-bold text-xs text-gray-900 leading-tight">{inf.name}</p>
                                    <p className="text-[10px] text-red-500 mt-0.5 font-medium">Pendiente</p>
                                </div>
                                <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center">
                                    <Users2 className="h-2.5 w-2.5 text-red-500" />
                                </div>
                            </div>
                        ))}
                        {riskInfluencers.length > 3 && (
                            <div className="flex items-center justify-center text-xs text-red-600 font-medium">
                                +{riskInfluencers.length - 3} más...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
