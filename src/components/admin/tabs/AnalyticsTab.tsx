import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    RefreshCcw,
    TrendingUp,
    TrendingDown,
    Globe,
    Monitor,
    Smartphone,
    Map as MapIcon,
    Users
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAnalytics } from '@/hooks/useAnalytics';

export const AnalyticsTab = () => {
    const isMobile = useMobile();
    const [timeRange, setTimeRange] = useState('30d');
    const { data, loading } = useAnalytics(timeRange);

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Formatting currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <section className="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px] h-9 bg-white border-orange-100 focus:ring-orange-500">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Últimas 24h</SelectItem>
                            <SelectItem value="7d">Últimos 7 dias</SelectItem>
                            <SelectItem value="30d">Últimos 30 dias</SelectItem>
                            <SelectItem value="90d">Últimos 90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-white" title="Atualizar">
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox id="visitors" defaultChecked className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                                <label htmlFor="visitors" className="text-sm font-medium text-gray-500 cursor-pointer">
                                    👥 Visitantes Únicos
                                </label>
                            </div>
                            <div className="text-3xl font-bold tracking-tight">{data.totalVisitors.toLocaleString('pt-BR')}</div>
                            <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                                <span>+12.5%</span>
                                <TrendingUp className="h-3 w-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox
                                    id="revenue"
                                    defaultChecked
                                    className="data-[state=checked]:bg-orange-400 data-[state=checked]:border-orange-400"
                                />
                                <label htmlFor="revenue" className="text-sm font-medium text-gray-500 cursor-pointer">
                                    💰 Receita Total
                                </label>
                            </div>
                            <div className="text-3xl font-bold tracking-tight">{formatCurrency(data.totalRevenue)}</div>
                            <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                                <span>+8.2%</span>
                                <TrendingUp className="h-3 w-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-sm font-medium text-gray-500">
                                    📈 Taxa de Conversão
                                </label>
                            </div>
                            <div className="text-3xl font-bold tracking-tight">{data.conversionRate.toFixed(2)}%</div>
                            <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                                <span>-2.1%</span>
                                <TrendingDown className="h-3 w-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-gray-500">✨ Online Agora</span>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold tracking-tight">{data.activeUsers}</div>
                            <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                <span>Monitorando em tempo real</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart */}
            <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.visitors} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [value, 'Visitantes']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f97316"
                                    fillOpacity={1}
                                    fill="url(#colorVisitors)"
                                    strokeWidth={3}
                                    name="Visitantes"
                                    activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sources */}
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between pb-3">
                        <div className="flex gap-4">
                            <button className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-3 -mb-3.5">Origem do Tráfego</button>
                            <button className="text-sm font-medium text-gray-500 pb-3 -mb-3.5 hover:text-orange-400">Campanhas</button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 gap-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 text-xs">
                            <Users className="h-3.5 w-3.5" />
                            Ver Detalhes
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[300px] w-full p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.sources} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={100}
                                        tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                        {data.sources.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Pages */}
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-900">📄 Páginas Mais Visitadas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {data.topPages.map((page, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm font-mono w-4">{i + 1}</span>
                                        <span className="text-sm font-medium text-gray-700">{page.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{page.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Devices & Location */}
                <Card className="bg-white border-none shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-900">📱 Dispositivos & Localização</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Dispositivos</h4>
                                <div className="space-y-4">
                                    {data.devices.map((device, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {device.name === 'Desktop' ? <Monitor className="h-4 w-4 text-gray-400" /> :
                                                    device.name === 'Mobile' ? <Smartphone className="h-4 w-4 text-gray-400" /> :
                                                        <Monitor className="h-4 w-4 text-gray-400" />}
                                                <span className="text-sm text-gray-700">{device.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${device.value}%`, backgroundColor: device.color }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 w-8 text-right">{device.value}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Principais Cidades (BR)</h4>
                                <div className="flex flex-col gap-3">
                                    {data.locations && data.locations.length > 0 ? (
                                        data.locations.map((loc, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MapIcon className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{loc.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{loc.value}%</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">Sem dados de localização cadastrados</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
