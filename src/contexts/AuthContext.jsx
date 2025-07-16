// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do token salvo
  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('maya-token');
      
      if (token) {
        try {
          // Configurar token no axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Buscar dados do usuário
          const response = await api.get('/auth/me');
          
          // Ajustar para aceitar tanto 'user' quanto 'usuario'
          const userData = response.data.user || response.data.usuario;
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          // Token inválido, limpar
          Cookies.remove('maya-token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      setError(null);
      console.log('Tentando login com:', { email });
      
      const response = await api.post('/auth/login', { email, senha });
      console.log('Resposta do login:', response.data);
      
      // Ajustar para o formato que o backend retorna
      const { token, user, success } = response.data;
      
      if (!success || !token) {
        throw new Error('Resposta inválida do servidor');
      }
      
      // Salvar token
      Cookies.set('maya-token', token, { expires: 7 }); // 7 dias
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Salvar usuário no estado
      setUser(user);
      
      console.log('Login bem-sucedido, usuário:', user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de registro
  const register = async (dados) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', dados);
      
      // Ajustar para o formato que o backend retorna
      const { token, user, success } = response.data;
      
      if (!success || !token) {
        throw new Error('Resposta inválida do servidor');
      }
      
      // Salvar token
      Cookies.set('maya-token', token, { expires: 7 });
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Salvar usuário no estado
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados locais
      Cookies.remove('maya-token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // Função para recuperar senha
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao solicitar recuperação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};