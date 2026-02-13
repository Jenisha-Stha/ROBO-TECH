import React, { CSSProperties } from 'react';
import { motion, MotionStyle, HTMLMotionProps } from 'framer-motion';
import FrontCourses from '@/components/FrontCourses';
import Header from '../components/layout/header';
import TextType from '@/components/TextType';
import Footer from '@/components/layout/footer';
import { useNavigate } from 'react-router';
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
  Lightbulb,
  ArrowRight
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
  const navigate = useNavigate();

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
      <div className="relative overflow-hidden flex flex-col lg:flex-row items-center justify-between min-h-[95vh] px-6 lg:px-[8%] pt-32 pb-40 lg:py-[120px]"
        style={{ background: 'linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)' }}>
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
          .hero-wave {
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            overflow: hidden;
            line-height: 0;
            z-index: 5;
          }
          .hero-wave svg {
            position: relative;
            display: block;
            width: calc(100% + 1.3px);
            height: 150px;
          }
          .hero-wave .shape-fill {
            fill: #FFFFFF;
          }
          @media (max-width: 1024px) {
            .hero-wave svg { height: 120px; }
          }
          @media (max-width: 768px) {
            .hero-wave svg { height: 100px; }
          }
          @media (max-width: 480px) {
            .hero-wave svg { height: 80px; }
          }
        `}</style>

        {/* Brand Quote - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-16 lg:mb-0 max-w-[600px] lg:-translate-y-28"
        >
          <TextType
            text={[
              "From Curiosity to Cool Robots",
              "Learn. Create. Shine.",
              "Building Future Innovators",
            ]}
            as="h1"
            typingSpeed={75}
            pauseDuration={1500}
            deletingSpeed={50}
            showCursor
            cursorCharacter="_"
            cursorBlinkDuration={0.5}
            className="oswald text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 drop-shadow-lg font-bold"
            textColors={["#ffffff", "#ffffff", "#ffffff"]}
            loop
          />
        </motion.div>

        <motion.div
          animate={floatingAnimation}
          className="absolute -right-20 lg:right-[2%] -top-10 lg:top-[4%] w-[450px] md:w-[600px] lg:w-[750px] z-30 pointer-events-none lg:pointer-events-auto"
        >

          <div
            className="relative overflow-hidden rounded-full opacity-100"
            style={{
              width: '100%',
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 72%)',
              maskImage: 'radial-gradient(circle, black 50%, transparent 72%)',
            }}
          >
            <div className="shinchan-wrapper scale-110 translate-y-[-5%]">
              <motion.img
                src="/images/shinchan_red_1.webp"
                alt="Shinchan Mascot"
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



        {/* Centered Bunny Mascot - Hidden or smaller on mobile */}
        <motion.div
          className="absolute left-[85%] lg:left-[35%] top-[85%] lg:top-[32%] -translate-x-1/2 -translate-y-1/2 w-[180px] md:w-[350px] lg:w-[450px] z-15 pointer-events-none opacity-30 lg:opacity-100"
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
            className="relative overflow-hidden rounded-full opacity-50 lg:opacity-100"
            style={{
              width: '100%',
              aspectRatio: '1/1',
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

        {/* Sync Wave Curve SVG from Home Page */}
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
      </div>

      <section className="px-6 py-24 text-slate-900 container mx-auto">



        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-12">
          {/* Left Side: PROGRAMS Text */}
          <div className="w-full md:w-[45%] text-slate-900 md:translate-y-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1b3664] mb-6 font-oswald uppercase leading-tight">PROGRAMS</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Our carefully structured programs introduce students to robotics, artificial intelligence, drones, and modern technology in a safe and engaging way. Through project-based learning and guided mentorship, children not only understand technology — they learn how to create with it.
            </p>
            <button className="btn btn-primary font-oswald" onClick={() => navigate('/register')}>
              Register Now <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Right Side: Mascot Video */}
          <motion.div
            animate={floatingAnimation}
            style={{ ...styles.imageWrapper, maxWidth: '800px' }}
            className="w-full md:w-[60%] flex justify-center md:justify-end relative md:-translate-y-12"
          >
            {/* Thought Bubble - Responsive sizing and position */}
            <div className="absolute -top-16 -right-2 lg:-top-20 lg:-right-10 z-35 w-[110px] md:w-[160px] lg:w-[200px] pointer-events-none">
              <div className="relative flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-auto drop-shadow-xl transform scale-x-[-1]"
                >
                  {/* Flipped clean, symmetrical hand-drawn style cloud */}
                  <path
                    d="M50,70 C50,50 80,40 100,40 C120,40 140,45 155,60 C175,55 190,70 185,95 C195,120 180,145 155,150 C145,170 120,175 100,170 C80,175 55,170 45,150 C20,145 5,120 15,95 C10,70 25,55 50,70 Z"
                    fill="white"
                    stroke="#1b3664"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  {/* Flipped connector bubbles */}
                  <circle cx="145" cy="170" r="10" fill="white" stroke="#1b3664" strokeWidth="3" />
                  <circle cx="165" cy="185" r="6" fill="white" stroke="#1b3664" strokeWidth="2" />
                </svg>
                {/* Perfectly centered text overlay */}
                <div className="absolute inset-0 flex items-center justify-center pt-2">
                  <span className="text-[#1b3664] oswald font-black text-center text-sm md:text-lg lg:text-xl leading-[1.0] uppercase tracking-tighter">
                    hello,<br />future<br />innovator!
                  </span>
                </div>
              </div>
            </div>

            <div style={{ ...styles.shinchanContainer, maxWidth: '800px' }}>
              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                  maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                }}
              >
                <video
                  src="/images/WhatsApp Video 2026-02-05 at 21.10.46.mp4"
                  className="w-[140%] max-w-none transform scale-[1.5] object-cover pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white">
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
    padding: '120px 8% 160px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '800px',
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
    maxWidth: '650px',
    width: '100%',
    zIndex: 20,
  },
  shinchanContainer: {
    width: '100%',
    maxWidth: '650px',
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