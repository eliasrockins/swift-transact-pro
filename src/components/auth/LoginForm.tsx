import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isRecuperando, setIsRecuperando] = useState(false); // NOVO: Controla a tela de recuperação
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro('');
    setSucesso('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      navigate('/dashboard'); 
    } catch (error: any) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErro('Por favor, digite seu e-mail para recuperar a senha.');
      return;
    }
    
    setIsLoading(true);
    setErro('');
    setSucesso('');

    try {
      // Envia o e-mail de recuperação usando o Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`, // Redireciona de volta após clicar no link
      });
      if (error) throw error;
      
      setSucesso('E-mail enviado! Verifique sua caixa de entrada ou spam para redefinir a senha.');
      setTimeout(() => setIsRecuperando(false), 5000); // Volta para a tela de login após 5 segundos
    } catch (error: any) {
      setErro("Erro ao enviar o e-mail. Verifique se ele está correto.");
    } finally {
      setIsLoading(false);
    }
  };

  // TELA DE RECUPERAÇÃO DE SENHA
  if (isRecuperando) {
    return (
      <form onSubmit={handleRecuperarSenha} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center mb-6">
          <button 
            type="button" 
            onClick={() => { setIsRecuperando(false); setErro(''); setSucesso(''); }} 
            className="text-gray-400 hover:text-white transition-colors flex items-center text-xs font-bold"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar para o login
          </button>
        </div>

        <h3 className="text-white font-black text-lg mb-2">Recuperar Senha</h3>
        <p className="text-gray-400 text-xs font-medium mb-6">Digite seu e-mail abaixo e enviaremos um link seguro para você criar uma nova senha.</p>

        {erro && <div className="p-4 bg-red-900/30 text-red-400 rounded-2xl text-xs font-bold border border-red-800/50 animate-in fade-in duration-300">{erro}</div>}
        {sucesso && <div className="p-4 bg-green-900/30 text-green-400 rounded-2xl text-xs font-bold border border-green-800/50 animate-in fade-in duration-300">{sucesso}</div>}
        
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">E-mail de cadastro</label>
          <input 
            required 
            type="email" 
            placeholder="seu@email.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-4 bg-[#1A1A35] border border-purple-900/40 rounded-2xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-gray-600" 
          />
        </div>

        <button 
          disabled={isLoading} 
          className="w-full bg-purple-700 hover:bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-900/40 transition-all active:scale-[0.98] flex items-center justify-center mt-4 text-xs"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Enviar Link de Recuperação"}
        </button>
      </form>
    );
  }

  // TELA DE LOGIN NORMAL
  return (
    <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      {erro && <div className="p-4 bg-red-900/30 text-red-400 rounded-2xl text-xs font-bold border border-red-800/50 animate-in fade-in duration-300">{erro}</div>}
      
      <div className="space-y-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">E-mail</label>
        <input 
          required 
          type="email" 
          placeholder="seu@email.com"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-4 bg-[#1A1A35] border border-purple-900/40 rounded-2xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-gray-600" 
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Senha</label>
        <input 
          required 
          type="password" 
          placeholder="••••••••"
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          className="w-full p-4 bg-[#1A1A35] border border-purple-900/40 rounded-2xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-gray-600" 
        />
      </div>

      <div className="flex justify-end">
        <button 
          type="button"
          onClick={() => { setIsRecuperando(true); setErro(''); }}
          className="text-purple-400 text-xs font-bold cursor-pointer hover:text-purple-300 transition-colors bg-transparent border-none outline-none"
        >
          Esqueceu a senha?
        </button>
      </div>

      <button 
        disabled={isLoading} 
        className="w-full bg-purple-700 hover:bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-900/40 transition-all active:scale-[0.98] flex items-center justify-center mt-4"
      >
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar"}
      </button>
    </form>
  );
};