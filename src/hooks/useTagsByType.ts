import { useSupabaseQuery } from "./useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";

export const useTagsByType = (tagTypeName: string) => {
  return useSupabaseQuery({
    queryKey: ["tags-by-type", tagTypeName],
    queryFn: async () => {
      // Step 1: Get tag type id
      const { data: tagType, error: tagTypeError } = await supabase
        .from("tag_types")
        .select("id")
        .eq("name", tagTypeName)
        .single();

      if (tagTypeError) throw tagTypeError;

      // Step 2: Get tags by tag_type_id
      const { data: tags, error: tagsError } = await supabase
        .from("tags")
        .select(
          `
                    id,
                    title,
                    slug,
                    is_approved,
                    tagtype_id,
                    tag_types (
                        id,
                        name,
                        slug
                    )
                `
        )
        .eq("tagtype_id", tagType.id)
        .eq("is_erased", false)
        .eq("is_active", true)
        .order("title", { ascending: true });

      if (tagsError) throw tagsError;




      if (tagsError) {
        console.error("Error fetching tags by type:", tagsError);
        throw tagsError;
      }

      return tags;
    },
    enabled: !!tagTypeName,
    retryOnAuthError: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
