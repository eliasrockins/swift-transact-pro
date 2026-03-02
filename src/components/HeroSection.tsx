import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 glow-border mb-8"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Plataforma 100% Segura</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6"
          >
            Soluções inteligentes{" "}
            <span className="text-gradient">para o seu negócio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Descubra a nossa plataforma segura e intuitiva, projetada para facilitar suas transações financeiras online. Com suporte especializado, garantimos uma experiência excepcional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="text-base px-8 py-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-box">
              Saiba Mais
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 border-border hover:bg-secondary">
              Criar Conta
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
