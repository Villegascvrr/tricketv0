
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sponsor } from "@/data/sponsorsMockData";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity, FileText, Share2, Info } from "lucide-react";

interface SponsorComplianceProps {
    sponsor: Sponsor;
}

export function SponsorCompliance({ sponsor }: SponsorComplianceProps) {
    // 1. Calculate Metrics

    // Deliverables
    const totalDeliverables = sponsor.deliverables?.length || 0;
    const completedDeliverables = sponsor.deliverables?.filter(d => d.status === 'entregado').length || 0;
    const deliverablesProgress = totalDeliverables === 0 ? 0 : Math.round((completedDeliverables / totalDeliverables) * 100);

    // Activations
    const totalActivations = sponsor.activations?.length || 0;
    const completedActivations = sponsor.activations?.filter(a => a.status === 'completada').length || 0;
    const pendingActivations = totalActivations - completedActivations;

    // Publications
    const totalPublications = sponsor.publications?.length || 0;
    const publishedPublications = sponsor.publications?.filter(p => p.status === 'publicada').length || 0;
    const pendingPublications = totalPublications - publishedPublications;

    // Financial
    const agreements = sponsor.agreements || [];
    const totalInvested = agreements.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const hasSignedAgreement = agreements.some(a => a.status === 'aceptado' || a.status === 'cerrado');

    // 2. Determine Overall Health Status
    // Logic: 
    // - RED (Riesgo): < 30% deliverables done OR no signed agreement if > 0 agreements proposed.
    // - YELLOW (Pendiente): < 100% deliverables/activations/publications done.
    // - GREEN (Cumplido): 100% of everything done (or empty lists).

    let globalStatus: 'ok' | 'warning' | 'risk' = 'ok';
    let statusMessage = "Todo en orden. La relación con la marca es saludable.";

    // Simple heuristic for demo
    if (totalDeliverables > 0 && deliverablesProgress < 30) {
        globalStatus = 'risk';
        statusMessage = "Atención: Bajo cumplimiento de entregables.";
    } else if (!hasSignedAgreement && agreements.length > 0) {
        globalStatus = 'risk';
        statusMessage = "Riesgo: No hay acuerdos firmados formalmente.";
    } else if (pendingActivations > 0 || pendingPublications > 0 || (totalDeliverables > 0 && deliverablesProgress < 100)) {
        globalStatus = 'warning';
        statusMessage = "Hay acciones o entregables pendientes de completar.";
    }

    const getStatusColor = (s: typeof globalStatus) => {
        switch (s) {
            case 'ok': return 'bg-success text-success-foreground hover:bg-success/90';
            case 'warning': return 'bg-yellow-500 text-white hover:bg-yellow-600';
            case 'risk': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
        }
    };

    const getStatusIcon = (s: typeof globalStatus) => {
        switch (s) {
            case 'ok': return <CheckCircle2 className="h-6 w-6 text-success" />;
            case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
            case 'risk': return <XCircle className="h-6 w-6 text-destructive" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Summary Block */}
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1 bg-muted/20 border-l-4 border-l-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Estado Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            {getStatusIcon(globalStatus)}
                            <div>
                                <h3 className="text-2xl font-bold capitalize">
                                    {globalStatus === 'ok' ? 'Excelente' : globalStatus === 'warning' ? 'En Progreso' : 'En Riesgo'}
                                </h3>
                                <p className="text-xs text-muted-foreground">{statusMessage}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Inversión Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {totalInvested.toLocaleString('es-ES')} €
                                </h3>
                                <p className="text-xs text-muted-foreground">{agreements.length} acuerdos registrados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Deliverables Health */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">Entregables</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-bold">{deliverablesProgress}%</span>
                            <span className="text-xs text-muted-foreground">Completado ({completedDeliverables}/{totalDeliverables})</span>
                        </div>
                        <Progress value={deliverablesProgress} className={`h-2 ${deliverablesProgress === 100 ? 'bg-success/20 [&>*]:bg-success' : ''}`} />
                    </CardContent>
                </Card>

                {/* Activations Health */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">Activaciones</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-bold flex items-center gap-2">
                                {completedActivations} / {totalActivations}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {pendingActivations > 0 ? `${pendingActivations} pendientes` : 'Todas completadas'}
                            </span>
                        </div>
                        <div className="flex gap-1 h-2">
                            {Array.from({ length: totalActivations }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-full ${i < completedActivations ? 'bg-blue-500' : 'bg-muted'}`}
                                />
                            ))}
                            {totalActivations === 0 && <div className="flex-1 bg-muted rounded-full" />}
                        </div>
                    </CardContent>
                </Card>

                {/* Publications Health */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">RRSS</CardTitle>
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-bold flex items-center gap-2">
                                {publishedPublications} / {totalPublications}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {pendingPublications > 0 ? `${pendingPublications} pendientes` : 'Todo publicado'}
                            </span>
                        </div>
                        <Progress value={totalPublications === 0 ? 0 : (publishedPublications / totalPublications) * 100} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Insights / Alerts */}
            {(globalStatus === 'risk' || globalStatus === 'warning') && (
                <Alert variant={globalStatus === 'risk' ? 'destructive' : 'default'} className={globalStatus === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Recomendación del Sistema</AlertTitle>
                    <AlertDescription>
                        {globalStatus === 'risk'
                            ? "Prioridad Alta: Revisa los entregables retrasados y asegúrate de cerrar los acuerdos pendientes."
                            : "Mantén el seguimiento: Hay activaciones o publicaciones próximas a vencer."}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
