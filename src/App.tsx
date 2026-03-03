import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SobreNos from "./pages/SobreNos";
import Solucoes from "./pages/Solucoes";
import Depoimentos from "./pages/Depoimentos";
import FAQ from "./pages/FAQ";
import Contato from "./pages/Contato";
import Assinaturas from "./pages/Assinaturas";
import Pagamento from "./pages/Pagamento";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin"; // Importação da página Administrativa
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/depoimentos" element={<Depoimentos />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/assinaturas" element={<Assinaturas />} />
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Rota do Painel do Cliente */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Nova rota do Painel Administrativo */}
            <Route path="/admin" element={<Admin />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;