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
  
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const { data: sales } = await supabase
        .from('vendas')
        .select('*')
        .eq('cliente_id', user.id)
        .order('created_at', { ascending: false });

      if (profile) setPerfil(profile);
      if (sales) setPedidos(sales);
      setLoading(false);
    }
    carregarDados();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const copiarPix = (codigo: string, id: string) => {
    if (!codigo) {
      toast.error("Código Pix não encontrado.");
      return;
    }
    navigator.clipboard.writeText(codigo);
    setCopiou(id);
    toast.success("Código Pix copiado com sucesso!");
    setTimeout(() => setCopiou(null), 3000);
  };

  const abrirPagamento = (pedido: any) => {
    if (!pedido.pix_copia_cola) {
      return toast.info("Aguarde. O administrador ainda está gerando sua cobrança.");
    }
    setPagamentoAberto(pedido);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando sua conta...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Ck Soluções" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-gray-900 leading-tight">Ck Soluções</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={abaAtiva === 'inicio'} icon={<LayoutDashboard size={20} />} label="Início" onClick={() => setAbaAtiva('inicio')} />
          <NavButton active={abaAtiva === 'pedidos'} icon={<ShoppingBag size={20} />} label="Meus Pedidos" onClick={() => setAbaAtiva('pedidos')} />
          <NavButton active={abaAtiva === 'dados'} icon={<User size={20} />} label="Meus Dados" onClick={() => setAbaAtiva('dados')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (com padding extra no bottom para não esconder conteúdo atrás do menu mobile) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 relative">
        
        {/* HEADER MOBILE COM BOTÃO SAIR */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <img src={logo} alt="Ck Soluções" className="h-10 w-auto object-contain" />
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* CABEÇALHO */}
        <header className="mb-8 flex flex-col items-start gap-1">
          <img 
            src={logo} 
            alt="Ck Soluções" 
            className="hidden md:block h-14 w-auto mb-4 object-contain drop-shadow-sm" 
          />
          <h1 className="text-2xl font-bold text-gray-900">Olá, {perfil?.nome || ''}!</h1>
          <p className="text-gray-500">Acompanhe suas taxas e pedidos</p>
        </header>

        {/* BANNER ROXO/AZUL */}
        <div className="bg-gradient-to-r from-[#16123a] to-[#2d2252] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="z-10 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-black text-white mb-3 leading-snug">
              Confira seus pedidos, atualizações sobre a entrega e até mesmo suporte para reembolso
            </h2>
            <p className="text-indigo-200 font-medium text-sm md:text-base">
              Essa é a CK, prezando para seu bem-estar.
            </p>
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

        {/* ABA MEUS PEDIDOS COM DESIGN MOBILE ADAPTADO */}
        {abaAtiva === 'pedidos' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1f2937] mb-6">
              Histórico de Pedidos
            </h3>
            
            {pedidos.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Nenhum pedido lançado para sua conta ainda.</p>
              </div>
            ) : (
              <>
                {/* 1. VISUALIZAÇÃO EM CARDS PARA MOBILE (md:hidden) */}
                <div className="grid grid-cols-1 md:hidden gap-4">
                  {pedidos.map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3 relative">
                      {/* Status no topo do card */}
                      <div className="flex justify-start">
                        {p.status === 'pago' ? (
                           <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">PAGO</span>
                        ) : (
                           <span className="bg-[#fef3c7] text-[#92400e] font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Pendente</span>
                        )}
                      </div>
                      
                      {/* Dados principais do card */}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm truncate">{p.produto}</h4>
                        <p className="font-black text-green-600 text-lg">R$ {p.valor}</p>
                      </div>
                      
                      {/* Ação do card (Stacked / Empilhado) */}
                      <div className="pt-1">
                        {p.status === 'pago' ? (
                           <span className="w-full text-green-600 font-bold text-sm flex items-center justify-center gap-1 bg-green-50 p-2 rounded-lg border border-green-100"><Check size={16}/> Concluído</span>
                        ) : (
                          <button 
                            onClick={() => abrirPagamento(p)}
                            className="bg-[#4ade80] hover:bg-[#22c55e] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-colors w-full active:scale-95"
                          >
                            Pagar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. VISUALIZAÇÃO EM TABELA PARA DESKTOP (hidden md:block) */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Produto</th>
                        <th className="px-6 py-4">Valor</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pedidos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 font-medium text-gray-900">{p.produto}</td>
                          <td className="px-6 py-5 font-bold text-gray-700">R$ {p.valor}</td>
                          <td className="px-6 py-5 text-center">
                            {p.status === 'pago' ? (
                               <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">PAGO</span>
                            ) : (
                               <span className="bg-[#fef3c7] text-[#92400e] font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Pendente</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-center">
                            {p.status === 'pago' ? (
                               <span className="text-green-600 font-bold text-sm flex items-center justify-center gap-1"><Check size={16}/> Concluído</span>
                            ) : (
                              <button 
                                onClick={() => abrirPagamento(p)}
                                className="bg-[#4ade80] hover:bg-[#22c55e] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors w-full md:w-auto"
                              >
                                Pagar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {abaAtiva === 'dados' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Seus Dados de Cadastro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6">
                <DataRow label="CPF" value={perfil?.cpf} />
                <DataRow label="Telefone" value={perfil?.telefone} />
                <DataRow label="Código de Cobrança" value={perfil?.codigo_cobranca} />
              </div>
              <div className="space-y-6">
                <DataRow label="Endereço Completo" value={`${perfil?.rua || ''}, ${perfil?.numero || ''}`} />
                <DataRow label="Bairro" value={perfil?.bairro} />
                <DataRow label="Cidade / UF" value={`${perfil?.cidade || ''} - ${perfil?.estado || ''}`} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* NAVEGAÇÃO INFERIOR MOBILE (Estilo App) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-2 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <button onClick={() => setAbaAtiva('inicio')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'inicio' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button onClick={() => setAbaAtiva('pedidos')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'pedidos' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <ShoppingBag size={22} />
          <span className="text-[10px] font-bold">Pedidos</span>
        </button>
        <button onClick={() => setAbaAtiva('dados')} className={`flex flex-col items-center gap-1 p-2 w-full transition-all ${abaAtiva === 'dados' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
          <User size={22} />
          <span className="text-[10px] font-bold">Conta</span>
        </button>
      </nav>

      {/* MODAL DE PAGAMENTO PIX */}
      {pagamentoAberto && (
        <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in duration-200">
            
            <button onClick={() => setPagamentoAberto(null)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium">
              <ArrowLeft size={20} className="mr-2" /> Voltar
            </button>
            
            <h2 className="text-[28px] font-black text-center text-gray-900 mb-8">Finalizar Pagamento</h2>
            
            <div className="border border-gray-200 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <span className="text-gray-500 font-medium text-sm">Produto:</span>
                <span className="font-bold text-gray-900 text-right text-sm max-w-[180px]">{pagamentoAberto.produto}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium text-sm">Total a pagar:</span>
                <span className="text-3xl font-bold text-[#22c55e]">R$ {pagamentoAberto.valor}</span>
              </div>
            </div>

            <textarea 
              readOnly 
              value={pagamentoAberto.pix_copia_cola} 
              className="w-full p-4 border border-gray-200 rounded-xl font-mono text-[11px] text-gray-500 h-28 mb-4 bg-gray-50 resize-none outline-none custom-scrollbar" 
            />
            
            <button 
              onClick={() => copiarPix(pagamentoAberto.pix_copia_cola, pagamentoAberto.id)}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${copiou === pagamentoAberto.id ? 'bg-blue-600 shadow-blue-200' : 'bg-[#4ade80] hover:bg-[#22c55e] shadow-green-200 active:scale-95'}`}
            >
              {copiou === pagamentoAberto.id ? <Check size={24} /> : <Copy size={24} />}
              {copiou === pagamentoAberto.id ? 'Código Copiado!' : 'Copiar Código Pix'}
            </button>

            <div className="mt-4 py-3 bg-gray-50 rounded-xl flex justify-center items-center text-gray-500 font-mono text-sm font-bold border border-gray-200">
              <Clock size={18} className="mr-2" /> Expira em: 14:52
            </div>
            
          </div>
        </div>
      )}

      {/* MODAL DE REEMBOLSO */}
      {isReembolsoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <button onClick={() => setIsReembolsoOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 p-2 rounded-full">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center gap-4 mb-8 mt-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-600"><RefreshCcw size={32} /></div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Solicitar Reembolso</h2>
                <p className="text-gray-500 text-sm mt-2">Preencha os dados para iniciarmos o processo.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Titular da Conta</label>
                <input readOnly value={`${perfil?.nome} ${perfil?.sobrenome}`} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Código de validação</label>
                <input placeholder="Digite o código aqui..." className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder:text-gray-400" />
              </div>
              <button className="w-full bg-[#28a745] hover:bg-[#218838] text-white py-4 rounded-xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 mt-4 uppercase tracking-widest text-xs">
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// FUNÇÕES AUXILIARES DE COMPONENTES
// ==========================================

function NavButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
}

function ActionCard({ icon, title, color, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-blue-100 transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
        <span className="font-bold text-gray-800 text-sm">{title}</span>
      </div>
      <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function DataRow({ label, value }: any) {
  return (
    <div className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-r-lg">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-gray-900 font-bold text-sm">{value || 'Não informado'}</p>
    </div>
  );
}