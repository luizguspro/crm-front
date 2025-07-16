// src/components/KpiCard.jsx
import React from 'react';

const KpiCard = ({ icon, value, title, bgColor = 'bg-white' }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-sm p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-slate-800">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default KpiCard;