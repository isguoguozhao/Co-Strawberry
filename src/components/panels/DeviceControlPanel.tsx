import { CirclePower, Cpu, Settings2, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ControlDevice } from '../../types';
import { cx, statusClass, statusText } from '../../utils/format';

export function DeviceControlPanel() {
  const devices = useAppStore((state) => state.liveDevices);
  const updateDevice = useAppStore((state) => state.updateDevice);
  const selectTarget = useAppStore((state) => state.selectTarget);
  const onlineRate = devices.length
    ? Math.round((devices.filter((device) => device.online).length / devices.length) * 100)
    : 0;
  const runningCount = devices.filter((device) => device.enabled).length;
  const totalPower = devices.reduce((sum, device) => sum + (device.enabled ? device.power : 0), 0).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <PanelKpi label="在线率" value={onlineRate} unit="%" />
        <PanelKpi label="运行中" value={runningCount} unit="台" />
        <PanelKpi label="实时功率" value={totalPower} unit="kW" />
      </div>

      <div className="space-y-2">
        {devices.map((device) => (
          <DeviceControlCard
            key={device.id}
            device={device}
            onUpdate={(patch) => updateDevice(device.id, patch)}
            onOpenDetail={() => selectTarget({ category: 'device', id: device.id })}
          />
        ))}
      </div>
    </div>
  );
}

function DeviceControlCard({
  device,
  onUpdate,
  onOpenDetail
}: {
  device: ControlDevice;
  onUpdate: (patch: Partial<ControlDevice>) => void;
  onOpenDetail: () => void;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 text-left" onClick={onOpenDetail}>
          <div className="truncate text-sm font-black text-white">{device.name}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
            <Cpu className="h-3.5 w-3.5" />
            {device.mode === 'auto' ? '自动模式' : '手动模式'} · {device.power} kW
          </div>
        </button>
        <span className={cx('rounded border px-2 py-0.5 text-[10px]', statusClass[device.status])}>
          {statusText[device.status]}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={cx(
            'flex items-center justify-between rounded border px-3 py-2 text-xs transition',
            device.enabled
              ? 'border-leaf-300/35 bg-leaf-400/10 text-leaf-300'
              : 'border-white/10 bg-white/[0.035] text-slate-400'
          )}
          onClick={() => onUpdate({ enabled: !device.enabled, mode: 'manual' })}
        >
          <span className="flex items-center gap-2">
            <CirclePower className="h-3.5 w-3.5" />
            开关
          </span>
          {device.enabled ? 'ON' : 'OFF'}
        </button>
        <button
          className="flex items-center justify-between rounded border border-skytech-400/25 bg-skytech-400/10 px-3 py-2 text-xs text-skytech-400 transition hover:border-skytech-400/45"
          onClick={() => onUpdate({ mode: device.mode === 'auto' ? 'manual' : 'auto' })}
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-3.5 w-3.5" />
            模式
          </span>
          {device.mode === 'auto' ? 'AUTO' : 'MANUAL'}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <RangeControl
          label="目标值"
          value={device.targetValue}
          unit={device.unit}
          onChange={(value) => onUpdate({ targetValue: value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <RangeControl
            label="下限"
            value={device.lowerLimit}
            unit={device.unit}
            compact
            onChange={(value) => onUpdate({ lowerLimit: value })}
          />
          <RangeControl
            label="上限"
            value={device.upperLimit}
            unit={device.unit}
            compact
            onChange={(value) => onUpdate({ upperLimit: value })}
          />
        </div>
      </div>

      <div className="mt-3 rounded border border-leaf-300/15 bg-leaf-400/10 p-2 text-xs leading-5 text-slate-300">
        <span className="mr-1 text-leaf-300">联动规则</span>
        {device.linkedRule}
      </div>
    </section>
  );
}

function PanelKpi({
  label,
  value,
  unit
}: {
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <div className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-2.5">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-black text-white">{value}</span>
        <span className="text-[10px] text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  unit,
  compact,
  onChange
}: {
  label: string;
  value: number;
  unit: string;
  compact?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded border border-white/10 bg-white/[0.03] p-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="flex items-center gap-1 text-slate-500">
          <SlidersHorizontal className="h-3 w-3" />
          {label}
        </span>
        <span className="text-leaf-300">
          {value} {unit}
        </span>
      </div>
      <input
        className={cx('w-full accent-emerald-300', compact && 'h-4')}
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
