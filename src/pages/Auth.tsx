import { useState } from 'react';
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/logo.png";

const Auth = () => {
  const { session } = useAuth();
  const [searchParams] = useSearchParams(); 
  const [isLogin, setIsLogin] = useState(searchParams.get('aba') !== 'cadastro');

  if (session) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-violet-800/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full bg-[#13132A] backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-2xl border border-purple-900/40 relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <img 
            src={logo} 
            alt="Ck Soluções" 
            className="w-20 h-20 mb-5 drop-shadow-md object-contain" 
          />
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isLogin ? 'Entrar na sua conta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            {isLogin 
              ? 'Acesse sua conta para gerenciar seus serviços' 
              : 'Cadastre-se para acessar nossas soluções.'}
          </p>
        </div>
        
        <div className="flex bg-[#1A1A35] p-1.5 rounded-xl mb-8 border border-purple-900/30 relative">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 uppercase tracking-wider z-10 ${
              isLogin ? 'bg-purple-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Acessar Conta
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 uppercase tracking-wider z-10 ${
              !isLogin ? 'bg-purple-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Criar Conta
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
        
      </div>
    </div>
  );
};

export default Auth;