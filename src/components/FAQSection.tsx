import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona? Como comprar utilizando a CK Soluções?",
    answer:
      "Você irá se cadastrar em nosso site e informar seus dados (Nome Completo, CPF, Endereço de entrega com CEP e E-mail) + Código da Cobrança informado pelo vendedor. O valor fica retido até você confirmar o recebimento do produto. Após a confirmação, o valor é liberado ao vendedor. Você tem até 14 dias para averiguar o produto e solicitar reembolso.",
  },
  {
    question: "Como posso ter certeza que estou comprando de maneira segura?",
    answer:
      "Seu pagamento fica bloqueado e somente é liberado quando o comprador avisa a plataforma que está tudo certo com a transação.",
  },
  {
    question: "É possível pagar com cartão de crédito?",
    answer:
      'O pagamento é apenas à vista por Pix. Caso deseje parcelar usando cartão de crédito, sugerimos aplicativos como "PicPay" que permitem o parcelamento via cartão, ou verifique se seu banco permite pagar boleto utilizando cartão de crédito.',
  },
  {
    question: "É necessário cadastro? Como realizo uma compra?",
    answer:
      'Sim! O cadastro pode ser feito pelo próprio cliente, haverá um campo chamado "Código da Cobrança" onde o vendedor(a) irá lhe passar o código, para que a venda seja registrada digite o "Código da Cobrança" no momento do Cadastro, aguarde alguns minutos e seu produto estará em seu Perfil pronto para pagamento.',
  },
  {
    question: "Como solicito o reembolso caso precise?",
    answer:
      'Basta logar em sua conta, ir em "MINHA CONTA" e na aba "SOLICITAR REEMBOLSO" ou nos enviar um e-mail. O reembolso será analisado pela equipe e devolvido de forma 100% integral via PIX ou Transferência Bancária.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 text-foreground">
            Principais dúvidas <span className="text-gradient">respondidas</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card data-[state=open]:glow-border transition-all"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
