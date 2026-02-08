import { useQuery } from '@tanstack/react-query';
import { useSupabaseQuery } from './useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  slug: string;
  course_type: string;
  detail: string;
  image_url: string;
  svg_icon: string;
  video_url: string;
  duration: number;
  duration_in: string;
  order_by: number;
  top_image_url: string;
  bottom_image_url: string;
  background_image_url: string;
  is_erased: boolean;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  lesson_count?: number;
  image_asset_id?: string;
  image_asset?: {
    id: string;
    url: string;
    file_name: string;
    asset_type: string;
    alt_text: string;
    description: string;
  };
  lessons?: {
    id: string;
    is_erased: boolean;
    is_active: boolean;
  }[];
  course_tags?: {
    id: string;
    tag_id: string;
    tags: {
      id: string;
      title: string;
      slug: string;
      is_approved: boolean;
      tagtype_id: string;
      tag_types: {
        id: string;
        name: string;
        slug: string;
      };
    };
  }[];
}

export const useCoursesWithTags = () => {
  return useSupabaseQuery<Course[]>({
    queryKey: ['courses-with-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_tags (
            id,
            tag_id,
            tags (
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
            )
          ),
          image_asset:assets!courses_image_asset_id_fkey(
            id,
            url,
            file_name,
            asset_type,
            alt_text,
            description
          ),
          top_image_asset:assets!courses_top_image_asset_id_fkey(
            id,
            url,
            file_name,
            asset_type,
            alt_text,
            description
          ),
          bottom_image_asset:assets!courses_bottom_image_asset_id_fkey(
            id,
            url,
            file_name,
            asset_type,
            alt_text,
            description
          ),
          background_image_asset:assets!courses_background_image_asset_id_fkey(
            id,
            url,
            file_name,
            asset_type,
            alt_text,
            description
          ),
          video_asset:assets!courses_video_asset_id_fkey(
            id,
            url,
            file_name,
            asset_type,
            alt_text,
            description,
            duration,
            thumbnail_url
          )
        `)
        .eq('is_erased', false)
        .eq('is_active', true)
        .order('order_by', { ascending: true });

      if (error) {
        console.error('Error fetching courses with tags:', error);
        throw error;
      }

      return data || [];
    },
    retryOnAuthError: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export interface CoursesWithFilterResult {
  courses: Course[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
export interface UseCoursesWithFilterOptions {
  /** Filter + pagination config */
  filter: {
    /** Search term applied to title/description */
    searchTerm?: string;
    /** Filter by tag type ID (or 'all') */
    selectedTagType?: string;
    /** Filter by specific tag ID (or 'all') */
    selectedTag?: string;
  };

  /** Pagination */
  pagination?: {
    limit?: number;
    currentPage?: number;
  };

  /** Disable query */
  enabled?: boolean;
}

// ---------------------------------------------------------------------
// 3. Hook Implementation
// ---------------------------------------------------------------------
export const useCoursesWithFilter = ({
  filter: {
    searchTerm = '',
    selectedTagType = 'all',
    selectedTag = 'all',
  } = {},
  pagination: {
    limit = 12,
    currentPage = 1,
  } = {},
  enabled = true,
}: UseCoursesWithFilterOptions) => {
  return useQuery<CoursesWithFilterResult, Error>({
    queryKey: [
      'courses',
      'with-filter',
      { searchTerm, selectedTagType, selectedTag, limit, currentPage },
    ],

    queryFn: async (): Promise<CoursesWithFilterResult> => {
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;

      // Base query with all needed relations
      let query = supabase
        .from('courses')
        .select(
          `
          *,
          course_tags(
            tag_id,
            tags(
              id,
              title,
              is_approved,
              tag_types(
                id,
                name
              )
            )
          ),
          image_asset:assets!courses_image_asset_id_fkey(
            id,url,file_name,asset_type,alt_text,description
          ),
          top_image_asset:assets!courses_top_image_asset_id_fkey(
            id,url,file_name,asset_type,alt_text,description
          ),
          bottom_image_asset:assets!courses_bottom_image_asset_id_fkey(
            id,url,file_name,asset_type,alt_text,description
          ),
          background_image_asset:assets!courses_background_image_asset_id_fkey(
            id,url,file_name,asset_type,alt_text,description
          ),
          video_asset:assets!courses_video_asset_id_fkey(
            id,url,file_name,asset_type,alt_text,description,duration,thumbnail_url
          )
        `,
          { count: 'exact' }
        )
        .eq('is_erased', false)
        .eq('is_active', true)
        .order('order_by', { ascending: true })
        .order('created_at', { ascending: false });

      // -------------------------------------------------
      // 1. Search: title or detail (description)
      // -------------------------------------------------
      if (searchTerm.trim()) {
        const term = searchTerm.trim();
        query = query.or(
          `title.ilike.%${term}%`
        );
        // query = query.or(
        //   `title.ilike.%${term}%,detail.ilike.%${term}%`
        // );
      }

      // -------------------------------------------------
      // 2. Filter by tag type (if not 'all')
      // -------------------------------------------------
      if (selectedTagType !== 'all') {
        query = query.filter(
          'course_tags.tags.tag_types.id',
          'eq',
          selectedTagType
        );
      }

      // -------------------------------------------------
      // 3. Filter by specific tag (if not 'all')
      // -------------------------------------------------
      if (selectedTag !== 'all') {
        query = query.eq('course_tags.tag_id', selectedTag);
      }

      // -------------------------------------------------
      // 4. Apply pagination
      // -------------------------------------------------
      const { data, error, count } = await query.range(from, to);

      if (error) {
        throw new Error(`Failed to fetch filtered courses: ${error.message}`);
      }

      const totalData = count ?? 0;
      const totalPages = Math.max(1, Math.ceil(totalData / limit));

      return {
        courses: (data ?? []) as Course[],
        totalData,
        totalPages,
        currentPage,
        limit,
      };
    },

    enabled,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,   // 10 min
  });
};
