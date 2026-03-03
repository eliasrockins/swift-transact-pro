import { motion } from "framer-motion";

const videoSlots = [
  { id: 1, src: "/videos/depoimento-1.mov", type: "video/mp4" },
  { id: 2, src: "/videos/depoimento-2.mp4", type: "video/mp4" },
  { id: 3, src: "/videos/depoimento-3.mp4", type: "video/mp4" },
  { id: 4, src: "/videos/depoimento-4.mp4", type: "video/mp4" },
  { id: 5, src: "/videos/depoimento-5.mp4", type: "video/mp4" },
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
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Depoimentos de nossos clientes
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 text-foreground">
            O que estão <span className="text-gradient">falando?</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Confira a experiência de nossos usuários
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoSlots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl overflow-hidden glow-border bg-card aspect-[9/16]"
            >
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
              >
                <source src={slot.src} type={slot.type} />
              </video>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
