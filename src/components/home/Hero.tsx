import './Hero.css';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
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
    Wifi,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import robotRiv from '../../assets/rive/16660-31346-robot.riv';
import { useNavigate } from 'react-router';
import TextType from '@/components/TextType';

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

const Hero = () => {
    const navigate = useNavigate();
    const { rive, RiveComponent } = useRive({
        src: robotRiv,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        onLoad: () => {
            // Log available animations and state machines for debugging
            if (rive) {
                console.log('Rive contents:', rive.contents);
                // Play all animations
                rive.play();
            }
        }
    });

    return (
        <section className="hero">
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

            <div className="hero-container">
                <div className="hero-content">

                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ y: 80 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <TextType
                                text={[
                                    "Welcome to ROBO-TECH Learning Centre",
                                    "Learn Robotics the Fun Way",
                                    "Build Tomorrow's Leaders Today",
                                    "Where Tech Meets Creativity"
                                ]}
                                as="h1"
                                typingSpeed={75}
                                pauseDuration={1500}
                                deletingSpeed={50}
                                showCursor
                                cursorCharacter="_"
                                cursorBlinkDuration={0.5}
                                className="hero-title font-oswald text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
                                textColors={["#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
                                loop
                            />
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="hero-subtitle font-oswald text-lg md:text-xl text-blue-100/80 mb-10"
                    >
                        where learning robotics is fun, exciting, and full of cool adventures!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="hero-buttons"
                    >
                        <button className="btn btn-primary font-oswald" onClick={() => navigate('/login')}>
                            LogIn <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                        <button className="btn btn-outline font-oswald" onClick={() => navigate('/register')}>
                            Register Now <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </motion.div>
                </div>
                <div className="hero-image">
                    <div className="hero-rive-container">
                        <RiveComponent />
                    </div>
                </div>
            </div>

            {/* Wave Curve SVG */}
            <div className="hero-wave">
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
};

export default Hero;

