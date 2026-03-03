import { motion } from "framer-motion";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "9840", label: "Clientes Satisfeitos" },
  { icon: Briefcase, value: "945", label: "Projetos Concluídos" },
  { icon: Calendar, value: "9+", label: "Anos de Experiência" },
  { icon: TrendingUp, value: "2934", label: "Vendedores Lucrando" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 glow-border flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-heading font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
