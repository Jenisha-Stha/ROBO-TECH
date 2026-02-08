import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  tagtype_id: string;
  title: string;
  slug: string;
  is_approved: boolean;
  is_erased: boolean;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  tag_type?: {
    id: string;
    name: string;
  };
}

export interface CreateTagData {
  tagtype_id: string;
  title: string;
  slug: string;
  is_approved: boolean;
  is_active?: boolean;
}

export interface UpdateTagData {
  tagtype_id: string;
  title: string;
  slug: string;
  is_approved: boolean;
  is_active?: boolean;
}

export interface TagType {
  id: string;
  name: string;
  description?: string;
}

// Query keys
export const tagsKeys = {
  all: ['tags'] as const,
  lists: () => [...tagsKeys.all, 'list'] as const,
  list: (filters: string) => [...tagsKeys.lists(), { filters }] as const,
  details: () => [...tagsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsKeys.details(), id] as const,
  approved: () => [...tagsKeys.lists(), 'approved'] as const,
};

export const tagTypesKeys = {
  all: ['tagTypes'] as const,
  lists: () => [...tagTypesKeys.all, 'list'] as const,
};

// Fetch tags from Supabase
const fetchTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`
      *,
      tag_type:tag_types (
        id,
        name
      )
    `)
    .eq('is_erased', false)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Fetch tag types from Supabase
