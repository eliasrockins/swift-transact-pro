import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, LayoutDashboard, ShoppingBag, 
  LogOut, ChevronRight, RefreshCcw, Package, 
  CreditCard, X, Copy, Check, ArrowLeft, Clock, Key 
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
  
  // ESTADO DO CRONÔMETRO (20 minutos = 1200 segundos)
  const [segundosRestantes, setSegundosRestantes] = useState(1200);

  // ESTADOS DA REDEFINIÇÃO DE SENHA
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);
  
  const navigate = useNavigate();

  // ESCUTADOR DE EVENTOS DE AUTENTICAÇÃO
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetModalOpen(true);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function carregarDados() {
      if (!user) {
        setLoading(false); 
        return;
      }
      
      const { data: profile } = await supabase.from('clientes').select('*').eq('id', user.id).single();
      const { data: sales } = await supabase.from('vendas').select('*').eq('cliente_id', user.id).order('created_at', { ascending: false });
      
      if (profile) setPerfil(profile);
      if (sales) setPedidos(sales);
      setLoading(false);
    }
    carregarDados();
  }, [user]);

  // LÓGICA DO CRONÔMETRO
  useEffect(() => {
    let intervalo: any;
    if (pagamentoAberto) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setSegundosRestantes(1200); 
    }
    return () => clearInterval(intervalo);
  }, [pagamentoAberto]);

  // FORMATAÇÃO DE SEGUNDOS PARA MM:SS
  const formatarTempo = (totalSegundos: number) => {
    const m = Math.floor(totalSegundos / 60);
    const s = totalSegundos % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  const salvarNovaSenha = async () => {
    if (novaSenha.length < 6) return toast.error("A senha deve ter pelo menos 6 caracteres.");
    setAtualizandoSenha(true);
    
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    
    if (error) {
      toast.error("Erro ao atualizar senha. Tente enviar o link novamente.");
    } else {
      toast.success("Senha atualizada com sucesso!");
      setIsResetModalOpen(false);
      setNovaSenha('');
    }
    setAtualizandoSenha(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando CK Soluções...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
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

        {abaAtiva === 'inicio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard icon={<RefreshCcw className="text-blue-500" />} title="Solicitar Reembolso" color="bg-blue-50" onClick={() => setIsReembolsoOpen(true)} />
            <ActionCard icon={<Package className="text-yellow-600" />} title="Acompanhar Pedido" color="bg-yellow-50" onClick={() => setAbaAtiva('pedidos')} />
            <ActionCard icon={<CreditCard className="text-green-600" />} title="Status do Pagamento" color="bg-green-50" onClick={() => setAbaAtiva('pedidos')} />
          </div>
        )}

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
                    <div className="text-center md:text-left flex flex-col gap-1">
                      <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest w-fit mx-auto md:mx-0 mb-1">
                        CÓDIGO: {perfil?.codigo_cobranca || 'NÃO INFORMADO'}
                      </span>
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

        {abaAtiva === 'dados' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-8 border-b pb-4">Dados de Cadastro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* NOVO: Linha exibindo o Nome Completo */}
               <DataRow label="Nome Completo" value={`${perfil?.nome || ''} ${perfil?.sobrenome || ''}`} />
               
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

      {/* MODAL DE REDEFINIR SENHA */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4 mb-8 mt-4">
              <div className="p-4 rounded-full bg-purple-50 text-purple-600"><Key size={32} /></div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Criar Nova Senha</h2>
                <p className="text-gray-500 text-sm mt-2">Digite sua nova senha de acesso abaixo.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nova Senha *</label>
                <input 
                  type="password"
                  autoFocus 
                  value={novaSenha} 
                  onChange={e => setNovaSenha(e.target.value)} 
                  placeholder="Mínimo de 6 caracteres" 
                  className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-bold" 
                />
              </div>
              <button 
                onClick={salvarNovaSenha} 
                disabled={atualizandoSenha}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black shadow-lg shadow-purple-100 transition-all active:scale-95 mt-4 uppercase tracking-widest text-xs flex items-center justify-center"
              >
                {atualizandoSenha ? 'Atualizando...' : 'Salvar Nova Senha'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <textarea readOnly value={pagamentoAberto.pix_copia_cola} className="w-full p-4 bg-