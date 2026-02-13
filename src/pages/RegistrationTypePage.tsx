import React from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, User, School, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegistrationTypePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white font-oswald">
            {/* ═══════ LEFT PANEL (Same as AuthPage for consistency) ═══════ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col"
                style={{ background: 'linear-gradient(180deg, #0c3d7a 0%, #1565C0 50%, #1E88E5 100%)' }}
            >
                <div className="p-8">
                    <img src="/images/auth-logo.png" alt="Robo-Tech" className="h-14" />
                </div>

                <div className="flex-1 flex flex-col justify-center px-10">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/images/auth-kids.png"
                            alt="Kids learning with robots"
                            className="w-full max-w-md h-auto object-contain"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                        Join the Robotic Revolution
                    </h2>
                    <p className="text-blue-100/80 text-lg leading-relaxed font-sans opacity-90">
                        Whether you are a student eager to build your first robot or a school
                        looking to empower your entire institution, RoboTech provides the
                        tools and expertise to make it happen.
                    </p>
                </div>

                <div className="relative h-44">
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                        <img src="/images/auth-robot-pencil.png" alt="Robot on pencil" className="h-28 w-auto object-contain" />
                    </div>
                    <img
                        src="/images/auth-clouds.png"
                        alt=""
                        className="absolute bottom-0 left-0 w-full h-auto"
                    />
                </div>
            </div>

            {/* ═══════ RIGHT PANEL ═══════ */}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <div className="p-8">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-[#1565C0] font-medium hover:underline font-sans">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
                    <div className="w-full max-w-4xl">
                        <h1 className="text-4xl font-bold text-[#1565C0] mb-4 text-center">Choose Registration Type</h1>
                        <p className="text-gray-500 text-center mb-12 font-sans text-lg">
                            Select the registration path that best fits your needs
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Individual Registration Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl hover:border-[#1565C0] transition-all cursor-pointer flex flex-col items-center text-center group"
                                onClick={() => navigate('/register/individual')}
                            >
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1565C0] transition-colors">
                                    <User className="w-10 h-10 text-[#1565C0] group-hover:text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Individual Student</h3>
                                <p className="text-gray-600 font-sans mb-8 flex-1">
                                    Perfect for students and parents who want to enroll in specific courses and join our batches.
                                </p>
                                <button className="w-full py-4 bg-[#1565C0] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d47a1] transition-colors">
                                    Get Started as Student <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>

                            {/* School Registration Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl hover:border-[#E31E24] transition-all cursor-pointer flex flex-col items-center text-center group"
                                onClick={() => navigate('/register/school')}
                            >
                                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E31E24] transition-colors">
                                    <School className="w-10 h-10 text-[#E31E24] group-hover:text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">School / Institution</h3>
                                <p className="text-gray-600 font-sans mb-8 flex-1">
                                    Bring robotics education to your entire institution. Bulk enrollment and specialized partner dashboard.
                                </p>
                                <button className="w-full py-4 bg-[#E31E24] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c41a1f] transition-colors">
                                    Partner with Us <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationTypePage;
