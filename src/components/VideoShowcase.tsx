import { motion } from "framer-motion";

interface VideoShowcaseProps {
  videoSrc?: string;
}

const VideoShowcase = ({ videoSrc = "/videos/ck-solucoes.mp4" }: VideoShowcaseProps) => {
  return (
    <section className="py-10 md:py-20 relative">
      <div className="container mx-auto px-2 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden glow-border"
        >
          <video
            className="w-full aspect-video object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc} type="video/quicktime" />
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
