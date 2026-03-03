import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const SobreNos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <AboutSection />
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default SobreNos;
