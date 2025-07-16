// src/components/Sidebar.jsx
import React from 'react';
import { 
  Home, Users, Settings, LogOut, 
  Zap, ChevronRight, GitBranch, MessageSquare,
  BarChart3, Calendar, QrCode
} from 'lucide-react';

const Sidebar = ({ user, activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, text: 'Dashboard' },
    { id: 'pipeline', icon: GitBranch, text: 'Pipeline' },
    { id: 'leads', icon: Users, text: 'Contatos' },
    { id: 'messages', icon: MessageSquare, text: 'Mensagens' },
    { id: 'qrcode', icon: QrCode, text: 'Conectar WhatsApp' },
    { id: 'calendar', icon: Calendar, text: 'Calendário' },
    { id: 'analytics', icon: BarChart3, text: 'Relatórios' },
    { id: 'settings', icon: Settings, text: 'Configurações' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Vico CRM</h1>
            <p className="text-xs text-gray-500">Vendas conversacionais</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  activeMenu === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.text}</span>
                {activeMenu === item.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Company & Profile */}
      <div className="border-t border-gray-200 p-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="mb-3">
            <p className="text-xs text-gray-500">Empresa</p>
            <p className="font-medium text-gray-900">{user.company || 'Minha Empresa'}</p>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 py-2 border-t border-gray-200 pt-3 transition-colors">
            <LogOut size={16} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;