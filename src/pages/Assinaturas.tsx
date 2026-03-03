import { motion } from "framer-motion";
import { Circle, Globe, Diamond, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const plans = [
  {
    name: "Plano básico",
    description: "Perfeito para pessoas físicas e/ou pequenas empresas. (Válido por 3 meses)",
    price: "39.9",
    icon: Circle,
    label: "Este serviço inclui:",
    features: [
      "Grátis 15 Cobranças / Mês",
      "R$ 2.59 Por Cobrança Emitida",
    ],
  },
  {
    name: "Plano Intermediário",
    description: "Perfeito para empresas com grande fluxo. (Válido por 6 meses)",
    price: "59.9",
    icon: Globe,
    label: "Estes serviços inclui:",
    features: [
      "Grátis 45 Cobranças/ Mês",
      "R$ 1.59 Por Cobrança Emitida",
    ],
  },
  {
    name: "Plano VIP",
    description: "Perfeito para grandes empresas. (Válido por 2 anos)",
    price: "129.9",
    icon: Diamond,
    label: "Estes serviços inclui:",
    features: [
      "Grátis 90 Cobranças / Mês",
      "R$ 0.99 Por Cobrança Emitida",
      "Suporte 24 hrs",
    ],
  },
];

const Assinaturas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Nossos Planos
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mt-3 text-foreground">
              Preços <span className="text-gradient">justos</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Escolha o plano ideal para o seu negócio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="rounded-2xl bg-card border border-border p-8 flex flex-col hover:glow-border transition-all"
              >
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <plan.icon className="w-16 h-16 text-primary mb-4" strokeWidth={1.5} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-heading font-bold text-lg">R$</span>
                    <span className="text-4xl font-heading font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/Mês</span>
                  </div>
                </div>

                <p className="text-primary font-medium text-sm mb-4">{plan.label}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <ChevronsRight className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
                  Assinar
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Assinaturas;
