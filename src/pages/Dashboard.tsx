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
  const [isReembolsoOpen, setIsReembolsoOpen] = useState(false); // RESTAURADO
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

  const abrirPagamento = (pedido: any) => {
    if (!pedido.pix_copia_cola) {
      return toast.info("Aguarde. O administrador ainda está gerando sua cobrança.");
    }
    setPagamentoAberto(pedido);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando CK Soluções...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Ck Soluções" className="w-10 h-10 object-contain" />
          <span className="font-black text-lg text-gray-900">Ck Soluções</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={abaAtiva === 'inicio'} icon={<LayoutDashboard size={20} />} label="Início" onClick={() => setAbaAtiva('inicio')} />
          <NavButton active={abaAtiva === 'pedidos'} icon={<ShoppingBag size={20} />} label="Meus Pedidos" onClick={() => setAbaAtiva('pedidos')} />
          <NavButton active={abaAtiva === 'dados'} icon={<User size={20} />} label="Meus Dados" onClick={() => setAbaAtiva('dados')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-bold transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 relative">
        {/* HEADER MOBILE RESTAURADO */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <img src={logo} alt="Ck Soluções" className="h-10 w-auto object-contain" />
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
            <LogOut size={16} /> Sair
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Olá, {perfil?.nome || 'Cliente'}!</h1>
          <p className="text-gray-500 font-medium">Gerencie seus pedidos e taxas com a CK.</p>
        </header>

        {/* BANNER PRINCIPAL */}
        <div className="bg-gradient-to-r from-[#16123a] to-[#2d2252] rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl">
          <div className="z-10 max-w-2xl text-white">
            <h2 className="text-xl md:text-2xl font-black mb-3 leading-snug">
              Confira seus pedidos, atualizações sobre a entrega e suporte para reembolso
            </h2>
            <p className="text-indigo-200 font-medium text-sm md:text-base">Essa é a CK, prezando pelo seu bem-estar.</p>
          </div>
          <div className="hidden lg:block opacity-10 transform scale-150 translate-x-4">
             <Package size={140} className="text-white" />
          </div>
        </div>

        {/* BOTÕES RESTAURADOS */}
        {abaAtiva === 'inicio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard icon={<RefreshCcw className="text-blue-500" />} title="Solicitar Reembolso" color="bg-blue-50" onClick={() => setIsReembolsoOpen(true)} />
            <ActionCard icon={<Package className="text-yellow-600" />} title="Acompanhar Pedido" color="bg-yellow-50" onClick={() => setAbaAtiva('pedidos')} />
            <ActionCard icon={<CreditCard className="text-green-600" />} title="Status do Pagamento" color="bg-green-50" onClick={() => setAbaAtiva('pedidos')} />
          </div>
        )}

        {/* LISTA DE PEDIDOS */}
        {abaAtiva === 'pedidos' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Histórico de Pedidos</h3>
            {pedidos.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">Nenhum pedido lançado para sua conta ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pedidos.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                      <h4 className="font-black text-gray-900 text-sm">{p.produto}</h4>
                      <p className="text-green-600 font-black text-xl">R$ {p.valor}</p>
                    </div>
                    <button 
                      onClick={() => abrirPagamento(p)}
                      className={`px-8 py-3 rounded-xl font-black text-sm transition-all w-full md:w-auto ${p.status === 'pago' ? 'bg-green-50 text-green-600 cursor-default' : 'bg-[#4ade80] hover:bg-[#22c55e] text-white shadow-lg active:scale-95'}`}
                    >
                      {p.status === 'pago' ? 'PAGAMENTO CONCLUÍDO' : 'PAGAR AGORA'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA DADOS COM TEXTO PRETO */}
        {abaAtiva === 'dados' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-8 border-b pb-4">Dados de Cadastro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DataRow label="CPF" value={perfil?.cpf} />
               <DataRow label="Telefone" value={perfil?.telefone} />
               <DataRow label="Código de Cobrança" value={perfil?.codigo_cobranca} />
               <DataRow label="Endereço Completo" value={`${perfil?.rua || ''}, ${perfil?.numero || ''}`} />
               <DataRow label="Bairro" value={perfil?.bairro} />
               <DataRow label="Cidade / UF" value={`${perfil?.cidade || ''} - ${perfil?.estado || ''}`} />
            </div>
          </div>
        )}
      </main>

      {/* MENU MOBILE RESTAURADO */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-2 z-40 pb-safe">
        <button onClick={() => setAbaAtiva('inicio')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'inicio' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <LayoutDashboard size={22} /><span className="text-[10px] font-bold">Início</span>
        </button>
        <button onClick={() => setAbaAtiva('pedidos')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'pedidos' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <ShoppingBag size={22} /><span className="text-[10px] font-bold">Pedidos</span>
        </button>
        <button onClick={() => setAbaAtiva('dados')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'dados' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <User size={22} /><span className="text-[10px] font-bold">Conta</span>
        </button>
      </nav>

      {/* MODAL DE PAGAMENTO COM CRONÔMETRO VIVO */}
      {pagamentoAberto && (
        <div className="fixed inset-0 bg-gray-50/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
            <button onClick={() => setPagamentoAberto(null)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 font-bold transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Voltar
            </button>
            
            <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Finalizar Pagamento</h2>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-bold text-xs uppercase">Produto</span>
                <span className="text-gray-900 font-black text-xs text-right max-w-[180px]">{pagamentoAberto.produto}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold text-xs uppercase">Total</span>
                <span className="text-3xl font-black text-[#22c55e]">R$ {pagamentoAberto.valor}</span>
              </div>
            </div>

            <textarea readOnly value={pagamentoAberto.pix_copia_cola} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono font-bold text-[11px] text-gray-900 h-24 mb-6 resize-none outline-none custom-scrollbar" />

            <button onClick={() => copiarPix(pagamentoAberto.pix_copia_cola, pagamentoAberto.id)} className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${copiou === pagamentoAberto.id ? 'bg-blue-600' : 'bg-[#4ade80] hover:bg-[#22c55e] active:scale-95'}`}>
              {copiou === pagamentoAberto.id ? <Check size={24} /> : <Copy size={24} />}
              {copiou === pagamentoAberto.id ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
            </button>

            {/* CRONÔMETRO VIVO */}
            <div className="mt-6 py-4 bg-red-50 rounded-2xl flex justify-center items-center text-red-600 font-mono font-black border border-red-100 animate-pulse">
              <Clock size={20} className="mr-3" /> EXPIRA EM: {formatarTempo(segundosRestantes)}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REEMBOLSO RESTAURADO */}
      {isReembolsoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <button onClick={() => setIsReembolsoOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            <div className="flex flex-col items-center text-center gap-4 mb-8 mt-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-600"><RefreshCcw size={32} /></div>
              <div><h2 className="text-2xl font-black text-gray-900">Solicitar Reembolso</h2><p className="text-gray-500 text-sm mt-2">Preencha os dados para iniciarmos o processo.</p></div>
            </div>
            <div className="space-y-5">
              <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nome do Titular da Conta</label><input readOnly value={`${perfil?.nome} ${perfil?.sobrenome}`} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-black outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Código de validação</label><input placeholder="Digite o código aqui..." className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-black placeholder:text-gray-400" /></div>
              <button onClick={() => {toast.success("Solicitação enviada!"); setIsReembolsoOpen(false);}} className="w-full bg-[#28a745] hover:bg-[#218838] text-white py-4 rounded-xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 mt-4 uppercase tracking-widest text-xs">Enviar Solicitação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES RESTAURADOS
function NavButton({ icon, label, active, onClick }: any) { return ( <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}> {icon} <span className="text-sm">{label}</span> </button> ); }
function ActionCard({ icon, title, color, onClick }: any) { return ( <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-blue-100 transition-all"> <div className="flex items-center gap-4"> <div className={`p-4 rounded-xl ${color}`}>{icon}</div> <span className="font-black text-gray-900 text-sm">{title}</span> </div> <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" /> </div> ); }
function DataRow({ label, value }: any) { return ( <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p> <p className="text-gray-900 font-black text-sm">{value || 'Não informado'}</p> </div> ); }