import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, Plus, Clock, Play, BookOpen } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCoursesByTag } from "@/hooks/useCoursesByTag";
import { useDebounce } from "@/hooks/useDebounce";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


export default function CoursesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [pagination, setPagination] = useState({
    searchTerm: "",
    currentPage: 1,
    limit: 3,
  });

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(pagination.searchTerm, 300);

  const {
    data: coursesResult,
    isLoading: isLoadingCourses,
    error: coursesError,
    refetch: refetchCourses,
  } = useCoursesByTag({
    tagId: user?.tag_id ?? null,
    pagination: {
      ...pagination,
      searchTerm: debouncedSearchTerm,
    },
    enabled: !!user?.tag_id,
  });

  const courses = coursesResult?.courses ?? [];
  const totalData = coursesResult?.totalData ?? 0;
  const totalPages = coursesResult?.totalPages ?? 1;
  const currentPage = coursesResult?.currentPage ?? 1;

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setPagination((prev) => ({
      ...prev,
      searchTerm: term,
      currentPage: 1, // Reset to first page on search
    }));
  };

  if (isLoadingCourses) {
    return (
      <AdminLayout title="Course Management" subtitle="Loading courses...">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (coursesError) {
    return (
      <AdminLayout title="Course Management" subtitle="Error loading courses">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              Error loading courses: {(coursesError as Error).message}
            </p>
            <Button onClick={() => refetchCourses()}>Retry</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Available Courses" subtitle="Choose from our collection of interactive learning experiences">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          {/* <div>
            <h1 className="text-4xl font-bold text-white mb-2">Available Courses</h1>
            <p className="text-gray-400 text-lg">
              Choose from our collection of interactive learning experiences
            </p>
          </div> */}

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/admin/courses/new')}
              className="bg-red-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
            >
              <span className="text-red-300 font-semibold">Recently Added</span>
            </button>

            <div className="bg-purple-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
              <span className="text-purple-300 font-semibold">
                {totalData} {totalData === 1 ? "Course" : "Courses"} Available
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <div className="relative">
            <Input
              placeholder="Search courses..."
              value={pagination.searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* No Courses */}
      {courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700 max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-purple-400" />
              <h3 className="text-2xl font-bold mb-3 text-white">No courses found</h3>
              <p className="text-gray-400">
                {pagination.searchTerm
                  ? `No courses match "${pagination.searchTerm}".`
                  : "There are no courses available for your class yet."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Courses Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 flex-col justify-between  hover:shadow-white/25 h-full flex"
              >
                <div>

                  {/* Course Image */}
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

                    {/* Course Type + New Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {(() => {
                        const courseCreatedDate = new Date(course.created_at);
                        const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
                        const isRecent = courseCreatedDate >= fifteenDaysAgo;

                        return isRecent && (
                          <div className="text-white text-xs py-2 px-4 rounded-full shadow-lg bg-red-600/90 backdrop-blur-sm">
                            NEW
                          </div>
                        );
                      })()}
                      <div
                        className={`text-white text-xs py-2 px-4 rounded-full shadow-lg ${course.course_type === "free"
                          ? "bg-green-600/90 backdrop-blur-sm"
                          : "bg-yellow-600/90 backdrop-blur-sm"
                          }`}
                      >
                        {course.course_type.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 flex flex-col">
                    {/* Title */}

                    <div>
                      <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                        {course.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                        {course.short_description}
                      </p>
                    </div>


                  </div>


                </div>
                {/* Action Button */}
                <div className="px-4 mb-4">

                  <button
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                    className="text-2xl w-full py-5  bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 group">
                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}