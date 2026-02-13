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

    // Mock selected course data (In real app, this would come from state/URL)
    const [selectedCourse] = useState({
        name: "Robotics Core Program (Level 1)",
        duration: "12 Weeks (24 Sessions)",
        level: "Beginner",
        price: "Rs. 15,000"
    });

    return (
        <div className="min-h-screen flex bg-white font-oswald">
            {/* ═══════ LEFT PANEL ═══════ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col"
                style={{ background: 'linear-gradient(180deg, #0c3d7a 0%, #1565C0 50%, #1E88E5 100%)' }}
            >
                {/* Logo */}
                <div className="p-8">
                    <img src="/images/auth-logo.png" alt="Robo-Tech" className="h-14" />
                </div>

                {/* Main illustration */}
                <div className="flex-1 flex flex-col justify-center px-10">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/images/auth-kids.png"
                            alt="Kids learning with robots"
                            className="w-full max-w-md h-auto object-contain"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3">
                        Empower Young Minds with RoboTech Learning Center
                    </h2>
                    <p className="text-blue-100/80 text-sm leading-relaxed">
                        RoboTech Learning Center is a future focused learning platform that helps students
                        build strong foundations in coding, robotics, AI, and technology skills. Through
                        interactive lessons, hands-on projects, and expert-guided training, learners
                        develop problem-solving, creativity, and logical thinking—skills essential for the
                        digital world.
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
                <div className="p-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
                    <Link to="/register" className="inline-flex items-center gap-1.5 text-[#1565C0] font-medium hover:underline font-sans">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-sans uppercase tracking-[0.2em] font-bold">Individual Registration</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto w-full px-8 py-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-[#1565C0] mb-2">Register for Robotics Course</h1>
                        <p className="text-gray-500 font-sans italic">Fill in the details below to secure your seat.</p>
                    </div>

                    <form className="space-y-12">
                        {/* Section 1: Student Information */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1565C0]">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Student Information</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="space-y-2">
                                    <Label className="font-bold">Student Full Name *</Label>
                                    <Input placeholder="Enter student's name" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Parent/Guardian Name *</Label>
                                    <Input placeholder="Enter parent's name" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Email Address *</Label>
                                    <Input type="email" placeholder="email@example.com" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Phone Number *</Label>
                                    <Input placeholder="Enter contact number" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Student Age / Grade *</Label>
                                    <Input placeholder="e.g. 10 years / Grade 5" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">School Name (Optional)</Label>
                                    <Input placeholder="Enter current school" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Batch & Learning Mode */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Batch & Preferences</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="space-y-2">
                                    <Label className="font-bold">Preferred Batch Time *</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-[#1565C0] border-none text-white">
                                            <SelectValue placeholder="Select a batch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Morning (10:00 AM - 12:00 PM)</SelectItem>
                                            <SelectItem value="afternoon">Afternoon (02:00 PM - 04:00 PM)</SelectItem>
                                            <SelectItem value="evening">Evening (05:00 PM - 07:00 PM)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Learning Mode *</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-[#1565C0] border-none text-white">
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="offline">Offline (In-Center)</SelectItem>
                                            <SelectItem value="online">Online (Live Virtual)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Account Credentials */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Create Password</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="space-y-2">
                                    <Label className="font-bold">Password *</Label>
                                    <Input type="password" placeholder="Min 6 characters" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Confirm Password *</Label>
                                    <Input type="password" placeholder="Repeat password" className="h-12 bg-[#1565C0] border-none text-white placeholder:text-blue-100/50" required />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="w-full py-5 bg-[#1565C0] hover:bg-[#0d47a1] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                            onClick={(e) => { e.preventDefault(); /* Handle flow */ }}
                        >
                            {isLoading ? "Processing..." : "Create an Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IndividualRegistrationPage;
