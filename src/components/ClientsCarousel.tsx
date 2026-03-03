import { motion } from "framer-motion";

const clients = [
  "Yampi",
  "Shopify",
  "LPQV",
  "Nuvemshop",
  "Wap.store",
  "Yampi",
  "Shopify",
  "LPQV",
  "Nuvemshop",
  "Wap.store",
];

const ClientsCarousel = () => {
  return (
    <section className="bg-primary py-16 overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground text-center italic">
          Alguns de nossos Clientes
        </h2>
      </div>

      {/* Infinite scroll */}
      <div className="relative">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {clients.map((name, i) => (
            <span
              key={i}
              className="text-primary-foreground/80 font-heading font-bold text-2xl md:text-3xl flex-shrink-0 hover:text-primary-foreground transition-colors"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsCarousel;
