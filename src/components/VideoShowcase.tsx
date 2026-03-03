import { motion } from "framer-motion";

const VideoShowcase = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden glow-border"
        >
          <video
            className="w-full aspect-video object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/ck-solucoes.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
