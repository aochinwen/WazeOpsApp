import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ManagedIncident } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface IncidentStatsProps {
  incidents: ManagedIncident[];
}

export const IncidentStats: React.FC<IncidentStatsProps> = ({ incidents }) => {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach(inc => {
      // Group HAZARD subtypes into a general HAZARD key if loosely matched, or strict matching
      let key = inc.type;
      if (key.includes('HAZARD')) key = 'HAZARD'; // Group all hazards
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.keys(counts).map(key => {
        const config = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.default;
        return {
            name: config.label,
            value: counts[key],
            fill: config.hex
        };
    });
  }, [incidents]);

  if (incidents.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
      <h3 className="text-gray-900 font-bold mb-4 text-lg">Live Overview</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};