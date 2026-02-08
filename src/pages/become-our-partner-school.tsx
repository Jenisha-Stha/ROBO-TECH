import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    School,
    GraduationCap,
    Users,
    Award,
    ArrowRight,
    Lightbulb,
    Globe,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Sparkles,
    Zap,
    Star,
    Heart,
    Rocket,
    CheckCircle2
} from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Brand Colors
const BRAND = {
    red: '#C41E3A',
    redLight: '#ff6b6b',
    blue: '#2E86AB',
    blueLight: '#74b9ff',
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)';

interface School {
    id: string;
    name: string;
    logo_asset_id?: string;
    address?: string;
    website_url?: string;
    contact_person?: string;
    contact_email?: string;
    contact_number?: string;
    description?: string;
    is_erased: boolean;
    is_active: boolean;
    created_by?: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
    logo_asset?: any;
}

const benefits = [
    {
        icon: GraduationCap,
        title: "Expert Training",
        description: "Professional development programs designed by industry experts for educators.",
        color: BRAND.blue,
    },
    {
        icon: Award,
        title: "Certifications",
        description: "Industry-recognized certifications that enhance student profiles.",
        color: BRAND.red,
    },
    {
        icon: Lightbulb,
        title: "Innovation Labs",
        description: "State-of-the-art robotics and coding labs setup support.",
        color: BRAND.blue,
    },
    {
        icon: Users,
        title: "Community Network",
        description: "Join a thriving network of partner schools and collaborative events.",
        color: BRAND.red,
    }
];

