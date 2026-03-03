import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import VideoShowcase from "@/components/VideoShowcase";
import SatisfactionSection from "@/components/SatisfactionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <VideoShowcase videoSrc="/videos/cta-video.mov" />
      <SatisfactionSection />
      <VideoShowcase videoSrc="/videos/asas-video.mov" />
      <VideoShowcase videoSrc="/videos/ck-solucoes-2.mp4" />
      <CTASection />
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Index;
