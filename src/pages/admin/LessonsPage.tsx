"use client";

import { useCourseLessons } from "@/hooks/useUserStats";
import { useParams, useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";

export default function LessonsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const { data: lessonsResponse, isLoading, error } = useCourseLessons(courseId!, userId!);

  if (isLoading) return <p className="text-center py-8">Loading lessons...</p>;
  if (error) return <p className="text-center py-8 text-destructive">Error loading lessons</p>;
  if (!lessonsResponse || lessonsResponse.length === 0) {

    return (
      <AdminLayout title="Lessons">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-gray-400 mb-4">You haven't completed any lessons yet.</p>
          <button
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            onClick={() => navigate('/admin/enrolled-courses')}
          >
            Explore available enrolled courses
          </button>
        </div>
      </AdminLayout>
    )
  }


  // Get the course title from the first lesson (all lessons belong to same course)
  const courseTitle = lessonsResponse[0]?.lessons?.courses?.title || "Course";

  return (
    <AdminLayout title="Lessons">

      <div className="space-y-4">
        {/* Back button */}
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Button>

        <h1 className="text-2xl font-bold mb-4">{courseTitle} - Lessons</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsResponse.map((lessonResp: any) => {
            const lesson = lessonResp.lessons;
            const progress = lessonResp.total_questions
              ? Math.round((lessonResp.total_correct / lessonResp.total_questions) * 100)
              : 0;

            return (
              <Card
                key={lesson.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => navigate(`/admin/lesson-detail/${lesson.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-500" /> {lesson.title}
                  </CardTitle>
                  <CardDescription>
                    {lessonResp.is_completed ? "✅ Completed" : "⏳ In Progress"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex justify-between items-center mt-2">
                  <Badge className="text-sm">{progress}% Progress</Badge>
                  <span className="text-sm text-muted-foreground">
                    Questions: {lessonResp.total_correct}/{lessonResp.total_questions}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
