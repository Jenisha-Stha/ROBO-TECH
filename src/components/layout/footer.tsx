import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react'
import { Link } from 'react-router'

const Footer = () => {
    const companyLinks = [
        { label: 'About Us', href: '/about-us' },
        { label: 'Courses', href: '/our-courses' },
        { label: 'Contact', href: '#' },
    ]

    const supportLinks = [
        { label: 'Help Center', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'FAQs', href: '#' },
    ]

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/Robotechlearningcenter' },
        { icon: Instagram, label: 'Instagram', href: '#' },
        { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/robotech-learning-center' },
    ]

    return (
        <footer style={{ background: 'linear-gradient(180deg, rgba(21, 101, 192, 0.95) 0%, rgba(13, 71, 161, 0.95) 100%)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
                {/* Scrolling marquee text */}
                <div className=" whitespace-nowrap mb-12">
                    <div className="inline-block animate-marquee">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} className="text-white text-5xl lg:text-7xl font-bold font-oswald uppercase tracking-wider opacity-20 mx-8">
                                ROBO-TECH LEARNING CENTER
                            </span>
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 20s linear infinite;
                    }
                `}</style>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                    {/* Left — Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/robo-tech.jpg"
                                alt="ROBO-TECH logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        <p className="text-white text-base leading-relaxed max-w-sm">
                            Empowering the next generation with cutting-edge robotics, coding, and technology education across Nepal.
                        </p>

                        <div className="pt-2">
                            <p className="text-base text-white mb-3">Follow us on</p>
                            <div className="flex items-center gap-4">
                                {socialLinks.map(({ icon: Icon, label, href }) => (
                                    <Link
                                        key={label}
                                        to={href}
                                        target="_blank"
                                        aria-label={label}
                                        className="text-white hover:text-[#1565C0] transition-colors"
                                    >
                                        <Icon className="w-7 h-7" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Link columns with subtle top gradient border */}
                    <div className="rounded-xl bg-slate-200 pt-1 overflow-hidden ">
                        {/* <div className="h-1 bg-gradient-to-r from-[#1565C0] via-[#1E88E5] to-[#42A5F5] rounded-t-xl" /> */}
                        <div className="grid grid-cols-3 gap-18 p-12 shadow-md-white">
                            {/* Company */}
                            <div>
                                <h4 className="text-slate-800 font-semibold text-sm mb-5">Company</h4>
                                <ul className="space-y-3">
                                    {companyLinks.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.href}
                                                className="text-slate-500 text-sm hover:text-[#1565C0] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="text-slate-800 font-semibold text-sm mb-5">Support</h4>
                                <ul className="space-y-3">
                                    {supportLinks.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.href}
                                                className="text-slate-500 text-sm hover:text-[#1565C0] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact Us */}
                            <div>
                                <h4 className="text-slate-800 font-semibold text-sm mb-5">Contact Us</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span>info@robotechlearningcenter.com</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span>+977-9823728849</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span>Koteshwor, Kathmandu Nepal</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} ROBO-TECH Learning Center. All Rights Reserved</p>
                    <div className="flex items-center gap-3">
                        <Link to="#" className="hover:text-[#1565C0] transition-colors">Terms &amp; Conditions</Link>
                        <span>|</span>
                        <Link to="#" className="hover:text-[#1565C0] transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
