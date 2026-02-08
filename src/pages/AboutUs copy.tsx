import React from 'react'
import Header from '../components/layout/header'
import FrontCourses from '@/components/FrontCourses'
import {
    BookOpen,
    Users,
    Award,
    Clock,
    Star,
    Play,
    CheckCircle,
    Globe,
    Shield,
    Zap,
    Quote,
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router'
import Footer from '@/components/layout/footer'

const AboutUs = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Student",
            content: "ROBO-TECH Learning Center transformed my understanding of robotics. The hands-on approach and expert instructors made complex concepts easy to grasp.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Michael Chen",
            role: "Engineer",
            content: "The advanced courses here are exceptional. I've implemented several projects from the curriculum in my professional work.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Emily Rodriguez",
            role: "Teacher",
            content: "As an educator, I appreciate how well-structured the courses are. The materials are comprehensive and the support is outstanding.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    ]

    const teamMembers = [
        {
            name: "Dr. Alex Thompson",
            role: "Lead Robotics Instructor",
            bio: "PhD in Robotics Engineering with 15+ years of industry experience",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            expertise: ["Robotics", "AI", "Machine Learning"]
        },
        {
            name: "Prof. Maria Garcia",
            role: "Programming Specialist",
            bio: "Expert in Python, C++, and embedded systems programming",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            expertise: ["Programming", "Embedded Systems", "IoT"]
        },
        {
            name: "Dr. James Wilson",
            role: "Electronics Expert",
            bio: "Specialist in circuit design and electronic systems integration",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            expertise: ["Electronics", "Circuit Design", "IoT"]
        }
    ]

    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Comprehensive Curriculum",
            description: "From beginner to advanced levels, covering all aspects of robotics and technology"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Expert Instructors",
            description: "Learn from industry professionals with years of real-world experience"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Certification Programs",
            description: "Earn recognized certificates upon completion of courses"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Flexible Learning",
            description: "Study at your own pace with 24/7 access to course materials"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Community",
            description: "Connect with learners and professionals worldwide"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure Platform",
            description: "Your data and progress are protected with enterprise-grade security"
        }
    ]

    const stats = [
        { number: "10,000+", label: "Students Enrolled" },
        { number: "500+", label: "Courses Available" },
        { number: "95%", label: "Completion Rate" },
        { number: "50+", label: "Expert Instructors" }
    ]

    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        About Us
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Learn more about ROBO-TECH Learning Center and our mission to democratize robotics education.
                    </p>
                </div>
            </div>




            {/* About Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                About ROBO-TECH Learning Center
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Founded in 2018, ROBO-TECH Learning Center has been at the forefront of robotics education,
                                empowering students, professionals, and educators with cutting-edge knowledge and practical skills.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our mission is to democratize robotics education and prepare the next generation for a
                                technology-driven future. We combine theoretical knowledge with hands-on practical experience
                                to ensure our students are industry-ready.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-[#D51A13] mr-3" />
                                    <span className="text-gray-700">Industry-recognized certifications</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-[#D51A13] mr-3" />
                                    <span className="text-gray-700">Hands-on project-based learning</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-[#D51A13] mr-3" />
                                    <span className="text-gray-700">Expert mentorship and support</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-[#D51A13] mr-3" />
                                    <span className="text-gray-700">Career placement assistance</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#1E68A9] to-[#0F4A7A] rounded-2xl p-8 text-white">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-[#D51A13] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Innovation in Education</h3>
                                    <p className="text-blue-100 mb-6">
                                        We use the latest educational technologies and methodologies to deliver
                                        the most effective learning experience.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-white">98%</div>
                                            <div className="text-sm text-blue-100">Student Satisfaction</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-white">85%</div>
                                            <div className="text-sm text-blue-100">Job Placement</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            What Our Students Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hear from our successful graduates and current students
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader>
                                    <div className="flex justify-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <Quote className="w-8 h-8 text-[#1E68A9] mx-auto mb-4" />
                                    <CardDescription className="text-gray-600 italic text-base">
                                        "{testimonial.content}"
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center space-x-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose ROBO-TECH Learning Center?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We provide the most comprehensive and effective robotics education platform
                            designed for learners of all levels.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white">
                                <CardHeader>
                                    <div className="w-16 h-16 bg-[#1E68A9] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Expert Team
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our instructors are industry professionals with years of experience in robotics,
                            programming, and technology education.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader>
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                                    />
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        {member.name}
                                    </CardTitle>
                                    <CardDescription className="text-[#1E68A9] font-semibold">
                                        {member.role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">{member.bio}</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {member.expertise.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="outline" className="text-xs text-black">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#1E68A9] to-[#0F4A7A] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Start Your Robotics Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Join thousands of students who are already building the future with robotics and technology.
                        Start your learning journey today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate('/our-courses')} size="lg" className="bg-[#D51A13] hover:bg-[#B0150F] text-white px-8 py-4 text-lg">
                            Enroll Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        {/* <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1E68A9] px-8 py-4 text-lg">
                            Contact Us
                        </Button> */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    )
}

export default AboutUs