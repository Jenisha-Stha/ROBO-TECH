import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QuestionOption {
    id: string;
    question_id: string;
    option_text: string;
    option_image_url?: string;
    order_by: number;
    is_erased: boolean;
    is_active: boolean;
    created_by?: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: string;
    lesson_id: string;
    course_id?: string;
    question_text: string;
    question_image_url?: string;
    question_type: 'mcq' | 'true_false' | 'fill_blank' | 'essay';
    correct_answer?: string; // UUID reference to questions_has_options.id
    points?: number;
    explanation?: string;
    order_by: number;
    is_erased: boolean;
    is_active: boolean;
    created_by?: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
    options?: QuestionOption[];
}

export interface CreateQuestionData {
    lesson_id: string;
    course_id?: string;
    question_text: string;
    question_image_url?: string;
    question_type: 'mcq' | 'true_false' | 'fill_blank' | 'essay';
    options?: { text: string; image?: string }[];
    correct_answer?: string;
    explanation?: string;
    points?: number;
    order_by: number;
    is_active?: boolean;
}

export interface UpdateQuestionData {
    question_text: string;
    question_image_url?: string;
    question_type: 'mcq' | 'true_false' | 'fill_blank' | 'essay';
    options?: { text: string; image?: string }[];
    correct_answer?: string;
    explanation?: string;
    points?: number;
    order_by: number;
    is_active?: boolean;
}

// Query keys
export const questionsKeys = {
    all: ['questions'] as const,
    lists: () => [...questionsKeys.all, 'list'] as const,
    list: (lessonId: string) => [...questionsKeys.lists(), { lessonId }] as const,
    details: () => [...questionsKeys.all, 'detail'] as const,
    detail: (id: string) => [...questionsKeys.details(), id] as const,
};

// Fetch questions for a lesson from Supabase
const fetchQuestions = async (lessonId: string): Promise<Question[]> => {
    const { data, error } = await supabase
        .from('questions')
        .select(`
            *,
            question_asset:assets!questions_question_asset_id_fkey(
                id,
                url,
                file_name,
                asset_type,
                alt_text,
                description,
                duration,
                width,
                height,
                thumbnail_url
            ),
            options:questions_has_options!questions_has_options_question_id_fkey(
                id,
                option_text,
                option_asset_id,
                order_by,
                is_erased,
                is_active,
                created_by,
                updated_by,
                created_at,
                updated_at,
                option_asset:assets!questions_has_options_option_asset_id_fkey(
                    id,
                    url,
                    file_name,
                    asset_type,
                    alt_text,
                    description,
                    duration,
                    width,
                    height,
                    thumbnail_url
                )
            )
        `)
        .eq('lesson_id', lessonId)
        .eq('is_erased', false)
        .order('order_by', { ascending: true });


    if (error) {
        throw new Error(error.message);
    }

    return data;

    // Transform the data to match our interface
    // return (data || []).map(question => ({
    //     id: question.id,
    //     lesson_id: question.lesson_id,
    //     course_id: question.course_id,
    //     question_text: question.question_text,
    //     question_image_url: question.question_image_url,
    //     question_type: question.question_type,
    //     correct_answer: question.correct_answer,
    //     points: question.points,
    //     explanation: question.explanation,
    //     order_by: question.order_by,
    //     is_erased: question.is_erased,
    //     is_active: question.is_active,
    //     created_by: question.created_by,
    //     updated_by: question.updated_by,
    //     created_at: question.created_at,
    //     updated_at: question.updated_at,
    //     options: question.options?.filter((opt: any) => !opt.is_erased) || [],
    // }));
};

