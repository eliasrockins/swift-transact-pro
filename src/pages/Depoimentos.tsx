import Navbar from "@/components/Navbar";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";


const Depoimentos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <TestimonialsSection />
      </div>
      <Footer />
      
    </div>
  );
};

export default Depoimentos;
