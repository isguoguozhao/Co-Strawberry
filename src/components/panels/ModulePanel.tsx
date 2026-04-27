import {
  BellRing,
  Leaf,
  Settings2,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { alarms, personnels, trend24h } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { ModuleKey } from '../../types';
import { TrendChart } from '../charts/TrendChart';
import { AIAdvicePanel } from './AIAdvicePanel';
import { AlarmCenterPanel } from './AlarmCenterPanel';
import { DeviceControlPanel } from './DeviceControlPanel';
import { EnergyDashboardPanel } from './EnergyDashboardPanel';
import { EnvironmentMonitorPanel } from './EnvironmentMonitorPanel';
import { LayerControlPanel } from './LayerControlPanel';
import { StrawberryRowsPanel } from './StrawberryRowsPanel';

const titleMap: Record<ModuleKey, string> = {
  dashboard: '首页驾驶舱',
  greenhouse: '三维大棚总览',
  strawberryRows: '草莓分排管理',
  environment: '环境监测中心',
  devices: '设备监测与控制',
  energy: '能源管理',
  personnel: '人员与任务管理',
  alarms: '告警中心',
  settings: '参数设置'
};

export function ModulePanel() {
  const activeModule = useAppStore((state) => state.activeModule);

  return (
    <section className="rounded-lg border border-leaf-300/15 bg-field-950/64 p-4 shadow-glow backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="small-label">Current Module</div>
          <h2 className="mt-1 text-base font-black text-white">{titleMap[activeModule]}</h2>
        </div>
        <span className="tech-chip shrink-0">Phase 3 Analytics</span>
      </div>
      <div className="space-y-3">
        {activeModule === 'dashboard' ? <DashboardModule /> : null}
        {activeModule === 'greenhouse' ? <LayerControlPanel /> : null}
        {activeModule === 'strawberryRows' ? <StrawberryRowsPanel /> : null}
        {activeModule === 'environment' ? <EnvironmentMonitorPanel /> : null}
        {activeModule === 'devices' ? <DeviceControlPanel /> : null}
        {activeModule === 'energy' ? <EnergyDashboardPanel /> : null}
        {activeModule === 'personnel' ? <PersonnelModule /> : null}
        {activeModule === 'alarms' ? <AlarmCenterPanel /> : null}
        {activeModule === 'settings' ? <SettingsModule /> : null}
      </div>
    </section>
  );
}

function DashboardModule() {
  const env = useAppStore((state) => state.liveEnvironment);
  const rows = useAppStore((state) => state.liveRows);
  const energy = useAppStore((state) => state.liveEnergySummary);
  const resolvedAlarms = useAppStore((state) => state.resolvedAlarms);
  const activeAlarms = alarms.filter((item) => !item.handled && !resolvedAlarms[item.id]).length;
  const averageHealth = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.healthScore, 0) / rows.length)
    : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="温度" value={env.temperature} unit="°C" />
        <MiniStat label="空气湿度" value={env.airHumidity} unit="%RH" />
        <MiniStat label="土壤湿度" value={env.soilHumidity} unit="%" />
        <MiniStat label="CO₂" value={env.co2} unit="ppm" />
        <MiniStat label="在线人员" value={personnels.length} unit="人" />
        <MiniStat label="活跃告警" value={activeAlarms} unit="条" />
        <MiniStat label="今日能耗" value={energy.todayConsumption} unit="kWh" />
        <MiniStat label="草莓健康" value={averageHealth} unit="分" />
      </div>
      <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Leaf className="h-4 w-4 text-leaf-300" />
          24 小时环境趋势
        </div>
        <TrendChart data={trend24h} compact />
      </div>
      <AIAdvicePanel />
    </div>
  );
}

function PersonnelModule() {
  const selectTarget = useAppStore((state) => state.selectTarget);

  return (
    <div className="grid grid-cols-1 gap-2">
      {personnels.map((person) => (
        <button
          key={person.id}
          className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-skytech-400/40"
          onClick={() => selectTarget({ category: 'personnel', id: person.id })}
        >
          <div className="flex items-center justify-between">
            <span className="font-black text-white">{person.name}</span>
            <span className="rounded border border-skytech-400/30 bg-skytech-400/10 px-2 py-0.5 text-[10px] text-skytech-400">
              {person.role}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">{person.positionName}</div>
          <div className="mt-2 text-xs text-slate-500">{person.taskStatus}</div>
        </button>
      ))}
    </div>
  );
}

function SettingsModule() {
  return (
    <div className="grid grid-cols-1 gap-2">
      <GuideCard icon={Settings2} title="阈值策略" text="温度、湿度、光照、CO₂ 上下限参数已在 mock 数据中预留。" />
      <GuideCard icon={Zap} title="接口预留" text="后续可替换为 MQTT/WebSocket 订阅状态，并写入数据库。" />
      <GuideCard icon={BellRing} title="联动规则" text="设备控制模块已具备自动/手动、目标值、上下限和规则展示。" />
      <AIAdvicePanel />
    </div>
  );
}

function MiniStat({
  label,
  value,
  unit
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-2.5">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-black text-white">{value}</span>
        <span className="text-[11px] text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function GuideCard({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="h-4 w-4 text-leaf-300" />
        {title}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}
