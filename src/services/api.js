// frontend/src/services/api.js
import axios from 'axios';
import { io } from 'socket.io-client';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração do Socket.io
let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket conectado:', socket.id);
      // Entrar na sala da empresa
      const empresaId = process.env.DEFAULT_EMPRESA_ID || '00000000-0000-0000-0000-000000000001';
      socket.emit('join-company', empresaId);
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado');
    });
  }
  return socket;
};

export const getSocket = () => socket;

// Interceptor para adicionar token se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviços da API
export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getPerformanceData: () => api.get('/dashboard/performance-data'),
  getChannelPerformance: () => api.get('/dashboard/channel-performance'),
};

export const conversationService = {
  getAll: (params) => api.get('/conversations', { params }),
  getById: (id) => api.get(`/conversations/${id}`),
  sendMessage: (conversationId, data) => api.post(`/conversations/${conversationId}/messages`, data),
  markAsRead: (conversationId) => api.put(`/conversations/${conversationId}/read`),
  updateStatus: (conversationId, status) => api.put(`/conversations/${conversationId}/status`, { status }),
};

export const pipelineService = {
  getStages: () => api.get('/pipeline/stages'),
  getDeals: () => api.get('/pipeline/deals'),
  createDeal: (data) => api.post('/pipeline/deals', data),
  moveDeal: (dealId, stageId) => api.put(`/pipeline/deals/${dealId}/move`, { stageId }),
  updateDeal: (dealId, data) => api.put(`/pipeline/deals/${dealId}`, data),
  deleteDeal: (dealId) => api.delete(`/pipeline/deals/${dealId}`),
};

export const contactsService = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/contacts/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  export: () => api.get('/contacts/export', { responseType: 'blob' }),
};

export const automationService = {
  // Status e controle
  getStatus: () => api.get('/automation/status'),
  start: () => api.post('/automation/start'),
  stop: () => api.post('/automation/stop'),
  runNow: () => api.post('/automation/run-now'),
  
  // Fluxos
  getFlows: () => api.get('/automation/flows'),
  updateFlow: (flowId, data) => api.put(`/automation/flows/${flowId}`, data),
  
  // Histórico
  getHistory: (params) => api.get('/automation/history', { params }),
};

export default api;