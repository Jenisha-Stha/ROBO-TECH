"use client";

import { useUserCourses } from "@/hooks/useUserStats";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function EnrolledCoursesPage() {
  const { user, session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Use the user from useAuth hook directly
  const { data: enrollments, error, isLoading: coursesLoading } = useUserCourses(
    user?.id || null
  );
  console.log({ enrollments })


  // Test basic Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      console.log("🧪 Testing Supabase connection...");
      try {
        const { data, error } = await supabase
          .from("user_course_response")
          .select("*")
          .limit(1);
        console.log("🧪 Test result:", { data, error });
      } catch (err) {
        console.log("🧪 Test error:", err);
      }
    };

    if (user?.id) {
      testConnection();
    }
  }, [user?.id]);



  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-lg text-gray-400">Checking authentication...</p>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-lg text-gray-400">Please log in to view your enrolled courses.</p>
      </div>
    );
  }

  if (coursesLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-lg text-gray-400">Loading courses...</p>
      </div>
    );
  }

  if (error) return (
    <div className="flex justify-center py-12">
      <p className="text-lg text-red-400">Error loading courses: {error.message}</p>
    </div>
  );

  if (!enrollments || enrollments.length === 0) {
    return (
      <AdminLayout title="My Enrolled Courses" subtitle="Browse and manage your enrolled courses">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
          <button
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            onClick={() => navigate('/admin/courses')}
          >
            Explore available courses
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Enrolled Courses" subtitle="Browse and manage your enrolled courses">


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {enrollments.map((enrollment: any) => {
          console.log({ enrollment })
          const course = enrollment.courses;
          return (
            <Card
              key={course.id}
              className="group relative overflow-hidden bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg cursor-pointer border border-gray-700"
              onClick={() => navigate(`/admin/lessons/${course.id}`)}
            >
              {/* Course Image */}
              <div className="relative w-full h-40">
                <img
                  src={course.image_asset?.url || "/images/drone.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <CardHeader className="relative z-10 pt-4">
                <CardTitle className="text-lg font-semibold text-gray-100 line-clamp-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {enrollment.is_completed ? (
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">✅ Completed</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⏳ In Progress</span>
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              {/* <CardContent className="relative z-10 flex justify-between items-center">
                <span className="text-xs text-orange-200">
                  out of {enrollment.total_responses} students, your rank is {enrollment.user_rank}
                </span>
              </CardContent> */}
              <CardContent className="relative z-10 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                </span>
              </CardContent>

              {/* Chevron Icon */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}