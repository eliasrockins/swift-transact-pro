import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, LayoutDashboard, ShoppingBag, 
  LogOut, ChevronRight, RefreshCcw, Package, 
  CreditCard, X, Copy, Check, ArrowLeft, Clock, Key, AlertCircle, Upload, FileText, Image as ImageIcon,
  Hash, Tag, HelpCircle, MessageSquare, Send, Search, Banknote, Lock
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
  
  const [pedidoReembolso, setPedidoReembolso] = useState<any>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);

  const navigate = useNavigate();

  const registrarLog = async (acao: string, detalhes: string = '') => {
    if (!user) return;
    try {
      await supabase.from('logs_atividades').insert([{
        cliente_id: user.id,
        acao: acao,
        detalhes: detalhes
      }]);
    } catch (error) {
      console.log("Erro silencioso no log", error);
    }
  };

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

  const handleLogout = async () => { 
    await registrarLog('Saiu do Sistema', 'O cliente clicou no botão Sair.');
    await signOut(); 
    navigate('/auth'); 
  };

  const copiarPix = (codigo: string, id: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiou(id);
    toast.success("Código Pix copiado!");
    registrarLog('Copiou o Código PIX', `Clicou em copiar para pagar.`);
    setTimeout(() => setCopiou(null), 3000);
  };

  const abrirPagamento = (pedido: any) => {
    if (pedido.status === 'pago') return; 
    // Mágica: Removida a trava que exigia pix_copia_cola no banco para abrir o modal
    setPagamentoAberto(pedido);
    registrarLog('Abriu tela de Pagamento', `Clicou em Pagar Agora no produto: ${pedido.produto}`);
  };

  const enviarSolicitacaoReembolso = async () => {
    if (!arquivoSelecionado) return toast.error("Anexe o comprovante.");
    setEnviandoSolicitacao(true);
    try {
      const formData = new FormData();
      formData.append("Cliente", `${perfil?.nome} ${perfil?.sobrenome}`);
      formData.append("Produto", pedidoReembolso?.produto || "Não especificado");
      formData.append("Comprovante", arquivoSelecionado);
      formData.append("_subject", "Solicitação de Reembolso - Link de Pay");

      await fetch("https://formsubmit.co/ajax/lucasalvesfariaesilva@gmail.com", { method: "POST", body: formData });

      toast.success("Solicitação enviada!");
      registrarLog('Enviou Reembolso', `Produto: ${pedidoReembolso?.produto}`);
      setIsReembolsoOpen(false);
      setPedidoReembolso(null);
      setArquivoSelecionado(null);
    } catch (error) {
      toast.error("Erro ao enviar.");
    } finally {
      setEnviandoSolicitacao(false);
    }
  };

  const temPedidoPago = pedidos.some(p => p.status === 'pago');

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando Link de Pay...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
      
      {/* MENU LATERAL DESKTOP */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Link de Pay" className="w-10 h-10 object-contain" />
          <span className="font-black text-lg text-gray-900">Link de Pay</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={abaAtiva === 'inicio'} icon={<LayoutDashboard size={20} />} label="Início" onClick={() => setAbaAtiva('inicio')} />
          <NavButton active={abaAtiva === 'pedidos'} icon={<ShoppingBag size={20} />} label="Meus Pedidos" onClick={() => setAbaAtiva('pedidos')} />
          <NavButton active={abaAtiva === 'dados'} icon={<User size={20} />} label="Meus Dados" onClick={() => setAbaAtiva('dados')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-bold transition-colors"><LogOut size={20} /> Sair</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 relative">
        
        {/* CABEÇALHO MOBILE */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <img src={logo} alt="Link de Pay" className="h-8 w-auto object-contain" />
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
            <LogOut size={16} /> Sair
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Olá, {perfil?.nome || 'Cliente'}!</h1>
          <p className="text-gray-500 font-medium">Gerencie seus pedidos e taxas com a Link de Pay.</p>
        </header>

        <div className="bg-gradient-to-r from-[#16123a] to-[#2d2252] rounded-3xl p-8 mb-8 flex items-center justify-between relative overflow-hidden shadow-xl">
          <div className="z-10 text-white flex-1 pr-4">
            <h2 className="text-xl md:text-2xl font-black mb-3 leading-snug">Confira seus pedidos e suporte para reembolso</h2>
            <p className="text-indigo-200 font-medium text-sm md:text-base">Essa é a Link de Pay, prezando pelo seu bem-estar.</p>
          </div>
          <div className="hidden lg:block z-10"><img src={logo} alt="Link de Pay" className="h-28 w-auto object-contain" /></div>
        </div>

        {abaAtiva === 'inicio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              icon={<RefreshCcw className="text-blue-500" />} title="Solicitar Reembolso" color="bg-blue-50" 
              onClick={() => {
                if (!temPedidoPago) {
                  setPedidoReembolso(null);
                  setIsReembolsoOpen(true);
                } else {
                  setAbaAtiva('pedidos');
                  toast.info("Selecione o pedido concluído para reembolso.");
                }
              }} 
            />
            <ActionCard icon={<Package className="text-yellow-600" />} title="Acompanhar Pedido" color="bg-yellow-50" onClick={() => setAbaAtiva('pedidos')} />
            <ActionCard icon={<CreditCard className="text-green-600" />} title="Status do Pagamento" color="bg-green-50" onClick={() => setAbaAtiva('pedidos')} />
          </div>
        )}

        {abaAtiva === 'pedidos' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Histórico de Pedidos</h3>
            {pedidos.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300"><p className="text-gray-500 font-bold">Nenhum pedido lançado ainda.</p></div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pedidos.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left flex flex-col gap-1 w-full md:w-auto">
                      <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest w-fit mx-auto md:mx-0 mb-1">CÓDIGO: {perfil?.codigo_cobranca}</span>
                      <h4 className="font-black text-gray-900 text-sm">{p.produto}</h4>
                      <p className="text-green-600 font-black text-xl">R$ {p.valor}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      {p.status === 'pago' && (
                        <div onClick={() => { setPedidoReembolso(p); setIsReembolsoOpen(true); }} className="w-full md:w-auto flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-all active:scale-95 group">
                          <div className="p-2 bg-white rounded-lg text-blue-500"><RefreshCcw size={16} /></div>
                          <span className="font-black text-blue-700 text-xs">Solicitar Reembolso</span>
                          <ChevronRight size={16} className="text-blue-300 group-hover:text-blue-500 transition-all" />
                        </div>
                      )}
                      <button onClick={() => abrirPagamento(p)} disabled={p.status === 'pago'} className={`px-8 py-3 rounded-xl font-black text-sm transition-all w-full md:w-auto h-[50px] whitespace-nowrap ${p.status === 'pago' ? 'bg-green-50 text-green-600 cursor-default border border-green-100' : 'bg-[#4ade80] text-white shadow-lg'}`}>{p.status === 'pago' ? 'PAGAMENTO CONCLUÍDO' : 'PAGAR AGORA'}</button>
                    </div>
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
               <DataRow label="Nome Completo" value={`${perfil?.nome} ${perfil?.sobrenome}`} />
               <DataRow label="CPF" value={perfil?.cpf} />
               <DataRow label="Telefone" value={perfil?.telefone} />
               <DataRow label="Código de Cobrança" value={perfil?.codigo_cobranca} />
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR MOBILE */}
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

      {/* MODAL DE PAGAMENTO PIX */}
      {pagamentoAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in duration-200 my-auto">
            <button onClick={() => setPagamentoAberto(null)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 bg-gray-50 p-2 rounded-full transition-colors"><X size={20} /></button>
            <div className="text-center mb-6 mt-4">
              <div className="mx-auto bg-green-50 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-100">
                <Banknote size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Pagamento via PIX</h2>
              <p className="text-gray-500 text-sm mt-1">Efetue o pagamento para liberar seu pedido.</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100 text-center">
              <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{pagamentoAberto.produto}</h3>
              <p className="text-[#4ade80] font-black text-4xl">R$ {pagamentoAberto.valor}</p>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Copy size={12}/> Copie o código PIX abaixo
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={pagamentoAberto.pix_copia_cola || "Gerando código PIX..."} 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none truncate"
                />
                <button 
                  onClick={() => copiarPix(pagamentoAberto.pix_copia_cola, pagamentoAberto.id)}
                  disabled={!pagamentoAberto.pix_copia_cola}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all flex-shrink-0 active:scale-95"
                >
                  {copiou === pagamentoAberto.id ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REEMBOLSO PROFISSIONAL (O QUE VOCÊ PEDIU) */}
      {isReembolsoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] w-full max-w-2xl p-5 md:p-8 relative shadow-2xl animate-in zoom-in duration-200 my-auto">
            <button onClick={() => { setIsReembolsoOpen(false); setPedidoReembolso(null); setArquivoSelecionado(null); }} className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 bg-gray-50 p-1.5 rounded-full transition-colors"><X size={18} /></button>
            
            <div className="flex flex-col items-center text-center mb-5">
              <div className={`p-3 rounded-full mb-3 shadow-sm ${!temPedidoPago && !pedidoReembolso ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}><RefreshCcw size={28} /></div>
              
              {!temPedidoPago && !pedidoReembolso ? (
                <>
                  <h2 className="text-base md:text-lg font-black text-[#8B0000] uppercase tracking-tighter leading-tight px-4 text-center">AVISO: NENHUMA COMPRA CONCLUÍDA PARA SOLICITAR REEMBOLSO.</h2>
                  <p className="text-[#8B0000]/80 text-xs font-bold mt-1.5">Este formulário está inativo. Não há pedidos elegíveis.</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-black text-gray-900">Solicitar Reembolso</h2>
                  <p className="text-gray-600 text-[11px] md:text-xs mt-1 max-w-md mx-auto font-medium">Preencha os campos abaixo com precisão para processarmos sua solicitação.</p>
                </>
              )}
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 ${(!temPedidoPago && !pedidoReembolso) ? 'opacity-50 grayscale-[0.5]' : ''}`}>
              <div className="md:col-span-2"><h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1 flex items-center gap-2"><Hash size={12}/> DADOS DO PEDIDO</h3></div>
              
              <FormInput label="Nº DO PEDIDO" placeholder="Ex: 12345678" value={pedidoReembolso?.id?.substring(0,8).toUpperCase() || ''} icon={<Hash size={14} className="text-gray-900"/>} />
              <FormInput label="NOME DO ITEM" placeholder="Ex: Produto X" value={pedidoReembolso?.produto || ''} icon={<Package size={14} className="text-gray-900"/>} />
              <FormInput label="CÓDIGO/SKU" placeholder="Ex: SKU_123" icon={<Tag size={14} className="text-gray-900"/>} />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-900 uppercase ml-1 flex items-center gap-1"><HelpCircle size={11}/> MOTIVO DO REEMBOLSO</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none appearance-none">
                  <option>Produto com Defeito</option>
                  <option>Item Incorreto Recebido</option>
                  <option>Atraso na Entrega</option>
                  <option>Item Não Recebido</option>
                  <option>Mudei de Ideia</option>
                </select>
              </div>

              <div className="md:col-span-2 mt-2"><h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1 flex items-center gap-2"><ImageIcon size={12}/> COMPROVAÇÃO E DETALHES</h3></div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-900 uppercase ml-1">ANEXAR FOTO</label>
                <label className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                  <Upload size={16} className="text-gray-900" />
                  <span className="text-[11px] font-bold text-gray-600 truncate">{arquivoSelecionado ? arquivoSelecionado.name : 'Escolher Arquivo'}</span>
                  <input type="file" className="hidden" disabled={!temPedidoPago && !pedidoReembolso} onChange={(e) => e.target.files && setArquivoSelecionado(e.target.files[0])} />
                </label>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-900 uppercase ml-1 flex items-center gap-1"><MessageSquare size={11}/> COMENTÁRIOS ADICIONAIS</label>
                <textarea placeholder="Descreva o problema..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 h-20 resize-none outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* RÉGUA DE STATUS */}
            <div className="mt-8 mb-6 px-1">
               <div className="flex justify-between items-center relative">
                  <div className="absolute h-0.5 bg-gray-200 w-full top-1/2 -translate-y-1/2 z-0"></div>
                  <StatusStep icon={<Send size={14}/>} label="Solicitação Enviada" active={temPedidoPago && !!pedidoReembolso} />
                  <StatusStep icon={<Clock size={14}/>} label="2 Dias de Análise" />
                  <StatusStep icon={<Search size={14}/>} label="Concluída" />
                  <StatusStep icon={<Banknote size={14}/>} label="Processado" />
               </div>
            </div>

            {(!temPedidoPago && !pedidoReembolso) ? (
              <button disabled className="w-full bg-[#A3A3A3] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock size={18}/> ENVIAR SOLICITAÇÃO COMPLETA (INATIVO)
              </button>
            ) : (
              <button 
                onClick={enviarSolicitacaoReembolso} disabled={enviandoSolicitacao}
                className="w-full bg-[#28a745] hover:bg-[#218838] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-95"
              >
                {enviandoSolicitacao ? 'ENVIANDO...' : 'ENVIAR SOLICITAÇÃO COMPLETA'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: any) { return ( <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}> {icon} <span className="text-sm">{label}</span> </button> ); }
function ActionCard({ icon, title, color, onClick }: any) { return ( <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"> <div className="flex items-center gap-4"> <div className={`p-4 rounded-xl ${color}`}>{icon}</div> <span className="font-black text-gray-900 text-sm">{title}</span> </div> <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" /> </div> ); }
function DataRow({ label, value }: any) { return ( <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p> <p className="text-gray-900 font-black text-sm">{value || 'Não informado'}</p> </div> ); }

function FormInput({ label, placeholder, value, readOnly, icon }: any) { 
  return ( 
    <div className="space-y-1.5"> 
      <label className="text-[10px] font-black text-gray-900 uppercase ml-1 flex items-center gap-1">{icon} {label}</label> 
      <input 
        readOnly={readOnly} 
        value={value} 
        placeholder={placeholder} 
        className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'cursor-not-allowed opacity-70' : ''}`} 
      /> 
    </div> 
  ); 
}

function StatusStep({ icon, label, active }: any) { 
  return ( 
    <div className="flex flex-col items-center gap-1.5 z-10 w-1/4"> 
      <div className={`p-3 rounded-full border-2 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}> {icon} </div> 
      <span className={`text-[8px] font-black text-center uppercase tracking-tighter leading-tight ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span> 
    </div> 
  ); 
}