// Create question
const createQuestion = async (questionData: CreateQuestionData): Promise<Question> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, create the question
    const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
            lesson_id: questionData.lesson_id,
            course_id: questionData.course_id,
            question_text: questionData.question_text,
            question_image_url: questionData.question_image_url || null,
            question_type: questionData.question_type,
            explanation: questionData.explanation || null,
            points: questionData.points || 1,
            order_by: questionData.order_by,
            is_active: questionData.is_active ?? true,
            created_by: user.id,
            updated_by: user.id,
        })
        .select()
        .single();

    if (questionError) {
        throw new Error(questionError.message);
    }

    // Create options if provided
    let options: QuestionOption[] = [];
    let correctAnswerId: string | undefined;

    if (questionData.options && questionData.options.length > 0) {
        const optionsToInsert = questionData.options
            .filter(opt => opt.text.trim() !== '')
            .map((opt, index) => ({
                question_id: question.id,
                option_text: opt.text,
                option_image_url: opt.image || null,
                order_by: index + 1,
                is_active: true,
                created_by: user.id,
                updated_by: user.id,
            }));

        const { data: insertedOptions, error: optionsError } = await supabase
            .from('questions_has_options')
            .insert(optionsToInsert)
            .select();

        if (optionsError) {
            // If options creation fails, delete the question
            await supabase.from('questions').delete().eq('id', question.id);
            throw new Error(optionsError.message);
        }

        options = insertedOptions || [];

        // Set correct answer if provided
        if (questionData.correct_answer && options.length > 0) {
            const correctOption = options.find(opt => opt.option_text === questionData.correct_answer);
            if (correctOption) {
                correctAnswerId = correctOption.id;

                // Update the question with the correct answer ID
                const { error: updateError } = await supabase
                    .from('questions')
                    .update({ correct_answer: correctAnswerId })
                    .eq('id', question.id);

                if (updateError) {
                    throw new Error(updateError.message);
                }
            }
        }
    }

    return {
        id: question.id,
        lesson_id: question.lesson_id,
        course_id: question.course_id,
        question_text: question.question_text,
        question_image_url: question.question_image_url,
        question_type: question.question_type,
        correct_answer: correctAnswerId,
        points: question.points,
        explanation: question.explanation,
        order_by: question.order_by,
        is_erased: question.is_erased,
        is_active: question.is_active,
        created_by: question.created_by,
        updated_by: question.updated_by,
        created_at: question.created_at,
        updated_at: question.updated_at,
        options: options,
    };
};

// Update question
const updateQuestion = async ({ id, ...questionData }: { id: string } & UpdateQuestionData): Promise<Question> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Update the question
    const { data: question, error: questionError } = await supabase
        .from('questions')
        .update({
            question_text: questionData.question_text,
            question_image_url: questionData.question_image_url || null,
            question_type: questionData.question_type,
            explanation: questionData.explanation || null,
            points: questionData.points || 1,
            order_by: questionData.order_by,
            is_active: questionData.is_active ?? true,
            updated_by: user.id,
        })
        .eq('id', id)
        .eq('is_erased', false)
        .select()
        .single();

    if (questionError) {
        throw new Error(questionError.message);
    }

    // Handle options update
    let options: QuestionOption[] = [];
    let correctAnswerId: string | undefined;

    if (questionData.options && questionData.options.length > 0) {
        // First, soft delete existing options
        await supabase
            .from('questions_has_options')
            .update({ is_erased: true, updated_by: user.id })
            .eq('question_id', id);

        // Create new options
        const optionsToInsert = questionData.options
            .filter(opt => opt.text.trim() !== '')
            .map((opt, index) => ({
                question_id: id,
                option_text: opt.text,
                option_image_url: opt.image || null,
                order_by: index + 1,
                is_active: true,
                created_by: user.id,
                updated_by: user.id,
            }));

        const { data: insertedOptions, error: optionsError } = await supabase
            .from('questions_has_options')
            .insert(optionsToInsert)
            .select();

        if (optionsError) {
            throw new Error(optionsError.message);
        }

        options = insertedOptions || [];

        // Set correct answer if provided
        if (questionData.correct_answer && options.length > 0) {
            const correctOption = options.find(opt => opt.option_text === questionData.correct_answer);
            if (correctOption) {
                correctAnswerId = correctOption.id;

                // Update the question with the correct answer ID
                const { error: updateError } = await supabase
                    .from('questions')
                    .update({ correct_answer: correctAnswerId })
                    .eq('id', id);

                if (updateError) {
                    throw new Error(updateError.message);
                }
            }
        }
    }

    return {
        id: question.id,
        lesson_id: question.lesson_id,
        course_id: question.course_id,
        question_text: question.question_text,
        question_image_url: question.question_image_url,
        question_type: question.question_type,
        correct_answer: correctAnswerId,
        points: question.points,
        explanation: question.explanation,
        order_by: question.order_by,
        is_erased: question.is_erased,
        is_active: question.is_active,
        created_by: question.created_by,
        updated_by: question.updated_by,
        created_at: question.created_at,
        updated_at: question.updated_at,
        options: options,
    };
};

// Delete question (soft delete)
const deleteQuestion = async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Soft delete the question
    const { error: questionError } = await supabase
        .from('questions')
        .update({
            is_erased: true,
            updated_by: user.id
        })
        .eq('id', id);

    if (questionError) {
        throw new Error(questionError.message);
    }

    // Soft delete all associated options
    const { error: optionsError } = await supabase
        .from('questions_has_options')
        .update({
            is_erased: true,
            updated_by: user.id
        })
        .eq('question_id', id);

    if (optionsError) {
        throw new Error(optionsError.message);
    }
};

