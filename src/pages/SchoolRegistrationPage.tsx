import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SchoolRegistrationPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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

                {/* Bottom: robot on pencil + clouds */}
                <div className="relative h-44">
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                        <img src="/images/auth-robot-pencil.png" alt="Robot on pencil" className="h-28 w-auto object-contain" />
                    </div>
                    <img
                        src="/images/auth-clouds.png"
                        alt=""
                        className="absolute bottom-0 left-0 w-full h-auto"
                    />
                    <div className="absolute bottom-3 left-[12%] flex gap-2.5 z-10">
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                        <div className="w-4 h-4 rounded-full bg-orange-500" />
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                    </div>
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
                            <h1 className="text-3xl font-bold text-[#1565C0] mb-3">Let's set up your learning adventure!</h1>
                        </div>

                        {/* Form */}
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Your Name</Label>
                                <Input
                                    placeholder="Enter your full name"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Phone Number</Label>
                                <Input
                                    placeholder="Enter your contact number"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Address</Label>
                                <Input
                                    placeholder="Enter your address"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">School</Label>
                                <Input
                                    placeholder="Enter your school name"
                                    className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg font-semibold text-gray-800">Grade</Label>
                                <Select>
                                    <SelectTrigger className="h-14 bg-white border-2 border-gray-200 rounded-xl px-5 text-gray-900 focus:ring-[#1565C0] focus:border-[#1565C0] transition-all text-base">
                                        <SelectValue placeholder="Select your grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(10)].map((_, i) => (
                                            <SelectItem key={i + 1} value={`grade-${i + 1}`}>Grade {i + 1}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Submit */}
                            <Button
                                className="w-full h-14 bg-[#1565C0] hover:bg-[#0c3d7a] text-white rounded-xl text-xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98] mt-4"
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle logic
                                }}
                            >
                                {isLoading ? "Processing..." : "Continue"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolRegistrationPage;
