// frontend/src/pages/Campaigns.jsx
import React from 'react';
import { BarChart3, Plus } from 'lucide-react';

const Campaigns = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
        <p className="text-gray-600">Gerencie suas campanhas de marketing</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Campanhas em Desenvolvimento
          </h3>
          <p className="text-gray-500 mb-6">
            Este módulo estará disponível em breve
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;