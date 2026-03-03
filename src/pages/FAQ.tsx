import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FAQSection />
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default FAQ;
