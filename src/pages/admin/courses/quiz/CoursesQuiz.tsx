import { AdminLayout } from "@/components/admin/AdminLayout";
import Levels from "@/components/Levels";
import QuizCard from "@/components/QuizCard";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import { useParams } from "react-router";

export default function CoursesQuiz() {

    const { courseId } = useParams<{ courseId: string }>();
    // const { item: question, isLoadingItem } = useFetchSingle('questions', 'question', courseId, `*`)


    const question = {
        id: '7f53e8e9-9706-4890-95e8-6dcef2211492',
        course_id: '5cec0d53-ab91-42d4-bd8c-ce773f5025c9',
        lesson_id: '97744ef2-1cbe-42ce-9014-78d9db7b5ad5',
        question_text: 'test lessons',
        correct_answer: 'cde',
        options:
            '[{"text":"abc","image":""},{"text":"cde","image":""},{"text":"efg","image":""},{"text":"ghi","image":""}]',
        points: 1,
        explanation: 'cde isa the best answer dfds',
        question_type: 'mcq',
        created_by: '0923fd72-b52f-4f97-a9cb-6324b1ef3798',
        updated_by: '0923fd72-b52f-4f97-a9cb-6324b1ef3798',
        created_at: '2025-08-28T06:38:14.530161',
        updated_at: '2025-08-28T06:38:14.530161',
        order_by: 2,
        is_active: true,
        question_image: null
    }
    // console.log("question", question)
    // if (isLoadingItem) {
    //     return <div>Loading...</div>
    // }
    // console.log("question", JSON.parse(question?.options))

    return (
        <AdminLayout title="Quiz">
            <QuizCard question={question} />
        </AdminLayout>
    );
}