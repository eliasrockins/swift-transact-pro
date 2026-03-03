import { motion } from "framer-motion";

const videos = [
  { src: "/videos/depoimento-1.mov", poster: "/images/depoimento-1-poster.png" },
  { src: "/videos/depoimento-2.mp4" },
  { src: "/videos/depoimento-3.mp4" },
  { src: "/videos/depoimento-4.mp4" },
  { src: "/videos/depoimento-5.mp4" },
];

const HomeVideoTestimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-2 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 text-foreground">
            Veja o que nossos clientes <span className="text-gradient">estão dizendo</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl overflow-hidden border border-border glow-border"
            >
              <video
                src={video.src}
                poster={video.poster}
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-[9/16] object-cover bg-black"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeVideoTestimonials;
