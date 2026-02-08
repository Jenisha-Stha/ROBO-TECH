import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    ExternalLink
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
                                <p className="text-xs text-green-600">
                                    {courses.completed_courses} completed
                                </p>
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
                                <p className="text-xs text-blue-600">
                                    {lessons.in_progress_lessons} in progress
                                </p>
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
                                <p className="text-xs text-green-600">
                                    {questions.total_correct_answers} correct
                                </p>
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

            {/* Course Progress Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Course Progress
                    </CardTitle>
                    <CardDescription>
                        Track enrollment and completion across all courses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead>Course</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Enrolled</TableHead>
                                    <TableHead>Completed</TableHead>
                                    <TableHead>Progress</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.course_list.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <BookOpen className="w-8 h-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">No courses enrolled</p>
                                                <p className="text-sm text-muted-foreground">This user hasn't enrolled in any courses yet</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    courses.course_list.map((course) => (
                                        <TableRow key={course.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="font-medium">{course.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={course.course_type === 'paid' ? 'default' : 'secondary'}>
                                                    {course.course_type === 'paid' ? 'Paid' : 'Free'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={course.is_completed ? 'default' : 'secondary'}>
                                                    {course.is_completed ? 'Completed' : 'In Progress'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(course.enrolled_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {course.completed_at ? new Date(course.completed_at).toLocaleDateString() : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={course.is_completed ? 100 : 50}
                                                        className="h-2 w-20"
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {course.is_completed ? '100%' : '50%'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Lesson Progress Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-blue-500" />
                        Lesson Progress
                    </CardTitle>
                    <CardDescription>
                        Detailed lesson completion and performance metrics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead>Lesson</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons.lesson_list.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Play className="w-8 h-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">No lessons taken</p>
                                                <p className="text-sm text-muted-foreground">This user hasn't started any lessons yet</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    lessons.lesson_list.map((lesson) => (
                                        <TableRow key={lesson.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="font-medium">{lesson.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">{lesson.course_title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={lesson.is_completed ? 'default' : 'secondary'}>
                                                    {lesson.is_completed ? 'Completed' : 'In Progress'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {lesson.attempted_questions}/{lesson.total_questions}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{lesson.score_percentage}%</span>
                                                    <div className="w-16">
                                                        <Progress value={lesson.score_percentage} className="h-2" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {lesson.completed_at ? new Date(lesson.completed_at).toLocaleDateString() : '-'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Question Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Question Analysis
                    </CardTitle>
                    <CardDescription>
                        Detailed breakdown of question responses and performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                            <p className="text-3xl font-bold text-green-600">{questions.total_correct_answers}</p>
                            <p className="text-sm text-muted-foreground">Correct Answers</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950">
                            <p className="text-3xl font-bold text-red-600">{questions.total_incorrect_answers}</p>
                            <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                            <p className="text-3xl font-bold text-blue-600">{questions.total_questions_attempted}</p>
                            <p className="text-sm text-muted-foreground">Total Attempted</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Accuracy Rate</span>
                            <span className="font-medium">{questions.overall_score_percentage}%</span>
                        </div>
                        <Progress value={questions.overall_score_percentage} className="h-3" />
                    </div>

                    {questions.question_breakdown.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Recent Question Responses</h4>
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Question</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Lesson</TableHead>
                                            <TableHead>Result</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {questions.question_breakdown.slice(0, 10).map((response, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="max-w-xs truncate">
                                                        {response.question_text}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {response.course_title}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {response.lesson_title}
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
                </CardContent>
            </Card>

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
