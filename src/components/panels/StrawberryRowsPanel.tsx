import { useMemo, useState, type ReactNode } from 'react';
import { Bot, ChevronRight, Sprout } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cx, statusClass } from '../../utils/format';
import { TrendChart } from '../charts/TrendChart';

export function StrawberryRowsPanel() {
  const rows = useAppStore((state) => state.liveRows);
  const selectTarget = useAppStore((state) => state.selectTarget);
  const [activeRowId, setActiveRowId] = useState(rows[0]?.id ?? '');
  const activeRow = useMemo(
    () => rows.find((row) => row.id === activeRowId) ?? rows[0],
    [activeRowId, rows]
  );
  const averageHealth = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.healthScore, 0) / rows.length)
    : 0;
  const abnormalCount = rows.filter((row) => row.abnormal).length;

  if (!activeRow) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <SummaryCard label="分排数量" value={rows.length} unit="排" />
        <SummaryCard label="平均健康" value={averageHealth} unit="分" />
        <SummaryCard label="异常排数" value={abnormalCount} unit="排" tone={abnormalCount ? 'warn' : 'ok'} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <button
            key={row.id}
            className={cx(
              'rounded-md border p-3 text-left transition',
              activeRow.id === row.id
                ? 'border-leaf-300/45 bg-leaf-400/12 shadow-glow'
                : 'border-white/10 bg-white/[0.035] hover:border-leaf-300/30'
            )}
            onClick={() => setActiveRowId(row.id)}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-white">{row.code}</span>
              <span className={cx('rounded border px-2 py-0.5 text-[10px]', row.abnormal ? statusClass.warning : statusClass.normal)}>
                {row.abnormal ? '异常' : '健康'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">{row.variety} · {row.growthStage}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={cx('h-full rounded-full', row.healthScore >= 85 ? 'bg-leaf-300' : 'bg-pollen-400')}
                style={{ width: `${row.healthScore}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      <section className="rounded-md border border-leaf-300/20 bg-field-950/60 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-white">
              <Sprout className="h-4 w-4 text-leaf-300" />
              {activeRow.code} 分排详情
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {activeRow.variety} · {activeRow.plantedAt} · {activeRow.plantCount} 株
            </div>
          </div>
          <button
            className="flex shrink-0 items-center gap-1 rounded border border-leaf-300/25 bg-leaf-400/10 px-2 py-1 text-xs text-leaf-300"
            onClick={() => selectTarget({ category: 'row', id: activeRow.id })}
          >
            对象详情
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Metric label="空气温度" value={activeRow.env.temperature} unit="°C" bounds={activeRow.bounds.temperature.join(' - ')} />
          <Metric label="空气湿度" value={activeRow.env.airHumidity} unit="%RH" bounds={activeRow.bounds.airHumidity.join(' - ')} />
          <Metric label="土壤湿度" value={activeRow.env.soilHumidity} unit="%" bounds={activeRow.bounds.soilHumidity.join(' - ')} />
          <Metric label="光照" value={(activeRow.env.light / 1000).toFixed(1)} unit="klux" bounds={`${activeRow.bounds.light[0] / 1000} - ${activeRow.bounds.light[1] / 1000}`} />
          <Metric label="CO₂" value={activeRow.env.co2} unit="ppm" bounds={activeRow.bounds.co2.join(' - ')} />
          <Metric label="健康评分" value={activeRow.healthScore} unit="分" bounds="0 - 100" />
        </div>
      </section>

      <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
        <div className="mb-2 text-sm font-semibold text-white">近 24 小时趋势</div>
        <TrendChart data={activeRow.trend} compact />
      </section>

      <AdviceBlock title="设备联动建议" items={activeRow.deviceAdvice} />
      <AdviceBlock
        title="AI 种植建议"
        items={activeRow.aiAdvice}
        icon={<Bot className="mt-1 h-3.5 w-3.5 shrink-0 text-leaf-300" />}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  tone = 'ok'
}: {
  label: string;
  value: number;
  unit: string;
  tone?: 'ok' | 'warn';
}) {
  return (
    <div className={cx('rounded-md border bg-white/[0.035] p-2.5', tone === 'ok' ? 'border-leaf-300/20' : 'border-pollen-400/35')}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-black text-white">{value}</span>
        <span className="text-[11px] text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  bounds
}: {
  label: string;
  value: number | string;
  unit: string;
  bounds: string;
}) {
  return (
    <div className="rounded border border-white/10 bg-white/[0.035] p-2.5">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-base font-black text-white">{value}</span>
        <span className="text-[10px] text-slate-500">{unit}</span>
      </div>
      <div className="mt-1 text-[10px] text-slate-600">阈值 {bounds}</div>
    </div>
  );
}

function AdviceBlock({
  title,
  items,
  icon
}: {
  title: string;
  items: string[];
  icon?: ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-2 text-sm font-semibold text-white">{title}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs leading-5 text-slate-400">
            {icon ?? <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-300" />}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
