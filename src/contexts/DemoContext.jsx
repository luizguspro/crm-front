// src/contexts/DemoContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import mockDataService from '../services/mockDataService';

const DemoContext = createContext({});

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo deve ser usado dentro de um DemoProvider');
  }
  return context;
};

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoNotifications, setDemoNotifications] = useState([]);

  // Iniciar modo demo
  const startDemo = () => {
    setIsDemoMode(true);
    mockDataService.startDemo();
    
    // Salvar no localStorage
    localStorage.setItem('demoMode', 'true');
    
    // Mostrar notificação
    addNotification({
      type: 'success',
      title: '🎬 Modo Demo Ativado!',
      message: 'Dados simulados estão sendo gerados em tempo real'
    });
  };

  // Parar modo demo
  const stopDemo = () => {
    setIsDemoMode(false);
    mockDataService.stopDemo();
    
    // Remover do localStorage
    localStorage.removeItem('demoMode');
    
    // Mostrar notificação
    addNotification({
      type: 'info',
      title: 'Modo Demo Desativado',
      message: 'Voltando aos dados reais'
    });
  };

  // Resetar demo
  const resetDemo = () => {
    mockDataService.resetDemo();
    
    if (isDemoMode) {
      mockDataService.startDemo();
    }
    
    addNotification({
      type: 'info',
      title: '🔄 Demo Resetada',
      message: 'Dados foram reinicializados'
    });
  };

  // Sistema de notificações para demo
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    };
    
    setDemoNotifications(prev => [newNotification, ...prev].slice(0, 5));
    
    // Auto remover após 5 segundos
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setDemoNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Verificar se estava em modo demo
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('demoMode') === 'true';
    if (savedDemoMode) {
      startDemo();
    }
  }, []);

  // Escutar eventos do mockDataService
  useEffect(() => {
    if (isDemoMode) {
      // Notificar sobre novos leads quentes
      mockDataService.on('hot-lead', (data) => {
        addNotification({
          type: 'warning',
          title: '🔥 Lead Quente!',
          message: `${data.contact.nome} atingiu score alto`
        });
      });

      // Notificar sobre negócios ganhos
      mockDataService.on('deal-moved', (data) => {
        if (data.newStage === 'won') {
          addNotification({
            type: 'success',
            title: '🎉 Negócio Fechado!',
            message: `${data.deal.name} - R$ ${data.deal.value.toLocaleString('pt-BR')}`
          });
        }
      });

      // Notificar sobre novas mensagens importantes
      let messageCount = 0;
      mockDataService.on('new-message', () => {
        messageCount++;
        if (messageCount % 5 === 0) { // A cada 5 mensagens
          addNotification({
            type: 'info',
            title: '💬 Novas Mensagens',
            message: `${messageCount} novas mensagens recebidas`
          });
          messageCount = 0;
        }
      });
    }

    return () => {
      // Limpar listeners quando sair do modo demo
      mockDataService.off('hot-lead');
      mockDataService.off('deal-moved');
      mockDataService.off('new-message');
    };
  }, [isDemoMode]);

  const value = {
    isDemoMode,
    startDemo,
    stopDemo,
    resetDemo,
    demoNotifications,
    removeNotification,
    mockDataService
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};