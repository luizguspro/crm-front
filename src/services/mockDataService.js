// src/services/mockDataService.js
import { faker } from '@faker-js/faker/locale/pt_BR';

class MockDataService {
  constructor() {
    this.isRunning = false;
    this.intervals = [];
    this.listeners = new Map();
    this.mockData = {
      conversations: [],
      deals: [],
      contacts: [],
      activities: [],
      messages: new Map(),
      kpis: {
        leadsQuentes: 0,
        novosLeads: 0,
        visitasAgendadas: 0,
        taxaConversao: 0
      }
    };
    
    // Inicializar com alguns dados base
    this.initializeBaseData();
  }

  // Inicializar dados base
  initializeBaseData() {
    // Criar contatos iniciais
    this.mockData.contacts = this.generateContacts(50);
    
    // Criar conversas iniciais
    this.mockData.conversations = this.generateConversations(20);
    
    // Criar deals iniciais no pipeline
    this.mockData.deals = this.generateDeals(15);
    
    // Criar atividades iniciais
    this.mockData.activities = this.generateActivities(10);
    
    // Definir KPIs iniciais
    this.mockData.kpis = {
      leadsQuentes: 12,
      novosLeads: 8,
      visitasAgendadas: 5,
      taxaConversao: 24.5
    };
  }

  // Gerar contatos
  generateContacts(count) {
    const contacts = [];
    const empresas = [
      'Tech Solutions', 'Digital Agency', 'E-commerce Plus', 
      'Consulting Group', 'Marketing Pro', 'Sales Force',
      'Innovation Lab', 'Creative Studio', 'Data Systems'
    ];
    
    const tags = [
      'Cliente VIP', 'Lead Quente', 'Em Negociação', 
      'Prospect', 'Lead Frio', 'WhatsApp', 'Instagram'
    ];
    
    for (let i = 0; i < count; i++) {
      contacts.push({
        id: faker.string.uuid(),
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        telefone: faker.phone.number('(##) ####-####'),
        whatsapp: faker.phone.number('(##) 9####-####'),
        empresa: faker.helpers.arrayElement(empresas),
        cargo: faker.person.jobTitle(),
        cpf_cnpj: faker.string.numeric('###.###.###-##'),
        tags: faker.helpers.arrayElements(tags, { min: 1, max: 3 }),
        score: faker.number.int({ min: 20, max: 100 }),
        valorTotal: faker.number.int({ min: 5000, max: 150000 }),
        origem: faker.helpers.arrayElement(['Website', 'WhatsApp', 'Instagram', 'Indicação']),
        ultimoContato: this.getRandomRecentDate(),
        criado_em: faker.date.recent({ days: 30 })
      });
    }
    return contacts;
  }

  // Gerar conversas
  generateConversations(count) {
    const conversations = [];
    const canais = ['whatsapp', 'instagram', 'messenger', 'email'];
    const status = ['unread', 'open', 'closed', 'waiting'];
    
    for (let i = 0; i < count; i++) {
      const contact = faker.helpers.arrayElement(this.mockData.contacts);
      const conversationId = faker.string.uuid();
      
      // Gerar mensagens para esta conversa
      const messages = this.generateMessages(faker.number.int({ min: 3, max: 15 }));
      this.mockData.messages.set(conversationId, messages);
      
      conversations.push({
        id: conversationId,
        contato: {
          id: contact.id,
          nome: contact.nome,
          whatsapp: contact.whatsapp,
          email: contact.email
        },
        canal_tipo: faker.helpers.arrayElement(canais),
        status: faker.helpers.arrayElement(status),
        ultima_mensagem: messages[messages.length - 1]?.conteudo || 'Olá!',
        ultima_mensagem_em: new Date().toISOString(),
        nao_lidas: faker.number.int({ min: 0, max: 5 }),
        criado_em: faker.date.recent({ days: 7 })
      });
    }
    return conversations;
  }

  // Gerar mensagens
  generateMessages(count) {
    const messages = [];
    const frases = [
      'Olá! Vi o anúncio sobre o sistema',
      'Gostaria de saber mais sobre os planos',
      'Qual o valor do plano Enterprise?',
      'Podemos agendar uma demonstração?',
      'Muito interessante! Quando podemos conversar?',
      'Preciso de uma solução para minha empresa',
      'Quantos usuários posso ter?',
      'Vocês têm integração com WhatsApp?',
      'Como funciona o período de teste?',
      'Obrigado pelo atendimento!',
      'Vou analisar a proposta',
      'Fechado! Vamos prosseguir',
      'Preciso pensar melhor',
      'Podem enviar mais informações?'
    ];
    
    for (let i = 0; i < count; i++) {
      messages.push({
        id: faker.string.uuid(),
        conteudo: faker.helpers.arrayElement(frases),
        remetente_tipo: faker.helpers.arrayElement(['cliente', 'bot', 'atendente']),
        lida: faker.datatype.boolean(),
        criado_em: faker.date.recent({ days: 1 })
      });
    }
    return messages.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
  }

