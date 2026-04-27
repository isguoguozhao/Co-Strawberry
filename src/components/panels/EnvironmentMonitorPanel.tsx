import {
  Activity,
  CloudSun,
  Droplets,
  Gauge,
  Radio,
  Sprout,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { StatusLevel } from '../../types';
import { cx, statusClass, statusText } from '../../utils/format';
import { EnvironmentTrendPanel } from './EnvironmentTrendPanel';

type EnvCard = {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: StatusLevel;
  hint: string;
};

export function EnvironmentMonitorPanel() {
  const env = useAppStore((state) => state.liveEnvironment);
  const sensors = useAppStore((state) => state.liveSensors);
  const updatedAt = useAppStore((state) => state.liveUpdatedAt);
  const abnormalSensors = sensors.filter((sensor) => sensor.status !== 'normal');
  const envCards: EnvCard[] = [
    {
      id: 'temperature',
      label: '空气温度',
      value: env.temperature,
      unit: '°C',
      icon: Thermometer,
      status: env.temperature > 28 || env.temperature < 18 ? 'warning' : 'normal',
      hint: '适宜区间 18-28°C'
    },
    {
      id: 'airHumidity',
      label: '空气湿度',
      value: env.airHumidity,
      unit: '%RH',
      icon: Droplets,
      status: env.airHumidity > 78 || env.airHumidity < 55 ? 'warning' : 'normal',
      hint: '联动除湿/加湿'
    },
    {
      id: 'soilHumidity',
      label: '土壤湿度',
      value: env.soilHumidity,
      unit: '%',
      icon: Sprout,
      status: env.soilHumidity > 72 || env.soilHumidity < 48 ? 'warning' : 'normal',
      hint: '联动灌溉阀'
    },
    {
      id: 'light',
      label: '光照强度',
      value: (env.light / 1000).toFixed(1),
      unit: 'klux',
      icon: Sun,
      status: env.light > 45000 || env.light < 25000 ? 'warning' : 'normal',
      hint: '联动补光灯'
    },
    {
      id: 'co2',
      label: 'CO₂ 浓度',
      value: env.co2,
      unit: 'ppm',
      icon: Activity,
      status: env.co2 > 900 || env.co2 < 450 ? 'warning' : 'normal',
      hint: '影响光合效率'
    },
    {
      id: 'wind',
      label: '风速',
      value: env.windSpeed,
      unit: 'm/s',
      icon: Wind,
      status: env.windSpeed > 3 ? 'warning' : 'normal',
      hint: '通风换气参考'
    },
    {
      id: 'radiation',
      label: '辐射强度',
      value: env.radiation,
      unit: 'W/m²',
      icon: CloudSun,
      status: env.radiation > 500 ? 'warning' : 'normal',
      hint: '遮阳策略参考'
    },
    {
      id: 'comfort',
      label: '热舒适指数',
      value: env.comfortIndex,
      unit: '分',
      icon: Gauge,
      status: env.comfortIndex < 72 ? 'warning' : 'normal',
      hint: '综合温湿光风'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="small-label">Mock Realtime</div>
            <div className="mt-1 text-sm font-semibold text-white">环境监测卡片实时刷新</div>
          </div>
          <div className="flex items-center gap-2 rounded border border-leaf-300/30 bg-field-950/60 px-2 py-1 text-xs text-leaf-300">
            <Radio className="h-3.5 w-3.5" />
            {updatedAt}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {envCards.map((card) => (
          <EnvironmentCard key={card.id} card={card} />
        ))}
      </div>

      <EnvironmentTrendPanel />

      <section className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-white">
          <span>传感器点位状态</span>
          <span className={abnormalSensors.length ? 'text-pollen-400' : 'text-leaf-300'}>
            {abnormalSensors.length ? `${abnormalSensors.length} 个预警` : '全部正常'}
          </span>
        </div>
        {sensors.map((sensor) => (
          <div key={sensor.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">{sensor.name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {sensor.min} - {sensor.max} {sensor.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-white">
                  {sensor.value}
                  <span className="ml-1 text-[11px] text-slate-500">{sensor.unit}</span>
                </div>
                <span className={cx('mt-1 inline-block rounded border px-2 py-0.5 text-[10px]', statusClass[sensor.status])}>
                  {statusText[sensor.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function EnvironmentCard({ card }: { card: EnvCard }) {
  const Icon = card.icon;

  return (
    <div className={cx('rounded-md border bg-white/[0.035] p-3', card.status === 'normal' ? 'border-leaf-300/18' : 'border-pollen-400/35')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04]">
          <Icon className={cx('h-4 w-4', card.status === 'normal' ? 'text-leaf-300' : 'text-pollen-400')} />
        </div>
        <span className={cx('rounded border px-2 py-0.5 text-[10px]', statusClass[card.status])}>
          {statusText[card.status]}
        </span>
      </div>
      <div className="mt-3 text-[11px] text-slate-500">{card.label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-xl font-black text-white">{card.value}</span>
        <span className="text-[11px] text-slate-500">{card.unit}</span>
      </div>
      <div className="mt-2 text-[11px] leading-4 text-slate-500">{card.hint}</div>
    </div>
  );
}
