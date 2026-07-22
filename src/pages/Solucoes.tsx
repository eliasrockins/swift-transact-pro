import Navbar from "@/components/Navbar";
import SolutionsShowcase from "@/components/SolutionsShowcase";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import ServicesGrid from "@/components/ServicesGrid";
import ClientsCarousel from "@/components/ClientsCarousel";
import Footer from "@/components/Footer";


const Solucoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <SolutionsShowcase />
        <WhoWeAreSection />
        <ServicesGrid />
        <ClientsCarousel />
      </div>
      <Footer />
      
    </div>
  );
};

export default Solucoes;
