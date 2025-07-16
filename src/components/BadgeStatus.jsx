// src/components/BadgeStatus.jsx
import React from 'react';

const BadgeStatus = ({ status }) => {
  const statusConfig = {
    'Quente': {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      icon: '🔥',
      border: 'border-orange-200'
    },
    'Em Negociação': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: '💼',
      border: 'border-amber-200'
    },
    'Novo': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: '✨',
      border: 'border-blue-200'
    },
    'Frio': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: '❄️',
      border: 'border-gray-200'
    }
  };

  const config = statusConfig[status] || statusConfig['Frio'];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
      <span className="mr-1.5">{config.icon}</span>
      {status}
    </span>
  );
};

export default BadgeStatus;