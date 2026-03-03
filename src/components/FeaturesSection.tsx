import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Pagamento Seguro",
    description: "Protegemos suas transações até o recebimento do produto, garantindo sua segurança em cada compra.",
    number: "01",
  },
  {
    icon: Zap,
    title: "Processo Rápido",
    description: "Realize transações de maneira ágil e intuitiva, com um cadastro simples e seguro.",
    number: "02",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Especializado",
    description: "Nossa equipe está pronta para ajudar você em cada etapa.",
    number: "03",
  },
];

const FeaturesSection = () => {
  return (
    <section id="solucoes" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group p-8 rounded-2xl bg-card border border-border hover:bg-primary hover:border-primary transition-all duration-300"
            >
              <div className="absolute top-4 right-6 text-6xl font-heading font-bold text-muted/50">
                {feature.number}
              </div>

              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute top-0 right-0 w-1 h-12 bg-primary rounded-bl-full rounded-tr-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
