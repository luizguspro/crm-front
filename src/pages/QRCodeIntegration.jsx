// src/pages/QRCodeIntegration.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, MessageCircle, CheckCircle, AlertCircle, 
  RefreshCw, Smartphone, Link2, Shield, Zap,
  Info, X, ArrowRight, Power
} from 'lucide-react';

const QRCodeIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const pollingInterval = useRef(null);
  
  useEffect(() => {
    checkStatus();
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/whatsapp/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }
      
      const data = await response.json();
      
      if (data.connected) {
        setIsConnected(true);
        setQrCode(null);
        stopPolling();
      } else if (data.qrCode || data.hasQR) {
        // Se já tem QR, buscar ele
        fetchQRCode();
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const startPolling = () => {
    // Para polling existente se houver
    stopPolling();
    
    // Busca QR imediatamente
    fetchQRCode();
    
    // Depois continua buscando a cada 2 segundos
    pollingInterval.current = setInterval(() => {
      fetchQRCode();
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const initializeWhatsApp = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage('Inicializando WhatsApp...');
    
    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/whatsapp/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao inicializar WhatsApp');
      }
      
      setStatusMessage('Gerando QR Code...');
      
      // Inicia o polling para buscar o QR
      setTimeout(() => {
        startPolling();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      setError('Erro ao inicializar WhatsApp. Verifique se o servidor está rodando.');
      setIsLoading(false);
    }
  };

  const fetchQRCode = async () => {
    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/whatsapp/qr', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Se não encontrar QR, continua tentando
        console.log('QR ainda não disponível, tentando novamente...');
        return;
      }
      
      const data = await response.json();
      
      if (data.qr) {
        // QR encontrado!
        setQrCode(data.qr);
        setIsConnected(false);
        setStatusMessage('');
        setIsLoading(false);
        console.log('QR Code recebido com sucesso!');
      } else if (data.connected) {
        // WhatsApp conectado
        setIsConnected(true);
        setQrCode(null);
        setIsLoading(false);
        stopPolling();
      } else if (data.qrCode) {
        // Formato alternativo de resposta
        setQrCode(data.qrCode);
        setIsConnected(false);
        setStatusMessage('');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao buscar QR:', error);
      // Não para o loading aqui, deixa continuar tentando
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      await fetch('http://localhost:3001/api/whatsapp/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsConnected(false);
      setQrCode(null);
      stopPolling();
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  const handleRefreshQR = () => {
    setQrCode(null);
    initializeWhatsApp();
  };

  // Verifica se o QR code é uma string base64 válida
  const getQRCodeSrc = () => {
    if (!qrCode) return null;
    
    // Se já vier com data:image, usa direto
    if (qrCode.startsWith('data:image')) {
      return qrCode;
    }
    
    // Se for só base64, adiciona o prefixo
    return `data:image/png;base64,${qrCode}`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="mr-3 text-green-600" size={28} />
                Integração WhatsApp
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Conecte seu WhatsApp Business para receber mensagens diretamente no CRM
              </p>
            </div>
            {isConnected && (
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                <CheckCircle size={20} />
                <span className="font-medium">Conectado</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                {!isConnected && !qrCode && !isLoading && (
                  <>
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-10 h-10 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        WhatsApp Desconectado
                      </h2>
                      <p className="text-gray-600">
                        Clique no botão abaixo para conectar seu WhatsApp
                      </p>
                    </div>
                    
                    <button
                      onClick={initializeWhatsApp}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Power size={20} />
                      <span>Ativar WhatsApp</span>
                    </button>
                  </>
                )}

                {isLoading && !qrCode && (
                  <div className="py-12">
                    <RefreshCw className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">{statusMessage || 'Processando...'}</p>
                    <p className="text-sm text-gray-500 mt-2">Aguarde, gerando QR Code...</p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {qrCode && !isConnected && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Escaneie o QR Code
                    </h2>
                    
                    <div className="relative inline-block">
                      <div className="p-6 bg-gray-50 rounded-xl">
                        <img 
                          src={getQRCodeSrc()} 
                          alt="QR Code WhatsApp" 
                          className="w-64 h-64"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem QR');
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleRefreshQR}
                      className="mt-6 flex items-center justify-center space-x-2 mx-auto text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RefreshCw size={18} />
                      <span className="text-sm">Gerar novo QR Code</span>
                    </button>

                    <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Shield size={16} />
                      <span>Conexão segura e criptografada</span>
                    </div>
                  </>
                )}

                {isConnected && (
                  <div className="py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      WhatsApp Conectado
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Seu WhatsApp está conectado e sincronizado com o ZapVibe
                    </p>
                    <button 
                      onClick={handleDisconnect}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Desconectar WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Como conectar
                </h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">1.</span>
                    Clique no botão "Ativar WhatsApp"
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">2.</span>
                    Aguarde o QR Code ser gerado
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">3.</span>
                    Abra o WhatsApp no seu celular
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">4.</span>
                    Vá em Configurações → Aparelhos conectados
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">5.</span>
                    Clique em "Conectar um aparelho"
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-900 mr-2">6.</span>
                    Escaneie o QR Code exibido na tela
                  </li>
                </ol>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Status da Conexão
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">WhatsApp Web</span>
                    <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm text-gray-900">
                      {isConnected ? 'Ativo' : qrCode ? 'Aguardando Leitura' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {isConnected && (
                  <button 
                    onClick={() => window.location.href = '/conversations'}
                    className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Ir para Mensagens</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {!isConnected && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-amber-700">
                        <li>Mantenha seu celular conectado à internet</li>
                        <li>Não desconecte o WhatsApp Web do celular</li>
                        <li>O QR Code expira em 1 minuto</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeIntegration;