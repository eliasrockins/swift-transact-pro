import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ana Ruas",
    role: "Professora",
    text: "Estou extremamente satisfeita com a minha experiência ao usar a CK Soluções. Fiquei impressionada com a rapidez com que recebi meu produto após a compra. Recomendo a todos!",
    avatar: "AR",
  },
  {
    name: "Suzana Bertolaccini",
    role: "Administradora",
    text: "Estou encantada com a minha experiência na CK Soluções. A rapidez com que recebi meu pedido me surpreendeu positivamente, e a qualidade do produto superou minhas expectativas.",
    avatar: "SB",
  },
  {
    name: "Lucas A. Marini",
    role: "Advogado",
    text: "Minha experiência com a CK Soluções foi excepcional. O sistema de pagamento seguro me proporcionou tranquilidade durante toda a transação. Sem dúvida, continuarei utilizando.",
    avatar: "LM",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 text-foreground">
            O que estão <span className="text-gradient">falando?</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Confira a experiência de nossos usuários
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="p-8 rounded-2xl bg-card border border-border hover:glow-border transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{t.text}</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center glow-border">
                  <span className="font-heading font-bold text-primary text-sm">{t.avatar}</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-sm">{t.name}</h4>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
