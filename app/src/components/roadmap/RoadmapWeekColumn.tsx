/**
 * RoadmapWeekColumn — A single week column in the Board view
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
  const isCurrentWeek = week.week === 1; // April 1–7 = current week (today = Apr 1, 2026)

  return (
    <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isCurrentWeek ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${isCurrentWeek ? 'bg-blue-600' : 'bg-gray-50 border-b border-gray-100'}`}>
        <div>
          <div className={`font-bold text-sm ${isCurrentWeek ? 'text-white' : 'text-gray-800'}`}>{week.label}</div>
          <div className={`text-[10px] ${isCurrentWeek ? 'text-blue-200' : 'text-gray-400'}`}>{week.dates}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onAddTask(week.week)}
            className={`p-1 rounded-lg transition-all cursor-pointer hover:scale-110 ${isCurrentWeek ? 'text-blue-200 hover:text-white' : 'text-gray-300 hover:text-gray-500'}`}
            title="Add task to this week">
            <Plus size={14} />
          </button>
          <div className="text-right">
            {isCurrentWeek && <div className="text-[9px] font-bold text-blue-200 mb-0.5">NOW</div>}
            <div className={`text-xs font-bold ${isCurrentWeek ? 'text-white' : 'text-gray-600'}`}>{stats.done}/{stats.total}</div>
            <div className={`text-[9px] ${isCurrentWeek ? 'text-blue-200' : 'text-gray-400'}`}>{stats.pct}% done</div>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-emerald-400 transition-all" style={{ width: `${stats.pct}%` }} />
      </div>
      {/* Tasks */}
      <div className="p-3 space-y-2 min-h-[80px]">
        {filtered.length === 0 ? (
          <p className="text-gray-300 text-[10px] text-center py-4">No tasks for this track</p>
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
