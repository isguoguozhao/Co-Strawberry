import type { ReactNode } from 'react';
import {
  BellRing,
  Bot,
  CheckCircle2,
  CirclePower,
  Gauge,
  Lightbulb,
  MapPin,
  Settings2,
  Sprout,
  Users,
  Zap,
  type LucideIcon
} from 'lucide-react';
import {
  alarms,
  energyDevices,
  greenhouseInfo,
  harvestVehicle,
  personnels,
} from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { ControlDevice, LayerKey, SelectedTarget, StatusLevel } from '../../types';
import { cx, statusClass, statusText } from '../../utils/format';
import { TrendChart } from '../charts/TrendChart';

const compactLayerOptions: Array<{ key: LayerKey; label: string; icon: LucideIcon }> = [
  { key: 'personnel', label: '人员', icon: Users },
  { key: 'sensors', label: '传感器', icon: Gauge },
  { key: 'devices', label: '设备', icon: Lightbulb },
  { key: 'energy', label: '能源', icon: Zap },
  { key: 'rows', label: '草莓排', icon: Sprout },
  { key: 'alarms', label: '告警', icon: BellRing },
  { key: 'heatmap', label: '热力图', icon: Bot }
];

export function InfoPanel() {
  const selectedTarget = useAppStore((state) => state.selectedTarget);

  return (
    <aside className="glass-panel flex min-h-0 flex-col overflow-hidden rounded-lg">
      <div className="border-b border-white/10 p-4">
        <div className="small-label">Object Detail</div>
        <div className="mt-1 flex items-center justify-between">
          <h2 className="text-lg font-bold">对象详情面板</h2>
          <span className="tech-chip">{selectedTarget.category}</span>
        </div>
      </div>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
        <SelectedObjectDetail selectedTarget={selectedTarget} />
        <div className="my-4 h-px bg-white/10" />
        <CompactLayerSwitches />
      </div>
    </aside>
  );
}

function SelectedObjectDetail({
  selectedTarget
}: {
  selectedTarget: SelectedTarget;
}) {
  return (
    <>
      {selectedTarget.category === 'greenhouse' ? <GreenhouseDetail /> : null}
      {selectedTarget.category === 'row' ? <RowDetail id={selectedTarget.id} /> : null}
      {selectedTarget.category === 'sensor' ? <SensorDetail id={selectedTarget.id} /> : null}
      {selectedTarget.category === 'device' ? <DeviceDetail id={selectedTarget.id} /> : null}
      {selectedTarget.category === 'energy' ? <EnergyDetail id={selectedTarget.id} /> : null}
      {selectedTarget.category === 'personnel' ? <PersonnelDetail id={selectedTarget.id} /> : null}
      {selectedTarget.category === 'vehicle' ? <VehicleDetail /> : null}
      {selectedTarget.category === 'alarm' ? <AlarmDetail id={selectedTarget.id} /> : null}
    </>
  );
}

