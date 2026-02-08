import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { FaBook, FaDumbbell, FaLock, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const icons = {
    book: <FaBook className="text-white text-2xl" />,
    star: <FaStar className="text-white text-2xl" />,
    exercise: <FaDumbbell className="text-white text-2xl" />,
    lock: <FaLock className="text-white text-2xl" />,
    chest: <FaDumbbell
        className="text-white text-2xl" />,
};

const levelsData = [
    { type: "start", status: "active" },
    { type: "book", status: "locked" },
    { type: "star", status: "locked" },
    { type: "book", status: "locked" },
    { type: "exercise", status: "locked" },
    { type: "book", status: "locked" },
    { type: "chest", status: "locked" },
    { type: "star", status: "locked" },
    { type: "star", status: "locked" },
];

const getIcon = (type, isUnlocked, isCompleted) => {
    if (type === "start") return <FaStar className="text-white text-2xl" />;
    if (!isUnlocked) return <FaLock className="text-white text-2xl" />;
    if (isCompleted) return <FaCheck className="text-white text-2xl" />;
    return icons[type] || <FaLock className="text-white text-2xl" />;
};

const stylesByIndex = [
    { left: 0, marginTop: 67 },
    { left: 44.884, marginTop: 11.8533 },
    { left: 70, marginTop: 20.3826 },
    { left: 44.884, marginTop: 20.3826 },
    { left: 0, marginTop: 11.8533 },
    { left: -44.884, marginTop: 11.8533 },
    { left: -70, marginTop: 20.3826 },
    { left: -44.884, marginTop: 20.3826 },
    { left: 0, marginTop: 11.8533 },
];

const LevelItem = ({ level, index, isUnlocked, isCompleted, showTooltip, onToggleTooltip }) => {
    const isActive = isUnlocked;
    const style = stylesByIndex[index % stylesByIndex.length];
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, x: style.left }}
            animate={{ opacity: 1, y: 0, x: style.left }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center space-y-2"
            style={{ left: `${style.left}px`, marginTop: `${style.marginTop}px` }}
        >
            <button
                onClick={() => isActive && onToggleTooltip(index)}
                disabled={!isActive}
                className={`relative w-16 h-16 group rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${isCompleted
                    ? "bg-green-500 border-green-300 hover:bg-green-600 hover:scale-110 cursor-pointer"
                    : isActive
                        ? "bg-blue-500 border-white hover:bg-blue-600 hover:scale-110 cursor-pointer"
                        : "bg-gray-700 border-gray-500 cursor-not-allowed opacity-60"
                    }`}
            >
                {getIcon(level.type, isActive, isCompleted)}
                {
                    isActive && !isCompleted && (
                        <div className="absolute bottom-full mb-2 animate-bounce duration-300 ease-in-out " style={{ zIndex: 50 }}>
                            <div className="relative bg-[#37464f] text-white px-4 py-2 rounded-lg shadow-lg text-sm z-30">
                                <div className="text-white"> Start </div>
                                {/* // Make a triangle */}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#37464f] rotate-45 -z-[20px]"></div>
                            </div>
                        </div>

                    )
                }
                {
                    showTooltip === index && isActive && (
                        <>

                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rotate-45 z-[50]"></div>
                            <div className="absolute bottom-[107%] bg-blue-600 text-white px-4 py-4 rounded-lg shadow-lg w-64 "
                                style={{ zIndex: 50 }}>
                                <Tooltip level={level} isUnlocked={isActive} isCompleted={isCompleted} />
                            </div>
                        </>
                    )
                }
            </button>
        </motion.div>
    );
};

const Tooltip = ({ level, isUnlocked, isCompleted }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ zIndex: 50 }}
        >

            <div className="text-white text-lg font-bold flex items-center gap-2">
                {level.title}
                {!isUnlocked && <span className="text-yellow-400 text-sm">(Locked)</span>}
            </div>
            <div className="text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {level.duration_minutes} minutes
            </div>
            {isCompleted && <span className="mt-2 block text-green-400 text-sm mb-2 font-bold bg-green-500/20 px-2 py-1 rounded-md">✓ Completed</span>}
            {isUnlocked ? (
                <div>
                    <button className={`mt-2 font-bold px-3 py-3 w-full rounded cursor-pointer transition-colors ${isCompleted
                        ? 'bg-green-700 text-white hover:bg-green-600'
                        : 'bg-white text-blue-500 hover:bg-gray-100'
                        }`} onClick={() => {
                            navigate(`/admin/courses/${level.course_id}/lessons/${level.id}/instructions`);
                        }}>
                        {isCompleted ? 'Play Again' : 'Play Game'}
                    </button>
                </div>
            ) : (
                <div>
                    <button className="mt-2 bg-gray-400 text-gray-600 font-bold px-3 py-3 w-full rounded cursor-not-allowed" disabled>
                        Complete Previous Lessons
                    </button>
                </div>
            )}
        </motion.div>
    );
}

