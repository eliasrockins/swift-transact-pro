import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Como funciona ? Como comprar utilizando a CK Soluções ?",
    answer:
      'Funciona da seguinte forma, você irá se cadastrar em nosso site e informar os seguintes dados (Nome Completo, CPF, Endereço de entrega com CEP e E-mail ) + Código da Cobrança (Que deverá ser informado pelo seu vendedor(a), O vendedor(a) lançará uma cobrança em nossa plataforma, ao fazer login em "Minha Conta" e na aba "Pedidos" você encontrará seu Produto, basta clicar em "Pagar", o pagamento o valor fica retido ao vendedor(a) até você cliente confirmar para nós o recebimento do produto comprado, após a confirmação o valor será desbloqueado ao vendedor(a), e você terá até 14 dias para poder averiguar o produto e entrar com pedido de reembolso.',
  },
  {
    question: "É necessário cadastro? Como realizo uma compra utilizando o site?",
    answer:
      'Sim! O cadastro pode ser feito pelo próprio cliente, haverá um campo chamado "Código da Cobrança" onde o vendedor(a) irá lhe passar o código, para que a venda seja registrada digite o "Código da Cobrança" no momento do Cadastro, aguarde alguns minutos e seu produto estará em seu Perfil pronto para pagamento.',
  },
  {
    question: "Como posso ter certeza que estou comprando de maneira segura ?",
    answer:
      "A CK Soluções atua como intermediadora entre comprador e vendedor, garantindo que o valor pago fique retido até que o comprador confirme o recebimento do produto. Caso haja algum problema, você pode solicitar o reembolso dentro do prazo estabelecido.",
  },
  {
    question: "É possível pagar com cartão de crédito?",
    answer:
      "O pagamento é apenas a vista por Pix caso deseje parcelar usando cartão de crédito, sugerimos que pegue empréstimo PIX em seu banco utilizando seu cartão de crédito.",
  },
  {
    question: "Como solicito o reembolso caso precise ?",
    answer:
      "Após o recebimento do produto, você terá até 14 dias para solicitar o reembolso caso o produto não esteja de acordo com o anunciado. Basta acessar sua conta, ir em \"Pedidos\" e clicar em \"Solicitar Reembolso\". Nossa equipe analisará o pedido e dará um retorno em até 48 horas.",
  },
];

const HomeFAQSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Principais dúvidas respondidas
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Accordion type="multiple">
              {faqItems.filter((_, i) => i % 2 === 0).map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`left-${index}`}
                  className="bg-card border border-border rounded-xl px-6 mb-4 data-[state=open]:glow-border transition-all"
                >
                  <AccordionTrigger className="text-foreground font-heading font-semibold text-left hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Accordion type="multiple">
              {faqItems.filter((_, i) => i % 2 !== 0).map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`right-${index}`}
                  className="bg-card border border-border rounded-xl px-6 mb-4 data-[state=open]:glow-border transition-all"
                >
                  <AccordionTrigger className="text-foreground font-heading font-semibold text-left hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQSection;
