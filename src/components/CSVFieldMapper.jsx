import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Download, Upload, MoreVertical,
  Phone, Mail, MessageCircle, Calendar, Tag, MapPin, Building2,
  Edit2, Trash2, X, Check, ChevronDown, Settings, FileSpreadsheet,
  PlusCircle, Save, Eye, EyeOff, Hash, Type, DollarSign, CalendarDays,
  ToggleLeft, Link2, List, RefreshCw, AlertCircle, ChevronRight,
  HelpCircle, ToggleRight, User, FileText, Sparkles
} from 'lucide-react';
import { contactsService } from '../services/api';

// Componente de Mapeamento de CSV
const CSVFieldMapper = ({ file, onClose, onImport }) => {
  const [step, setStep] = useState(2); // Pular direto para mapeamento já que temos o arquivo
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvPreview, setCsvPreview] = useState([]);
  const [mappings, setMappings] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);

  // Campos padrão do sistema
  const systemFields = [
    { id: 'nome', label: 'Nome', icon: User, required: true, type: 'text' },
    { id: 'email', label: 'Email', icon: Mail, required: false, type: 'email' },
    { id: 'telefone', label: 'Telefone', icon: Phone, required: false, type: 'phone' },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, required: false, type: 'phone' },
    { id: 'empresa', label: 'Empresa', icon: Building2, required: false, type: 'text' },
    { id: 'cargo', label: 'Cargo', icon: User, required: false, type: 'text' },
    { id: 'cpf_cnpj', label: 'CPF/CNPJ', icon: Hash, required: false, type: 'document' },
    { id: 'endereco', label: 'Endereço', icon: MapPin, required: false, type: 'text' },
    { id: 'cidade', label: 'Cidade', icon: MapPin, required: false, type: 'text' },
    { id: 'estado', label: 'Estado', icon: MapPin, required: false, type: 'text' },
    { id: 'cep', label: 'CEP', icon: MapPin, required: false, type: 'cep' },
    { id: 'data_nascimento', label: 'Data Nascimento', icon: Calendar, required: false, type: 'date' },
    { id: 'origem', label: 'Origem', icon: Tag, required: false, type: 'text' },
    { id: 'observacoes', label: 'Observações', icon: FileText, required: false, type: 'textarea' }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Texto', icon: Type },
    { value: 'number', label: 'Número', icon: Hash },
    { value: 'date', label: 'Data', icon: Calendar },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Telefone', icon: Phone },
    { value: 'url', label: 'URL', icon: Link2 },
    { value: 'currency', label: 'Moeda', icon: DollarSign },
    { value: 'boolean', label: 'Sim/Não', icon: ToggleRight },
    { value: 'select', label: 'Lista', icon: Tag }
  ];

  useEffect(() => {
    const savedFields = localStorage.getItem('customContactFields');
    if (savedFields) {
      setCustomFields(JSON.parse(savedFields));
    }
    
    // Processar arquivo quando componente montar
    if (file) {
      processFile(file);
    }
  }, [file]);

  const processFile = (uploadedFile) => {
    setErrors([]);

    // Ler arquivo e extrair headers
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(['Arquivo CSV vazio ou sem dados']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      setCsvHeaders(headers);

      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });
      setCsvPreview(preview);

      const autoMappings = {};
      headers.forEach(header => {
        const headerLower = header.toLowerCase();
        
        if (headerLower.includes('nome') || headerLower === 'name') {
          autoMappings[header] = 'nome';
        } else if (headerLower.includes('email') || headerLower.includes('e-mail')) {
          autoMappings[header] = 'email';
        } else if (headerLower.includes('telefone') || headerLower.includes('phone') || headerLower === 'tel') {
          autoMappings[header] = 'telefone';
        } else if (headerLower.includes('whatsapp') || headerLower.includes('whats')) {
          autoMappings[header] = 'whatsapp';
        } else if (headerLower.includes('empresa') || headerLower.includes('company')) {
          autoMappings[header] = 'empresa';
        } else if (headerLower.includes('cargo') || headerLower.includes('position')) {
          autoMappings[header] = 'cargo';
        }
      });

      setMappings(autoMappings);
    };

    reader.readAsText(uploadedFile, 'UTF-8');
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      setErrors(['Por favor, selecione um arquivo CSV']);
      return;
    }

    setFile(uploadedFile);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(['Arquivo CSV vazio ou sem dados']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      setCsvHeaders(headers);

      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });
      setCsvPreview(preview);

      const autoMappings = {};
      headers.forEach(header => {
        const headerLower = header.toLowerCase();
        
        if (headerLower.includes('nome') || headerLower === 'name') {
          autoMappings[header] = 'nome';
        } else if (headerLower.includes('email') || headerLower.includes('e-mail')) {
          autoMappings[header] = 'email';
        } else if (headerLower.includes('telefone') || headerLower.includes('phone') || headerLower === 'tel') {
          autoMappings[header] = 'telefone';
        } else if (headerLower.includes('whatsapp') || headerLower.includes('whats')) {
          autoMappings[header] = 'whatsapp';
        } else if (headerLower.includes('empresa') || headerLower.includes('company')) {
          autoMappings[header] = 'empresa';
        } else if (headerLower.includes('cargo') || headerLower.includes('position')) {
          autoMappings[header] = 'cargo';
        }
      });

      setMappings(autoMappings);
      setStep(2);
    };

    reader.readAsText(uploadedFile, 'UTF-8');
  };

  const addCustomField = () => {
    const newField = {
      id: `custom_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (id, updates) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeCustomField = (id) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const saveCustomFields = () => {
    localStorage.setItem('customContactFields', JSON.stringify(customFields));
  };

  const processImport = async () => {
    setIsProcessing(true);
    setErrors([]);

    try {
      const requiredFields = systemFields.filter(f => f.required);
      const missingRequired = requiredFields.filter(field => 
        !Object.values(mappings).includes(field.id)
      );

      if (missingRequired.length > 0) {
        setErrors([`Campos obrigatórios não mapeados: ${missingRequired.map(f => f.label).join(', ')}`]);
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('mappings', JSON.stringify(mappings));
      formData.append('customFields', JSON.stringify(customFields));

      await onImport(formData);
      
    } catch (error) {
      setErrors([error.message || 'Erro ao importar arquivo']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Importar Contatos</h2>
              <p className="text-blue-100 mt-1">
                {step === 1 && 'Selecione o arquivo CSV'}
                {step === 2 && 'Mapeie os campos do CSV'}
                {step === 3 && 'Revise e confirme a importação'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center mt-6 space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                  ${step >= s ? 'bg-white text-blue-600' : 'bg-blue-500 text-blue-200'}`}>
                  {step > s ? <Check size={18} /> : s}
                </div>
                {s < 3 && (
                  <ChevronRight className={`mx-2 ${step > s ? 'text-white' : 'text-blue-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-red-900">Erro na importação</h4>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-700 mt-1">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-gray-600">Processando arquivo...</p>
            </div>
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mapeamento de Campos</h3>
                <div className="space-y-3">
                  {csvHeaders.map((header) => (
                    <div key={header} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-700">{header}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <select
                        value={mappings[header] || ''}
                        onChange={(e) => setMappings({ ...mappings, [header]: e.target.value })}
                        className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Não importar</option>
                        <optgroup label="Campos do Sistema">
                          {systemFields.map(field => (
                            <option key={field.id} value={field.id}>
                              {field.label} {field.required && '*'}
                            </option>
                          ))}
                        </optgroup>
                        {customFields.length > 0 && (
                          <optgroup label="Campos Personalizados">
                            {customFields.filter(f => f.label).map(field => (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>

                      {csvPreview.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Exemplo:</span> {csvPreview[0][header] || '(vazio)'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Campos Personalizados</h3>
                  <button
                    onClick={addCustomField}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Campo
                  </button>
                </div>

                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                          placeholder="Nome do campo"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={field.type}
                            onChange={(e) => updateCustomField(field.id, { type: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          >
                            {fieldTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeCustomField(field.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {customFields.length > 0 && (
                    <button
                      onClick={saveCustomFields}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Salvar Campos
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Revisão da Importação</h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-blue-900 mb-3">Resumo</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-blue-700">Arquivo:</dt>
                    <dd className="text-sm font-medium text-blue-900">{file?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-blue-700">Campos mapeados:</dt>
                    <dd className="text-sm font-medium text-blue-900">
                      {Object.values(mappings).filter(v => v).length}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.values(mappings).filter(v => v).map((field) => {
                        const fieldData = [...systemFields, ...customFields].find(f => f.id === field);
                        return (
                          <th key={field} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {fieldData?.label || field}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvPreview.map((row, index) => (
                      <tr key={index}>
                        {Object.entries(mappings).filter(([_, v]) => v).map(([csvField]) => (
                          <td key={csvField} className="px-4 py-3 text-sm text-gray-900">
                            {row[csvField] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </button>

            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                disabled={!Object.values(mappings).some(v => v)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Continuar
              </button>
            )}

            {step === 3 && (
              <button
                onClick={processImport}
                disabled={isProcessing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Contatos
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal de Contatos
const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFieldMapper, setShowFieldMapper] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [newContact, setNewContact] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    empresa: '',
    cpf_cnpj: '',
    cargo: ''
  });

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

  const availableTags = ['Cliente VIP', 'Prospect', 'Lead Frio', 'Em Negociação', 'Quente'];

  const handleCreateContact = async () => {
    try {
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
      fetchContacts();
    } catch (err) {
      alert('Erro ao criar contato: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return;
    
    try {
      await contactsService.delete(id);
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      fetchContacts();
    } catch (err) {
      alert('Erro ao excluir contato');
    }
  };

  const handleImportWithMapping = async (formData) => {
    try {
      setUploadProgress({
        status: 'uploading',
        message: 'Processando arquivo...'
      });

      const response = await contactsService.importWithMapping(formData);
      
      setUploadProgress({
        status: 'success',
        message: `Importação concluída! ${response.data.criados} criados, ${response.data.atualizados} atualizados.`,
        details: response.data
      });
      
      fetchContacts();
      
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

  const handleExport = async () => {
    try {
      const response = await contactsService.export();
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
    } catch (err) {
      alert('Erro ao exportar contatos');
    }
  };

  const filteredContacts = contacts;

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
              <p className="text-sm text-gray-500">
                {totalContacts > 0 
                  ? `${totalContacts} contatos cadastrados`
                  : 'Nenhum contato cadastrado'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Download size={18} className="mr-2" />
                Exportar
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Upload size={18} className="mr-2" />
                Importar
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Novo Contato
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Todos os contatos</option>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Leads quentes</option>
                <option>Clientes ativos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {filteredContacts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr 
                          key={contact.id} 
                          onClick={() => setSelectedContact(contact)}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{contact.nome}</div>
                              {contact.empresa && (
                                <div className="text-sm text-gray-500">{contact.empresa}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{contact.email || '-'}</div>
                            <div className="text-sm text-gray-500">{contact.whatsapp || contact.telefone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags?.slice(0, 2).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {contact.tags?.length > 2 && (
                                <span className="text-xs text-gray-500">+{contact.tags.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{contact.score || 0}</div>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(contact.score || 0, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${contact.email}`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Mail size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://wa.me/${contact.whatsapp?.replace(/\D/g, '')}`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <MessageCircle size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteContact(contact.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

          {selectedContact ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Detalhes do Contato</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedContact.nome}</h3>
                  {selectedContact.cargo && (
                    <p className="text-sm text-gray-500">{selectedContact.cargo}</p>
                  )}
                  {selectedContact.empresa && (
                    <p className="text-sm text-gray-500">{selectedContact.empresa}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedContact.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                  )}

                  {selectedContact.telefone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Telefone:</span>
                      <span className="text-gray-900">{selectedContact.telefone}</span>
                    </div>
                  )}

                  {selectedContact.whatsapp && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">WhatsApp:</span>
                      <a 
                        href={`https://wa.me/${selectedContact.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {selectedContact.whatsapp}
                      </a>
                    </div>
                  )}

                  {selectedContact.cpf_cnpj && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">CPF/CNPJ:</span>
                      <span className="text-gray-900">{selectedContact.cpf_cnpj}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Cadastrado:</span>
                    <span className="text-gray-900">
                      {new Date(selectedContact.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {selectedContact.ultimoContato && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Último contato:</span>
                      <span className="text-gray-900">{selectedContact.ultimoContato}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button 
                    onClick={() => window.open(`https://wa.me/${selectedContact.whatsapp?.replace(/\D/g, '')}`)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => window.open(`mailto:${selectedContact.email}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
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

      {/* Modal de Importação com Field Mapper */}
      {showImportModal && (
        <CSVFieldMapper 
          onClose={() => setShowImportModal(false)}
          onImport={handleImportWithMapping}
        />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={newContact.nome}
                  onChange={(e) => setNewContact({...newContact, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={newContact.telefone}
                    onChange={(e) => setNewContact({...newContact, telefone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newContact.whatsapp}
                    onChange={(e) => setNewContact({...newContact, whatsapp: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={newContact.empresa}
                  onChange={(e) => setNewContact({...newContact, empresa: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={newContact.cargo}
                    onChange={(e) => setNewContact({...newContact, cargo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cargo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input
                    type="text"
                    value={newContact.cpf_cnpj}
                    onChange={(e) => setNewContact({...newContact, cpf_cnpj: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateContact}
                disabled={!newContact.nome}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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