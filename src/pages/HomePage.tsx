import Header from '../components/layout/header'
import Footer from '@/components/layout/footer'
import Hero from '../components/home/Hero';
import MissionsSection from '../components/home/MissionsSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import PartnerSection from '../components/home/PartnerSection';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <Hero />
                <MissionsSection />
                <StatsSection />
                <FeaturesSection />
                <PartnerSection />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
