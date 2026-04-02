/**
 * RoadmapBottomSummary — Azure DevOps-style analytics panel
 */
import { Target, AlertCircle, TrendingUp, CheckCircle2, Clock, Ban } from 'lucide-react';
import type { RoadmapTask } from './roadmap.types';
import { TRACKS } from './roadmap.types';

interface Props { tasks: RoadmapTask[] }

export default function RoadmapBottomSummary({ tasks }: Props) {
  const done    = tasks.filter(t => t.status === 'done');
  const blocked = tasks.filter(t => t.status === 'blocked');
  const inProg  = tasks.filter(t => t.status === 'in-progress');
  const todo    = tasks.filter(t => t.status === 'todo');

  const trackBreakdown = TRACKS.map(tr => ({
    track: tr,
    tasks: tasks.filter(t => t.track === tr.id),
    done:  tasks.filter(t => t.track === tr.id && t.status === 'done'),
    inProg: tasks.filter(t => t.track === tr.id && t.status === 'in-progress'),
    blocked: tasks.filter(t => t.track === tr.id && t.status === 'blocked'),
  })).filter(x => x.tasks.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">

      {/* Panel 1 — Progress by track */}
      <div
        className="rounded-lg border border-border/40 bg-[var(--theme-card)] overflow-hidden"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-surface/30 dark:bg-darkblue/30">
          <TrendingUp size={13} className="text-[#0078d4] dark:text-[#2899f5]" />
          <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">Progress by Track</span>
        </div>
        <div className="p-4 space-y-3">
          {trackBreakdown.map(({ track, tasks: tt, done: dd }) => {
            const pct = tt.length ? Math.round((dd.length / tt.length) * 100) : 0;
            return (
              <div key={track.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted/80">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: track.color }} />
                    {track.name}
                  </span>
                  <span className="text-[10px] text-muted/60 font-medium">{dd.length}/{tt.length} · {pct}%</span>
                </div>
                <div className="h-1.5 bg-border/15 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: track.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 2 — Work item summary */}
      <div
        className="rounded-lg border border-border/40 bg-[var(--theme-card)] overflow-hidden"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-surface/30 dark:bg-darkblue/30">
          <Target size={13} className="text-[#0078d4] dark:text-[#2899f5]" />
          <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">Work Items Summary</span>
        </div>
        <div className="p-4">
          <div className="space-y-0 divide-y divide-border/20">
            {[
              { label: 'Completed',   value: done.length,    icon: CheckCircle2, color: '#22C97A' },
              { label: 'In Progress', value: inProg.length,  icon: Clock,        color: '#0078d4' },
              { label: 'To Do',       value: todo.length,    icon: Target,       color: '#9e9e9e' },
              { label: 'Blocked',     value: blocked.length, icon: Ban,          color: '#FF4D4D' },
              { label: 'Total Items', value: tasks.length,   icon: TrendingUp,   color: '#8B5CF6' },
            ].map(item => {
              const IIcon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2 text-[11px] text-muted/70">
                    <IIcon size={12} style={{ color: item.color }} />
                    {item.label}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel 3 — Blockers */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          borderColor: blocked.length > 0 ? 'rgba(255,77,77,0.3)' : 'rgba(34,201,122,0.3)',
          background: 'var(--theme-card)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{
            background: blocked.length > 0 ? 'rgba(255,77,77,0.06)' : 'rgba(34,201,122,0.06)',
            borderColor: blocked.length > 0 ? 'rgba(255,77,77,0.2)' : 'rgba(34,201,122,0.2)',
          }}
        >
          <AlertCircle size={13} style={{ color: blocked.length > 0 ? '#FF4D4D' : '#22C97A' }} />
          <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">
            Blockers {blocked.length > 0 ? `(${blocked.length})` : ''}
          </span>
        </div>
        <div className="p-4">
          {blocked.length === 0 ? (
            <div className="flex items-center gap-2 text-success/80 text-sm">
              <CheckCircle2 size={16} />
              <span className="font-medium">No blockers — all clear!</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {blocked.map(t => (
                <li key={t.id} className="flex items-start gap-2">
                  <span
                    className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#FF4D4D' }}
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono font-bold text-error/60 mr-1.5">{t.id}</span>
                    <span className="text-[11px] text-muted/80">{t.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
