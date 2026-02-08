import { useState, useEffect } from "react";
import Pride from "react-canvas-confetti/dist/presets/pride";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { Check, X, Star, Trophy, Sparkles } from "lucide-react";
import HintBox from "./HintBox";

interface QuizCardProps {
    question: any;
    onNext?: () => void;
    onAnswerChecked?: (isCorrect: boolean) => void;
    isLastQuestion?: boolean;
    score?: number;
    currentQuestionIndex?: number;
    totalQuestions?: number;
}

export default function QuizCard({ question, onNext, onAnswerChecked, isLastQuestion = false, score, currentQuestionIndex, totalQuestions }: QuizCardProps) {
    const [selected, setSelected] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [hasChecked, setHasChecked] = useState<boolean>(false);

    // Reset state when question changes
    useEffect(() => {
        setSelected(null);
        setSelectedOption(null);
        setSelectedOptionId(null);
        setIsCorrect(false);
        setHasChecked(false);
    }, [question.id]);

    // console.log(question.options)

    const handleCheckAnswer = () => {
        if (!selectedOptionId) return;

        // Find the selected option by ID and check if its ID matches the correct answer
        const selectedOptionData = question.options.find((opt: any) => opt.id === selectedOptionId);
        const isAnswerCorrect = selectedOptionData?.id === question.correct_answer;
        setIsCorrect(isAnswerCorrect);
        setHasChecked(true);

        // Call the callback to notify parent component
        onAnswerChecked?.(isAnswerCorrect);
    };

    const handleNext = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center relative overflow-hidden">
            {/* Fun background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-300 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-10 right-10 w-18 h-18 bg-blue-300 rounded-full animate-pulse opacity-60"></div>
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
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <span className="text-lg font-bold text-gray-800">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-lg font-bold text-gray-800">{score} points</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main quiz card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Fun corner decorations */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-60"></div>

                    {/* Hint button */}
                    <div className="absolute top-4 right-4">
                        <button className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                            <span className="text-2xl">💡</span>
                        </button>
                    </div>

                    {/* Question */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🤔</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
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
                                'from-pink-400 to-rose-400',
                                'from-blue-400 to-cyan-400',
                                'from-green-400 to-emerald-400',
                                'from-yellow-400 to-orange-400'
                            ];

                            let buttonClass = `relative p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${hasChecked
                                ? isCorrectAnswer
                                    ? `bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg scale-105`
                                    : isWrongAnswer
                                        ? `bg-gradient-to-r from-red-400 to-pink-400 text-white`
                                        : `bg-gray-200 text-gray-600`
                                : isSelected
                                    ? `bg-gradient-to-r ${colors[index]} text-white shadow-lg scale-105`
                                    : `bg-gradient-to-r ${colors[index]} text-white hover:shadow-lg`
                                }`;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !hasChecked && (setSelectedOption(opt.option_text), setSelectedOptionId(opt.id))}
                                    className={buttonClass}
                                    disabled={hasChecked}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl">{emojis[index]}</div>
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
                                                        <span>✅</span>
                                                    </div>
                                                )}
                                                {isWrongAnswer && <span>❌</span>}
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
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500'
                                    : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                                    }`}
                                onClick={handleNext}
                            >
                                {isCorrect ? (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-6 h-6" />
                                        <span>{isLastQuestion ? "🎉 FINISH QUIZ 🎉" : "✨ NEXT QUESTION ✨"}</span>
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>{isLastQuestion ? "😊 FINISH QUIZ 😊" : "➡️ NEXT QUESTION ➡️"}</span>
                                    </div>
                                )}
                            </button>
                        ) : (
                            <button
                                className={`px-8 py-4 rounded-2xl text-xl font-bold text-white shadow-lg transform transition-all duration-300 ${selectedOptionId
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                onClick={handleCheckAnswer}
                                disabled={!selectedOptionId}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>🔍</span>
                                    <span>CHECK MY ANSWER</span>
                                    <span>🔍</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
