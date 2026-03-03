import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeVideoTestimonials from "@/components/HomeVideoTestimonials";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import VideoShowcase from "@/components/VideoShowcase";
import SatisfactionSection from "@/components/SatisfactionSection";
import CTASection from "@/components/CTASection";
import HomeFAQSection from "@/components/HomeFAQSection";
import HomeTestimonialsCarousel from "@/components/HomeTestimonialsCarousel";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HomeVideoTestimonials />
      <FeaturesSection />
      <StatsSection />
      <VideoShowcase videoSrc="/videos/cta-video.mov" />
      <SatisfactionSection />
      <HomeFAQSection />
      <VideoShowcase videoSrc="/videos/asas-video.mov" />
      <VideoShowcase videoSrc="/videos/ck-solucoes-2.mp4" />
      <HomeTestimonialsCarousel />
      <CTASection />
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Index;
