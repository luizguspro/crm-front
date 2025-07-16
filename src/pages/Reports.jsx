// frontend/src/pages/Reports.jsx
import React from 'react';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análises e relatórios do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Relatório de Vendas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Mensal</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Relatório de Vendas
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Análise completa do desempenho de vendas
          </p>
          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>

        {/* Relatório de Conversas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Semanal</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Relatório de Conversas
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Métricas de atendimento e conversões
          </p>
          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>

        {/* Relatório de Pipeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Diário</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Relatório de Pipeline
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Evolução dos negócios no funil
          </p>
          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Em Desenvolvimento */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h4 className="font-semibold text-blue-900">Novos relatórios em breve</h4>
            <p className="text-blue-700 text-sm">
              Estamos desenvolvendo novos tipos de relatórios personalizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;