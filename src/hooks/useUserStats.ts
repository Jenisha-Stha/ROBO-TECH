import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  // Basic user info
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    school_name?: string;
    alias_name?: string;
    created_at: string;
    user_types?: {
      id: string;
      name: string;
    };
    tags?: {
      id: string;
      title: string;
    };
  };

  // Course statistics
  courses: {
    total_enrolled: number;
    completed_courses: number;
    in_progress_courses: number;
    course_list: Array<{
      id: string;
      title: string;
      course_type: string;
      is_completed: boolean;
      enrolled_at: string;
      completed_at?: string;
    }>;
  };

  // Lesson statistics
  lessons: {
    total_lessons: number;
    completed_lessons: number;
    in_progress_lessons: number;
    lesson_list: Array<{
      id: string;
      title: string;
      course_title: string;
      is_completed: boolean;
      total_questions: number;
      attempted_questions: number;
      correct_answers: number;
      score_percentage: number;
      completed_at?: string;
    }>;
  };

  // Question statistics
  questions: {
    total_questions_attempted: number;
    total_correct_answers: number;
    total_incorrect_answers: number;
    overall_score_percentage: number;
    question_breakdown: Array<{
      question_id: string;
      question_text: string;
      course_title: string;
      lesson_title: string;
      is_correct: boolean;
      answered_at: string;
    }>;
  };

  // Learning progress
  progress: {
    total_learning_time_minutes: number;
    average_score_per_lesson: number;
    streak_days: number;
    last_activity: string;
    learning_path: Array<{
      date: string;
      courses_completed: number;
      lessons_completed: number;
      questions_answered: number;
      score: number;
    }>;
  };
}

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async (): Promise<UserStats> => {
      // console.log("🔍 Fetching user stats for user:", userId);

      try {
        // Fetch user basic info
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select(
            `
            id,
            full_name,
            avatar_url,
            school_name,
            alias_name,
            created_at,
            user_types (
              id,
              name
            ),
            tags (
              id,
              title
            )
          `
          )
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("❌ Error fetching user data:", userError);
          throw userError;
        }

        // console.log("✅ User data fetched:", userData);

        // Fetch user's email from auth.users
        // const { data: authData, error: authError } =
        //   await supabase.auth.admin.getUserById(userId);
        // if (authError) {
        //   console.error("❌ Error fetching auth data:", authError);
        // }

        // const userEmail = authData?.user?.email || "Email not available";
        // console.log("📧 User email:", userEmail);

        // Fetch course progress
        const { data: courseProgress, error: courseError } = await supabase
          .from("user_course_response")
          .select(
            `
            course_id,
            is_completed,
            created_at,
            updated_at,
            courses (
              id,
              title,
              course_type,
              is_erased
            )
          `
          )
          .eq("user_id", userId)
          .eq("is_active", true);

        if (courseError) {
          console.error("❌ Error fetching course progress:", courseError);
          throw courseError;
        }

        // Filter out courses where is_erased is true or course is null
        const filteredCourseProgress = (courseProgress || []).filter((item) => {
          const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
          return course && course.is_erased === false;
        });

        // console.log("📚 Course progress fetched:", filteredCourseProgress);

        // Fetch lesson progress
        const { data: lessonProgress, error: lessonError } = await supabase
          .from("user_lessons_response")
          .select(
            `
            lesson_id,
            total_questions,
            total_attempted,
            total_correct,
            is_completed,
            created_at,
            updated_at,
            lessons (
              id,
              title,
              courses (
                id,
                title,
                is_erased
              )
            )
          `
          )
          .eq("user_id", userId)
          .eq("is_active", true);

        if (lessonError) {
          console.error("❌ Error fetching lesson progress:", lessonError);
          throw lessonError;
        }

        // Filter out lessons from courses where is_erased is true or course is null
        const filteredLessonProgress = (lessonProgress || []).filter((item) => {
          const lesson = Array.isArray(item.lessons) ? item.lessons[0] : item.lessons;
          const course = Array.isArray(lesson?.courses) ? lesson?.courses[0] : lesson?.courses;
          return course && course.is_erased === false;
        });

        // console.log("📖 Lesson progress fetched:", filteredLessonProgress);

        // Fetch question responses
        const { data: questionResponses, error: questionError } = await supabase
          .from("user_responses")
          .select(
            `
            question_id,
            answer_id,
            created_at,
            questions (
              id,
              question_text,
              correct_answer,
              courses (
                id,
                title,
                is_erased
              ),
              lessons (
                id,
                title
              )
            ),
            questions_has_options (
              id,
              option_text
            )
          `
          )
          .eq("user_id", userId)
          .eq("is_active", true);

        if (questionError) {
          console.error("❌ Error fetching question responses:", questionError);
          throw questionError;
        }

        // Filter out questions from courses where is_erased is true or course is null
        const filteredQuestionResponses = (questionResponses || []).filter((item) => {
          const question = Array.isArray(item.questions) ? item.questions[0] : item.questions;
          const course = Array.isArray(question?.courses) ? question?.courses[0] : question?.courses;
          return course && course.is_erased === false;
        });

        // console.log("❓ Question responses fetched:", filteredQuestionResponses);

        // Process course statistics
        const courses = {
          total_enrolled: filteredCourseProgress?.length || 0,
          completed_courses:
            filteredCourseProgress?.filter((cp) => cp.is_completed).length || 0,
          in_progress_courses:
            filteredCourseProgress?.filter((cp) => !cp.is_completed).length || 0,
          course_list:
            filteredCourseProgress?.map((cp) => {
              const course = Array.isArray(cp.courses) ? cp.courses[0] : cp.courses;
              return {
                id: cp.course_id,
                title: course?.title || "Unknown Course",
                course_type: course?.course_type || "unknown",
                is_completed: cp.is_completed,
                enrolled_at: cp.created_at,
                completed_at: cp.is_completed ? cp.updated_at : undefined,
              };
            }) || [],
        };

        // console.log("📊 Course stats processed:", courses);

        // Process lesson statistics
        const lessons = {
          total_lessons: filteredLessonProgress?.length || 0,
          completed_lessons:
            filteredLessonProgress?.filter((lp) => lp.is_completed).length || 0,
          in_progress_lessons:
            filteredLessonProgress?.filter((lp) => !lp.is_completed).length || 0,
          lesson_list:
            filteredLessonProgress?.map((lp) => {
              const scorePercentage =
                lp.total_questions > 0
                  ? Math.round((lp.total_correct / lp.total_questions) * 100)
                  : 0;

              const lesson = Array.isArray(lp.lessons) ? lp.lessons[0] : lp.lessons;
              const course = Array.isArray(lesson?.courses) ? lesson?.courses[0] : lesson?.courses;

              return {
                id: lp.lesson_id,
                title: lesson?.title || "Unknown Lesson",
                course_title: course?.title || "Unknown Course",
                is_completed: lp.is_completed,
                total_questions: lp.total_questions,
                attempted_questions: lp.total_attempted,
                correct_answers: lp.total_correct,
                score_percentage: scorePercentage,
                completed_at: lp.is_completed ? lp.updated_at : undefined,
              };
            }) || [],
        };

        // console.log("📊 Lesson stats processed:", lessons);

        // Process question statistics
        const totalQuestionsAttempted = filteredQuestionResponses?.length || 0;
        const correctAnswers =
          filteredQuestionResponses?.filter((qr) => {
            const question = Array.isArray(qr.questions) ? qr.questions[0] : qr.questions;
            return qr.answer_id === question?.correct_answer;
          }).length || 0;
        const incorrectAnswers = totalQuestionsAttempted - correctAnswers;
        const overallScorePercentage =
          totalQuestionsAttempted > 0
            ? Math.round((correctAnswers / totalQuestionsAttempted) * 100)
            : 0;

        const questions = {
          total_questions_attempted: totalQuestionsAttempted,
          total_correct_answers: correctAnswers,
          total_incorrect_answers: incorrectAnswers,
          overall_score_percentage: overallScorePercentage,
          question_breakdown:
            filteredQuestionResponses?.map((qr) => {
              const question = Array.isArray(qr.questions) ? qr.questions[0] : qr.questions;
              const course = Array.isArray(question?.courses) ? question?.courses[0] : question?.courses;
              const lesson = Array.isArray(question?.lessons) ? question?.lessons[0] : question?.lessons;
              return {
                question_id: qr.question_id,
                question_text: question?.question_text || "Unknown Question",
                course_title: course?.title || "Unknown Course",
                lesson_title: lesson?.title || "Unknown Lesson",
                is_correct: qr.answer_id === question?.correct_answer,
                answered_at: qr.created_at,
              };
            }) || [],
        };

        // console.log("📊 Question stats processed:", questions);

        // Calculate learning progress
        const totalLearningTime =
          filteredLessonProgress?.reduce((total, lp) => {
            // Assuming each lesson has duration_minutes, but we'll use a default
            return total + lp.total_attempted * 5; // 5 minutes per question attempt
          }, 0) || 0;

        const averageScorePerLesson =
          lessons.lesson_list.length > 0
            ? Math.round(
              lessons.lesson_list.reduce(
                (sum, lesson) => sum + lesson.score_percentage,
                0
              ) / lessons.lesson_list.length
            )
            : 0;

        // Calculate streak (simplified - based on recent activity)
        const recentActivity =
          filteredQuestionResponses?.filter((qr) => {
            const responseDate = new Date(qr.created_at);
            const daysDiff =
              (Date.now() - responseDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7; // Last 7 days
          }).length || 0;

        const lastActivity =
          filteredQuestionResponses?.length > 0
            ? filteredQuestionResponses.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0].created_at
            : userData.created_at;

        const progress = {
          total_learning_time_minutes: totalLearningTime,
          average_score_per_lesson: averageScorePerLesson,
          streak_days: recentActivity > 0 ? Math.min(recentActivity, 30) : 0,
          last_activity: lastActivity,
          learning_path: [], // This would be calculated from historical data
        };

        // console.log("📊 Progress stats processed:", progress);

        const userStats: UserStats = {
          user: {
            id: userData.id,
            full_name: userData.full_name || "Unknown User",
            // email: userEmail,
            avatar_url: userData.avatar_url,
            school_name: userData.school_name,
            alias_name: userData.alias_name,
            created_at: userData.created_at,
            user_types: userData.user_types,
            tags: userData.tags,
          },
          courses,
          lessons,
          questions,
          progress,
        };

        // console.log("🎉 Complete user stats compiled:", userStats);
        return userStats;
      } catch (error) {
        console.error("💥 Error fetching user stats:", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
// useUserCourses.ts
export function useUserCourses(userId: string | null) {
  console.log("🔍 useUserCourses called with userId:", userId);

  return useQuery({
    queryKey: ["user_course_response", userId],
    queryFn: async () => {
      console.log("🚀 useUserCourses queryFn executing for userId:", userId);

      if (!userId) {
        console.log("❌ No userId provided");
        return [];
      }

      // Check and refresh session before query
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.log("❌ No active session, refreshing...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.log("❌ Session refresh failed:", refreshError);
          throw new Error("Session expired and refresh failed");
        }
      }

      const { data, error } = await supabase
        .from("user_course_response")
        .select(
          `
            course_id,
            is_completed,
            created_at,
            updated_at,
            courses (
              id,
              title,
              course_type,
              image_asset_id,
              is_erased,
              image_asset:assets!courses_image_asset_id_fkey(
              url
              )
            )
          `
        )
        .eq("user_id", userId);

      if (error) {
        console.log("❌ useUserCourses error:", error);
        // If it's an auth error, try to refresh session and retry once
        if (
          error.message?.includes("JWT") ||
          error.message?.includes("token") ||
          error.message?.includes("auth")
        ) {
          console.log("🔄 Auth error detected, refreshing session...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError) {
            console.log("🔄 Session refreshed, retrying query...");
            // Retry the query once after refresh
            const { data: retryData, error: retryError } = await supabase
              .from("user_course_response")
              .select(
                `
                  course_id,
                  is_completed,
                  created_at,
                  updated_at,
                  courses (
                    id,
                    title,
                    course_type,
                    image_asset_id,
                    is_erased,
                    image_asset:assets!courses_image_asset_id_fkey(
                    url
                    )
                  )
                `
              )
              .eq("user_id", userId);

            if (retryError) {
              console.log("❌ Retry also failed:", retryError);
              throw retryError;
            }
            console.log("✅ useUserCourses retry data:", retryData);

            // Filter out courses where is_erased is true or course is null
            const filteredRetryData = (retryData || []).filter(
              (item) => {
                const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
                return course && course.is_erased === false;
              }
            );

            console.log("✅ Filtered retry courses (is_erased=false):", filteredRetryData);

            // Compute rank for retry data
            const retryCoursesWithRank = await Promise.all(
              filteredRetryData.map(async (course) => {
                // Step 1: Fetch marks for that course
                const { data: marksData, error: marksError } = await supabase
                  .from("user_lessons_response")
                  .select("user_id, total_correct")
                  .eq("course_id", course.course_id);

                if (marksError) {
                  console.error("❌ Marks fetch error:", marksError);
                  return { ...course, user_rank: null, total_responses: 0 };
                }

                // Step 2: Aggregate total marks by user
                const totals = marksData.reduce((acc, row) => {
                  acc[row.user_id] =
                    (acc[row.user_id] || 0) + Number(row.total_correct);
                  return acc;
                }, {});

                // Step 3: Sort users by total marks
                const sorted = Object.entries(totals).sort(
                  (a, b) => Number(b[1]) - Number(a[1])
                );

                // Step 4: Find rank + stats
                const totalResponses = sorted.length;
                const myRank = sorted.findIndex(([id]) => id === userId) + 1;
                const myTotalMarks = totals[userId];

                console.log(
                  `📘 Course ${course.course_id} → Rank: ${myRank}/${totalResponses}, Marks: ${myTotalMarks}`
                );

                return {
                  ...course,
                  user_rank: myRank || null,
                  total_responses: totalResponses,
                  total_marks: myTotalMarks || 0,
                };
              })
            );

            return retryCoursesWithRank || [];
          }
        }
        throw error;
      }
      console.log("✅ useUserCourses data:", data);

      // Filter out courses where is_erased is true or course is null
      const filteredData = (data || []).filter(
        (item) => {
          const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
          return course && course.is_erased === false;
        }
      );

      console.log("✅ Filtered courses (is_erased=false):", filteredData);

      // Now compute rank for each course concurrently
      const coursesWithRank = await Promise.all(
        filteredData.map(async (course) => {
          // Step 1: Fetch marks for that course
          const { data: marksData, error: marksError } = await supabase
            .from("user_lessons_response")
            .select("user_id, total_correct")
            .eq("course_id", course.course_id);

          if (marksError) {
            console.error("❌ Marks fetch error:", marksError);
            return { ...course, user_rank: null, total_responses: 0 };
          }

          // Step 2: Aggregate total marks by user
          const totals = marksData.reduce((acc, row) => {
            acc[row.user_id] =
              (acc[row.user_id] || 0) + Number(row.total_correct);
            return acc;
          }, {});

          // Step 3: Sort users by total marks
          const sorted = Object.entries(totals).sort(
            (a, b) => Number(b[1]) - Number(a[1])
          );

          // Step 4: Find rank + stats
          const totalResponses = sorted.length;
          const myRank = sorted.findIndex(([id]) => id === userId) + 1;
          const myTotalMarks = totals[userId];

          console.log(
            `📘 Course ${course.course_id} → Rank: ${myRank}/${totalResponses}, Marks: ${myTotalMarks}`
          );

          return {
            ...course,
            user_rank: myRank || null,
            total_responses: totalResponses,
            total_marks: myTotalMarks || 0,
          };
        })
      );

      return coursesWithRank || [];
    },
    enabled: !!userId, // only run if we have a userId
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
    retry: (failureCount, error) => {
      // Don't retry if it's an auth error (we handle it manually)
      if (
        error?.message?.includes("JWT") ||
        error?.message?.includes("token") ||
        error?.message?.includes("auth")
      ) {
        return false;
      }
      return failureCount < 2; // Retry up to 2 times for non-auth errors
    },
    onSuccess: (data) => {
      console.log("✅ useUserCourses onSuccess:", data);
    },
    onError: (error) => {
      console.log("❌ useUserCourses onError:", error);
    },
  });
}

// useUserCourses.ts
export function useCourseRank(userId: string | null) {
  console.log("🔍 useCourseRank called with userId:", userId);

  return useQuery({
    queryKey: ["user_course_response", userId],
    queryFn: async () => {
      console.log("🚀 useCourseRank queryFn executing for userId:", userId);

      if (!userId) {
        console.log("❌ No userId provided");
        return [];
      }

      // Check and refresh session before query
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.log("❌ No active session, refreshing...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.log("❌ Session refresh failed:", refreshError);
          throw new Error("Session expired and refresh failed");
        }
      }

      const { data, error } = await supabase
        .from("user_course_response")
        .select(
          `
            course_id,
            is_completed,
            created_at,
            updated_at,
            courses (
              id,
              title,
              course_type,
              image_asset_id,
              is_erased,
              is_active,
              image_asset:assets!courses_image_asset_id_fkey(
              url
              )
            )
          `
        )
        .eq("user_id", userId)
        .eq("is_completed", true);

      if (error) {
        console.log("❌ useUserCourses error:", error);
        // If it's an auth error, try to refresh session and retry once
        if (
          error.message?.includes("JWT") ||
          error.message?.includes("token") ||
          error.message?.includes("auth")
        ) {
          console.log("🔄 Auth error detected, refreshing session...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError) {
            console.log("🔄 Session refreshed, retrying query...");
            // Retry the query once after refresh
            const { data: retryData, error: retryError } = await supabase
              .from("user_course_response")
              .select(
                `
                  course_id,
                  is_completed,
                  created_at,
                  updated_at,
                  courses (
                    id,
                    title,
                    course_type,
                    image_asset_id,
                    is_erased,
                    is_active,
                    image_asset:assets!courses_image_asset_id_fkey(
                    url
                    )
                  )
                `
              )
              .eq("user_id", userId)
              .eq("is_completed", true);

            if (retryError) {
              console.log("❌ Retry also failed:", retryError);
              throw retryError;
            }
            console.log("✅ useUserCourses retry data:", retryData);

            // Filter out courses where is_erased is true or is_active is false or course is null
            const filteredRetryData = (retryData || []).filter((item) => {
              const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
              return course && course.is_erased === false && course.is_active === true;
            });

            // Now compute rank for each filtered course concurrently
            const retryCoursesWithRank = await Promise.all(
              filteredRetryData.map(async (course) => {
                // Step 1: Fetch marks for that course
                const { data: marksData, error: marksError } = await supabase
                  .from("user_lessons_response")
                  .select("user_id, total_correct")
                  .eq("course_id", course.course_id);

                if (marksError) {
                  console.error("❌ Marks fetch error:", marksError);
                  return { ...course, user_rank: null, total_responses: 0 };
                }

                // Step 2: Aggregate total marks by user
                const totals = marksData.reduce((acc, row) => {
                  acc[row.user_id] =
                    (acc[row.user_id] || 0) + Number(row.total_correct);
                  return acc;
                }, {});

                // Step 3: Sort users by total marks
                const sorted = Object.entries(totals).sort(
                  (a, b) => Number(b[1]) - Number(a[1])
                );

                // Step 4: Find rank + stats
                const totalResponses = sorted.length;
                const myRank = sorted.findIndex(([id]) => id === userId) + 1;
                const myTotalMarks = totals[userId];

                console.log(
                  `📘 Course ${course.course_id} → Rank: ${myRank}/${totalResponses}, Marks: ${myTotalMarks}`
                );

                return {
                  ...course,
                  user_rank: myRank || null,
                  total_responses: totalResponses,
                  total_marks: myTotalMarks || 0,
                };
              })
            );

            return retryCoursesWithRank || [];
          }
        }
        throw error;
      }
      console.log("✅ useUserCourses data:", data);

      // Filter out courses where is_erased is true or is_active is false or course is null
      const filteredData = (data || []).filter((item) => {
        const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
        return course && course.is_erased === false && course.is_active === true;
      });

      // Now compute rank for each filtered course concurrently
      const coursesWithRank = await Promise.all(
        filteredData.map(async (course) => {
          // Step 1: Fetch marks for that course
          const { data: marksData, error: marksError } = await supabase
            .from("user_lessons_response")
            .select("user_id, total_correct")
            .eq("course_id", course.course_id);

          if (marksError) {
            console.error("❌ Marks fetch error:", marksError);
            return { ...course, user_rank: null, total_responses: 0 };
          }

          // Step 2: Aggregate total marks by user
          const totals = marksData.reduce((acc, row) => {
            acc[row.user_id] =
              (acc[row.user_id] || 0) + Number(row.total_correct);
            return acc;
          }, {});

          // Step 3: Sort users by total marks
          const sorted = Object.entries(totals).sort(
            (a, b) => Number(b[1]) - Number(a[1])
          );

          // Step 4: Find rank + stats
          const totalResponses = sorted.length;
          const myRank = sorted.findIndex(([id]) => id === userId) + 1;
          const myTotalMarks = totals[userId];

          console.log(
            `📘 Course ${course.course_id} → Rank: ${myRank}/${totalResponses}, Marks: ${myTotalMarks}`
          );

          return {
            ...course,
            user_rank: myRank || null,
            total_responses: totalResponses,
            total_marks: myTotalMarks || 0,
          };
        })
      );

      return coursesWithRank || [];
    },
    enabled: !!userId, // only run if we have a userId
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
    retry: (failureCount, error) => {
      // Don't retry if it's an auth error (we handle it manually)
      if (
        error?.message?.includes("JWT") ||
        error?.message?.includes("token") ||
        error?.message?.includes("auth")
      ) {
        return false;
      }
      return failureCount < 2; // Retry up to 2 times for non-auth errors
    },
    onSuccess: (data) => {
      console.log("✅ useUserCourses onSuccess:", data);
    },
    onError: (error) => {
      console.log("❌ useUserCourses onError:", error);
    },
  });
}
// useCourseLessons.ts

