// src/data/mockData.js
export const mockUser = {
  name: "Ana Silva",
  email: "ana.silva@empresa.com",
  company: "Tech Solutions"
};

export const mockKpis = {
  leadsQuentes: 7,
  novosLeads: 12,
  visitasAgendadas: 3,
  conversoes: 5
};

export const mockLeads = [
  { 
    id: 1, 
    name: "João Pereira", 
    company: "Startup ABC",
    status: "Quente", 
    score: 92, 
    lastContact: "2025-07-09",
    value: 15000,
    source: "Website",
    tags: ["Software", "Enterprise"],
    email: "joao@startupabc.com",
    phone: "+55 11 98765-4321"
  },
  { 
    id: 2, 
    name: "Mariana Costa", 
    company: "E-commerce XYZ",
    status: "Novo", 
    score: 78, 
    lastContact: "2025-07-09",
    value: 8500,
    source: "Instagram",
    tags: ["E-commerce", "PME"],
    email: "mariana@ecommercexyz.com",
    phone: "+55 11 91234-5678"
  },
  { 
    id: 3, 
    name: "Carlos Andrade", 
    company: "Consultoria Plus",
    status: "Em Negociação", 
    score: 85, 
    lastContact: "2025-07-08",
    value: 25000,
    source: "Indicação",
    tags: ["Consultoria", "B2B"],
    email: "carlos@consultoriaplus.com",
    phone: "+55 11 93456-7890"
  },
  { 
    id: 4, 
    name: "Beatriz Lima", 
    company: "Agência Digital",
    status: "Frio", 
    score: 45, 
    lastContact: "2025-06-28",
    value: 5000,
    source: "LinkedIn",
    tags: ["Marketing", "Agência"],
    email: "beatriz@agenciadigital.com",
    phone: "+55 11 94567-8901"
  },
  { 
    id: 5, 
    name: "Ricardo Mendes", 
    company: "Indústria Tech",
    status: "Quente", 
    score: 95, 
    lastContact: "2025-07-09",
    value: 50000,
    source: "Google Ads",
    tags: ["Indústria", "Automação"],
    email: "ricardo@industriatech.com",
    phone: "+55 11 95678-9012"
  },
];

// Pipeline stages genéricos
export const pipelineStages = [
  {
    id: 'new',
    title: 'Novos Leads',
    color: 'bg-blue-500',
    description: 'Leads que acabaram de entrar'
  },
  {
    id: 'qualified',
    title: 'Qualificados',
    color: 'bg-purple-500',
    description: 'Leads com potencial confirmado'
  },
  {
    id: 'proposal',
    title: 'Proposta',
    color: 'bg-amber-500',
    description: 'Proposta enviada'
  },
  {
    id: 'negotiation',
    title: 'Negociação',
    color: 'bg-orange-500',
    description: 'Em negociação final'
  },
  {
    id: 'won',
    title: 'Ganhos',
    color: 'bg-green-500',
    description: 'Negócios fechados'
  },
  {
    id: 'lost',
    title: 'Perdidos',
    color: 'bg-red-500',
    description: 'Oportunidades perdidas'
  }
];