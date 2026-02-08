import React, { useMemo, useState } from 'react'
import CourseCard from './CourseCard'
import { Course, useCoursesWithFilter } from '../hooks/useCoursesWithTags'
import { useTags, useTagTypes } from '../hooks/useTags'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useFetchAll } from '@/hooks/useFetchAll'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import CourseCardNew from './CourseCardNew'

const HomeCourses = () => {
  const navigate = useNavigate()

  const itemQuery = useSupabaseQuery<Course[]>({
    queryKey: ['courses'],
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
          ),
          lessons:lessons!lessons_course_id_fkey(
            id,
            is_erased,
            is_active
          )
        `)
        .eq('is_erased', false)
        .eq('is_active', true)
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching coruses`, error);
        throw error;
      }

      // Process the data to add lesson counts
      const processedData = data?.map(course => ({
        ...course,
        lesson_count: course.lessons?.filter(lesson => !lesson.is_erased && lesson.is_active).length || 0
      })) || [];

      return processedData;
    },
    retryOnAuthError: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const { data: courses, isLoading: isLoadingItems } = itemQuery;


  return (
    <div className="container mx-auto lg:px-4 px-0 py-8">

      {/* Results Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {/* Available Courses */}
        </h2>
        {/* <p className="text-gray-600">
          {isLoadingItems ? 'Loading courses...' :
            `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}
        </p> */}
      </div>


      {/* Courses Grid */}
      {!isLoadingItems && courses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: Course) => (
            <CourseCardNew
              key={course.id}
              course={course}
              onEnroll={() => { }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-10">
        <Button
          onClick={() => navigate('/our-courses')}
          className="py-8 text-2xl font-bold mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50 transform hover:scale-105 transition-all duration-300 px-10"
        >
          View More <ArrowRight className="ml-2 w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}

export default HomeCourses