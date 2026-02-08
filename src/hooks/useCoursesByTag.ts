import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  slug: string;
  course_type: string;
  short_description: string;
  detail: string;
  image_url?: string;
  image_asset_id?: string;
  image_asset?: {
    id: string;
    url: string;
  };
  svg_icon?: string;
  video_asset_id?: string;
  video_asset?: {
    id: string;
    url: string;
  };
  video_url?: string;
  duration: number;
  duration_in: string;
  order_by: number;
  top_image_url?: string;
  top_image_asset_id?: string;
  top_image_asset?: {
    id: string;
    url: string;
  };
  bottom_image_url?: string;
  bottom_image_asset_id?: string;
  bottom_image_asset?: {
    id: string;
    url: string;
  };
  background_image_url?: string;
  background_image_asset_id?: string;
  background_image_asset?: {
    id: string;
    url: string;
  };
  is_erased: boolean;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  course_tags?: {
    tag: {
      id: string;
      title: string;
    };
  }[];
}
export interface UseCoursesByTagOptions {
  /** The tag ID to filter courses by */
  tagId: string | null;

  /** Pagination + search config */
  pagination: {
    /** Optional search term (applied to title/description) */
    searchTerm?: string;
    /** Items per page */
    limit?: number;
    /** Current page (1-based) */
    currentPage?: number;
  };

  /** Disable the query (e.g. when component is not visible) */
  enabled?: boolean;
}

// ---------------------------------------------------------------------
// 2. Result Shape
// ---------------------------------------------------------------------
export interface CoursesByTagResult {
  courses: Course[];
  totalData: number;     // total matching items
  totalPages: number;    // total pages based on limit
  currentPage: number;   // current page (1-based)
  limit: number;         // items per page
}

// ---------------------------------------------------------------------
// 3. Hook Implementation
// ---------------------------------------------------------------------
export const useCoursesByTag = ({
  tagId,
  pagination: {
    searchTerm = '',
    limit = 12,
    currentPage = 1,
  } = {},
  enabled = true,
}: UseCoursesByTagOptions) => {
  return useQuery<CoursesByTagResult, Error>({
    queryKey: [
      'courses',
      'by-tag',
      tagId,
      { searchTerm, limit, currentPage },
    ],

    queryFn: async (): Promise<CoursesByTagResult> => {
      // Guard: no tag → empty result
      if (!tagId) {
        return {
          courses: [],
          totalData: 0,
          totalPages: 0,
          currentPage,
          limit,
        };
      }

      // Step 1: Get course IDs linked to the tag
      const { data: courseTagData, error: courseTagError } = await supabase
        .from('course_tags')
        .select('course_id')
        .eq('tag_id', tagId)
        .eq('is_erased', false)
        .eq('is_active', true);

      if (courseTagError) {
        throw new Error(`Failed to fetch course tags: ${courseTagError.message}`);
      }

      const courseIds = courseTagData?.map(ct => ct.course_id) ?? [];

      if (courseIds.length === 0) {
        return {
          courses: [],
          totalData: 0,
          totalPages: 0,
          currentPage,
          limit,
        };
      }

      // Step 2: Build paginated + searchable course query
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;

      let coursesQuery = supabase
        .from('courses')
        .select(
          `
          *,
          course_tags(
            tag_id,
            tags(
              id, title, is_approved,
              tag_types(id, name)
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
        .in('id', courseIds)
        .order('order_by', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply search if provided
      if (searchTerm?.trim()) {
        const term = searchTerm.trim();
        coursesQuery = coursesQuery.or(
          `title.ilike.%${term}%,detail.ilike.%${term}%`
        );
      }

      // Execute with pagination
      const { data, error, count } = await coursesQuery.range(from, to);

      if (error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
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

    enabled: enabled && !!tagId,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,   // 10 min
  });
};