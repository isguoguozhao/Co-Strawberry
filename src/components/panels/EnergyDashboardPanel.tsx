import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { BatteryCharging, Leaf, PlugZap, SunMedium, Wind, type LucideIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const palette = ['#70f2a1', '#51d6ff', '#f5ce5b', '#ff7590', '#a9ffd0', '#d5f5ff'];

export function EnergyDashboardPanel() {
  const energy = useAppStore((state) => state.liveEnergySummary);
  const sequence = useAppStore((state) => state.liveSequence);
  const devices = useAppStore((state) => state.liveDevices);
  const categoryData = [
    { name: '照明', value: energy.lighting },
    { name: '空调', value: energy.cooling },
    { name: '风机', value: energy.fan },
    { name: '灌溉', value: energy.irrigation },
    { name: '除湿', value: energy.dehumidify },
    { name: '网关', value: energy.sensorGateway }
  ];
  const flowData = Array.from({ length: 12 }, (_, index) => {
    const phase = (sequence + index) / 4;
    return {
      time: `${String((index * 2) % 24).padStart(2, '0')}:00`,
      consumption: Number((energy.realTimePower + Math.sin(phase) * 5 + 8).toFixed(1)),
      solar: Number((energy.solarGeneration / 12 + Math.max(0, Math.sin(phase)) * 3).toFixed(1)),
      wind: Number((energy.windGeneration / 12 + Math.max(0, Math.cos(phase)) * 1.2).toFixed(1))
    };
  });
  const runningPower = devices.reduce((sum, device) => sum + (device.enabled ? device.power : 0), 0);
  const cleanRatio = Math.round(
    ((energy.solarGeneration + energy.windGeneration) /
      Math.max(energy.todayConsumption + energy.solarGeneration + energy.windGeneration, 1)) *
      100
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <EnergyKpi icon={PlugZap} label="实时功率" value={energy.realTimePower} unit="kW" />
        <EnergyKpi icon={SunMedium} label="今日发电" value={(energy.solarGeneration + energy.windGeneration).toFixed(1)} unit="kWh" />
        <EnergyKpi icon={BatteryCharging} label="电池 SOC" value={energy.batterySoc} unit="%" />
        <EnergyKpi icon={Leaf} label="清洁占比" value={cleanRatio} unit="%" />
      </div>

      <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">能耗 / 发电趋势</div>
          <span className="text-[11px] text-slate-500">2 小时粒度 mock</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowData} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="consumptionFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#f5ce5b" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#f5ce5b" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="solarFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#70f2a1" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#70f2a1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(169,255,208,0.08)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a9ffd0' }} />
              <Area type="monotone" dataKey="consumption" name="负荷" stroke="#f5ce5b" fill="url(#consumptionFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="solar" name="太阳能" stroke="#70f2a1" fill="url(#solarFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="wind" name="风电" stroke="#51d6ff" fill="rgba(81,214,255,0.08)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
          <div className="mb-2 text-sm font-semibold text-white">分项能耗</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(169,255,208,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="kWh" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
          <div className="mb-2 text-sm font-semibold text-white">能源结构</div>
          <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '太阳能', value: energy.solarGeneration },
                      { name: '风力', value: energy.windGeneration },
                      { name: '电网负荷', value: Math.max(energy.todayConsumption - energy.solarGeneration, 12) }
                    ]}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={52}
                    paddingAngle={3}
                  >
                    <Cell fill="#70f2a1" />
                    <Cell fill="#51d6ff" />
                    <Cell fill="#f5ce5b" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              <LegendLine color="#70f2a1" label="太阳能发电" value={`${energy.solarGeneration} kWh`} />
              <LegendLine color="#51d6ff" label="风力发电" value={`${energy.windGeneration} kWh`} />
              <LegendLine color="#f5ce5b" label="运行设备功率" value={`${runningPower.toFixed(1)} kW`} />
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-leaf-300">
          <Wind className="h-4 w-4" />
          节能建议
        </div>
        <div className="space-y-2">
          {energy.suggestions.map((item) => (
            <div key={item} className="text-xs leading-5 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: 'rgba(3,17,17,0.92)',
  border: '1px solid rgba(112,242,161,0.24)',
  borderRadius: 6,
  color: '#eafff5'
};

function EnergyKpi({
  icon: Icon,
  label,
  value,
  unit
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <div className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500">{label}</span>
        <Icon className="h-4 w-4 text-leaf-300" />
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-xl font-black text-white">{value}</span>
        <span className="text-[11px] text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function LegendLine({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border border-white/10 bg-white/[0.035] px-2 py-1.5">
      <span className="flex items-center gap-2 text-slate-400">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
