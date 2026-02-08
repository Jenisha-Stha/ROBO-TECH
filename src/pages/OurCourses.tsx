import React, { CSSProperties } from 'react';
import { motion, MotionStyle, HTMLMotionProps } from 'framer-motion';
import FrontCourses from '@/components/FrontCourses';
import Header from '../components/layout/header';
import Footer from '@/components/layout/footer';
import {
  Bot,
  Cpu,
  BookOpen,
  Laptop,
  Zap,
  Rocket,
  Gamepad2,
  Wifi,
  Settings,
  Battery,
  Plug,
  Radio,
  Brain,
  Wrench,
  Smartphone,
  Search,
  Ruler,
  Telescope,
  Microscope,
  Lightbulb
} from 'lucide-react';

// 1. Define specific types for your style objects to satisfy TypeScript
interface PageStyles {
  heroContainer: CSSProperties;
  textWrapper: MotionStyle;
  imageWrapper: MotionStyle;
  shinchanContainer: CSSProperties;
  shinchanImage: CSSProperties;
  bunnyWrapper: CSSProperties;
}

const HomePage: React.FC = () => {

  // 2. Define the animation with specific types
  // Casting 'reverse' and 'easeInOut' as specific literals
  const floatingAnimation: HTMLMotionProps<"div">["animate"] = {
    y: ["-12px", "12px"],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  };

  // 3. Define the Kunchevsky-style animated background elements with Lucide icons
  const backgroundIcons = [
    { icon: Bot, x: '10%', y: '20%', size: 60, delay: 0 },
    { icon: Rocket, x: '85%', y: '15%', size: 60, delay: 1 },
    { icon: BookOpen, x: '15%', y: '70%', size: 60, delay: 2 },
    { icon: Laptop, x: '80%', y: '65%', size: 60, delay: 0.5 },
    { icon: Settings, x: '5%', y: '50%', size: 60, delay: 1.5 },
    { icon: Zap, x: '90%', y: '80%', size: 60, delay: 2.5 },
    { icon: Battery, x: '25%', y: '10%', size: 30, delay: 3 },
    { icon: Plug, x: '70%', y: '5%', size: 60, delay: 1.2 },
    { icon: Radio, x: '40%', y: '85%', size: 28, delay: 0.8 },
    { icon: Brain, x: '60%', y: '75%', size: 50, delay: 1.8 },
    { icon: Gamepad2, x: '12%', y: '40%', size: 66, delay: 2.2 },
    { icon: Cpu, x: '88%', y: '35%', size: 60, delay: 0.3 },
    { icon: Wrench, x: '35%', y: '25%', size: 20, delay: 1.1 },
    { icon: Smartphone, x: '65%', y: '20%', size: 60, delay: 2.7 },
    { icon: Wifi, x: '50%', y: '15%', size: 60, delay: 0.6 },
    { icon: Search, x: '30%', y: '60%', size: 60, delay: 1.9 },
    { icon: Ruler, x: '70%', y: '60%', size: 18, delay: 2.4 },
    { icon: Telescope, x: '45%', y: '45%', size: 60, delay: 0.9 },
    { icon: Microscope, x: '55%', y: '55%', size: 60, delay: 1.4 },
    { icon: Lightbulb, x: '20%', y: '30%', size: 50, delay: 0.2 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <Header />

      {/* Hero Section with Kunchevsky-style Animated Pattern */}
      <div style={styles.heroContainer}>
        {/* Background Animated Pattern */}
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
                  opacity: 0.15, // Subtle white icons
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

        <style>{`
          @keyframes wave {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-10deg) translateY(-5px); }
            50% { transform: rotate(0deg) translateY(0); }
            75% { transform: rotate(10deg) translateY(-5px); }
          }
          .shinchan-wrapper {
            position: relative;
            width: 100%;
            max-width: 450px;
            z-index: 10;
          }
          .hand-wave {
            position: absolute;
            width: 18%;
            height: 18%;
            top: 48%;
            right: 28%;
            background: transparent;
            animation: wave 2s ease-in-out infinite;
            transform-origin: bottom center;
            z-index: 5;
            pointer-events: none;
          }
        `}</style>

        {/* Brand Quote - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={styles.textWrapper}
        >
          <h1 className="oswald text-white text-5xl lg:text-7xl leading-[1.1] mb-6 drop-shadow-lg">
            From Curiosity to<br />
            <span style={{ color: '#E31E24' }}>Cool Robots.</span>
          </h1>
          <p className="text-white/90 text-2xl lg:text-3xl font-bold tracking-tight">
            Learn. Create. <span className="oswald italic" style={{ color: '#E31E24' }}>Shine.</span>
          </p>
        </motion.div>

        {/* Animated Mascots - Right Side */}
        <motion.div
          animate={floatingAnimation}
          style={styles.imageWrapper}
        >
          {/* Shinchan Mascot Only */}
          <div style={styles.shinchanContainer}>
            <div className="shinchan-wrapper">
              <motion.img
                src="/images/shinchan_red_1.webp"
                alt="Shinchan learning with laptop"
                style={styles.shinchanImage}
                animate={{
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <div className="hand-wave"></div>
            </div>
          </div>
        </motion.div>

        {/* Centered Bunny Mascot - Perfectly Isolated White Bunny */}
        <motion.div
          style={{
            position: 'absolute',
            left: '35%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            width: '450px',
          }}
          animate={{
            y: ["-20px", "20px"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div
            className="relative overflow-hidden rounded-full"
            style={{
              width: '100%',
              aspectRatio: '1/1',
              background: 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)', // Logo Blue Gradient
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 68%)',
              maskImage: 'radial-gradient(circle, black 35%, transparent 68%)',
            }}
          >
            <img
              src="https://cdn.svgator.com/images/2024/02/claymorphic-animated-bunny.gif"
              alt="Animated Bunny Mascot"
              className="w-[140%] max-w-none transform scale-125 translate-y-[-5%]"
              style={{
                filter: 'hue-rotate(200deg) brightness(0.55) saturate(1.2) contrast(1.1)',
                mixBlendMode: 'normal',
              }}
            />
          </div>
        </motion.div>
      </div>

      <section className="bg-white py-20">
        <FrontCourses headerSearchTerm={""} />
      </section>

      <Footer />
    </div >
  );
};

// 3. Apply the types to the styles object
const styles: PageStyles = {
  heroContainer: {
    background: 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)',
    padding: '80px 8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '600px',
    gap: '40px',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '600px',
    width: '100%',
    zIndex: 20,
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '450px',
    width: '100%',
    zIndex: 20,
  },
  shinchanContainer: {
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shinchanImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '30px',
    filter: 'drop-shadow(0 10px 30px rgba(255, 0, 0, 0.3))',
  },
  bunnyWrapper: {
    width: '280px',
    zIndex: 25,
  },
};

export default HomePage;