export function useCourseLessons(courseId: string, userId: string) {
  return useQuery({
    queryKey: ["user_lessons_response", courseId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lessons_response")
        .select(
          `
            lesson_id,
            total_questions,
            total_attempted,
            total_correct,
            is_completed,
            created_at,
            updated_at,
            lessons!inner(
              id,
              title,
              courses!inner(
                id,
                title
              )
            )
          `
        )
        .eq("user_id", userId)
        .filter("lessons.courses.id", "eq", courseId);

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

// useLessonDetails.ts
export function useLessonDetails(lessonId: string, userId: string) {
  return useQuery({
    queryKey: ["lessonDetails", lessonId, userId],
    queryFn: async () => {
      //   const { data: lesson, error: lessonError } = await supabase
      //     .from("user_lessons_response")
      //     .select("id, title, score_percentage, attempted_questions, total_questions")
      //     .eq("id", lessonId)
      //     .single();

      //   if (lessonError) throw lessonError;

      const { data: questions, error: questionError } = await supabase
        .from("user_responses")
        .select(
          `
    question_id,
    answer_id,
    created_at,
    questions!inner (
      id,
      question_text,
      correct_answer,
      lessons!inner (
        id,
        title
      )
    ),
    questions_has_options (
      id,
      option_text
    )
  `
        )
        .eq("user_id", userId)
        .filter("questions.lessons.id", "eq", lessonId); // use .filter instead of .eq

      if (questionError) throw questionError;

      return { questions };
    },
    enabled: !!lessonId,
  });
}
