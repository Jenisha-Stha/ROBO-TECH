import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllById<T>(baseUrl: string, entityName: string, nameId: string, id: string) {
    const itemQuery = useQuery<T[]>({
        queryKey: [entityName, id],
        queryFn: async () => {
            try {
                let query = supabase
                    .from(baseUrl)
                    .select(`*`)
                    .eq(nameId, id);

                // Add filters for lessons to only show active and not erased ones
                if (baseUrl === 'lessons') {
                    query = query.eq('is_erased', false).eq('is_active', true).order('order_by', { ascending: true });
                }

                const { data, error } = await query;
                // .order('order_by', { ascending: true });

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch courses. Please try again.",
                    variant: "destructive"
                });
            }
            // const response = await api.get(`${baseUrl}`);
            // return response.data;
        },
    });

    return {
        items: itemQuery.data,
        isLoadingItems: itemQuery.isLoading,
        refetchItems: itemQuery.refetch,
    };
}