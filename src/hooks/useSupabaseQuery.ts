import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseConnection } from './useSupabaseConnection';

interface SupabaseQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
    queryFn: () => Promise<T>;
    retryOnAuthError?: boolean;
}

export const useSupabaseQuery = <T>(options: SupabaseQueryOptions<T>) => {
    const { handleConnectionIssue } = useSupabaseConnection();

    return useQuery({
        ...options,
        retry: (failureCount, error: any) => {
            // Don't retry on auth errors unless specifically requested
            if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
                if (options.retryOnAuthError) {
                    // Try to handle connection issue once
                    if (failureCount === 0) {
                        handleConnectionIssue();
                        return true;
                    }
                }
                return false;
            }

            // For other errors, use default retry logic
            return failureCount < (options.retry || 3);
        },
        onError: (error: any) => {
            // Handle auth errors by attempting to fix connection
            if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
                console.error('Auth error in query:', error);
                if (options.retryOnAuthError) {
                    handleConnectionIssue();
                }
            }

            // Call original onError if provided
            if (options.onError) {
                options.onError(error);
            }
        }
    });
};

// Helper function to create a Supabase query function
export const createSupabaseQuery = <T>(
    queryFn: () => Promise<T>,
    options?: Partial<SupabaseQueryOptions<T>>
): SupabaseQueryOptions<T> => ({
    queryFn,
    retryOnAuthError: true, // Default to retrying on auth errors
    ...options
});
