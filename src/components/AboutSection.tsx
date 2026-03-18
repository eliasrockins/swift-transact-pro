import { motion, useInView } from "framer-motion";
import { Check, Users, Briefcase, Calendar } from "lucide-react";
import aboutImage from "@/assets/about-company.jpg";
import teamJoao from "@/assets/team-joao.jpg";
import teamFernanda from "@/assets/team-fernanda.jpg";
import teamFundadores from "@/assets/team-fundadores.jpg";
import { useEffect, useRef, useState } from "react";

const aboutItems = [
  "Melhor suporte",
  "Reembolso garantido",
  "Clientes satisfeitos",
  "Profissionais qualificados",
];

const stats = [
  { icon: Users, value: 9840, label: "CLIENTES ATIVOS" },
  { icon: Briefcase, value: 945, label: "PROJETOS COMPLETOS" },
  { icon: Calendar, value: 9, label: "ANOS DE EXPERIÊNCIA" },
];

const AnimatedNumber = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const end = value;
    const startTime = performance.now();
    const ms = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ms, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString("pt-BR")}+</span>;
};

const testimonials = [
  {
    name: "Lucas A. Marini",
    role: "Advogado",
    text: "Minha experiência com a CK Soluções foi excepcional. Fiquei surpreso com a agilidade na entrega do meu pedido e com a qualidade do produto recebido. Além disso, o sistema de pagamento seguro me proporcionou tranquilidade durante toda a transação.",
  },
  {
    name: "Ana Ruas",
    role: "Professora",
    text: "Estou extremamente satisfeita com a minha experiência ao usar a Link de Pay. Fiquei impressionada com a rapidez com que recebi meu produto após a compra. Além disso, fiquei tranquila sabendo que o pagamento estava protegido durante todo o processo.",
  },
  {
    name: "Suzana Bertolaccini",
    role: "Administradora",
    text: "Estou encantada com a minha experiência na CK Soluções. A rapidez com que recebi meu pedido me surpreendeu positivamente, e a qualidade do produto superou minhas expectativas. A segurança no processo de pagamento me deixou muito tranquila.",
  },
];

const teamMembers = [
  {
    name: "João Victor",
    role: "Atendimento e suporte técnico",
    image: teamJoao,
  },
  {
    name: "Fernanda Castro",
    role: "Atendimento ao cliente",
    image: teamFernanda,
  },
  {
    name: "Tiago Kart & Gustavo Kart",
    role: "CEO & Fundadores",
    image: teamFundadores,
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="relative">
      {/* About - Image + Text */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Video */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
            <div className="relative rounded-2xl overflow-hidden" style={{ borderLeft: '4px solid hsl(var(--primary))' }}>
                <img
                  src={aboutImage}
                  alt="Equipe CK Soluções"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Um pouco sobre nós</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-6 text-foreground">
                Melhores soluções para os nossos{" "}
                <span className="text-gradient">clientes</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                A equipe por trás do site CK Soluções é composta por profissionais altamente qualificados e dedicados, que trabalham em conjunto para garantir a melhor experiência possível para nossos usuários.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {aboutItems.map((item) => (
                  <div key={item} className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-heading font-bold text-foreground mb-3">
                  <AnimatedNumber value={stat.value} />
                </div>
                <div className="inline-block px-6 py-2 rounded-full border border-border">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials - Text Cards */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Comentários</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 text-foreground">
              Vejam o que estão <span className="text-gradient">falando da gente</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:glow-border transition-all"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-heading font-bold text-lg">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground">{t.name}</h4>
                    <p className="text-muted-foreground text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
            <div className="absolute inset-0 bg-card/80" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                Estamos aqui para ajudar você e seu negócio com as melhores soluções
              </h3>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Nosso Time</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 text-foreground">
              Conheça nosso <span className="text-gradient">time</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-border glow-border mb-6 group-hover:border-primary/40 transition-colors">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
