/**
 * RoadmapWeekColumn — Azure DevOps Sprint Column (rich light-theme colors)
 */
import { Plus } from 'lucide-react';
import type { RoadmapTask, Track, Week } from './roadmap.types';
import { WEEKS, getStats } from './roadmap.types';
import RoadmapTaskCard from './RoadmapTaskCard';

interface Props {
  week: (typeof WEEKS)[number];
  tasks: RoadmapTask[];
  allTasks: RoadmapTask[];
  activeTrack: Track | 'all';
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
  onAddTask: (week: Week) => void;
}

function isCurrentWeek(week: (typeof WEEKS)[number]): boolean {
  return week.week === 1;
}

export default function RoadmapWeekColumn({
  week, tasks, allTasks, activeTrack, onToggleStatus, onEdit, onDelete, onAddTask,
}: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);
  const stats = getStats(filtered);
  const isCurrent = isCurrentWeek(week);

  const doneCount    = filtered.filter(t => t.status === 'done').length;
  const inProgCount  = filtered.filter(t => t.status === 'in-progress').length;
  const blockedCount = filtered.filter(t => t.status === 'blocked').length;

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden transition-all duration-150 ${
        isCurrent ? 'border-[1.5px] border-[#0078d4]' : 'border border-border/50'
      }`}
      style={{
        background: 'var(--theme-card)',
        boxShadow: isCurrent
          ? '0 0 0 3px rgba(0,120,212,0.10), 0 2px 8px rgba(0,120,212,0.10)'
          : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Column header ── */}
      <div
        className="px-3 py-2.5 flex items-center justify-between border-b border-border/40"
        style={{
          background: isCurrent ? 'rgba(0,120,212,0.08)' : 'var(--theme-surface)',
        }}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-bold"
              style={{ color: isCurrent ? '#0078d4' : 'var(--theme-heading)' }}
            >
              {week.label}
            </span>
            {isCurrent && (
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm"
                style={{ background: '#0078d4', color: '#fff', letterSpacing: '0.05em' }}
              >
                CURRENT
              </span>
            )}
          </div>
          <p className="text-[10px] mt-0.5 text-muted">{week.dates}</p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mini status indicators */}
          {filtered.length > 0 && (
            <div className="flex items-center gap-1 text-[9px] font-semibold">
              {doneCount > 0 && (
                <span style={{ color: '#16a34a' }}>✓{doneCount}</span>
              )}
              {inProgCount > 0 && (
                <span style={{ color: '#0078d4' }}>▶{inProgCount}</span>
              )}
              {blockedCount > 0 && (
                <span style={{ color: '#dc2626' }}>⊘{blockedCount}</span>
              )}
            </div>
          )}

          {/* Done/total badge */}
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
            style={
              isCurrent
                ? { background: 'rgba(0,120,212,0.12)', color: '#0078d4' }
                : { background: 'var(--theme-surface)', color: 'var(--theme-muted)' }
            }
          >
            {stats.done}/{stats.total}
          </span>

          {/* Add task button */}
          <button
            onClick={() => onAddTask(week.week)}
            className="w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer"
            style={{ color: isCurrent ? '#0078d4' : '#94a3b8' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
              (e.currentTarget as HTMLButtonElement).style.color = '#0078d4';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = isCurrent ? '#0078d4' : '#94a3b8';
            }}
            title={`Add task to ${week.label}`}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-[3px]" style={{ background: 'var(--theme-border)' }}>
        <div
          className="h-[3px] transition-all duration-700"
          style={{
            width: `${stats.pct}%`,
            background: stats.pct === 100
              ? '#16a34a'
              : isCurrent
                ? 'linear-gradient(90deg, #0078d4, #2899f5)'
                : '#0078d4',
          }}
        />
      </div>

      {/* ── Tasks list ── */}
      <div className="p-2.5 space-y-1.5 flex-1 overflow-y-auto" style={{ minHeight: 120, maxHeight: 600 }}>
        {filtered.length === 0 ? (
          <button
            onClick={() => onAddTask(week.week)}
            className="w-full flex flex-col items-center justify-center py-8 gap-2 rounded cursor-pointer transition-all border-[1.5px] border-dashed border-border/40 hover:border-[#93c5fd] hover:bg-[rgba(0,120,212,0.04)]"
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center border-[1.5px] border-dashed border-border/40"
            >
              <Plus size={12} className="text-muted/40" />
            </span>
            <p className="text-[10px] text-muted/40">Add work item</p>
          </button>
        ) : (
          filtered.map(t => (
            <RoadmapTaskCard
              key={t.id}
              task={t}
              allTasks={allTasks}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
