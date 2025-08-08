// src/pages/AutomationSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Zap, Play, Pause, Settings, Clock, CheckCircle, AlertCircle,
  RefreshCw, History, ToggleLeft, ToggleRight, Save, Info,
  TrendingUp, Users, Calendar, X, ArrowRight
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import apiMock from '../services/apiMock';
import { automationService } from '../services/api';

const AutomationSettings = () => {
  const { isDemoMode, mockDataService } = useDemo();
  const [isRunning, setIsRunning] = useState(false);
  const [flows, setFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);

  // Buscar status e fluxos
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Buscar status
        const statusResponse = await apiMock.getAutomationStatus();
        setIsRunning(statusResponse.data.isRunning);

        // Buscar fluxos
        const flowsResponse = await apiMock.getAutomationFlows();
        setFlows(flowsResponse.data);
      } else {
        try {
          // Buscar status
          const statusResponse = await automationService.getStatus();
          setIsRunning(statusResponse.data.isRunning);

          // Buscar fluxos
          const flowsResponse = await automationService.getFlows();
          setFlows(flowsResponse.data);
        } catch (err) {
          // Se falhar, usar dados default
          setIsRunning(false);
          setFlows([
            {
              id: 'auto-qualify-hot',
              nome: 'Qualificar Leads Quentes',
              descricao: 'Move leads com score alto para qualificados',
              ativo: false,
              gatilho: 'Score > 80',
              regras: { score_minimo: 80 }
            },
            {
              id: 'auto-cadence',
              nome: 'Cadência de Follow-up',
              descricao: 'Envia mensagens automáticas de follow-up',
              ativo: false,
              gatilho: 'Sem resposta há 24h',
              regras: { tempo_sem_resposta: 24 }
            }
          ]);
        }
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isDemoMode]);

  // Atualizar em tempo real no modo demo
  useEffect(() => {
    if (isDemoMode && mockDataService) {
      // No modo demo, simular automações rodando
      const interval = setInterval(() => {
        setLastExecution(new Date());
      }, 30000); // Atualizar a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

  // Controlar automação
  const toggleAutomation = async () => {
    try {
      if (isDemoMode) {
        if (isRunning) {
          await apiMock.stopAutomation();
          setIsRunning(false);
        } else {
          await apiMock.startAutomation();
          setIsRunning(true);
        }
      } else {
        try {
          if (isRunning) {
            await automationService.stop();
            setIsRunning(false);
          } else {
            await automationService.start();
            setIsRunning(true);
          }
        } catch (err) {
          console.log('Erro ao controlar automação');
        }
      }
    } catch (error) {
      console.error('Erro ao controlar automação:', error);
    }
  };

  // Executar agora
  const runNow = async () => {
    try {
      setLastExecution(new Date());
      
      if (isDemoMode) {
        // No modo demo, apenas simular
        alert('Automações executadas com sucesso no modo demo!');
      } else {
        try {
          await automationService.runNow();
        } catch (err) {
          console.log('Erro ao executar automação');
        }
      }
    } catch (error) {
      console.error('Erro ao executar automação:', error);
    }
  };

  // Salvar configuração do fluxo
  const saveFlowConfig = async (flowId, config) => {
    try {
      setIsSaving(true);
      
      if (isDemoMode) {
        // No modo demo, apenas atualizar localmente
        setFlows(flows.map(f => 
          f.id === flowId ? { ...f, ...config } : f
        ));
      } else {
        try {
          await automationService.updateFlow(flowId, config);
          
          // Atualizar estado local
          setFlows(flows.map(f => 
            f.id === flowId ? { ...f, ...config } : f
          ));
        } catch (err) {
          console.log('Erro ao salvar configuração');
        }
      }
      
      setSelectedFlow(null);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFlowIcon = (flowId) => {
    switch(flowId) {
      case 'auto-qualify-hot':
        return <TrendingUp className="w-5 h-5" />;
      case 'auto-cadence':
        return <Clock className="w-5 h-5" />;
      case 'auto-qualify-score':
        return <CheckCircle className="w-5 h-5" />;
      case 'auto-lost':
        return <X className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                Automação do Pipeline
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure regras automáticas para mover leads entre etapas
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status da automação */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {isRunning ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              {/* Botões de controle */}
              <button
                onClick={runNow}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Executar Agora</span>
              </button>

              <button
                onClick={toggleAutomation}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isRunning 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Iniciar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Como funciona a automação:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>As regras são executadas automaticamente a cada 5 minutos</li>
                <li>Leads são movidos entre etapas baseados nos critérios definidos</li>
                <li>Você pode executar manualmente a qualquer momento</li>
                <li>Todas as movimentações são registradas no histórico</li>
              </ul>
              {isDemoMode && (
                <p className="mt-2 text-blue-600 font-medium">
                  💡 No modo demo, as automações funcionam simuladamente com os dados gerados!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Fluxos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flows.map(flow => (
            <div key={flow.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    flow.ativo ? 'bg-blue-100' : 'bg-gray-100'
                  } mr-3`}>
                    {getFlowIcon(flow.id)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{flow.nome}</h3>
                    <p className="text-sm text-gray-500">{flow.descricao}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => saveFlowConfig(flow.id, { ativo: !flow.ativo })}
                  className="p-2"
                >
                  {flow.ativo ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gatilho:</span>
                  <span className="font-medium text-gray-900">{flow.gatilho}</span>
                </div>

                {/* Regras específicas */}
                {flow.regras && (
                  <div className="mt-3 space-y-2">
                    {flow.regras.score_minimo && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score mínimo:</span>
                        <span className="font-medium text-gray-900">{flow.regras.score_minimo}</span>
                      </div>
                    )}
                    {flow.regras.tempo_interacao && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tempo de interação:</span>
                        <span className="font-medium text-gray-900">{flow.regras.tempo_interacao}h</span>
                      </div>
                    )}
                    {flow.regras.tempo_sem_resposta && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tempo sem resposta:</span>
                        <span className="font-medium text-gray-900">{flow.regras.tempo_sem_resposta}h</span>
                      </div>
                    )}
                    {flow.regras.dias_sem_resposta && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Dias sem resposta:</span>
                        <span className="font-medium text-gray-900">{flow.regras.dias_sem_resposta} dias</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Status de execução no modo demo */}
                {isDemoMode && flow.ativo && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Executando automaticamente</span>
                    </div>
                  </div>
                )}

                {/* Botão de configuração */}
                <button
                  onClick={() => setSelectedFlow(flow)}
                  className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Última execução */}
        {lastExecution && (
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <History className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">
                Última execução: {new Date(lastExecution).toLocaleString('pt-BR')}
              </span>
              {isDemoMode && (
                <span className="ml-2 text-sm text-blue-600">
                  (Modo Demo - Execução Simulada)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Info adicional no modo demo */}
        {isDemoMode && (
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start">
              <Zap className="w-6 h-6 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Automações em Modo Demo
                </h3>
                <p className="text-sm text-purple-700 mb-3">
                  No modo demo, as automações estão funcionando com dados simulados:
                </p>
                <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                  <li>Leads com score alto são automaticamente qualificados</li>
                  <li>Mensagens de follow-up são simuladas</li>
                  <li>Negócios são movidos no pipeline baseado em regras</li>
                  <li>Todas as ações são registradas em tempo real</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Configuração */}
      {selectedFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Configurar: {selectedFlow.nome}
              </h3>
              <button
                onClick={() => setSelectedFlow(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">{selectedFlow.descricao}</p>

              {/* Campos de configuração baseados nas regras */}
              {selectedFlow.regras && (
                <div className="space-y-3">
                  {selectedFlow.regras.score_minimo !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Score mínimo
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedFlow.regras.score_minimo}
                        onChange={(e) => {
                          const newFlow = { ...selectedFlow };
                          newFlow.regras.score_minimo = parseInt(e.target.value);
                          setSelectedFlow(newFlow);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedFlow.regras.tempo_interacao !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo de interação (horas)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selectedFlow.regras.tempo_interacao}
                        onChange={(e) => {
                          const newFlow = { ...selectedFlow };
                          newFlow.regras.tempo_interacao = parseInt(e.target.value);
                          setSelectedFlow(newFlow);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedFlow.regras.tempo_sem_resposta !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo sem resposta (horas)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selectedFlow.regras.tempo_sem_resposta}
                        onChange={(e) => {
                          const newFlow = { ...selectedFlow };
                          newFlow.regras.tempo_sem_resposta = parseInt(e.target.value);
                          setSelectedFlow(newFlow);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedFlow.regras.dias_sem_resposta !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dias sem resposta
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selectedFlow.regras.dias_sem_resposta}
                        onChange={(e) => {
                          const newFlow = { ...selectedFlow };
                          newFlow.regras.dias_sem_resposta = parseInt(e.target.value);
                          setSelectedFlow(newFlow);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {isDemoMode && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 No modo demo, as configurações são aplicadas aos dados simulados imediatamente.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedFlow(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => saveFlowConfig(selectedFlow.id, {
                  ativo: selectedFlow.ativo,
                  regras: selectedFlow.regras
                })}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationSettings;