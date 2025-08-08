// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bell, Plus, Search, Filter, Download,
  Phone, Mail, MoreVertical, Activity, Clock, Users,
  MessageCircle, Calendar, DollarSign, Target, ArrowUp,
  ArrowDown, ChevronRight, Zap, BarChart3, Presentation,
  Trophy, TrendingDown, Award, Star, ChevronUp, Eye,
  RefreshCw, AlertCircle, Sparkles, BrainCircuit,
  MousePointerClick, UserCheck, ShoppingCart, Rocket,
  AlertTriangle, CheckCircle2, XCircle, ArrowUpRight,
  ArrowDownRight, Briefcase, PieChart, Globe, Smartphone
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import apiMock from '../services/apiMock';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const { isDemoMode, mockDataService } = useDemo();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
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

  // Dados adicionais para o dashboard premium
  const [metrics, setMetrics] = useState({
    revenue: 385000,
    revenueGrowth: 23,
    customers: 127,
    customersGrowth: 18,
    avgTicket: 3031,
    avgTicketGrowth: -8,
    churnRate: 2.5,
    churnGrowth: -15,
    nps: 72,
    npsGrowth: 5,
    ltv: 45000,
    ltvGrowth: 12
  });

  // Buscar dados da API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isDemoMode) {
        const [kpisRes, activitiesRes, performanceRes, channelRes] = await Promise.all([
          apiMock.getKPIs(),
          apiMock.getRecentActivities(),
          apiMock.getPerformanceData(),
          apiMock.getChannelPerformance()
        ]);

        setKpis(kpisRes.data || {});
        setRecentActivities(activitiesRes.data || []);
        setPerformanceData(performanceRes.data || []);
        setChannelPerformance(channelRes.data || []);
      } else {
        try {
          const [kpisRes, activitiesRes, performanceRes, channelRes] = await Promise.all([
            dashboardService.getKPIs(),
            dashboardService.getRecentActivities(),
            dashboardService.getPerformanceData(10),
            dashboardService.getChannelPerformance()
          ]);

          setKpis(kpisRes.data || {});
          setRecentActivities(activitiesRes.data || []);
          setPerformanceData(performanceRes.data || []);
          setChannelPerformance(channelRes.data || []);
        } catch (err) {
          // Usar dados vazios se falhar
          setKpis({ leadsQuentes: 0, novosLeads: 0, visitasAgendadas: 0, taxaConversao: 0 });
          setRecentActivities([]);
          setPerformanceData([]);
          setChannelPerformance([]);
        }
      }

      // Simular métricas adicionais
      if (isDemoMode) {
        setMetrics(prev => ({
          ...prev,
          revenue: prev.revenue + Math.floor(Math.random() * 5000),
          customers: prev.customers + Math.floor(Math.random() * 3),
          avgTicket: prev.avgTicket + Math.floor(Math.random() * 100) - 50
        }));
      }

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isDemoMode]);

  // Atualizar em tempo real no modo demo
  useEffect(() => {
    if (isDemoMode && mockDataService) {
      const handleUpdate = () => {
        fetchDashboardData();
      };

      mockDataService.on('kpis-updated', handleUpdate);
      mockDataService.on('new-activity', handleUpdate);

      const interval = setInterval(() => {
        fetchDashboardData();
      }, 5000);

      return () => {
        mockDataService.off('kpis-updated', handleUpdate);
        mockDataService.off('new-activity', handleUpdate);
        clearInterval(interval);
      };
    }
  }, [isDemoMode]);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Função para cores do gráfico baseado no valor
  const getBarColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'from-emerald-500 to-emerald-600';
    if (percentage >= 60) return 'from-blue-500 to-blue-600';
    if (percentage >= 40) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  // Obter ícone da atividade
  const getActivityIcon = (type) => {
    switch(type) {
      case 'message':
      case 'new_lead':
        return { icon: UserCheck, color: 'text-emerald-600 bg-emerald-100' };
      case 'deal_won':
        return { icon: Trophy, color: 'text-amber-600 bg-amber-100' };
      case 'deal_moved':
        return { icon: TrendingUp, color: 'text-blue-600 bg-blue-100' };
      case 'task':
        return { icon: CheckCircle2, color: 'text-purple-600 bg-purple-100' };
      default:
        return { icon: Activity, color: 'text-gray-600 bg-gray-100' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Premium */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {getGreeting()}, ZapVibe! 
              </h1>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Activity className="w-3 h-3 mr-1" />
                Sistema operando perfeitamente
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                <Rocket className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Performance</span>
                <span className="text-sm font-bold text-emerald-600">+23%</span>
              </div>
              
              <button 
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                title="Atualizar dados"
              >
                <RefreshCw size={20} />
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <button
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 shadow-md"
              >
                {isPresentationMode ? <Eye size={18} /> : <Presentation size={18} />}
                <span className="hidden sm:inline">
                  {isPresentationMode ? 'Modo Normal' : 'Apresentação'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Métricas Principais - Design Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Receita Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metrics.revenueGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metrics.revenueGrowth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{Math.abs(metrics.revenueGrowth)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Receita Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.revenue)}
            </p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Meta: {formatCurrency(500000)}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(metrics.revenue / 500000) * 100}%` }}
              />
            </div>
          </div>

          {/* Novos Clientes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metrics.customersGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metrics.customersGrowth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{Math.abs(metrics.customersGrowth)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Novos Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.customers}</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <UserCheck className="w-3 h-3 mr-1" />
              <span>Qualificados: {animatedKpis.leadsQuentes}</span>
            </div>
            <div className="mt-2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`h-8 flex-1 rounded ${
                    i < Math.floor((metrics.customers / 150) * 5) 
                      ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center text-sm font-medium text-emerald-600">
                <ArrowUpRight size={16} />
                <span>5.2%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-gray-900">{animatedKpis.taxaConversao}%</p>
            <div className="mt-3">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Performance</span>
                  <span className="text-xs font-medium text-purple-600">Excelente</span>
                </div>
                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100">
                    <div 
                      style={{ width: `${animatedKpis.taxaConversao}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metrics.avgTicketGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metrics.avgTicketGrowth > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{Math.abs(metrics.avgTicketGrowth)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Ticket Médio</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.avgTicket)}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1">
              <div className="text-center">
                <p className="text-xs text-gray-500">Min</p>
                <p className="text-xs font-medium">R$ 1.5k</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Médio</p>
                <p className="text-xs font-medium">R$ 3k</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Max</p>
                <p className="text-xs font-medium">R$ 15k</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Analytics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico Principal - Performance de Vendas */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Performance de Vendas</h2>
                <p className="text-sm text-gray-500">Últimos 10 dias</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    selectedMetric === 'revenue' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Receita
                </button>
                <button
                  onClick={() => setSelectedMetric('deals')}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    selectedMetric === 'deals' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Negócios
                </button>
                <button
                  onClick={() => setSelectedMetric('leads')}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    selectedMetric === 'leads' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Leads
                </button>
              </div>
            </div>
            
            {/* Gráfico de Barras Estilizado */}
            <div className="relative">
              <div className="flex items-end justify-between h-48 mb-4">
                {performanceData.length > 0 ? (
                  performanceData.map((data, index) => {
                    const maxValue = Math.max(...performanceData.map(d => d.conversas || 0));
                    const height = maxValue > 0 ? (data.conversas / maxValue) * 100 : 0;
                    
                    return (
                      <div key={`bar-${index}`} className="flex-1 mx-1 relative group">
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.conversas} conversas
                        </div>
                        
                        {/* Barra */}
                        <div className="relative h-full flex items-end">
                          <div 
                            className={`w-full bg-gradient-to-t ${getBarColor(data.conversas, maxValue)} rounded-t-lg hover:opacity-90 transition-all cursor-pointer`}
                            style={{ 
                              height: `${height}%`,
                              minHeight: '4px',
                              animation: `grow-bar 0.5s ease-out ${index * 50}ms both`
                            }}
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="text-xs text-gray-500 text-center mt-2">
                          {new Date(data.data).getDate()}/{new Date(data.data).getMonth() + 1}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <BarChart3 className="w-12 h-12 mb-2" />
                    <p className="text-sm">Dados sendo carregados...</p>
                  </div>
                )}
              </div>

              {/* Legenda */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                  <span className="text-xs text-gray-600">Excelente (80%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span className="text-xs text-gray-600">Bom (60-79%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-amber-600"></div>
                  <span className="text-xs text-gray-600">Regular (40-59%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Atividades Recentes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Atividade em Tempo Real</h2>
              <div className="relative">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 8).map((activity, index) => {
                  const { icon: Icon, color } = getActivityIcon(activity.type);
                  
                  return (
                    <div 
                      key={`activity-${activity.id || index}`}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title || activity.text}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.contactName || activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {activity.time || 'agora'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Nenhuma atividade recente</p>
                </div>
              )}
            </div>
            
            {recentActivities.length > 8 && (
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todas as atividades →
              </button>
            )}
          </div>
        </div>

        {/* Performance por Canal e Métricas Adicionais */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance por Canal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Canais de Aquisição</h2>
            
            <div className="space-y-4">
              {channelPerformance.length > 0 ? (
                channelPerformance.map((channel, index) => {
                  const icons = {
                    'WhatsApp': { icon: MessageCircle, color: 'text-green-600 bg-green-100' },
                    'Instagram': { icon: Smartphone, color: 'text-pink-600 bg-pink-100' },
                    'Email': { icon: Mail, color: 'text-blue-600 bg-blue-100' },
                    'Website': { icon: Globe, color: 'text-purple-600 bg-purple-100' }
                  };
                  
                  const channelConfig = icons[channel.channel] || icons['Website'];
                  const Icon = channelConfig.icon;
                  
                  return (
                    <div key={`channel-${index}`} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${channelConfig.color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{channel.channel}</p>
                            <p className="text-xs text-gray-500">{channel.contacts} contatos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{channel.percentage}%</p>
                          <p className="text-xs text-emerald-600">
                            {channel.conversions} conversões
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                          style={{ width: `${channel.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <PieChart className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Carregando dados...</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Médio</span>
                <span className="text-lg font-bold text-emerald-600">342%</span>
              </div>
            </div>
          </div>

          {/* Métricas de Engajamento */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Engajamento</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <MousePointerClick className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Taxa de Cliques</p>
                    <p className="text-xs text-gray-500">CTR médio</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">4.2%</p>
                  <p className="text-xs text-emerald-600">+0.8%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tempo de Resposta</p>
                    <p className="text-xs text-gray-500">Média</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">2min</p>
                  <p className="text-xs text-emerald-600">-30s</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">NPS Score</p>
                    <p className="text-xs text-gray-500">Satisfação</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{metrics.nps}</p>
                  <p className="text-xs text-emerald-600">+{metrics.npsGrowth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Metas e Objetivos */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Metas do Mês</h2>
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Receita</span>
                  <span className="text-sm font-bold">77%</span>
                </div>
                <div className="w-full bg-blue-800/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full" style={{ width: '77%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Novos Clientes</span>
                  <span className="text-sm font-bold">85%</span>
                </div>
                <div className="w-full bg-blue-800/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-300 to-emerald-400 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Conversão</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="w-full bg-blue-800/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-300 to-purple-400 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100">Dias restantes</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-100">Projeção</p>
                  <p className="text-lg font-bold text-yellow-300">112%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;