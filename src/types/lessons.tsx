export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    content: string;
    video_url: string;
    duration_minutes: number;
    is_published: boolean;
    order_by: number;
    is_erased?: boolean;
    is_active?: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}