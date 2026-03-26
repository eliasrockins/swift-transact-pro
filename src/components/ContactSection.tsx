import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section id="contato" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Contato</span>
            <h2 className="text-4xl font-heading font-bold mt-3 mb-8 text-foreground">
              Envie sua <span className="text-gradient">mensagem</span>
            </h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Nome" className="bg-card border-border py-6" />
              <Input type="email" placeholder="Email" className="bg-card border-border py-6" />
              <Textarea placeholder="Mensagem" rows={5} className="bg-card border-border resize-none" />
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 glow-box">
                Enviar
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center gap-8"
          >
            {[
              { icon: MessageCircle, label: "WhatsApp", value: "11 92151 9195", href: "https://api.whatsapp.com/send?phone=5511921519195" },
              { icon: Phone, label: "Telefone", value: "11 92151 9195", href: "tel:+5511921519195" },
              { icon: Mail, label: "Email", value: "contato@linkdepay.com", href: "mailto:contato@linkdepay.com" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-6 rounded-2xl bg-card border border-border hover:glow-border transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{item.label}</p>
                  <p className="text-foreground font-semibold">{item.value}</p>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="rounded-2xl overflow-hidden glow-border">
            <video
              className="w-full aspect-video object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/contact-video.mov" type="video/quicktime" />
              <source src="/videos/contact-video.mov" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
