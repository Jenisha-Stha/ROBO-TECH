"use client";

import { useLessonDetails } from "@/hooks/useUserStats";
import { useParams, useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function LessonDetailsPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isLoading, error } = useLessonDetails(lessonId!, userId!);

  if (isLoading)
    return <p className="text-center py-8">Loading lesson details...</p>;
  if (error)
    return (
      <p className="text-center py-8 text-destructive">
        Error loading lesson details: {error.message}
      </p>
    );
  if (!data || !data.questions || data.questions.length === 0)
    return (
      <p className="text-center py-8 text-muted-foreground">
        No questions found for this lesson.
      </p>
    );

  // Get lesson and course title from the first question
  const lessonTitle = data.questions[0]?.questions?.lessons?.title || "Lesson";
  const courseTitle = data.questions[0]?.questions?.courses?.title || "Course";

  return (
    <AdminLayout title="Lesson Details" subtitle={`Details for: ${lessonTitle} (${courseTitle})`}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lessons
        </Button>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{lessonTitle} - Questions</h2>
          {data.questions.map((resp: any) => {
            const question = resp.questions;
            const userAnswer = resp.answer_id && resp.questions_has_options?.id === resp.answer_id
              ? resp.questions_has_options?.option_text
              : "Not answered";

            const isCorrect = resp.answer_id === question.correct_answer;

            return (
              <Card key={resp.question_id}>
                <CardHeader>
                  <CardTitle className="text-sm">{question.question_text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Your Answer: </span>
                    <span>{userAnswer}</span>
                    {userAnswer !== "Not answered" && (
                      isCorrect ? (
                        <Check className="inline w-4 h-4 text-green-500 ml-2" />
                      ) : (
                        <X className="inline w-4 h-4 text-red-500 ml-2" />
                      )
                    )}
                  </div>
                  {/* <div>
                    <span className="font-medium">Correct Answer: </span>
                    <span>{question.correct_answer}</span>
                  </div> */}
                  <div className="text-sm text-muted-foreground">
                    Answered on: {new Date(resp.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}