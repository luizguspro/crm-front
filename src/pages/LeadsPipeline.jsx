// frontend/src/pages/LeadsPipeline.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, MessageSquare,
  Clock, Calendar, User, Building2, Tag, DollarSign, Star,
  ChevronDown, ArrowRight, Activity, FileText, Send, Paperclip,
  Check, X, AlertCircle, TrendingUp, Zap, Instagram, Facebook,
  MessageCircle, ListTodo, Trash2, Edit, RefreshCw, Users
} from 'lucide-react';
import { pipelineService } from '../services/api';

const LeadsPipeline = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('activity');
  const [draggedLead, setDraggedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [hoveredLead, setHoveredLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pipeline com dados reais
  const [pipeline, setPipeline] = useState([]);

  // Buscar dados do pipeline
  const fetchPipeline = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await pipelineService.getDeals();
      setPipeline(response.data);
      
    } catch (err) {
      console.error('Erro ao buscar pipeline:', err);
      setError('Erro ao carregar pipeline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'messenger': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-gray-600" />;
      case 'phone': return <Phone className="w-4 h-4 text-gray-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleDragStart = (e, lead, stageId) => {
    setDraggedLead({ lead, stageId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStageId) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stageId !== targetStageId) {
      try {
        // Chamar API para mover o negócio
        await pipelineService.moveDeal(draggedLead.lead.id, targetStageId);
        
        // Atualizar o estado local
        const newPipeline = pipeline.map(stage => {
          if (stage.id === draggedLead.stageId) {
            return {
              ...stage,
              leads: stage.leads.filter(lead => lead.id !== draggedLead.lead.id)
            };
          }
          if (stage.id === targetStageId) {
            return {
              ...stage,
              leads: [...stage.leads, draggedLead.lead]
            };
          }
          return stage;
        });
        setPipeline(newPipeline);
      } catch (error) {
        console.error('Erro ao mover negócio:', error);
        // Recarregar o pipeline em caso de erro
        fetchPipeline();
      }
      setDraggedLead(null);
    }
  };

  const addNote = () => {
    if (newNote.trim() && selectedLead) {
      // TODO: Implementar API para adicionar notas
      setNewNote('');
    }
  };

  const totalValue = pipeline.reduce((sum, stage) => 
    sum + stage.leads.reduce((stageSum, lead) => stageSum + lead.value, 0), 0
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Erro ao carregar pipeline</p>
          <button 
            onClick={fetchPipeline}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Pipeline View */}
      <div className={`flex-1 overflow-hidden ${selectedLead ? 'lg:mr-96' : ''}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
              <p className="text-sm text-gray-500">
                {totalValue > 0 
                  ? `Valor total: R$ ${totalValue.toLocaleString('pt-BR')}`
                  : 'Nenhum negócio em andamento'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchPipeline}
                className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Atualizar"
              >
                <RefreshCw size={18} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={18} />
                <span>Novo Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Kanban */}
        <div className="flex overflow-x-auto p-6 space-x-4" style={{ height: 'calc(100vh - 88px)' }}>
          {pipeline.length > 0 ? (
            pipeline.map((stage) => (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                  {/* Stage Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                      <span className="text-sm text-gray-500">{stage.leads.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-full h-1 ${stage.color} rounded-full`}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{stage.description}</p>
                  </div>

                  {/* Leads */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {stage.leads.length > 0 ? (
                      stage.leads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead, stage.id)}
                          onClick={() => setSelectedLead(lead)}
                          onMouseEnter={() => setHoveredLead(lead.id)}
                          onMouseLeave={() => setHoveredLead(null)}
                          className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 relative group"
                        >
                          {/* Ações Rápidas - aparecem no hover */}
                          {hoveredLead === lead.id && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1 z-10">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Adicionar tarefa para: ' + lead.name);
                                }}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Adicionar Tarefa"
                              >
                                <ListTodo size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Agendar reunião com: ' + lead.name);
                                }}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Agendar Reunião"
                              >
                                <Calendar size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Editar: ' + lead.name);
                                }}
                                className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{lead.name}</h4>
                              <p className="text-sm text-gray-500 flex items-center">
                                <User size={14} className="mr-1" />
                                {lead.contact}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-semibold text-gray-900">
                              R$ {lead.value.toLocaleString('pt-BR')}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {lead.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              {getChannelIcon(lead.lastChannel)}
                              <span className="ml-1">{lead.lastContact}</span>
                            </span>
                            <span className="text-gray-400">{lead.source}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Nenhum negócio nesta etapa</p>
                      </div>
                    )}
                  </div>

                  {/* Add Lead Button */}
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Plus size={16} />
                      <span className="text-sm">Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum negócio no pipeline</h2>
                <p className="text-gray-500 mb-4">Comece recebendo mensagens no WhatsApp</p>
                <p className="text-sm text-gray-400">Os leads aparecerão aqui automaticamente</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Panel */}
      {selectedLead && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-40">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <p className="text-sm text-gray-500">{selectedLead.contact}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lead Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={18} />
                <span className="text-gray-700">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-gray-400" size={18} />
                <span className="text-lg font-semibold text-gray-900">
                  R$ {selectedLead.value.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="text-gray-400" size={18} />
                <span className="text-gray-700">Origem: {selectedLead.source}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {selectedLead.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {['activity', 'tasks', 'info'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'activity' && 'Conversas'}
                  {tab === 'tasks' && 'Tarefas'}
                  {tab === 'info' && 'Informações'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4">
            {activeTab === 'activity' && (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                <p>Histórico de conversas em breve</p>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="text-center py-8 text-gray-400">
                <ListTodo className="w-12 h-12 mx-auto mb-2" />
                <p>Tarefas em breve</p>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Score do Lead</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedLead.score >= 80 ? 'bg-green-500' : 
                          selectedLead.score >= 60 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${selectedLead.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{selectedLead.score}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Último contato</label>
                  <p className="text-gray-900 flex items-center mt-1">
                    {getChannelIcon(selectedLead.lastChannel)}
                    <span className="ml-2">{selectedLead.lastContact}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPipeline;