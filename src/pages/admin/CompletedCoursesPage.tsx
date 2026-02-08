import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Play,
  BookOpen,
  Video,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFetchAll } from "@/hooks/useFetchAll";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useAuth } from "@/hooks/useAuth";
import { useCoursesByTag } from "@/hooks/useCoursesByTag";
import { useUserStats } from "@/hooks/useUserStats";

interface Course {
  id: string;
  title: string;
  slug: string;
  course_type: string;
  detail: string;
  image_url?: string;
  svg_icon?: string;
  video_url?: string;
  duration: number;
  duration_in: string;
  order_by: number;
  top_image_url?: string;
  bottom_image_url?: string;
  background_image_url?: string;
  is_erased: boolean;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  course_tags?: {
    tags: {
      id: string;
      title: string;
    };
  }[];
}

interface Tag {
  id: string;
  title: string;
  tagtype_id: string;
  is_approved: boolean;
}

export default function CompletedCoursesPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const userId = authUser.id;
  const [currentView, setCurrentView] = useState<
    "overview" | "course" | "lesson"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const { data: userStats, isLoading, error } = useUserStats(userId || "");
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading user data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button
            onClick={() => navigate("/admin/users")}
            className="mt-4"
            variant="outline"
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No user data available</p>
      </div>
    );
  }



  const { courses, lessons, questions, progress } = userStats;

  const filteredCourses = courses.course_list.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate course progress based on completed lessons
  const calculateCourseProgress = (course: any) => {
    const courseLessons = lessons.lesson_list.filter(
      (lesson) => lesson.course_title === course.title
    );
    if (courseLessons.length === 0) return 0;

    const completedLessons = courseLessons.filter(
      (lesson) => lesson.is_completed
    );
    const progressPercentage = Math.round(
      (completedLessons.length / courseLessons.length) * 100
    );

    return progressPercentage;
  };

  return (
    <AdminLayout
      title="Completed Courses"
      subtitle="View All The Available Courses"
    >
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
              <span className="text-purple-300 font-semibold">
                {filteredCourses?.length || 0} Courses enrolled
              </span>
            </div>
          </div>
        </div>
        {/* {console.log({ filteredCourses })} */}
      </div>

      {!filteredCourses || filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700 max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-purple-400" />
              <h3 className="text-2xl font-bold mb-3 text-white">
                No courses available
              </h3>
              <p className="text-gray-400">
                There are no courses available for your class yet.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {filteredCourses.filter((course) => course.is_completed).map((course) => (
            <div
              key={course.id}
              className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20"
            >
              {/* Course Image with Overlay */}
              <div className="relative overflow-hidden">
                {/* <img
                  src={
                    course.image_asset_id
                      ? course.image_asset.url
                      : "/images/drone.jpg"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div> */}

                {/* Duration Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-purple-600/90 backdrop-blur-sm text-white text-sm font-semibold py-2 px-3 rounded-full flex items-center gap-2 shadow-lg">
                    <Clock className="w-4 h-4" />
                    {course.duration} {course.duration_in}
                  </div>
                </div>

                {/* Course Type Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg ${course.course_type === "free"
                      ? "bg-green-600/90 backdrop-blur-sm"
                      : "bg-yellow-600/90 backdrop-blur-sm"
                      }`}
                  >
                    {course.course_type.toUpperCase()}
                  </div>
                </div>

                {/* SVG Icon Overlay */}
                {/* {course.svg_icon && (
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div
                      className="w-8 h-8 text-white"
                      dangerouslySetInnerHTML={{ __html: course.svg_icon }}
                    />
                  </div>
                )} */}
              </div>

              {/* Course Content */}
              <div className="p-6 flex flex-col">
                {/* Course Tags */}
                {course.course_tags && course.course_tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {course.course_tags.map((courseTag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 transition-colors"
                        >
                          {courseTag.tags.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                  {course.title}
                </h2>
                <span className="font-medium text-foreground text-sm mb-4 block">
                  Enrolled on{" "}
                  {new Date(course.enrolled_at).toLocaleDateString()}
                </span>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                  {course.detail}
                </p>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/90">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {calculateCourseProgress(course)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${calculateCourseProgress(course) === 100
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : calculateCourseProgress(course) > 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                        }`}
                      style={{ width: `${calculateCourseProgress(course)}%` }}
                    ></div>
                  </div>
                </div>
                <br />
                {/* Action Button */}
                <button
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
