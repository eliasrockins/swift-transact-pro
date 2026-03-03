import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const bandeiras = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "elo", label: "Elo" },
  { id: "amex", label: "American Express" },
  { id: "hipercard", label: "Hipercard" },
];

const Pagamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plano = searchParams.get("plano") || "Plano";
  const valor = searchParams.get("valor") || "0";

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bandeira, setBandeira] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => navigate("/assinaturas")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para planos
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Pagamento
                </h1>
              </div>

              <div className="mb-8 p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground">Plano selecionado</p>
                <p className="font-heading font-bold text-foreground text-lg">{plano}</p>
                <p className="text-primary font-bold text-xl">R$ {valor}/Mês</p>
              </div>

              {/* Bandeira */}
              <div className="mb-6">
                <Label className="text-foreground mb-3 block">Bandeira do cartão</Label>
                <div className="flex flex-wrap gap-2">
                  {bandeiras.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBandeira(b.id)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        bandeira === b.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Number */}
              <div className="mb-4">
                <Label htmlFor="cardNumber" className="text-foreground mb-2 block">
                  Número do cartão
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="bg-background border-border"
                />
              </div>

              {/* Card Name */}
              <div className="mb-4">
                <Label htmlFor="cardName" className="text-foreground mb-2 block">
                  Nome no cartão
                </Label>
                <Input
                  id="cardName"
                  placeholder="Nome como está no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  maxLength={100}
                  className="bg-background border-border"
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <Label htmlFor="expiry" className="text-foreground mb-2 block">
                    Validade
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-foreground mb-2 block">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="000"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-bold glow-box">
                Finalizar Pagamento
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
};

export default Pagamento;
