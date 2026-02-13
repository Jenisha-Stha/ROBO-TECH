import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/hooks/useCoursesWithTags';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseCardNewProps {
    course: Course;
    index: number;
    onEnroll?: (courseId: string) => void;
}

const CourseCardNew: React.FC<CourseCardNewProps> = ({ course, index, onEnroll }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="block h-full cursor-pointer" onClick={() => onEnroll?.(course.id)}>
            <motion.div
                className="relative h-[600px] rounded-[2.5rem] overflow-hidden transition-all duration-300 border border-white/5"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(27, 54, 100, 0.3)',
                    background: 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)'
                }}
                animate={isHovered ? { y: 0 } : { y: [0, 15, 0] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.2, // Stagger effect
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{
                    scale: 1.02,
                    y: 0, // Stop floating on hover
                    boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(27, 54, 100, 0.5)',
                    transition: { duration: 0.3, delay: 0 } // Immediate hover response
                }}
                initial={false}
            >
                {/* Background Split: Top (Logo Red) */}
                <div className="absolute inset-x-0 top-0 h-[45%] bg-[#E31E24]" />

                {/* Floating Group: Illustration + Content Box (Animate Together) */}
                <motion.div
                    className="absolute inset-x-0 bottom-0 m-6 z-20 flex flex-col items-center pointer-events-none"
                    animate={isHovered ? { y: 0 } : { y: [0, -80, -80, 0] }}
                    transition={isHovered ? { duration: 0.5 } : {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeOut"
                    }}
                >
                    {/* Illustration - Sitting on top of the box */}
                    <div className="relative w-full flex items-end justify-center h-72 mb-0">
                        <motion.img
                            src="/images/borthersister.png"
                            alt="Course Illustration"
                            className="h-72 w-72 object-contain drop-shadow-2xl"
                            animate={isHovered ? { scale: 1 } : { scale: [1, 1.05, 1.05, 1] }}
                            transition={isHovered ? { duration: 0.5 } : {
                                duration: 5,
                                repeat: Infinity,
                                repeatDelay: 2,
                                times: [0, 0.3, 0.7, 1],
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {/* The "Sliding Box" Content - Now part of the group */}
                    <div className="w-full bg-white rounded-[2.5rem] p-10 pb-12 flex flex-col shadow-2xl pointer-events-auto h-[280px]">
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#1A1A2E] leading-tight mb-4 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-2">
                                    {course.detail}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                                <span className="text-sm font-extrabold text-[#E31E24] uppercase tracking-widest">View Details</span>
                                <div className="w-12 h-12 rounded-2xl bg-[#E31E24] flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Badge - Always on top */}
                <div className="absolute top-6 right-6 z-[50]">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider">
                        {course.course_type || "Free"}
                    </Badge>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseCardNew;
