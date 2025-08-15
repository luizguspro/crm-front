// src/pages/Conversations.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Filter, Phone, Video, MoreVertical,
  Check, CheckCheck, Clock, Send, Paperclip, Smile, Mic,
  Archive, Star, Trash2, RefreshCw, AlertCircle, User,
  Calendar, Tag, ChevronDown, X, Instagram, Facebook,
  Loader2, Wifi, WifiOff
} from 'lucide-react';
import io from 'socket.io-client';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio('/notification.mp3'));

  // Conectar Socket.io ao montar
  useEffect(() => {
    const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
    
    socketRef.current = io('http://localhost:3001', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('Socket conectado');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsConnected(false);
    });

    // Escutar eventos do WhatsApp
    socketRef.current.on('nova-mensagem', handleNewMessage);
    socketRef.current.on('conversation-updated', handleConversationUpdate);
    socketRef.current.on('whatsapp:message', handleWhatsAppMessage);
    socketRef.current.on('whatsapp:ready', () => {
      console.log('WhatsApp conectado e pronto');
      loadConversations();
    });

    // Carregar conversas iniciais
    loadConversations();

    // Pedir permissão para notificações
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Polling para atualizar conversas
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadConversations();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [searchTerm, filterStatus]);

  // Carregar lista de conversas
  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`http://localhost:3001/api/conversations?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar conversas');

      const data = await response.json();
      setConversations(data);

      // Se não tem conversa selecionada, selecionar a primeira
      if (data.length > 0 && !selectedConversation) {
        selectConversation(data[0]);
      }

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
      setError('Erro ao carregar conversas');
    } finally {
      setIsLoading(false);
    }
  };

  // Selecionar conversa e carregar mensagens
  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setIsLoadingMessages(true);

    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:3001/api/conversations/${conversation.id}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar mensagens');

      const messagesData = await response.json();
      setMessages(messagesData);

      // Marcar como lida
      setConversations(prev =>
        prev.map(conv => ({
          ...conv,
          unread: conv.id === conversation.id ? 0 : conv.unread
        }))
      );

    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Adicionar mensagem otimisticamente
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: 'me',
      time: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('maya-token') || localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:3001/api/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: messageText })
        }
      );

      if (!response.ok) throw new Error('Erro ao enviar mensagem');

      const result = await response.json();

      // Atualizar mensagem com dados reais
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...result.message, status: 'sent' }
            : msg
        )
      );

      // Atualizar última mensagem na lista
      updateConversationLastMessage(selectedConversation.id, messageText);

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      
      // Marcar mensagem como erro
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, status: 'error' }
            : msg
        )
      );
      
      // Recolocar mensagem no input
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  // Handler para nova mensagem via Socket
  const handleNewMessage = (data) => {
    console.log('Nova mensagem recebida:', data);

    // Se é da conversa selecionada, adicionar mensagem
    if (selectedConversation?.id === data.conversaId) {
      setMessages(prev => [...prev, {
        id: data.mensagem.id,
        text: data.mensagem.text,
        sender: data.mensagem.sender,
        time: data.mensagem.time,
        status: 'received'
      }]);
    }

    // Atualizar lista de conversas
    updateConversationLastMessage(
      data.conversaId,
      data.mensagem.text,
      data.mensagem.sender === 'contact' ? 1 : 0
    );

    // Tocar som e mostrar notificação
    if (data.mensagem.sender === 'contact') {
      playNotificationSound();
      showNotification(data.mensagem.contactName, data.mensagem.text);
    }
  };

  // Handler para mensagem do WhatsApp
  const handleWhatsAppMessage = (data) => {
    console.log('Mensagem WhatsApp recebida:', data);
    
    // Recarregar conversas para incluir nova mensagem
    loadConversations();
    
    // Se é da conversa selecionada, adicionar mensagem
    if (selectedConversation?.contact?.phone === data.from) {
      setMessages(prev => [...prev, {
        id: data.id || Date.now().toString(),
        text: data.body,
        sender: 'contact',
        time: new Date().toISOString(),
        status: 'received'
      }]);
    }

    // Notificar
    playNotificationSound();
    showNotification(data.pushname || data.from, data.body);
  };

  // Handler para atualização de conversa
  const handleConversationUpdate = (data) => {
    setConversations(prev => {
      const exists = prev.find(c => c.id === data.id);

      if (exists) {
        return prev.map(conv =>
          conv.id === data.id
            ? {
                ...conv,
                lastMessage: data.lastMessage,
                lastMessageTime: data.lastMessageTime,
                unread: conv.id === selectedConversation?.id ? 0 : data.unreadCount
              }
            : conv
        ).sort((a, b) =>
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
      } else {
        loadConversations();
        return prev;
      }
    });
  };

  // Atualizar última mensagem da conversa
  const updateConversationLastMessage = (conversationId, message, unreadIncrement = 0) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: message,
              lastMessageTime: new Date().toISOString(),
              unread: conv.id === selectedConversation?.id ? 0 : (conv.unread || 0) + unreadIncrement
            }
          : conv
      ).sort((a, b) =>
        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      )
    );
  };

  // Tocar som de notificação
  const playNotificationSound = () => {
    audioRef.current.play().catch(e => console.log('Erro ao tocar som:', e));
  };

  // Mostrar notificação do browser
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted' && document.hidden) {
      new Notification(title, {
        body,
        icon: '/whatsapp-icon.png',
        badge: '/whatsapp-badge.png'
      });
    }
  };

  // Formatar hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
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

  // Filtrar conversas
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchTerm || 
      conv.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contact?.phone?.includes(searchTerm) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'unread' && conv.unread > 0) ||
      (filterStatus === 'open' && conv.status === 'open');

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Conversas</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                   title={isConnected ? 'Conectado' : 'Desconectado'} />
              <button 
                onClick={loadConversations}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* Busca */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                onClick={loadConversations}
                className="mt-2 text-blue-600 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 mb-2" />
              <p>Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
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
                        {conv.contact?.name || conv.contact?.phone || 'Contato'}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage || 'Clique para iniciar conversa'}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChannelIcon(conv.channel || 'whatsapp')}
                      <span className="ml-2 text-xs text-gray-500">
                        {conv.channel || 'whatsapp'}
                      </span>
                      {conv.unread > 0 && (
                        <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unread}
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
                    {selectedConversation.contact?.name || 'Contato'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.contact?.phone}
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Nenhuma mensagem ainda. Comece uma conversa!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {msg.time ? new Date(msg.time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </span>
                      {msg.sender === 'me' && (
                        msg.status === 'sent' || msg.status === 'delivered' ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : msg.status === 'sending' ? (
                          <Clock className="w-4 h-4" />
                        ) : msg.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Digite uma mensagem..."
                disabled={isSending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mic className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={sendMessage}
                disabled={isSending || !newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
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