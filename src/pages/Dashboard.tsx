import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, LayoutDashboard, ShoppingBag, 
  LogOut, ChevronRight, RefreshCcw, Package, 
  CreditCard, X, Copy, Check, ArrowLeft, Clock, Key, AlertCircle, Upload, FileText, Image as ImageIcon
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
  
  const [segundosRestantes, setSegundosRestantes] = useState(1200);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);
  const [isAlertPedidoOpen, setIsAlertPedidoOpen] = useState(false);

  // ESTADOS PARA REEMBOLSO E UPLOAD
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') setIsResetModalOpen(true);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function carregarDados() {
      if (!user) {
        setLoading(false); 
        return;
      }
      
      const { data: profile } = await supabase.from('clientes').select('*').eq('id', user.id).single();
      const { data: sales } = await supabase.from('vendas').select('*').eq('cliente_id', user.id).order('created_at', { ascending: false });
      
      if (profile) {
        setPerfil(profile);
        if (!window.sessionStorage.getItem('log_login')) {
          registrarLog('Acessou o Sistema', 'O cliente abriu o painel (Login efetuado).');
          window.sessionStorage.setItem('log_login', 'true');
        }
      }
      if (sales) setPedidos(sales);
      setLoading(false);
    }
    carregarDados();
  }, [user]);

  useEffect(() => {
    let intervalo: any;
    if (pagamentoAberto) {
      intervalo = setInterval(() => setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    } else {
      setSegundosRestantes(1200); 
    }
    return () => clearInterval(intervalo);
  }, [pagamentoAberto]);

  const formatarTempo = (totalSegundos: number) => {
    const m = Math.floor(totalSegundos / 60);
    const s = totalSegundos % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
    if (!pedido.pix_copia_cola) return toast.info("Aguarde. O administrador ainda está gerando sua cobrança.");
    setPagamentoAberto(pedido);
    registrarLog('Abriu tela de Pagamento', `Clicou em Pagar Agora no produto: ${pedido.produto}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoSelecionado(e.target.files[0]);
    }
  };

  const enviarSolicitacaoReembolso = async () => {
    if (!arquivoSelecionado) {
      return toast.error("Por favor, anexe o comprovante de pagamento.");
    }

    setEnviandoSolicitacao(true);

    try {
      // Usando FormData para enviar o arquivo via FormSubmit
      const formData = new FormData();
      formData.append("Cliente", `${perfil?.nome} ${perfil?.sobrenome}`);
      formData.append("Email", perfil?.email || "Não informado");
      formData.append("Produto", pedidoReembolso?.produto);
      formData.append("Valor", `R$ ${pedidoReembolso?.valor}`);
      formData.append("Comprovante", arquivoSelecionado);
      formData.append("_subject", "Nova Solicitação de Reembolso - CK Soluções");
      formData.append("_template", "table");

      // Envia para o seu e-mail configurado
      const response = await fetch("https://formsubmit.co/ajax/lucasalvesfariaesilva@gmail.com", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success("Solicitação enviada com sucesso!");
        registrarLog('Enviou formulário de Reembolso', `O cliente enviou comprovante do produto: ${pedidoReembolso?.produto}`);
        setIsReembolsoOpen(false);
        setPedidoReembolso(null);
        setArquivoSelecionado(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setEnviandoSolicitacao(false);
    }
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
      registrarLog('Alterou a Senha', 'O cliente redefiniu a própria senha de acesso.');
    }
    setAtualizandoSenha(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando CK Soluções...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans relative">
      
      {/* MENU LATERAL */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Ck Soluções" className="w-10 h-10 object-contain" />
          <span className="font-black text-lg text-gray-900">Ck Soluções</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={abaAtiva === 'inicio'} icon={<LayoutDashboard size={20} />} label="Início" onClick={() => { setAbaAtiva('inicio'); registrarLog('Acessou: Início', 'Navegou usando o menu.'); }} />
          <NavButton active={abaAtiva === 'pedidos'} icon={<ShoppingBag size={20} />} label="Meus Pedidos" onClick={() => { setAbaAtiva('pedidos'); registrarLog('Acessou: Meus Pedidos', 'Navegou usando o menu.'); }} />
          <NavButton active={abaAtiva === 'dados'} icon={<User size={20} />} label="Meus Dados" onClick={() => { setAbaAtiva('dados'); registrarLog('Acessou: Meus Dados', 'Navegou usando o menu.'); }} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-bold transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 relative">
        {/* Header Mobile e Conteúdo Principal */}
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Olá, {perfil?.nome || 'Cliente'}!</h1>
          <p className="text-gray-500 font-medium">Gerencie seus pedidos e taxas com a CK.</p>
        </header>

        <div className="bg-gradient-to-r from-[#16123a] to-[#2d2252] rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl">
          <div className="z-10 max-w-2xl text-white">
            <h2 className="text-xl md:text-2xl font-black mb-3 leading-snug">Confira seus pedidos e suporte para reembolso</h2>
            <p className="text-indigo-200 font-medium text-sm md:text-base">Essa é a CK, prezando pelo seu bem-estar.</p>
          </div>
        </div>

        {abaAtiva === 'inicio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              icon={<RefreshCcw className="text-blue-500" />} title="Solicitar Reembolso" color="bg-blue-50" 
              onClick={() => { 
                const pedidosPagos = pedidos.filter(p => p.status === 'pago');
                if (pedidosPagos.length === 0) {
                  setIsAlertPedidoOpen(true);
                } else {
                  setAbaAtiva('pedidos'); 
                  toast.info("Selecione o pedido que deseja reembolsar.");
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
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">Nenhum pedido lançado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pedidos.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left flex flex-col gap-1 w-full md:w-auto">
                      <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest w-fit">CÓDIGO: {perfil?.codigo_cobranca}</span>
                      <h4 className="font-black text-gray-900 text-sm">{p.produto}</h4>
                      <p className="text-green-600 font-black text-xl">R$ {p.valor}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      {p.status === 'pago' && (
                        <div 
                          onClick={() => { setPedidoReembolso(p); setIsReembolsoOpen(true); }}
                          className="w-full md:w-auto flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-all active:scale-95 group"
                        >
                          <div className="p-2 bg-white rounded-lg text-blue-500"><RefreshCcw size={16} /></div>
                          <span className="font-black text-blue-700 text-xs">Solicitar Reembolso</span>
                          <ChevronRight size={16} className="text-blue-300 group-hover:text-blue-500 transition-all" />
                        </div>
                      )}
                      <button onClick={() => abrirPagamento(p)} disabled={p.status === 'pago'} className={`px-8 py-3 rounded-xl font-black text-sm transition-all w-full md:w-auto ${p.status === 'pago' ? 'bg-green-50 text-green-600 cursor-default' : 'bg-[#4ade80] text-white shadow-lg'}`}>
                        {p.status === 'pago' ? 'PAGAMENTO CONCLUÍDO' : 'PAGAR AGORA'}
                      </button>
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

      {/* MODAL DE AVISO AÇÃO INVÁLIDA */}
      {isAlertPedidoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in duration-200 text-center flex flex-col items-center">
            <button onClick={() => setIsAlertPedidoOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full"><X size={18} /></button>
            <div className="p-4 rounded-full bg-red-50 text-red-500 mb-5 mt-2"><AlertCircle size={36} /></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Ação Inválida</h2>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">Só é possível solicitar reembolso caso haja algum <strong className="text-gray-800">PAGAMENTO CONCLUÍDO</strong> na sua conta.</p>
            <button onClick={() => setIsAlertPedidoOpen(false)} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black active:scale-95 uppercase tracking-widest text-xs">Entendi</button>
          </div>
        </div>
      )}

      {/* MODAL DE REEMBOLSO ATUALIZADO COM UPLOAD */}
      {isReembolsoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <button onClick={() => { setIsReembolsoOpen(false); setArquivoSelecionado(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            <div className="flex flex-col items-center text-center gap-4 mb-6 mt-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-600"><RefreshCcw size={32} /></div>
              <div><h2 className="text-2xl font-black text-gray-900">Solicitar Reembolso</h2><p className="text-gray-500 text-sm mt-2">Envie seu comprovante para análise.</p></div>
            </div>
            
            <div className="space-y-4">
              <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Titular</label><input readOnly value={`${perfil?.nome} ${perfil?.sobrenome}`} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pedido Selecionado</label><input readOnly value={pedidoReembolso?.produto} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold outline-none truncate" /></div>

              {/* CAMPO DE UPLOAD ESTILIZADO */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1">Anexe o Comprovante de Pagamento</label>
                <div className="relative group">
                  <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${arquivoSelecionado ? 'border-green-400 bg-green-50' : 'border-blue-200 bg-blue-50 group-hover:border-blue-400'}`}>
                    {arquivoSelecionado ? (
                      <>
                        {arquivoSelecionado.type.includes('image') ? <ImageIcon className="text-green-500 mb-2" size={30} /> : <FileText className="text-green-500 mb-2" size={30} />}
                        <span className="text-xs font-black text-green-700 truncate max-w-[200px]">{arquivoSelecionado.name}</span>
                        <span className="text-[10px] text-green-600 font-medium">Clique para trocar</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-blue-500 mb-2" size={30} />
                        <span className="text-xs font-black text-blue-700">Clique para selecionar PDF ou Imagem</span>
                        <span className="text-[10px] text-blue-400 font-medium">Tamanho máximo: 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={enviarSolicitacaoReembolso} 
                disabled={enviandoSolicitacao}
                className={`w-full py-4 rounded-xl font-black shadow-lg transition-all active:scale-95 mt-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${enviandoSolicitacao ? 'bg-gray-400' : 'bg-[#28a745] hover:bg-[#218838] text-white'}`}
              >
                {enviandoSolicitacao ? 'Enviando...' : 'ENVIAR SOLICITAÇÃO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: any) { return ( <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}> {icon} <span className="text-sm">{label}</span> </button> ); }
function ActionCard({ icon, title, color, onClick }: any) { return ( <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"> <div className="flex items-center gap-4"> <div className={`p-4 rounded-xl ${color}`}>{icon}</div> <span className="font-black text-gray-900 text-sm">{title}</span> </div> <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" /> </div> ); }
function DataRow({ label, value }: any) { return ( <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p> <p className="text-gray-900 font-black text-sm">{value || 'Não informado'}</p> </div> ); }