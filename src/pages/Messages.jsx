// src/pages/Messages.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Search, Filter, Send, Paperclip, Smile, Mic, 
  MoreVertical, Phone, Video, Info, Clock, Check, CheckCheck,
  Bot, Zap, Calendar, User, Building2, Tag, ArrowLeft, Star,
  Instagram, Mail, Globe, X, Plus, Image, FileText, Volume2,
  Hash, ChevronDown, AlertCircle, Users, DollarSign, TrendingUp
} from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef(null);

  // Conversas mockadas
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: {
        name: 'João Pereira',
        company: 'Tech Startup Inc',
        avatar: 'JP',
        status: 'online',
        phone: '+55 11 98765-4321',
        email: 'joao@techstartup.com',
        tags: ['Cliente VIP', 'Urgente'],
        leadValue: 45000,
        stage: 'Negociação'
      },
      channel: 'whatsapp',
      lastMessage: 'Olá! Gostaria de saber mais sobre o plano Enterprise',
      lastMessageTime: '10:30',
      unread: 3,
      isBot: false,
      conversationStatus: 'waiting_reply', // novo campo
      messages: [
        { id: 1, text: 'Olá! Vi o anúncio sobre o software', sender: 'contact', time: '10:25', status: 'read' },
        { id: 2, text: 'Oi João! Claro, posso te ajudar. Qual seu segmento?', sender: 'me', time: '10:27', status: 'read' },
        { id: 3, text: 'Trabalho com e-commerce', sender: 'contact', time: '10:28', status: 'read' },
        { id: 4, text: 'Perfeito! Temos soluções específicas para e-commerce. Quando podemos agendar uma demo?', sender: 'me', time: '10:29', status: 'read' },
        { id: 5, text: 'Olá! Gostaria de saber mais sobre o plano Enterprise', sender: 'contact', time: '10:30', status: 'read' }
      ]
    },
    {
      id: 2,
      contact: {
        name: 'Maria Santos',
        company: 'Fashion Store',
        avatar: 'MS',
        status: 'offline',
        phone: '+55 21 91234-5678',
        email: 'maria@fashion.com',
        tags: ['Lead', 'Instagram'],
        leadValue: 25000,
        stage: 'Qualificação'
      },
      channel: 'instagram',
      lastMessage: 'Adorei os produtos! Fazem entrega?',
      lastMessageTime: '09:45',
      unread: 1,
      isBot: true,
      conversationStatus: 'new_lead',
      messages: [
        { id: 1, text: 'Oi! Vi seus stories', sender: 'contact', time: '09:40' },
        { id: 2, text: '🤖 Olá! Seja bem-vinda à Fashion Store! Como posso ajudar?', sender: 'bot', time: '09:41' },
        { id: 3, text: 'Adorei os produtos! Fazem entrega?', sender: 'contact', time: '09:45' }
      ]
    },
    {
      id: 3,
      contact: {
        name: 'Carlos Mendes',
        company: 'Consultoria Alpha',
        avatar: 'CM',
        status: 'away',
        phone: '+55 11 93456-7890',
        email: 'carlos@alpha.com',
        tags: ['Reunião Agendada'],
        leadValue: 80000,
        stage: 'Proposta'
      },
      channel: 'email',
      lastMessage: 'Segue em anexo a proposta revisada',
      lastMessageTime: 'Ontem',
      unread: 0,
      isBot: false,
      messages: []
    },
    {
      id: 4,
      contact: {
        name: 'Ana Costa',
        company: 'Digital Agency',
        avatar: 'AC',
        status: 'online',
        phone: '+55 11 94567-8901',
        email: 'ana@digital.com',
        tags: ['Novo Lead', 'Facebook'],
        leadValue: 35000,
        stage: 'Primeiro Contato'
      },
      channel: 'messenger',
      lastMessage: '📎 Enviou um arquivo',
      lastMessageTime: '14:20',
      unread: 2,
      isBot: false,
      messages: []
    }
  ]);

  // Templates de respostas rápidas
  const quickReplies = [
    { id: 1, text: 'Olá! Como posso ajudar você hoje?' },
    { id: 2, text: 'Claro! Vou verificar isso para você.' },
    { id: 3, text: 'Quando seria o melhor horário para conversarmos?' },
    { id: 4, text: 'Enviei as informações por email. Você recebeu?' },
    { id: 5, text: 'Agradeço o contato! Retorno em breve.' }
  ];

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp': return <MessageCircle className="text-green-600" size={18} />;
      case 'instagram': return <Instagram className="text-pink-600" size={18} />;
      case 'messenger': return <Globe className="text-blue-600" size={18} />;
      case 'email': return <Mail className="text-gray-600" size={18} />;
      default: return <MessageCircle className="text-gray-600" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'waiting_reply': { label: 'Aguardando Resposta', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      'meeting_scheduled': { label: 'Reunião Agendada', color: 'bg-blue-100 text-blue-700', icon: '📅' },
      'new_lead': { label: 'Novo Lead', color: 'bg-green-100 text-green-700', icon: '✨' },
      'follow_up': { label: 'Precisa Follow-up', color: 'bg-orange-100 text-orange-700', icon: '🔔' },
      'replied': { label: 'Respondido', color: 'bg-gray-100 text-gray-700', icon: '✓' }
    };
    return statusConfig[status] || statusConfig['replied'];
  };

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedChat.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: message,
            lastMessageTime: newMessage.time
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'unread') return matchesSearch && conv.unread > 0;
    if (selectedFilter === 'bot') return matchesSearch && conv.isBot;
    if (selectedFilter === channel) return matchesSearch && conv.channel === channel;
    
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Lista de Conversas */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 bg-white border-r border-gray-200 flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Mensagens</h1>
          
          {/* Busca */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                selectedFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedFilter('unread')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                selectedFilter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Não lidas
            </button>
            <button
              onClick={() => setSelectedFilter('bot')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                selectedFilter === 'bot' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bot Ativo
            </button>
          </div>
        </div>

        {/* Lista de Chats */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedChat?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {conversation.contact.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(conversation.contact.status)} rounded-full border-2 border-white`}></span>
                  <span className="absolute -top-1 -right-1">{getChannelIcon(conversation.channel)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.contact.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{conversation.contact.company}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-gray-500">{conversation.lastMessageTime}</p>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full mt-1">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {conversation.isBot && <Bot className="w-4 h-4 text-purple-600" />}
                    <p className="text-sm text-gray-600 truncate flex-1">{conversation.lastMessage}</p>
                  </div>
                  <div className="flex items-start justify-between mt-2">
                    <div className="flex gap-1">
                      {conversation.contact.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {conversation.conversationStatus && (
                      <span className={`px-2 py-0.5 text-xs rounded-full flex items-center space-x-1 ${getStatusBadge(conversation.conversationStatus).color}`}>
                        <span>{getStatusBadge(conversation.conversationStatus).icon}</span>
                        <span>{getStatusBadge(conversation.conversationStatus).label}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {selectedChat ? (
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {/* Header do Chat */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {selectedChat.contact.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.contact.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      {getChannelIcon(selectedChat.channel)}
                      <span>{selectedChat.contact.status === 'online' ? 'Online agora' : 'Offline'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Data */}
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    Hoje
                  </span>
                </div>

                {/* Mensagens */}
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      msg.sender === 'me' 
                        ? 'bg-blue-600 text-white' 
                        : msg.sender === 'bot'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-white text-gray-900'
                    } rounded-2xl px-4 py-2 shadow-sm`}>
                      {msg.sender === 'bot' && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Bot className="w-4 h-4" />
                          <span className="text-xs font-medium">Bot Automático</span>
                        </div>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{msg.time}</span>
                        {msg.sender === 'me' && (
                          msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Respostas Rápidas */}
              {showQuickReplies && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Respostas Rápidas:</p>
                  <div className="space-y-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => {
                          setMessage(reply.text);
                          setShowQuickReplies(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm bg-white hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Respostas rápidas"
                    >
                      <Zap size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite uma mensagem..."
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {message ? <Send size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Painel de Informações */}
          <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Informações do Contato</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Informações Básicas */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600 font-semibold mx-auto mb-3">
                  {selectedChat.contact.avatar}
                </div>
                <h4 className="font-semibold text-gray-900">{selectedChat.contact.name}</h4>
                <p className="text-sm text-gray-500">{selectedChat.contact.company}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedChat.contact.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 text-sm rounded-full hover:border-gray-400 hover:text-gray-600">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Informações de Lead */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor do Lead</span>
                  <span className="font-semibold text-gray-900">
                    R$ {selectedChat.contact.leadValue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estágio</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {selectedChat.contact.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Probabilidade</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">75%</span>
                  </div>
                </div>
              </div>

              {/* Contatos */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="text-gray-400" size={16} />
                  <span className="text-gray-700">{selectedChat.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="text-gray-400" size={16} />
                  <span className="text-gray-700">{selectedChat.contact.email}</span>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Calendar size={16} />
                  <span>Agendar Reunião</span>
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Criar Tarefa</span>
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Users size={16} />
                  <span>Ver no Pipeline</span>
                </button>
              </div>

              {/* Notas */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Notas Internas</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  Cliente preferencial. Sempre responder rapidamente. Interessado em expansão.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma conversa</h2>
            <p className="text-gray-500">Escolha uma conversa da lista para começar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;