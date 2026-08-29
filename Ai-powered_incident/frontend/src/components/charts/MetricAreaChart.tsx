import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MetricDataPoint } from '../../types/analytics';

interface MetricAreaChartProps {
  data: MetricDataPoint[];
  dataKey?: 'requests' | 'latencyMs' | 'errorRate';
  color?: string;
  height?: number;
  unit?: string;
}

export const MetricAreaChart: React.FC<MetricAreaChartProps> = ({
  data,
  dataKey = 'requests',
  color = '#6366f1',
  height = 220,
  unit = ' req/s',
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
          <XAxis
            dataKey="timestamp"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#1f293d' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#1f293d',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            }}
            formatter={(value: any) => [`${value}${unit}`, dataKey]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
