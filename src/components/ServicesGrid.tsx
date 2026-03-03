import { motion } from "framer-motion";
import { Monitor, Brain, Target, Database, Settings, ArrowRight } from "lucide-react";

const services = [
  { icon: Monitor, number: "01", title: "Software Automatizado" },
  { icon: Brain, number: "02", title: "Consultoria de tecnologia/TI" },
  { icon: Target, number: "03", title: "Estratégia de marketing" },
  { icon: Database, number: "04", title: "Estruturação de Big Data" },
  { icon: Settings, number: "05", title: "Serviços de TI gerenciados" },
];

const ServicesGrid = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              O que oferecemos aos nossos clientes
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight max-w-3xl mx-auto">
            Soluções de intermédio em transações financeiras para Compradores e Vendedores
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-all overflow-hidden"
            >
              {/* Decorative diagonal */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-6 translate-x-6 rotate-45" />

              <service.icon className="w-12 h-12 text-primary mb-6" strokeWidth={1.2} />

              <p className="text-muted-foreground text-sm mb-2">{service.number}</p>
              <h3 className="font-heading font-bold text-foreground text-base mb-4 min-h-[3rem]">
                {service.title}
              </h3>

              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
