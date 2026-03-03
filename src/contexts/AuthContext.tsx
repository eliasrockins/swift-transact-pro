import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define os tipos de dados para o TypeScript não reclamar
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => void;
}

// Cria o contexto vazio inicialmente
const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  signOut: () => {} 
});

// Provedor que vai abraçar o seu aplicativo
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Busca a sessão ativa quando o site carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Fica escutando se o usuário fez login ou logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Limpeza da escuta quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usarmos facilmente em outras telas
export const useAuth = () => {
  return useContext(AuthContext);
};