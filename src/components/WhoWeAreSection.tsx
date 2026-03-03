import { motion } from "framer-motion";
import { Award, Users, CheckCircle } from "lucide-react";
import aboutImage from "@/assets/about-company.jpg";
import teamFundadores from "@/assets/team-fundadores.jpg";

const WhoWeAreSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image with decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Purple background shape */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-2xl" />
              <div className="absolute inset-0 bg-primary rounded-2xl opacity-80" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30h60M30 0v60' stroke='%23ffffff10' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
              }} />

              <div className="relative p-8 md:p-12">
                {/* 100% badge */}
                <div className="absolute top-6 left-6 bg-background rounded-xl p-4 shadow-lg z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-heading font-bold text-foreground">100%</p>
                  <p className="text-muted-foreground text-xs">Satisfações de Clientes</p>
                </div>

                {/* Circular image */}
                <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-background/20">
                  <img
                    src={aboutImage}
                    alt="Profissional trabalhando"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom check */}
                <div className="absolute bottom-8 left-8">
                  <CheckCircle className="w-8 h-8 text-primary-foreground/60" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Who We Are</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-10 leading-tight">
              Experimente soluções de TI Construir negócios de tecnologia
            </h2>

            {/* Features */}
            <div className="space-y-8 mb-10">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-foreground mb-1">9 Anos de Experiência</h4>
                  <p className="text-muted-foreground">Somos uma empresa experiente no mercado</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-foreground mb-1">Equipe Especializada</h4>
                  <p className="text-muted-foreground">Contamos com uma equipe pronta para lhe auxiliar</p>
                </div>
              </div>
            </div>

            {/* Founders card */}
            <div className="bg-primary/5 rounded-2xl p-6 flex items-center gap-6 border border-primary/10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                <img src={teamFundadores} alt="Tiago Kart & Gustavo Kart" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-foreground">Tiago Kart & Gustavo Kart</h4>
                <p className="text-muted-foreground text-sm">CEO & Fundadores</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
