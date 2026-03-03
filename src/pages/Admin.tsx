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
  const [produtosDB, setProdutosDB] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filtroCliente, setFiltroCliente] = useState('');

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null); 
  const [valor, setValor] = useState('');
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const { data: sales } = await supabase
        .from('vendas')
        .select('*, clientes(nome, sobrenome)')
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

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">SINCRONIZANDO...</div>;

  const vendasPendentes = vendas.filter(v => v.status?.toLowerCase() === 'pendente');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-2xl font-black text-gray-900">Painel Administrativo</h1>
        </div>
        <button onClick={carregarDados} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all">
          <RefreshCcw size={22} className="text-gray-900" />
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. SELECIONAR CLIENTE (Texto em Preto) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-blue-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <Users size={16}/> 1. Escolher Cliente
          </h2>
          <input 
            type="text" placeholder="Buscar cliente..." 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {clientes.filter(c => c.nome.toLowerCase().includes(filtroCliente.toLowerCase())).map(c => (
              <button 
                key={c.id} 
                onClick={() => setClienteSelecionado(c)} 
                className={`w-full text-left p-4 rounded-xl text-sm font-bold border transition-all ${clienteSelecionado?.id === c.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 hover:border-gray-400'}`}
              >
                {c.nome} {c.sobrenome}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SELECIONAR PRODUTO (Ajustado para text-gray-900) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-green-600 uppercase mb-6 flex items-center gap-2 tracking-widest">
            <ShoppingCart size={16}/> 2. Novo Pedido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-black text-sm">
                {clienteSelecionado ? `${clienteSelecionado.nome} ${clienteSelecionado.sobrenome}` : 'Selecione um cliente'}
             </div>
             <input 
               type="number" placeholder="Valor (R$)" 
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-gray-900 outline-none focus:ring-2 focus:ring-green-500" 
               value={valor} 
               onChange={e => setValor(e.target.value)} 
             />
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 mb-2 block">Selecione o Produto (Lista atualizada)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
              {produtosDB.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProdutoSelecionado(p)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${produtoSelecionado?.id === p.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-900 border-gray-200 hover:border-green-500'}`}
                >
                  <Package size={16} /> {p.nome}
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
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Lançar Venda Oficial
          </button>
        </div>

        {/* TABELA (Texto Reforçado) */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={16}/> Vendas Pendentes
            </h2>
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
                      <td className="px-8 py-6 font-bold text-gray-900 text-sm">{v.clientes?.nome} {v.clientes?.sobrenome}</td>
                      <td className="px-8 py-6 text-gray-900 text-xs font-bold italic">{v.produto}</td>
                      <td className="px-8 py-6 font-black text-green-600 text-lg">R$ {v.valor}</td>
                      <td className="px-8 py-6 flex justify-center gap-3">
                        <button className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase">Aprovar</button>
                        <button onClick={() => excluirVenda(v.id)} className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all">
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