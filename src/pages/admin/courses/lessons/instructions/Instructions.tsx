import { AdminLayout } from "@/components/admin/AdminLayout";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Play, ArrowRight, BookOpen, Clock, Star, Sparkles, Video, Target, Brain, Zap, CheckCircle, X } from "lucide-react";
import { Lesson } from "@/types/lessons";
import { Button } from "@/components/ui/button";
import YouTube from 'react-youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// YouTube API TypeScript declarations
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function Instructions() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [showMainContent, setShowMainContent] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const modalVideoRef = useRef<HTMLVideoElement | null>(null);
    const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

    const extractYouTubeId = (url: string): string | null => {
        if (!url) return null;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Fetch lesson data
    const { item: lesson, isLoadingItem } = useFetchSingle<Lesson>('lessons', 'lesson', lessonId, `*,
         questions:questions(count),
      image_asset:assets!lessons_image_asset_id_fkey(
        id,
        url,
        file_name,
        asset_type,
        alt_text,
        description
      ),
      video_asset:assets!lessons_video_asset_id_fkey(
        id,
        url,
        file_name,
        asset_type,
        alt_text,
        description,
        duration,
        thumbnail_url
      )`);

    // Type assertion to help TypeScript understand the lesson object
    const lessonData = lesson as Lesson | null;

    // Load YouTube API and set up event listeners
    // useEffect(() => {
    //     if (lessonData && !isLoadingItem && lessonData.video_url && extractYouTubeId(lessonData.video_url)) {
    //         // Load YouTube API
    //         const loadYouTubeAPI = () => {
    //             if (window.YT && window.YT.Player) {
    //                 setupYouTubePlayer();
    //             } else {
    //                 const tag = document.createElement('script');
    //                 tag.src = 'https://www.youtube.com/iframe_api';
    //                 const firstScriptTag = document.getElementsByTagName('script')[0];
    //                 firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    //                 window.onYouTubeIframeAPIReady = () => {
    //                     setupYouTubePlayer();
    //                 };
    //             }
    //         };

    //         const setupYouTubePlayer = () => {
    //             if (youtubeIframeRef.current && window.YT && window.YT.Player) {
    //                 try {
    //                     const player = new window.YT.Player(youtubeIframeRef.current, {
    //                         events: {
    //                             'onStateChange': (event: any) => {
    //                                 // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    //                                 if (event.data === window.YT.PlayerState.ENDED) {
    //                                     // console.log('YouTube video ended - closing modal');
    //                                     handleYouTubeVideoEnd();
    //                                 } else if (event.data === window.YT.PlayerState.PLAYING) {
    //                                     setIsVideoPlaying(true);
    //                                 } else if (event.data === window.YT.PlayerState.PAUSED) {
    //                                     setIsVideoPlaying(false);
    //                                 }
    //                             },
    //                             'onError': (event: any) => {
    //                                 console.error('YouTube player error:', event.data);
    //                                 // If there's an error, allow manual close
    //                             }
    //                         }
    //                     });
    //                 } catch (error) {
    //                     console.error('Failed to setup YouTube player:', error);
    //                     // If setup fails, allow manual close
    //                 }
    //             }
    //         };

    //         loadYouTubeAPI();
    //     }
    // }, [lessonData, isLoadingItem]);

    // Show modal and play sound when component mounts and lesson data is loaded
    // useEffect(() => {
    //     if (lessonData && !isLoadingItem) {
    //         // Show modal for video playback
    //         setShowModal(true);

    //         // Create audio element and play the sound
    //         const audio = new Audio('/sounds/new-level.mp3');
    //         audio.volume = 0.7; // Set volume to 70%
    //         audio.play().catch(error => {
    //             console.log('Audio play failed:', error);
    //             // Audio autoplay might be blocked by browser, this is normal
    //         });

    //         // Store reference for cleanup
    //         audioRef.current = audio;

    //         // Fallback timeout - close modal after 10 minutes if video doesn't end automatically
    //         const fallbackTimeout = setTimeout(() => {
    //             console.log('Fallback: Auto-closing modal after timeout');
    //             setShowModal(false);
    //             setShowMainContent(true);
    //         }, 10 * 60 * 1000); // 10 minutes

    //         // Cleanup timeout on component unmount
    //         return () => {
    //             clearTimeout(fallbackTimeout);
    //         };
    //     }
    // }, [lessonData, isLoadingItem]);

    // Cleanup audio on component unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleStartQuiz = () => {
        navigate(`/admin/courses/${lessonData.course_id}/lessons/${lessonId}/questions`);
    };

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setIsVideoPlaying(false);
    };

    const handleModalVideoEnd = () => {
        // console.log('Modal video ended');
        setShowModal(false);
        setShowMainContent(true);
    };

    const handleModalVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    const handleModalVideoPause = () => {
        setIsVideoPlaying(false);
    };

    const handleYouTubeVideoEnd = () => {
        setVideoEnded(true);
        setIsVideoPlaying(false);
        setShowModal(false);
        setShowMainContent(true);
    };

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1, // Optional: starts video automatically
        },
    };

    if (isLoadingItem) {
        return (
            <AdminLayout title="Loading Instructions">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p>Loading lesson instructions...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!lessonData) {
        return (
            <AdminLayout title="Lesson Not Found">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
                        <p className="mb-6">The lesson you're looking for doesn't exist.</p>
                        <Button onClick={() => navigate(-1)} variant="outline">
                            Go Back
                        </Button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            {/* Video Modal */}
            <Dialog open={showModal} onOpenChange={() => { }}>
                <DialogTitle>
                    <div className="hidden">
                        Tutorial Video
                    </div>
                </DialogTitle>
                <DialogContent className="max-w-4xl w-full h-auto p-0 bg-black border-0">
                    {/* Manual Close Button */}
                    {/* <button
                        onClick={() => {
                            setShowModal(false);
                            setShowMainContent(true);
                        }}
                        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        title="Close video and continue to lesson"
                    >
                        <X className="w-6 h-6" />
                    </button> */}

                    <div className="relative">
                        {lessonData?.video_url ? extractYouTubeId(lessonData.video_url) && (
                            <div className="relative w-full">
                                <YouTube videoId={`${extractYouTubeId(lessonData.video_url)}`} opts={opts} onEnd={handleModalVideoEnd} />
                                {/* <iframe
                                    ref={youtubeIframeRef}
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    src={`https://www.youtube.com/embed/${extractYouTubeId(lessonData.video_url)}?autoplay=1&rel=0&enablejsapi=1`}
                                    title="Course Preview Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                /> */}

                                {/* Skip Video Button */}
                                {/* <div className="absolute bottom-4 left-4">
                                    <Button
                                        onClick={() => {
                                            setShowModal(false);
                                            setShowMainContent(true);
                                        }}
                                        variant="outline"
                                        className="bg-black/50 hover:bg-black/70 text-white border-white/30 hover:border-white/50"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        Skip Video
                                    </Button>
                                </div> */}
                            </div>
                        ) : (
                            <>
                                <>
                                    {(lessonData as any)?.video_asset_id ? (
                                        <>

                                            <video
                                                ref={modalVideoRef}
                                                className="w-full h-auto rounded-lg"
                                                controls
                                                autoPlay
                                                onPlay={handleModalVideoPlay}
                                                onPause={handleModalVideoPause}
                                                onEnded={handleModalVideoEnd}
                                                poster="/images/robot.jpg"
                                            >
                                                <source src={(lessonData as any).video_asset.url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </>
                                    ) : (
                                        <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="text-lg">No video available for this lesson</p>
                                                <Button
                                                    onClick={handleModalVideoEnd}
                                                    className="mt-4"
                                                    variant="outline"
                                                >
                                                    Continue to Lesson
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            </>


                        )}



                        {/* Video overlay with instructions */}
                        {/* {!isVideoPlaying && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Play className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                                    <p className="text-lg font-semibold">Watch the lesson video to continue</p>
                                    <p className="text-sm text-gray-300 mt-2">The video will start automatically</p>
                                </div>
                            </div>
                        )} */}
                    </div>
                </DialogContent >
            </Dialog >

            {/* Main Content - only show after video ends */}
            {
                showMainContent && (
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                        {/* Fun background elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-20"></div>
                            <div className="absolute top-20 right-20 w-16 h-16 bg-pink-400 rounded-full animate-pulse opacity-20"></div>
                            <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400 rounded-full animate-bounce opacity-20"></div>
                            <div className="absolute bottom-10 right-10 w-18 h-18 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
                            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full animate-ping opacity-10"></div>
                            <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-cyan-400 rounded-full animate-bounce opacity-15"></div>
                        </div>

                        <div className="relative z-10 container mx-auto px-4 py-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                                    <BookOpen className="w-6 h-6 text-yellow-400" />
                                    <span className="text-white font-semibold">Lesson Instructions</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                    {lessonData.title}
                                </h1>
                                <div className="grid grid-cols-1 gap-8 mb-8 mt-12">
                                    {/* Video Section */}

                                    {/* Action Section */}
                                    <div className="text-center">
                                        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30 shadow-2xl max-w-2xl mx-auto">
                                            <CardContent className="p-8">
                                                <div className="mb-6">
                                                    <div className="text-6xl mb-4">🎯</div>
                                                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Test Your Knowledge?</h2>
                                                    {/* <p className="text-gray-300">
                                                        Watch the video above, then click the button below to start the quiz!
                                                    </p> */}
                                                </div>

                                                <Button
                                                    onClick={handleStartQuiz}
                                                    size="lg"
                                                    className="bg-gradient-to-r w-full from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold  text-3xl px-8 py-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                                                >
                                                    <Play className="w-6 h-6 mr-2" />
                                                    Start Quiz
                                                    <ArrowRight className="w-6 h-6 ml-2" />
                                                </Button>

                                                {/* <div className="mt-4 text-sm text-gray-400">
                                                    <p>💡 Tip: Make sure to watch the video first for the best results!</p>
                                                </div> */}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                                <div className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                    <div className="main-content" dangerouslySetInnerHTML={{ __html: lessonData.content }} />
                                </div>
                            </div>

                            {/* Main Content */}



                            {/* Instructions Section */}
                            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="w-6 h-6 text-green-400" />
                                        <CardTitle className="text-white">What You'll Learn</CardTitle>
                                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                            Learning Goals
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                            <Brain className="w-6 h-6 text-blue-400 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white mb-2">Interactive Quiz</h3>
                                                <p className="text-gray-300 text-sm">Answer questions to test your understanding</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                            <Zap className="w-6 h-6 text-purple-400 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white mb-2">Instant Feedback</h3>
                                                <p className="text-gray-300 text-sm">Get immediate results and explanations</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                            <Star className="w-6 h-6 text-yellow-400 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white mb-2">Earn Points</h3>
                                                <p className="text-gray-300 text-sm">Score points for correct answers</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lesson Stats */}
                                    <div className="bg-gray-700/50 rounded-lg p-4">
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-orange-400" />
                                            Lesson Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-gray-300">
                                                <span className="text-orange-400">Duration:</span> {lessonData.duration_minutes} min
                                            </div>
                                            {/* <div className="text-gray-300">
                                        <span className="text-orange-400">Status:</span> {lessonData.is_published ? 'Published' : 'Draft'}
                                    </div> */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>
                    </div >
                )
            }
        </>
    );
}