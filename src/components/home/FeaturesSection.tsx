import type { MouseEvent } from 'react';
import './FeaturesSection.css';
import Shuffle from './Shuffle';
import CourseCardNew from '../CourseCardNew';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/hooks/useCoursesWithTags';
import { motion } from 'framer-motion';
import {
    Bot,
    Cpu,
    BookOpen,
    Laptop,
    Zap,
    Rocket,
    Settings,
    Brain,
    GraduationCap,
    Lightbulb
} from 'lucide-react';

const backgroundIcons = [
    { icon: Bot, x: '5%', y: '10%', size: 40, delay: 0 },
    { icon: Rocket, x: '90%', y: '15%', size: 45, delay: 1 },
    { icon: BookOpen, x: '10%', y: '80%', size: 38, delay: 2 },
    { icon: Laptop, x: '85%', y: '75%', size: 42, delay: 0.5 },
    { icon: Settings, x: '3%', y: '45%', size: 35, delay: 1.5 },
    { icon: Zap, x: '95%', y: '50%', size: 40, delay: 2.5 },
    { icon: Brain, x: '60%', y: '10%', size: 36, delay: 1.8 },
    { icon: GraduationCap, x: '40%', y: '85%', size: 40, delay: 0.8 },
    { icon: Lightbulb, x: '75%', y: '20%', size: 38, delay: 2.7 },
    { icon: Cpu, x: '25%', y: '15%', size: 42, delay: 0.3 },
];

function FeaturesSection() {
    const { data: courses, isLoading: isLoadingItems } = useSupabaseQuery<Course[]>({
        queryKey: ['courses-home-features'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select(`
              *,
              course_tags (
                id,
                tag_id,
                tags (
                  id,
                  title,
                  slug,
                  is_approved,
                  tagtype_id,
                  tag_types (
                    id,
                    name,
                    slug
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
              lessons:lessons!lessons_course_id_fkey(
                id,
                is_erased,
                is_active
              )
            `)
                .eq('is_erased', false)
                .eq('is_active', true)
                .limit(6)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data?.map(course => ({
                ...course,
                lesson_count: course.lessons?.filter(lesson => !lesson.is_erased && lesson.is_active).length || 0
            })) || [];
        },
        staleTime: 10 * 60 * 1000,
    });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section className="features-section">
            {/* Top Wave Curve SVG */}
            <div className="features-wave-top">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 150"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,80 C360,150 720,0 1080,80 C1260,120 1380,100 1440,80 L1440,150 L0,150 Z"
                        className="shape-fill"
                    ></path>
                </svg>
            </div>

            {/* Animated Background Icons */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {backgroundIcons.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <motion.div
                            key={index}
                            style={{
                                position: 'absolute',
                                left: item.x,
                                top: item.y,
                                color: 'white',
                                opacity: 0.1,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                rotate: [-10, 10, -10],
                            }}
                            transition={{
                                duration: 5 + Math.random() * 3,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: "easeInOut"
                            }}
                        >
                            <IconComponent size={item.size} strokeWidth={1.2} />
                        </motion.div>
                    );
                })}
            </div>

            <div className="features-header">
                <Shuffle
                    text="Our Exciting Courses"
                    tag="h2"
                    className="features-title"
                    shuffleDirection="right"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    ease="power3.out"
                    stagger={0.03}
                    threshold={0.1}
                    triggerOnce={false}
                    triggerOnHover={true}
                    loop={false}
                />
            </div>

            <div className="features-container container mx-auto px-4 text-center">
                {isLoadingItems ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="relative h-[500px] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10 overflow-hidden flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-white/10 mb-8" />
                                <div className="w-1/2 h-6 bg-white/10 rounded-full mb-4" />
                                <div className="w-3/4 h-4 bg-white/10 rounded-full" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        ))}
                    </div>
                ) : courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
                        {courses.map((course, index) => (
                            <CourseCardNew
                                key={course.id}
                                course={course}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-white/60 py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                        <p className="text-xl">No courses found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Wave Curve SVG */}
            <div className="features-wave">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 150"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,80 C360,150 720,0 1080,80 C1260,120 1380,100 1440,80 L1440,150 L0,150 Z"
                        className="shape-fill"
                    ></path>
                </svg>
            </div>
        </section>
    );
}

export default FeaturesSection;
