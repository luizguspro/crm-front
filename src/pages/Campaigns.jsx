// frontend/src/pages/Campaigns.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Plus, Search, Filter, MoreVertical, Play, Pause,
  MessageCircle, Mail, Users, Target, Calendar, Clock, TrendingUp,
  Edit2, Trash2, Copy, Archive, Send, Settings, ChevronDown,
  AlertCircle, CheckCircle, XCircle, Info, Zap, Award, DollarSign,
  Eye, Download, Upload, RefreshCw, Star, Hash, ChevronRight,
  Smartphone, Globe, Instagram, Facebook, Phone, ArrowUp, ArrowDown
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

const Campaigns = () => {
  const { isDemoMode } = useDemo();
  
  // Estados
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Form states
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    status: 'draft',
    targetAudience: '',
    startDate: '',
    endDate: '',
    budget: '',
    message: '',
    channels: []
  });

  const [editingCampaign, setEditingCampaign] = useState(null);

  // Dados mockados
  useEffect(() => {
    // Campanhas de exemplo
    const mockCampaigns = [
      {
        id: '1',
        name: 'Black Friday 2024',
        type: 'multicanal',
        status: 'active',
        channels: ['whatsapp', 'email', 'instagram'],
        targetAudience: 'Clientes VIP',
        startDate: '2024-11-20',
        endDate: '2024-11-30',
        budget: 5000,
        sent: 1250,
        delivered: 1180,
        opened: 892,
        clicked: 234,
        converted: 45,
        revenue: 125000,
        roi: 2400,
        message: 'Aproveite até 70% OFF em toda a loja!',
        createdAt: '2024-11-15'
      },
      {
        id: '2',
        name: 'Reengajamento Q3',
        type: 'email',
        status: 'scheduled',
        channels: ['email'],
        targetAudience: 'Leads Frios',
        startDate: '2024-08-15',
        endDate: '2024-08-20',
        budget: 2000,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
        roi: 0,
        message: 'Sentimos sua falta! Volte com 20% de desconto',
        createdAt: '2024-08-10'
      },
      {
        id: '3',
        name: 'Lançamento Produto X',
        type: 'whatsapp',
        status: 'completed',
        channels: ['whatsapp'],
        targetAudience: 'Base Completa',
        startDate: '2024-07-01',
        endDate: '2024-07-07',
        budget: 3000,
        sent: 3450,
        delivered: 3290,
        opened: 2890,
        clicked: 567,
        converted: 89,
        revenue: 89000,
        roi: 2867,
        message: 'Conheça o novo Produto X com condições especiais!',
        createdAt: '2024-06-25'
      }
    ];

    setCampaigns(mockCampaigns);
  }, []);

  // Funções
  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.message) {
      alert('Nome e mensagem são obrigatórios');
      return;
    }

    const campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      budget: parseFloat(newCampaign.budget) || 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
      createdAt: new Date().toISOString()
    };

    setCampaigns([campaign, ...campaigns]);
    setShowCreateModal(false);
    setNewCampaign({
      name: '',
      type: 'email',
      status: 'draft',
      targetAudience: '',
      startDate: '',
      endDate: '',
      budget: '',
      message: '',
      channels: []
    });
  };

  const handleEditCampaign = () => {
    if (!editingCampaign) return;

    setCampaigns(campaigns.map(c => 
      c.id === editingCampaign.id ? editingCampaign : c
    ));
    setSelectedCampaign(editingCampaign);
    setShowEditModal(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;
    
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null);
    }
  };

  const handleDuplicateCampaign = (campaign) => {
    const duplicated = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Cópia)`,
      status: 'draft',
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
      createdAt: new Date().toISOString()
    };
    setCampaigns([duplicated, ...campaigns]);
  };

  const toggleCampaignStatus = (campaignId) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        const newStatus = c.status === 'active' ? 'paused' : 
                         c.status === 'paused' ? 'active' : 
                         c.status === 'draft' ? 'scheduled' : c.status;
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // Filtros
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-700" />;
      case 'sms': return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Métricas gerais
  const totalMetrics = campaigns.reduce((acc, campaign) => ({
    sent: acc.sent + campaign.sent,
    delivered: acc.delivered + campaign.delivered,
    opened: acc.opened + campaign.opened,
    clicked: acc.clicked + campaign.clicked,
    converted: acc.converted + campaign.converted,
    revenue: acc.revenue + campaign.revenue,
    budget: acc.budget + campaign.budget
  }), { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, revenue: 0, budget: 0 });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
              <p className="text-sm text-gray-500">
                {campaigns.length} campanhas • {campaigns.filter(c => c.status === 'active').length} ativas
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={18} />
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                // Continuação do arquivo Campaigns.jsx

               <Plus size={18} />
               <span>Nova Campanha</span>
             </button>
           </div>
         </div>
       </div>
     </header>

     <div className="p-6">
       {/* Métricas Gerais */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <div className="bg-white rounded-xl p-6 border border-gray-200">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Total Enviado</p>
             <Send className="w-5 h-5 text-blue-600" />
           </div>
           <p className="text-2xl font-bold text-gray-900">{totalMetrics.sent.toLocaleString('pt-BR')}</p>
           <p className="text-xs text-green-600 mt-2">
             <ArrowUp className="w-3 h-3 inline" />
             +12% vs mês anterior
           </p>
         </div>

         <div className="bg-white rounded-xl p-6 border border-gray-200">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Taxa de Abertura</p>
             <Eye className="w-5 h-5 text-green-600" />
           </div>
           <p className="text-2xl font-bold text-gray-900">
             {totalMetrics.sent > 0 ? ((totalMetrics.opened / totalMetrics.sent) * 100).toFixed(1) : 0}%
           </p>
           <p className="text-xs text-green-600 mt-2">
             <ArrowUp className="w-3 h-3 inline" />
             +5.2% vs média
           </p>
         </div>

         <div className="bg-white rounded-xl p-6 border border-gray-200">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Conversões</p>
             <Target className="w-5 h-5 text-purple-600" />
           </div>
           <p className="text-2xl font-bold text-gray-900">{totalMetrics.converted}</p>
           <p className="text-xs text-green-600 mt-2">
             <ArrowUp className="w-3 h-3 inline" />
             +18% este mês
           </p>
         </div>

         <div className="bg-white rounded-xl p-6 border border-gray-200">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">ROI Total</p>
             <DollarSign className="w-5 h-5 text-emerald-600" />
           </div>
           <p className="text-2xl font-bold text-gray-900">
             {totalMetrics.budget > 0 ? ((totalMetrics.revenue / totalMetrics.budget - 1) * 100).toFixed(0) : 0}%
           </p>
           <p className="text-xs text-green-600 mt-2">
             {formatCurrency(totalMetrics.revenue)}
           </p>
         </div>
       </div>

       {/* Filtros e Busca */}
       <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Buscar campanhas..."
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
               />
             </div>
           </div>
           <div className="flex gap-2">
             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
             >
               <option value="all">Todos os Status</option>
               <option value="active">Ativas</option>
               <option value="scheduled">Agendadas</option>
               <option value="paused">Pausadas</option>
               <option value="completed">Concluídas</option>
               <option value="draft">Rascunho</option>
             </select>
             <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
               <Filter size={18} />
               <span>Mais filtros</span>
             </button>
           </div>
         </div>
       </div>

       {/* Lista de Campanhas */}
       <div className="grid gap-4">
         {filteredCampaigns.map((campaign) => (
           <div 
             key={campaign.id}
             className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setSelectedCampaign(campaign)}
           >
             <div className="flex items-start justify-between">
               <div className="flex-1">
                 <div className="flex items-center space-x-3 mb-2">
                   <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                   <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(campaign.status)}`}>
                     {campaign.status === 'active' && 'Ativa'}
                     {campaign.status === 'scheduled' && 'Agendada'}
                     {campaign.status === 'paused' && 'Pausada'}
                     {campaign.status === 'completed' && 'Concluída'}
                     {campaign.status === 'draft' && 'Rascunho'}
                   </span>
                   <div className="flex items-center space-x-1">
                     {campaign.channels.map((channel, idx) => (
                       <span key={idx}>{getChannelIcon(channel)}</span>
                     ))}
                   </div>
                 </div>
                 
                 <p className="text-sm text-gray-600 mb-3">{campaign.message}</p>
                 
                 <div className="flex items-center space-x-6 text-sm text-gray-500">
                   <span className="flex items-center">
                     <Users className="w-4 h-4 mr-1" />
                     {campaign.targetAudience}
                   </span>
                   <span className="flex items-center">
                     <Calendar className="w-4 h-4 mr-1" />
                     {new Date(campaign.startDate).toLocaleDateString('pt-BR')}
                   </span>
                   <span className="flex items-center">
                     <DollarSign className="w-4 h-4 mr-1" />
                     {formatCurrency(campaign.budget)}
                   </span>
                 </div>
               </div>

               <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                 {campaign.status === 'active' ? (
                   <button
                     onClick={() => toggleCampaignStatus(campaign.id)}
                     className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                     title="Pausar"
                   >
                     <Pause size={18} />
                   </button>
                 ) : campaign.status === 'paused' ? (
                   <button
                     onClick={() => toggleCampaignStatus(campaign.id)}
                     className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                     title="Retomar"
                   >
                     <Play size={18} />
                   </button>
                 ) : campaign.status === 'draft' && (
                   <button
                     onClick={() => toggleCampaignStatus(campaign.id)}
                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                     title="Agendar"
                   >
                     <Clock size={18} />
                   </button>
                 )}
                 
                 <button
                   onClick={() => {
                     setEditingCampaign(campaign);
                     setShowEditModal(true);
                   }}
                   className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                   title="Editar"
                 >
                   <Edit2 size={18} />
                 </button>
                 
                 <button
                   onClick={() => handleDuplicateCampaign(campaign)}
                   className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                   title="Duplicar"
                 >
                   <Copy size={18} />
                 </button>
                 
                 <button
                   onClick={() => handleDeleteCampaign(campaign.id)}
                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                   title="Excluir"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>

             {/* Métricas da Campanha */}
             {campaign.sent > 0 && (
               <div className="mt-4 pt-4 border-t border-gray-200">
                 <div className="grid grid-cols-5 gap-4">
                   <div>
                     <p className="text-xs text-gray-500">Enviados</p>
                     <p className="text-sm font-semibold text-gray-900">{campaign.sent.toLocaleString('pt-BR')}</p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500">Entregues</p>
                     <p className="text-sm font-semibold text-gray-900">
                       {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                     </p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500">Abertos</p>
                     <p className="text-sm font-semibold text-gray-900">
                       {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                     </p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500">Cliques</p>
                     <p className="text-sm font-semibold text-gray-900">
                       {((campaign.clicked / campaign.opened) * 100).toFixed(1)}%
                     </p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500">ROI</p>
                     <p className="text-sm font-semibold text-green-600">
                       {campaign.roi}%
                     </p>
                   </div>
                 </div>
               </div>
             )}
           </div>
         ))}

         {filteredCampaigns.length === 0 && (
           <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
             <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
             <p className="text-gray-500">Nenhuma campanha encontrada</p>
             <button 
               onClick={() => setShowCreateModal(true)}
               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
             >
               Criar primeira campanha
             </button>
           </div>
         )}
       </div>
     </div>

     {/* Modal Criar Campanha */}
     {showCreateModal && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
           <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-gray-900">Nova Campanha</h2>
               <button
                 onClick={() => setShowCreateModal(false)}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <XCircle size={24} />
               </button>
             </div>
           </div>

           <div className="p-6 space-y-6">
             {/* Informações Básicas */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Campanha *</label>
                   <input
                     type="text"
                     value={newCampaign.name}
                     onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     placeholder="Ex: Black Friday 2024"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                     <select
                       value={newCampaign.type}
                       onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="email">Email</option>
                       <option value="whatsapp">WhatsApp</option>
                       <option value="sms">SMS</option>
                       <option value="multicanal">Multicanal</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Público-alvo</label>
                     <select
                       value={newCampaign.targetAudience}
                       onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="">Selecione...</option>
                       <option value="Todos os Contatos">Todos os Contatos</option>
                       <option value="Clientes VIP">Clientes VIP</option>
                       <option value="Leads Quentes">Leads Quentes</option>
                       <option value="Leads Frios">Leads Frios</option>
                       <option value="Aniversariantes">Aniversariantes</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>

             {/* Canais */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais de Envio</h3>
               <div className="grid grid-cols-3 gap-3">
                 {['whatsapp', 'email', 'sms', 'instagram', 'facebook'].map((channel) => (
                   <label 
                     key={channel}
                     className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                       newCampaign.channels.includes(channel) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                     }`}
                   >
                     <input
                       type="checkbox"
                       checked={newCampaign.channels.includes(channel)}
                       onChange={(e) => {
                         if (e.target.checked) {
                           setNewCampaign({ ...newCampaign, channels: [...newCampaign.channels, channel] });
                         } else {
                           setNewCampaign({ ...newCampaign, channels: newCampaign.channels.filter(c => c !== channel) });
                         }
                       }}
                       className="text-blue-600"
                     />
                     <span className="flex items-center space-x-2">
                       {getChannelIcon(channel)}
                       <span className="text-sm capitalize">{channel}</span>
                     </span>
                   </label>
                 ))}
               </div>
             </div>

             {/* Agendamento */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamento</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                   <input
                     type="date"
                     value={newCampaign.startDate}
                     onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                   <input
                     type="date"
                     value={newCampaign.endDate}
                     onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                   />
                 </div>
               </div>
             </div>

             {/* Mensagem */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensagem</h3>
               <textarea
                 value={newCampaign.message}
                 onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 rows="5"
                 placeholder="Digite a mensagem da campanha..."
               />
               <p className="text-xs text-gray-500 mt-2">
                 Use {'{nome}'} para personalizar com o nome do contato
               </p>
             </div>

             {/* Orçamento */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Orçamento</h3>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                 <input
                   type="number"
                   value={newCampaign.budget}
                   onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                   placeholder="0,00"
                 />
               </div>
             </div>
           </div>

           <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
             <div className="flex justify-end space-x-3">
               <button
                 onClick={() => setShowCreateModal(false)}
                 className="px-4 py-2 text-gray-700 hover:text-gray-900"
               >
                 Cancelar
               </button>
               <button
                 onClick={() => {
                   setNewCampaign({ ...newCampaign, status: 'draft' });
                   handleCreateCampaign();
                 }}
                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
               >
                 Salvar como Rascunho
               </button>
               <button
                 onClick={() => {
                   setNewCampaign({ ...newCampaign, status: 'scheduled' });
                   handleCreateCampaign();
                 }}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 Criar e Agendar
               </button>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Modal Editar Campanha */}
     {showEditModal && editingCampaign && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
           <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-gray-900">Editar Campanha</h2>
               <button
                 onClick={() => {
                   setShowEditModal(false);
                   setEditingCampaign(null);
                 }}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <XCircle size={24} />
               </button>
             </div>
           </div>

           <div className="p-6 space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Campanha</label>
               <input
                 type="text"
                 value={editingCampaign.name}
                 onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
               <textarea
                 value={editingCampaign.message}
                 onChange={(e) => setEditingCampaign({ ...editingCampaign, message: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 rows="5"
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                 <input
                   type="date"
                   value={editingCampaign.startDate}
                   onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                 <input
                   type="date"
                   value={editingCampaign.endDate}
                   onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento</label>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                 <input
                   type="number"
                   value={editingCampaign.budget}
                   onChange={(e) => setEditingCampaign({ ...editingCampaign, budget: parseFloat(e.target.value) })}
                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select
                 value={editingCampaign.status}
                 onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
               >
                 <option value="draft">Rascunho</option>
                 <option value="scheduled">Agendada</option>
                 <option value="active">Ativa</option>
                 <option value="paused">Pausada</option>
                 <option value="completed">Concluída</option>
               </select>
             </div>
           </div>

           <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
             <div className="flex justify-end space-x-3">
               <button
                 onClick={() => {
                   setShowEditModal(false);
                   setEditingCampaign(null);
                 }}
                 className="px-4 py-2 text-gray-700 hover:text-gray-900"
               >
                 Cancelar
               </button>
               <button
                 onClick={handleEditCampaign}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 Salvar Alterações
               </button>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default Campaigns;