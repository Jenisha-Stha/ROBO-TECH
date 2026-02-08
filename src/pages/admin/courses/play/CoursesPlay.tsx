import { AdminLayout } from "@/components/admin/AdminLayout";
import Levels from "@/components/Levels";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";



interface Course {
  id: number;
  title: string;
  image: string;
  video: string;
  detail: string;
  duration: number;
  durationIn: "hour" | "day" | "month";
  course_type: "free" | "paid";
  svgIcon: string;
  tags: number[];
}

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  svgicon: string;
  image_path: string;
  video_path: string;
  detail: string;
  orderBy: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isErased: boolean;
  questionCount: number;
}

interface UserLessonResponse {
  id: number;
  user_id: number;
  lesson_id: number;
  is_completed: boolean;
  score_percentage: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function CoursesPlay() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user: authUser } = useAuth();
  const { item: course, isLoadingItem } = useFetchSingle<Course>('courses', 'course', courseId,
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
                  `
  )

  const { items: lessons, isLoadingItems: isLoadingLessons } = useFetchAllById<Lesson>('lessons', 'lessons', 'course_id', courseId)

  // Type the lessons properly
  const lessonsData = lessons as Lesson[] | undefined;

  // Fetch user lessons responses based on lesson IDs
  const { data: userLessonsResponses, isLoading: isLoadingUserResponses } = useQuery<UserLessonResponse[]>({
    queryKey: ['user-lessons-responses', courseId, authUser?.id],
    queryFn: async () => {
      if (!lessonsData || !authUser?.id) return [];

      // Extract lesson IDs from the lessons array
      const lessonIds = lessonsData.map(lesson => lesson.id);




      const { data, error } = await supabase
        .from('user_lessons_response')
        .select('*')
        .eq('user_id', authUser.id)
        .in('lesson_id', lessonIds);

      if (error) {
        console.error('Error fetching user lessons responses:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!lessonsData && !!authUser?.id, // Only run when we have lessons and user
  });

  // Type assertion to help TypeScript understand the course object
  const courseData = course as Course | null;

  if (isLoadingItem || isLoadingLessons || isLoadingUserResponses) {
    return <div>Loading...</div>
  }

  const handleGoToCourse = () => {
    navigate(`/admin/courses/${courseId}`);
  };

  return (
    <AdminLayout title="Play Game">
      <Levels
        lessons={lessonsData || []}
        course={courseData}
        userLessonsResponse={userLessonsResponses || []}
      />
    </AdminLayout>
  );
}