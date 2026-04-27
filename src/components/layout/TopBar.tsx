import { Activity, CloudSun, Cpu, RadioTower, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function TopBar() {
  const temperature = useAppStore((state) => state.liveEnvironment.temperature);
  const updatedAt = useAppStore((state) => state.liveUpdatedAt);

  return (
    <header className="relative z-10 mb-4 flex h-[66px] items-center justify-between rounded-lg border border-leaf-300/20 bg-field-950/70 px-5 shadow-glow backdrop-blur-xl">
      <div>
        <div className="small-label">Digital Twin Greenhouse Operation Platform</div>
        <h1 className="mt-1 text-[24px] font-black tracking-[0.12em] text-white">
          莓莓与共——草莓大棚数字孪生交互操作平台
        </h1>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <TopBadge icon={CloudSun} label="温室气候" value={`${temperature}°C`} />
        <TopBadge icon={Activity} label="在线设备" value="98.6%" />
        <TopBadge icon={RadioTower} label="通信链路" value="LoRa / 5G" />
        <TopBadge icon={Cpu} label="边缘网关" value="Edge-GW-A1" />
        <TopBadge icon={ShieldCheck} label="刷新时间" value={updatedAt} />
      </div>
    </header>
  );
}

type TopBadgeProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function TopBadge({ icon: Icon, label, value }: TopBadgeProps) {
  return (
    <div className="flex min-w-[118px] items-center gap-2 rounded border border-white/10 bg-white/[0.045] px-3 py-2">
      <Icon className="h-4 w-4 text-leaf-300" />
      <div>
        <div className="text-[10px] text-slate-500">{label}</div>
        <div className="font-semibold text-slate-100">{value}</div>
      </div>
    </div>
  );
}
