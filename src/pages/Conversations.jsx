// frontend/src/pages/Conversations.jsx
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Phone, Video, MoreVertical,
  Check, CheckCheck, Clock, Send, Paperclip, Smile, Mic,
  Archive, Star, Trash2, RefreshCw, AlertCircle, User,
  Calendar, Tag, ChevronDown, X, Instagram, Facebook
} from 'lucide-react';
import { conversationService } from '../services/api';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Buscar conversas
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await conversationService.getAll({
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });
      
      setConversations(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar conversas:', err);
      setError('Erro ao carregar conversas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [searchTerm, filterStatus]);

  // Buscar mensagens de uma conversa
  const fetchMessages = async (conversationId) => {
    try {
      const response = await conversationService.getById(conversationId);
      setMessages(response.data.mensagens || []);
      setSelectedConversation(response.data);
      
      // Marcar como lida
      await conversationService.markAsRead(conversationId);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await conversationService.sendMessage(selectedConversation.id, {
        conteudo: newMessage,
        tipo: 'texto'
      });
      
      setNewMessage('');
      // Recarregar mensagens
      fetchMessages(selectedConversation.id);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  // Formatar hora
  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    
    return d.toLocaleDateString('pt-BR');
  };

  // Obter ícone do canal
  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'messenger':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Lista de Conversas */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversas</h2>
          
          {/* Busca */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterStatus === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterStatus === 'unread' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Não lidas
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterStatus === 'open' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Abertas
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <AlertCircle className="w-12 h-12 mb-2" />
              <p>{error}</p>
              <button 
                onClick={fetchConversations}
                className="mt-2 text-blue-600 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 mb-2" />
              <p>Nenhuma conversa encontrada</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => fetchMessages(conv.id)}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {conv.contato?.nome || conv.contato?.whatsapp || 'Contato'}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.ultima_mensagem_em)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.ultima_mensagem}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChannelIcon(conv.canal_tipo)}
                      <span className="ml-2 text-xs text-gray-500">
                        {conv.canal_tipo}
                      </span>
                      {conv.nao_lidas > 0 && (
                        <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.nao_lidas}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Mensagens */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Header da Conversa */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.contato?.nome || 'Contato'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.contato?.whatsapp}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.remetente_tipo === 'bot' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.remetente_tipo === 'bot'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.conteudo}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    msg.remetente_tipo === 'bot' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">
                      {new Date(msg.criado_em).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {msg.remetente_tipo === 'bot' && (
                      msg.lida ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite uma mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mic className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecione uma conversa
            </h3>
            <p className="text-gray-500">
              Escolha uma conversa da lista para começar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;