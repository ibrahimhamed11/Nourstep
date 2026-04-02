/**
 * RoadmapTableView — Azure DevOps Backlog (rich light-theme colors)
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACKS, WEEKS, TAG_CONFIG, TASK_TYPE_CONFIG } from './roadmap.types';

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

const STATUS_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
  'todo':        { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1',  label: 'To Do'       },
  'in-progress': { color: '#0078d4', bg: '#eff6ff', border: '#93c5fd',  label: 'In Progress' },
  'done':        { color: '#16a34a', bg: '#f0fdf4', border: '#86efac',  label: 'Done'        },
  'blocked':     { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5',  label: 'Blocked'     },
};

function groupByWeek(tasks: RoadmapTask[]) {
  const map = new Map<number, RoadmapTask[]>();
  WEEKS.forEach(w => map.set(w.week, []));
  tasks.forEach(t => {
    const arr = map.get(t.week) ?? [];
    arr.push(t);
    map.set(t.week, arr);
  });
  return Array.from(map.entries())
    .map(([week, items]) => ({ week, items, weekMeta: WEEKS.find(w => w.week === week)! }))
    .filter(g => g.items.length > 0);
}

export default function RoadmapTableView({ tasks, activeTrack, onToggleStatus, onEdit, onDelete }: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);
  const groups = groupByWeek(filtered);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const toggleCollapse = (week: number) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(week) ? next.delete(week) : next.add(week);
      return next;
    });
  };

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg flex items-center justify-center py-20 text-center border border-border/40 bg-[var(--theme-card)]"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="space-y-2">
          <Plus size={24} className="mx-auto text-muted/30" />
          <p className="text-sm text-muted">No work items found</p>
          <p className="text-xs text-muted/50">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  const COLS = '28px minmax(220px,1.8fr) 110px 130px 120px 100px 90px 80px';
  const MIN_W = 960;

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)', background: 'var(--theme-card)' }}>

      {/* ── Horizontal scroll wrapper ── */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ minWidth: MIN_W }}>

      {/* ── Table header ── */}
      <div
        className="grid text-[10px] font-bold uppercase tracking-widest border-b border-border/40 text-muted"
        style={{
          gridTemplateColumns: COLS,
          background: 'var(--theme-surface)',
        }}
      >
        <div className="px-1 py-2.5" />
        <div className="px-3 py-2.5">Work Item</div>
        <div className="px-3 py-2.5">State</div>
        <div className="px-3 py-2.5">Track</div>
        <div className="px-3 py-2.5">Tags</div>
        <div className="px-3 py-2.5">Assignee</div>
        <div className="px-3 py-2.5">Estimate</div>
        <div className="px-3 py-2.5">Actions</div>
      </div>

      {/* ── Grouped rows ── */}
      {groups.map(group => {
        const isCollapsed = collapsed.has(group.week);
        const doneCount = group.items.filter(t => t.status === 'done').length;
        const inProgCount = group.items.filter(t => t.status === 'in-progress').length;
        const blockedCount = group.items.filter(t => t.status === 'blocked').length;
        const pct = group.items.length > 0 ? Math.round((doneCount / group.items.length) * 100) : 0;

        return (
          <div key={group.week}>
            {/* ── Sprint group header ── */}
            <div
              className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none transition-colors border-b border-border/30 hover:brightness-95"
              style={{ background: 'var(--theme-surface)', minWidth: MIN_W }}
              onClick={() => toggleCollapse(group.week)}
            >
              <span className="text-muted/60">
                {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </span>

              {/* Sprint label */}
              <span className="text-xs font-bold text-heading">
                {group.weekMeta.label}
              </span>
              <span className="text-[10px] text-muted/60">
                {group.weekMeta.dates}
              </span>

              {/* Status mini-counts */}
              <div className="flex items-center gap-2 text-[9px] font-semibold">
                {doneCount > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac' }}>
                    <CheckCircle2 size={8} /> {doneCount}
                  </span>
                )}
                {inProgCount > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: '#eff6ff', color: '#0078d4', border: '1px solid #93c5fd' }}>
                    <Clock size={8} /> {inProgCount}
                  </span>
                )}
                {blockedCount > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                    <XCircle size={8} /> {blockedCount}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="ml-auto flex items-center gap-2">
                <div className="w-28 h-1.5 rounded-full overflow-hidden bg-border/40">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: pct === 100 ? '#16a34a' : '#0078d4' }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-muted" style={{ minWidth: 40 }}>
                  {doneCount}/{group.items.length}
                </span>
              </div>
            </div>

            {/* ── Task rows ── */}
            {!isCollapsed && group.items.map((task, i) => {
              const track   = TRACKS.find(t => t.id === task.track);
              const typeCfg = TASK_TYPE_CONFIG[task.taskType];
              const TypeIcon = typeCfg.icon;
              const sm = STATUS_META[task.status] ?? STATUS_META['todo'];
              const trackColor = track?.color ?? '#0078d4';
              const isDone = task.status === 'done';

              return (
                <div
                  key={task.id}
                  className="grid border-b border-border/20 group/row transition-colors hover:bg-[rgba(0,120,212,0.04)]"
                  style={{
                    gridTemplateColumns: COLS,
                    background: i % 2 === 0 ? 'var(--theme-card)' : 'var(--theme-surface)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,120,212,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'var(--theme-card)' : 'var(--theme-surface)')}
                >
                  {/* Track color bar */}
                  <div className="flex items-stretch">
                    <div className="w-[3px] self-stretch rounded-none" style={{ background: trackColor }} />
                  </div>

                  {/* Work item title */}
                  <div className="px-3 py-2.5 flex items-start gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span
                          className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-sm"
                          style={{ background: `${trackColor}18`, color: trackColor, border: `1px solid ${trackColor}35` }}
                        >
                          <TypeIcon size={7} /> {typeCfg.label}
                        </span>
                        <span className="text-[9px] font-mono text-muted/60">{task.id}</span>
                      </div>
                      <p
                        className="text-xs font-medium truncate"
                        style={{
                          color: isDone ? 'var(--theme-muted)' : 'var(--theme-heading)',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </p>
                      {task.desc && (
                        <p className="text-[10px] truncate mt-0.5 text-muted/60">
                          {task.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className="px-3 py-2.5 flex items-center">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-all hover:opacity-80"
                      style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}
                    >
                      {sm.label}
                    </button>
                  </div>

                  {/* Track */}
                  <div className="px-3 py-2.5 flex items-center">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: trackColor }} />
                      {track?.name ?? task.track}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="px-3 py-2.5 flex items-center flex-wrap gap-1">
                    {(task.tags ?? []).slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] font-medium px-1.5 py-0.5 rounded-sm border border-border/40 text-muted"
                        style={{ background: 'var(--theme-surface)' }}>
                        {TAG_CONFIG[tag]?.label ?? tag}
                      </span>
                    ))}
                    {(task.tags ?? []).length > 2 && (
                      <span className="text-[8px] text-muted/50">+{task.tags!.length - 2}</span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="px-3 py-2.5 flex items-center">
                    <span className={`text-[10px] ${task.assignee ? 'text-muted' : 'text-muted/30'}`}>
                      {task.assignee ?? '—'}
                    </span>
                  </div>

                  {/* Estimate */}
                  <div className="px-3 py-2.5 flex items-center">
                    {task.estimate ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/40 text-muted"
                        style={{ background: 'var(--theme-surface)' }}>
                        <Clock size={8} className="text-muted/50" />
                        {task.estimate}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted/30">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-2 py-2.5 flex items-center gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-[9px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors"
                      style={{ background: 'rgba(0,120,212,0.1)', color: '#0078d4', border: '1px solid rgba(0,120,212,0.25)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.18)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.1)'; }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-[9px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.15)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)'; }}
                    >
                      Del
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      </div>{/* end min-width inner */}
      </div>{/* end overflow-x-auto */}
    </div>
  );
}
