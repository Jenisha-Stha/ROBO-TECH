import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, User, Phone, Mail, GraduationCap, MapPin, CreditCard, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const IndividualRegistrationPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* ═══════ LEFT PANEL ═══════ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col shrink-0"
                style={{ background: 'linear-gradient(180deg, #0c3d7a 0%, #1565C0 50%, #1E88E5 100%)' }}
            >
                {/* Logo */}
                <div className="p-12">
                    <img src="/images/auth-logo.png" alt="Robo-Tech" className="h-16 w-auto object-contain" />
                </div>

                {/* Main illustration & Text */}
                <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
                    <div className="flex justify-center mb-10">
                        <img
                            src="/images/auth-kids.png"
                            alt="Kids learning with robots"
                            className="w-full max-w-md h-auto object-contain"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Empower Young Minds with RoboTech Learning Center
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed max-w-md">
                        RoboTech Learning Center is a future focused learning platform that helps students
                        build strong foundations in coding, robotics, AI, and technology skills. Through
                        interactive lessons, hands-on projects, and expert-guided training, learners
                        develop problem-solving, creativity, and logical thinking—skills essential for the
                        digital world.
                    </p>
                </div>

                {/* Bottom Graphic */}
                <div className="relative h-60 w-full overflow-hidden">
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-3/4">
                        <img src="/images/auth-robot-pencil.png" alt="Robot on pencil" className="w-full h-auto object-contain" />
                    </div>
                    <img
                        src="/images/auth-clouds.png"
                        alt=""
                        className="absolute bottom-0 left-0 w-full h-auto z-10"
                    />
                </div>
            </div>

            {/* ═══════ RIGHT PANEL ═══════ */}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-white">
                <div className="px-8 py-10 lg:px-20 lg:py-16 max-w-xl mx-auto w-full flex flex-col h-full">
                    {/* Back Link */}
                    <div className="mb-12">
                        <Link
                            to="/register"
                            className="text-[#1565C0] hover:text-[#0c3d7a] flex items-center gap-2 font-medium transition-colors text-lg"
                        >
                            Back
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {/* Header */}
                        <div className="mb-10 text-left">
                            <h1 className="text-3xl font-bold text-[#1565C0] mb-3">Create Your Account</h1>
                            <p className="text-gray-600 font-medium">Enter your credentials to create an account</p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email or username"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Terms */}
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-5 h-5 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0] cursor-pointer"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                />
                                <label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer">
                                    I accept the <Link to="/terms" className="text-[#1565C0] hover:underline">Terms and Conditions</Link> & <Link to="/privacy" className="text-[#1565C0] hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <Button
                                className="w-full h-14 bg-[#1565C0] hover:bg-[#0c3d7a] text-white rounded-xl text-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                                disabled={isLoading || !acceptTerms}
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle logic
                                }}
                            >
                                {isLoading ? "Processing..." : "Continue"}
                            </Button>

                            {/* Divider */}
                            <div className="relative py-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200"></span>
                                </div>
                                <div className="relative flex justify-center uppercase">
                                    <span className="bg-white px-4 text-sm font-semibold text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <Button
                                variant="outline"
                                className="w-full h-14 bg-white border-2 border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle Google Auth
                                }}
                            >
                                <img src="/images/google-icon.png" alt="" className="w-6 h-6" onError={(e) => {
                                    // Fallback if icon missing
                                    e.currentTarget.src = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
                                }} />
                                <span className="text-gray-700">Google</span>
                            </Button>

                            {/* Footer Link */}
                            <div className="text-center pt-8">
                                <p className="text-gray-600 font-medium">
                                    Already have an account? <Link to="/login" className="text-[#1565C0] font-bold hover:underline">Sign in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndividualRegistrationPage;
