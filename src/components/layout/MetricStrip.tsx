import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { alarms, personnels } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { MetricCard } from '../../types';
import { cx } from '../../utils/format';

const toneClass: Record<MetricCard['tone'], string> = {
  green: 'border-leaf-300/20 text-leaf-300',
  cyan: 'border-skytech-400/25 text-skytech-400',
  amber: 'border-pollen-400/30 text-pollen-400',
  red: 'border-berry-400/40 text-berry-400'
};

export function MetricStrip() {
  const env = useAppStore((state) => state.liveEnvironment);
  const rows = useAppStore((state) => state.liveRows);
  const devices = useAppStore((state) => state.liveDevices);
  const energy = useAppStore((state) => state.liveEnergySummary);
  const resolvedAlarms = useAppStore((state) => state.resolvedAlarms);
  const alarmCount = alarms.filter((alarm) => !alarm.handled && !resolvedAlarms[alarm.id]).length;
  const onlineRate = devices.length
    ? Number(((devices.filter((device) => device.online).length / devices.length) * 100).toFixed(1))
    : 0;
  const healthScore = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.healthScore, 0) / rows.length)
    : 0;
  const metrics: MetricCard[] = [
    { id: 'temperature', label: '当前温度', value: env.temperature, unit: '°C', trend: 'flat', tone: 'green' },
    { id: 'airHumidity', label: '空气湿度', value: env.airHumidity, unit: '%RH', trend: 'up', tone: 'cyan' },
    { id: 'soilHumidity', label: '土壤湿度', value: env.soilHumidity, unit: '%', trend: 'down', tone: 'amber' },
    { id: 'light', label: '光照强度', value: `${(env.light / 1000).toFixed(1)}k`, unit: 'lux', trend: 'up', tone: 'green' },
    { id: 'co2', label: 'CO₂ 浓度', value: env.co2, unit: 'ppm', trend: 'flat', tone: 'cyan' },
    { id: 'windSpeed', label: '风速', value: env.windSpeed, unit: 'm/s', trend: 'flat', tone: 'green' },
    { id: 'radiation', label: '辐射强度', value: env.radiation, unit: 'W/m²', trend: 'up', tone: 'amber' },
    { id: 'comfort', label: '热舒适指数', value: env.comfortIndex, unit: '', trend: 'up', tone: 'green' },
    { id: 'energy', label: '当前总能耗', value: energy.realTimePower, unit: 'kW', trend: 'down', tone: 'amber' },
    { id: 'generation', label: '今日发电量', value: (energy.solarGeneration + energy.windGeneration).toFixed(1), unit: 'kWh', trend: 'up', tone: 'green' },
    { id: 'personnel', label: '在线人员', value: personnels.filter((person) => person.online).length, unit: '人', trend: 'flat', tone: 'cyan' },
    { id: 'alarms', label: '当前告警', value: alarmCount, unit: '条', trend: 'down', tone: alarmCount ? 'red' : 'green' },
    { id: 'onlineRate', label: '设备在线率', value: onlineRate, unit: '%', trend: 'flat', tone: 'green' },
    { id: 'health', label: '草莓健康评分', value: healthScore, unit: '分', trend: 'up', tone: healthScore >= 85 ? 'green' : 'amber' }
  ];

  return (
    <section className="glass-panel h-[156px] rounded-lg p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="small-label">Live Data Panel</div>
          <div className="section-title">关键指标总览</div>
        </div>
        <span className="text-xs text-slate-500">mock 实时数据刷新预留</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {metrics.map((metric) => (
          <MetricItem key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function MetricItem({ metric }: { metric: MetricCard }) {
  const TrendIcon = metric.trend === 'up' ? ArrowUp : metric.trend === 'down' ? ArrowDown : ArrowRight;

  return (
    <div className={cx('rounded-md border bg-white/[0.035] px-3 py-1.5', toneClass[metric.tone])}>
      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="truncate">{metric.label}</span>
        <TrendIcon className="h-3 w-3 shrink-0" />
      </div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-black leading-none text-slate-100">{metric.value}</span>
        {metric.unit ? <span className="text-[11px] text-slate-500">{metric.unit}</span> : null}
      </div>
    </div>
  );
}
