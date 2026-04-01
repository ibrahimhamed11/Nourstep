/**
 * RoadmapTableView — NourStep theme
 */
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACKS, WEEKS } from './roadmap.types';

const STATUS_CFG = {
  done:          { label: 'Done',        cls: 'bg-success/15 text-success border-success/25' },
  'in-progress': { label: 'In Progress', cls: 'bg-royal/15 text-royal dark:bg-bright/15 dark:text-bright border-royal/25 dark:border-bright/20' },
  todo:          { label: 'To Do',       cls: 'bg-surface dark:bg-darkblue text-muted border-border/40' },
  blocked:       { label: 'Blocked',     cls: 'bg-error/15 text-error border-error/25' },
} as const;

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

export default function RoadmapTableView({ tasks, activeTrack, onToggleStatus, onEdit, onDelete }: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);

  return (
    <div className="card-dark rounded-2xl overflow-hidden">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-surface dark:bg-darkblue border-b border-border/30">
            {['Status', 'Task', 'Track', 'Week', 'Assignee', 'Estimate', 'Actions'].map(h => (
              <th key={h} className="text-left text-[9px] font-black text-muted uppercase tracking-widest px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted/50 py-12 text-xs">
                No tasks found
              </td>
            </tr>
          ) : (
            filtered.map((task, i) => {
              const track = TRACKS.find(t => t.id === task.track);
              const week  = WEEKS.find(w => w.week === task.week);
              const sc    = STATUS_CFG[task.status];

              return (
                <tr key={task.id}
                  className={`border-b border-border/20 hover:bg-surface/50 dark:hover:bg-darkblue/40 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/20 dark:bg-darkblue/20'
                  }`}>

                  {/* Status toggle */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button onClick={() => onToggleStatus(task.id)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-md border cursor-pointer transition-colors ${sc.cls}`}>
                      {sc.label}
                    </button>
                  </td>

                  {/* Title + desc */}
                  <td className="px-4 py-2.5 max-w-[200px]">
                    <p className={`font-semibold leading-snug truncate ${
                      task.status === 'done' ? 'line-through text-muted/50' : 'text-heading'
                    }`}>{task.title}</p>
                    {task.desc && (
                      <p className="text-muted text-[10px] truncate mt-0.5">{task.desc}</p>
                    )}
                  </td>

                  {/* Track */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: track?.color }} />
                      <span className="text-muted text-[10px]">{track?.name ?? task.track}</span>
                    </span>
                  </td>

                  {/* Week */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-muted text-[10px]">{week?.label ?? `W${task.week}`}</span>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-muted text-[10px]">{task.assignee ?? '—'}</span>
                  </td>

                  {/* Estimate */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-muted text-[10px]">{task.estimate ?? '—'}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      <button onClick={() => onEdit(task)}
                        className="text-[9px] font-bold text-royal dark:text-bright border border-royal/20 dark:border-bright/20 bg-royal/5 dark:bg-bright/5 hover:bg-royal/10 dark:hover:bg-bright/10 rounded-md px-2 py-0.5 cursor-pointer transition-colors">
                        Edit
                      </button>
                      <button onClick={() => onDelete(task.id)}
                        className="text-[9px] font-bold text-error/70 border border-error/20 bg-error/5 hover:bg-error/10 rounded-md px-2 py-0.5 cursor-pointer transition-colors">
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
