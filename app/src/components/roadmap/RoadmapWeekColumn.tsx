/**
 * RoadmapWeekColumn — Board week column (NourStep theme)
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

export default function RoadmapWeekColumn({
  week, tasks, allTasks, activeTrack, onToggleStatus, onEdit, onDelete, onAddTask,
}: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);
  const stats = getStats(filtered);
  const isCurrent = week.week === 1;

  return (
    <div className={`card-dark rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
      isCurrent ? 'ring-2 ring-royal/40 dark:ring-bright/30 shadow-lg shadow-royal/10' : ''
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-border/30 ${
        isCurrent
          ? 'bg-gradient-to-r from-royal/15 to-bright/10 dark:from-royal/20 dark:to-bright/10'
          : 'bg-surface/50 dark:bg-darkblue/40'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${isCurrent ? 'text-royal dark:text-bright' : 'text-heading'}`}>
              {week.label}
            </span>
            {isCurrent && (
              <span className="text-[9px] font-black bg-royal/15 text-royal dark:bg-bright/15 dark:text-bright border border-royal/25 dark:border-bright/25 px-1.5 py-0.5 rounded-md tracking-widest">
                NOW
              </span>
            )}
          </div>
          <p className="text-muted text-[10px] mt-0.5">{week.dates}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTask(week.week)}
            className="p-1.5 rounded-lg text-muted hover:text-royal dark:hover:text-bright hover:bg-royal/8 transition-all cursor-pointer"
            title="Add task to this week">
            <Plus size={13} />
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-heading">{stats.done}/{stats.total}</p>
            <p className="text-[9px] text-muted">{stats.pct}%</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface dark:bg-navy">
        <div
          className={`h-0.5 transition-all duration-700 ${isCurrent ? 'bg-gradient-to-r from-royal to-bright' : 'bg-success/60'}`}
          style={{ width: `${stats.pct}%` }}
        />
      </div>

      {/* Tasks */}
      <div className="p-3 space-y-2 flex-1 min-h-[80px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-surface dark:bg-darkblue border border-border/30 flex items-center justify-center">
              <Plus size={13} className="text-muted/40" />
            </div>
            <p className="text-muted/40 text-[10px]">No tasks</p>
          </div>
        ) : (
          filtered.map(t => (
            <RoadmapTaskCard key={t.id} task={t} allTasks={allTasks}
              onToggleStatus={onToggleStatus} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
