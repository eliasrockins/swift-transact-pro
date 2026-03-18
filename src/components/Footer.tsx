import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Link de Pay" className="w-8 h-8" />
            <span className="font-heading font-bold text-foreground">Link de Pay</span>
          </Link>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <Link to="/sobre-nos" className="hover:text-foreground transition-colors">Sobre</Link>
            <Link to="/solucoes" className="hover:text-foreground transition-colors">Soluções</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/contato" className="hover:text-foreground transition-colors">Contato</Link>
          </div>

          <p className="text-muted-foreground text-sm">
            © 2026 Link de Pay. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
