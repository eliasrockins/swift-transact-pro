import { motion } from "framer-motion";
import { Cloud, Globe, Target, ChevronRight } from "lucide-react";
import solucaoBackup from "@/assets/solucao-backup.jpg";
import solucaoInternet from "@/assets/solucao-internet.jpg";
import solucaoEstrategia from "@/assets/solucao-estrategia.jpg";

const solutions = [
  {
    icon: Cloud,
    title: "Backup & Recuperação",
    image: solucaoBackup,
  },
  {
    icon: Globe,
    title: "Internet & segurança cibernética",
    image: solucaoInternet,
  },
  {
    icon: Target,
    title: "Estratégia de soluções personalizadas",
    image: solucaoEstrategia,
  },
];

const SolutionsShowcase = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Purple top section */}
      <div className="bg-primary pt-20 pb-48">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground text-center italic"
          >
            As melhores soluções tecnológicas
            <br />
            para nossos clientes
          </motion.h2>
        </div>
      </div>

      {/* Cards overlapping */}
      <div className="container mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              {/* Icon badge */}
              <div className="flex justify-center mb-[-28px] relative z-10">
                <div className="w-14 h-14 rounded-t-2xl bg-primary-foreground flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
              </div>

              {/* Image */}
              <div className="rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Title + Arrow */}
              <div className="flex items-center justify-between mt-4">
                <h3 className="font-heading font-bold text-foreground text-lg">
                  {item.title}
                </h3>
                <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsShowcase;
