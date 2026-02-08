import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    Play,
    CheckCircle2,
    Clock,
    TrendingUp,
    Award,
    Target,
    Calendar,
    BarChart3,
    Users,
    Brain,
    Trophy,
    Star,
    Activity,
    Zap,
    ArrowLeft,
    Loader2,
    Eye,
    ExternalLink,
    Search,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUserStats, type UserStats } from '@/hooks/useUserStats';
import { useAuth } from '@/hooks/useAuth';

export default function UserDashboard() {
    const { user: authUser } = useAuth();
    const userId = authUser.id;
    const navigate = useNavigate();

    // State for view management
    const [currentView, setCurrentView] = useState<'overview' | 'course' | 'lesson'>('overview');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // console.log('🎯 UserDashboard rendered for user:', userId);

    const { data: userStats, isLoading, error } = useUserStats(userId || '');

    if (isLoading) {
        return (

            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading user dashboard...</span>
                </div>
            </div>

        );
    }

    if (error) {
        return (

            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Error loading user data</p>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                    <Button
                        onClick={() => navigate('/admin/users')}
                        className="mt-4"
                        variant="outline"
                    >
                        Back to Users
                    </Button>
                </div>
            </div>

        );
    }

    if (!userStats) {
        return (

            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No user data available</p>
            </div>

        );
    }

    // console.log('📊 User stats loaded:', userStats);

    const { user, courses, lessons, questions, progress } = userStats;

    // Helper functions
    const filteredCourses = courses.course_list.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate course progress based on completed lessons
    const calculateCourseProgress = (course: any) => {
        const courseLessons = lessons.lesson_list.filter(lesson => lesson.course_title === course.title);
        if (courseLessons.length === 0) return 0;

        const completedLessons = courseLessons.filter(lesson => lesson.is_completed);
        const progressPercentage = Math.round((completedLessons.length / courseLessons.length) * 100);

        return progressPercentage;
    };

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setCurrentView('course');
    };

    const handleLessonClick = (lesson: any) => {
        setSelectedLesson(lesson);
        setCurrentView('lesson');
    };

    const handleBackToOverview = () => {
        setCurrentView('overview');
        setSelectedCourse(null);
        setSelectedLesson(null);
    };

    const handleBackToCourse = () => {
        setCurrentView('course');
        setSelectedLesson(null);
    };

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gradient-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Courses Enrolled</p>
                                <p className="text-2xl font-bold">{courses.total_enrolled}</p>
                                {/* <p className="text-xs text-green-600">
                                    {courses.completed_courses} completed
                                </p> */}
                            </div>
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Lessons Completed</p>
                                <p className="text-2xl font-bold">{lessons.completed_lessons}</p>
                                {/* <p className="text-xs text-blue-600">
                                    {lessons.in_progress_lessons} in progress
                                </p> */}
                            </div>
                            <Play className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                                <p className="text-2xl font-bold">{questions.overall_score_percentage}%</p>
                                {/* <p className="text-xs text-green-600">
                                    {questions.total_correct_answers} correct
                                </p> */}
                            </div>
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* <Card className="bg-gradient-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Learning Time</p>
                                <p className="text-2xl font-bold">{Math.round(progress.total_learning_time_minutes / 60)}h</p>
                                <p className="text-xs text-purple-600">
                                    {progress.streak_days} day streak
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Course Cards */}
            {currentView === 'overview' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Course Progress
                                </CardTitle>
                                <CardDescription>
                                    Track enrollment and completion across all courses
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredCourses.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        {searchQuery ? 'No courses found matching your search' : 'No courses enrolled'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery ? 'Try adjusting your search terms' : 'This user hasn\'t enrolled in any courses yet'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <Card
                                        key={course.id}
                                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950/20 dark:via-background dark:to-purple-950/20 hover:from-purple-100 hover:via-white hover:to-purple-100 dark:hover:from-purple-900/30 dark:hover:via-background dark:hover:to-purple-900/30"
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        {/* Gradient Header */}
                                        <div className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-6 text-white h-full">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 via-purple-600/90 to-purple-700/90"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl font-bold text-white line-clamp-2 mb-2">
                                                            {course.title}
                                                        </CardTitle>
                                                        <span className="font-medium text-foreground text-sm mb-4 block">
                                                            Enrolled on {new Date(course.enrolled_at).toLocaleDateString()}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={course.course_type === 'paid' ? 'default' : 'secondary'}
                                                                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                                            >
                                                                {course.course_type === 'paid' ? 'Paid' : 'Free'}
                                                            </Badge>
                                                            <Badge
                                                                variant={course.is_completed ? 'default' : 'secondary'}
                                                                className={`${course.is_completed
                                                                    ? 'bg-green-500/20 text-green-100 border-green-400/30 hover:bg-green-500/30'
                                                                    : 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30 hover:bg-yellow-500/30'
                                                                    }`}
                                                            >
                                                                {course.is_completed ? 'Completed' : 'In Progress'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                {/* <div className="space-y-2">
                                                    <div className="flex justify-between text-sm text-white/90">
                                                        <span>Progress</span>
                                                        <span className="font-semibold">
                                                            {calculateCourseProgress(course)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-white/20 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${calculateCourseProgress(course) === 100
                                                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                                : calculateCourseProgress(course) > 0
                                                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                                                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                                                }`}
                                                            style={{ width: `${calculateCourseProgress(course)}%` }}
                                                        ></div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        {/* <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        Enrolled
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {new Date(course.enrolled_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {course.completed_at && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-muted-foreground flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            Completed
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {new Date(course.completed_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}

                                                
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                                                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                            {course.is_completed ? '100%' : '50%'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Progress</div>
                                                    </div>
                                                    <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                                                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                            {course.course_type === 'paid' ? 'Premium' : 'Free'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Type</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent> */}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Course Detail View */}
            {currentView === 'course' && selectedCourse && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToOverview}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Courses
                            </Button>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    {selectedCourse.title}
                                </CardTitle>
                                <CardDescription>
                                    Course lessons and progress details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lessons.lesson_list
                                .filter(lesson => lesson.course_title === selectedCourse.title)
                                .map((lesson) => (
                                    <Card
                                        key={lesson.id}
                                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 hover:from-blue-100 hover:via-white hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:via-background dark:hover:to-blue-900/30"
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        {/* Gradient Header */}
                                        <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6 text-white">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-blue-700/90"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl font-bold text-white line-clamp-2 mb-2">
                                                            {lesson.title}
                                                        </CardTitle>
                                                        <Badge
                                                            variant={lesson.is_completed ? 'default' : 'secondary'}
                                                            className={`${lesson.is_completed
                                                                ? 'bg-green-500/20 text-green-100 border-green-400/30 hover:bg-green-500/30'
                                                                : 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30 hover:bg-yellow-500/30'
                                                                }`}
                                                        >
                                                            {lesson.is_completed ? 'Completed' : 'In Progress'}
                                                        </Badge>
                                                    </div>
                                                    <div className="ml-4 p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>

                                                {/* Score Display */}
                                                <div className="flex items-center justify-between">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-white">
                                                            {lesson.score_percentage}%
                                                        </div>
                                                        <div className="text-xs text-white/80">Score</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-white">
                                                            {lesson.attempted_questions}/{lesson.total_questions}
                                                        </div>
                                                        <div className="text-xs text-white/80">Questions</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        {/* <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-2">
                                                        <Brain className="w-4 h-4" />
                                                        Questions
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {lesson.attempted_questions}/{lesson.total_questions}
                                                    </span>
                                                </div>

                                                {lesson.completed_at && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-muted-foreground flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            Completed
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {new Date(lesson.completed_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}

                                                
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            {lesson.score_percentage}%
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Score</div>
                                                    </div>
                                                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            {lesson.attempted_questions}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">Attempted</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent> */}
                                    </Card>
                                ))}
                        </div>
                        {lessons.lesson_list.filter(lesson => lesson.course_title === selectedCourse.title).length === 0 && (
                            <div className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <Play className="w-8 h-8 text-muted-foreground" />
                                    <p className="text-muted-foreground">No lessons done</p>
                                    <p className="text-sm text-muted-foreground"> You haven't done any lessons yet</p>
                                    <p className="text-sm text-muted-foreground"> Please start a lesson to see your progress</p>
                                    <Button variant="outline" onClick={() => navigate(`/admin/courses/${selectedCourse.id}/play`)}>
                                        Start Lesson
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Lesson Detail View */}
            {currentView === 'lesson' && selectedLesson && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToCourse}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Course
                            </Button>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="w-5 h-5 text-blue-500" />
                                    {selectedLesson.title}
                                </CardTitle>
                                <CardDescription>
                                    Question analytics and performance details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Lesson Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                                    <p className="text-3xl font-bold text-green-600">{selectedLesson.score_percentage}%</p>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                                    <p className="text-3xl font-bold text-blue-600">{selectedLesson.attempted_questions}</p>
                                    <p className="text-sm text-muted-foreground">Questions Attempted</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                                    <p className="text-3xl font-bold text-purple-600">{selectedLesson.total_questions}</p>
                                    <p className="text-sm text-muted-foreground">Total Questions</p>
                                </div>
                            </div>

                            {/* Question Breakdown */}
                            {questions.question_breakdown
                                .filter(q => q.lesson_title === selectedLesson.title)
                                .length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-3">Question Responses</h4>
                                        <div className="rounded-md border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Question</TableHead>
                                                        <TableHead>Result</TableHead>
                                                        <TableHead>Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {questions.question_breakdown
                                                        .filter(q => q.lesson_title === selectedLesson.title)
                                                        .slice(0, 10)
                                                        .map((response, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    <div className="max-w-xs truncate">
                                                                        {response.question_text}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant={response.is_correct ? 'default' : 'destructive'}>
                                                                        {response.is_correct ? 'Correct' : 'Incorrect'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {new Date(response.answered_at).toLocaleDateString()}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* Learning Insights */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Learning Insights
                    </CardTitle>
                    <CardDescription>
                        Performance patterns and learning achievements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-600">{progress.streak_days}</p>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">{progress.average_score_per_lesson}%</p>
                            <p className="text-sm text-muted-foreground">Avg Score</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-purple-600">{Math.round(progress.total_learning_time_minutes / 60)}h</p>
                            <p className="text-sm text-muted-foreground">Study Time</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
                            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-yellow-600">
                                {Math.round((courses.completed_courses + lessons.completed_lessons) / 2)}
                            </p>
                            <p className="text-sm text-muted-foreground">Achievements</p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>

    );
}
