import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, ShoppingCart, Check, Trash2, 
  RefreshCcw, Search, Plus, CreditCard 
} from 'lucide-react';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Admin() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  // Estados para nova venda
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    const { data: sales } = await supabase
      .from('vendas')
      .select('*, clientes(nome, sobrenome)')
      .order('created_at', { ascending: false });
    
    const { data: clients } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');

    if (sales) setVendas(sales);
    if (clients) setClientes(clients);
    setLoading(false);
  }

  // FUNÇÃO PARA EXCLUIR VENDA
  const excluirVenda = async (id: string) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta venda permanentemente?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('vendas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Venda excluída com sucesso!");
      setVendas(vendas.filter(v => v.id !== id));
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };

  const aprovarVenda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendas')
        .update({ status: 'pago' })
        .eq('id', id);

      if (error) throw error;
      toast.success("Venda aprovada!");
      carregarDados();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const lancarVenda = async () => {
    if (!clienteSelecionado || !produto || !valor) {
      return toast.error("Preencha todos os campos obrigatórios.");
    }

    try {
      const { error } = await supabase
        .from('vendas')
        .insert([{
          cliente_id: clienteSelecionado.id,
          produto,
          valor: parseFloat(valor),
          pix_copia_cola: pixCode,
          status: 'pendente'
        }]);

      if (error) throw error;
      toast.success("Venda lançada com sucesso!");
      setProduto('');
      setValor('');
      setPixCode('');
      carregarDados();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Carregando central de comando...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans p-4 md:p-8">
      {/* HEADER ADMIN */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Ck Soluções" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-500 font-medium text-sm">Gerencie clientes e lançamentos da CK</p>
          </div>
        </div>
        <button onClick={carregarDados} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition-all active:scale-95">
          <RefreshCcw size={20} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: SELECIONAR CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} /> 1. Selecionar Cliente
          </h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nome..." 
              className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {clientes.filter(c => c.nome.toLowerCase().includes(filtro.toLowerCase())).map(c => (
              <button 
                key={c.id}
                onClick={() => setClienteSelecionado(c)}
                className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm border ${clienteSelecionado?.id === c.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'}`}
              >
                {c.nome} {c.sobrenome}
              </button>
            ))}
          </div>
        </div>

        {/* COLUNA 2: DETALHES DO PEDIDO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShoppingCart size={16} /> 2. Detalhes do Pedido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Cliente Selecionado</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-sm">
                {clienteSelecionado ? `${clienteSelecionado.nome} ${clienteSelecionado.sobrenome}` : '---'}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Valor (R$)</label>
              <input 
                type="number" 
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 1400"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Produto</label>
            <input 
              type="text"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              placeholder="Ex: iPad Air M1 (5ª geração)..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
            />
          </div>
          <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Código Pix Copia e Cola</label>
            <textarea 
              value={pixCode}
              onChange={(e) => setPixCode(e.target.value)}
              placeholder="Cole o código PIX aqui..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs h-24 resize-none"
            />
          </div>
          <button 
            onClick={lancarVenda}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            Finalizar e Lançar Venda
          </button>
        </div>

        {/* TABELA DE VENDAS PENDENTES */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={16} /> Vendas Pendentes
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">
              {vendas.filter(v => v.status === 'pendente').length} AGUARDANDO
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vendas.filter(v => v.status === 'pendente').map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-gray-900 text-sm">
                      {v.clientes?.nome} {v.clientes?.sobrenome}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs font-medium max-w-xs truncate">
                      {v.produto}
                    </td>
                    <td className="px-6 py-5 font-black text-green-600 text-base">
                      R$ {v.valor}
                    </td>
                    <td className="px-6 py-5 flex justify-center gap-2">
                      <button 
                        onClick={() => aprovarVenda(v.id)}
                        className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-green-100 transition-all"
                      >
                        <Check size={14} /> Aprovar
                      </button>
                      
                      {/* BOTÃO EXCLUIR */}
                      <button 
                        onClick={() => excluirVenda(v.id)}
                        className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-red-100 transition-all"
                        title="Excluir Venda"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}