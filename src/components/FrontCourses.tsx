import React, { useMemo, useState, useEffect } from 'react';
import CourseCardNew from './CourseCardNew';
import { useCoursesWithFilter } from '../hooks/useCoursesWithTags'; // Updated hook
import { useTags, useTagTypes } from '../hooks/useTags';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

interface FrontCoursesProps {
  headerSearchTerm?: string;
}

const FrontCourses: React.FC<FrontCoursesProps> = ({ headerSearchTerm }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(headerSearchTerm || '');
  const [selectedTagType, setSelectedTagType] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8; // Fixed limit (matches hook default)

  // Fetch filtered & paginated courses 
  const {
    data: coursesResult,
    isLoading,
    error,
  } = useCoursesWithFilter({
    filter: {
      searchTerm,
      selectedTagType,
      selectedTag,
    },
    pagination: {
      limit,
      currentPage,
    },
    enabled: true,
  });

  const { data: tags = [] } = useTags();
  const { data: tagTypes = [] } = useTagTypes();

  // We wrap courses in useMemo to append mock data to reach the user's requested 8-card grid
  const courses = useMemo(() => {
    const apiCourses = coursesResult?.courses ?? [];

    // If we have less than 8 courses and not currently searching/filtering, 
    // we add mock courses to fill up the grid as requested.
    if (!searchTerm && selectedTagType === 'all' && apiCourses.length > 0 && apiCourses.length < 8) {
      const mockCount = 8 - apiCourses.length;
      const mockCourses: any[] = [
        {
          id: 'mock-1',
          title: 'Advanced Robotics: AI & ML',
          course_type: 'Pro',
          detail: 'Dive deep into Artificial Intelligence and Machine Learning for robotics. Build smart machines that can perceive and react to their environment.',
          slug: 'advanced-robotics',
          order_by: 100
        },
        {
          id: 'mock-2',
          title: 'Python for Young Creators',
          course_type: 'Beginner',
          detail: 'Learn the fundamentals of Python programming in a fun, interactive way. Create your first scripts and automate simple robot tasks.',
          slug: 'python-creators',
          order_by: 101
        },
        {
          id: 'mock-3',
          title: '3D Design & Printing',
          course_type: 'Creative',
          detail: 'Master the art of 3D modeling and bring your custom robot parts to life with 3D printing technology. From concept to physical reality.',
          slug: '3d-design',
          order_by: 102
        },
        {
          id: 'mock-4',
          title: 'IoT & Connected Devices',
          course_type: 'Advanced',
          detail: 'Explore the Internet of Things (IoT). Connect your robots to the cloud and control them from anywhere in the world using web interfaces.',
          slug: 'iot-devices',
          order_by: 103
        },
        {
          id: 'mock-5',
          title: 'Competitive Robotic Soccer',
          course_type: 'Competition',
          detail: 'Train your robot team for the ultimate soccer challenge. Learn strategy, fast movement algorithms, and high-speed coordination.',
          slug: 'robot-soccer',
          order_by: 104
        },
        {
          id: 'mock-6',
          title: 'Micro-Controller Masterclass',
          course_type: 'Hardware',
          detail: 'Explore the heart of robotics. Master Arduino, ESP32, and Raspberry Pi Pi to build the brain of your next robotic masterpiece.',
          slug: 'micro-controller',
          order_by: 105
        }
      ].slice(0, mockCount); // Only add what's needed to reach 8

      return [...apiCourses, ...mockCourses];
    }
    return apiCourses;
  }, [coursesResult, searchTerm, selectedTagType]);

  const totalData = coursesResult?.totalData ? coursesResult.totalData + (courses.length - (coursesResult?.courses?.length || 0)) : courses.length;
  const totalPages = Math.max(1, Math.ceil(totalData / limit));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTagType, selectedTag]);

  // Available tags for selected tag type
  const availableTags = useMemo(() => {
    if (selectedTagType === 'all') return [];
    return tags.filter((tag) => tag.tagtype_id === selectedTagType && tag.is_approved);
  }, [tags, selectedTagType]);

  // Get tag types that have at least one course
  const courseTagTypes = useMemo(() => {
    const typeIds = new Set<string>();
    courses.forEach((course) => {
      course.course_tags?.forEach((ct) => {
        if (ct.tags.tag_types?.id) {
          typeIds.add(ct.tags.tag_types.id);
        }
      });
    });
    return tagTypes.filter((tt) => typeIds.has(tt.id));
  }, [courses, tagTypes]);

  // Handlers
  const handleTagTypeChange = (value: string) => {
    setSelectedTagType(value);
    setSelectedTag('all');
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTagType('all');
    setSelectedTag('all');
    setCurrentPage(1);
  };

  const handleEnroll = (courseId: string) => {
    navigate(`/our-courses/${courseId}`);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">

      <div className="flex flex-col lg:flex-row gap-8 relative items-start justify-between">

        {/* LEFT COLUMN: Sticky Video - Always Visible */}
        <div className="hidden lg:block w-[400px] xl:w-[450px] sticky top-24 h-[500px] flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-blue-100/50">
          {/* 
              Replaced robot image with the requested WhatsApp video.
              Video is set to autoplay, loop, and mute for background effect.
           */}
          <div className="w-full h-full flex items-center justify-center">
            <video
              src="/images/WhatsApp Video 2026-02-05 at 21.10.46.mp4"
              className="w-full h-full object-cover pointer-events-none mix-blend-multiply brightness-110 contrast-110"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Header, Filters, Content */}
        <div className="flex-1 w-full min-w-0">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2 oswald">Our Courses</h1>
            <p className="text-blue-600 text-lg">Explore our cutting-edge robotics curriculum</p>
          </div>

          {/* Search & Filter Section Wrapper */}
          <div className="relative w-full mb-8">
            <div className="bg-blue-900 border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-3 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-2xl opacity-20 animate-bounce text-cyan-400">Search</div>
              <div className="absolute top-2 right-2 text-2xl opacity-20 animate-pulse text-pink-400">Gamepad</div>
              <div className="absolute bottom-2 left-1/3 text-xl opacity-20 animate-bounce delay-1000 text-yellow-400">Robot</div>
              <div className="absolute bottom-2 right-1/3 text-xl opacity-20 animate-pulse delay-500 text-green-400">Star</div>

              <div className="flex flex-col lg:flex-row gap-4 relative z-10 items-center">
                {/* Search */}
                <div className="flex-1 relative w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                    <Input
                      placeholder="Search for amazing robot courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 pl-10 bg-[#0F0F23] border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/25 shadow-lg shadow-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Tag Type Filter */}
                <div className="lg:w-48">
                  <Select value={selectedTagType} onValueChange={handleTagTypeChange}>
                    <SelectTrigger className="bg-[#0F0F23] h-14 border-cyan-400/50 text-white hover:border-cyan-400 focus:border-cyan-400 shadow-lg shadow-cyan-500/10">
                      <Filter className="w-4 h-4 mr-2 text-cyan-400" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A2E] border-cyan-400/30">
                      <SelectItem value="all" className="text-white hover:bg-cyan-500/20">
                        All Categories
                      </SelectItem>
                      {courseTagTypes.map((tagType) => (
                        <SelectItem key={tagType.id} value={tagType.id} className="text-white hover:bg-cyan-500/20">
                          {tagType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag Filter */}
                {selectedTagType !== 'all' && availableTags.length > 0 && (
                  <div className="lg:w-48">
                    <Select value={selectedTag} onValueChange={handleTagChange}>
                      <SelectTrigger className="bg-[#0F0F23] border-pink-400/50 text-white hover:border-pink-400 focus:border-pink-400 shadow-lg shadow-pink-500/10">
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A2E] border-pink-400/30">
                        <SelectItem value="all" className="text-white hover:bg-pink-500/20">
                          All Tags
                        </SelectItem>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id} className="text-white hover:bg-pink-500/20">
                            {tag.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedTagType !== 'all' || selectedTag !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-cyan-400 font-bold">Active filters:</span>
                  {searchTerm && (
                    <Badge className="flex items-center gap-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300">
                      Search "{searchTerm}"
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => setSearchTerm('')}
                      />
                    </Badge>
                  )}
                  {selectedTagType !== 'all' && (
                    <Badge className="flex items-center gap-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 text-pink-300 hover:bg-pink-500/30 transition-all duration-300">
                      {courseTagTypes.find((tt) => tt.id === selectedTagType)?.name}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => {
                          setSelectedTagType('all');
                          setSelectedTag('all');
                        }}
                      />
                    </Badge>
                  )}
                  {selectedTag !== 'all' && (
                    <Badge className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-300">
                      {availableTags.find((t) => t.id === selectedTag)?.title}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => setSelectedTag('all')}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(limit)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded mb-4"></div>
                  <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-400 text-xl font-bold mb-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 rounded-xl p-4">
                Error loading courses
              </div>
              <p className="text-gray-300 mb-6">
                Please try refreshing the page or contact support.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white"
              >
                Refresh Page
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && courses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-cyan-400 text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl p-6">
                No courses found
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                Try adjusting your search or filters.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/25"
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Course List & Pagination */}
          {!isLoading && !error && courses.length > 0 && (
            <>
              <div className="flex flex-col gap-10">
                {courses.map((course, index) => (
                  <CourseCardNew key={course.id} course={course} index={index} onEnroll={handleEnroll} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
                  <div className="text-sm text-cyan-400 font-bold mb-4 sm:mb-0">
                    Showing {(currentPage - 1) * limit + 1} to{' '}
                    {Math.min(currentPage * limit, totalData)} of {totalData} courses
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className="hidden sm:flex bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 ${currentPage === pageNum
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border border-cyan-400/50'
                            : 'bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-lg shadow-cyan-500/10'
                            }`}
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className="hidden sm:flex bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>

                    {/* Quick Jump */}
                    <div className="hidden lg:flex items-center space-x-2 ml-4 pl-4 border-l border-cyan-400/30">
                      <span className="text-sm text-cyan-400 font-bold">Go to:</span>
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) goToPage(page);
                        }}
                        className="w-16 h-8 text-center bg-[#0F0F23] border-cyan-400/50 text-white focus:border-cyan-400 focus:ring-cyan-400/25"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const page = parseInt((e.target as HTMLInputElement).value);
                            if (page >= 1 && page <= totalPages) goToPage(page);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontCourses;