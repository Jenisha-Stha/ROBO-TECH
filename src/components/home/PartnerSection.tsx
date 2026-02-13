import { useState, useEffect, useRef } from 'react';
import './PartnerSection.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import schoolAnimation from '../../assets/images/campus library school building office mocca animation.lottie';
import { useNavigate } from 'react-router';

const PartnerSection = () => {
    const navigate = useNavigate();
    const [dotLottie, setDotLottie] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const isVisibleRef = useRef(false);

    // Check if section is currently visible in viewport
    const checkIfVisible = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Check if at least 40% is visible
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const threshold = rect.height * 0.4;
            return visibleHeight >= threshold;
        }
        return false;
    };

    // Set up event listeners once we have dotLottie instance
    useEffect(() => {
        if (!dotLottie) return;

        const onLoad = () => {
            setIsLoaded(true);

            // Check if already visible when loaded (refresh scenario)
            const currentlyVisible = checkIfVisible();
            isVisibleRef.current = currentlyVisible;

            if (currentlyVisible && !hasPlayed) {
                // Already visible on load (refresh at this section) - show last frame immediately
                const totalFrames = dotLottie.totalFrames;
                if (totalFrames) {
                    dotLottie.setFrame(totalFrames - 1);
                }
                dotLottie.pause();
                setHasPlayed(true);
            }
        };

        const onComplete = () => {
            dotLottie.pause();
        };

        dotLottie.addEventListener('load', onLoad);
        dotLottie.addEventListener('complete', onComplete);

        // Check if already loaded (in case load fired before listener attached)
        if (dotLottie.isLoaded) {
            onLoad();
        }

        return () => {
            dotLottie.removeEventListener('load', onLoad);
            dotLottie.removeEventListener('complete', onComplete);
        };
    }, [dotLottie, hasPlayed]);

    // Intersection Observer to detect when scrolling into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    isVisibleRef.current = true;

                    // Only play if loaded and hasn't played yet
                    if (dotLottie && isLoaded && !hasPlayed) {
                        dotLottie.setFrame(0);
                        dotLottie.play();
                        setHasPlayed(true);
                    }
                }
            },
            { threshold: 0.4 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [dotLottie, isLoaded, hasPlayed]);

    // Handle case: animation loads AFTER observer already triggered (scrolled into view first, then loaded)
    useEffect(() => {
        if (isLoaded && isVisibleRef.current && !hasPlayed && dotLottie) {
            // Check visibility again to handle scroll-into-view case
            const currentlyVisible = checkIfVisible();
            if (currentlyVisible) {
                dotLottie.setFrame(0);
                dotLottie.play();
                setHasPlayed(true);
            }
        }
    }, [isLoaded, hasPlayed, dotLottie]);

    return (
        <section className="partner-section" ref={containerRef}>
            <div className="partner-container">
                <div className="partner-image">
                    <DotLottieReact
                        src={schoolAnimation}
                        speed={1}
                        loop={true}
                        autoplay={true}
                        dotLottieRefCallback={setDotLottie}
                    />
                </div>
                <div className="partner-content">
                    <h2 className="partner-title font-oswald mb-6">For Schools & Educators</h2>
                    <p className="partner-subtitle font-oswald mb-10">
                        Partner with RoboTech Learning to bring hands on robotics and coding
                        experiences to your classrooms
                    </p>
                    <div className="partner-cta">
                        <button
                            className="btn btn-primary partner-btn"
                            onClick={() => navigate('/register/school')}
                        >
                            Become a Partner School
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSection;
