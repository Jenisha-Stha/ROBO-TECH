import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSessionRefresh = () => {
    const { session, user } = useAuth();
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    // Track user activity
    useEffect(() => {
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, updateActivity);
            });
        };
    }, []);

    // Session refresh logic
    useEffect(() => {
        if (!session || !user) {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
            return;
        }

        const refreshSession = async () => {
            try {
                const { data, error } = await supabase.auth.refreshSession();
                if (error) {
                    console.warn('Session refresh failed:', error);
                } else {
                    console.log('Session refreshed successfully');
                }
            } catch (error) {
                console.warn('Session refresh error:', error);
            }
        };

        // Check if user has been active recently
        const checkAndRefresh = async () => {
            const timeSinceActivity = Date.now() - lastActivityRef.current;
            const idleTime = 5 * 60 * 1000; // 5 minutes

            if (timeSinceActivity > idleTime) {
                // User has been idle, refresh session
                await refreshSession();
            }
        };

        // Set up interval to check every 2 minutes
        refreshIntervalRef.current = setInterval(checkAndRefresh, 2 * 60 * 1000);

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [session, user]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);
};
