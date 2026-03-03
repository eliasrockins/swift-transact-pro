import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-border">
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
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Quem somos nós</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 mb-6 text-foreground">
              Entendemos que a satisfação do cliente é nossa{" "}
              <span className="text-gradient">principal prioridade</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Ao investir em um negócio, as pessoas procuram confiança e segurança na escolha que estão fazendo, e depoimentos positivos de clientes anteriores são uma maneira eficaz de transmitir essas sensações.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: "Garantia", desc: "Seu pagamento estará protegido até que você receba o produto" },
                { title: "Simplicidade", desc: "Receba um e-mail com todas as informações de entrega e código de rastreio" },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 glow-box">
              Saiba Mais
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
