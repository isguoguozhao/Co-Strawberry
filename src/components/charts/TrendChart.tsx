import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { TrendPoint } from '../../types';

type TrendChartProps = {
  data: TrendPoint[];
  compact?: boolean;
};

export function TrendChart({ data, compact = false }: TrendChartProps) {
  return (
    <div className={compact ? 'h-36 w-full' : 'h-52 w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -22, right: 10, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(169,255,208,0.08)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#78968c', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            interval={compact ? 5 : 3}
          />
          <YAxis
            tick={{ fill: '#78968c', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(3,17,17,0.92)',
              border: '1px solid rgba(112,242,161,0.24)',
              borderRadius: 6,
              color: '#eafff5'
            }}
            labelStyle={{ color: '#a9ffd0' }}
          />
          {!compact ? <Legend wrapperStyle={{ fontSize: 11, color: '#b6cec5' }} /> : null}
          <Line
            type="monotone"
            dataKey="temperature"
            name="温度"
            dot={false}
            stroke="#70f2a1"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="soilHumidity"
            name="土壤湿度"
            dot={false}
            stroke="#f5ce5b"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="co2"
            name="CO₂"
            dot={false}
            stroke="#51d6ff"
            strokeWidth={2}
            yAxisId={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
