import { BellRing, CheckCircle2, Filter, TriangleAlert } from 'lucide-react';
import { alarms } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { AlarmLevel } from '../../types';
import { cx } from '../../utils/format';

const levelClass: Record<AlarmLevel, string> = {
  普通: 'border-skytech-400/25 bg-skytech-400/10 text-skytech-400',
  一般: 'border-pollen-400/25 bg-pollen-400/10 text-pollen-400',
  严重: 'border-berry-400/35 bg-berry-500/10 text-berry-400',
  紧急: 'border-red-400/40 bg-red-500/15 text-red-300'
};

export function AlarmCenterPanel() {
  const resolvedAlarms = useAppStore((state) => state.resolvedAlarms);
  const resolveAlarm = useAppStore((state) => state.resolveAlarm);
  const selectTarget = useAppStore((state) => state.selectTarget);
  const activeAlarms = alarms.filter((alarm) => !alarm.handled && !resolvedAlarms[alarm.id]);
  const handledAlarms = alarms.length - activeAlarms.length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <AlarmKpi label="待处理" value={activeAlarms.length} tone={activeAlarms.length ? 'bad' : 'ok'} />
        <AlarmKpi label="已处理" value={handledAlarms} />
        <AlarmKpi label="紧急/严重" value={activeAlarms.filter((alarm) => alarm.level === '紧急' || alarm.level === '严重').length} tone="warn" />
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Filter className="h-4 w-4 text-leaf-300" />
            告警列表
          </div>
          <span className="text-[11px] text-slate-500">按等级与发生时间展示</span>
        </div>
        <div className="space-y-2">
          {alarms.map((alarm) => {
            const handled = alarm.handled || resolvedAlarms[alarm.id];

            return (
              <section
                key={alarm.id}
                className={cx(
                  'rounded-md border p-3 transition',
                  handled ? 'border-white/10 bg-white/[0.025] opacity-70' : 'border-berry-400/20 bg-berry-500/5'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="min-w-0 text-left"
                    onClick={() =>
                      alarm.targetId && alarm.targetCategory
                        ? selectTarget({ category: alarm.targetCategory, id: alarm.targetId })
                        : selectTarget({ category: 'alarm', id: alarm.id })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className={cx('rounded border px-2 py-0.5 text-[10px]', levelClass[alarm.level])}>
                        {alarm.level}
                      </span>
                      <span className="truncate text-sm font-semibold text-white">{alarm.type}</span>
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-400">
                      {alarm.target} · {alarm.location}
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <span>当前值 {alarm.currentValue}</span>
                      <span>阈值 {alarm.threshold}</span>
                      <span className="col-span-2">发生时间 {alarm.occurredAt}</span>
                    </div>
                  </button>

                  <button
                    className="flex shrink-0 items-center gap-1 rounded border border-leaf-300/25 bg-leaf-400/10 px-2 py-1 text-xs text-leaf-300 disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-slate-500"
                    disabled={handled}
                    onClick={() => resolveAlarm(alarm.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {handled ? '已处理' : '处理'}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-pollen-400/20 bg-pollen-400/10 p-3 text-xs leading-5 text-slate-300">
        <div className="mb-1 flex items-center gap-2 font-semibold text-pollen-400">
          <TriangleAlert className="h-4 w-4" />
          处理策略建议
        </div>
        严重告警优先联动设备控制，普通/一般告警建议在 30 分钟内完成复核，所有处理动作已预留后端事件接口。
      </div>
    </div>
  );
}

function AlarmKpi({
  label,
  value,
  tone = 'ok'
}: {
  label: string;
  value: number;
  tone?: 'ok' | 'warn' | 'bad';
}) {
  const toneClass = {
    ok: 'border-leaf-300/20 bg-leaf-400/10 text-leaf-300',
    warn: 'border-pollen-400/25 bg-pollen-400/10 text-pollen-400',
    bad: 'border-berry-400/35 bg-berry-500/10 text-berry-400'
  }[tone];

  return (
    <div className={cx('rounded-md border p-2.5', toneClass)}>
      <div className="flex items-center gap-1 text-[11px]">
        <BellRing className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-lg font-black text-white">{value}</div>
    </div>
  );
}