const BecomeOurPartnerSchool = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const benefitsRef = useRef<HTMLDivElement>(null);
    const partnersRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    // Counter animation state
    const [startCounting, setStartCounting] = useState(false);
    const [counters, setCounters] = useState({ schools: 0, students: 0, satisfaction: 0 });

    // Animate counters from 0 to target
    useEffect(() => {
        if (!startCounting) return;

        const targets = { schools: 50, students: 10000, satisfaction: 100 };
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            // Ease out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounters({
                schools: Math.round(targets.schools * eased),
                students: Math.round(targets.students * eased),
                satisfaction: Math.round(targets.satisfaction * eased)
            });

            if (step >= steps) {
                clearInterval(timer);
                setCounters(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [startCounting]);

    const fetchSchools = async (): Promise<School[]> => {
        const { data, error } = await supabase
            .from('schools')
            .select(`
                *,
                logo_asset:assets!schools_logo_asset_id_fkey(
                    id,
                    url,
                    file_name,
                    asset_type,
                    alt_text,
                    description
                )
            `)
            .eq('is_erased', false)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return (data || []) as School[];
    };

    const { data: allSchools, isLoading: isLoadingSchools } = useQuery({
        queryKey: ['schools'],
        queryFn: fetchSchools,
    });

    // GSAP Animations with text reveal effects
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Split text animation for hero title
            const titleChars = document.querySelectorAll('.hero-char');
            gsap.fromTo(titleChars,
                { opacity: 0, y: 40, rotateX: -40 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'back.out(1.7)'
                }
            );

            // Accent text slide in with slight bounce
            gsap.fromTo('.hero-accent',
                { opacity: 0, x: -60, scale: 0.9 },
                { opacity: 1, x: 0, scale: 1, duration: 0.8, delay: 0.5, ease: 'back.out(1.5)' }
            );

            // Subtitle words with wave animation
            const subtitleWords = document.querySelectorAll('.subtitle-word');
            gsap.fromTo(subtitleWords,
                { opacity: 0, y: 30, rotateX: -20 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.5,
                    stagger: 0.04,
                    delay: 0.7,
                    ease: 'back.out(1.5)'
                }
            );

            // Continuous subtle wave on subtitle
            gsap.to(subtitleWords, {
                y: -3,
                duration: 1.5,
                stagger: {
                    each: 0.1,
                    repeat: -1,
                    yoyo: true
                },
                ease: 'sine.inOut',
                delay: 1.5
            });

            // Buttons with spring effect
            gsap.fromTo('.hero-btn',
                { opacity: 0, scale: 0.8, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.12,
                    delay: 1,
                    ease: 'back.out(2)'
                }
            );

            // Stats with count-up feel
            gsap.fromTo('.stat-item',
                { opacity: 0, scale: 0.5, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    delay: 1.2,
                    ease: 'back.out(2)',
                    onComplete: () => setStartCounting(true)
                }
            );

            // Benefits section with stagger
            // Benefits title with character split animation
            const benefitsTitleChars = document.querySelectorAll('.benefits-title-char');
            gsap.fromTo(benefitsTitleChars,
                { opacity: 0, y: 50, rotateX: -90 },
                {
                    opacity: 1, y: 0, rotateX: 0,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' }
                }
            );

            // Benefits subtitle slide up
            gsap.fromTo('.benefits-subtitle',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
                    scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' }
                }
            );

            gsap.fromTo('.benefit-card',
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: '.benefits-grid', start: 'top 75%' }
                }
            );

            // Partner schools cascade
            // Partners title with character split animation
            const partnersTitleChars = document.querySelectorAll('.partners-title-char');
            gsap.fromTo(partnersTitleChars,
                { opacity: 0, y: 50, rotateX: -90 },
                {
                    opacity: 1, y: 0, rotateX: 0,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: '.partners-section', start: 'top 80%' }
                }
            );

            // Partners subtitle slide up
            gsap.fromTo('.partners-subtitle',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
                    scrollTrigger: { trigger: '.partners-section', start: 'top 80%' }
                }
            );

            gsap.fromTo('.partner-card',
                { opacity: 0, y: 30, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: '.partners-grid', start: 'top 75%' }
                }
            );

            // CTA with smooth reveal
            gsap.fromTo('.cta-box',
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.3)',
                    scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
                }
            );

            // CTA title animation
            const ctaTitleChars = document.querySelectorAll('.cta-title-char');
            gsap.fromTo(ctaTitleChars,
                { opacity: 0, y: 30, scale: 0.8 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5,
                    stagger: 0.02,
                    ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' }
                }
            );

            // CTA subtitle slide up
            gsap.fromTo('.cta-subtitle',
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
                    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' }
                }
            );

        });

        return () => ctx.revert();
    }, [allSchools]);

    // Button hover effect
    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    // Card hover effect with 3D tilt
    const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        gsap.to(card, {
            y: -10,
            scale: 1.02,
            boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
            duration: 0.4,
            ease: 'back.out(1.5)'
        });
        // Animate icon
        const icon = card.querySelector('.card-icon');
        if (icon) {
            gsap.to(icon, {
                scale: 1.15,
                rotate: 5,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        }
    };

    const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            duration: 0.4,
            ease: 'power2.out'
        });
        // Reset icon
        const icon = card.querySelector('.card-icon');
        if (icon) {
            gsap.to(icon, {
                scale: 1,
                rotate: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    };

    // Card tilt effect based on mouse position
    const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
            rotateX: -rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    };

    const handleCardMoveLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    return (
        <>
            {/* Inline styles for pulsating animation */}
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { transform: scale(1); opacity: 0.15; }
                    50% { transform: scale(1.3); opacity: 0.25; }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.4; }
                    50% { transform: scale(1.2); opacity: 0.1; }
                    100% { transform: scale(0.8); opacity: 0.4; }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(5deg); }
                }
                @keyframes blob {
                    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                }
                @keyframes float-right {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(10px, -15px) rotate(3deg); }
                    66% { transform: translate(-5px, 10px) rotate(-2deg); }
                }
                @keyframes orbit {
                    0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
                }
                @keyframes shimmer {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .pulse-bg {
                    animation: pulse-glow 4s ease-in-out infinite;
                }
                .pulse-ring {
                    animation: pulse-ring 3s ease-in-out infinite;
                }
                .float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                .float-slow-delay {
                    animation: float-slow 6s ease-in-out infinite;
                    animation-delay: -3s;
                }
                .float-right {
                    animation: float-right 8s ease-in-out infinite;
                }
                .orbit {
                    animation: orbit 20s linear infinite;
                }
                .shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                .blob {
                    animation: blob 8s ease-in-out infinite;
                }
            `}</style>

            <Header />

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[auto] sm:min-h-screen flex items-center bg-white overflow-hidden py-20 sm:py-16 md:py-0 pt-20 sm:pt-16 md:pt-0">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-red-50/30" />

                {/* LEFT side decorative elements */}
                <div className="pulse-bg absolute bottom-[15%] left-[3%] w-48 md:w-64 h-48 md:h-64 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}20 0%, transparent 70%)`, animationDelay: '-2s' }} />
                <div className="float-slow absolute top-[25%] left-[8%] w-20 md:w-28 h-20 md:h-28 rounded-full hidden md:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.blue}30 0%, transparent 70%)` }} />
                <div className="pulse-ring absolute top-[40%] left-[5%] w-32 md:w-44 h-32 md:h-44 rounded-full border-2 hidden md:block"
                    style={{ borderColor: `${BRAND.red}25` }} />
                {/* Left floating icon */}
                <div className="float-slow-delay absolute top-[55%] left-[12%] hidden lg:flex items-center justify-center w-11 h-11 rounded-lg shadow-md bg-white">
                    <Star className="w-5 h-5" style={{ color: BRAND.red }} />
                </div>

                {/* RIGHT side decorative elements - using calc for better positioning */}
                {/* Large gradient blob - top right */}
                <div className="pulse-bg absolute top-[10%] w-56 md:w-72 lg:w-80 h-56 md:h-72 lg:h-80 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.blue}30 0%, transparent 70%)`, right: 'calc(0% - 40px)' }} />
                {/* Medium red blob - middle right */}
                <div className="pulse-bg absolute top-[45%] w-36 md:w-48 lg:w-56 h-36 md:h-48 lg:h-56 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}35 0%, transparent 70%)`, animationDelay: '-1.5s', right: 'calc(5% + 20px)' }} />
                {/* Floating blob shape - bottom right */}
                <div className="float-right absolute bottom-[20%] w-28 md:w-36 h-28 md:h-36 blob hidden sm:block"
                    style={{ background: `linear-gradient(135deg, ${BRAND.blue}30 0%, ${BRAND.red}30 100%)`, right: 'calc(3% + 10px)' }} />
                {/* Small accent circles - more visible */}
                <div className="shimmer absolute top-[20%] w-16 md:w-24 h-16 md:h-24 rounded-full hidden sm:block"
                    style={{ background: BRAND.red, opacity: 0.18, right: 'calc(12% + 30px)' }} />
                <div className="float-slow absolute top-[65%] w-12 md:w-16 h-12 md:h-16 rounded-full hidden sm:block"
                    style={{ background: BRAND_GRADIENT, opacity: 0.2, animationDelay: '-2s', right: 'calc(8% + 20px)' }} />
                <div className="float-slow-delay absolute bottom-[35%] w-18 md:w-28 h-18 md:h-28 rounded-full hidden md:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}40 0%, transparent 70%)`, right: 'calc(15% + 40px)' }} />
                {/* Decorative rings - right */}
                <div className="pulse-ring absolute top-[30%] w-44 md:w-56 h-44 md:h-56 rounded-full border-2 hidden md:block"
                    style={{ borderColor: `${BRAND.blue}35`, right: 'calc(8% + 30px)' }} />
                <div className="pulse-ring absolute bottom-[15%] w-32 md:w-40 h-32 md:h-40 rounded-full border-2 hidden lg:block"
                    style={{ borderColor: `${BRAND.red}30`, animationDelay: '-1.5s', right: 'calc(12% + 50px)' }} />

                {/* Floating icons - distributed on right */}
                <div className="float-slow absolute top-[18%] hidden lg:flex items-center justify-center w-12 h-12 rounded-xl shadow-lg bg-white z-20"
                    style={{ animationDelay: '-1s', right: 'calc(18% + 60px)' }}>
                    <Rocket className="w-6 h-6" style={{ color: BRAND.red }} />
                </div>
                <div className="float-slow-delay absolute top-[50%] hidden lg:flex items-center justify-center w-11 h-11 rounded-xl shadow-lg bg-white z-20"
                    style={{ right: 'calc(2% + 20px)' }}>
                    <GraduationCap className="w-5 h-5" style={{ color: BRAND.blue }} />
                </div>
                <div className="float-right absolute bottom-[28%] hidden lg:flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white z-20"
                    style={{ right: 'calc(20% + 80px)' }}>
                    <Zap className="w-5 h-5" style={{ color: BRAND.blue }} />
                </div>

                {/* Orbiting elements */}
                <div className="hidden lg:block absolute top-[40%]" style={{ right: 'calc(15% + 50px)' }}>
                    <div className="orbit w-3 h-3 rounded-full" style={{ background: BRAND_GRADIENT, opacity: 0.5 }} />
                </div>
                <div className="hidden lg:block absolute bottom-[40%]" style={{ right: 'calc(22% + 70px)' }}>
                    <div className="orbit w-2 h-2 rounded-full" style={{ background: BRAND.red, opacity: 0.4, animationDuration: '15s', animationDelay: '-5s' }} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 mb-8">
                            <Sparkles className="w-4 h-4" style={{ color: BRAND.blue }} />
                            <span className="text-sm font-medium text-gray-600">Transform Education Together</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                            <span className="inline-block overflow-hidden">
                                {'Become Our'.split('').map((char, i) => (
                                    <span key={i} className="hero-char inline-block" style={{ display: 'inline-block' }}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </span>
                            <span className="hero-accent block mt-1 sm:mt-2" style={{ color: BRAND.red }}>
                                {'Partner School'.split('').map((char, i) => (
                                    <span key={i} className="hero-char inline-block" style={{ display: 'inline-block', animationDelay: `${0.3 + i * 0.03}s` }}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </span>
                        </h1>

                        <p className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-4 sm:px-2">
                            Partner with us to bring cutting-edge{' '}
                            <span className="font-semibold" style={{ color: BRAND.blue }}>STEM education</span>,{' '}
                            <span className="font-semibold" style={{ color: BRAND.red }}>robotics</span>, and{' '}
                            <span className="font-semibold text-gray-900">coding programs</span>{' '}
                            to your students.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                            <Button
                                size="lg"
                                className="hero-btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-white"
                                style={{ background: BRAND.red }}
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Start Partnership
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="hero-btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 transition-all"
                                style={{ borderColor: BRAND.blue, color: BRAND.blue }}
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Learn More
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 sm:mt-16 pt-6 sm:pt-10 border-t border-gray-100">
                            <div className="stat-item text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1" style={{ color: BRAND.blue }}>
                                    {counters.schools}+
                                </div>
                                <div className="text-gray-500 text-xs sm:text-sm">Partner Schools</div>
                            </div>
                            <div className="stat-item text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1" style={{ color: BRAND.red }}>
                                    {counters.students >= 1000 ? `${Math.floor(counters.students / 1000)}K` : counters.students}+
                                </div>
                                <div className="text-gray-500 text-xs sm:text-sm">Students Trained</div>
                            </div>
                            <div className="stat-item text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1 text-gray-900">
                                    {counters.satisfaction}%
                                </div>
                                <div className="text-gray-500 text-xs sm:text-sm">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 rounded-full bg-gray-400 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section ref={benefitsRef} className="benefits-section py-12 sm:py-16 md:py-24 bg-gray-50 relative overflow-hidden">
                {/* Pulsating background shapes - hidden on mobile */}
                <div className="pulse-bg absolute top-10 left-[5%] w-48 sm:w-72 h-48 sm:h-72 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}30 0%, transparent 70%)` }} />
                <div className="pulse-bg absolute bottom-10 right-[5%] w-40 sm:w-56 h-40 sm:h-56 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.blue}30 0%, transparent 70%)`, animationDelay: '-2s' }} />
                <div className="pulse-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full border-2 opacity-10 sm:opacity-20 hidden sm:block"
                    style={{ borderColor: BRAND.blue }} />
                <div className="float-slow absolute top-20 right-[15%] w-16 h-16 blob hidden md:block"
                    style={{ background: `${BRAND.red}20` }} />
                <div className="float-slow-delay absolute bottom-20 left-[10%] w-20 h-20 blob hidden md:block"
                    style={{ background: `${BRAND.blue}20` }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="benefits-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ perspective: '1000px' }}>
                            {'Why Partner With Us?'.split('').map((char, i) => (
                                <span key={i} className="benefits-title-char inline-block" style={{ display: 'inline-block' }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </h2>
                        <p className="benefits-subtitle text-gray-600 max-w-xl mx-auto text-sm sm:text-base px-4">
                            Unlock opportunities that transform your institution and students
                        </p>
                    </div>

                    <div className="benefits-grid grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="benefit-card group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                                onMouseEnter={handleCardHover}
                                onMouseLeave={(e) => { handleCardLeave(e); handleCardMoveLeave(e); }}
                                onMouseMove={handleCardMove}
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div
                                        className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: `${benefit.color}15` }}
                                    >
                                        <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: benefit.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Schools Section */}
            <section ref={partnersRef} className="partners-section py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
                {/* Pulsating background shapes - hidden on mobile */}
                <div className="pulse-bg absolute top-20 right-[10%] w-56 sm:w-80 h-56 sm:h-80 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.blue}20 0%, transparent 70%)` }} />
                <div className="pulse-bg absolute bottom-20 left-[10%] w-48 sm:w-64 h-48 sm:h-64 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}20 0%, transparent 70%)`, animationDelay: '-2s' }} />
                <div className="pulse-ring absolute top-1/3 right-1/4 w-64 h-64 rounded-full border-2 opacity-10 hidden md:block"
                    style={{ borderColor: BRAND.red, animationDelay: '-1s' }} />
                <div className="float-slow absolute bottom-1/4 right-[20%] w-12 h-12 blob hidden lg:block"
                    style={{ background: `${BRAND.blue}25` }} />
                <div className="float-slow-delay absolute top-1/4 left-[20%] w-14 h-14 blob hidden lg:block"
                    style={{ background: `${BRAND.red}25` }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="partners-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ perspective: '1000px' }}>
                            {'Our Partner Schools'.split('').map((char, i) => (
                                <span key={i} className="partners-title-char inline-block" style={{ display: 'inline-block' }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </h2>
                        <p className="partners-subtitle text-gray-600 max-w-xl mx-auto text-sm sm:text-base px-4">
                            Join the growing community of schools pioneering STEM education
                        </p>
                    </div>

                    {isLoadingSchools ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : allSchools && allSchools.length > 0 ? (
                        <div className="partners-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allSchools.map((school: any) => (
                                <div
                                    key={school.id}
                                    className="partner-card group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-transparent"
                                    style={{ transformStyle: 'preserve-3d' }}
                                    onMouseEnter={handleCardHover}
                                    onMouseLeave={(e) => { handleCardLeave(e); handleCardMoveLeave(e); }}
                                    onMouseMove={handleCardMove}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                        style={{
                                            background: `linear-gradient(135deg, #0c3d7a08 0%, ${BRAND.red}08 50%, #1E88E505 100%)`, // Updated to use new blue colors
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderImage: `linear-gradient(135deg, #0c3d7a40, ${BRAND.red}40) 1` // Updated blue
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                                        style={{
                                            boxShadow: `inset 0 0 0 2px transparent`,
                                            background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #0c3d7a60, ${BRAND.red}60) border-box`, // Updated blue
                                            border: '2px solid transparent',
                                            borderRadius: '1rem'
                                        }}
                                    />

                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4">
                                            {/* Logo */}
                                            <div className="card-icon w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                                {school.logo_asset?.url ? (
                                                    <img
                                                        src={school.logo_asset.url}
                                                        alt={school.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <School className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-gray-800 transition-colors">
                                                    {school.name}
                                                </h3>
                                                {school.address && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND.red }} />
                                                        <span className="truncate">{school.address}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {school.description && (
                                            <p className="text-sm text-gray-600 mt-4 line-clamp-2 leading-relaxed">
                                                {school.description}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                            {school.website_url && (
                                                <a
                                                    href={school.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                                                    style={{ color: BRAND.blue }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Visit
                                                </a>
                                            )}
                                            {school.contact_email && (
                                                <a
                                                    href={`mailto:${school.contact_email}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    Email
                                                </a>
                                            )}
                                            {school.contact_number && (
                                                <a
                                                    href={`tel:${school.contact_number}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="partner-card max-w-md mx-auto text-center py-16 bg-gray-50 rounded-2xl">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                                style={{ background: `${BRAND.blue}15` }}>
                                <School className="w-8 h-8" style={{ color: BRAND.blue }} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Be Our First Partner</h3>
                            <p className="text-gray-600 mb-6">
                                Start the journey with us and become a pioneer in STEM education.
                            </p>
                            <Button
                                className="px-6 py-3 rounded-xl font-semibold text-white"
                                style={{ background: BRAND.red }}
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="cta-section py-12 sm:py-16 md:py-24 bg-gray-50 relative overflow-hidden">
                {/* Pulsating background shapes - hidden on mobile */}
                <div className="pulse-bg absolute top-10 left-[5%] w-40 sm:w-56 h-40 sm:h-56 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.blue}25 0%, transparent 70%)` }} />
                <div className="pulse-bg absolute bottom-10 right-[5%] w-48 sm:w-64 h-48 sm:h-64 rounded-full hidden sm:block"
                    style={{ background: `radial-gradient(circle, ${BRAND.red}25 0%, transparent 70%)`, animationDelay: '-2s' }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div
                        className="cta-box max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden text-white"
                        style={{ background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.red} 100%)` }}
                    >
                        {/* Pulsating decorative circles */}
                        <div className="pulse-bg absolute top-0 right-0 w-24 sm:w-40 h-24 sm:h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                        <div className="pulse-bg absolute bottom-0 left-0 w-20 sm:w-32 h-20 sm:h-32 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" style={{ animationDelay: '-2s' }} />

                        <div className="relative z-10 text-center">
                            <h2 className="cta-title text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ perspective: '1000px' }}>
                                {'Ready to Transform Your School?'.split('').map((char, i) => (
                                    <span key={i} className="cta-title-char inline-block" style={{ display: 'inline-block' }}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </h2>
                            <p className="cta-subtitle text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2">
                                Take the first step towards becoming a center of innovation. Our team is ready to help.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-10">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold bg-white hover:bg-gray-100 transition-all text-sm sm:text-base"
                                    style={{ color: BRAND.red }}
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    Contact Us
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all text-sm sm:text-base"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    Schedule Call
                                </Button>
                            </div>

                            {/* Contact info */}
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80">
                                <a href="mailto:partner@robolearning.com" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                    partner@robolearning.com
                                </a>
                                <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" />
                                    +1 (555) 123-4567
                                </a>
                                <a href="https://www.robolearning.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Globe className="w-4 h-4" />
                                    www.robolearning.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default BecomeOurPartnerSchool
