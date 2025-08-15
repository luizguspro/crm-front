import React, { useState, useEffect } from 'react';
import { 
  Bot, Save, Plus, Trash2, Clock, MessageCircle, 
  Settings, ToggleLeft, ToggleRight, AlertCircle, 
  CheckCircle, Hash, Type, Zap, User, ArrowRight,
  RefreshCw, X, ChevronDown, ChevronUp, Info
} from 'lucide-react';

const WhatsAppBotConfig = () => {
  const [config, setConfig] = useState({
    bot_ativo: false,
    bot_mensagem_inicial: '',
    bot_menu_opcoes: [],
    bot_respostas: [],
    bot_delay_resposta: 2,
    bot_transferir_atendente_palavras: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    menu: true,
    respostas: true,
    config: true
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/whatsapp/bot/config', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const data = await response.json();
      console.log('Configurações carregadas:', data);
      
      if (data.success && data.config) {
        // Garantir que arrays existam
        setConfig({
          bot_ativo: data.config.bot_ativo || false,
          bot_mensagem_inicial: data.config.bot_mensagem_inicial || '',
          bot_menu_opcoes: data.config.bot_menu_opcoes || [],
          bot_respostas: data.config.bot_respostas || [],
          bot_delay_resposta: data.config.bot_delay_resposta || 2,
          bot_transferir_atendente_palavras: data.config.bot_transferir_atendente_palavras || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setError('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);
      
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      // Preparar dados para envio
      const dataToSend = {
        bot_ativo: config.bot_ativo,
        bot_mensagem_inicial: config.bot_mensagem_inicial || '',
        bot_menu_opcoes: config.bot_menu_opcoes || [],
        bot_respostas: config.bot_respostas || [],
        bot_delay_resposta: parseInt(config.bot_delay_resposta) || 2,
        bot_transferir_atendente_palavras: config.bot_transferir_atendente_palavras || []
      };
      
      console.log('Salvando configurações:', dataToSend);
      
      const response = await fetch('http://localhost:3001/api/whatsapp/bot/config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Recarregar configurações para garantir sincronização
        await loadConfig();
      } else {
        throw new Error(data.error || 'Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const addMenuOption = () => {
    setConfig(prev => ({
      ...prev,
      bot_menu_opcoes: [
        ...prev.bot_menu_opcoes,
        { texto: '', resposta: '', acao: null }
      ]
    }));
  };

  const removeMenuOption = (index) => {
    setConfig(prev => ({
      ...prev,
      bot_menu_opcoes: prev.bot_menu_opcoes.filter((_, i) => i !== index)
    }));
  };

  const updateMenuOption = (index, field, value) => {
    setConfig(prev => {
      const newOpcoes = [...prev.bot_menu_opcoes];
      newOpcoes[index] = { ...newOpcoes[index], [field]: value };
      return { ...prev, bot_menu_opcoes: newOpcoes };
    });
  };

  const addAutoResponse = () => {
    setConfig(prev => ({
      ...prev,
      bot_respostas: [
        ...prev.bot_respostas,
        { palavras_chave: [], resposta: '' }
      ]
    }));
  };

  const removeAutoResponse = (index) => {
    setConfig(prev => ({
      ...prev,
      bot_respostas: prev.bot_respostas.filter((_, i) => i !== index)
    }));
  };

  const updateAutoResponse = (index, field, value) => {
    setConfig(prev => {
      const newRespostas = [...prev.bot_respostas];
      if (field === 'palavras_chave') {
        newRespostas[index].palavras_chave = value.split(',').map(s => s.trim()).filter(s => s);
      } else {
        newRespostas[index][field] = value;
      }
      return { ...prev, bot_respostas: newRespostas };
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Adicionar exemplos de configuração
  const loadExampleConfig = () => {
    setConfig({
      bot_ativo: true,
      bot_mensagem_inicial: 'Olá! 👋 Bem-vindo à nossa empresa!\n\nComo posso ajudar você hoje?\n\nDigite um número:\n1️⃣ Ver produtos\n2️⃣ Falar com vendedor\n3️⃣ Horário de atendimento',
      bot_menu_opcoes: [
        {
          texto: '1',
          resposta: '📦 Nossos principais produtos:\n• Produto A - R$ 99\n• Produto B - R$ 199\n• Produto C - R$ 299\n\nQuer mais detalhes sobre algum?',
          acao: null
        },
        {
          texto: '2',
          resposta: '👤 Ok! Vou chamar um de nossos vendedores para atendê-lo.\n\nAguarde um momento...',
          acao: 'transferir_atendente'
        },
        {
          texto: '3',
          resposta: '🕐 Nosso horário de atendimento:\n\nSegunda a Sexta: 9h às 18h\nSábado: 9h às 13h\nDomingo: Fechado',
          acao: null
        }
      ],
      bot_respostas: [
        {
          palavras_chave: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
          resposta: 'Olá! Seja bem-vindo! 😊\n\nDigite:\n1️⃣ Ver produtos\n2️⃣ Falar com vendedor\n3️⃣ Horário'
        },
        {
          palavras_chave: ['preço', 'valor', 'quanto custa', 'quanto é'],
          resposta: '💰 Nossos preços variam de R$ 99 a R$ 299.\n\nQuer ver nossos produtos? Digite 1'
        },
        {
          palavras_chave: ['obrigado', 'obrigada', 'valeu', 'thanks'],
          resposta: 'Por nada! 😊 Estamos sempre à disposição!\n\nSe precisar de mais alguma coisa, é só chamar!'
        }
      ],
      bot_delay_resposta: 2,
      bot_transferir_atendente_palavras: ['atendente', 'humano', 'pessoa', 'vendedor', 'ajuda', 'falar com alguém']
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando configurações do bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bot className="mr-3 text-purple-600" size={28} />
                Configuração do Bot WhatsApp
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure respostas automáticas e menu de opções para o WhatsApp
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status do Bot */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                config.bot_ativo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {config.bot_ativo ? (
                  <>
                    <CheckCircle size={20} />
                    <span className="font-medium">Bot Ativo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <span className="font-medium">Bot Inativo</span>
                  </>
                )}
              </div>
              
              {/* Botão Salvar */}
              <button
                onClick={saveConfig}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {saveSuccess && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <p className="text-green-800">Configurações salvas com sucesso! O bot já está respondendo no WhatsApp.</p>
        </div>
      )}

      {error && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Botão de Exemplo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Primeira vez configurando?</p>
                  <p>Clique no botão ao lado para carregar uma configuração de exemplo.</p>
                </div>
              </div>
              <button
                onClick={loadExampleConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Carregar Exemplo
              </button>
            </div>
          </div>

          {/* Ativar/Desativar Bot */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Status do Bot</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {config.bot_ativo 
                    ? '✅ O bot está ativo e respondendo mensagens automaticamente'
                    : '❌ O bot está desativado e não responderá mensagens'}
                </p>
              </div>
              <button
                onClick={() => setConfig({ ...config, bot_ativo: !config.bot_ativo })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  config.bot_ativo ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    config.bot_ativo ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mensagem Inicial */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensagem de Boas-Vindas</h3>
            <p className="text-sm text-gray-500 mb-4">
              Esta mensagem será enviada automaticamente quando alguém iniciar uma conversa
            </p>
            <textarea
              value={config.bot_mensagem_inicial}
              onChange={(e) => setConfig({ ...config, bot_mensagem_inicial: e.target.value })}
              placeholder="Olá! 👋 Bem-vindo à nossa empresa!\n\nComo posso ajudar você hoje?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-2">
              Dica: Use emojis para tornar a mensagem mais amigável 😊
            </p>
          </div>

          {/* Menu de Opções */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="p-6 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleSection('menu')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Menu de Opções ({config.bot_menu_opcoes.length})</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure as opções do menu que aparecerão para o cliente
                  </p>
                </div>
                {expandedSections.menu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.menu && (
              <div className="p-6 space-y-4">
                {config.bot_menu_opcoes.map((opcao, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-700">Opção {index + 1}</span>
                      <button
                        onClick={() => removeMenuOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Texto do botão (o que o usuário digita)</label>
                      <input
                        type="text"
                        placeholder="Ex: 1 ou Ver preços"
                        value={opcao.texto}
                        onChange={(e) => updateMenuOption(index, 'texto', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Resposta do bot</label>
                      <textarea
                        placeholder="Resposta quando o cliente escolher esta opção"
                        value={opcao.resposta}
                        onChange={(e) => updateMenuOption(index, 'resposta', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ação especial</label>
                      <select
                        value={opcao.acao || ''}
                        onChange={(e) => updateMenuOption(index, 'acao', e.target.value || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Nenhuma ação especial</option>
                        <option value="transferir_atendente">Transferir para atendente humano</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addMenuOption}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Adicionar Opção ao Menu</span>
                </button>
              </div>
            )}
          </div>

          {/* Respostas Automáticas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="p-6 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleSection('respostas')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Respostas Automáticas ({config.bot_respostas.length})</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure respostas para palavras-chave específicas
                  </p>
                </div>
                {expandedSections.respostas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.respostas && (
              <div className="p-6 space-y-4">
                {config.bot_respostas.map((resposta, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-700">Resposta {index + 1}</span>
                      <button
                        onClick={() => removeAutoResponse(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Palavras-chave (separadas por vírgula)</label>
                      <input
                        type="text"
                        placeholder="preço, valor, quanto custa"
                        value={resposta.palavras_chave.join(', ')}
                        onChange={(e) => updateAutoResponse(index, 'palavras_chave', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Resposta automática</label>
                      <textarea
                        placeholder="Resposta quando detectar essas palavras"
                        value={resposta.resposta}
                        onChange={(e) => updateAutoResponse(index, 'resposta', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addAutoResponse}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Adicionar Resposta Automática</span>
                </button>
              </div>
            )}
          </div>

          {/* Configurações Avançadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="p-6 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleSection('config')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Configurações Avançadas</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ajuste fino do comportamento do bot
                  </p>
                </div>
                {expandedSections.config ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.config && (
              <div className="p-6 space-y-6">
                {/* Delay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delay da Resposta: {config.bot_delay_resposta} segundos
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Tempo de espera antes do bot responder (simula digitação)
                  </p>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={config.bot_delay_resposta}
                      onChange={(e) => setConfig({ ...config, bot_delay_resposta: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-lg font-medium text-gray-900 w-12 text-center">
                      {config.bot_delay_resposta}s
                    </span>
                  </div>
                </div>

                {/* Palavras para Transferir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palavras que Transferem para Atendente
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Quando o cliente digitar essas palavras, será transferido para um atendente humano
                  </p>
                  <input
                    type="text"
                    placeholder="atendente, humano, falar com alguém, ajuda"
                    value={config.bot_transferir_atendente_palavras?.join(', ') || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      bot_transferir_atendente_palavras: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status e Teste */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-2">Como testar o bot:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Certifique-se que o bot está <strong>ATIVO</strong> (toggle azul)</li>
                  <li>Salve as configurações clicando em "Salvar Configurações"</li>
                  <li>Envie uma mensagem para o WhatsApp conectado</li>
                  <li>O bot responderá automaticamente baseado nas suas configurações</li>
                </ol>
                {config.bot_ativo && (
                  <p className="mt-3 font-semibold text-green-700">
                    ✅ Bot está ATIVO e pronto para responder!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBotConfig;