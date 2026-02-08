import { AdminLayout } from "@/components/admin/AdminLayout";
import Levels from "@/components/Levels";
import QuizCard from "@/components/QuizCard";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import Pride from "react-canvas-confetti/dist/presets/pride";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { CheckCircle, Trophy, ArrowLeft } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Option {
    id: string;
    order_by: number;
    is_active: boolean;
    is_erased: boolean;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    option_text: string;
    option_image_url: string | null;
}

interface Question {
    id: string;
    lesson_id: string;
    course_id: string;
    question_text: string;
    question_image_url: string | null;
    question_type: string;
    correct_answer: string;
    points: number;
    explanation: string;
    order_by: number;
    is_erased: boolean;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    options: Option[];
}

export default function QuestionsPlay() {
    const { lessonId, courseId } = useParams<{ lessonId: string, courseId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const { user } = useAuth();



    const { data: questions, isLoading, error } = useQuestions(lessonId);



    // Function to complete course when all lessons are finished
    const completeCourse = async (courseId: string) => {
        if (!user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            // Check if user_course_response exists
            const { data: existingResponse, error: checkError } = await supabase
                .from('user_course_response')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking user_course_response:', checkError);
                return;
            }

            if (existingResponse) {
                // Update existing course response to completed
                const { error: updateError } = await supabase
                    .from('user_course_response')
                    .update({
                        is_completed: true,
                        updated_by: user.id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingResponse.id);

                if (updateError) {
                    console.error('Error updating course completion:', updateError);
                    toast({
                        title: "Error",
                        description: "Failed to mark course as completed",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Congratulations!",
                        description: "Course completed successfully! 🎉",
                    });
                }
            }
        } catch (error) {
            console.error('Unexpected error completing course:', error);
        }
    };

    // Get current question index from URL or default to 0
    useEffect(() => {
        const questionIndex = searchParams.get('question');
        if (questionIndex) {
            setCurrentQuestionIndex(parseInt(questionIndex));
        }
    }, [searchParams]);

    if (isLoading) {
        return (
            <AdminLayout title="Quiz">
                <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p>Loading questions...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <AdminLayout title="Quiz">
                <>

                </>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                    <div className="text-center">
                        <p className="text-xl mb-4">No questions available for this lesson.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Sort questions by order_by
    const sortedQuestions = questions.sort((a, b) => a.order_by - b.order_by);
    const currentQuestion = sortedQuestions[currentQuestionIndex];
    const totalQuestions = sortedQuestions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const isGameCompleted = currentQuestionIndex >= totalQuestions;

    // console.log(currentQuestion, 'isLastQuestion');

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            // Game completed
            setSearchParams({ question: 'completed' });
        } else {
            // Move to next question
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setSearchParams({ question: nextIndex.toString() });
        }
    };

    const handleAnswerChecked = (isCorrect: boolean) => {
        if (!completedQuestions.has(currentQuestion.id)) {
            if (isCorrect) {
                setScore(prev => prev + (currentQuestion.points || 1));
                setCorrectAnswers(prev => prev + 1);
            }
            setCompletedQuestions(prev => new Set([...prev, currentQuestion.id]));
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setCompletedQuestions(new Set());
        setSearchParams({ question: '0' });
    };

    // Show completion screen
    if (isGameCompleted || searchParams.get('question') === 'completed') {
        return (
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

                {/* Confetti */}
                <Pride autorun={{ speed: 20 }} />

                <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden border border-gray-700 shadow-2xl">
                        {/* Fun corner decorations */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full opacity-40"></div>
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-40"></div>

                        {/* Celebration images */}
                        <div className="absolute top-4 -right-4">
                            <img src="/images/happygirl.png" alt="Celebration" className="w-32 h-32 object-cover animate-bounce" />
                        </div>
                        <div className="absolute top-4 -left-4">
                            <img src="/images/happygirl.png" alt="Celebration" className="w-32 h-32 object-cover animate-bounce" />
                        </div>

                        <div className="mb-8">
                            {/* <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-pulse" /> */}
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Quiz Complete!
                            </h1>
                            <p className="text-lg text-gray-300 mb-8">Congratulations on completing the quiz!</p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/30">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-6 border border-purple-500/30">
                                    <div className="text-4xl font-bold text-purple-400 mb-2">{score}</div>
                                    <div className="text-gray-300 font-semibold">Total Score</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-xl p-6 border border-green-500/30">
                                    <div className="text-4xl font-bold text-green-400 mb-2">{totalQuestions}</div>
                                    <div className="text-gray-300 font-semibold">Questions</div>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl p-6 border border-yellow-500/30">
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                                        {Math.round((correctAnswers / totalQuestions) * 100)}%
                                    </div>
                                    <div className="text-gray-300 font-semibold">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/admin/courses/${courseId}/play`)}
                                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {/* <Trophy className="w-5 h-5" /> */}
                                Go to Lessons
                            </button>

                        </div>

                        <div className="mt-6 text-sm text-gray-400">
                            <p>Great job! You've mastered this lesson! </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // <AdminLayout title={`Quiz - Question ${currentQuestionIndex + 1} of ${totalQuestions}`}>
        <div className="relative">
            {/* Progress indicator */}
            {/* <div className="absolute top-4 left-4 z-10 bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-2">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </div>
                    <div className="w-32 bg-gray-700 h-2 rounded-full">
                        <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Score: {score}
                    </div>
                </div> */}

            <QuizCard
                score={score}
                question={currentQuestion}
                onNext={handleNextQuestion}
                onAnswerChecked={handleAnswerChecked}
                isLastQuestion={isLastQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                lessonId={lessonId}
                onLessonCompleted={async (stats) => {
                    // Check if this is the final lesson in the course
                    if (currentQuestion?.course_id) {
                        // Get all lessons for this course to check if this is the last one
                        const { data: allLessons, error: lessonsError } = await supabase
                            .from('lessons')
                            .select('id, order_by')
                            .eq('course_id', currentQuestion.course_id)
                            .eq('is_active', true)
                            .order('order_by', { ascending: true });

                        if (!lessonsError && allLessons) {
                            const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
                            const isLastLesson = currentLessonIndex === allLessons.length - 1;

                            if (isLastLesson) {
                                // This is the final lesson, complete the course
                                await completeCourse(currentQuestion.course_id);
                            }
                        }
                    }
                }}
            />
        </div>
        // </AdminLayout>
    );
}