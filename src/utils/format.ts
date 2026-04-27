import type { StatusLevel } from '../types';

export const statusText: Record<StatusLevel, string> = {
  normal: '正常',
  warning: '预警',
  critical: '严重',
  offline: '离线'
};

export const statusClass: Record<StatusLevel, string> = {
  normal: 'text-leaf-300 bg-leaf-500/10 border-leaf-400/30',
  warning: 'text-pollen-400 bg-pollen-400/10 border-pollen-400/30',
  critical: 'text-berry-400 bg-berry-500/10 border-berry-400/40',
  offline: 'text-slate-300 bg-slate-500/10 border-slate-400/20'
};

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
