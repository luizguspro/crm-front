// src/pages/Calendar.jsx
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Clock, MapPin, Users, Video, Phone, AlertCircle, CheckCircle,
  Filter, Search, MoreVertical, Bell, Zap
} from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // month, week, day

  // Dados mockados de eventos
  const events = [
    {
      id: 1,
      title: 'Demo com Tech Startup',
      date: '2025-07-09',
      time: '10:00',
      duration: '1h',
      type: 'video',
      lead: 'João Silva',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Follow-up E-commerce Fashion',
      date: '2025-07-09',
      time: '14:30',
      duration: '30min',
      type: 'phone',
      lead: 'Maria Santos',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Apresentação de Proposta',
      date: '2025-07-10',
      time: '15:00',
      duration: '2h',
      type: 'meeting',
      lead: 'Carlos Mendes',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Reunião de Fechamento',
      date: '2025-07-11',
      time: '11:00',
      duration: '1h30min',
      type: 'video',
      lead: 'Ricardo Lima',
      color: 'bg-orange-500'
    }
  ];

  // Tarefas do dia
  const tasks = [
    { id: 1, title: 'Enviar proposta para Consultoria Alpha', priority: 'high', done: false },
    { id: 2, title: 'Preparar demo do produto', priority: 'medium', done: false },
    { id: 3, title: 'Follow-up com leads frios', priority: 'low', done: true },
    { id: 4, title: 'Atualizar pipeline de vendas', priority: 'medium', done: false }
  ];

  // Funções de calendário
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={14} />;
      case 'phone': return <Phone size={14} />;
      case 'meeting': return <Users size={14} />;
      default: return <CalendarIcon size={14} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
              <p className="text-sm text-gray-500 capitalize">{formatDate(selectedDate)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={18} />
                <span>Novo Evento</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* Controles do Calendário */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Hoje
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid do Calendário */}
              <div className="p-6">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayEvents = getEventsForDate(day.date);
                    const isSelected = day.date.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          min-h-[80px] p-2 rounded-lg cursor-pointer transition-all
                          ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                          ${isToday(day.date) ? 'ring-2 ring-blue-500' : ''}
                          ${isSelected ? 'bg-blue-50' : ''}
                          border border-gray-200
                        `}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${
                            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          } ${isToday(day.date) ? 'text-blue-600' : ''}`}>
                            {day.date.getDate()}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-xs text-gray-500">{dayEvents.length}</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${event.color} text-white truncate`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar com Eventos e Tarefas */}
          <div className="space-y-6">
            {/* Eventos do Dia */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Eventos Hoje</span>
                <Bell className="w-5 h-5 text-gray-400" />
              </h3>
              <div className="space-y-3">
                {events.filter(e => e.date === '2025-07-09').map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1" />
                        {event.time} · {event.duration}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Com: {event.lead}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarefas do Dia */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Tarefas</span>
                <span className="text-sm text-gray-500">
                  {tasks.filter(t => t.done).length}/{tasks.length}
                </span>
              </h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${getPriorityColor(task.priority)}`}>
                    <button className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.done ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {task.done && <CheckCircle size={14} className="text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Zap className="text-blue-600 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Dica do dia</p>
                  <p className="text-blue-700 mt-1">
                    Agende follow-ups automáticos para não perder nenhuma oportunidade!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;