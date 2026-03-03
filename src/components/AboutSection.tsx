import { motion } from "framer-motion";
import { Check } from "lucide-react";

const aboutItems = [
  "Melhor suporte",
  "Reembolso garantido",
  "Clientes satisfeitos",
  "Profissionais qualificados",
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ borderLeft: '4px solid hsl(var(--primary))' }}>
              <video
                className="w-full aspect-[4/3] object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/videos/about-video.mov" type="video/quicktime" />
              </video>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Um pouco sobre nós</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-6 text-foreground">
              Melhores soluções para os nossos{" "}
              <span className="text-gradient">clientes</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              A equipe por trás do site CK Soluções é composta por profissionais altamente qualificados e dedicados, que trabalham em conjunto para garantir a melhor experiência possível para nossos usuários.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {aboutItems.map((item) => (
                <div key={item} className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
