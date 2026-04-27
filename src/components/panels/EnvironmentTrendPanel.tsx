import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity, CloudSun, Droplets, Sprout, Sun, Thermometer } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cx } from '../../utils/format';

type TrendMetric = 'temperature' | 'airHumidity' | 'soilHumidity' | 'light' | 'co2' | 'energy';

const metricOptions: Array<{
  key: TrendMetric;
  label: string;
  unit: string;
  color: string;
  icon: typeof Thermometer;
}> = [
  { key: 'temperature', label: '温度', unit: '°C', color: '#70f2a1', icon: Thermometer },
  { key: 'airHumidity', label: '空气湿度', unit: '%RH', color: '#51d6ff', icon: Droplets },
  { key: 'soilHumidity', label: '土壤湿度', unit: '%', color: '#f5ce5b', icon: Sprout },
  { key: 'light', label: '光照', unit: 'klux', color: '#fff1a8', icon: Sun },
  { key: 'co2', label: 'CO₂', unit: 'ppm', color: '#ff7590', icon: Activity },
  { key: 'energy', label: '能耗', unit: 'kW', color: '#a9ffd0', icon: CloudSun }
];

export function EnvironmentTrendPanel() {
  const liveTrend = useAppStore((state) => state.liveTrend);
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('temperature');
  const selected = metricOptions.find((item) => item.key === activeMetric) ?? metricOptions[0];
  const data = useMemo(
    () =>
      liveTrend.map((point) => ({
        time: point.time,
        value: activeMetric === 'light' ? Number((point.light / 1000).toFixed(1)) : point[activeMetric]
      })),
    [activeMetric, liveTrend]
  );
  const latest = data[data.length - 1]?.value ?? 0;
  const average = data.length
    ? Number((data.reduce((sum, point) => sum + Number(point.value), 0) / data.length).toFixed(1))
    : 0;

  return (
    <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">环境趋势图</div>
          <div className="mt-1 text-[11px] text-slate-500">实时 mock 序列，保留最近 36 个采样点</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-white">
            {latest}
            <span className="ml-1 text-[11px] text-slate-500">{selected.unit}</span>
          </div>
          <div className="text-[11px] text-slate-500">均值 {average}</div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {metricOptions.map((option) => {
          const Icon = option.icon;
          const active = option.key === activeMetric;

          return (
            <button
              key={option.key}
              className={cx(
                'flex items-center justify-center gap-1 rounded border px-2 py-1.5 text-[11px] transition',
                active
                  ? 'border-leaf-300/40 bg-leaf-400/15 text-leaf-300'
                  : 'border-white/10 bg-white/[0.025] text-slate-500 hover:border-white/20 hover:text-slate-200'
              )}
              onClick={() => setActiveMetric(option.key)}
            >
              <Icon className="h-3.5 w-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(169,255,208,0.08)" vertical={false} />
            <XAxis
              dataKey="time"
              interval="preserveStartEnd"
              tick={{ fill: '#78968c', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(3,17,17,0.92)',
                border: '1px solid rgba(112,242,161,0.24)',
                borderRadius: 6,
                color: '#eafff5'
              }}
              formatter={(value) => [`${value} ${selected.unit}`, selected.label]}
              labelStyle={{ color: '#a9ffd0' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={selected.label}
              dot={false}
              stroke={selected.color}
              strokeWidth={2.4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
