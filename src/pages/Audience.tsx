import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, MapPin, UserCheck, Heart, Mail, Phone, Megaphone, Download, Filter, ChevronDown } from "lucide-react";
import { festivalData } from "@/data/festivalData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Audience = () => {
  const { audiencia } = festivalData;
  
  // Segmentation filters
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    hasEmail: false,
    hasPhone: false,
    hasMarketingConsent: false,
  });

  // Calculate stats
  const totalSample = audiencia.totalAsistentes;
  const emailPercent = ((audiencia.contactStats.conEmail / totalSample) * 100).toFixed(0);
  const phonePercent = ((audiencia.contactStats.conTelefono / totalSample) * 100).toFixed(0);
  const marketingPercent = ((audiencia.contactStats.consentimientoMarketing / totalSample) * 100).toFixed(0);

  // Calculate age stats
  const ageData = audiencia.edades.map(e => ({
    name: e.rango,
    value: e.asistentes,
    percent: ((e.asistentes / totalSample) * 100).toFixed(1)
  }));

  const avgAge = Math.round(
    audiencia.edades.reduce((acc, e) => {
      const midAge = e.rango === '31+' ? 35 : (parseInt(e.rango.split('-')[0]) + parseInt(e.rango.split('-')[1])) / 2;
      return acc + midAge * e.asistentes;
    }, 0) / totalSample
  );

  // Province data
  const provinceData = audiencia.provincias.map(p => ({
    name: p.nombre,
    value: p.asistentes,
    percent: ((p.asistentes / totalSample) * 100).toFixed(1)
  }));

  // City data
  const cityData = audiencia.ciudades.map(c => ({
    name: c.nombre,
    value: c.asistentes,
    percent: ((c.asistentes / totalSample) * 100).toFixed(1)
  }));

  // Colors for charts
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted))', 'hsl(var(--muted-foreground))'];

  // Calculate filtered segment
  const calculateSegmentSize = () => {
    let size = totalSample;
    
    if (selectedProvinces.length > 0) {
      size = audiencia.provincias
        .filter(p => selectedProvinces.includes(p.nombre))
        .reduce((acc, p) => acc + p.asistentes, 0);
    }
    
    if (selectedAges.length > 0) {
      const ageRatio = audiencia.edades
        .filter(e => selectedAges.includes(e.rango))
        .reduce((acc, e) => acc + e.asistentes, 0) / totalSample;
      size = Math.round(size * ageRatio);
    }
    
    if (filters.hasEmail) size = Math.round(size * (audiencia.contactStats.conEmail / totalSample));
    if (filters.hasPhone) size = Math.round(size * (audiencia.contactStats.conTelefono / totalSample));
    if (filters.hasMarketingConsent) size = Math.round(size * (audiencia.contactStats.consentimientoMarketing / totalSample));
    
    return size;
  };

  const segmentSize = calculateSegmentSize();
  const segmentPercent = ((segmentSize / totalSample) * 100).toFixed(1);

  const handleExportCSV = () => {
    // Simulate export
    toast.success("Exportación iniciada", {
      description: `Segmento de ${segmentSize.toLocaleString('es-ES')} contactos exportado a CSV`
    });
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces(prev => 
      prev.includes(province) 
        ? prev.filter(p => p !== province)
        : [...prev, province]
    );
  };

  const toggleAge = (age: string) => {
    setSelectedAges(prev => 
      prev.includes(age) 
        ? prev.filter(a => a !== age)
        : [...prev, age]
    );
  };

  const clearFilters = () => {
    setSelectedProvinces([]);
    setSelectedAges([]);
    setFilters({ hasEmail: false, hasPhone: false, hasMarketingConsent: false });
  };

  const hasActiveFilters = selectedProvinces.length > 0 || selectedAges.length > 0 || filters.hasEmail || filters.hasPhone || filters.hasMarketingConsent;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Público y Audiencia
          </h1>
          <p className="text-muted-foreground">
            Perfil demográfico y análisis del público del Primaverando 2025
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Asistentes Únicos</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{festivalData.overview.entradasVendidas.toLocaleString('es-ES')}</div>
              <p className="text-xs text-muted-foreground mt-1">Compradores únicos</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Edad Media</CardDescription>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgAge} años</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((ageData[0].value + ageData[1].value) / totalSample * 100).toFixed(0)}% entre 18-25
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Origen Principal</CardDescription>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{audiencia.provincias[0].nombre}</div>
              <p className="text-xs text-muted-foreground mt-1">{provinceData[0].percent}% del público</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Recurrentes</CardDescription>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">38%</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% vs 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Province and City */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Province Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Distribución por Provincia
              </CardTitle>
              <CardDescription>Origen geográfico de los asistentes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={provinceData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value} asistentes ({payload[0].payload.percent}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {provinceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* City Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Top Ciudades
              </CardTitle>
              <CardDescription>Ciudades con mayor presencia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cityData} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value} asistentes ({payload[0].payload.percent}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Age and Contact Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Distribución por Edad
              </CardTitle>
              <CardDescription>Rangos de edad de los asistentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border rounded-lg p-2 shadow-lg">
                              <p className="font-medium">{payload[0].payload.name} años</p>
                              <p className="text-sm text-muted-foreground">
                                {payload[0].value} asistentes ({payload[0].payload.percent}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {ageData.map((age, index) => (
                    <div key={age.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm font-medium">{age.name} años</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{age.percent}%</span>
                        <span className="text-xs text-muted-foreground ml-2">({age.value})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Datos de Contacto
              </CardTitle>
              <CardDescription>Disponibilidad de información de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Con Email</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{emailPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${emailPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {audiencia.contactStats.conEmail.toLocaleString('es-ES')} contactos con email
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Con Teléfono</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{phonePercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${phonePercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {audiencia.contactStats.conTelefono.toLocaleString('es-ES')} contactos con teléfono
                </p>
              </div>

              {/* Marketing Consent */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Marketing Consent</span>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{marketingPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${marketingPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {audiencia.contactStats.consentimientoMarketing.toLocaleString('es-ES')} han aceptado recibir comunicaciones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segmentation Module */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Segmentación de Audiencia
                </CardTitle>
                <CardDescription>Filtra y exporta segmentos específicos de tu base de datos</CardDescription>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Province Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Provincias
                      {selectedProvinces.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{selectedProvinces.length}</Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {audiencia.provincias.map(p => (
                    <DropdownMenuCheckboxItem
                      key={p.nombre}
                      checked={selectedProvinces.includes(p.nombre)}
                      onCheckedChange={() => toggleProvince(p.nombre)}
                    >
                      {p.nombre} ({((p.asistentes / totalSample) * 100).toFixed(0)}%)
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Age Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Edades
                      {selectedAges.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{selectedAges.length}</Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {audiencia.edades.map(e => (
                    <DropdownMenuCheckboxItem
                      key={e.rango}
                      checked={selectedAges.includes(e.rango)}
                      onCheckedChange={() => toggleAge(e.rango)}
                    >
                      {e.rango} años ({((e.asistentes / totalSample) * 100).toFixed(0)}%)
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Contact Filters */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasEmail" 
                    checked={filters.hasEmail}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, hasEmail: !!checked }))}
                  />
                  <label htmlFor="hasEmail" className="text-sm cursor-pointer">Con Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasPhone" 
                    checked={filters.hasPhone}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, hasPhone: !!checked }))}
                  />
                  <label htmlFor="hasPhone" className="text-sm cursor-pointer">Con Teléfono</label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasMarketing" 
                    checked={filters.hasMarketingConsent}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, hasMarketingConsent: !!checked }))}
                  />
                  <label htmlFor="hasMarketing" className="text-sm cursor-pointer">Marketing Consent</label>
                </div>
              </div>
            </div>

            {/* Segment Result */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Segmento resultante</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-primary">
                      {segmentSize.toLocaleString('es-ES')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      contactos ({segmentPercent}% del total)
                    </span>
                  </div>
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedProvinces.map(p => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                      {selectedAges.map(a => (
                        <Badge key={a} variant="secondary" className="text-xs">{a} años</Badge>
                      ))}
                      {filters.hasEmail && <Badge variant="secondary" className="text-xs">Email</Badge>}
                      {filters.hasPhone && <Badge variant="secondary" className="text-xs">Teléfono</Badge>}
                      {filters.hasMarketingConsent && <Badge variant="secondary" className="text-xs">Consent</Badge>}
                    </div>
                  )}
                </div>
                <Button onClick={handleExportCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Audience;