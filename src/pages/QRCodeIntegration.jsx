// src/pages/QRCodeIntegration.jsx
import React, { useState, useEffect } from 'react';
import { 
  QrCode, MessageCircle, CheckCircle, AlertCircle, 
  RefreshCw, Smartphone, Link2, Shield, Zap,
  Info, X, ArrowRight
} from 'lucide-react';

const QRCodeIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Simular geração de QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VICO_CRM_WHATSAPP_INTEGRATION_DEMO');

  const handleRefreshQR = () => {
    setIsLoading(true);
    // Simular refresh do QR Code
    setTimeout(() => {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VICO_CRM_WHATSAPP_${Date.now()}`);
      setIsLoading(false);
    }, 1000);
  };

  // Simular verificação de conexão
  useEffect(() => {
    const checkConnection = setInterval(() => {
      // TODO: Verificar status real da conexão
      // Esta é apenas uma simulação
    }, 5000);

    return () => clearInterval(checkConnection);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
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
          {/* Instructions Alert */}
          {showInstructions && !isConnected && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 relative">
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <X size={20} />
              </button>
              <div className="flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como funciona a integração:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Vá em Configurações → Aparelhos conectados</li>
                    <li>Clique em "Conectar um aparelho"</li>
                    <li>Escaneie o QR Code abaixo</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isConnected ? 'WhatsApp Conectado' : 'Escaneie o QR Code'}
                </h2>

                {!isConnected ? (
                  <>
                    <div className="relative inline-block">
                      {isLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                          <RefreshCw className="animate-spin text-gray-600" size={32} />
                        </div>
                      )}
                      <div className="p-6 bg-gray-50 rounded-xl">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code WhatsApp" 
                          className="w-64 h-64"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleRefreshQR}
                      disabled={isLoading}
                      className="mt-6 flex items-center justify-center space-x-2 mx-auto text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                      <span className="text-sm">Gerar novo QR Code</span>
                    </button>

                    <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Shield size={16} />
                      <span>Conexão segura e criptografada</span>
                    </div>
                  </>
                ) : (
                  <div className="py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      Seu WhatsApp está conectado e sincronizado com o Vico CRM
                    </p>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Desconectar WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Benefícios da Integração
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Mensagens Centralizadas</h4>
                      <p className="text-sm text-gray-600">
                        Receba e responda mensagens do WhatsApp sem sair do CRM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Respostas Automáticas</h4>
                      <p className="text-sm text-gray-600">
                        Configure chatbots para atender clientes 24/7
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Histórico Completo</h4>
                      <p className="text-sm text-gray-600">
                        Todas as conversas salvas e organizadas por lead
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Multi-dispositivos</h4>
                      <p className="text-sm text-gray-600">
                        Sua equipe pode atender do computador ou celular
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Card */}
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
                    <span className="text-sm text-gray-600">Última sincronização</span>
                    <span className="text-sm text-gray-900">
                      {isConnected ? 'Há 2 minutos' : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mensagens hoje</span>
                    <span className="text-sm text-gray-900">
                      {isConnected ? '47' : '-'}
                    </span>
                  </div>
                </div>

                {isConnected && (
                  <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <span>Ir para Mensagens</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* Warning */}
              {!isConnected && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-amber-700">
                        <li>Mantenha seu celular conectado à internet</li>
                        <li>Não desconecte o WhatsApp Web do celular</li>
                        <li>Use preferencialmente o WhatsApp Business</li>
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