import React from 'react';
import { FILTERS, CATEGORY_CONFIG } from '../constants';
import { FilterCategory, ManagedIncident } from '../types';

interface IncidentFilterProps {
  currentFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  incidents: ManagedIncident[];
}

export const IncidentFilter: React.FC<IncidentFilterProps> = ({ currentFilter, onFilterChange, incidents }) => {
  
  const getCount = (id: FilterCategory) => {
    if (id === 'ALL') return incidents.length;
    return incidents.filter(i => {
        if (id === 'HAZARD') return i.type.includes('HAZARD');
        return i.type === id;
    }).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter.id;
        const count = getCount(filter.id);
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${isActive 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }
            `}
          >
            {filter.label}
            <span className={`
              text-xs py-0.5 px-2 rounded-full
              ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};