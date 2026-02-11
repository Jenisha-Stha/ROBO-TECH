import React, { useState, useRef, useEffect } from 'react'
import { Search, X, BookOpen, Menu, User, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { supabase } from '@/integrations/supabase/client'
import { Course } from '@/hooks/useCoursesWithTags'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import './header.css'

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, signOut } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    // Search courses query
    const { data: searchResults, isLoading: isSearching } = useSupabaseQuery<Course[]>({
        queryKey: ['search-courses', debouncedSearchTerm],
        queryFn: async () => {
            if (!debouncedSearchTerm.trim()) return []

            const { data, error } = await supabase
                .from('courses')
                .select(`
                    *,
                    image_asset:assets!courses_image_asset_id_fkey(
                        id,
                        url,
                        file_name,
                        asset_type,
                        alt_text,
                        description
                    ),
                    lessons:lessons!lessons_course_id_fkey(
                        id,
                        is_erased,
                        is_active
                    )
                `)
                .eq('is_erased', false)
                .eq('is_active', true)
                .or(`title.ilike.%${debouncedSearchTerm}%,detail.ilike.%${debouncedSearchTerm}%`)
                .limit(20);

            if (error) throw error;

            const ranked = (data ?? []).sort((a, b) => {
                const term = debouncedSearchTerm.toLowerCase();
                const aExact = a.title?.toLowerCase() === term || a.detail?.toLowerCase() === term;
                const bExact = b.title?.toLowerCase() === term || b.detail?.toLowerCase() === term;
                if (aExact && !bExact) return -1;
                if (bExact && !aExact) return 1;
                const aStarts = a.title?.toLowerCase().startsWith(term) || a.detail?.toLowerCase().startsWith(term);
                const bStarts = b.title?.toLowerCase().startsWith(term) || b.detail?.toLowerCase().startsWith(term);
                if (aStarts && !bStarts) return -1;
                if (bStarts && !aStarts) return 1;
                return 0;
            });

            return ranked.slice(0, 5).map(course => ({
                ...course,
                lesson_count: course.lessons?.filter(lesson => !lesson.is_erased && lesson.is_active).length || 0
            })) || []
        },
        enabled: debouncedSearchTerm.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        setShowResults(debouncedSearchTerm.length > 0 && searchResults && searchResults.length > 0)
    }, [debouncedSearchTerm, searchResults])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleCourseClick = (courseId: string) => {
        navigate(`/our-courses/${courseId}`)
        setSearchTerm('')
        setShowResults(false)
        setIsMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo Section */}
                <Link to="/" className="navbar-logo">
                    <img src="/images/robo-tech.jpg" alt="RoboTech" className="h-12 w-auto object-contain" />
                    <div className="logo-text">
                        <span className="logo-main">RoboTech</span>
                        <span className="logo-subtext">Learning Centre</span>
                    </div>
                </Link>

                {/* Navigation Links (Desktop) */}
                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/about-us" className={`nav-link ${location.pathname === '/about-us' ? 'active' : ''}`}>
                        About Us
                    </Link>
                    <Link to="/our-courses" className={`nav-link ${location.pathname === '/our-courses' ? 'active' : ''}`}>
                        Our Courses
                    </Link>
                    <Link to="/become-our-partner-school" className={`nav-link ${location.pathname === '/become-our-partner-school' ? 'active' : ''}`}>
                        Partners
                    </Link>
                </div>

                {/* Auth Actions */}
                <div className="navbar-actions">
                    {/* Search Bar (Desktop) */}
                    <div className="navbar-search" ref={searchRef}>
                        <div className="search-input-wrapper">
                            <Search className="search-icon w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div className="search-results">
                                {isSearching ? (
                                    <div className="p-4 text-center text-white/50">Searching...</div>
                                ) : (
                                    <div>
                                        {searchResults?.map(course => (
                                            <div
                                                key={course.id}
                                                onClick={() => handleCourseClick(course.id)}
                                                className="search-result-item"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#4FC3F7] to-[#00BCD4] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="result-info">
                                                    <span className="result-title">{course.title}</span>
                                                    <span className="result-meta">{course.course_type}</span>
                                                </div>
                                                <ArrowRight className="ml-auto w-4 h-4 text-white/30" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="user-profile-trigger">
                                    <div className="user-avatar">
                                        <User className="w-full h-full p-2 text-white/60 bg-white/10" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#0A1628] border border-white/10 text-white min-w-[180px]">
                                <div className="px-4 py-2 border-b border-white/5 bg-white/5">
                                    <p className="text-xs text-white/50">Signed in as</p>
                                    <p className="text-sm font-semibold truncate">{user.alias_name}</p>
                                </div>
                                <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-3">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => await signOut()} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-3 text-red-400">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <button onClick={toggleMobileMenu} className="mobile-toggle">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'open' : ''}`}>
                <button onClick={closeMobileMenu} className="mobile-menu-close">
                    <X className="w-8 h-8" />
                </button>

                <div className="mobile-links">
                    <Link to="/" onClick={closeMobileMenu} className="mobile-nav-link">Home</Link>
                    <Link to="/about-us" onClick={closeMobileMenu} className="mobile-nav-link">About Us</Link>
                    <Link to="/our-courses" onClick={closeMobileMenu} className="mobile-nav-link">Our Courses</Link>
                    <Link to="/become-our-partner-school" onClick={closeMobileMenu} className="mobile-nav-link">Partners</Link>
                </div>

                <div className="mobile-search">
                    <div className="search-input-wrapper">
                        <Search className="search-icon w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="bg-white/10 border-white/10 text-white w-full rounded-full px-10 py-3"
                        />
                    </div>
                </div>

                {!user && (
                    <button
                        onClick={() => { navigate('/login'); closeMobileMenu(); }}
                        className="w-full btn btn-primary py-4 text-lg mt-auto"
                    >
                        Login / Register
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Header
