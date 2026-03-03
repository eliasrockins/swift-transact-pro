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
        <div className="p-4 bg-red-900/30 text-red-400 rounded-2xl text-xs font-bold border border-red-800/50 animate-in fade-in duration-300">
          {erro}
        </div>
      )}
      
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
        <span className="text-purple-400 text-xs font-bold cursor-pointer hover:text-purple-300 transition-colors">
          Esqueceu a senha?
        </span>
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