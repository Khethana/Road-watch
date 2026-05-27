import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface AreaDamageChartProps {
  data: ChartDataPoint[];
}

const COLORS = ['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#EC4899', '#EAB308'];

export const AreaDamageChart = React.memo(({ data }: AreaDamageChartProps) => {
  const { isDark } = useTheme();
  
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder, 
              borderRadius: '0.5rem',
              color: isDark ? '#F9FAFB' : '#0F172A'
            }} 
            itemStyle={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
            formatter={(value) => [value, 'Complaints']}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

AreaDamageChart.displayName = 'AreaDamageChart';
export default AreaDamageChart;
