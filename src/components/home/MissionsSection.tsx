import './MissionsSection.css';
import Masonry from './Masonry';
import Shuffle from './Shuffle';

const missions = [
    {
        id: "1",
        img: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=300&fit=crop",
        url: "#",
        height: 350,
    },
    {
        id: "2",
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
        url: "#",
        height: 380,
    },
    {
        id: "3",
        img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
        url: "#",
        height: 360,
    },
    {
        id: "4",
        img: "https://images.unsplash.com/photo-1535378437337-5f1a2a78788f?w=400&h=300&fit=crop",
        url: "#",
        height: 340,
    },
    {
        id: "5",
        img: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=400&h=300&fit=crop",
        url: "#",
        height: 370,
    },
    {
        id: "6",
        img: "https://images.unsplash.com/photo-1555664424-778a69f452d1?w=400&h=300&fit=crop",
        url: "#",
        height: 350,
    },
    {
        id: "7",
        img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
        url: "#",
        height: 380,
    },
    {
        id: "8",
        img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop",
        url: "#",
        height: 360,
    },
    {
        id: "9",
        img: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400&h=300&fit=crop",
        url: "#",
        height: 350,
    },
];

const MissionsSection = () => {
    return (
        <section className="missions-section">
            <div className="missions-container">
                <Shuffle
                    text="Let's Learn ROBOTICS the Fun Way"
                    tag="h2"
                    className="missions-title"
                    shuffleDirection="right"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    ease="power3.out"
                    stagger={0.03}
                    threshold={0.1}
                    triggerOnce={false}
                    triggerOnHover={true}
                    loop={false}
                />
                <div className="masonry-wrapper">
                    <Masonry
                        items={missions}
                        ease="power3.out"
                        duration={0.6}
                        stagger={0.08}
                        animateFrom="bottom"
                        scaleOnHover
                        hoverScale={0.98}
                        blurToFocus
                        colorShiftOnHover={false}
                    />
                </div>
            </div>
        </section>
    );
};

export default MissionsSection;
