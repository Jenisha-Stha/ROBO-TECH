import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Users } from 'lucide-react';
import { Course } from '@/hooks/useCoursesWithTags';

interface CourseCardProps {
    course: Course;
    onEnroll?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
    const formatDuration = (duration: number, durationIn: string) => {
        if (durationIn === 'hours') {
            return `${duration} ${duration === 1 ? 'hour' : 'hours'}`;
        } else if (durationIn === 'minutes') {
            return `${duration} ${duration === 1 ? 'minute' : 'minutes'}`;
        } else if (durationIn === 'days') {
            return `${duration} ${duration === 1 ? 'day' : 'days'}`;
        }
        return `${duration} ${durationIn}`;
    };

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="relative">
                {course.image_asset_id ? (
                    <img
                        src={course.image_asset?.url || '/images/drone.jpg'}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                        {/* {course.svg_icon ? (
                            <div dangerouslySetInnerHTML={{ __html: course.svg_icon }} className="w-16 h-16 text-white" />
                        ) : (
                            <Play className="w-16 h-16 text-white" />
                        )} */}
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {course.course_type}
                    </Badge>
                </div>
            </div>

            <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {course.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                    {course.detail}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow flex flex-col">
                {/* Course Tags */}
                {course.course_tags && course.course_tags.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {course.course_tags.slice(0, 3).map((courseTag) => (
                                <Badge
                                    key={courseTag.id}
                                    variant="outline"
                                    className="text-xs bg-purple-600/20 text-purple-800 border-purple-500/30 hover:bg-purple-600/30 transition-colors"
                                >
                                    {courseTag.tags.title}
                                </Badge>
                            ))}
                            {course.course_tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{course.course_tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Course Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {course.duration && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(course.duration, course.duration_in || 'hours')}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Beginner</span>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    onClick={() => onEnroll?.(course.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                    View Course
                </Button>
            </CardContent>
        </Card>
    );
};

export default CourseCard;
