import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import testimonialLucas from "@/assets/testimonial-lucas.jpg";
import testimonialAna from "@/assets/testimonial-ana.jpg";
import testimonialSuzana from "@/assets/testimonial-suzana.jpg";

const testimonials = [
  {
    name: "Lucas A. Marini",
    role: "Advogado",
    image: testimonialLucas,
 text: "Minha experiência com a CK Soluções foi excepcional. Fiquei surpreso com a agilidade na entrega do meu pedido e com a qualidade do produto recebido. Além disso, o sistema de pagamento seguro me proporcionou tranquilidade durante toda a transação. Sem dúvida, continuarei utilizando a CK Soluções para minhas compras online e recomendo a todos que buscam praticidade e segurança",
  },
  {
    name: "Ana Ruas",
    role: "Professora",
    image: testimonialAna,
 text: "Estou extremamente satisfeita com a minha experiência ao usar a Link de Pay. Fiquei impressionada com a rapidez com que recebi meu produto após a compra. Além disso, fiquei tranquila sabendo que o pagamento estava protegido durante todo o processo. Recomendo a CK Soluções a todos os que procuram uma plataforma confiável e eficiente para suas compras online",
  },
  {
    name: "Suzana Bertolaccini",
    role: "Administradora",
    image: testimonialSuzana,
 text: "Estou extremamente satisfeita com a minha experiência ao usar a Link de Pay. Fiquei impressionada com a rapidez com que recebi meu produto após a compra. Além disso, fiquei tranquila sabendo que o pagamento estava protegido durante todo o processo. Recomendo a CK Soluções a todos os que procuram uma plataforma confiável e eficiente para suas compras online",
  },
];

const HomeTestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Comentários dos clientes
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            O que estão falando?
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-24 h-24 rounded-full border-[3px] border-primary overflow-hidden flex-shrink-0">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-foreground">{t.name}</h4>
                  <p className="text-primary text-sm font-medium">{t.role}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text */}
<p className="text-muted-foreground text-base leading-relaxed">
                {t.text}
              </p>
                {t.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonialsCarousel;
