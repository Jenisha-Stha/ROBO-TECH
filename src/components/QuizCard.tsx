import { useState, useEffect, useRef } from "react";
import Pride from "react-canvas-confetti/dist/presets/pride";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { Check, X, Star, Trophy, Sparkles, Lightbulb, X as XIcon } from "lucide-react";
import HintBox from "./HintBox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface QuizCardProps {
    question: any;
    onNext?: () => void;
    onAnswerChecked?: (isCorrect: boolean) => void;
    isLastQuestion?: boolean;
    score?: number;
    currentQuestionIndex?: number;
    totalQuestions?: number;
    lessonId?: string;
    onLessonCompleted?: (stats: { totalQuestions: number; totalAttempted: number; totalCorrect: number }) => void;
}

export default function QuizCard({ question, onNext, onAnswerChecked, isLastQuestion = false, score, currentQuestionIndex, totalQuestions, lessonId, onLessonCompleted }: QuizCardProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [hasChecked, setHasChecked] = useState<boolean>(false);
    const [lessonStats, setLessonStats] = useState({
        totalQuestions: totalQuestions || 0,
        totalAttempted: 0,
        totalCorrect: 0
    });
    const [isHintModalOpen, setIsHintModalOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize lesson stats when component mounts
    useEffect(() => {
        setLessonStats({
            totalQuestions: totalQuestions || 0,
            totalAttempted: 0,
            totalCorrect: 0
        });
    }, [totalQuestions]);

    // Reset state when question changes
    useEffect(() => {
        setSelected(null);
        setSelectedOption(null);
        setSelectedOptionId(null);
        setIsCorrect(false);
        setHasChecked(false);
    }, [question.id]);

    // console.log(question.options)

    // Function to play sound based on answer correctness
    const playAnswerSound = (isCorrect: boolean) => {
        try {
            // Stop any currently playing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            // Play appropriate sound
            const soundFile = isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3';
            const audio = new Audio(soundFile);
            audio.volume = 0.8; // Set volume to 80%

            audio.play().catch(error => {
                console.log('Audio play failed:', error);
                // Audio autoplay might be blocked by browser, this is normal
            });

            // Store reference for cleanup
            audioRef.current = audio;
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    // Cleanup audio on component unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Function to save user response to database
    const saveUserResponse = async (questionId: string, answerId: string, isCorrect: boolean) => {
        if (!user?.id) {
            console.error('User not authenticated');
            return;
        }

        try {
            // Check if response already exists
            const { data: existingResponse, error: checkError } = await supabase
                .from('user_responses')
                .select('id')
                .eq('user_id', user.id)
                .eq('question_id', questionId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
                console.error('Error checking user response:', checkError);
                return;
            }

            if (existingResponse) {
                // Update existing response
                const { error: updateError } = await supabase
                    .from('user_responses')
                    .update({
                        answer_id: answerId,
                        updated_by: user.id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingResponse.id);

                if (updateError) {
                    console.error('Error updating user response:', updateError);
                }
            } else {
                // Create new response
                const { error: insertError } = await supabase
                    .from('user_responses')
                    .insert({
                        user_id: user.id,
                        question_id: questionId,
                        answer_id: answerId,
                        is_active: true,
                        created_by: user.id,
                        updated_by: user.id
                    });

                if (insertError) {
                    console.error('Error creating user response:', insertError);
                }
            }
        } catch (error) {
            console.error('Unexpected error saving user response:', error);
        }
    };

    // Function to create lesson response
    const createLessonResponse = async (stats: { totalQuestions: number; totalAttempted: number; totalCorrect: number }) => {
        if (!user?.id || !lessonId) {
            console.error('User not authenticated or lesson ID missing');
            return;
        }

        try {
            // Check if lesson response already exists
            const { data: existingLessonResponse, error: checkError } = await supabase
                .from('user_lessons_response')
                .select('id')
                .eq('user_id', user.id)
                .eq('lesson_id', lessonId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking lesson response:', checkError);
                return;
            }

            // const isCompleted = stats.totalCorrect === stats.totalQuestions;
            const lessonData = {
                user_id: user.id,
                course_id: question.course_id,
                lesson_id: lessonId,
                total_questions: stats.totalQuestions,
                total_attempted: stats.totalAttempted,
                total_correct: stats.totalCorrect,
                is_completed: true,
                is_active: true,
                created_by: user.id,
                updated_by: user.id
            };

            if (existingLessonResponse) {
                // Update existing lesson response
                const { error: updateError } = await supabase
                    .from('user_lessons_response')
                    .update({
                        ...lessonData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingLessonResponse.id);

                if (updateError) {
                    console.error('Error updating lesson response:', updateError);
                }


            } else {
                // Create new lesson response
                const { error: insertError } = await supabase
                    .from('user_lessons_response')
                    .insert(lessonData);

                if (insertError) {
                    console.error('Error creating lesson response:', insertError);
                }
            }

            // Check if this is the last lesson in the course
            await checkAndCompleteCourse();

            // Invalidate queries to refresh data in CoursesPlay
            queryClient.invalidateQueries({
                queryKey: ['user-lessons-responses']
            });
            queryClient.invalidateQueries({
                queryKey: ['user-course-responses']
            });
            queryClient.invalidateQueries({
                queryKey: ['lessons', lessonId]
            });

            // Notify parent component
            onLessonCompleted?.(stats);
        } catch (error) {
            console.error('Unexpected error creating lesson response:', error);
        }
    };

    // Function to check if current lesson is the last lesson and complete course if so
    const checkAndCompleteCourse = async () => {
        try {
            // Get the current lesson to find its course_id and order_by
            const { data: currentLesson, error: lessonError } = await supabase
                .from('lessons')
                .select('course_id, order_by')
                .eq('id', lessonId)
                .single();

            if (lessonError || !currentLesson) {
                console.error('Error fetching current lesson:', lessonError);
                return;
            }

            // Get all lessons in the course ordered by order_by
            const { data: allLessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('id, order_by')
                .eq('course_id', currentLesson.course_id)
                .eq('is_active', true)
                .order('order_by', { ascending: true });

            if (lessonsError || !allLessons) {
                console.error('Error fetching course lessons:', lessonsError);
                return;
            }

            // Check if current lesson is the last lesson (highest order_by)
            const maxOrderIndex = Math.max(...allLessons.map(lesson => lesson.order_by));
            const isLastLesson = currentLesson.order_by === maxOrderIndex;

            if (isLastLesson) {
                // This is the last lesson, mark course as completed
                const { error: courseUpdateError } = await supabase
                    .from('user_course_response')
                    .update({
                        is_completed: true,
                        updated_by: user.id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .eq('course_id', currentLesson.course_id);

                if (courseUpdateError) {
                    console.error('Error updating course completion:', courseUpdateError);
                } else {
                    console.log('Course marked as completed!');

                    // Invalidate course-related queries when course is completed
                    queryClient.invalidateQueries({
                        queryKey: ['user-course-responses']
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['courses']
                    });
                }
            }
        } catch (error) {
            console.error('Unexpected error checking course completion:', error);
        }
    };

    const handleCheckAnswer = async () => {
        if (!selectedOptionId) return;

        // Find the selected option by ID and check if its ID matches the correct answer
        const selectedOptionData = question.options.find((opt: any) => opt.id === selectedOptionId);
        const isAnswerCorrect = selectedOptionData?.id === question.correct_answer;
        setIsCorrect(isAnswerCorrect);
        setHasChecked(true);

        // Play sound based on answer correctness
        playAnswerSound(isAnswerCorrect);

        // Update lesson stats
        setLessonStats(prev => ({
            ...prev,
            totalAttempted: prev.totalAttempted + 1,
            totalCorrect: prev.totalCorrect + (isAnswerCorrect ? 1 : 0)
        }));

        // Save user response to database
        if (selectedOptionData?.id) {
            await saveUserResponse(question.id, selectedOptionData.id, isAnswerCorrect);
        }

        // Call the callback to notify parent component
        onAnswerChecked?.(isAnswerCorrect);
    };

    const handleNext = async () => {
        // If this is the last question, create lesson response and play end sound
        if (isLastQuestion) {
            const finalStats = {
                totalQuestions: lessonStats.totalQuestions,
                totalAttempted: lessonStats.totalAttempted,
                totalCorrect: lessonStats.totalCorrect
            };
            await createLessonResponse(finalStats);

            // Play end level sound
            playAnswerSound(true); // Use the existing function but with a special end sound
            setTimeout(() => {
                try {
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                    }
                    const endAudio = new Audio('/sounds/end-level.mp3');
                    endAudio.volume = 0.8;
                    endAudio.play().catch(error => {
                        console.log('End level audio play failed:', error);
                    });
                    audioRef.current = endAudio;
                } catch (error) {
                    console.error('Error playing end level sound:', error);
                }
            }, 1000); // Wait 1 second after the correct answer sound
        }

        if (onNext) {
            // Use parent's navigation logic
            onNext();
        } else {
            // Fallback to local reset
            setSelectedOption(null);
            setSelectedOptionId(null);
            setIsCorrect(false);
            setHasChecked(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden py-12">
            {/* Fun background elements - dark theme */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-30"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400 rounded-full animate-bounce opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-18 h-18 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-cyan-400 rounded-full animate-bounce opacity-25"></div>
            </div>

            {/* Confetti for correct answers */}
            {isCorrect && hasChecked && (
                <>
                    <Pride autorun={{ speed: 20 }} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-6xl animate-bounce">🎉</div>
                    </div>
                </>
            )}

            <div className="w-full max-w-4xl mx-4 relative z-10">
                {/* Header with progress */}
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            <span className="text-lg font-bold text-white">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-lg font-bold text-white">{score} points</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main quiz card */}
                <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-gray-700">
                    {/* Fun corner decorations - dark theme */}
                    {/* <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full opacity-40"></div> */}
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-40"></div>

                    {/* Hint button */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsHintModalOpen(true)}
                            className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group"
                        >
                            <Lightbulb className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>

                    {/* Question */}
                    <div className="text-center mb-8">
                        {/* Display question image if available */}
                        {question.question_image_url && (
                            <div className="mb-6">
                                <img
                                    src={question.question_image_url}
                                    alt="Question image"
                                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg border-2 border-white/20 shadow-lg"
                                />
                            </div>
                        )}

                        {/* Fallback emoji if no question image */}
                        {/* {!question.question_image_url && (
                            <div className="text-6xl mb-4">🤔</div>
                        )} */}

                        <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                            {question.question_text}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {question.options.map((opt: any, index: number) => {
                            const isSelected = selectedOptionId === opt.id;
                            const isCorrectAnswer = opt.id === question.correct_answer;
                            const isWrongAnswer = isSelected && hasChecked && !isCorrect;

                            const emojis = ['🅰️', '🅱️', '🅲️', '🅳️'];
                            const colors = [
                                'from-transparent to-gray-700',
                                'from-transparent to-gray-700',
                                'from-transparent to-gray-700',
                                'from-transparent to-gray-700'
                            ];
                            // const colors = [
                            //     'from-pink-500 to-rose-500',
                            //     'from-blue-500 to-cyan-500',
                            //     'from-green-500 to-emerald-500',
                            //     'from-yellow-500 to-orange-500'
                            // ];

                            let buttonClass = `relative p-6 rounded-2xl text-left transition-all duration-300 transform hover:shadow-lg hover:border-purple-400 hover:bg-purple-500 border ${hasChecked
                                ? isCorrectAnswer
                                    ? `bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105 border-green-400`
                                    : isWrongAnswer
                                        ? `bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400`
                                        : `bg-gray-700 text-gray-400 border-gray-600`
                                : isSelected
                                    ? `bg-gradient-to-r ${colors[index]} bg-purple-500 text-white shadow-lg border border-purple-400`
                                    : `bg-gradient-to-r ${colors[index]} text-white hover:shadow-lg border border-white/10`
                                }`;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !hasChecked && (setSelectedOption(opt.option_text), setSelectedOptionId(opt.id))}
                                    className={buttonClass}
                                    disabled={hasChecked}
                                >
                                    <div className="flex flex-col items-center">
                                        {/* Display option asset image if available */}
                                        {opt.option_asset?.url && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={opt.option_asset.url}
                                                    alt={opt.option_asset.alt_text || opt.option_text}
                                                    className="w-full h-64 object-contain rounded-lg border-2 border-white/20 mb-4"
                                                />
                                            </div>
                                        )}

                                        {/* Fallback to emoji if no asset */}
                                        {/* {!opt.option_asset?.url && (
                                            <div className="text-3xl flex-shrink-0">{emojis[index]}</div>
                                        )} */}

                                        <div className="flex-1">
                                            {opt.option_text && (
                                                <div className="text-lg font-semibold">
                                                    {opt.option_text}
                                                </div>
                                            )}
                                        </div>

                                        {hasChecked && (
                                            <div className="text-2xl">
                                                {isCorrectAnswer && (
                                                    <div className="flex items-center space-x-2">
                                                        <Realistic autorun={{ speed: 0.3 }} />
                                                        {/* <span>✅</span> */}
                                                    </div>
                                                )}
                                                {/* {isWrongAnswer && <span>❌</span>} */}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action button */}
                    <div className="text-center">
                        {hasChecked ? (
                            <button
                                className={`px-8 py-4 rounded-2xl text-xl font-bold text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${isCorrect
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border border-green-400'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border border-purple-400'
                                    }`}
                                onClick={handleNext}
                            >
                                {isCorrect ? (
                                    <div className="flex items-center space-x-2">
                                        {/* <Sparkles className="w-6 h-6" /> */}
                                        <span>{isLastQuestion ? "FINISH QUIZ" : "NEXT QUESTION"}</span>
                                        {/* <Sparkles className="w-6 h-6" /> */}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>{isLastQuestion ? " FINISH QUIZ " : " NEXT QUESTION"}</span>
                                    </div>
                                )}
                            </button>
                        ) : (
                            <button
                                className={`px-8 py-4 rounded-2xl text-xl font-bold text-white shadow-lg transform transition-all duration-300 ${selectedOptionId
                                    ? 'bg-purple-500 hover:scale-105 hover:shadow-xl border border-purple-400'
                                    : 'bg-gray-600 cursor-not-allowed border border-gray-500'
                                    }`}
                                onClick={handleCheckAnswer}
                                disabled={!selectedOptionId}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>CHECK MY ANSWER</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        className="px-8 py-2 rounded text-white shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border border-purple-400 mt-6"
                        onClick={() => navigate('/admin')}
                    >
                        Go To Dashboard
                    </button>
                </div>
            </div>

            {/* Beautiful Hint Modal */}
            <Dialog open={isHintModalOpen} onOpenChange={setIsHintModalOpen}>
                <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl overflow-hidden">
                    <DialogHeader className="relative">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-400/20 rounded-full animate-bounce"></div>
                            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-300/20 rounded-full animate-ping"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Lightbulb className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                        💡 Hint & Explanation
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-400 text-sm">
                                        Get help understanding this question
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="relative z-10 space-y-6">
                        {/* Question Display */}
                        <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
                            <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Question:
                            </h3>
                            <p className="text-white text-lg leading-relaxed">
                                {question.question_text}
                            </p>
                        </div>

                        {/* Explanation */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                            <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Explanation:
                            </h3>
                            <div className="text-gray-200 leading-relaxed space-y-3">
                                {question.explanation ? (
                                    <p className="text-base">{question.explanation}</p>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-base">
                                            This question is designed to test your understanding of the topic.
                                            Take your time to think through each option carefully.
                                        </p>
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                            <p className="text-yellow-200 text-sm">
                                                💡 <strong>Tip:</strong> Read each option carefully and consider what makes one answer more correct than the others.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Options Preview */}
                        {/* <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
                            <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                                <Check className="w-5 h-5" />
                                Available Options:
                            </h3>
                            <div className="grid gap-2">
                                {question.options.map((option: any, index: number) => (
                                    <div key={index} className="bg-gray-600/50 rounded-lg p-3 border border-gray-500/50">
                                        <span className="text-gray-300 text-sm">
                                            {String.fromCharCode(65 + index)}. {option.option_text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setIsHintModalOpen(false)}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Got it! Let's Continue
                            </button>
                            <button
                                onClick={() => setIsHintModalOpen(false)}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <XIcon className="w-5 h-5" />
                                Close
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
