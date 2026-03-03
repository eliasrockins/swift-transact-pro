import Navbar from "@/components/Navbar";
import SolutionsShowcase from "@/components/SolutionsShowcase";
import VideoShowcase from "@/components/VideoShowcase";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Solucoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <SolutionsShowcase />
        <VideoShowcase />
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Solucoes;
