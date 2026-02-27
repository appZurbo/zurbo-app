import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const trackPageView = async () => {
            try {
                const userAgent = window.navigator.userAgent;
                let deviceType = 'Desktop';
                if (/Mobi|Android/i.test(userAgent)) {
                    deviceType = 'Mobile';
                } else if (/Tablet|iPad/i.test(userAgent)) {
                    deviceType = 'Tablet';
                }

                const { error } = await (supabase as any).from('site_analytics').insert({
                    page_path: location.pathname,
                    referrer: document.referrer || 'Direct',
                    device_type: deviceType,
                    user_agent: userAgent
                });

                if (error) {
                    // If table doesn't exist yet, we just fail silently in production
                    // or we could log it for debugging
                    console.warn('Analytics tracking error (table might not exist):', error.message);
                }
            } catch (err) {
                console.error('Failed to track page view:', err);
            }
        };

        trackPageView();
    }, [location.pathname]);

    return null;
};
