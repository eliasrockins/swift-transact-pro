import Navbar from "@/components/Navbar";
import SolutionsShowcase from "@/components/SolutionsShowcase";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Solucoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <SolutionsShowcase />
        <WhoWeAreSection />
        <ServicesGrid />
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Solucoes;
