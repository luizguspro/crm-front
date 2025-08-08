// src/services/apiMock.js
import mockDataService from './mockDataService';

// Wrapper para API que verifica modo demo
class ApiMockWrapper {
  constructor() {
    this.isDemoMode = () => localStorage.getItem('demoMode') === 'true';
  }

  // Dashboard Service
  async getKPIs() {
    if (this.isDemoMode()) {
      return { data: mockDataService.getKPIs() };
    }
    // Fallback para dados estáticos se não houver backend
    return { 
      data: {
        leadsQuentes: 0,
        novosLeads: 0,
        visitasAgendadas: 0,
        taxaConversao: 0
      }
    };
  }

  async getRecentActivities() {
    if (this.isDemoMode()) {
      return { data: mockDataService.getActivities() };
    }
    return { data: [] };
  }

  async getPerformanceData() {
    if (this.isDemoMode()) {
      return { data: mockDataService.getPerformanceData() };
    }
    return { data: [] };
  }

  async getChannelPerformance() {
    if (this.isDemoMode()) {
      return { data: mockDataService.getChannelPerformance() };
    }
    return { data: [] };
  }

  // Conversations Service
  async getConversations(params = {}) {
    if (this.isDemoMode()) {
      let conversations = mockDataService.getConversations();
      
      // Aplicar filtros
      if (params.search) {
        conversations = conversations.filter(c => 
          c.contato.nome.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      if (params.status === 'unread') {
        conversations = conversations.filter(c => c.nao_lidas > 0);
      }
      
      return { data: conversations };
    }
    return { data: [] };
  }

  async getConversationById(id) {
    if (this.isDemoMode()) {
      const conversation = mockDataService.getConversations().find(c => c.id === id);
      const mensagens = mockDataService.getMessages(id);
      return { 
        data: {
          ...conversation,
          mensagens
        }
      };
    }
    return { data: null };
  }

  async sendMessage(conversationId, data) {
    if (this.isDemoMode()) {
      // Simular envio de mensagem
      const newMessage = {
        id: Date.now().toString(),
        conteudo: data.conteudo,
        remetente_tipo: 'atendente',
        lida: false,
        criado_em: new Date()
      };
      
      const messages = mockDataService.getMessages(conversationId);
      messages.push(newMessage);
      
      // Simular resposta automática após 2 segundos
      setTimeout(() => {
        const autoReply = {
          id: (Date.now() + 1).toString(),
          conteudo: 'Obrigado pela mensagem! Vou analisar e retorno em breve.',
          remetente_tipo: 'cliente',
          lida: false,
          criado_em: new Date()
        };
        messages.push(autoReply);
        mockDataService.notify('new-message', { conversationId, message: autoReply });
      }, 2000);
      
      return { data: newMessage };
    }
    return { data: null };
  }

  // Pipeline Service
  async getPipelineDeals() {
    if (this.isDemoMode()) {
      return { data: mockDataService.getDeals() };
    }
    return { data: [] };
  }

  async moveDeal(dealId, stageId) {
    if (this.isDemoMode()) {
      const deals = mockDataService.getDeals();
      
      // Encontrar e mover o deal
      deals.forEach(stage => {
        const dealIndex = stage.leads.findIndex(d => d.id === dealId);
        if (dealIndex > -1) {
          const deal = stage.leads.splice(dealIndex, 1)[0];
          const targetStage = deals.find(s => s.id === stageId);
          if (targetStage) {
            deal.stage = stageId;
            targetStage.leads.push(deal);
          }
        }
      });
      
      return { data: { success: true } };
    }
    return { data: null };
  }

  // Contacts Service
  async getContacts(params = {}) {
    if (this.isDemoMode()) {
      let contacts = mockDataService.getContacts();
      
      // Aplicar busca
      if (params.search) {
        contacts = contacts.filter(c => 
          c.nome.toLowerCase().includes(params.search.toLowerCase()) ||
          c.email?.toLowerCase().includes(params.search.toLowerCase()) ||
          c.empresa?.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      // Paginação simulada
      const page = params.page || 1;
      const limit = 20;
      const start = (page - 1) * limit;
      const paginatedContacts = contacts.slice(start, start + limit);
      
      return { 
        data: {
          contatos: paginatedContacts,
          total: contacts.length
        }
      };
    }
    return { data: { contatos: [], total: 0 } };
  }

  async createContact(data) {
    if (this.isDemoMode()) {
      const newContact = {
        id: Date.now().toString(),
        ...data,
        score: 50,
        tags: ['Novo'],
        criado_em: new Date(),
        ultimoContato: 'Agora'
      };
      
      const contacts = mockDataService.getContacts();
      contacts.unshift(newContact);
      
      return { data: newContact };
    }
    return { data: null };
  }

  async deleteContact(id) {
    if (this.isDemoMode()) {
      const contacts = mockDataService.getContacts();
      const index = contacts.findIndex(c => c.id === id);
      if (index > -1) {
        contacts.splice(index, 1);
      }
      return { data: { success: true } };
    }
    return { data: null };
  }

  // Automation Service
  async getAutomationStatus() {
    if (this.isDemoMode()) {
      return { 
        data: { 
          isRunning: mockDataService.isRunning,
          lastRun: new Date().toISOString()
        }
      };
    }
    return { data: { isRunning: false } };
  }

  async getAutomationFlows() {
    if (this.isDemoMode()) {
      return {
        data: [
          {
            id: 'auto-qualify-hot',
            nome: 'Qualificar Leads Quentes',
            descricao: 'Move leads com score alto para qualificados',
            ativo: true,
            gatilho: 'Score > 80',
            regras: { score_minimo: 80 }
          },
          {
            id: 'auto-cadence',
            nome: 'Cadência de Follow-up',
            descricao: 'Envia mensagens automáticas de follow-up',
            ativo: true,
            gatilho: 'Sem resposta há 24h',
            regras: { tempo_sem_resposta: 24 }
          },
          {
            id: 'auto-qualify-score',
            nome: 'Atualizar Score',
            descricao: 'Atualiza score baseado em interações',
            ativo: true,
            gatilho: 'Nova interação',
            regras: { tempo_interacao: 5 }
          },
          {
            id: 'auto-lost',
            nome: 'Marcar como Perdido',
            descricao: 'Move para perdidos após 30 dias sem resposta',
            ativo: false,
            gatilho: '30 dias sem resposta',
            regras: { dias_sem_resposta: 30 }
          }
        ]
      };
    }
    return { data: [] };
  }

  async startAutomation() {
    if (this.isDemoMode()) {
      // Simular início da automação
      return { data: { success: true } };
    }
    return { data: null };
  }

  async stopAutomation() {
    if (this.isDemoMode()) {
      // Simular parada da automação
      return { data: { success: true } };
    }
    return { data: null };
  }
}

const apiMock = new ApiMockWrapper();

export default apiMock;