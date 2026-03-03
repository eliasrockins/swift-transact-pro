import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, ShoppingCart, Check, Trash2, 
  RefreshCcw, Search, CreditCard, AlertCircle, Package 
} from 'lucide-react';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Admin() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtosDB, setProdutosDB] = useState<any[]>([]); // NOVA LISTA
  const [loading, setLoading] = useState(true);
  const [filtroCliente, setFiltroCliente] = useState('');

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null); // ALTERADO
  const [valor, setValor] = useState('');
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      // 1. Carregar Vendas com os nomes dos clientes
      const { data: sales } = await supabase
        .from('vendas')
        .select('*, clientes(nome, sobrenome)')
        .order('created_at', { ascending: false });
      
      // 2. Carregar Clientes
      const { data: clients } = await supabase.from('clientes').select('*').order('nome');

      // 3. Carregar Lista de Produtos do Banco
      const { data: products } = await supabase.from('produtos').select('*').order('nome');

      setVendas(sales || []);
      setClientes(clients || []);
      setProdutosDB(products || []);
    } catch (error: any) {
      toast.error("Erro de sincronização com o banco.");
    } finally {
      setLoading(false);
    }
  }

  const excluirVenda = async (id: string) => {
    if (!window.confirm("Excluir esta venda?")) return;
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
      produto: produtoSelecionado.nome, // Pega o nome do produto da lista
      valor: parseFloat(valor),
      pix_copia_cola: pixCode,
      status: 'pendente'
    }]);

    if (error) return toast.error("Erro ao lançar.");
    toast.success("Venda lançada com sucesso!");
    setProdutoSelecionado(null); setValor(''); setPixCode('');
    carregarDados();
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold tracking-widest animate-pulse">SINCRONIZANDO CK SOLUÇÕES...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Painel Administrativo</h1>
        </div>
        <button onClick={carregarDados} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90">
          <RefreshCcw size={22} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. SELECIONAR CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-blue-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <Users size={16}/> 1. Escolher Cliente
          </h2>
          <input 
            type="text" placeholder="Buscar cliente..." 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {clientes.filter(c => c.nome.toLowerCase().includes(filtroCliente.toLowerCase())).map(c => (
              <button 
                key={c.id} 
                onClick={() => setClienteSelecionado(c)} 
                className={`w-full text-left p-4 rounded-xl text-sm font-bold border transition-all ${clienteSelecionado?.id === c.id ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-300'}`}
              >
                {c.nome} {c.sobrenome}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SELECIONAR PRODUTO E LANÇAR */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-green-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <ShoppingCart size={16}/> 2. Detalhes do Novo Pedido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Cliente Ativo</label>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-black text-sm">
                  {clienteSelecionado ? `${clienteSelecionado.nome} ${clienteSelecionado.sobrenome}` : 'Nenhum selecionado'}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Valor da Taxa (R$)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 1400" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-green-500 outline-none" 
                  value={valor} 
                  onChange={e => setValor(e.target.value)} 
                />
             </div>
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Selecione o Produto da Lista</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
              {produtosDB.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProdutoSelecionado(p)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${produtoSelecionado?.id === p.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
                >
                  <Package size={16} /> {p.nome}
                </button>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Cole aqui o Código Pix Copia e Cola..." 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-[10px] font-mono h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
            value={pixCode} 
            onChange={e => setPixCode(e.target.value)} 
          />
          
          <button 
            onClick={lancarVenda} 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 transition-all active:scale-[0.98]"
          >
            Finalizar e Lançar Venda
          </button>
        </div>

        {/* TABELA DE VENDAS */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={16}/> Vendas Aguardando Pagamento
            </h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black">
              {vendas.filter(v => v.status?.toLowerCase() === 'pendente').length} PEDIDOS
            </span>
          </div>
          
          <div className="overflow-x-auto">
            {vendas.filter(v => v.status?.toLowerCase() === 'pendente').length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center gap-4">
                <AlertCircle className="text-gray-200" size={60} />
                <p className="text-gray-400 font-bold">Nenhuma venda pendente no momento.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5">Produto</th>
                    <th className="px-8 py-5">Valor</th>
                    <th className="px-8 py-5 text-center">Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendas.filter(v => v.status?.toLowerCase() === 'pendente').map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 font-bold text-gray-900 text-sm">
                        {v.clientes ? `${v.clientes.nome} ${v.clientes.sobrenome}` : 'Cadastro Incompleto'}
                      </td>
                      <td className="px-8 py-6 text-gray-500 text-xs font-bold italic">{v.produto}</td>
                      <td className="px-8 py-6 font-black text-green-600 text-lg">R$ {v.valor}</td>
                      <td className="px-8 py-6 flex justify-center gap-3">
                        <button className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-green-600 hover:text-white transition-all">Aprovar</button>
                        <button onClick={() => excluirVenda(v.id)} className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
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
    </div>
  );
}