import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      // Redireciona para o dashboard após login bem-sucedido
      navigate('/dashboard'); 
    } catch (error: any) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {erro && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in duration-300">
          {erro}
        </div>
      )}
      
      {/* Estilo de label e input seguindo o print de referência */}
      <div className="space-y-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Email *</label>
        <input 
          required 
          type="email" 
          placeholder="seu@email.com"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" 
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Senha *</label>
        <input 
          required 
          type="password" 
          placeholder="........"
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" 
        />
      </div>

      {/* Botão principal com sombra e efeito de clique */}
      <button 
        disabled={isLoading} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center mt-4"
      >
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Acessar Minha Conta"}
      </button>
    </form>
  );
};