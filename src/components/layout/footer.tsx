import {
    Facebook,
    Linkedin,
    Mail,
    MapPin,
    Phone
} from 'lucide-react'
import { Link } from 'react-router'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#1565C0]/95 to-[#0D47A1]/95 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="bg-white px-2 py-1">
                                <img src="/images/robo-tech.jpg" alt="logo" className="w-28 h-full object-contain" />
                            </div>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Empowering the next generation with cutting-edge robotics and technology education.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="https://www.facebook.com/Robotechlearningcenter" target="_blank">
                                <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                            </Link>
                            <Link to="https://www.linkedin.com/in/robotech-learning-center" target="_blank">
                                <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about-us" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="/our-courses" className="text-gray-400 hover:text-white">Courses</a></li>
                        </ul>
                    </div>
                    {/* <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div> */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-[#D51A13] mr-2" />
                                <span className="text-gray-400">info@robotechlearningcenter.com</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-[#D51A13] mr-2" />
                                <span className="text-gray-400">+977-9823728849</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-[#D51A13] mr-2" />
                                <span className="text-gray-400">Koteshwor, Kathmandu Nepal</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2024 ROBO-TECH Learning Center. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer