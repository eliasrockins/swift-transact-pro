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
      navigate('/'); 
    } catch (error: any) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {erro && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{erro}</div>}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
        <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <button disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-md font-bold flex items-center justify-center hover:bg-blue-700 transition-all">
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar na Conta"}
      </button>
    </form>
  );
};