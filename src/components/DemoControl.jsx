// src/components/DemoControl.jsx
import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, Sparkles, X, ChevronDown,
  AlertCircle, CheckCircle, Info, Zap, Settings
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

const DemoControl = () => {
  const { isDemoMode, startDemo, stopDemo, resetDemo, demoNotifications, removeNotification } = useDemo();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Zap className="w-5 h-5 text-purple-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Menu Dropdown */}
          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[200px]">
              <div className="p-2">
                {!isDemoMode ? (
                  <button
                    onClick={() => {
                      startDemo();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Iniciar Demo</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        stopDemo();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Pause className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Parar Demo</span>
                    </button>
                    <button
                      onClick={() => {
                        resetDemo();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Resetar Dados</span>
                    </button>
                  </>
                )}
                <hr className="my-2" />
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {showNotifications ? 'Ocultar' : 'Mostrar'} Notificações
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Botão Principal */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`group flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 ${
              isDemoMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isDemoMode ? 'animate-pulse' : ''}`} />
            <span className="font-medium">
              {isDemoMode ? 'Demo Ativo' : 'Modo Demo'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Indicador de Status */}
          {isDemoMode && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* Notificações */}
      {showNotifications && demoNotifications.length > 0 && (
        <div className="fixed top-20 right-6 z-40 space-y-2 max-w-sm">
          {demoNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${getNotificationColor(notification.type)} border rounded-lg shadow-lg p-4 transform transition-all duration-300 animate-slide-left`}
            >
              <div className="flex items-start">
                {getNotificationIcon(notification.type)}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DemoControl;