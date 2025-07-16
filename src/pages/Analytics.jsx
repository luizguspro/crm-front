// src/pages/Analytics.jsx
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  Target, Activity, Calendar, Download, Filter, ChevronDown,
  MessageCircle, Phone, Mail, Clock, Award, Zap, ArrowUp,
  ArrowDown, MoreVertical
} from 'lucide-react';

const Analytics = () => {
  const [period, setPeriod] = useState('month'); // week, month, quarter, year

  // Dados mockados para os gráficos
  const salesData = [
    { month: 'Jan', vendas: 45000, meta: 50000 },
    { month: 'Fev', vendas: 52000, meta: 50000 },
    { month: 'Mar', vendas: 48000, meta: 55000 },
    { month: 'Abr', vendas: 61000, meta: 55000 },
    { month: 'Mai', vendas: 58000, meta: 60000 },
    { month: 'Jun', vendas: 67000, meta: 60000 },
    { month: 'Jul', vendas: 72000, meta: 65000 }
  ];

  const leadSources = [
    { source: 'Website', leads: 45, percentage: 32 },
    { source: 'WhatsApp', leads: 38, percentage: 27 },
    { source: 'Instagram', leads: 28, percentage: 20 },
    { source: 'Indicação', leads: 18, percentage: 13 },
    { source: 'Facebook', leads: 11, percentage: 8 }
  ];

  const teamPerformance = [
    { name: 'Ana Silva', deals: 12, revenue: 180000, conversion: 68 },
    { name: 'Carlos Santos', deals: 10, revenue: 145000, conversion: 62 },
    { name: 'Marina Costa', deals: 8, revenue: 98000, conversion: 55 },
    { name: 'João Oliveira', deals: 7, revenue: 87000, conversion: 48 }
  ];

  const kpis = [
    {
      title: 'Receita Total',
      value: 'R$ 385.000',
      change: '+23%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Novos Clientes',
      value: '127',
      change: '+18%',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Taxa de Conversão',
      value: '24.5%',
      change: '+5.2%',
      isPositive: true,
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 3.031',
      change: '-8%',
      isPositive: false,
      icon: Activity,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const communicationStats = [
    { channel: 'WhatsApp', messages: 1842, responseTime: '2min', avgResponseTime: '1.5min' },
    { channel: 'Instagram', messages: 923, responseTime: '15min', avgResponseTime: '12min' },
    { channel: 'Email', messages: 456, responseTime: '2h', avgResponseTime: '1.8h' },
    { channel: 'Telefone', messages: 234, responseTime: 'Imediato', avgResponseTime: 'Imediato' }
  ];

  const getBarHeight = (value, max) => {
    return (value / max * 100) + '%';
  };

  const maxSales = Math.max(...salesData.map(d => Math.max(d.vendas, d.meta)));

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
              <p className="text-sm text-gray-500">Acompanhe o desempenho do seu negócio</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download size={18} />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon size={24} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  kpi.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de Vendas */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Vendas vs Meta</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex space-x-1 items-end h-48">
                    <div className="flex-1 relative">
                      <div 
                        className="bg-blue-500 rounded-t"
                        style={{ height: getBarHeight(data.vendas, maxSales) }}
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                        {(data.vendas / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <div className="flex-1">
                      <div 
                        className="bg-gray-300 rounded-t"
                        style={{ height: getBarHeight(data.meta, maxSales) }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Vendas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Meta</span>
              </div>
            </div>
          </div>

          {/* Origem dos Leads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Origem dos Leads</h2>
            <div className="space-y-4">
              {leadSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm text-gray-900">{source.leads} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de Leads</span>
                <span className="text-lg font-bold text-gray-900">140</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance da Equipe */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Performance da Equipe</h2>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.deals} negócios fechados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {(member.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-sm text-gray-500">{member.conversion}% conversão</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas de Comunicação */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Canais de Comunicação</h2>
            <div className="grid grid-cols-2 gap-4">
              {communicationStats.map((stat, index) => {
                const icons = {
                  'WhatsApp': MessageCircle,
                  'Instagram': Zap,
                  'Email': Mail,
                  'Telefone': Phone
                };
                const Icon = icons[stat.channel];
                
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-900">{stat.channel}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.messages}</p>
                    <div className="space-y-1 mt-1">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Primeira: {stat.responseTime}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        Média: {stat.avgResponseTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900">Taxa de Resposta</p>
                  <p className="text-lg font-bold text-blue-600">96.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;