import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, LogOut, Search, 
  PlusCircle, Edit2, X, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Admin() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificandoAuth, setVerificandoAuth] = useState(true);
  
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [valorManual, setValorManual] = useState('');
  const [pixManual, setPixManual] = useState('');
  const [novoProdutoNome, setNovoProdutoNome] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [vendaParaEditar, setVendaParaEditar] = useState<any>(null);
  const [novoPixEdit, setNovoPixEdit] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!session || !user) {
        navigate('/auth');
        return;
      }

      try {
        const { data: isAdmin, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .ilike('email', user.email) 
          .single();

        const emailsReserva = ["eliasvieiramartinsml@gmail.com", "lucasalvesfariaesilva@gmail.com"];
        
        if (adminError || !isAdmin) {
           if (!emailsReserva.includes(user.email.toLowerCase())) {
              toast.error("Acesso bloqueado: Apenas administradores podem entrar aqui.");
              navigate('/');
              return;
           }
        }

        await carregarDados();
      } catch (err) {
        console.error(err);
        if (user.email.toLowerCase() === "eliasvieiramartinsml@gmail.com") {
            await carregarDados();
        }
      } finally {
        setVerificandoAuth(false);
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [session, user, navigate]);

  const carregarDados = async () => {
    const { data: c } = await supabase.from('clientes').select('*').order('nome');
    const { data: p } = await supabase.from('produtos').select('*').order('nome');
    const { data: v } = await supabase.from('vendas')
      .select('*, clientes(nome, sobrenome)')
      .eq('status', 'pendente')
      .order('created_at', { ascending: false });

    if (c) setClientes(c);
    if (p) setProdutos(p);
    if (v) setVendas(v);
  };

  const handleCadastrarProduto = async () => {
    if (!novoProdutoNome.trim()) return toast.error("Digite o nome do produto!");
    const { error } = await supabase.from('produtos').insert([{ nome: novoProdutoNome }]);
    if (!error) {
      toast.success("Produto cadastrado!");
      setNovoProdutoNome('');
      carregarDados();
    }
  };

  const handleLancarVenda = async () => {
    if (!clienteSelecionado || !produtoSelecionado || !valorManual) {
      return toast.error("Preencha todos os campos obrigatórios!");
    }

    const { error } = await supabase.from('vendas').insert([{
      cliente_id: clienteSelecionado.id,
      produto: produtoSelecionado.nome,
      valor: parseFloat(valorManual),
      pix_copia_cola: pixManual,
      status: 'pendente'
    }]);

    if (!error) {
      toast.success("Cobrança lançada!");
      setClienteSelecionado(null);
      setValorManual('');
      setPixManual('');
      carregarDados();
    }
  };

  const handleAprovarPagamento = async (id: string) => {
    const { error } = await supabase.from('vendas').update({ status: 'pago' }).eq('id', id);
    if (!error) {
      toast.success("Venda aprovada!");
      carregarDados();
    }
  };

  const handleUpdatePix = async () => {
    const { error } = await supabase.from('vendas').update({ pix_copia_cola: novoPixEdit }).eq('id', vendaParaEditar.id);
    if (!error) {
      toast.success("PIX atualizado!");
      setModalOpen(false);
      carregarDados();
    }
  };

  const vendasFiltradas = vendas.filter(v => 
    `${v.clientes?.nome} ${v.clientes?.sobrenome}`.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  if (verificandoAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f1f3f5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-bold text-blue-600">Validando acesso do Administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f1f3f5]">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src={logo} alt="Ck Soluções" className="w-10 h-10" />
          <span className="font-bold text-lg text-gray-900">Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <div className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm uppercase">
            <LayoutDashboard size={18} /> GESTÃO DE VENDAS
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={18} /> Sair do Painel
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* COLUNA 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-green-600 font-bold uppercase text-xs">1. Selecionar Cliente</h2>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  placeholder="Buscar nome..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-gray-400" 
                  onChange={(e) => setBuscaCliente(e.target.value)} 
                />
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {clientes.filter(c => `${c.nome} ${c.sobrenome}`.toLowerCase().includes(buscaCliente.toLowerCase())).map(c => (
                  <button key={c.id} onClick={() => setClienteSelecionado(c)} className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-all ${clienteSelecionado?.id === c.id ? 'border-green-500 bg-green-50 font-bold text-green-700' : 'border-gray-50 hover:bg-gray-50 text-gray-600'}`}>{c.nome} {c.sobrenome}</button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 2 */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 text-green-600 font-bold uppercase text-[11px]">2. Detalhes do Pedido</div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Cliente Selecionado</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-700 h-[46px] flex items-center">{clienteSelecionado ? `${clienteSelecionado.nome} ${clienteSelecionado.sobrenome}` : '---'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Valor (R$)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-green-500" 
                    value={valorManual} 
                    onChange={e => setValorManual(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Produto</label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => {
                      const prod = produtos.find(p => p.id === e.target.value);
                      setProdutoSelecionado(prod);
                      if(prod?.valor_sugerido) setValorManual(prod.valor_sugerido.toString());
                    }}
                  >
                    <option value="">Escolha um produto...</option>
                    {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                  <input 
                    placeholder="Novo produto..." 
                    className="w-32 p-3 border border-gray-300 rounded-lg px-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" 
                    value={novoProdutoNome} 
                    onChange={e => setNovoProdutoNome(e.target.value)} 
                  />
                  <button onClick={handleCadastrarProduto} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><PlusCircle size={20}/></button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Código Pix Copia e Cola</label>
                <textarea 
                  rows={3} 
                  className="w-full p-3 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" 
                  value={pixManual} 
                  onChange={e => setPixManual(e.target.value)} 
                  placeholder="Cole o código PIX aqui..."
                />
              </div>

              <button onClick={handleLancarVenda} className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest">
                Finalizar e Lançar
              </button>
            </div>
          </div>
        </div>

        {/* TABELA DE GESTÃO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center font-bold uppercase text-[11px] text-blue-600">
             Vendas Pendentes
             <button onClick={carregarDados} className="text-[10px] bg-white border px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">Atualizar</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-gray-400 uppercase border-b">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendasFiltradas.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400">Nenhuma venda pendente.</td></tr>
              ) : (
                vendasFiltradas.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{v.clientes?.nome} {v.clientes?.sobrenome}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{v.produto}</td>
                    <td className="px-6 py-4 text-[#28a745] font-black">R$ {v.valor}</td>
                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      <button onClick={() => { setVendaParaEditar(v); setNovoPixEdit(v.pix_copia_cola || ''); setModalOpen(true); }} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black border border-blue-100 uppercase flex items-center gap-1 hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={10} className="inline mr-1"/> Pix</button>
                      <button onClick={() => handleAprovarPagamento(v.id)} className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-black border border-green-100 uppercase flex items-center gap-1 hover:bg-green-600 hover:text-white transition-all"><CheckCircle size={10} className="inline mr-1"/> Aprovar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE EDIÇÃO */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Atualizar Código Pix</h2>
              <button onClick={() => setModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-900"/></button>
            </div>
            <textarea 
              rows={5} 
              className="w-full p-4 border border-gray-300 rounded-xl font-mono text-xs mb-6 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
              value={novoPixEdit} 
              onChange={e => setNovoPixEdit(e.target.value)} 
              placeholder="Cole o novo código PIX aqui..."
            />
            <button onClick={handleUpdatePix} className="w-full bg-[#28a745] text-white py-4 rounded-xl font-black shadow-lg uppercase text-xs hover:bg-[#218838] transition-colors">Confirmar Alteração</button>
          </div>
        </div>
      )}
    </div>
  );
}