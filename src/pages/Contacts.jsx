// frontend/src/pages/Contacts.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Download, Upload, MoreVertical,
  Phone, Mail, MessageCircle, Calendar, Tag, MapPin, Building2,
  Edit2, Trash2, X, Check, ChevronDown, Settings, FileSpreadsheet,
  PlusCircle, Save, Eye, EyeOff, Hash, Type, DollarSign, CalendarDays,
  ToggleLeft, Link2, List, RefreshCw, AlertCircle
} from 'lucide-react';
import { contactsService } from '../services/api';

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Contatos reais do banco
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Formulário de novo contato
  const [newContact, setNewContact] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    empresa: '',
    cpf_cnpj: '',
    cargo: ''
  });

  // Buscar contatos
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await contactsService.getAll({
        search: searchTerm,
        page: currentPage
      });

      setContacts(response.data.contatos || []);
      setTotalContacts(response.data.total || 0);

    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
      setError('Erro ao carregar contatos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [searchTerm, currentPage]);

  // Tags disponíveis (simplificado)
  const availableTags = ['Cliente VIP', 'Prospect', 'Lead Frio', 'Em Negociação', 'Quente', 'WhatsApp', 'Instagram'];

  // Criar novo contato
  const handleCreateContact = async () => {
    try {
      if (!newContact.nome) {
        alert('Nome é obrigatório');
        return;
      }

      await contactsService.create(newContact);
      
      setShowCreateModal(false);
      setNewContact({
        nome: '',
        email: '',
        telefone: '',
        whatsapp: '',
        empresa: '',
        cpf_cnpj: '',
        cargo: ''
      });
      
      fetchContacts(); // Recarregar lista
      
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar contato');
    }
  };

  // Importar contatos
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress({ status: 'uploading', message: 'Enviando arquivo...' });
      
      const response = await contactsService.import(formData);
      
      setUploadProgress({
        status: 'success',
        message: `Importação concluída! ${response.data.criados} criados, ${response.data.atualizados} atualizados.`,
        details: response.data
      });
      
      fetchContacts(); // Recarregar lista
      
      setTimeout(() => {
        setShowImportModal(false);
        setUploadProgress(null);
      }, 3000);
      
    } catch (err) {
      setUploadProgress({
        status: 'error',
        message: 'Erro ao importar arquivo',
        error: err.response?.data?.error
      });
    }
  };

  // Exportar contatos
  const handleExport = async () => {
    try {
      const response = await contactsService.export();
      
      // Criar link de download
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
    } catch (err) {
      alert('Erro ao exportar contatos');
    }
  };

  // Baixar template
  const handleDownloadTemplate = async () => {
    try {
      const response = await contactsService.getTemplate();
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_contatos.csv';
      link.click();
      
    } catch (err) {
      alert('Erro ao baixar template');
    }
  };

  const filteredContacts = contacts; // Já vem filtrado da API

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando contatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
              <p className="text-sm text-gray-500">
                {totalContacts > 0 
                  ? `${totalContacts} contatos encontrados`
                  : 'Nenhum contato ainda'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Novo Contato</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou empresa..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={fetchContacts}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Atualizar"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredContacts.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Contato
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <tr 
                        key={contact.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {contact.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{contact.nome}</p>
                              <p className="text-sm text-gray-500">{contact.empresa || 'Sem empresa'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags?.slice(0, 2).map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {contact.tags?.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">{contact.score}</span>
                                <span className="text-xs text-gray-500">Score</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    contact.score >= 80 ? 'bg-green-500' : 
                                    contact.score >= 60 ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${contact.score}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {contact.ultimoContato}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end space-x-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${contact.telefone}`);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                            >
                              <Phone size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${contact.email}`);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                            >
                              <Mail size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://wa.me/${contact.whatsapp?.replace(/\D/g, '')}`);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum contato encontrado</h3>
                  <p className="text-gray-500 mb-4">Comece importando uma lista ou criando manualmente</p>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Upload size={18} className="inline mr-2" />
                      Importar CSV
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={18} className="inline mr-2" />
                      Criar Contato
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Contato */}
          {selectedContact ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedContact.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedContact.nome}</h2>
                    <p className="text-gray-500">{selectedContact.empresa || 'Sem empresa'}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Informações básicas */}
              <div className="space-y-3 mb-6">
                {selectedContact.email && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-gray-700">{selectedContact.email}</span>
                  </div>
                )}
                {selectedContact.telefone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-gray-700">{selectedContact.telefone}</span>
                  </div>
                )}
                {selectedContact.whatsapp && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MessageCircle className="text-gray-400" size={16} />
                    <span className="text-gray-700">{selectedContact.whatsapp}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 text-sm rounded-full hover:border-gray-400 hover:text-gray-600 transition-colors">
                    <Plus size={14} className="inline" />
                  </button>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Informações Adicionais</h3>
                <div className="space-y-3">
                  {selectedContact.cpf_cnpj && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">CPF/CNPJ:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedContact.cpf_cnpj}</span>
                    </div>
                  )}
                  {selectedContact.cargo && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">Cargo:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedContact.cargo}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Origem:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedContact.origem || 'Manual'}</span>
                  </div>
                  {selectedContact.valorTotal > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">Valor em negócios:</span>
                      <span className="text-sm font-medium text-gray-900">
                        R$ {selectedContact.valorTotal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => window.open(`https://wa.me/${selectedContact.whatsapp?.replace(/\D/g, '')}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => window.open(`mailto:${selectedContact.email}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Selecione um contato para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Importar Contatos</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setUploadProgress(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {!uploadProgress ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Faça upload de um arquivo CSV com seus contatos. 
                    O arquivo deve conter colunas para Nome, Email, Telefone e Empresa.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Clique para selecionar
                      </span>
                      <span className="text-gray-600"> ou arraste o arquivo aqui</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Apenas arquivos CSV (máx. 10MB)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleDownloadTemplate}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Baixar modelo
                  </button>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                {uploadProgress.status === 'uploading' && (
                  <>
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-700">{uploadProgress.message}</p>
                  </>
                )}
                {uploadProgress.status === 'success' && (
                  <>
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">{uploadProgress.message}</p>
                    {uploadProgress.details?.detalhesErros?.length > 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        {uploadProgress.details.detalhesErros.length} erros encontrados
                      </p>
                    )}
                  </>
                )}
                {uploadProgress.status === 'error' && (
                  <>
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">{uploadProgress.message}</p>
                    <p className="text-sm text-red-600 mt-2">{uploadProgress.error}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Criar Contato */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Novo Contato</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={newContact.nome}
                  onChange={(e) => setNewContact({...newContact, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="joao@exemplo.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={newContact.telefone}
                    onChange={(e) => setNewContact({...newContact, telefone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newContact.whatsapp}
                    onChange={(e) => setNewContact({...newContact, whatsapp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={newContact.empresa}
                  onChange={(e) => setNewContact({...newContact, empresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da Empresa"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    value={newContact.cpf_cnpj}
                    onChange={(e) => setNewContact({...newContact, cpf_cnpj: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123.456.789-00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={newContact.cargo}
                    onChange={(e) => setNewContact({...newContact, cargo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Diretor"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;