  // Gerar deals para o pipeline
  generateDeals(count) {
    const stages = [
      { id: 'new', title: 'Novos Leads', color: 'bg-blue-500' },
      { id: 'qualified', title: 'Qualificados', color: 'bg-purple-500' },
      { id: 'proposal', title: 'Proposta', color: 'bg-amber-500' },
      { id: 'negotiation', title: 'Negociação', color: 'bg-orange-500' },
      { id: 'won', title: 'Ganhos', color: 'bg-green-500' }
    ];
    
    const deals = [];
    
    for (let i = 0; i < count; i++) {
      const contact = faker.helpers.arrayElement(this.mockData.contacts);
      deals.push({
        id: faker.string.uuid(),
        name: contact.nome,
        contact: contact.telefone,
        email: contact.email,
        phone: contact.whatsapp,
        value: faker.number.int({ min: 5000, max: 100000 }),
        score: faker.number.int({ min: 40, max: 100 }),
        stage: faker.helpers.arrayElement(stages).id,
        tags: faker.helpers.arrayElements(['Software', 'Enterprise', 'PME', 'Urgente'], { min: 1, max: 3 }),
        source: faker.helpers.arrayElement(['Website', 'Instagram', 'WhatsApp', 'Indicação']),
        lastContact: this.getRandomRecentDate(),
        lastChannel: faker.helpers.arrayElement(['whatsapp', 'email', 'phone']),
        criado_em: faker.date.recent({ days: 15 })
      });
    }
    
    return deals;
  }

