import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            O que está <span className="text-gradient">esperando?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Entre em contato conosco agora mesmo e comece a fazer negócios com segurança.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base gap-2 glow-box">
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
