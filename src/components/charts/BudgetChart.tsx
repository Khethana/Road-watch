import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SpendingRecord } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface BudgetChartProps {
  data: SpendingRecord[];
}

export const BudgetChart = React.memo(({ data }: BudgetChartProps) => {
  const { isDark } = useTheme();
  
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // Process data for chart
  const chartData = data.map(item => ({
    name: item.month.split(' ')[0], // Get short month name
    allocated: item.allocated,
    spent: item.spent,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke={textColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke={textColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dx={-10} 
            tickFormatter={(value) => `₹${value}L`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder, 
              borderRadius: '0.5rem',
              color: isDark ? '#F9FAFB' : '#0F172A'
            }} 
            formatter={(value) => [`₹${value} Lakhs`, undefined]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="allocated" name="Budget Allocated" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Amount Spent" fill="#F97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

BudgetChart.displayName = 'BudgetChart';
export default BudgetChart;
