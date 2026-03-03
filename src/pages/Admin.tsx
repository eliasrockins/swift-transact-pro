import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, ShoppingCart, Check, Trash2, 
  RefreshCcw, Search, CreditCard, AlertCircle 
} from 'lucide-react';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Admin() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      // Buscamos as vendas e tentamos trazer o nome do cliente junto
      const { data: sales, error: salesError } = await supabase
        .from('vendas')
        .select(`
          *,
          clientes (
            nome,
            sobrenome
          )
        `)
        .order('created_at', { ascending: false });
      
      if (salesError) throw salesError;

      const { data: clients, error: clientsError } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');

      if (clientsError) throw clientsError;

      setVendas(sales || []);
      setClientes(clients || []);
    } catch (error: any) {
      console.error("Erro ao carregar:", error);
      toast.error("Erro ao sincronizar com o banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  const excluirVenda = async (id: string) => {
    const confirmar = window.confirm("Excluir esta venda permanentemente?");
    if (!confirmar) return;

    const { error } = await supabase.from('vendas').delete().eq('id', id);
    if (error) return toast.error("Erro ao excluir.");
    
    toast.success("Venda removida!");
    carregarDados();
  };

  const aprovarVenda = async (id: string) => {
    const { error } = await supabase.from('vendas').update({ status: 'pago' }).eq('id', id);
    if (error) return toast.error("Erro ao aprovar.");
    toast.success("Venda aprovada!");
    carregarDados();
  };

  const lancarVenda = async () => {
    if (!clienteSelecionado || !produto || !valor) return toast.error("Preencha os campos.");
    
    const { error } = await supabase.from('vendas').insert([{
      cliente_id: clienteSelecionado.id,
      produto,
      valor: parseFloat(valor),
      pix_copia_cola: pixCode,
      status: 'pendente'
    }]);

    if (error) return toast.error("Erro ao lançar.");
    toast.success("Venda lançada!");
    setProduto(''); setValor(''); setPixCode('');
    carregarDados();
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Sincronizando...</div>;

  const vendasPendentes = vendas.filter(v => v.status === 'pendente');

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-black text-gray-900">Painel Administrativo</h1>
        </div>
        <button onClick={carregarDados} className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
          <RefreshCcw size={20} className="text-gray-600" />
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BUSCA DE CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-blue-600 uppercase mb-6 flex items-center gap-2"><Users size={16}/> 1. Cliente</h2>
          <input 
            type="text" placeholder="Buscar..." 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm"
            onChange={(e) => setFiltro(e.target.value)}
          />
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {clientes.filter(c => c.nome.toLowerCase().includes(filtro.toLowerCase())).map(c => (
              <button key={c.id} onClick={() => setClienteSelecionado(c)} className={`w-full text-left p-3 rounded-lg text-sm font-bold border ${clienteSelecionado?.id === c.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-transparent'}`}>
                {c.nome} {c.sobrenome}
              </button>
            ))}
          </div>
        </div>

        {/* LANÇAMENTO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black text-green-600 uppercase mb-6 flex items-center gap-2"><ShoppingCart size={16}/> 2. Novo Pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
              {clienteSelecionado ? `${clienteSelecionado.nome} ${clienteSelecionado.sobrenome}` : 'Selecione um cliente ao lado'}
            </div>
            <input type="number" placeholder="Valor (Ex: 1400)" className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={valor} onChange={e => setValor(e.target.value)} />
          </div>
          <input type="text" placeholder="Produto" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm font-bold" value={produto} onChange={e => setProduto(e.target.value)} />
          <textarea placeholder="Código Pix" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-xs h-20" value={pixCode} onChange={e => setPixCode(e.target.value)} />
          <button onClick={lancarVenda} className="w-full bg-green-500 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-600 transition-all">Lançar Venda</button>
        </div>

        {/* LISTA DE VENDAS */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><CreditCard size={16}/> Vendas Pendentes</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">{vendasPendentes.length} AGUARDANDO</span>
          </div>
          
          <div className="overflow-x-auto">
            {vendasPendentes.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <AlertCircle className="text-gray-300" size={48} />
                <p className="text-gray-500 font-medium">Nenhuma venda pendente encontrada.</p>
              </div>
            ) : (
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
                  {vendasPendentes.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-gray-900 text-sm">
                        {v.clientes ? `${v.clientes.nome} ${v.clientes.sobrenome}` : 'Cliente não encontrado'}
                      </td>
                      <td className="px-6 py-5 text-gray-500 text-xs font-medium max-w-xs truncate">{v.produto}</td>
                      <td className="px-6 py-5 font-black text-green-600 text-base">R$ {v.valor}</td>
                      <td className="px-6 py-5 flex justify-center gap-2">
                        <button onClick={() => aprovarVenda(v.id)} className="bg-green-50 text-green-600 px-3 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-green-100 transition-all">Aprovar</button>
                        <button onClick={() => excluirVenda(v.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-red-100 transition-all"><Trash2 size={14} /></button>
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