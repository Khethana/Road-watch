import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ResolutionRateChartProps {
  data: ChartDataPoint[];
}

export const ResolutionRateChart = React.memo(({ data }: ResolutionRateChartProps) => {
  const { isDark } = useTheme();
  
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorResolution" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke={textColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
            minTickGap={20}
          />
          <YAxis 
            stroke={textColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dx={-10} 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder, 
              borderRadius: '0.5rem',
              color: isDark ? '#F9FAFB' : '#0F172A'
            }} 
            formatter={(value) => [`${value}%`, 'Resolution Rate']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#22C55E" 
            fillOpacity={1} 
            fill="url(#colorResolution)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

ResolutionRateChart.displayName = 'ResolutionRateChart';
export default ResolutionRateChart;