function CompactLayerSwitches() {
  const layers = useAppStore((state) => state.layers);
  const toggleLayer = useAppStore((state) => state.toggleLayer);
  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <section className="rounded-md border border-leaf-300/15 bg-leaf-400/8 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="small-label">Layer Control</div>
          <div className="mt-1 text-sm font-semibold text-white">图层开关</div>
        </div>
        <span className="tech-chip">{activeCount}/7</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {compactLayerOptions.map((layer) => {
          const Icon = layer.icon;
          const enabled = layers[layer.key];

          return (
            <button
              key={layer.key}
              className={cx(
                'flex items-center justify-between gap-2 rounded border px-2.5 py-2 text-xs transition',
                enabled
                  ? 'border-leaf-300/30 bg-leaf-400/10 text-leaf-300'
                  : 'border-white/10 bg-white/[0.025] text-slate-500'
              )}
              onClick={() => toggleLayer(layer.key)}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{layer.label}</span>
              </span>
              <span
                className={cx(
                  'h-2.5 w-5 shrink-0 rounded-full border transition',
                  enabled ? 'border-leaf-300/50 bg-leaf-400/70' : 'border-white/10 bg-slate-700'
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function GreenhouseDetail() {
  return (
    <div className="space-y-4">
      <div className="soft-panel rounded-md p-4">
        <div className="text-xl font-black text-white">{greenhouseInfo.name}</div>
        <p className="mt-2 text-sm leading-6 text-slate-400">{greenhouseInfo.description}</p>
      </div>
      <DetailGrid
        items={[
          ['建设时间', greenhouseInfo.builtAt],
          ['建筑面积', greenhouseInfo.area],
          ['温室结构', greenhouseInfo.structure],
          ['种植排数', `${greenhouseInfo.rows} 排`],
          ['边缘网关', greenhouseInfo.gateway],
          ['网络预留', greenhouseInfo.network]
        ]}
      />
    </div>
  );
}

function RowDetail({ id }: { id: string }) {
  const rows = useAppStore((state) => state.liveRows);
  const row = rows.find((item) => item.id === id) ?? rows[0];

  return (
    <div className="space-y-4">
      <div className="soft-panel rounded-md p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-black text-white">{row.code} 草莓排</div>
            <div className="mt-1 text-sm text-slate-400">{row.variety} · {row.growthStage}</div>
          </div>
          <Badge status={row.abnormal ? 'warning' : 'normal'} label={row.abnormal ? '异常' : '健康'} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Kpi label="株数" value={row.plantCount} unit="株" />
          <Kpi label="健康评分" value={row.healthScore} unit="分" />
          <Kpi label="种植日期" value={row.plantedAt} />
        </div>
      </div>
      <DetailGrid
        items={[
          ['空气温度', `${row.env.temperature} °C / ${row.bounds.temperature.join(' - ')}`],
          ['空气湿度', `${row.env.airHumidity}%RH / ${row.bounds.airHumidity.join(' - ')}`],
          ['土壤湿度', `${row.env.soilHumidity}% / ${row.bounds.soilHumidity.join(' - ')}`],
          ['光照强度', `${row.env.light} lux / ${row.bounds.light.join(' - ')}`],
          ['CO₂', `${row.env.co2} ppm / ${row.bounds.co2.join(' - ')}`]
        ]}
      />
      <PanelBlock title="近 24 小时趋势">
        <TrendChart data={row.trend} compact />
      </PanelBlock>
      <PanelBlock title="设备联动建议">
        <Bullets items={row.deviceAdvice} />
      </PanelBlock>
      <PanelBlock title="AI 种植建议">
        <Bullets items={row.aiAdvice} icon={<Bot className="h-3.5 w-3.5 text-leaf-300" />} />
      </PanelBlock>
    </div>
  );
}

function SensorDetail({ id }: { id: string }) {
  const sensors = useAppStore((state) => state.liveSensors);
  const sensor = sensors.find((item) => item.id === id) ?? sensors[0];

  return (
    <div className="space-y-4">
      <HeaderCard
        title={sensor.name}
        subtitle="实时传感器点位"
        status={sensor.status}
      />
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="实时数值" value={sensor.value} unit={sensor.unit} />
        <Kpi label="状态" value={statusText[sensor.status]} />
        <Kpi label="下限" value={sensor.min} unit={sensor.unit} />
        <Kpi label="上限" value={sensor.max} unit={sensor.unit} />
      </div>
      <PanelBlock title="点位说明">
        <p className="text-sm leading-6 text-slate-400">
          该点位后续可接入真实传感器遥测，支持 MQTT topic、设备影子和告警阈值联动。
        </p>
      </PanelBlock>
    </div>
  );
}

function DeviceDetail({ id }: { id: string }) {
  const devices = useAppStore((state) => state.liveDevices);
  const baseDevice = devices.find((item) => item.id === id) ?? devices[0];
  const overrides = useAppStore((state) => state.deviceOverrides[id]);
  const updateDevice = useAppStore((state) => state.updateDevice);
  const device: ControlDevice = { ...baseDevice, ...overrides };

  return (
    <div className="space-y-4">
      <HeaderCard title={device.name} subtitle="控制设备" status={device.status} />
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="开关状态" value={device.enabled ? '开启' : '关闭'} />
        <Kpi label="运行模式" value={device.mode === 'auto' ? '自动' : '手动'} />
        <Kpi label="实时功率" value={device.power} unit="kW" />
        <Kpi label="目标值" value={device.targetValue} unit={device.unit} />
      </div>
      <PanelBlock title="模拟控制">
        <div className="space-y-3">
          <button
            className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm transition hover:border-leaf-300/40"
            onClick={() => updateDevice(device.id, { enabled: !device.enabled, mode: 'manual' })}
          >
            <span className="flex items-center gap-2">
              <CirclePower className="h-4 w-4 text-leaf-300" />
              手动开关
            </span>
            <span className={device.enabled ? 'text-leaf-300' : 'text-slate-500'}>
              {device.enabled ? 'ON' : 'OFF'}
            </span>
          </button>
          <button
            className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm transition hover:border-leaf-300/40"
            onClick={() => updateDevice(device.id, { mode: device.mode === 'auto' ? 'manual' : 'auto' })}
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-skytech-400" />
              自动 / 手动模式
            </span>
            <span className="text-skytech-400">{device.mode === 'auto' ? 'AUTO' : 'MANUAL'}</span>
          </button>
          <NumberControl
            label="目标值"
            unit={device.unit}
            value={device.targetValue}
            onChange={(value) => updateDevice(device.id, { targetValue: value })}
          />
          <NumberControl
            label="下限"
            unit={device.unit}
            value={device.lowerLimit}
            onChange={(value) => updateDevice(device.id, { lowerLimit: value })}
          />
          <NumberControl
            label="上限"
            unit={device.unit}
            value={device.upperLimit}
            onChange={(value) => updateDevice(device.id, { upperLimit: value })}
          />
        </div>
      </PanelBlock>
      <PanelBlock title="联动规则">
        <p className="text-sm leading-6 text-slate-400">{device.linkedRule}</p>
      </PanelBlock>
    </div>
  );
}

function EnergyDetail({ id }: { id: string }) {
  const device = energyDevices.find((item) => item.id === id) ?? energyDevices[0];

  return (
    <div className="space-y-4">
      <HeaderCard title={device.name} subtitle="能源设备" status={device.status} />
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="实时发电量" value={device.generationKw} unit="kW" />
        <Kpi label="今日能耗/流转" value={device.todayEnergyKwh} unit="kWh" />
        <Kpi label="储能状态" value={device.storagePercent ?? '--'} unit={device.storagePercent ? '%' : ''} />
        <Kpi label="设备状态" value={statusText[device.status]} />
      </div>
    </div>
  );
}

function PersonnelDetail({ id }: { id: string }) {
  const person = personnels.find((item) => item.id === id) ?? personnels[0];

  return (
    <div className="space-y-4">
      <HeaderCard title={person.name} subtitle={person.role} status={person.online ? 'normal' : 'offline'} />
      <DetailGrid
        items={[
          ['姓名', person.name],
          ['角色', person.role],
          ['当前位置', person.positionName],
          ['任务状态', person.taskStatus],
          ['在线状态', person.online ? '在线' : '离线']
        ]}
      />
    </div>
  );
}

function VehicleDetail() {
  const vehicle = harvestVehicle;

  return (
    <div className="space-y-4">
      <HeaderCard title={vehicle.name} subtitle="机械臂草莓采摘小车" status="normal" />
      <DetailGrid
        items={[
          ['SLAM 定位', vehicle.slamStatus],
          ['路径规划', vehicle.pathPlan],
          ['识别准确率', `${vehicle.recognitionAccuracy}%`],
          ['采摘效率', `${vehicle.pickingEfficiency} 颗/小时`],
          ['机械臂状态', vehicle.armStatus]
        ]}
      />
    </div>
  );
}

function AlarmDetail({ id }: { id: string }) {
  const alarm = alarms.find((item) => item.id === id) ?? alarms[0];
  const resolved = useAppStore((state) => state.resolvedAlarms[id]);
  const resolveAlarm = useAppStore((state) => state.resolveAlarm);

  return (
    <div className="space-y-4">
      <div className="soft-panel rounded-md p-4">
        <div className="flex items-center gap-2 text-berry-400">
          <BellRing className="h-4 w-4" />
          <span className="text-sm font-semibold">{alarm.level} · {alarm.type}</span>
        </div>
        <div className="mt-2 text-xl font-black text-white">{alarm.target}</div>
      </div>
      <DetailGrid
        items={[
          ['告警位置', alarm.location],
          ['当前值', alarm.currentValue],
          ['阈值范围', alarm.threshold],
          ['发生时间', alarm.occurredAt],
          ['处理状态', resolved || alarm.handled ? '已处理' : '待处理']
        ]}
      />
      <button
        className="flex w-full items-center justify-center gap-2 rounded-md border border-leaf-300/30 bg-leaf-400/10 px-3 py-2 text-sm font-semibold text-leaf-300 transition hover:bg-leaf-400/20"
        onClick={() => resolveAlarm(alarm.id)}
      >
        <CheckCircle2 className="h-4 w-4" />
        标记为已处理
      </button>
    </div>
  );
}

function HeaderCard({
  title,
  subtitle,
  status
}: {
  title: string;
  subtitle: string;
  status: StatusLevel;
}) {
  return (
    <div className="soft-panel rounded-md p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-black text-white">{title}</div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            {subtitle}
          </div>
        </div>
        <Badge status={status} label={statusText[status]} />
      </div>
    </div>
  );
}

function Badge({ status, label }: { status: StatusLevel; label: string }) {
  return <span className={`rounded border px-2 py-1 text-[11px] ${statusClass[status]}`}>{label}</span>;
}

function Kpi({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-black text-white">{value}</span>
        {unit ? <span className="text-[11px] text-slate-500">{unit}</span> : null}
      </div>
    </div>
  );
}

function DetailGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="space-y-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          <div className="text-[11px] text-slate-500">{label}</div>
          <div className="mt-1 text-sm leading-5 text-slate-200">{value}</div>
        </div>
      ))}
    </div>
  );
}

function PanelBlock({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-2 text-sm font-semibold text-slate-100">{title}</div>
      {children}
    </section>
  );
}

function Bullets({ items, icon }: { items: string[]; icon?: ReactNode }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex gap-2 text-sm leading-6 text-slate-400">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-300" />
          {icon}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function NumberControl({
  label,
  value,
  unit,
  onChange
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-leaf-300">
          {value} {unit}
        </span>
      </div>
      <input
        className="w-full accent-emerald-300"
        type="range"
        min={0}
        max={unit === 'lux' ? 50000 : 100}
        step={unit === 'lux' ? 500 : 1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
