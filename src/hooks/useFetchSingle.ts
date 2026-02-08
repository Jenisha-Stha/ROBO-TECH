import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useFetchSingle<T>(baseUrl: string, entityName: string, id?: string, select?: string) {
    const itemQuery = useQuery<T>({
        queryKey: [entityName, id],
        enabled: !!id,
        queryFn: async () => {
            try {
                // console.log(baseUrl)
                const { data, error } = await supabase
                    .from(baseUrl)
                    .select(select)
                    .eq('id', id)
                    .single();

                // console.log(data)
                if (error) throw error;
                return data;

            } catch (error) {
                console.error('Error fetching course:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch details. Please try again.",
                    variant: "destructive"
                });
            }
        },
    });

    return {
        item: itemQuery.data,
        isLoadingItem: itemQuery.isLoading,
        refetchItem: itemQuery.refetch,
    };
}