export default function Levels({ lessons, course, userLessonsResponse = [] }) {
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
    const [currentCompletedLesson, setCurrentCompletedLesson] = useState(null);
    const [nextLesson, setNextLesson] = useState(null);
    const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Function to handle tooltip toggle
    const handleToggleTooltip = (index: number) => {
        setActiveTooltip(activeTooltip === index ? null : index);
    };

    // Check for course completion and find next lesson
    useEffect(() => {
        const checkCourseCompletion = async () => {
            if (!course?.id || !lessons || lessons.length === 0) return;

            try {
                // Check if course is completed
                const { data: courseResponse, error } = await supabase
                    .from('user_course_response')
                    .select('is_completed')
                    .eq('user_id', user?.id)
                    .eq('course_id', course.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error checking course completion:', error);
                    return;
                }

                if (courseResponse?.is_completed) {
                    // Course is completed, find the last completed lesson
                    const sortedLessons = [...lessons].sort((a, b) => a.order_by - b.order_by);
                    const completedLessons = sortedLessons.filter(lesson => isLessonCompleted(lesson.id));

                    if (completedLessons.length > 0) {
                        // Get the last completed lesson
                        const lastCompletedLesson = completedLessons[completedLessons.length - 1];
                        setCurrentCompletedLesson(lastCompletedLesson);
                        setShowCompletionCelebration(true);

                        // Find the next lesson that hasn't been completed
                        const nextLessonData = sortedLessons.find(lesson =>
                            lesson.order_by > lastCompletedLesson.order_by &&
                            !isLessonCompleted(lesson.id)
                        );

                        if (nextLessonData) {
                            setNextLesson(nextLessonData);
                        } else {
                            // No next lesson found, this was the final lesson
                            setNextLesson(null);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking course completion:', error);
            }
        };

        checkCourseCompletion();
    }, [course, lessons, userLessonsResponse]);

    // Handle next lesson navigation
    const handleNextLesson = () => {
        if (nextLesson) {
            navigate(`/admin/courses/${course.id}/lessons/${nextLesson.id}/instructions`);
        }
    };

    // Function to check if a specific lesson is completed
    const isLessonCompleted = (lessonId) => {
        const userResponse = userLessonsResponse.find(
            response => response.lesson_id === lessonId
        );

        return userResponse && (
            userResponse.is_completed ||
            userResponse.score_percentage >= 70 || // or whatever threshold you use
            userResponse.status === 'completed'
        );
    };

    // Function to determine if a lesson is unlocked
    const isLessonUnlocked = (index) => {
        if (index === 0) return true; // First lesson is always unlocked

        // Check if all previous lessons are completed based on user_lessons_response
        for (let i = 0; i < index; i++) {
            const currentLesson = lessons[i];
            if (!currentLesson) continue;

            const isCompleted = isLessonCompleted(currentLesson.id);

            // console.log(`Lesson ${i}:`, {
            //     lessonId: currentLesson.id,
            //     isCompleted
            // });

            if (!isCompleted) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className="bg-[#131f24] min-h-screen flex flex-col items-center py-10">
            <div className="fixed inset-0">
                {
                    course.background_image_asset_id ? (
                        <img src={course.background_image_asset.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <img src="/images/kids.jpg" alt="" className="w-full h-full object-cover" />
                    )
                }
            </div>
            <div className="fixed inset-0 bg-black/80">

            </div>
            <div className="relative max-w-3xl w-full">
                <button className="mb-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </button>
                <div className="bg-blue-500 px-4 py-3 rounded-xl text-white text-lg font-semibold mb-8 max-w-3xl w-full">
                    <p className="text-white text-lg capitalize"> {course.title} </p>
                </div>
                {/* Images  */}
                <div className="absolute top-[250px] left-12">
                    {
                        course.top_image_asset_id ? (
                            <img src={course.top_image_asset.url} alt="" className="w-48" />
                        ) : (
                            <img src="/images/boy.png" alt="robot" className="w-48" />
                        )
                    }

                </div>
                <div className="absolute bottom-[40px] right-8">
                    {
                        course.bottom_image_asset_id ? (
                            <img src={course.bottom_image_asset.url} alt="" className="w-64" />
                        ) : (
                            <img src="/images/leaning.png" alt="robot" className="w-64" />
                        )
                    }

                </div>
                <div className="flex flex-col items-center">
                    {lessons?.map((level, index) => {
                        const isUnlocked = isLessonUnlocked(index);
                        const isCompleted = isLessonCompleted(level.id);
                        return (
                            <LevelItem
                                key={index}
                                level={level}
                                index={index}
                                isUnlocked={isUnlocked}
                                isCompleted={isCompleted}
                                showTooltip={activeTooltip}
                                onToggleTooltip={handleToggleTooltip}
                            />
                        );
                    })}
                </div>

                {/* Lesson Completion Celebration */}
                {currentCompletedLesson && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-12 mb-8"
                    >
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
                            {/* Celebration background elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-400/20 rounded-full animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-300/20 rounded-full animate-ping"></div>
                            </div>

                            <div className="relative z-10 text-center">

                                <div className="mb-6">
                                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        Lesson Completed!
                                    </h2>

                                    {/* {console.log(currentCompletedLesson)} */}
                                    <p className="text-lg text-gray-300">
                                        Congratulations! You've completed the course
                                        {/* "{currentCompletedLesson.title}"!  */}
                                    </p>
                                </div>


                                {
                                    nextLesson ? (
                                        <div className="space-y-4">
                                            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                                                <h3 className="text-lg font-semibold text-white mb-2">Ready for the next lesson?</h3>
                                                <p className="text-gray-300 text-sm mb-4">
                                                    Continue your learning journey with the next lesson!
                                                </p>
                                                <div className="flex items-center justify-center gap-2 text-yellow-300">
                                                    <Sparkles className="w-5 h-5" />
                                                    <span className="font-semibold">{nextLesson.title}</span>
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleNextLesson}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                            >
                                                <ArrowRight className="w-6 h-6" />
                                                <span>Start Next Lesson</span>
                                                <Trophy className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                                                <h3 className="text-lg font-semibold text-white mb-2">🎯 Final Lesson Completed!</h3>
                                                <p className="text-gray-300 text-sm">
                                                    You've completed the final lesson in this course! Great job!
                                                </p>
                                            </div>

                                            <div className="flex gap-4">

                                                <button
                                                    onClick={() => navigate('/admin/courses')}
                                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                                >
                                                    <ArrowLeft className="w-6 h-6" />
                                                    <span>Back to Courses</span>
                                                </button>
                                                {/* <button
                                                    onClick={() => navigate('/admin/courses')}
                                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                                >
                                                    <span> Play Again </span>
                                                </button> */}
                                            </div>
                                        </div>
                                    )}


                                <div className="mt-6 text-sm text-gray-400">
                                    <p> Amazing work! You're becoming a true expert! </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
