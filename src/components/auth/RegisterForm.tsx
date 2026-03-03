import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '', senha: '', nome: '', sobrenome: '',
    cpf: '', cep: '', rua: '', numero: '',
    complemento: '', bairro: '', cidade: '', estado: '',
    telefone: '', codigo_cobranca: ''
  });

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'cpf') value = maskCPF(value);
    if (name === 'telefone') value = maskPhone(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem({ tipo: '', texto: '' });

    if (!formData.codigo_cobranca.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, preencha o Código de Cobrança.' });
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (authError) throw new Error(authError.message);

      if (authData.user) {
        await supabase.from('clientes').insert([{
          id: authData.user.id,
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          cpf: formData.cpf,
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          telefone: formData.telefone,
          codigo_cobranca: formData.codigo_cobranca
        }]);
      }

      await fetch("https://formsubmit.co/ajax/lucasalvesfariaesilva@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: "Novo Cliente Cadastrado na CK!",
          nome: `${formData.nome} ${formData.sobrenome}`,
          email: formData.email,
          telefone: formData.telefone
        })
      });

      setMensagem({ tipo: 'sucesso', texto: 'Cadastro realizado com sucesso!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: `Erro: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2";
  const inputClass = "w-full p-4 bg-[#1A1A35] border border-purple-900/40 rounded-2xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-gray-600";

  return (
    <div className="w-full">
      {mensagem.texto && (
        <div className={`p-4 mb-8 rounded-2xl font-bold text-xs text-center animate-in fade-in zoom-in duration-300 ${mensagem.tipo === 'erro' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Email *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="seu@email.com" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Senha *</label>
            <input required type="password" name="senha" value={formData.senha} onChange={handleChange} className={inputClass} placeholder="••••••••" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Nome *</label>
            <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputClass} placeholder="Seu nome" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Sobrenome *</label>
            <input required type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} className={inputClass} placeholder="Seu sobrenome" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>CEP *</label>
            <input required type="text" name="cep" maxLength={8} value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} className={inputClass} placeholder="00000000" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className={labelClass}>Rua *</label>
            <input required type="text" name="rua" value={formData.rua} onChange={handleChange} className={inputClass} placeholder="Nome da rua" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Número *</label>
            <input required type="text" name="numero" value={formData.numero} onChange={handleChange} className={inputClass} placeholder="123" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className={labelClass}>Bairro *</label>
            <input required type="text" name="bairro" value={formData.bairro} onChange={handleChange} className={inputClass} placeholder="Seu bairro" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>CPF *</label>
            <input required type="text" name="cpf" maxLength={14} value={formData.cpf} onChange={handleChange} className={inputClass} placeholder="000.000.000-00" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Telefone *</label>
            <input required type="text" name="telefone" maxLength={15} value={formData.telefone} onChange={handleChange} className={inputClass} placeholder="(00) 00000-0000" />
          </div>
        </div>
        
        <div className="p-5 bg-purple-900/20 border border-purple-700/40 rounded-[24px]">
          <label className="block text-[10px] font-black text-purple-300 uppercase tracking-widest ml-1 mb-3 flex items-center gap-1">
            Código de Cobrança <span className="text-red-400 text-lg leading-none">*</span>
          </label>
          <input 
            required type="text" name="codigo_cobranca" 
            value={formData.codigo_cobranca} onChange={handleChange} 
            className="w-full p-4 border border-purple-700/40 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 text-white bg-[#1A1A35] transition-all font-bold placeholder:text-gray-600" 
            placeholder="Digite o código fornecido..."
          />
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-purple-900/40 mt-4 text-xs"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Criar Minha Conta Agora"}
        </button>
      </form>
    </div>
  );
};