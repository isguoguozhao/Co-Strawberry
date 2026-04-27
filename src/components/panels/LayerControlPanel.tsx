import {
  BellRing,
  Bot,
  Eye,
  Gauge,
  Lightbulb,
  Sprout,
  Users,
  Zap,
  type LucideIcon
} from 'lucide-react';
import type { LayerKey } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cx } from '../../utils/format';

const layerOptions: Array<{ key: LayerKey; label: string; desc: string; icon: LucideIcon }> = [
  { key: 'personnel', label: '人员图层', desc: '巡检、采摘、维修人员定位', icon: Users },
  { key: 'sensors', label: '传感器图层', desc: '温湿光 CO₂ 点位', icon: Gauge },
  { key: 'devices', label: '控制设备图层', desc: '阀门、风机、补光与温控', icon: Lightbulb },
  { key: 'energy', label: '能源图层', desc: '光伏、风机、电池、EMS', icon: Zap },
  { key: 'rows', label: '草莓排图层', desc: '种植槽与植株状态', icon: Sprout },
  { key: 'alarms', label: '告警图层', desc: '空间告警闪烁标记', icon: BellRing },
  { key: 'heatmap', label: '环境热力图', desc: '按土壤湿度与异常状态着色', icon: Bot }
];

const presets: Array<{ label: string; desc: string; patch: Partial<Record<LayerKey, boolean>> }> = [
  {
    label: '路演全景',
    desc: '展示全部空间要素',
    patch: { personnel: true, sensors: true, devices: true, energy: true, rows: true, alarms: true, heatmap: false }
  },
  {
    label: '环境热力',
    desc: '突出传感器和热区',
    patch: { personnel: false, sensors: true, devices: false, energy: false, rows: true, alarms: true, heatmap: true }
  },
  {
    label: '设备运维',
    desc: '聚焦控制设备和告警',
    patch: { personnel: true, sensors: false, devices: true, energy: true, rows: false, alarms: true, heatmap: false }
  }
];

export function LayerControlPanel() {
  const layers = useAppStore((state) => state.layers);
  const toggleLayer = useAppStore((state) => state.toggleLayer);
  const setLayers = useAppStore((state) => state.setLayers);
  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="small-label">Scene Layers</div>
            <div className="mt-1 text-sm font-semibold text-white">三维图层控制</div>
          </div>
          <div className="flex items-center gap-2 rounded border border-leaf-300/25 bg-field-950/60 px-2 py-1 text-xs text-leaf-300">
            <Eye className="h-3.5 w-3.5" />
            {activeCount}/7
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-leaf-300/35 hover:bg-leaf-400/10"
            onClick={() => setLayers(preset.patch)}
          >
            <div className="text-sm font-semibold text-white">{preset.label}</div>
            <div className="mt-1 text-xs text-slate-500">{preset.desc}</div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {layerOptions.map((layer) => {
          const Icon = layer.icon;
          const enabled = layers[layer.key];

          return (
            <button
              key={layer.key}
              className={cx(
                'flex w-full items-center justify-between gap-3 rounded-md border p-3 text-left transition',
                enabled
                  ? 'border-leaf-300/30 bg-leaf-400/10'
                  : 'border-white/10 bg-white/[0.025] opacity-70'
              )}
              onClick={() => toggleLayer(layer.key)}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04]">
                  <Icon className={cx('h-4 w-4', enabled ? 'text-leaf-300' : 'text-slate-500')} />
                </span>
                <span className="min-w-0">
                  <span className={cx('block text-sm font-semibold', enabled ? 'text-white' : 'text-slate-500')}>
                    {layer.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-500">{layer.desc}</span>
                </span>
              </span>
              <span
                className={cx(
                  'h-3 w-7 shrink-0 rounded-full border transition',
                  enabled ? 'border-leaf-300/50 bg-leaf-400/70' : 'border-white/10 bg-slate-700'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
