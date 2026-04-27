import { Bot, BrainCircuit, Leaf, TriangleAlert, Zap } from 'lucide-react';
import { alarms } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { cx } from '../../utils/format';

export function AIAdvicePanel() {
  const env = useAppStore((state) => state.liveEnvironment);
  const rows = useAppStore((state) => state.liveRows);
  const devices = useAppStore((state) => state.liveDevices);
  const energy = useAppStore((state) => state.liveEnergySummary);
  const resolvedAlarms = useAppStore((state) => state.resolvedAlarms);
  const abnormalRows = rows.filter((row) => row.abnormal);
  const activeAlarms = alarms.filter((alarm) => !alarm.handled && !resolvedAlarms[alarm.id]);
  const runningDevices = devices.filter((device) => device.enabled);
  const advice = [
    {
      title: '冠层湿度控制',
      level: env.airHumidity > 76 ? '优先' : '观察',
      icon: Leaf,
      body:
        env.airHumidity > 76
          ? '空气湿度接近上限，建议保持除湿器自动模式，并提高循环风机 10% 输出。'
          : '空气湿度处于可控区间，可维持当前通风策略。'
    },
    {
      title: '分排种植策略',
      level: abnormalRows.length ? '处理' : '稳定',
      icon: BrainCircuit,
      body:
        abnormalRows.length > 0
          ? `${abnormalRows.map((row) => row.code).join('、')} 存在轻微偏离，建议优先复核滴灌支路与局部传感器。`
          : '各草莓排生长状态稳定，后续重点观察成熟采摘窗口。'
    },
    {
      title: '设备联动策略',
      level: runningDevices.length ? '运行' : '待命',
      icon: Zap,
      body:
        runningDevices.length > 0
          ? `${runningDevices.length} 台设备正在运行，建议自动模式下保留阈值联动，避免频繁手动干预。`
          : '当前无高负荷设备运行，可进入低功耗巡航策略。'
    },
    {
      title: '告警处置顺序',
      level: activeAlarms.length ? '风险' : '清洁',
      icon: TriangleAlert,
      body:
        activeAlarms.length > 0
          ? `当前仍有 ${activeAlarms.length} 条告警，建议按“严重 > 一般 > 普通”的顺序处理。`
          : '告警已处于清洁状态，可继续观察热力图和能耗趋势。'
    }
  ];

  return (
    <section className="rounded-md border border-leaf-300/20 bg-leaf-400/10 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Bot className="h-4 w-4 text-leaf-300" />
          AI 建议面板
        </div>
        <span className="rounded border border-leaf-300/25 bg-field-950/60 px-2 py-1 text-[11px] text-leaf-300">
          mock inference
        </span>
      </div>
      <div className="space-y-2">
        {advice.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Icon className="h-4 w-4 text-leaf-300" />
                  {item.title}
                </div>
                <span
                  className={cx(
                    'rounded border px-2 py-0.5 text-[10px]',
                    item.level === '优先' || item.level === '处理' || item.level === '风险'
                      ? 'border-pollen-400/30 bg-pollen-400/10 text-pollen-400'
                      : 'border-leaf-300/25 bg-leaf-400/10 text-leaf-300'
                  )}
                >
                  {item.level}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.body}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded border border-white/10 bg-field-950/55 p-2 text-[11px] leading-5 text-slate-500">
        能源侧建议：当前实时功率 {energy.realTimePower} kW，电池 SOC {energy.batterySoc}%。
        可在光伏输出高峰前后调整补光与除湿策略。
      </div>
    </section>
  );
}
