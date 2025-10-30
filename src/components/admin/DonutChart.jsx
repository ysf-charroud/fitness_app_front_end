"use client";
import React from 'react';
import { 
  PieChart as RechartsePieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Palette de couleurs pour le graphique
const COLORS = [
  '#4F46E5',    // Indigo
  '#10B981',    // Emerald
  '#F59E0B',    // Amber
  '#EF4444',    // Red
  '#6B7280',    // Cool Gray
  '#8B5CF6',    // Purple
  '#EC4899',    // Pink
  '#14B8A6'     // Teal
];

// Définir le composant PieChart avec l'alias
const PieChart = RechartsePieChart;
const DonutChart = ({ data, title, filters }) => {
  const [selectedFilter, setSelectedFilter] = React.useState(filters[0]);

  // Filtrer les données selon le filtre sélectionné
  const filteredData = data.filter(item => item.name === selectedFilter);

  return (
    <div className="bg-black border border-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedFilter === filter ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, "Value"]}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Légende */}
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-sm text-gray-300">{entry.name}</span>
              <span className="text-sm text-gray-400">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;