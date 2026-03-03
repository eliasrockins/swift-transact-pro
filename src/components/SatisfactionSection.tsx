import { motion } from "framer-motion";
import { CheckCircle, Globe } from "lucide-react";
import satisfactionImg1 from "@/assets/satisfaction-1.jpg";
import satisfactionImg2 from "@/assets/satisfaction-2.jpg";

const SatisfactionSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Top left image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={satisfactionImg1}
                  alt="Equipe trabalhando"
                  className="w-full h-48 object-cover"
                />
              </div>
              {/* Globe icon */}
              <div className="flex items-center justify-center">
                <Globe className="w-32 h-32 text-primary" strokeWidth={1} />
              </div>
              {/* Years of experience */}
              <div className="flex flex-col justify-center">
                <CheckCircle className="w-6 h-6 text-primary mb-2" />
                <span className="text-5xl font-heading font-bold text-primary">7</span>
                <span className="text-foreground font-heading font-bold text-lg mt-1">
                  Anos de<br />experiência
                </span>
              </div>
              {/* Bottom right image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={satisfactionImg2}
                  alt="Profissionais confiantes"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Entendemos que a satisfação do cliente é nossa principal prioridade
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Ao investir em um negócio, as pessoas procuram confiança e segurança na escolha que estão
              fazendo, e depoimentos positivos de clientes anteriores são uma maneira eficaz de transmitir
              essas sensações.
            </p>

            {/* Garantia */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-heading font-bold text-foreground">Garantia</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-9">
                Ao usar nosso site, garantimos que seu pagamento estará protegido até que você receba
                o produto
              </p>
            </div>

            <div className="border-t border-border my-6" />

            {/* Simplicidade */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-heading font-bold text-foreground">Simplicidade</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-9">
                Assim que o pagamento for confirmado, você receberá um e-mail com todas as
                informações de entrega e o código de rastreio para acompanhar a entrega da
                mercadoria
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SatisfactionSection;
