import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Play,
    Loader2,
    ArrowLeft,
    Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCoursesByTag } from "@/hooks/useCoursesByTag";

export default function RecentCoursesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pagination] = useState({
        searchTerm: "",
        currentPage: 1,
        limit: 1000, // Large limit to get all courses for filtering
    });

    // Use React Query to fetch courses by tag_id
    const {
        data: coursesResult,
        isLoading: isLoadingCourses,
        error: coursesError,
        refetch: refetchCourses
    } = useCoursesByTag({
        tagId: user?.tag_id ?? null,
        pagination,
        enabled: !!user?.tag_id,
    });

    if (isLoadingCourses) {
        return (
            <AdminLayout title="Recent Courses" subtitle="Loading recent courses...">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    if (coursesError) {
        return (
            <AdminLayout title="Recent Courses" subtitle="Error loading courses">
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Error loading courses: {(coursesError as Error).message}</p>
                        <Button onClick={() => refetchCourses()}>Retry</Button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const allCourses = coursesResult?.courses ?? [];
    const totalData = coursesResult?.totalData ?? 0;

    // Filter courses to show only recent ones (created within last 15 days)
    const recentCourses = allCourses.filter(course => {
        const courseCreatedDate = new Date(course.created_at);
        const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
        return courseCreatedDate >= fifteenDaysAgo;
    });

    return (
        <AdminLayout
            title="Recent Courses"
            subtitle="Discover the latest courses added to our platform"
        >
            {/* Enhanced Header */}
            <div className="mb-8">
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin/courses')}
                        className="text-gray-400 hover:text-white hover:bg-blue-800/50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Courses
                    </Button>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-red-400" />
                                Recently Added Courses
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Fresh content added within the last 15 days
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-red-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30">
                            <span className="text-red-300 font-semibold">
                                {recentCourses.length} Recent Courses
                            </span>
                        </div>
                        <div className="bg-purple-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
                            <span className="text-purple-300 font-semibold">
                                {totalData} Total Courses
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {recentCourses.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700 max-w-md mx-auto">
                        <div className="text-gray-400 mb-6">
                            <Sparkles className="w-20 h-20 mx-auto mb-6 text-red-400" />
                            <h3 className="text-2xl font-bold mb-3 text-white">No recent courses</h3>
                            <p className="text-gray-400">No courses have been added in the last 15 days.</p>
                        </div>
                        <Button
                            onClick={() => navigate('/admin/courses')}
                            className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        >
                            View All Courses
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {recentCourses.map((course) => (
                        <div
                            key={course.id}
                            className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 h-full flex flex-col justify-between"
                        >
                            <div>
                                {/* Course Image with Overlay */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={
                                            course.image_asset?.url ||
                                            course.top_image_asset?.url ||
                                            "/images/drone.jpg"
                                        }
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-purple-600/90 backdrop-blur-sm text-white text-xs py-2 px-3 rounded-full flex items-center gap-2 shadow-lg">
                                            <Clock className="w-4 h-4" />
                                            {course.duration} {course.duration_in}
                                        </div>
                                    </div>

                                    {/* Course Type Badge */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <div className="text-white text-xs py-2 px-4 rounded-full shadow-lg bg-red-600/90 backdrop-blur-sm">
                                            NEW
                                        </div>
                                        <div className={`text-white text-xs py-2 px-4 rounded-full shadow-lg ${course.course_type === 'free'
                                            ? 'bg-green-600/90 backdrop-blur-sm'
                                            : 'bg-yellow-600/90 backdrop-blur-sm'
                                            }`}>
                                            {course.course_type.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className="p-6 flex flex-col">
                                    {/* Course Tags */}
                                    {course.course_tags && course.course_tags.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex gap-2 truncate">
                                                {course?.course_tags?.map((courseTag, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30 transition-colors"
                                                    >
                                                        {courseTag?.tags?.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Title */}
                                    <h2 className="text-xl font-bold mb-3 text-white group-hover:text-red-300 transition-colors">
                                        {course.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                        {course.short_description || course.detail}
                                    </p>

                                    {/* Created Date */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500">
                                            Added {new Date(course.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="px-4 mb-4">
                                <button
                                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                                    className="text-2xl w-full py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 group"
                                >
                                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Start Learning
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
