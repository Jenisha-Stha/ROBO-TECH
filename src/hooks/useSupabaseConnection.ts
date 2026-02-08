import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useSupabaseConnection = () => {
    const { session, signOut } = useAuthStore();

    // Function to check if the session is still valid
    const checkSessionValidity = useCallback(async () => {
        if (!session) return false;

        try {
            const { data: { session: currentSession }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session validation error:', error);
                return false;
            }

            // If no current session, the user needs to re-authenticate
            if (!currentSession) {
                // console.log('No valid session found, signing out...');
                await signOut();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking session validity:', error);
            return false;
        }
    }, [session, signOut]);

    // Function to handle connection issues
    const handleConnectionIssue = useCallback(async () => {
        // console.log('Handling connection issue...');

        // First, try to refresh the session
        try {
            const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();

            if (error) {
                console.error('Failed to refresh session:', error);
                await signOut();
                return false;
            }

            if (refreshedSession) {
                // console.log('Session refreshed successfully');
                return true;
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
        }

        // If refresh failed, sign out
        await signOut();
        return false;
    }, [signOut]);

    // Set up periodic session validation
    useEffect(() => {
        if (!session) return;

        // Check session validity every 5 minutes
        const interval = setInterval(async () => {
            const isValid = await checkSessionValidity();
            if (!isValid) {
                // console.log('Session is invalid, attempting to handle connection issue...');
                await handleConnectionIssue();
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [session, checkSessionValidity, handleConnectionIssue]);

    // Set up visibility change listener to check session when user returns
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && session) {
                // console.log('Page became visible, checking session...');
                const isValid = await checkSessionValidity();
                if (!isValid) {
                    await handleConnectionIssue();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [session, checkSessionValidity, handleConnectionIssue]);

    return {
        checkSessionValidity,
        handleConnectionIssue
    };
};
