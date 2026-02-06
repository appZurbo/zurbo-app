import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, subMonths, format, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AnalyticsData {
    visitors: { date: string; value: number }[];
    revenue: { date: string; value: number }[];
    totalVisitors: number;
    totalRevenue: number;
    conversionRate: number;
    activeUsers: number;
    topPages: { name: string; value: number }[];
    sources: { name: string; value: number; color: string }[];
    devices: { name: string; value: number; color: string }[];
}

export const useAnalytics = (timeRange: string) => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // 1. Fetch Real Data for KPIs

                // Users (Growth)
                const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

                // Orders & Revenue
                const { data: orders } = await supabase
                    .from('pedidos')
                    .select('created_at, preco_acordado, status')
                    .gte('created_at', subDays(new Date(), 30).toISOString()); // Last 30 days window for chart

                // Calculate Revenue
                const totalRevenue = orders?.reduce((acc, order) => acc + (order.preco_acordado || 0), 0) || 0;

                // Calculate daily revenue for chart
                const revenueMap = new Map();
                orders?.forEach(order => {
                    const date = format(new Date(order.created_at), 'dd MMM', { locale: ptBR });
                    revenueMap.set(date, (revenueMap.get(date) || 0) + (order.preco_acordado || 0));
                });

                const revenueChartData = Array.from(revenueMap.entries()).map(([date, value]) => ({ date, value })).reverse();

                // Mocking Visitors Data since we don't have GA or page_view tracking in DB
                // In a real app, this would come from a 'page_views' table or Google Analytics API
                const mockVisitorsData = Array.from({ length: 14 }).map((_, i) => {
                    const date = subDays(new Date(), i);
                    return {
                        date: format(date, 'dd MMM', { locale: ptBR }),
                        value: Math.floor(Math.random() * (500 - 200) + 200)
                    };
                }).reverse();

                // 2. Prepare Final Data Object
                setData({
                    visitors: mockVisitorsData,
                    revenue: revenueChartData,
                    totalVisitors: (userCount || 0) * 5, // Estimating visitors as 5x registered users
                    totalRevenue: totalRevenue,
                    conversionRate: ((orders?.length || 0) / (userCount || 1)) * 100,
                    activeUsers: Math.floor((userCount || 0) * 0.15), // Estimating 15% active

                    // Static/Mocked dimensions that mirror real app structure
                    topPages: [
                        { name: '/inicio', value: 4500 },
                        { name: '/prestadores', value: 3200 },
                        { name: '/mapa-servicos', value: 2800 },
                        { name: '/chat', value: 1500 },
                        { name: '/perfil', value: 900 },
                    ],
                    sources: [
                        { name: 'Google', value: 45, color: '#40739b' },
                        { name: 'Direto', value: 30, color: '#3b82f6' },
                        { name: 'Instagram', value: 15, color: '#E1306C' },
                        { name: 'Indicação', value: 10, color: '#10b981' },
                    ],
                    devices: [
                        { name: 'Mobile', value: 75, color: '#3b82f6' },
                        { name: 'Desktop', value: 20, color: '#10b981' },
                        { name: 'Tablet', value: 5, color: '#f59e0b' },
                    ]
                });

            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    return { data, loading };
};
