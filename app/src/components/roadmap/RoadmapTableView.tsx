/**
 * RoadmapTableView — Table view of all tasks
 */
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACK_CONFIG, STATUS_CONFIG, TASK_TYPE_CONFIG, TAG_CONFIG, WEEKS, taskDisplayId } from './roadmap.types';

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
}

export default function RoadmapTableView({ tasks, activeTrack }: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">ID</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Track</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Week</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignee</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimate</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tags</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parallel?</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blocked By</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => {
              const track = TRACK_CONFIG[task.track];
              const status = STATUS_CONFIG[task.status];
              const tc = TASK_TYPE_CONFIG[task.taskType];
              const StatusIcon = status.icon;
              const TrackIcon = track.icon;
              const TypeIcon = tc.icon;
              const displayId = taskDisplayId(task);
              return (
                <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border font-mono ${tc.badge}`}>
                      <TypeIcon size={8} className="inline -mt-px" /> {displayId}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-gray-800 font-semibold text-xs">{task.title}</div>
                    <div className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{task.desc}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${track.bg} ${track.border} border w-fit`}>
                      <TrackIcon size={11} style={{ color: track.color }} />
                      <span className="text-[10px] font-bold" style={{ color: track.color }}>{track.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-gray-600">W{task.week}</span>
                    <div className="text-[9px] text-gray-400">{WEEKS.find(w => w.week === task.week)?.dates}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-violet-500 font-medium">{task.assignee}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{task.estimate}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${status.badge} w-fit`}>
                      <StatusIcon size={10} />
                      <span className="text-[10px] font-bold">{status.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(task.tags ?? []).map(tag => (
                        <span key={tag} className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${TAG_CONFIG[tag]?.cls ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {TAG_CONFIG[tag]?.label ?? tag}
                        </span>
                      ))}
                      {(!task.tags || task.tags.length === 0) && <span className="text-[9px] text-gray-200">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {task.parallel && task.parallel.length > 0
                      ? <span className="text-[10px] font-bold text-purple-500">{task.parallel.length} task{task.parallel.length > 1 ? 's' : ''}</span>
                      : <span className="text-[9px] text-gray-200">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {task.blockedBy && task.blockedBy.length > 0
                      ? <span className="text-[10px] font-bold text-amber-500">{task.blockedBy.length} dep{task.blockedBy.length > 1 ? 's' : ''}</span>
                      : <span className="text-[9px] text-gray-200">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
