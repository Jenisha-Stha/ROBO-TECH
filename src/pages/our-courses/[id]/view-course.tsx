import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { Lesson } from "@/types/lessons";
import {
    ArrowLeft,
    BookOpen,
    Clock,
    HelpCircle,
    Image as ImageIcon,
    Play,
    Plus,
    Users,
    Video,
    X
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import Header from "@/components/layout/header";





export default function ViewCourse() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showVideoModal, setShowVideoModal] = useState(false);

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

    // Function to extract YouTube video ID from URL
    const extractYouTubeId = (url: string): string | null => {
        if (!url) return null;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11) ? match[2] : null;
    };


    if (isLoadingItem || isLoadingLessons) {
        return <div>Loading...</div>
    }

    // Type assertion to help TypeScript understand the course object
    const courseData = course as Course | null;

    return (
        <div className="bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
            {/* Animated space background */}
            {/* <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${1 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div> */}

            <Header />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 mb-8 relative overflow-hidden">
                    {/* Animated background elements */}

                    <div className="space-y-6">
                        {/* Back Button */}
                        <Button
                            variant="outline"
                            onClick={() => navigate("/our-courses")}
                            className="mb-4 bg-[#0F0F23] border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Button>

                        {/* Course Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Course Details */}
                            <div className="lg:col-span-2">
                                <Card className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
                                    {/* Animated background elements */}
                                    <div className="absolute top-2 left-2 text-xl opacity-20 animate-bounce text-cyan-400">🎮</div>
                                    <div className="absolute top-2 right-2 text-xl opacity-20 animate-pulse text-pink-400">🤖</div>

                                    <CardHeader className="p-4 pb-4 relative z-10">
                                        <div>
                                            {courseData?.image_asset_id ? (
                                                <img
                                                    src={courseData.image_asset?.url || '/images/drone.jpg'}
                                                    alt={courseData.title}
                                                    className="w-full h-full rounded-lg object-cover border border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                                                />
                                            ) : (
                                                <div className="w-full h-64 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden border border-cyan-400/30 shadow-lg shadow-cyan-500/10">
                                                    {/* Animated background elements */}
                                                    {/* <div className="absolute top-2 left-2 text-2xl opacity-30 animate-bounce text-white">🤖</div>
                                                    <div className="absolute top-2 right-2 text-2xl opacity-30 animate-pulse text-white">🚀</div>
                                                    <div className="absolute bottom-2 left-1/3 text-xl opacity-30 animate-bounce delay-1000 text-white">⭐</div>
                                                    <div className="absolute bottom-2 right-1/3 text-xl opacity-30 animate-pulse delay-500 text-white">🎮</div> */}
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between mt-4">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <CardTitle className="text-3xl text-white font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">{courseData?.title}</CardTitle>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/25">
                                                                🎯 {courseData?.course_type}
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg px-3 py-1">
                                                                <Clock className="w-4 h-4 text-cyan-400" />
                                                                ⏰ {courseData?.duration} {courseData?.duration_in}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Video Preview Button */}
                                                {courseData?.video_url && extractYouTubeId(courseData.video_url) && (
                                                    <Button
                                                        onClick={() => setShowVideoModal(true)}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white border border-pink-400/50 shadow-lg shadow-pink-500/25 transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        <Video className="w-4 h-4" />
                                                        🎬 Watch Teaser
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 relative z-10">
                                        <CardDescription className="text-base leading-relaxed text-gray-300">
                                            {/* {courseData?.detail} */}
                                            <div className="main-content" dangerouslySetInnerHTML={{ __html: courseData?.detail }} />
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                                {/* Lessons List */}
                                <Card className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] shadow-2xl shadow-cyan-500/10 p-6 mt-4 relative overflow-hidden">
                                    {/* Animated background elements */}
                                    <div className="absolute top-2 left-2 text-xl opacity-20 animate-bounce text-yellow-400">📚</div>
                                    <div className="absolute top-2 right-2 text-xl opacity-20 animate-pulse text-green-400">🎓</div>

                                    <CardHeader className="p-0 pb-4 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-white p-0 font-oswald text-2xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                                                    <Play className="w-6 h-6 text-cyan-400" />
                                                    Course Lessons ({lessons?.length})
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 relative z-10">
                                        {lessons?.length === 0 ? (
                                            <div className="text-center py-12">
                                                <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-white mb-2">🚀 No lessons yet</h3>
                                                <p className="text-gray-300">Lessons are coming soon!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {lessons
                                                    .sort((a, b) => a.order_by - b.order_by)
                                                    .map((lesson, index) => (
                                                        <Card key={lesson.id} className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/10">
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-4">
                                                                    {/* Lesson Number */}
                                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 animate-pulse">
                                                                        {index + 1}
                                                                    </div>

                                                                    {/* Lesson Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-bold truncate text-white text-lg font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">{lesson.title}</h4>
                                                                        <div className="text-sm text-gray-300 line-clamp-1 mt-1">
                                                                            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                                                        </div>
                                                                    </div>

                                                                    {/* Lesson Status Indicator */}
                                                                    {/* <div className="flex items-center gap-2">
                                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
                                                                        <span className="text-xs text-green-300 font-medium">Ready</span>
                                                                    </div> */}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Stats Sidebar */}
                            <div className="space-y-4">
                                <div className="sticky top-20">
                                    <Card className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 shadow-2xl shadow-cyan-500/10 mb-5 relative overflow-hidden">
                                        {/* Animated background elements */}
                                        <CardHeader className="pb-3 relative z-10">
                                            <CardTitle className="text-lg text-white font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"> Price</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-oswald"> FREE </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
                                        {/* Animated background elements */}
                                        <CardHeader className="pb-3 relative z-10">
                                            <CardTitle className="text-lg text-white font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Course Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-cyan-400" />
                                                    <span className="text-sm text-cyan-300 font-medium"> Total Lessons</span>
                                                </div>
                                                <span className="text-2xl font-bold text-cyan-400 font-oswald">{lessons?.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-400/30 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <HelpCircle className="w-5 h-5 text-pink-400" />
                                                    <span className="text-sm text-pink-300 font-medium"> Total Questions</span>
                                                </div>
                                                <span className="text-2xl font-bold text-pink-400 font-oswald">{lessons?.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-yellow-400" />
                                                    <span className="text-sm text-yellow-300 font-medium"> Duration</span>
                                                </div>
                                                <span className="text-2xl font-bold text-yellow-400 font-oswald">{courseData?.duration} {courseData?.duration_in}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <button onClick={() => navigate(`/admin/courses/${courseId}`)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-2xl shadow-cyan-500/25 border border-cyan-400/50 transform hover:scale-105 transition-all duration-300 w-full mt-5 font-oswald text-lg">
                                        Start Learning
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* YouTube Video Modal - Dark Theme */}
                        <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
                            <DialogContent className="max-w-4xl w-full h-auto p-0 bg-gradient-to-br from-[#0F0F23] to-[#16213E] border border-cyan-400/30 shadow-2xl shadow-cyan-500/25 relative overflow-hidden">
                                {/* Animated background elements */}
                                <div className="absolute top-2 left-2 text-2xl opacity-20 animate-bounce text-cyan-400">🎬</div>
                                <div className="absolute top-2 right-2 text-2xl opacity-20 animate-pulse text-pink-400">🎥</div>
                                <div className="absolute bottom-2 left-1/3 text-xl opacity-20 animate-bounce delay-1000 text-yellow-400">⭐</div>
                                <div className="absolute bottom-2 right-1/3 text-xl opacity-20 animate-pulse delay-500 text-green-400">🚀</div>

                                <DialogHeader className="p-4 pb-0 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-white text-xl font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                                            🎬 Course Preview Video
                                        </DialogTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowVideoModal(false)}
                                            className="text-white hover:bg-cyan-500/20 border border-cyan-400/30 rounded-lg transition-all duration-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </DialogHeader>
                                <div className="p-4 relative z-10">
                                    {courseData?.video_url && extractYouTubeId(courseData.video_url) ? (
                                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                                                src={`https://www.youtube.com/embed/${extractYouTubeId(courseData.video_url)}?autoplay=1&rel=0`}
                                                title="Course Preview Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-96 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-lg flex items-center justify-center border border-cyan-400/30 shadow-lg shadow-cyan-500/10">
                                            <div className="text-center text-white">
                                                <Video className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                                                <p className="text-lg font-oswald bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">🚀 No valid video URL found</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </div>
        </div>
    );
}