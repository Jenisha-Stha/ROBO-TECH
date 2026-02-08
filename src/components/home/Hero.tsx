import './Hero.css';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import robotRiv from '../../assets/rive/16660-31346-robot.riv';
import { useNavigate } from 'react-router';

const Hero = () => {
    const navigate = useNavigate();
    const { rive, RiveComponent } = useRive({
        src: robotRiv,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        onLoad: () => {
            // Log available animations and state machines for debugging
            if (rive) {
                console.log('Rive contents:', rive.contents);
                // Play all animations
                rive.play();
            }
        }
    });

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to ROBO-TECH Learning Centre</h1>
                    <p className="hero-subtitle">
                        where learning robotics is fun, exciting, and full of cool adventures!
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>
                            LogIn <span>→</span>
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/login')}>
                            Register Now <span>→</span>
                        </button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-rive-container">
                        <RiveComponent />
                    </div>
                </div>
            </div>

            {/* Wave Curve SVG */}
            <div className="hero-wave">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 150"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,80 C360,150 720,0 1080,80 C1260,120 1380,100 1440,80 L1440,150 L0,150 Z"
                        className="shape-fill"
                    ></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;

