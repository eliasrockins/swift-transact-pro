import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="CK Soluções" className="w-8 h-8" />
            <span className="font-heading font-bold text-foreground">CK Soluções</span>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#inicio" className="hover:text-foreground transition-colors">Início</a>
            <a href="#sobre" className="hover:text-foreground transition-colors">Sobre</a>
            <a href="#solucoes" className="hover:text-foreground transition-colors">Soluções</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
          </div>

          <p className="text-muted-foreground text-sm">
            © 2024 CK Soluções. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
