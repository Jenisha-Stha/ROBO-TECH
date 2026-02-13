import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, School, User, MapPin, Building2, ClipboardList, Send, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SchoolRegistrationPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen flex bg-white font-oswald">
            {/* ═══════ LEFT PANEL ═══════ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col"
                style={{ background: 'linear-gradient(180deg, #E31E24 0%, #C41A1F 100%)' }}
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
                    <p className="text-red-100/80 text-sm leading-relaxed">
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
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <div className="p-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
                    <Link to="/register" className="inline-flex items-center gap-1.5 text-[#E31E24] font-medium hover:underline font-sans">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-sans uppercase tracking-[0.2em] font-bold">School Partnership</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto w-full px-8 py-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-[#E31E24] mb-2 uppercase tracking-tight">Register Your Institution</h1>
                        <p className="text-gray-500 font-sans italic">Complete the request form below, and our partnership team will reach out to you.</p>
                    </div>

                    <form className="space-y-12 mb-20">
                        {/* Section 1: School Details */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1565C0]">
                                    <School className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">School Information</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold">School Name *</Label>
                                    <Input placeholder="Enter the official name of the school" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Official Email Address *</Label>
                                    <Input type="email" placeholder="school@example.com" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Contact Number *</Label>
                                    <Input placeholder="Official contact for school" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">City / Location *</Label>
                                    <Input placeholder="e.g. Kathmandu, Nepal" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Website URL (Optional)</Label>
                                    <Input placeholder="https://www.school.edu" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold">Full Address *</Label>
                                    <Input placeholder="Complete physical address" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Representative Info */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E31E24]">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Primary Contact (Representative)</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="space-y-2">
                                    <Label className="font-bold">Full Name *</Label>
                                    <Input placeholder="Principal / Coordinator Name" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Designation *</Label>
                                    <Input placeholder="e.g. Principal, IT Head" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Personal Official Email *</Label>
                                    <Input type="email" placeholder="name@school.edu" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Phone Number *</Label>
                                    <Input placeholder="Mobile number" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Program Requirements */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E31E24]">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Program Details</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 font-sans">
                                <div className="space-y-2">
                                    <Label className="font-bold">Expected Number of Students *</Label>
                                    <Input type="number" placeholder="Approx. enrollment count" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Grades Interested *</Label>
                                    <Input placeholder="e.g. Grades 5 to 10" className="h-12 bg-[#E31E24] border-none text-white placeholder:text-red-100/50" required />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold">Program Type Interested In *</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-[#E31E24] border-none text-white">
                                            <SelectValue placeholder="Select interest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="workshop">Short-term Workshops</SelectItem>
                                            <SelectItem value="curriculum">Full Academic Curriculum Integration</SelectItem>
                                            <SelectItem value="lab">Robotics Lab Setup & Consulting</SelectItem>
                                            <SelectItem value="afterschool">After-school Robotics Club</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold">Additional Requirements / Notes</Label>
                                    <Textarea placeholder="Tell us more about your specific needs..." className="min-h-[120px] bg-[#E31E24] border-none text-white placeholder:text-red-100/50" />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="w-full py-5 bg-[#E31E24] hover:bg-[#c41a1f] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3"
                            onClick={(e) => { e.preventDefault(); /* Handle flow */ }}
                        >
                            {isLoading ? "Sending Request..." : "Request Partnership"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SchoolRegistrationPage;
