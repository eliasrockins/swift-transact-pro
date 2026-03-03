import { useState } from 'react';
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Auth = () => {
  const { session } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Efeitos de luz no fundo para dar um toque sofisticado */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[24px] shadow-2xl border border-white relative z-10">
        
        {/* Cabeçalho com Logo */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <img 
            src={logo} 
            alt="Ck Soluções" 
            className="w-20 h-20 mb-5 drop-shadow-md object-contain" 
          />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {isLogin 
              ? 'Acesse seu painel para gerenciar seus pedidos.' 
              : 'Cadastre-se para acessar nossas soluções.'}
          </p>
        </div>
        
        {/* Seletor de Abas Moderno (Pill Style) */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-8 border border-gray-200/50 relative">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 uppercase tracking-wider z-10 ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Acessar Conta
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 uppercase tracking-wider z-10 ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Área do Formulário com Animação */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
        
      </div>
    </div>
  );
};

export default Auth;