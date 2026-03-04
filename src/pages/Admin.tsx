import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingCart, Trash2, 
  RefreshCcw, CreditCard, Package, Plus, X, LogOut, Edit3, Tag 
} from 'lucide-react';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [vendas, setVendas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtosDB, setProdutosDB] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filtroCliente, setFiltroCliente] = useState('');

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null); 
  const [valor, setValor] = useState('');
  const [pixCode, setPixCode] = useState('');

  // ESTADOS DO MODAL DE PRODUTOS
  const [isModalProdutoOpen, setIsModalProdutoOpen] = useState(false);
  const [novoProdutoNome, setNovoProdutoNome] = useState('');
  const [novoProdutoValor, setNovoProdutoValor] = useState('');

  // ESTADOS DO MODAL DE EDITAR PIX
  const [isModalPixOpen, setIsModalPixOpen] = useState(false);
  const [vendaEditando, setVendaEditando] = useState<any>(null);
  const [novoPix, setNovoPix] = useState('');

  // ESTADOS DO MODAL DE EDITAR CÓDIGO DE COBRANÇA
  const [isModalCodigoOpen, setIsModalCodigoOpen] = useState(false);
  const [vendaEditandoCodigo, setVendaEditandoCodigo] = useState<any>(null);
  const [novoCodigo, setNovoCodigo] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const { data: sales } = await supabase
        .from('vendas')
        .select('*, clientes(nome, sobrenome, telefone, codigo_cobranca)')
        .order('created_at', { ascending: false });
      
      const { data: clients } = await supabase.from('clientes').select('*').order('nome');
      const { data: products } = await supabase.from('produtos').select('*').order('nome');

      setVendas(sales || []);
      setClientes(clients || []);
      setProdutosDB(products || []);
    } catch (error: any) {
      toast.error("Erro de sincronização.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const aprovarVenda = async (id: string) => {
    const confirmar = window.confirm("Deseja realmente aprovar esta venda e marcar como paga?");
    if (!confirmar) return;

    const { error } = await supabase.from('vendas').update({ status: 'pago' }).eq('id', id);
    if (error) return toast.error("Erro ao aprovar.");
    toast.success("Venda aprovada com sucesso!");
    carregarDados();
  };

  const excluirVenda = async (id: string) => {
    if (!window.confirm("Excluir esta venda permanentemente?")) return;
    await supabase.from('vendas').delete().eq('id', id);
    toast.success("Venda removida!");
    carregarDados();
  };

  const lancarVenda = async () => {
    if (!clienteSelecionado || !produtoSelecionado || !valor) {
      return toast.error("Selecione o cliente, o produto e o valor.");
    }
    
    const { error } = await supabase.from('vendas').insert([{
      cliente_id: clienteSelecionado.id,
      produto: produtoSelecionado.nome, 
      valor: parseFloat(valor),
      pix_copia_cola: pixCode,
      status: 'pendente'
    }]);

    if (error) return toast.error("Erro ao lançar.");
    toast.success("Venda lançada!");
    setProdutoSelecionado(null); setValor(''); setPixCode('');
    carregarDados();
  };

  const cadastrarNovoProduto = async () => {
    if (!novoProdutoNome.trim()) return toast.error("O nome do produto é obrigatório.");

    const { error } = await supabase.from('produtos').insert([{
      nome: novoProdutoNome,
      valor_sugerido: novoProdutoValor ? parseFloat(novoProdutoValor) : 0
    }]);

    if (error) return toast.error("Erro ao salvar o produto.");

    toast.success("Produto cadastrado com sucesso!");
    setIsModalProdutoOpen(false);
    setNovoProdutoNome(''); 
    setNovoProdutoValor('');
    carregarDados(); 
  };

  const abrirModalPix = (venda: any) => {
    setVendaEditando(venda);
    setNovoPix(venda.pix_copia_cola || '');
    setIsModalPixOpen(true);
  };

  const salvarNovoPix = async () => {
    if (!novoPix.trim()) return toast.error("O código Pix não pode estar vazio.");
    const { error } = await supabase.from('vendas').update({ pix_copia_cola: novoPix }).eq('id', vendaEditando.id);
    if (error) return toast.error("Erro ao atualizar o Pix.");

    toast.success("Código Pix atualizado com sucesso!");
    setIsModalPixOpen(false);
    setVendaEditando(null);
    setNovoPix('');
    carregarDados();
  };

  const abrirModalCodigo = (venda: any) => {
    setVendaEditandoCodigo(venda);
    setNovoCodigo(venda.clientes?.codigo_cobranca || '');
    setIsModalCodigoOpen(true);
  };

  const salvarNovoCodigo = async () => {
    if (!novoCodigo.trim()) return toast.error("O código não pode estar vazio.");
    
    const { error } = await supabase.from('clientes').update({ codigo_cobranca: novoCodigo }).eq('id', vendaEditandoCodigo.cliente_id);
    
    if (error) return toast.error("Erro ao atualizar o código do cliente.");

    toast.success("Código de cobrança atualizado com sucesso!");
    setIsModalCodigoOpen(false);
    setVendaEditandoCodigo(null);
    setNovoCodigo('');
    carregarDados();
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">SINCRONIZANDO...</div>;

  const vendasPendentes = vendas.filter(v => v.status?.toLowerCase() === 'pendente');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans relative">
      
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-xl md:text-2xl font-black text-gray-900">Painel Administrativo</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={carregarDados} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all text-gray-900" title="Atualizar dados">
            <RefreshCcw size={22} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm">
            <LogOut size={20} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. SELECIONAR CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-blue-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <Users size={16}/> 1. Escolher Cliente
          </h2>
          <input 
            type="text" placeholder="Buscar cliente..." 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
          {/* AQUI ESTÁ A CORREÇÃO DA ALTURA: max-h-[500px] em vez de max-h-64 */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {clientes.filter(c => c.nome.toLowerCase().includes(filtroCliente.toLowerCase())).map(c => (
              <button 
                key={c.id} 
                onClick={() => setClienteSelecionado(c)} 
                className={`w-full text-left p-4 rounded-xl text-sm font-bold border transition-all flex justify-between items-center ${clienteSelecionado?.id === c.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-900 hover:border-gray-400'}`}
              >
                <span>{c.nome} {c.sobrenome}</span>
                <span className={`text-[10px] font-medium ${clienteSelecionado?.id === c.id ? 'text-blue-200' : 'text-gray-500'}`}>
                  {c.telefone || 'S/ Tel'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. NOVO PEDIDO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-green-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <ShoppingCart size={16}/> 2. Novo Pedido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-black text-sm flex flex-col justify-center">
                {clienteSelecionado ? (
                  <>
                    <span>{clienteSelecionado.nome} {clienteSelecionado.sobrenome}</span>
                    <span className="text-[11px] font-medium text-blue-600 mt-1">{clienteSelecionado.telefone}</span>
                  </>
                ) : 'Selecione um cliente ao lado'}
             </div>
             <input 
               type="number" placeholder="Valor Cobrado (R$)" 
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-gray-900 outline-none focus:ring-2 focus:ring-green-500" 
               value={valor} 
               onChange={e => setValor(e.target.value)} 
             />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Selecione o Produto</label>
              <button 
                onClick={() => setIsModalProdutoOpen(true)}
                className="text-[10px] font-black text-white uppercase bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-blue-200"
              >
                <Plus size={14} /> Criar Produto
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 custom-scrollbar">
              {produtosDB.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProdutoSelecionado(p)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all text-left ${produtoSelecionado?.id === p.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-900 border-gray-200 hover:border-green-500'}`}
                >
                  <Package size={16} className="shrink-0" /> <span className="truncate">{p.nome}</span>
                </button>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Cole aqui o Código Pix..." 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-[11px] font-mono font-bold text-gray-900 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
            value={pixCode} 
            onChange={e => setPixCode(e.target.value)} 
          />
          
          <button 
            onClick={lancarVenda} 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-200"
          >
            Lançar Venda Oficial
          </button>
        </div>

        {/* TABELA DE VENDAS */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={16}/> Vendas Pendentes
            </h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black">
              {vendasPendentes.length} AGUARDANDO
            </span>
          </div>
          <div className="overflow-x-auto">
            {vendasPendentes.length === 0 ? (
              <div className="p-16 text-center"><p className="text-gray-400 font-bold">Nenhum pedido pendente.</p></div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5">Produto</th>
                    <th className="px-8 py-5">Valor</th>
                    <th className="px-8 py-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendasPendentes.map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/30">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900 text-sm">{v.clientes?.nome} {v.clientes?.sobrenome}</div>
                        <div className="text-[10px] text-gray-500 font-medium mt-1">{v.clientes?.telefone || 'S/ Tel'}</div>
                        <div className="text-[10px] text-green-600 font-black mt-1 uppercase">CÓD: {v.clientes?.codigo_cobranca || 'S/ CÓDIGO'}</div>
                      </td>
                      <td className="px-8 py-6 text-gray-900 text-xs font-bold italic">{v.produto}</td>
                      <td className="px-8 py-6 font-black text-green-600 text-lg">R$ {v.valor}</td>
                      <td className="px-8 py-6 flex justify-center items-center gap-2">
                        
                        <button 
                          onClick={() => abrirModalCodigo(v)} 
                          className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-purple-100 transition-all flex items-center gap-1.5"
                          title="Editar Código de Cobrança"
                        >
                          <Tag size={14} /> Cód
                        </button>
                        
                        <button 
                          onClick={() => abrirModalPix(v)} 
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-100 transition-all flex items-center gap-1.5"
                        >
                          <Edit3 size={14} /> Pix
                        </button>
                        
                        <button 
                          onClick={() => aprovarVenda(v.id)} 
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-green-600 hover:text-white transition-all"
                        >
                          Aprovar
                        </button>
                        
                        <button 
                          onClick={() => excluirVenda(v.id)} 
                          className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA CRIAR NOVO PRODUTO */}
      {isModalProdutoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <button onClick={() => setIsModalProdutoOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            <div className="flex flex-col items-center text-center gap-4 mb-8 mt-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-600"><Package size={32} /></div>
              <div><h2 className="text-2xl font-black text-gray-900">Novo Produto</h2><p className="text-gray-500 text-sm mt-2">Cadastre um novo item no banco de dados.</p></div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nome do Produto / Aparelho *</label>
                <input autoFocus value={novoProdutoNome} onChange={e => setNovoProdutoNome(e.target.value)} placeholder="Ex: iPhone 14 Pro Max 256GB" className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Valor Sugerido (R$) - Opcional</label>
                <input type="number" value={novoProdutoValor} onChange={e => setNovoProdutoValor(e.target.value)} placeholder="Ex: 5500" className="w-full p-4 border border-gray-200 rounded-xl