import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "./useSupabaseQuery";

export function useFetchAll<T>(entityName: string) {
    const itemQuery = useSupabaseQuery<T[]>({
        queryKey: [entityName],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(entityName)
                .select(`*`)
                .eq('is_erased', false)
                .order('created_at', { ascending: false });


            if (error) {
                console.error(`Error fetching ${entityName}:`, error);
                throw error;
            }


            return data;
        },
        retryOnAuthError: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        onError: (error) => {
            console.error(`Error fetching ${entityName}:`, error);
            toast({
                title: "Error",
                description: `Failed to fetch ${entityName}. Please try again.`,
                variant: "destructive"
            });
        }
    });

    return {
        items: itemQuery.data,
        isLoadingItems: itemQuery.isLoading,
        refetchItems: itemQuery.refetch,
    };
}