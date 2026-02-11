import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import {
    Bot,
    Cpu,
    BookOpen,
    Laptop,
    Zap,
    Rocket,
    Gamepad2,
    Settings,
    Battery,
    Brain,
    Wrench,
    Smartphone,
    Wifi
} from 'lucide-react';
import './StatsSection.css';

// Import Lottie JSON files
import happyBoyAnimation from '../../assets/images/Happy boy (1).json';
import girlStudyingAnimation from '../../assets/images/girl studying.json';
import astronautAnimation from '../../assets/images/Cute astronaut read book on planet cartoon.json';
import bookLoadingAnimation from '../../assets/images/Book loading (1).json';

interface StatItem {
    animation: object;
    endNumber: number;
    suffix: string;
    label: string;
}

const stats: StatItem[] = [
    {
        animation: happyBoyAnimation,
        endNumber: 10000,
        suffix: '+',
        label: 'Happy Kids Learning!'
    },
    {
        animation: bookLoadingAnimation,
        endNumber: 500,
        suffix: '+',
        label: 'Fun Activities!'
    },
    {
        animation: girlStudyingAnimation,
        endNumber: 95,
        suffix: '%',
        label: 'Kids Love It!'
    },
    {
        animation: astronautAnimation,
        endNumber: 50,
        suffix: '+',
        label: 'Awesome Teachers!'
    }
];

// Background animated icons for visual interest
const backgroundIcons = [
    { icon: Bot, x: '10%', y: '20%', size: 50, delay: 0 },
    { icon: Rocket, x: '85%', y: '15%', size: 55, delay: 1 },
    { icon: BookOpen, x: '15%', y: '70%', size: 48, delay: 2 },
    { icon: Laptop, x: '80%', y: '65%', size: 52, delay: 0.5 },
    { icon: Settings, x: '5%', y: '50%', size: 45, delay: 1.5 },
    { icon: Zap, x: '90%', y: '80%', size: 50, delay: 2.5 },
    { icon: Battery, x: '25%', y: '10%', size: 40, delay: 3 },
    { icon: Cpu, x: '88%', y: '35%', size: 48, delay: 0.3 },
    { icon: Gamepad2, x: '12%', y: '40%', size: 54, delay: 2.2 },
    { icon: Brain, x: '60%', y: '75%', size: 46, delay: 1.8 },
    { icon: Wrench, x: '35%', y: '25%', size: 42, delay: 1.1 },
    { icon: Smartphone, x: '65%', y: '20%', size: 48, delay: 2.7 },
    { icon: Wifi, x: '50%', y: '15%', size: 50, delay: 0.6 },
    { icon: Bot, x: '70%', y: '85%', size: 44, delay: 1.9 },
    { icon: Rocket, x: '30%', y: '60%', size: 50, delay: 2.4 },
    { icon: Cpu, x: '45%', y: '45%', size: 52, delay: 0.9 },
    { icon: Zap, x: '20%', y: '85%', size: 46, delay: 1.4 },
    { icon: Settings, x: '75%', y: '50%', size: 44, delay: 0.2 },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnView) {
            animateCount();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    animateCount();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, hasStarted]);

    const animateCount = () => {
        const startTime = performance.now();
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };

    return { count, ref };
}

// Format number with commas
function formatNumber(num: number): string {
    return num.toLocaleString();
}

// Single stat card component
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
    const { count, ref } = useCountUp(stat.endNumber, 2500);

    return (
        <div
            className="stat-card"
            ref={ref}
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            <div className="stat-icon-lottie">
                <Lottie
                    animationData={stat.animation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div className="stat-number">
                <span className="number-value">{formatNumber(count)}</span>
                <span className="number-suffix">{stat.suffix}</span>
            </div>
            <div className="stat-label">
                {stat.label}
            </div>
        </div>
    );
}

function StatsSection() {
    return (
        <section className="stats-section">
            {/* Wave Curve SVG */}
            <div className="stats-wave">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,60 C360,100 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,100 L0,100 Z"
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
                                opacity: 0.15,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [-15, 15, -15],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: "easeInOut"
                            }}
                        >
                            <IconComponent size={item.size} strokeWidth={1.5} />
                        </motion.div>
                    );
                })}
            </div>

            <div className="stats-container">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} index={index} />
                ))}
            </div>
        </section >
    );
}

export default StatsSection;
