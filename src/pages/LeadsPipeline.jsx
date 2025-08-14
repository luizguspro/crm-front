// frontend/src/pages/LeadsPipeline.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, MessageCircle,
  Clock, Calendar, User, Building2, Tag, DollarSign, Star,
  ChevronDown, ArrowRight, Activity, FileText, Send, Paperclip,
  Check, X, AlertCircle, TrendingUp, Zap, Instagram, Facebook,
  MessageCircle as WhatsApp, ListTodo, Trash2, Edit, RefreshCw, Users,
  ChevronLeft, ChevronRight, Hash, MapPin, Globe, Briefcase,
  Target, Award, Eye, EyeOff, Save, Archive, Copy, ExternalLink
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import apiMock from '../services/apiMock';
import { pipelineService } from '../services/api';

const LeadsPipeline = () => {
  const { isDemoMode, mockDataService } = useDemo();
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [draggedLead, setDraggedLead] = useState(null);
  const [hoveredLead, setHoveredLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados dos modais
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [stageToAddLead, setStageToAddLead] = useState(null);
  
  // Estados dos formulários
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: '',
    source: 'Website',
    stage: 'new',
    tags: []
  });

  const [editingLead, setEditingLead] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    notes: ''
  });

  // Pipeline com dados reais
  const [pipeline, setPipeline] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [conversations, setConversations] = useState([]);

  // Buscar dados do pipeline
  const fetchPipeline = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response;
      if (isDemoMode) {
        response = await apiMock.getPipelineDeals();
      } else {
        try {
          response = await pipelineService.getDeals();
        } catch (err) {
          response = { 
            data: [
              { id: 'new', title: 'Novos Leads', color: 'bg-blue-500', description: 'Leads recém chegados', leads: [] },
              { id: 'qualified', title: 'Qualificados', color: 'bg-purple-500', description: 'Leads com potencial confirmado', leads: [] },
              { id: 'proposal', title: 'Proposta', color: 'bg-amber-500', description: 'Proposta enviada', leads: [] },
              { id: 'negotiation', title: 'Negociação', color: 'bg-orange-500', description: 'Em negociação final', leads: [] },
              { id: 'won', title: 'Ganhos', color: 'bg-green-500', description: 'Negócios fechados', leads: [] }
            ]
          };
        }
      }
      
      setPipeline(response.data || []);
      
    } catch (err) {
      console.error('Erro ao buscar pipeline:', err);
      setError('Erro ao carregar pipeline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, [isDemoMode]);

  // Atualizar em tempo real no modo demo
  useEffect(() => {
    if (isDemoMode && mockDataService) {
      const handleDealUpdate = () => {
        fetchPipeline();
      };

      mockDataService.on('deal-moved', handleDealUpdate);
      mockDataService.on('new-lead', handleDealUpdate);

      const interval = setInterval(() => {
        fetchPipeline();
      }, 8000);

      return () => {
        mockDataService.off('deal-moved', handleDealUpdate);
        mockDataService.off('new-lead', handleDealUpdate);
        clearInterval(interval);
      };
    }
  }, [isDemoMode]);

  // Funções de manipulação
  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    const leadToCreate = {
      ...newLead,
      id: Date.now().toString(),
      value: parseFloat(newLead.value) || 0,
      score: Math.floor(Math.random() * 40) + 60,
      lastContact: 'Agora',
      lastChannel: 'manual',
      contact: newLead.phone,
      stage: stageToAddLead || newLead.stage,
      createdAt: new Date().toISOString()
    };

    // Adicionar ao pipeline
    const newPipeline = pipeline.map(stage => {
      if (stage.id === leadToCreate.stage) {
        return {
          ...stage,
          leads: [...stage.leads, leadToCreate]
        };
      }
      return stage;
    });

    setPipeline(newPipeline);
    setShowNewLeadModal(false);
    setStageToAddLead(null);
    
    // Limpar formulário
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      value: '',
      source: 'Website',
      stage: 'new',
      tags: []
    });
  };

  const handleEditLead = () => {
    if (!editingLead) return;

    const updatedPipeline = pipeline.map(stage => ({
      ...stage,
      leads: stage.leads.map(lead => 
        lead.id === editingLead.id ? editingLead : lead
      )
    }));

    setPipeline(updatedPipeline);
    setSelectedLead(editingLead);
    setShowEditModal(false);
    setEditingLead(null);
  };

  const handleDeleteLead = (leadId, stageId) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;

    const updatedPipeline = pipeline.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          leads: stage.leads.filter(lead => lead.id !== leadId)
        };
      }
      return stage;
    });

    setPipeline(updatedPipeline);
    if (selectedLead?.id === leadId) {
      setSelectedLead(null);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title) {
      alert('Título da tarefa é obrigatório');
      return;
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      leadId: selectedLead?.id,
      leadName: selectedLead?.name,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setShowTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      leadId: selectedLead?.id,
      leadName: selectedLead?.name,
      createdAt: new Date().toISOString()
    };

    setMeetings([...meetings, meeting]);
    setShowMeetingModal(false);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '60',
      type: 'video',
      notes: ''
    });
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
      setDraggedLead(null);
    }
  };

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp': return <WhatsApp className="w-4 h-4 text-green-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'messenger': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-gray-600" />;
      case 'phone': return <Phone className="w-4 h-4 text-gray-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalValue = pipeline.reduce((sum, stage) => 
    sum + stage.leads.reduce((stageSum, lead) => stageSum + (lead.value || 0), 0), 0
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
                Valor total: R$ {totalValue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchPipeline}
                className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={() => {
                  setStageToAddLead(null);
                  setShowNewLeadModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Novo Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Kanban */}
        <div className="flex overflow-x-auto p-6 space-x-4" style={{ height: 'calc(100vh - 88px)' }}>
          {pipeline.map((stage) => (
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
                  <div className={`w-full h-1 ${stage.color} rounded-full`}></div>
                  <p className="text-xs text-gray-500 mt-2">{stage.description}</p>
                </div>

                {/* Leads */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {stage.leads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead, stage.id)}
                      onClick={() => setSelectedLead(lead)}
                      onMouseEnter={() => setHoveredLead(lead.id)}
                      onMouseLeave={() => setHoveredLead(null)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 relative group"
                    >
                      {/* Ações Rápidas */}
                      {hoveredLead === lead.id && (
                        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                              setShowTaskModal(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Adicionar Tarefa"
                          >
                            <ListTodo size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                              setShowMeetingModal(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Agendar Reunião"
                          >
                            <Calendar size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLead(lead);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLead(lead.id, stage.id);
                            }}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{lead.name}</h4>
                          <p className="text-sm text-gray-500">{lead.company || lead.contact}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          R$ {(lead.value || 0).toLocaleString('pt-BR')}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.tags?.map((tag, index) => (
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
                        <span>{lead.source}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Lead Button */}
                <div className="p-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setStageToAddLead(stage.id);
                      setShowNewLeadModal(true);
                    }}
                    className="w-full py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span className="text-sm">Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                <span className="text-gray-700">{selectedLead.phone || selectedLead.contact}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-gray-400" size={18} />
                <span className="text-lg font-semibold text-gray-900">
                  R$ {(selectedLead.value || 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="text-gray-400" size={18} />
                <span className="text-gray-700">Origem: {selectedLead.source}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {selectedLead.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  setEditingLead(selectedLead);
                  setShowEditModal(true);
                }}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Nova Tarefa
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {['info', 'conversas', 'tarefas'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'info' && 'Informações'}
                  {tab === 'conversas' && 'Conversas'}
                  {tab === 'tarefas' && 'Tarefas'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4">
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
                  <label className="text-sm font-medium text-gray-700">Empresa</label>
                  <p className="text-gray-900 mt-1">{selectedLead.company || 'Não informado'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Último contato</label>
                  <p className="text-gray-900 flex items-center mt-1">
                    {getChannelIcon(selectedLead.lastChannel)}
                    <span className="ml-2">{selectedLead.lastContact}</span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Próximos passos</label>
                  <div className="mt-2 space-y-2">
                    <button 
                      onClick={() => setShowMeetingModal(true)}
                      className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>Agendar Reunião</span>
                    </button>
                    <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                      <Mail size={16} />
                      <span>Enviar Proposta</span>
                    </button>
                    <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                      <Phone size={16} />
                      <span>Ligar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conversas' && (
              <div className="space-y-4">
                {conversations.filter(c => c.leadId === selectedLead.id).length > 0 ? (
                  conversations.filter(c => c.leadId === selectedLead.id).map(conv => (
                    <div key={conv.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                          {conv.sender?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{conv.sender || 'Usuário'}</p>
                            <span className="text-xs text-gray-500">{conv.time || 'Agora'}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{conv.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>Nenhuma conversa ainda</p>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                      Iniciar conversa →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tarefas' && (
              <div className="space-y-3">
                {tasks.filter(t => t.leadId === selectedLead.id).length > 0 ? (
                  tasks.filter(t => t.leadId === selectedLead.id).map(task => (
                    <div key={task.id} className={`p-3 rounded-lg border ${getPriorityColor(task.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {
                              setTasks(tasks.map(t => 
                                t.id === task.id ? { ...t, completed: !t.completed } : t
                              ));
                            }}
                            className="mt-1"
                          />
                          <div>
                            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            {task.dueDate && (
                              <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <ListTodo className="w-12 h-12 mx-auto mb-2" />
                    <p>Nenhuma tarefa ainda</p>
                  </div>
                )}
                
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                >
                  <Plus size={16} className="inline mr-1" />
                  Adicionar Tarefa
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Novo Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {stageToAddLead ? `Adicionar em ${pipeline.find(s => s.id === stageToAddLead)?.title}` : 'Novo Lead'}
              </h2>
              <button
                onClick={() => {
                  setShowNewLeadModal(false);
                  setStageToAddLead(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="joao@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Empresa ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Indicação">Indicação</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              {!stageToAddLead && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
                  <select
                    value={newLead.stage}
                    onChange={(e) => setNewLead({ ...newLead, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {pipeline.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewLeadModal(false);
                  setStageToAddLead(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Criar Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Lead */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Editar Lead</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLead(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editingLead.phone || editingLead.contact}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    value={editingLead.value}
                    onChange={(e) => setEditingLead({ ...editingLead, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={editingLead.company || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingLead.score}
                  onChange={(e) => setEditingLead({ ...editingLead, score: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span className="font-medium text-gray-900">{editingLead.score}%</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLead(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Tarefa */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nova Tarefa</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Enviar proposta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Detalhes da tarefa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agendar Reunião */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Agendar Reunião</h2>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Demo do produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="90">1h30</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Videochamada</option>
                    <option value="phone">Telefone</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Anotações sobre a reunião..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateMeeting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPipeline;