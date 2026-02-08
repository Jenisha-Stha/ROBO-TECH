import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

// Custom hook that provides the same interface as the old useRBAC hook
export const useAuth = () => {
    const {
        user,
        session,
        permissions,
        isLoading,
        isInitialized,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccess,
        getUserPermissions,
        signOut,
        initializeAuth
    } = useAuthStore();

    // Initialize auth on first use only, but wait a bit for rehydration
    useEffect(() => {
        if (!isInitialized) {
            // Small delay to ensure rehydration is complete
            const timer = setTimeout(() => {
                initializeAuth();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isInitialized, initializeAuth]);

    return {
        user,
        session,
        permissions,
        isLoading,
        isInitialized,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccess,
        getUserPermissions,
        signOut
    };
};

// Alias for backward compatibility
export const useRBAC = useAuth; 