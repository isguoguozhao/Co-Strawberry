import {
  BellRing,
  Boxes,
  Gauge,
  Home,
  Settings,
  SlidersHorizontal,
  Sprout,
  Users,
  Zap,
  type LucideIcon
} from 'lucide-react';
import type { ModuleKey } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cx } from '../../utils/format';

const menu: Array<{
  key: ModuleKey;
  label: string;
  icon: LucideIcon;
  desc: string;
}> = [
  { key: 'dashboard', label: '首页驾驶舱', icon: Home, desc: '全局态势' },
  { key: 'greenhouse', label: '三维大棚总览', icon: Boxes, desc: '数字孪生' },
  { key: 'strawberryRows', label: '草莓分排管理', icon: Sprout, desc: '分排状态' },
  { key: 'environment', label: '环境监测中心', icon: Gauge, desc: '实时环境' },
  { key: 'devices', label: '设备监测与控制', icon: SlidersHorizontal, desc: '联动控制' },
  { key: 'energy', label: '能源管理', icon: Zap, desc: '能耗发电' },
  { key: 'personnel', label: '人员与任务', icon: Users, desc: '定位任务' },
  { key: 'alarms', label: '告警中心', icon: BellRing, desc: '风险处理' },
  { key: 'settings', label: '参数设置', icon: Settings, desc: '阈值预留' }
];

export function ModuleNavigationBar() {
  const activeModule = useAppStore((state) => state.activeModule);
  const setActiveModule = useAppStore((state) => state.setActiveModule);

  return (
    <section className="glass-panel relative z-10 mb-4 h-[88px] overflow-hidden rounded-lg p-3">
      <div className="flex h-full items-center gap-3">
        <div className="w-[168px] shrink-0 border-r border-white/10 pr-3">
          <div className="small-label">Module Navigation</div>
          <div className="mt-1 text-lg font-bold text-white">操作模块</div>
          <div className="mt-1 text-[11px] text-slate-500">顶部快捷切换</div>
        </div>
        <nav className="grid min-w-0 flex-1 grid-cols-9 gap-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.key;

            return (
              <button
                key={item.key}
                className={cx(
                  'group flex h-[62px] min-w-0 items-center gap-2 rounded-md border px-2.5 text-left transition',
                  active
                    ? 'border-leaf-300/50 bg-leaf-400/12 text-white shadow-glow'
                    : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-leaf-300/25 hover:bg-white/[0.07]'
                )}
                onClick={() => setActiveModule(item.key)}
                title={item.label}
              >
                <span
                  className={cx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded border',
                    active ? 'border-leaf-300/40 bg-leaf-300/20' : 'border-white/10 bg-white/[0.04]'
                  )}
                >
                  <Icon className="h-4 w-4 text-leaf-300" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{item.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{item.desc}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
