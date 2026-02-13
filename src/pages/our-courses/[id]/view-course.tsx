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
    X,
    Bot,
    Cpu,
    Laptop,
    Zap,
    Rocket,
    Gamepad2,
    Wifi,
    Settings,
    Battery,
    Plug,
    Radio,
    Brain,
    Wrench,
    Smartphone,
    Search,
    Ruler,
    Telescope,
    Microscope,
    Lightbulb
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
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

    const backgroundIcons = [
        { icon: Bot, x: '10%', y: '20%', size: 60, delay: 0 },
        { icon: Rocket, x: '85%', y: '15%', size: 60, delay: 1 },
        { icon: BookOpen, x: '15%', y: '70%', size: 60, delay: 2 },
        { icon: Laptop, x: '80%', y: '65%', size: 60, delay: 0.5 },
        { icon: Settings, x: '5%', y: '50%', size: 60, delay: 1.5 },
        { icon: Zap, x: '90%', y: '80%', size: 28, delay: 2.5 },
        { icon: Battery, x: '25%', y: '10%', size: 30, delay: 3 },
        { icon: Plug, x: '70%', y: '5%', size: 60, delay: 1.2 },
        { icon: Radio, x: '40%', y: '85%', size: 28, delay: 0.8 },
        { icon: Brain, x: '60%', y: '75%', size: 50, delay: 1.8 },
        { icon: Gamepad2, x: '12%', y: '40%', size: 66, delay: 2.2 },
        { icon: Cpu, x: '88%', y: '35%', size: 60, delay: 0.3 },
        { icon: Wrench, x: '35%', y: '25%', size: 20, delay: 1.1 },
        { icon: Smartphone, x: '65%', y: '20%', size: 60, delay: 2.7 },
        { icon: Wifi, x: '50%', y: '15%', size: 60, delay: 0.6 },
        { icon: Search, x: '30%', y: '60%', size: 60, delay: 1.9 },
        { icon: Ruler, x: '70%', y: '60%', size: 18, delay: 2.4 },
        { icon: Telescope, x: '45%', y: '45%', size: 60, delay: 0.9 },
        { icon: Microscope, x: '55%', y: '55%', size: 60, delay: 1.4 },
        { icon: Lightbulb, x: '20%', y: '30%', size: 50, delay: 0.2 },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden pt-[80px]" style={{ background: 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)' }}>
            {/* Brand Logo Watermark Icon Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full">
                {backgroundIcons.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <motion.div
                            key={index}
                            style={{
                                position: 'absolute',
                                left: item.x,
                                top: item.y,
                                color: 'white',
                                opacity: 0.12,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [-15, 15, -15],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: "easeInOut"
                            }}
                        >
                            <IconComponent size={item.size} strokeWidth={1.5} />
                        </motion.div>
                    );
                })}
            </div>
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
                <div className="bg-transparent border-none rounded-2xl p-0 mb-8 relative overflow-hidden">
                    {/* Animated background elements */}

                    <div className="space-y-6">
                        {/* Back Button */}
                        <Button
                            variant="outline"
                            onClick={() => navigate("/our-courses")}
                            className="mb-4 bg-white border-cyan-500 text-cyan-600 transition-all duration-300 hover:bg-cyan-50 shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Button>

                        {/* Course Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Course Details */}
                            <div className="lg:col-span-2">
                                <Card className="bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                                    {/* Animated background elements */}
                                    <div className="absolute top-2 left-2 text-xl opacity-30 animate-bounce text-cyan-500">🎮</div>
                                    <div className="absolute top-2 right-2 text-xl opacity-30 animate-pulse text-pink-500">🤖</div>

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
                                                        <CardTitle className="text-3xl text-gray-900 font-oswald">{courseData?.title}</CardTitle>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/25">
                                                                🎯 {courseData?.course_type}
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-sm text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1">
                                                                <Clock className="w-4 h-4 text-cyan-500" />
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
                                        <CardDescription className="text-base leading-relaxed text-gray-700">
                                            {/* {courseData?.detail} */}
                                            <div className="main-content text-gray-700" dangerouslySetInnerHTML={{ __html: courseData?.detail || '' }} />
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                                {/* Lessons List */}
                                <Card className="bg-white border border-gray-100 shadow-xl p-6 mt-4 relative overflow-hidden">
                                    {/* Animated background elements */}
                                    <div className="absolute top-2 left-2 text-xl opacity-30 animate-bounce text-yellow-500">📚</div>
                                    <div className="absolute top-2 right-2 text-xl opacity-30 animate-pulse text-green-500">🎓</div>

                                    <CardHeader className="p-0 pb-4 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-gray-900 p-0 font-oswald text-2xl">
                                                    <Play className="w-6 h-6 text-cyan-500" />
                                                    Course Lessons ({lessons?.length})
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 relative z-10">
                                        {lessons?.length === 0 ? (
                                            <div className="text-center py-12">
                                                <BookOpen className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 No lessons yet</h3>
                                                <p className="text-gray-600">Lessons are coming soon!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {[...(lessons || [])]
                                                    .sort((a, b) => (a.order_by || 0) - (b.order_by || 0))
                                                    .map((lesson, index) => (
                                                        <Card key={lesson.id} className="bg-white border border-gray-100 hover:border-cyan-300 transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg">
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-4">
                                                                    {/* Lesson Number */}
                                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500 text-white font-bold text-lg shadow-md animate-pulse">
                                                                        {index + 1}
                                                                    </div>

                                                                    {/* Lesson Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-bold truncate text-gray-900 text-lg font-oswald">{lesson.title}</h4>
                                                                        <div className="text-sm text-gray-600 line-clamp-1 mt-1">
                                                                            <div dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
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
                                    <Card className="bg-white border border-gray-100 shadow-xl mb-5 relative overflow-hidden">
                                        {/* Animated background elements */}
                                        <CardHeader className="pb-3 relative z-10">
                                            <CardTitle className="text-lg text-gray-900 font-oswald"> Price</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-oswald"> FREE </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                                        {/* Animated background elements */}
                                        <CardHeader className="pb-3 relative z-10">
                                            <CardTitle className="text-lg text-gray-900 font-oswald">Course Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-between bg-cyan-50 border border-cyan-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-cyan-600" />
                                                    <span className="text-sm text-cyan-700 font-medium"> Total Lessons</span>
                                                </div>
                                                <span className="text-2xl font-bold text-cyan-600 font-oswald">{lessons?.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between bg-pink-50 border border-pink-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <HelpCircle className="w-5 h-5 text-pink-600" />
                                                    <span className="text-sm text-pink-700 font-medium"> Total Questions</span>
                                                </div>
                                                <span className="text-2xl font-bold text-pink-600 font-oswald">{lessons?.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-yellow-600" />
                                                    <span className="text-sm text-yellow-700 font-medium"> Duration</span>
                                                </div>
                                                <span className="text-2xl font-bold text-yellow-600 font-oswald">{courseData?.duration} {courseData?.duration_in}</span>
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
                            <DialogContent className="max-w-4xl w-full h-auto p-0 bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
                                {/* Animated background elements */}
                                <div className="absolute top-2 left-2 text-2xl opacity-30 animate-bounce text-cyan-500">🎬</div>
                                <div className="absolute top-2 right-2 text-2xl opacity-30 animate-pulse text-pink-500">🎥</div>
                                <div className="absolute bottom-2 left-1/3 text-xl opacity-30 animate-bounce delay-1000 text-yellow-500">⭐</div>
                                <div className="absolute bottom-2 right-1/3 text-xl opacity-30 animate-pulse delay-500 text-green-500">🚀</div>

                                <DialogHeader className="p-4 pb-0 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-gray-900 text-xl font-oswald">
                                            🎬 Course Preview Video
                                        </DialogTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowVideoModal(false)}
                                            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </DialogHeader>
                                <div className="p-4 relative z-10">
                                    {courseData?.video_url && extractYouTubeId(courseData.video_url) ? (
                                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-100 shadow-lg"
                                                src={`https://www.youtube.com/embed/${extractYouTubeId(courseData.video_url)}?autoplay=1&rel=0`}
                                                title="Course Preview Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shadow-inner">
                                            <div className="text-center text-gray-400">
                                                <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <p className="text-lg font-oswald">🚀 No valid video URL found</p>
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