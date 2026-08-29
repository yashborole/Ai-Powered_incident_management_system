import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MetricDataPoint } from '../../types/analytics';

interface LatencyLineChartProps {
  data: MetricDataPoint[];
  height?: number;
}

export const LatencyLineChart: React.FC<LatencyLineChartProps> = ({ data, height = 220 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            tickFormatter={(val) => `${val}ms`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#1f293d',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="latencyMs"
            name="Avg Latency"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="p95Ms"
            name="P95 Latency"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
