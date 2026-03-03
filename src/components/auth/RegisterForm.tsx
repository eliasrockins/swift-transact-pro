import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    sobrenome: '',
    cpf: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    codigo_cobranca: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    // TRAVA DE SEGURANÇA: Impede o cadastro sem o código de cobrança
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
        const { error: dbError } = await supabase
          .from('clientes')
          .insert([{
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

        if (dbError) throw new Error(dbError.message);
      }

      await fetch("https://formsubmit.co/ajax/lucasalvesfariaesilva@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: "Novo Cliente Cadastrado!",
          nome: `${formData.nome} ${formData.sobrenome}`,
          email: formData.email,
          telefone: formData.telefone
        })
      });

      setMensagem({ tipo: 'sucesso', texto: 'Cadastro realizado! Redirecionando para o seu painel...' });
      
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 2000);
      
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: `Erro: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Ajustei levemente as bordas para combinar com o visual premium do Auth.tsx
  const inputClass = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 bg-gray-50/50 transition-all font-medium text-sm";

  return (
    <div className="w-full">
      {mensagem.texto && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-sm text-center ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Email *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Senha *</label>
            <input required type="password" name="senha" value={formData.senha} onChange={handleChange} className={inputClass} placeholder="••••••••" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nome *</label>
            <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Sobrenome *</label>
            <input required type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">CEP *</label>
            <input required type="text" name="cep" maxLength={8} value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} className={inputClass} placeholder="00000000" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Rua *</label>
            <input required type="text" name="rua" value={formData.rua} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Número *</label>
            <input required type="text" name="numero" value={formData.numero} onChange={handleChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Bairro *</label>
            <input required type="text" name="bairro" value={formData.bairro} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">CPF *</label>
            <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} className={inputClass} placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Telefone *</label>
            <input required type="text" name="telefone" value={formData.telefone} onChange={handleChange} className={inputClass} placeholder="(00) 00000-0000" />
          </div>
        </div>
        
        {/* AQUI ESTÁ O CAMPO COM O ASTERISCO */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <label className="block text-[11px] font-black text-blue-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            Código de Cobrança <span className="text-red-500 text-lg leading-none">*</span>
          </label>
          <input 
            required 
            type="text" 
            name="codigo_cobranca" 
            value={formData.codigo_cobranca} 
            onChange={handleChange} 
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 bg-white transition-all font-bold" 
            placeholder="Digite o código fornecido..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-200 mt-2 text-xs"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Criar Minha Conta"}
        </button>
      </form>
    </div>
  );
};