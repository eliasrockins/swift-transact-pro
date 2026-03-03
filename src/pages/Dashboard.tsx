import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, LayoutDashboard, ShoppingBag, 
  LogOut, ChevronRight, RefreshCcw, Package, 
  CreditCard, X, Copy, Check, ArrowLeft, Clock 
} from 'lucide-react';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  const [isReembolsoOpen, setIsReembolsoOpen] = useState(false);
  const [copiou, setCopiou] = useState<string | null>(null);
  const [pagamentoAberto, setPagamentoAberto] = useState<any>(null);
  
  // ESTADO DO CRONÔMETRO (3 horas = 10800 segundos)
  const [segundosRestantes, setSegundosRestantes] = useState(10800);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      if (!user) return;
      const { data: profile } = await supabase.from('clientes').select('*').eq('id', user.id).single();
      const { data: sales } = await supabase.from('vendas').select('*').eq('cliente_id', user.id).order('created_at', { ascending: false });
      if (profile) setPerfil(profile);
      if (sales) setPedidos(sales);
      setLoading(false);
    }
    carregarDados();
  }, [user]);

  // LÓGICA DO CRONÔMETRO ATIVO
  useEffect(() => {
    let intervalo: any;
    if (pagamentoAberto) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setSegundosRestantes(10800); // Reseta para 3h quando fecha
    }
    return () => clearInterval(intervalo);
  }, [pagamentoAberto]);

  // FORMATAÇÃO DE SEGUNDOS PARA HH:MM:SS
  const formatarTempo = (totalSegundos: number) => {
    const h = Math.floor(totalSegundos / 3600);
    const m = Math.floor((totalSegundos % 3600) / 60);
    const s = totalSegundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => { await signOut(); navigate('/auth'); };

  const copiarPix = (codigo: string, id: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiou(id);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopiou(null), 3000);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando CK Soluções...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
      {/* SIDEBAR (Igual ao anterior) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Ck Soluções" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-gray-900">Ck Soluções</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={abaAtiva === 'inicio'} icon={<LayoutDashboard size={20} />} label="Início" onClick={() => setAbaAtiva('inicio')} />
          <NavButton active={abaAtiva === 'pedidos'} icon={<ShoppingBag size={20} />} label="Meus Pedidos" onClick={() => setAbaAtiva('pedidos')} />
          <NavButton active={abaAtiva === 'dados'} icon={<User size={20} />} label="Meus Dados" onClick={() => setAbaAtiva('dados')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 relative">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Olá, {perfil?.nome || 'Cliente'}!</h1>
          <p className="text-gray-500 font-medium">Gerencie seus pedidos e taxas com a CK.</p>
        </header>

        {abaAtiva === 'inicio' && (
          <div className="bg-gradient-to-r from-[#16123a] to-[#2d2252] rounded-3xl p-8 mb-8 text-white shadow-xl">
            <h2 className="text-xl font-black mb-2">Prezamos pelo seu bem-estar.</h2>
            <p className="text-indigo-200 text-sm">Confira seus pedidos e suporte para reembolso aqui.</p>
          </div>
        )}

        {/* LISTA DE PEDIDOS */}
        {abaAtiva === 'pedidos' && (
          <div className="grid grid-cols-1 gap-4">
            {pedidos.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <h4 className="font-black text-gray-900 text-sm">{p.produto}</h4>
                  <p className="text-green-600 font-black text-xl">R$ {p.valor}</p>
                </div>
                <button 
                  onClick={() => setPagamentoAberto(p)}
                  className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${p.status === 'pago' ? 'bg-green-50 text-green-600 cursor-default' : 'bg-[#4ade80] hover:bg-[#22c55e] text-white shadow-lg active:scale-95'}`}
                >
                  {p.status === 'pago' ? 'PAGAMENTO CONCLUÍDO' : 'PAGAR AGORA'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ABA DADOS (Preto Reforçado) */}
        {abaAtiva === 'dados' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-8 border-b pb-4">Dados de Cadastro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DataRow label="CPF" value={perfil?.cpf} />
               <DataRow label="Telefone" value={perfil?.telefone} />
               <DataRow label="Código de Cobrança" value={perfil?.codigo_cobranca} />
               <DataRow label="Cidade / UF" value={`${perfil?.cidade || ''} - ${perfil?.estado || ''}`} />
            </div>
          </div>
        )}
      </main>

      {/* MODAL COM CRONÔMETRO REGRESSIVO */}
      {pagamentoAberto && (
        <div className="fixed inset-0 bg-gray-50/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-gray-100">
            <button onClick={() => setPagamentoAberto(null)} className="flex items-center text-gray-400 hover:text-gray-900 mb-8 font-bold transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Voltar
            </button>
            
            <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Finalizar Pagamento</h2>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                <span className="text-gray-400 font-bold text-xs uppercase">Produto</span>
                <span className="text-gray-900 font-black text-xs text-right max-w-[180px]">{pagamentoAberto.produto}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-xs uppercase">Total</span>
                <span className="text-3xl font-black text-[#22c55e]">R$ {pagamentoAberto.valor}</span>
              </div>
            </div>

            <textarea readOnly value={pagamentoAberto.pix_copia_cola} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-[10px] text-gray-400 h-24 mb-6 resize-none outline-none" />

            <button onClick={() => copiarPix(pagamentoAberto.pix_copia_cola, pagamentoAberto.id)} className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${copiou === pagamentoAberto.id ? 'bg-blue-600' : 'bg-[#4ade80] hover:bg-[#22c55e] active:scale-95'}`}>
              {copiou === pagamentoAberto.id ? <Check size={24} /> : <Copy size={24} />}
              {copiou === pagamentoAberto.id ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
            </button>

            {/* O CRONÔMETRO REAL */}
            <div className="mt-6 py-4 bg-red-50 rounded-2xl flex justify-center items-center text-red-600 font-mono font-black border border-red-100 animate-pulse">
              <Clock size={20} className="mr-3" /> EXPIRA EM: {formatarTempo(segundosRestantes)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES
function NavButton({ icon, label, active, onClick }: any) { return ( <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-900'}`}> {icon} <span className="text-sm">{label}</span> </button> ); }
function DataRow({ label, value }: any) { return ( <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"> <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p> <p className="text-gray-900 font-black text-sm">{value || 'Não informado'}</p> </div> ); }