// Hook for fetching questions for a lesson
export const useQuestions = (lessonId: string) => {
    return useQuery({
        queryKey: questionsKeys.list(lessonId),
        queryFn: () => fetchQuestions(lessonId),
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook for creating question with optimistic updates
export const useCreateQuestion = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: createQuestion,
        onMutate: async (newQuestion) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: questionsKeys.list(newQuestion.lesson_id) });

            // Snapshot the previous value
            const previousQuestions = queryClient.getQueryData<Question[]>(questionsKeys.list(newQuestion.lesson_id));

            // Optimistically update to the new value
            const optimisticQuestion: Question = {
                id: `temp-${Date.now()}`, // Temporary ID
                lesson_id: newQuestion.lesson_id,
                course_id: newQuestion.course_id,
                question_text: newQuestion.question_text,
                question_image_url: newQuestion.question_image_url,
                question_type: newQuestion.question_type,
                correct_answer: newQuestion.correct_answer,
                points: newQuestion.points || 1,
                explanation: newQuestion.explanation,
                order_by: newQuestion.order_by,
                is_erased: false,
                is_active: newQuestion.is_active ?? true,
                created_by: 'temp-user',
                updated_by: 'temp-user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                options: newQuestion.options?.map((opt, index) => ({
                    id: `temp-opt-${Date.now()}-${index}`,
                    question_id: `temp-${Date.now()}`,
                    option_text: opt.text,
                    option_image_url: opt.image,
                    order_by: index + 1,
                    is_erased: false,
                    is_active: true,
                    created_by: 'temp-user',
                    updated_by: 'temp-user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })) || [],
            };

            queryClient.setQueryData<Question[]>(questionsKeys.list(newQuestion.lesson_id), (old) => {
                return old ? [...old, optimisticQuestion] : [optimisticQuestion];
            });

            return { previousQuestions };
        },
        onError: (err, newQuestion, context) => {
            // Rollback on error
            if (context?.previousQuestions) {
                queryClient.setQueryData(questionsKeys.list(newQuestion.lesson_id), context.previousQuestions);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to create question. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (newQuestion) => {
            // Update the cache with the real data
            queryClient.setQueryData<Question[]>(questionsKeys.list(newQuestion.lesson_id), (oldData) => {
                return oldData?.map(question =>
                    question.id.startsWith('temp-') ? newQuestion : question
                );
            });

            toast({
                title: "Question Created",
                description: "New question has been successfully created.",
            });
        },
        onSettled: (_, __, variables) => {
            // Always refetch after error or success to ensure cache consistency
            queryClient.invalidateQueries({ queryKey: questionsKeys.list(variables.lesson_id) });
        },
    });
};

// Hook for updating question with optimistic updates
export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: updateQuestion,
        onMutate: async ({ id, ...updateData }) => {
            // Get the lesson_id from the current question data
            const currentQuestions = queryClient.getQueryData<Question[]>(questionsKeys.lists());
            const currentQuestion = currentQuestions?.find(question => question.id === id);
            const lessonId = currentQuestion?.lesson_id;

            if (!lessonId) return { previousQuestions: null };

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: questionsKeys.list(lessonId) });

            // Snapshot the previous value
            const previousQuestions = queryClient.getQueryData<Question[]>(questionsKeys.list(lessonId));

            // Optimistically update to the new value
            queryClient.setQueryData<Question[]>(questionsKeys.list(lessonId), (oldData) => {
                return oldData?.map(question =>
                    question.id === id
                        ? {
                            ...question,
                            question_text: updateData.question_text,
                            question_image_url: updateData.question_image_url,
                            question_type: updateData.question_type,
                            correct_answer: updateData.correct_answer,
                            points: updateData.points || 1,
                            explanation: updateData.explanation,
                            order_by: updateData.order_by,
                            is_active: updateData.is_active ?? true,
                            updated_by: 'temp-user',
                            updated_at: new Date().toISOString(),
                            options: updateData.options?.map((opt, index) => ({
                                id: `temp-opt-${Date.now()}-${index}`,
                                question_id: id,
                                option_text: opt.text,
                                option_image_url: opt.image,
                                order_by: index + 1,
                                is_erased: false,
                                is_active: true,
                                created_by: 'temp-user',
                                updated_by: 'temp-user',
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            })) || [],
                        }
                        : question
                );
            });

            return { previousQuestions, lessonId };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousQuestions && context?.lessonId) {
                queryClient.setQueryData(questionsKeys.list(context.lessonId), context.previousQuestions);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to update question. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (updatedQuestion) => {
            // Update the cache with the real data
            queryClient.setQueryData<Question[]>(questionsKeys.list(updatedQuestion.lesson_id), (oldData) => {
                return oldData?.map(question =>
                    question.id === updatedQuestion.id ? updatedQuestion : question
                );
            });

            // Also update the individual question cache
            queryClient.setQueryData(questionsKeys.detail(updatedQuestion.id), updatedQuestion);

            toast({
                title: "Question Updated",
                description: "Question has been successfully updated.",
            });
        },
        onSettled: (_, __, variables) => {
            // Get lesson_id from current data
            const currentQuestions = queryClient.getQueryData<Question[]>(questionsKeys.lists());
            const currentQuestion = currentQuestions?.find(question => question.id === variables.id);
            const lessonId = currentQuestion?.lesson_id;

            if (lessonId) {
                queryClient.invalidateQueries({ queryKey: questionsKeys.list(lessonId) });
            }
        },
    });
};

