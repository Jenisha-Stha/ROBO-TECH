import React, { useRef, Suspense } from "react";
import Header from "../components/layout/header";
import {
  BookOpen,
  Users,
  Award,
  Zap,
  ArrowRight,
  Target,
  Eye,
  Lightbulb,
  Cpu,
  GraduationCap,
  Rocket,
  Settings,
  CheckCircle2,
  Sparkles,
  Bot,
  Star,
  Trophy,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberSlider } from "@/components/ui/team-member-slider";
import { TestimonialSlider } from "@/components/ui/testimonal-slider";
import { Link } from "react-router";
import Footer from "@/components/layout/footer";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import TextType from "@/components/TextType";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const RobotPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Bot className="w-16 h-16 text-white/40" />
    </motion.div>
  </div>
);

/* ──────────────────────────────────────────
   DECORATIVE COMPONENTS
   ────────────────────────────────────────── */

const GeoShape = ({
  size,
  color,
  shape,
  style,
  duration = 6,
  delay = 0,
}: {
  size: number;
  color: string;
  shape: "circle" | "ring" | "square" | "dot";
  style: React.CSSProperties;
  duration?: number;
  delay?: number;
}) => {
  const shapeContent = () => {
    switch (shape) {
      case "circle":
      case "dot":
        return <div className={`w-full h-full rounded-full ${color}`} />;
      case "ring":
        return (
          <div className={`w-full h-full rounded-full border-2 ${color}`} />
        );
      case "square":
        return (
          <div className={`w-full h-full rounded-lg ${color} rotate-45`} />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, ...style }}
      animate={{
        y: [0, -12, 4, -8, 0],
        x: [0, 5, -3, 6, 0],
        rotate: shape === "square" ? [45, 55, 40, 50, 45] : [0, 8, -5, 3, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {shapeContent()}
    </motion.div>
  );
};

// Shared viewport config
const vp = { once: true, margin: "-80px" };

/* ──────────────────────────────────────────
   TRAIN / GAMIFICATION HELPERS
   ────────────────────────────────────────── */

const StationBadge = ({
  number,
  label,
  colorFrom,
  colorTo = "blue",
  icon,
  light,
}: {
  number?: number;
  label: string;
  colorFrom?: string;
  colorTo?: string;
  icon?: React.ReactNode;
  light?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 80 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={vp}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center justify-center gap-2 mb-6"
  >
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${
        colorFrom || (light ? "from-blue-500/10" : "from-cyan-500/15")
      } ${colorTo ? `to-${colorTo}-500/15` : "to-blue-500/15"} border ${
        light ? "border-blue-400/25" : "border-cyan-400/20"
      } backdrop-blur-sm`}
    >
      {icon ? (
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          {icon}
        </span>
      ) : (
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
          {number}
        </span>
      )}
      <span
        className={`${
          light ? "text-blue-600/80" : "text-cyan-300/80"
        } text-xs font-semibold tracking-wide uppercase`}
      >
        {label}
      </span>
    </span>
  </motion.div>
);

const TrainConnector = ({ light }: { light?: boolean } = {}) => (
  <div className="relative z-20 flex flex-col items-center -my-2 py-2">
    <div
      className={`w-0.5 h-6 bg-gradient-to-b ${
        light
          ? "from-blue-400/30 to-blue-500/30"
          : "from-cyan-500/40 to-blue-500/40"
      } rounded-full`}
    />
    <motion.div
      className={`w-3 h-3 rounded-full ${
        light
          ? "bg-blue-400/50 border-2 border-blue-300/30"
          : "bg-cyan-400/60 border-2 border-cyan-300/30"
      } my-1`}
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <div
      className={`w-0.5 h-6 bg-gradient-to-b ${
        light
          ? "from-blue-500/30 to-blue-400/30"
          : "from-blue-500/40 to-cyan-500/40"
      } rounded-full`}
    />
  </div>
);

/* ──────────────────────────────────────────
   SPIRAL CARD (scroll-driven per-card wrapper)
   ────────────────────────────────────────── */

const spiralScattered = [
  { x: -320, y: -180, rotate: -18, scale: 0.75 },
  { x: 280, y: -140, rotate: 22, scale: 0.7 },
  { x: -180, y: 60, rotate: 14, scale: 0.8 },
  { x: 350, y: 30, rotate: -25, scale: 0.65 },
  { x: -60, y: 200, rotate: -12, scale: 0.78 },
  { x: 200, y: 180, rotate: 18, scale: 0.72 },
  { x: 40, y: -220, rotate: -8, scale: 0.68 },
];

const SpiralCard = ({
  scrollYProgress,
  index,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  children: React.ReactNode;
}) => {
  const pos = spiralScattered[index] || spiralScattered[0];
  const stagger = index * 0.04;
  const startAt = 0.1 + stagger;
  const endAt = 0.5 + stagger;

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const xRaw = useTransform(scrollYProgress, [startAt, endAt], [pos.x, 0]);
  const x = useSpring(xRaw, springConfig);
  const yRaw = useTransform(scrollYProgress, [startAt, endAt], [pos.y, 0]);
  const y = useSpring(yRaw, springConfig);
  const rotateRaw = useTransform(
    scrollYProgress,
    [startAt, endAt],
    [pos.rotate, 0],
  );
  const rotate = useSpring(rotateRaw, springConfig);
  const scaleRaw = useTransform(
    scrollYProgress,
    [startAt, endAt],
    [pos.scale, 1],
  );
  const scale = useSpring(scaleRaw, springConfig);
  const opacityRaw = useTransform(
    scrollYProgress,
    [startAt, startAt + 0.12],
    [0, 1],
  );
  const opacity = useSpring(opacityRaw, springConfig);

  return (
    <motion.div style={{ x, y, rotate, scale, opacity, zIndex: 7 - index }}>
      {children}
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   TESTIMONIALS
   ────────────────────────────────────────── */

const TestimonialsSection = () => {
  const testimonials = [
    {
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&q=80",
      quote:
        "Robotech lessons turned curiosity into confidence. The projects feel real and exciting.",
      name: "manish basnet",
      role: "CEO",
    },
    {
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80",
      quote:
        "Coding feels like solving puzzles with friends. I love building things now.",
      name: "ramesh sir",
      role: "developer",
    },
    {
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&q=80",
      quote:
        "Coding feels like solving puzzles with friends. I love building things now.",
      name: "manish basnet",
      role: "CEO",
    },
    {
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=128&h=128&fit=crop&q=80",
      quote:
        "Coding feels like solving puzzles with friends. I love building things now.",
      name: "manish basnet",
      role: "CEO",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-blue-500/30 to-transparent" />
      <div className="absolute -top-24 right-[-4%] w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-[-6%] w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.5 }}
            className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-oswald"
          >
            Learners and Parents Love the Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Real voices from our classrooms and communities, styled to match the
            Robotech blue theme.
          </motion.p>
        </div>

        <div className="rounded-2xl border border-blue-100/40 bg-white/95 shadow-xl shadow-blue-200/50 px-4 py-10">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────── */

const AboutUs = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Future-ready skills",
      description: "Coding, Robotics, ICT, AI & digital literacy",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Hands-on, project-based learning",
      description: "Builds creativity and problem-solving skills.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Trusted by schools & colleges",
      description: "Structured, curriculum-aligned programs.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Instructors",
      description: "Trained in STEM education and real-world technologies.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Complete Learning Ecosystem",
      description: "Labs, workshops, teacher training & competitions. ",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Proven results",
      description:
        "Students develop confidence, innovation skills, and strong tech foundations. ",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Flexible learning modes ",
      description:
        "Individuals and institutions (online + in-school programs).",
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  const highlights = [
    "Industry-recognized certifications",
    "Hands-on project-based learning",
    "Expert mentorship and support",
    "Gamified, fun learning experience",
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] relative scroll-smooth">
      <Header />

      {/* ═══════════════════════════════════════
                HERO SECTION
               ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0c3d7a 0%, #1565C0 30%, #1E88E5 60%, #42A5F5 100%)",
        }}
      >
        {/* Parallax background layer */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-indigo-400/8 rounded-full blur-2xl" />
        </motion.div>

        {/* Geometric decorations */}
        <GeoShape
          size={14}
          color="bg-white/20"
          shape="circle"
          style={{ top: "15%", left: "8%" }}
          duration={5}
        />
        <GeoShape
          size={10}
          color="bg-yellow-400/30"
          shape="dot"
          style={{ top: "25%", right: "12%" }}
          duration={7}
          delay={1}
        />
        <GeoShape
          size={18}
          color="border-white/15"
          shape="ring"
          style={{ bottom: "30%", left: "15%" }}
          duration={8}
          delay={0.5}
        />
        <GeoShape
          size={12}
          color="bg-cyan-300/20"
          shape="square"
          style={{ top: "20%", right: "25%" }}
          duration={6}
          delay={2}
        />
        <GeoShape
          size={8}
          color="bg-white/15"
          shape="dot"
          style={{ bottom: "25%", right: "8%" }}
          duration={4}
          delay={1.5}
        />
        <GeoShape
          size={20}
          color="border-white/10"
          shape="ring"
          style={{ top: "60%", left: "35%" }}
          duration={9}
          delay={3}
        />
        <GeoShape
          size={6}
          color="bg-yellow-300/25"
          shape="circle"
          style={{ top: "40%", left: "45%" }}
          duration={5}
          delay={0.8}
        />
        <GeoShape
          size={16}
          color="bg-white/8"
          shape="square"
          style={{ bottom: "20%", right: "35%" }}
          duration={7}
          delay={2.5}
        />

        {/* Twinkling sparkle stars */}
        <motion.div
          className="absolute top-[30%] left-[12%] z-10 text-yellow-300/50"
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="absolute top-[18%] right-[18%] z-10 text-yellow-300/50"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.6,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="container mx-auto px-4 relative z-10"
          style={{ opacity: heroOpacity }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left column — text content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-red-600" />
                {/* <span className="text-white/90 text-sm font-medium tracking-wide">Inspiring Future Innovators</span> */}
              </motion.div>

              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 80 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <TextType
                    text={[
                      "About RoboTech Learning Center",
                      "Inspiring Future Innovators",
                      "Build Tomorrow's Leaders",
                      "Learn. Code. Innovate.",
                    ]}
                    as="h1"
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    showCursor
                    cursorCharacter="_"
                    cursorBlinkDuration={0.5}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-oswald leading-[1.1]"
                    textColors={["#ffffff", "#ffffff", "#fbbf24", "#b01a1a"]}
                    loop
                  />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-blue-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Join hundreds of schools already exploring the universe of
                robotics education!
              </motion.p>

              {/* Start Your Journey badge */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {/* <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm"> */}
                {/* <Rocket className="w-4 h-4 text-yellow-300" />
                                    <span className="text-white/80 text-xs font-semibold tracking-wide">Start Your Journey</span>
                                    <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                                </span> */}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  className="w-6 h-10 rounded-full border-2 border-white/30 mx-auto lg:mx-0 flex justify-center"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
                    animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Right column — 3D Spline Robot */}
            <div className="hidden lg:flex items-center justify-center overflow-hidden relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.15 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="w-full relative"
                style={{
                  height: 620,
                  marginBottom: -60,
                  filter:
                    "brightness(1.5) sepia(0.5) hue-rotate(185deg) saturate(2.5) contrast(1.1)",
                }}
              >
                <Suspense fallback={<RobotPlaceholder />}>
                  <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
                </Suspense>
              </motion.div>
              {/* Blue tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Curved bottom edge */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="w-full h-20 md:h-28"
          >
            <path
              d="M0,40 C480,100 960,0 1440,60 L1440,100 L0,100 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
                WHO WE ARE SECTION
               ═══════════════════════════════════════ */}
      <WhoWeAreSection highlights={highlights} />
      <div className="bg-slate-50">
        <TrainConnector />
      </div>

      {/* ═══════════════════════════════════════
                MISSION & VISION SECTION
               ═══════════════════════════════════════ */}
      <MissionVisionSection />
      <div className="bg-slate-50">
        <TrainConnector />
      </div>

      {/* ═══════════════════════════════════════
                FEATURES SECTION
               ═══════════════════════════════════════ */}
      <FeaturesSection features={features} />
      <div className="bg-slate-50">
        <TrainConnector />
      </div>

      {/* ═══════════════════════════════════════
            TESTIMONIALS SECTION
           ═══════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════
            TEAM SECTION
           ═══════════════════════════════════════ */}
      <TeamSection />
      <div className="bg-slate-50">
        <TrainConnector />
      </div>

      {/* ═══════════════════════════════════════
                CTA SECTION
               ═══════════════════════════════════════ */}
      <CTASection />

      <Footer />
    </div>
  );
};

/* ──────────────────────────────────────────
   WHO WE ARE
   ────────────────────────────────────────── */

const WhoWeAreSection = ({ highlights }: { highlights: string[] }) => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-blue-500/30 to-transparent" />

      {/* Floating Bot icon */}
      <motion.div
        className="absolute top-16 right-8 md:right-16 z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 opacity-50">
          <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </motion.div>

      {/* Twinkling sparkle stars */}
      <motion.div
        className="absolute top-[15%] left-[5%] z-10 text-blue-400/30"
        animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[10%] z-10 text-blue-400/30"
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.9, 0.3] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          delay: 0.7,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </motion.div>
      <motion.div
        className="absolute top-[50%] left-[45%] z-10 text-blue-400/20"
        animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.2, 0.7, 0.2] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1.2,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-3 h-3" />
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Station Badge */}
        {/* <StationBadge number={1} label="Discovery" light /> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <span className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-oswald leading-tight">
                Building Tomorrow's{" "}
                <span className="text-blue-600">Innovators</span> Today
              </h2>
            </div>

            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Founded in 2025, Robotech Learning Center is an innovative
              e-learning platform designed to empower students with the skills
              of the future. We offer engaging and interactive courses in
              robotics, coding, ICT, and a wide range of ECA programs that
              inspire creativity, curiosity, and confidence.
            </p>

            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              At Robotech Learning Center, our mission is to make quality STEM
              and skill-based education accessible, fun, and meaningful for
              every learner. Through gamified lessons, hands-on projects, and
              real-world problem-solving, we help students unlock their
              potential and step into the world of technology with excitement
              and readiness.
            </p>

            {/* Highlight checklist */}
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={vp}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Innovation Card — train-car entrance from right */}
          <motion.div
            initial={{ opacity: 0, x: 200, rotate: 4, scale: 0.92 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ perspective: 800 }}
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 opacity-50 blur-sm"
              animate={{
                background: [
                  "linear-gradient(0deg, #3b82f6, #22d3ee, #3b82f6)",
                  "linear-gradient(120deg, #3b82f6, #22d3ee, #3b82f6)",
                  "linear-gradient(240deg, #3b82f6, #22d3ee, #3b82f6)",
                  "linear-gradient(360deg, #3b82f6, #22d3ee, #3b82f6)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative rounded-2xl p-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl overflow-hidden">
              {/* Inner pattern */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <div className="text-center relative z-10">
                {/* Innovation Station badge */}
                {/* <div className="flex justify-center mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-400/25 text-yellow-600 text-xs font-semibold">
                                        <Zap className="w-3 h-3" />
                                        Innovation Station
                                    </span>
                                </div> */}
                {/* <motion.div
                                    className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-500/25"
                                    animate={{ rotate: [0, 3, -3, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Zap className="w-10 h-10 text-white" />
                                </motion.div> */}
                <h3 className="text-2xl font-bold mb-4 text-white font-oswald">
                  Innovation in Education
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  We use the coolest educational technologies and super fun
                  methodologies to deliver the most amazing learning experience
                  ever!
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                  {[
                    { num: "500+", label: "Students" },
                    { num: "50+", label: "Courses" },
                    { num: "95%", label: "Happy Learners" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={vp}
                      transition={{
                        duration: 0.5,
                        delay: 0.6 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="text-2xl font-bold text-yellow-300 font-oswald">
                        {stat.num}
                      </div>
                      <div className="text-xs text-blue-200 mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────
   MISSION & VISION
   ────────────────────────────────────────── */

const MissionVisionSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Mission card (leads): slides in during 10-45% of scroll
  const missionX = useTransform(scrollYProgress, [0.1, 0.45], ["100vw", "0vw"]);
  const missionOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const missionRotate = useTransform(scrollYProgress, [0.1, 0.45], [8, 0]);

  // Vision card (follows): slides in during 20-55% of scroll
  const visionX = useTransform(scrollYProgress, [0.2, 0.55], ["120vw", "0vw"]);
  const visionOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const visionRotate = useTransform(scrollYProgress, [0.2, 0.55], [-8, 0]);

  // Achievement banner fades in after both cards arrive
  const bannerOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const bannerY = useTransform(scrollYProgress, [0.55, 0.65], [30, 0]);

  // Sparkle star configs
  const sparkleStars = [
    { top: "12%", left: "6%", delay: 0 },
    { top: "8%", right: "15%", delay: 0.8 },
    { bottom: "20%", right: "6%", delay: 1.6 },
    { bottom: "12%", left: "12%", delay: 2.4 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-50"
      style={{ height: "180vh" }}
    >
      <section
        className="sticky top-0 relative overflow-hidden bg-slate-50"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Top curve */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20 block flex-shrink-0"
        >
          <path
            d="M0,80 C360,10 1080,70 1440,20 L1440,80 L0,80 Z"
            fill="#1565C0"
          />
        </svg>

        <div
          className="py-20 relative overflow-hidden flex-1 flex items-center"
          style={{
            background:
              "linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)",
          }}
        >
          {/* Subtle accent shapes */}
          <GeoShape
            size={16}
            color="border-white/8"
            shape="ring"
            style={{ top: "10%", right: "8%" }}
            duration={10}
          />
          <GeoShape
            size={10}
            color="bg-white/5"
            shape="circle"
            style={{ bottom: "15%", left: "5%" }}
            duration={7}
            delay={2}
          />
          <GeoShape
            size={8}
            color="bg-cyan-400/10"
            shape="dot"
            style={{ top: "50%", left: "20%" }}
            duration={5}
            delay={1}
          />

          {/* Floating Robot Icon (top-right) */}
          <motion.div
            className="absolute top-8 right-8 md:top-12 md:right-12 z-20"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </motion.div>

          {/* Twinkling Sparkle Stars */}
          {sparkleStars.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute z-10 text-yellow-300/60"
              style={pos}
              animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: pos.delay,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          ))}

          {/* Floating Particle Dots */}
          <GeoShape
            size={4}
            color="bg-cyan-400/30"
            shape="dot"
            style={{ top: "25%", right: "20%" }}
            duration={4}
            delay={0.5}
          />
          <GeoShape
            size={3}
            color="bg-yellow-400/30"
            shape="dot"
            style={{ top: "60%", left: "8%" }}
            duration={6}
            delay={1}
          />
          <GeoShape
            size={5}
            color="bg-purple-400/30"
            shape="dot"
            style={{ bottom: "30%", right: "12%" }}
            duration={5}
            delay={2}
          />
          <GeoShape
            size={3}
            color="bg-cyan-300/25"
            shape="dot"
            style={{ top: "15%", left: "30%" }}
            duration={7}
            delay={0}
          />
          <GeoShape
            size={4}
            color="bg-yellow-300/25"
            shape="dot"
            style={{ bottom: "18%", left: "25%" }}
            duration={4.5}
            delay={1.5}
          />

          <div className="container mx-auto px-4 relative z-10">
            {/* Station Badge */}
            {/* <StationBadge number={2} label="Mission Control" /> */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-oswald">
                What Drives Us
              </h2>
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="h-0.5 bg-yellow-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  viewport={vp}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
                <motion.div
                  className="h-0.5 bg-yellow-400/50 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 12 }}
                  viewport={vp}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Mission */}
              <motion.div
                style={{
                  x: missionX,
                  opacity: missionOpacity,
                  rotate: missionRotate,
                }}
              >
                <motion.div
                  whileHover={{ y: -8, rotateZ: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full bg-red-600 backdrop-blur-md border border-red-400/20 shadow-2xl shadow-red-900/30 group hover:bg-red-600/30 transition-all duration-500">
                    <CardHeader className="pb-3">
                      {/* Achievement Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-300 text-xs font-semibold">
                          <Rocket className="w-3.5 h-3.5" />
                          Level 1: Mission
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20"
                          initial={{ scale: 0, rotate: -90 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={vp}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 12,
                            delay: 0.3,
                          }}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <Target className="w-7 h-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-white font-oswald">
                          Our Mission
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-100/70 text-lg leading-relaxed">
                        Empower students through super fun project-based
                        learning in robotics and technology! We make learning
                        robots the most exciting adventure ever!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Vision */}
              <motion.div
                style={{
                  x: visionX,
                  opacity: visionOpacity,
                  rotate: visionRotate,
                }}
              >
                <motion.div
                  whileHover={{ y: -8, rotateZ: -1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full bg-slate-50 backdrop-blur-md border border-blue-400/20 shadow-2xl shadow-blue-900/30 group hover:bg-slate-200 transition-all duration-500">
                    <CardHeader className="pb-3">
                      {/* Achievement Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-800 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5" />
                          Level 2: Vision
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                          initial={{ scale: 0, rotate: 90 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={vp}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 12,
                            delay: 0.45,
                          }}
                          whileHover={{ rotate: -10, scale: 1.1 }}
                        >
                          <Eye className="w-7 h-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-[#2664eb] font-oswald">
                          Our Vision
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#2664eb] text-lg leading-relaxed">
                        To become Nepal's leading STEM hub for schools and
                        communities! We want to be the coolest place where kids
                        learn amazing technology!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>

            {/* Achievement Unlocked Banner */}
            <motion.div
              className="text-center mt-10"
              style={{ opacity: bannerOpacity, y: bannerY }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/15 via-cyan-500/15 to-purple-500/15 border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white/80">
                  Achievement Unlocked: You discovered our Mission &amp; Vision!
                </span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom curve */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20 block rotate-180 flex-shrink-0"
        >
          <path
            d="M0,80 C480,10 960,80 1440,30 L1440,80 L0,80 Z"
            fill="#f8fafc"
          />
        </svg>
      </section>
    </div>
  );
};

/* ──────────────────────────────────────────
   FEATURES / WHY CHOOSE US
   ────────────────────────────────────────── */

const FeaturesSection = ({
  features,
}: {
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
  }[];
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-50"
      style={{ height: "200vh" }}
    >
      <section className="sticky top-0 min-h-screen py-24 bg-slate-50 relative overflow-hidden flex flex-col justify-center">
        <GeoShape
          size={12}
          color="bg-blue-500/15"
          shape="circle"
          style={{ top: "5%", right: "10%" }}
          duration={6}
        />
        <GeoShape
          size={8}
          color="bg-purple-500/15"
          shape="dot"
          style={{ bottom: "10%", left: "5%" }}
          duration={5}
          delay={1}
        />

        {/* Floating Bot icon */}
        <motion.div
          className="absolute top-20 left-8 md:left-16 z-10"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 opacity-50">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </motion.div>

        {/* Twinkling sparkle stars */}
        <motion.div
          className="absolute top-[12%] right-[8%] z-10 text-blue-400/30"
          animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="absolute bottom-[15%] left-[6%] z-10 text-blue-400/30"
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: 2.3,
            repeat: Infinity,
            delay: 0.8,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>
        <motion.div
          className="absolute top-[55%] right-[20%] z-10 text-blue-400/20"
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            delay: 1.4,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>

        <div className="container mx-auto px-4">
          {/* Station Badge */}
          {/* <StationBadge number={3} label="Power-Ups" light /> */}

          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.5 }}
              className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-oswald"
            >
              Why Choose ROBO-TECH Learning Center?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              We offer one of Nepal's most exciting and future-focused learning
              platforms, combining Coding, Robotics, and ICT education to
              empower learners of all ages. Our programs are designed to spark
              curiosity, build confidence, and prepare students for the digital
              world.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <SpiralCard
                key={index}
                scrollYProgress={scrollYProgress}
                index={index}
              >
                <motion.div
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.25 },
                  }}
                  className="group h-full"
                >
                  <Card className="h-full bg-white border border-slate-200/80 hover:border-blue-400/50 shadow-md hover:shadow-blue-200/60 transition-all duration-400 relative overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-blue-50 group-hover:to-cyan-50/50 transition-all duration-500" />

                    {/* Accent bar on left */}
                    <motion.div
                      className={`absolute left-0 top-0 w-1 bg-gradient-to-b ${feature.gradient} rounded-r-full`}
                      initial={{ height: 0 }}
                      whileInView={{ height: "100%" }}
                      viewport={vp}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + index * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />

                    {/* Level badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${feature.gradient} text-white text-[10px] font-bold shadow-sm`}
                      >
                        Lv{index + 1}
                      </span>
                    </div>

                    <CardHeader className="pb-3 relative z-10">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-md`}
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={vp}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 15,
                          delay: 0.2 + index * 0.12,
                        }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </motion.div>
                      <CardTitle className="text-lg font-bold text-slate-900 font-oswald tracking-tight">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-slate-600 text-[15px] leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SpiralCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ──────────────────────────────────────────
   TEAM SECTION
   ────────────────────────────────────────── */

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Manish Basnet",
      affiliation: "Robotics Lead",
      quote:
        "I turn curiosity into real builds. From sensors to servo motors, we make ideas move.",
      imageSrc:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=120&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Sanjeev Shrestha",
      affiliation: "Curriculum Architect",
      quote:
        "Every lesson ladders from playful discovery to real-world problem solving.",
      imageSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=120&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Ramesh Sir",
      affiliation: "AI & Data Instructor",
      quote:
        "We demystify AI by building models with stories, images, and real datasets.",
      imageSrc:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=120&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Umesh Sir",
      affiliation: "Maker Lab Coach",
      quote:
        "Our lab is a safe space to prototype, break, and build again with confidence.",
      imageSrc:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=600&fit=crop&q=80",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=120&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Mei Chen",
      affiliation: "Program Director",
      quote:
        "We blend structure with wonder so learners stay inspired and on track.",
      imageSrc:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=120&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-blue-500/30 to-transparent" />
      <div className="absolute -top-24 right-[-4%] w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-[-6%] w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.5 }}
            className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            Our Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-oswald"
          >
            Meet the Mentors Behind Robotech
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            A tight-knit team of educators and makers guiding every learner
            through hands-on STEM adventures.
          </motion.p>
        </div>

        <TeamMemberSlider
          members={teamMembers}
          className="bg-white/95 border border-blue-100/20 shadow-xl shadow-blue-200/50 rounded-2xl text-black/50"
        />
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────
   CTA SECTION
   ────────────────────────────────────────── */

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-20 block"
      >
        <path
          d="M0,80 C360,10 1080,70 1440,20 L1440,80 L0,80 Z"
          fill="#1565C0"
        />
      </svg>

      <div
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0c3d7a 0%, #1565C0 40%, #1E88E5 100%)",
        }}
      >
        {/* Orbs */}
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-blue-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[10%] w-60 h-60 bg-cyan-400/8 rounded-full blur-3xl" />

        <GeoShape
          size={10}
          color="bg-white/10"
          shape="dot"
          style={{ top: "20%", left: "8%" }}
          duration={5}
        />
        <GeoShape
          size={14}
          color="border-white/10"
          shape="ring"
          style={{ bottom: "20%", right: "12%" }}
          duration={7}
          delay={1}
        />

        {/* Floating Bot icon */}
        <motion.div
          className="absolute top-16 right-8 md:right-20 z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 opacity-50">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </motion.div>

        {/* Twinkling sparkle stars */}
        <motion.div
          className="absolute top-[15%] left-[12%] z-10 text-yellow-300/50"
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="absolute bottom-[25%] right-[15%] z-10 text-yellow-300/40"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: 0.9,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>
        <motion.div
          className="absolute top-[50%] left-[30%] z-10 text-yellow-300/30"
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            delay: 1.5,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Station Badge with Trophy */}
          {/* <StationBadge
                        label="Launch Pad"
                        icon={<Trophy className="w-3.5 h-3.5 text-white" />}
                        colorFrom="from-yellow-500/15"
                        colorTo="orange"
                    /> */}

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={vp}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald text-white leading-tight mb-6"
            >
              Want to Learn Coding, Robotics,
              <br className="hidden md:block" /> or ICT the Fun Way?
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100/70 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Thousands of learners are leveling up their skills with our
            practical, engaging programs. Your tech journey starts here!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-3 bg-white text-[#1565C0] px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/25 transition-shadow duration-300 group"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Journey Complete pill */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/15 via-cyan-500/15 to-purple-500/15 border border-white/10 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-yellow-400" /> */}
            {/* <span className="text-sm font-semibold text-white/80">
                                Journey Complete! You reached the Launch Pad!
                            </span> */}
            {/* <Trophy className="w-4 h-4 text-yellow-400" /> */}
            {/* </span> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