  // Gerar atividades
  generateActivities(count) {
    const activities = [];
    const types = ['new_lead', 'message', 'deal_moved', 'deal_won', 'task'];
    const titles = [
      'Novo lead recebido',
      'Mensagem recebida no WhatsApp',
      'Negócio movido para Proposta',
      'Negócio fechado!',
      'Tarefa criada',
      'Cliente respondeu',
      'Reunião agendada',
      'Proposta enviada'
    ];
    
    for (let i = 0; i < count; i++) {
      activities.push({
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(types),
        title: faker.helpers.arrayElement(titles),
        description: faker.lorem.sentence(),
        contactName: faker.person.fullName(),
        created_at: faker.date.recent({ days: 2 })
      });
    }
    
    return activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Gerar dados de performance
  generatePerformanceData() {
    const data = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        data: date.toISOString().split('T')[0],
        conversas: faker.number.int({ min: 10, max: 50 }),
        leads: faker.number.int({ min: 5, max: 20 }),
        vendas: faker.number.int({ min: 1, max: 10 })
      });
    }
    return data;
  }

  // Gerar performance por canal
  generateChannelPerformance() {
    return [
      {
        channel: 'WhatsApp',
        messages: faker.number.int({ min: 100, max: 500 }),
        contacts: faker.number.int({ min: 50, max: 200 }),
        conversions: faker.number.int({ min: 10, max: 50 }),
        percentage: 45
      },
      {
        channel: 'Instagram',
        messages: faker.number.int({ min: 50, max: 300 }),
        contacts: faker.number.int({ min: 30, max: 150 }),
        conversions: faker.number.int({ min: 5, max: 30 }),
        percentage: 30
      },
      {
        channel: 'Email',
        messages: faker.number.int({ min: 30, max: 200 }),
        contacts: faker.number.int({ min: 20, max: 100 }),
        conversions: faker.number.int({ min: 3, max: 20 }),
        percentage: 25
      }
    ];
  }

  // Utilitários
  getRandomRecentDate() {
    const dates = ['Agora', '5 min', '1h', '3h', 'Ontem', '2 dias'];
    return faker.helpers.arrayElement(dates);
  }

  // SIMULAÇÕES EM TEMPO REAL

  // Simular nova mensagem chegando
  simulateNewMessage() {
    const conversation = faker.helpers.arrayElement(this.mockData.conversations);
    const newMessage = {
      id: faker.string.uuid(),
      conteudo: faker.helpers.arrayElement([
        'Olá, gostaria de mais informações',
        'Qual o preço?',
        'Podem me ligar?',
        'Estou interessado!',
        'Como funciona?'
      ]),
      remetente_tipo: 'cliente',
      lida: false,
      criado_em: new Date()
    };
    
    // Adicionar mensagem
    const messages = this.mockData.messages.get(conversation.id) || [];
    messages.push(newMessage);
    this.mockData.messages.set(conversation.id, messages);
    
    // Atualizar conversa
    conversation.ultima_mensagem = newMessage.conteudo;
    conversation.ultima_mensagem_em = new Date().toISOString();
    conversation.nao_lidas = (conversation.nao_lidas || 0) + 1;
    
    // Notificar listeners
    this.notify('new-message', { conversation, message: newMessage });
    
    // Adicionar atividade
    this.addActivity({
      type: 'message',
      title: 'Nova mensagem recebida',
      description: `${conversation.contato.nome}: ${newMessage.conteudo}`,
      contactName: conversation.contato.nome
    });
  }

  // Simular novo lead
  simulateNewLead() {
    const newContact = this.generateContacts(1)[0];
    this.mockData.contacts.unshift(newContact);
    
    // Criar deal no pipeline
    const newDeal = {
      id: faker.string.uuid(),
      name: newContact.nome,
      contact: newContact.telefone,
      email: newContact.email,
      phone: newContact.whatsapp,
      value: faker.number.int({ min: 5000, max: 50000 }),
      score: faker.number.int({ min: 60, max: 95 }),
      stage: 'new',
      tags: ['Novo', 'WhatsApp'],
      source: 'WhatsApp',
      lastContact: 'Agora',
      lastChannel: 'whatsapp'
    };
    
    this.mockData.deals.push(newDeal);
    
    // Atualizar KPIs
    this.mockData.kpis.novosLeads++;
    
    // Notificar
    this.notify('new-lead', { contact: newContact, deal: newDeal });
    
    // Adicionar atividade
    this.addActivity({
      type: 'new_lead',
      title: 'Novo lead capturado!',
      description: `${newContact.nome} - ${newContact.empresa}`,
      contactName: newContact.nome
    });
  }

  // Simular movimento no pipeline
  simulatePipelineMove() {
    const stages = ['new', 'qualified', 'proposal', 'negotiation', 'won'];
    const deal = faker.helpers.arrayElement(this.mockData.deals.filter(d => d.stage !== 'won'));
    
    if (deal) {
      const currentIndex = stages.indexOf(deal.stage);
      if (currentIndex < stages.length - 1) {
        const newStage = stages[currentIndex + 1];
        const oldStage = deal.stage;
        deal.stage = newStage;
        
        // Se ganhou, atualizar KPIs
        if (newStage === 'won') {
          this.mockData.kpis.taxaConversao = Math.min(100, this.mockData.kpis.taxaConversao + 2);
        }
        
        // Notificar
        this.notify('deal-moved', { deal, oldStage, newStage });
        
        // Adicionar atividade
        this.addActivity({
          type: newStage === 'won' ? 'deal_won' : 'deal_moved',
          title: newStage === 'won' ? '🎉 Negócio fechado!' : `Negócio movido para ${this.getStageName(newStage)}`,
          description: `${deal.name} - R$ ${deal.value.toLocaleString('pt-BR')}`,
          contactName: deal.name
        });
      }
    }
  }

  // Simular atualização de score
  simulateScoreUpdate() {
    const contact = faker.helpers.arrayElement(this.mockData.contacts);
    const oldScore = contact.score;
    contact.score = Math.min(100, contact.score + faker.number.int({ min: 5, max: 15 }));
    
    // Se score alto, marcar como lead quente
    if (contact.score >= 80 && oldScore < 80) {
      this.mockData.kpis.leadsQuentes++;
      contact.tags = [...new Set([...contact.tags, 'Lead Quente'])];
      
      // Notificar
      this.notify('hot-lead', { contact });
      
      // Adicionar atividade
      this.addActivity({
        type: 'new_lead',
        title: '🔥 Lead ficou quente!',
        description: `${contact.nome} atingiu score ${contact.score}`,
        contactName: contact.nome
      });
    }
  }

  // Simular agendamento
  simulateScheduling() {
    const contact = faker.helpers.arrayElement(this.mockData.contacts);
    this.mockData.kpis.visitasAgendadas++;
    
    // Notificar
    this.notify('meeting-scheduled', { contact });
    
    // Adicionar atividade
    this.addActivity({
      type: 'task',
      title: '📅 Reunião agendada',
      description: `Demo agendada com ${contact.nome} para ${faker.date.soon({ days: 7 }).toLocaleDateString('pt-BR')}`,
      contactName: contact.nome
    });
  }

  // Adicionar atividade
  addActivity(activity) {
    const newActivity = {
      id: faker.string.uuid(),
      created_at: new Date(),
      ...activity
    };
    
    this.mockData.activities.unshift(newActivity);
    
    // Manter apenas últimas 50 atividades
    if (this.mockData.activities.length > 50) {
      this.mockData.activities = this.mockData.activities.slice(0, 50);
    }
    
    this.notify('new-activity', newActivity);
  }

  // Sistema de notificações
  notify(event, data) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // Nome do estágio
  getStageName(stage) {
    const names = {
      new: 'Novos Leads',
      qualified: 'Qualificados',
      proposal: 'Proposta',
      negotiation: 'Negociação',
      won: 'Ganhos'
    };
    return names[stage] || stage;
  }

  // CONTROLES DA DEMO

  startDemo() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎬 Demo iniciada!');
    
    // Simular nova mensagem a cada 5-15 segundos
    this.intervals.push(
      setInterval(() => {
        this.simulateNewMessage();
      }, faker.number.int({ min: 5000, max: 15000 }))
    );
    
    // Simular novo lead a cada 20-40 segundos
    this.intervals.push(
      setInterval(() => {
        this.simulateNewLead();
      }, faker.number.int({ min: 20000, max: 40000 }))
    );
    
    // Simular movimento no pipeline a cada 15-30 segundos
    this.intervals.push(
      setInterval(() => {
        this.simulatePipelineMove();
      }, faker.number.int({ min: 15000, max: 30000 }))
    );
    
    // Simular atualização de score a cada 10-20 segundos
    this.intervals.push(
      setInterval(() => {
        this.simulateScoreUpdate();
      }, faker.number.int({ min: 10000, max: 20000 }))
    );
    
    // Simular agendamento a cada 30-60 segundos
    this.intervals.push(
      setInterval(() => {
        this.simulateScheduling();
      }, faker.number.int({ min: 30000, max: 60000 }))
    );
    
    // Atualizar KPIs gradualmente
    this.intervals.push(
      setInterval(() => {
        // Incrementar alguns KPIs randomicamente
        if (Math.random() > 0.5) {
          this.mockData.kpis.novosLeads += faker.number.int({ min: 0, max: 2 });
        }
        if (Math.random() > 0.7) {
          this.mockData.kpis.leadsQuentes += faker.number.int({ min: 0, max: 1 });
        }
        if (Math.random() > 0.8) {
          this.mockData.kpis.visitasAgendadas += 1;
        }
        
        this.notify('kpis-updated', this.mockData.kpis);
      }, 8000)
    );
  }

  stopDemo() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    console.log('🛑 Demo parada');
    
    // Limpar todos os intervalos
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  resetDemo() {
    this.stopDemo();
    this.initializeBaseData();
    this.notify('demo-reset', {});
    console.log('🔄 Demo resetada');
  }

  // Getters para os dados
  getContacts() {
    return this.mockData.contacts;
  }

  getConversations() {
    return this.mockData.conversations;
  }

  getMessages(conversationId) {
    return this.mockData.messages.get(conversationId) || [];
  }

  getDeals() {
    // Organizar deals por estágio
    const stages = [
      { id: 'new', title: 'Novos Leads', color: 'bg-blue-500', description: 'Leads recém chegados', leads: [] },
      { id: 'qualified', title: 'Qualificados', color: 'bg-purple-500', description: 'Leads com potencial confirmado', leads: [] },
      { id: 'proposal', title: 'Proposta', color: 'bg-amber-500', description: 'Proposta enviada', leads: [] },
      { id: 'negotiation', title: 'Negociação', color: 'bg-orange-500', description: 'Em negociação final', leads: [] },
      { id: 'won', title: 'Ganhos', color: 'bg-green-500', description: 'Negócios fechados', leads: [] }
    ];
    
    this.mockData.deals.forEach(deal => {
      const stage = stages.find(s => s.id === deal.stage);
      if (stage) {
        stage.leads.push(deal);
      }
    });
    
    return stages;
  }

  getActivities() {
    return this.mockData.activities;
  }

  getKPIs() {
    return this.mockData.kpis;
  }

  getPerformanceData() {
    return this.generatePerformanceData();
  }

  getChannelPerformance() {
    return this.generateChannelPerformance();
  }
}

// Criar instância singleton
const mockDataService = new MockDataService();

export default mockDataService;