// Hook for deleting question with optimistic updates
export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: deleteQuestion,
        onMutate: async (id) => {
            // Get the lesson_id from the current question data
            const currentQuestions = queryClient.getQueryData<Question[]>(questionsKeys.lists());
            const currentQuestion = currentQuestions?.find(question => question.id === id);
            const lessonId = currentQuestion?.lesson_id;

            if (!lessonId) return { previousQuestions: null };

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: questionsKeys.list(lessonId) });

            // Snapshot the previous value
            const previousQuestions = queryClient.getQueryData<Question[]>(questionsKeys.list(lessonId));

            // Optimistically remove the question (filter out)
            queryClient.setQueryData<Question[]>(questionsKeys.list(lessonId), (oldData) => {
                return oldData?.filter(question => question.id !== id);
            });

            return { previousQuestions, lessonId };
        },
        onError: (err, id, context) => {
            // Rollback on error
            if (context?.previousQuestions && context?.lessonId) {
                queryClient.setQueryData(questionsKeys.list(context.lessonId), context.previousQuestions);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to delete question. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (_, deletedId) => {
            // Remove individual question cache
            queryClient.removeQueries({ queryKey: questionsKeys.detail(deletedId) });

            toast({
                title: "Question Deleted",
                description: "Question has been successfully deleted.",
                variant: "destructive"
            });
        },
        onSettled: (_, __, id) => {
            // Get lesson_id from current data
            const currentQuestions = queryClient.getQueryData<Question[]>(questionsKeys.lists());
            const currentQuestion = currentQuestions?.find(question => question.id === id);
            const lessonId = currentQuestion?.lesson_id;

            if (lessonId) {
                queryClient.invalidateQueries({ queryKey: questionsKeys.list(lessonId) });
            }
        },
    });
};

// Hook for getting a single question
export const useQuestion = (id: string) => {
    return useQuery({
        queryKey: questionsKeys.detail(id),
        queryFn: async (): Promise<Question> => {
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    options:questions_has_options!questions_has_options_question_id_fkey(
                        id,
                        option_text,
                        option_image_url,
                        order_by,
                        is_erased,
                        is_active,
                        created_by,
                        updated_by,
                        created_at,
                        updated_at
                    )
                `)
                .eq('id', id)
                .eq('is_erased', false)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return {
                id: data.id,
                lesson_id: data.lesson_id,
                course_id: data.course_id,
                question_text: data.question_text,
                question_image_url: data.question_image_url,
                question_type: data.question_type,
                correct_answer: data.correct_answer,
                points: data.points,
                explanation: data.explanation,
                order_by: data.order_by,
                is_erased: data.is_erased,
                is_active: data.is_active,
                created_by: data.created_by,
                updated_by: data.updated_by,
                created_at: data.created_at,
                updated_at: data.updated_at,
                options: data.options?.filter((opt: any) => !opt.is_erased) || [],
            };
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook for fetching a single lesson
export const useLesson = (lessonId: string) => {
    return useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single();
            // console.log({ data, error })

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook for fetching a single course
export const useCourse = (courseId: string) => {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Utility hook for questions with search/filtering
export const useQuestionsWithFilter = (lessonId: string, searchTerm: string = '', typeFilter: string = 'all') => {
    const { data: questions = [], isLoading, error } = useQuestions(lessonId);
    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || question.question_type === typeFilter;
        return matchesSearch && matchesType && question.is_active;
    }).sort((a, b) => a.order_by - b.order_by);

    const stats = {
        total: questions.length,
        mcq: questions.filter(q => q.question_type === 'mcq').length,
        true_false: questions.filter(q => q.question_type === 'true_false').length,
        fill_blank: questions.filter(q => q.question_type === 'fill_blank').length,
        essay: questions.filter(q => q.question_type === 'essay').length,
    };

    return {
        questions: filteredQuestions,
        allQuestions: questions,
        stats,
        isLoading,
        error,
    };
};