const fetchTagTypes = async (): Promise<TagType[]> => {
  const { data, error } = await supabase
    .from('tag_types')
    .select('*')
    .eq('is_erased', false)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Create tag
const createTag = async (tagData: CreateTagData): Promise<Tag> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if slug is unique
  const { data: existingTag, error: slugCheckError } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagData.slug)
    .eq('is_erased', false)
    .single();

  if (slugCheckError && slugCheckError.code !== 'PGRST116') {
    throw new Error('Failed to check slug uniqueness');
  }

  if (existingTag) {
    throw new Error('A tag with this slug already exists');
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({
      tagtype_id: tagData.tagtype_id,
      title: tagData.title,
      slug: tagData.slug,
      is_approved: tagData.is_approved,
      is_active: tagData.is_active ?? true,
      created_by: user.id,
      updated_by: user.id
    })
    .select(`
      *,
      tag_type:tag_types (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Tag;
};

// Update tag
const updateTag = async ({ id, ...tagData }: { id: string } & UpdateTagData): Promise<Tag> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if slug is unique (excluding current tag)
  const { data: existingTag, error: slugCheckError } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagData.slug)
    .eq('is_erased', false)
    .neq('id', id)
    .single();

  if (slugCheckError && slugCheckError.code !== 'PGRST116') {
    throw new Error('Failed to check slug uniqueness');
  }

  if (existingTag) {
    throw new Error('A tag with this slug already exists');
  }

  const { data, error } = await supabase
    .from('tags')
    .update({
      tagtype_id: tagData.tagtype_id,
      title: tagData.title,
      slug: tagData.slug,
      is_approved: tagData.is_approved,
      is_active: tagData.is_active ?? true,
      updated_by: user.id
    })
    .eq('id', id)
    .eq('is_erased', false)
    .select(`
      *,
      tag_type:tag_types (
        id,
        name
      )
    `)
    .single();

  if (error) {
    console.error('Tag update error:', error);
    if (error.code === 'PGRST116') {
      throw new Error('Tag not found or has been deleted');
    }
    throw new Error(error.message || 'Failed to update tag');
  }

  if (!data) {
    throw new Error('Tag not found or has been deleted');
  }

  return data as Tag;
};

// Delete tag (soft delete)
const deleteTag = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('tags')
    .update({
      is_erased: true,
      updated_by: user.id
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

// Update tag approval status
const updateTagApproval = async ({ id, is_approved }: { id: string; is_approved: boolean }): Promise<Tag> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tags')
    .update({
      is_approved,
      updated_by: user.id
    })
    .eq('id', id)
    .eq('is_erased', false)
    .select(`
      *,
      tag_type:tag_types (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Tag;
};

// Hook for fetching tags
export const useTags = () => {
  return useQuery({
    queryKey: tagsKeys.lists(),
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching tag types
export const useTagTypes = () => {
  return useQuery({
    queryKey: tagTypesKeys.lists(),
    queryFn: fetchTagTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for creating tag with optimistic updates
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createTag,
    onMutate: async (newTag) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: tagsKeys.lists() });

      // Snapshot the previous value
      const previousTags = queryClient.getQueryData<Tag[]>(tagsKeys.lists());

      // Optimistically update to the new value
      const optimisticTag: Tag = {
        id: `temp-${Date.now()}`, // Temporary ID
        tagtype_id: newTag.tagtype_id,
        title: newTag.title,
        slug: newTag.slug,
        is_approved: newTag.is_approved,
        is_erased: false,
        is_active: newTag.is_active ?? true,
        created_by: 'temp-user',
        updated_by: 'temp-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tag_type: undefined // Will be populated when we refetch
      };

      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (old) => {
        return old ? [optimisticTag, ...old] : [optimisticTag];
      });

      return { previousTags };
    },
    onError: (err, newTag, context) => {
      // Rollback on error
      if (context?.previousTags) {
        queryClient.setQueryData(tagsKeys.lists(), context.previousTags);
      }
      toast({
        title: "Error",
        description: err.message || "Failed to create tag. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (newTag) => {
      // Update the cache with the real data
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.map(tag =>
          tag.id.startsWith('temp-') ? newTag : tag
        );
      });

      toast({
        title: "Tag Created",
        description: "New tag has been successfully created.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
};

// Hook for updating tag with optimistic updates
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateTag,
    onMutate: async ({ id, ...updateData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: tagsKeys.lists() });

      // Snapshot the previous value
      const previousTags = queryClient.getQueryData<Tag[]>(tagsKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.map(tag =>
          tag.id === id
            ? {
              ...tag,
              tagtype_id: updateData.tagtype_id,
              title: updateData.title,
              slug: updateData.slug,
              is_approved: updateData.is_approved,
              is_active: updateData.is_active ?? true,
              updated_by: 'temp-user',
              updated_at: new Date().toISOString()
            }
            : tag
        );
      });

      return { previousTags };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTags) {
        queryClient.setQueryData(tagsKeys.lists(), context.previousTags);
      }
      toast({
        title: "Error",
        description: err.message || "Failed to update tag. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (updatedTag) => {
      // Update the cache with the real data
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.map(tag =>
          tag.id === updatedTag.id ? updatedTag : tag
        );
      });

      // Also update the individual tag cache
      queryClient.setQueryData(tagsKeys.detail(updatedTag.id), updatedTag);

      toast({
        title: "Tag Updated",
        description: "Tag has been successfully updated.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
};

// Hook for deleting tag with optimistic updates
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteTag,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: tagsKeys.lists() });

      // Snapshot the previous value
      const previousTags = queryClient.getQueryData<Tag[]>(tagsKeys.lists());

      // Optimistically remove the tag
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.filter(tag => tag.id !== id);
      });

      return { previousTags };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousTags) {
        queryClient.setQueryData(tagsKeys.lists(), context.previousTags);
      }
      toast({
        title: "Error",
        description: err.message || "Failed to delete tag. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (_, deletedId) => {
      // Remove individual tag cache
      queryClient.removeQueries({ queryKey: tagsKeys.detail(deletedId) });

      toast({
        title: "Tag Deleted",
        description: "Tag has been permanently deleted.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
};

// Hook for updating tag approval with optimistic updates
export const useUpdateTagApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateTagApproval,
    onMutate: async ({ id, is_approved }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: tagsKeys.lists() });

      // Snapshot the previous value
      const previousTags = queryClient.getQueryData<Tag[]>(tagsKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.map(tag =>
          tag.id === id
            ? {
              ...tag,
              is_approved,
              updated_at: new Date().toISOString()
            }
            : tag
        );
      });

      return { previousTags };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTags) {
        queryClient.setQueryData(tagsKeys.lists(), context.previousTags);
      }
      toast({
        title: "Error",
        description: err.message || "Failed to update tag approval. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (updatedTag) => {
      // Update the cache with the real data
      queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldData) => {
        return oldData?.map(tag =>
          tag.id === updatedTag.id ? updatedTag : tag
        );
      });

      // Also update the individual tag cache
      queryClient.setQueryData(tagsKeys.detail(updatedTag.id), updatedTag);

      toast({
        title: updatedTag.is_approved ? "Tag Approved" : "Tag Unapproved",
        description: `Tag has been ${updatedTag.is_approved ? "approved" : "unapproved"}.`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
};

// Hook for getting a single tag
export const useTag = (id: string) => {
  return useQuery({
    queryKey: tagsKeys.detail(id),
    queryFn: async (): Promise<Tag> => {
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          tag_type:tag_types (
            id,
            name
          )
        `)
        .eq('id', id)
        .eq('is_erased', false)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Tag;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility hook for tags with search/filtering
export const useTagsWithFilter = (
  searchTerm: string = '',
  filterTagType: string = 'all',
  filterStatus: string = 'all'
) => {
  const { data: tags = [], isLoading, error } = useTags();

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTagType = filterTagType === "all" || tag.tagtype_id === filterTagType;
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "approved" && tag.is_approved) ||
      (filterStatus === "pending" && !tag.is_approved);

    return matchesSearch && matchesTagType && matchesStatus;
  });

  const pendingCount = tags.filter(tag => !tag.is_approved).length;

  return {
    tags: filteredTags,
    allTags: tags,
    pendingCount,
    isLoading,
    error,
  };
};
