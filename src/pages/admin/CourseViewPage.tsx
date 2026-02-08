import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFetchAllById } from "@/hooks/useFetchAllById";
import { useFetchSingle } from "@/hooks/useFetchSingle";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { Lesson } from "@/types/lessons";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  HelpCircle,
  Image as ImageIcon,
  Play,
  Plus,
  Users,
  Video,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";





export default function CourseViewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { item: course, isLoadingItem } = useFetchSingle<Course>('courses', 'course', courseId,
    `
                    *,
                    course_tags(
                      tag_id,
                      tags(
                        id,
                        title,
                        is_approved,
                        tag_types(
                          id,
                          name
                        )
                      )
                    ),
                    image_asset:assets!courses_image_asset_id_fkey(
                      id,
                      url,
                      file_name,
                      asset_type,
                      alt_text,
                      description
                    ),
                    top_image_asset:assets!courses_top_image_asset_id_fkey(
                      id,
                      url,
                      file_name,
                      asset_type,
                      alt_text,
                      description
                    ),
                    bottom_image_asset:assets!courses_bottom_image_asset_id_fkey(
                      id,
                      url,
                      file_name,
                      asset_type,
                      alt_text,
                      description
                    ),
                    background_image_asset:assets!courses_background_image_asset_id_fkey(
                      id,
                      url,
                      file_name,
                      asset_type,
                      alt_text,
                      description
                    ),
                    video_asset:assets!courses_video_asset_id_fkey(
                      id,
                      url,
                      file_name,
                      asset_type,
                      alt_text,
                      description,
                      duration,
                      thumbnail_url
                    )
                  `
  )

  const { items: lessons, isLoadingItems: isLoadingLessons } = useFetchAllById<Lesson>('lessons', 'lessons', 'course_id', courseId)

  // Function to extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to handle user_course_response
  const handlePlayGame = async () => {
    if (!user?.id || !courseId) {
      toast({
        title: "Error",
        description: "User not authenticated or course ID missing",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user_course_response already exists
      const { data: existingResponse, error: checkError } = await supabase
        .from('user_course_response')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking user_course_response:', checkError);
        toast({
          title: "Error",
          description: "Failed to check course enrollment",
          variant: "destructive"
        });
        return;
      }

      // If no existing response, create one
      if (!existingResponse) {
        const { error: insertError } = await supabase
          .from('user_course_response')
          .insert({
            user_id: user.id,
            course_id: courseId,
            is_completed: false,
            is_active: true,
            created_by: user.id,
            updated_by: user.id
          });

        if (insertError) {
          console.error('Error creating user_course_response:', insertError);
          toast({
            title: "Error",
            description: "Failed to enroll in course",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Success",
          description: "Course enrollment created successfully!",
        });
      } else {
        toast({
          title: "Info",
          description: "You are already enrolled in this course",
        });
      }

      // Navigate to play page
      navigate(`/admin/courses/${courseId}/play`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (isLoadingItem || isLoadingLessons) {
    return <div>Loading...</div>
  }

  // Type assertion to help TypeScript understand the course object
  const courseData = course as Course | null;


  // If course not found, redirect back to courses page
  // if (!course) {
  //   navigate("/admin/courses");
  //   return null;
  // }
  // Filter lessons for this specific course

  return (
    <AdminLayout
      title={courseData?.title}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/admin/courses")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <div>
                  {courseData?.image_asset_id ? (
                    <img
                      src={courseData.image_asset.url}
                      alt={courseData.title}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <img
                      src={`/images/drone.jpg`}
                      alt={courseData.title}
                      className="w-full h-64 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex items-start justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-2xl">{courseData?.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={courseData?.course_type === "paid" ? "default" : "secondary"}>
                            {courseData?.course_type}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {courseData?.duration} {courseData?.duration_in}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Preview Button */}
                    {courseData?.video_url && extractYouTubeId(courseData.video_url) && (
                      <Button
                        onClick={() => setShowVideoModal(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Watch Teaser
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>


                <div className="main-content" dangerouslySetInnerHTML={{ __html: courseData?.detail }} />


                {/* {course.video && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-primary" />
                      <span className="font-medium">Course Preview Video</span>
                      <code className="ml-2 px-2 py-1 bg-background rounded text-xs">
                        {course.video}
                      </code>
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>
            {/* Lessons List */}
            <Card className="bg-gradient-card border-border mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      Course Lessons ({lessons?.length})
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {lessons?.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No lessons yet</h3>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons
                      .sort((a, b) => a.order_by - b.order_by)
                      .map((lesson, index) => (
                        <Card key={lesson.id} className="border-border hover:shadow-card transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Lesson Number */}
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-bold text-sm">
                                {index + 1}
                              </div>

                              {/* Lesson Image */}
                              {/* {lesson?.video_url ? (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-white" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )} */}

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground truncate">{lesson.title}</h4>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <div className="sticky top-20">
              <Card className="bg-gradient-card border-border mb-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Price </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-bold text-green-500"> FREE </span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <span className="text-sm">Duration</span>
                      <span className="text-2xl font-bold"> {course.duration} {course.duration_in} </span>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-sm">Total Lessons</span>
                    </div>
                    <span className="text-2xl font-bold">{lessons?.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      <span className="text-sm">Total Questions</span>
                    </div>
                    <span className="text-2xl font-bold">{lessons?.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-success" />
                      <span className="text-sm"> Duration </span>
                    </div>
                    <span className="text-2xl font-bold">{courseData?.duration} {courseData?.duration_in}</span>
                  </div>
                </CardContent>
              </Card>
              <button className="py-4 hover:scale-105 transition-all duration-300 bg-gradient-primary font-bold text-2xl hover:opacity-90  w-full py-3 rounded"
                onClick={handlePlayGame}
              > Enroll Now </button>
            </div>
          </div>
        </div>

        {/* YouTube Video Modal */}
        <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
          <DialogContent className="max-w-4xl w-full h-auto p-0 bg-black border-0">
            <DialogHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white text-lg">
                  Course Preview Video
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideoModal(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="p-4">
              {courseData?.video_url && extractYouTubeId(courseData.video_url) ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(courseData.video_url)}?autoplay=1&rel=0`}
                    title="Course Preview Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">No valid video URL found</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}