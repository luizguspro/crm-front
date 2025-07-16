import React, { useState, useEffect } from 'react';
import { Mail, Lock, MessageCircle, Database, BarChart3, Users, TrendingUp, Zap, ArrowRight, Shield, Globe, Sparkles, Brain, Rocket, ChevronRight, AlertCircle, Eye, EyeOff, Building2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setFormError('');
    
    // Validações
    if (!email || !password) {
      setFormError('Preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setFormError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const features = [
    { icon: MessageCircle, title: 'WhatsApp Business API', desc: 'Integração completa com WhatsApp' },
    { icon: Database, title: 'CRM Inteligente', desc: 'Gestão avançada de clientes' },
    { icon: BarChart3, title: 'Analytics em Tempo Real', desc: 'Métricas e KPIs detalhados' },
    { icon: Zap, title: 'Automação de Vendas', desc: 'Workflows automatizados' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Lado Esquerdo - Informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Logo e Título */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MAYA CRM</h1>
              <p className="text-blue-400 text-sm">Enterprise Solution</p>
            </div>
          </div>

          <h2 className="text-4xl font-light text-white mb-6">
            Transforme sua operação de vendas
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Plataforma completa de CRM com inteligência artificial integrada ao WhatsApp Business.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-gray-400 text-sm mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Global CDN</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 Maya CRM. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-md px-4 sm:px-0">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MAYA CRM</h1>
                <p className="text-blue-600 text-[10px] sm:text-xs">Enterprise Solution</p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Acesse sua conta
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Digite suas credenciais corporativas
            </p>
          </div>

          {/* Error Message */}
          {(formError || authError) && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-600">{formError || authError}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  placeholder="seu@empresa.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">Lembrar de mim</span>
              </label>
              <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                Esqueceu a senha?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Novo cliente?
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Descubra como o Maya CRM pode transformar suas vendas
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium"
            >
              Solicitar demonstração gratuita
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </a>
          </div>



          {/* Security Badge */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Dados Criptografados</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>LGPD Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;