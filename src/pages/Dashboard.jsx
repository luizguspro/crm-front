// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bell, Plus, Search, Filter, Download,
  Phone, Mail, MoreVertical, Activity, Clock, Users,
  MessageCircle, Calendar, DollarSign, Target, ArrowUp,
  ArrowDown, ChevronRight, Zap, BarChart3, Presentation,
  Trophy, TrendingDown, Award, Star, ChevronUp, Eye,
  RefreshCw, AlertCircle
} from 'lucide-react';
import BadgeStatus from '../components/BadgeStatus';
import { dashboardService, initSocket } from '../services/api';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para dados reais
  const [kpis, setKpis] = useState({
    leadsQuentes: 0,
    novosLeads: 0,
    visitasAgendadas: 0,
    taxaConversao: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [channelPerformance, setChannelPerformance] = useState([]);

  // Estados animados
  const [animatedKpis, setAnimatedKpis] = useState({
    leadsQuentes: 0,
    novosLeads: 0,
    visitasAgendadas: 0,
    taxaConversao: 0
  });

  // Buscar dados da API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [kpisRes, activitiesRes, performanceRes, channelRes] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getRecentActivities(),
        dashboardService.getPerformanceData(10),
        dashboardService.getChannelPerformance()
      ]);

      setKpis(kpisRes.data);
      setRecentActivities(activitiesRes.data);
      setPerformanceData(performanceRes.data);
      setChannelPerformance(channelRes.data);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar Socket.io e buscar dados
  useEffect(() => {
    fetchDashboardData();
    
    // Inicializar WebSocket
    const socket = initSocket();
    
    // Escutar atualizações em tempo real
    socket.on('new-message', () => {
      fetchDashboardData(); // Recarregar dados quando houver nova mensagem
    });

    socket.on('deal-updated', () => {
      fetchDashboardData();
    });

    return () => {
      socket.off('new-message');
      socket.off('deal-updated');
    };
  }, []);

  // Animação dos números dos KPIs
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;

    const animateValue = (start, end, setter) => {
      let current = start;
      const increment = (end - start) / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setter(Math.floor(current));
      }, interval);
      
      return timer;
    };

    const timers = [
      animateValue(0, kpis.leadsQuentes, (val) => 
        setAnimatedKpis(prev => ({ ...prev, leadsQuentes: val }))),
      animateValue(0, kpis.novosLeads, (val) => 
        setAnimatedKpis(prev => ({ ...prev, novosLeads: val }))),
      animateValue(0, kpis.visitasAgendadas, (val) => 
        setAnimatedKpis(prev => ({ ...prev, visitasAgendadas: val }))),
      animateValue(0, kpis.taxaConversao, (val) => 
        setAnimatedKpis(prev => ({ ...prev, taxaConversao: val })))
    ];

    return () => timers.forEach(timer => clearInterval(timer));
  }, [kpis]);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    return messageDate.toLocaleDateString('pt-BR');
  };

  // KPIs para modo individual
  const kpiDataIndividual = [
    {
      title: 'Leads Quentes',
      value: animatedKpis.leadsQuentes,
      icon: '🔥',
      trend: '+12%',
      trendUp: true,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'vs. semana passada'
    },
    {
      title: 'Novos Leads',
      value: animatedKpis.novosLeads,
      icon: '✨',
      trend: '+8%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'últimos 7 dias'
    },
    {
      title: 'Visitas Agendadas',
      value: animatedKpis.visitasAgendadas,
      icon: '📅',
      trend: '-3%',
      trendUp: false,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'agendamentos ativos'
    },
    {
      title: 'Taxa de Conversão',
      value: `${animatedKpis.taxaConversao}%`,
      icon: '🎯',
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'vs. mês passado'
    }
  ];

  // Função para obter ícone da atividade
  const getActivityIcon = (type) => {
    switch(type) {
      case 'message': return MessageCircle;
      case 'new_deal': return Users;
      case 'deal_won': return DollarSign;
      case 'task': return Calendar;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'message': return 'text-blue-600 bg-blue-100';
      case 'new_deal': return 'text-green-600 bg-green-100';
      case 'deal_won': return 'text-orange-600 bg-orange-100';
      case 'task': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Erro ao carregar dados</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto ${isPresentationMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isPresentationMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-30 animate-slide-down`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isPresentationMode ? 'text-white' : 'text-gray-900'}`}>
                {isPresentationMode ? 'Performance da Equipe de Vendas' : `${getGreeting()}, Ana!`}
              </h1>
              <p className={`text-sm capitalize ${isPresentationMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isPresentationMode ? `Resultados de ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}` : currentDate}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw size={20} />
              </button>
              {!isPresentationMode && (
                <>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors group">
                    <Bell size={20} className="group-hover:animate-bell" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Novo Lead</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className={`px-4 py-2 ${isPresentationMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-all flex items-center space-x-2`}
              >
                {isPresentationMode ? <Eye size={18} /> : <Presentation size={18} />}
                <span className="hidden sm:inline">{isPresentationMode ? 'Modo Normal' : 'Modo Apresentação'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* KPIs com animação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiDataIndividual.map((kpi, index) => (
            <div 
              key={index} 
              className={`${isPresentationMode ? 'bg-gray-800 border-gray-700' : `${kpi.bgColor} border-gray-100`} rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`${isPresentationMode ? 'bg-gray-700' : kpi.iconBg} p-2 rounded-lg transform transition-transform hover:scale-110`}>
                  <span className="text-xl">{kpi.icon}</span>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.trendUp ? 'text-green-500' : 'text-red-500'
                }`}>
                  {kpi.trendUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="font-medium">{kpi.trend}</span>
                </div>
              </div>
              <h3 className={`text-sm font-medium mb-1 ${isPresentationMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.title}</h3>
              <p className={`text-2xl font-bold mb-1 ${isPresentationMode ? 'text-white' : kpi.textColor}`}>{kpi.value}</p>
              <p className={`text-xs ${isPresentationMode ? 'text-gray-500' : 'text-gray-500'}`}>{kpi.description}</p>
            </div>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico de Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Performance de Conversas</h2>
                <p className="text-sm text-gray-500">Últimos 10 dias</p>
              </div>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hoje</option>
                <option value="week">Semana</option>
                <option value="month">Mês</option>
              </select>
            </div>
            
            {/* Mini gráfico de barras */}
            <div className="flex items-end justify-between h-32 mb-4">
              {performanceData.length > 0 ? (
                performanceData.map((data, index) => {
                  const maxValue = Math.max(...performanceData.map(d => d.conversas || 0));
                  const height = maxValue > 0 ? (data.conversas / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 mx-1 relative group">
                      <div 
                        className="bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                        style={{ 
                          height: `${height}%`,
                          minHeight: '2px',
                          animation: `grow-bar 0.5s ease-out ${index * 50}ms both`
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.conversas}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {new Date(data.data).getDate()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mb-2" />
                  <p className="text-sm">Nenhuma conversa ainda</p>
                  <p className="text-xs">Os dados aparecerão aqui quando houver mensagens</p>
                </div>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Atividades Recentes</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer animate-slide-left"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Nenhuma atividade ainda</p>
                  <p className="text-xs mt-1">Conecte o WhatsApp para começar</p>
                </div>
              )}
            </div>
            {recentActivities.length > 0 && (
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todas atividades
              </button>
            )}
          </div>
        </div>

        {/* Performance por Canal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Leads por Canal</h2>
            <div className="space-y-3">
              {channelPerformance.length > 0 ? (
                channelPerformance.map((channel, index) => (
                  <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{channel.channel}</span>
                      <span className="text-sm text-gray-900">{channel.leads} leads</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${channel.percentage}%`,
                          animation: `grow-width 1s ease-out ${index * 200}ms both`
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Nenhum lead ainda</p>
                  <p className="text-xs mt-1">Receba mensagens para ver estatísticas</p>
                </div>
              )}
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Status do Sistema</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </div>
                <span className="text-sm font-bold text-green-600">Conectado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Bot IA</span>
                </div>
                <span className="text-sm font-bold text-blue-600">Ativo</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                Última sincronização: {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;