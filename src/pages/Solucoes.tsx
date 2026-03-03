import Navbar from "@/components/Navbar";
import FeaturesSection from "@/components/FeaturesSection";
import VideoShowcase from "@/components/VideoShowcase";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Solucoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FeaturesSection />
        <VideoShowcase />
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Solucoes;
