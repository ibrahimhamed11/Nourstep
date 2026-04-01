/**
 * RoadmapTaskCard — NourStep theme
 */
import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Edit2, Trash2, Clock, User, Tag } from 'lucide-react';
import type { RoadmapTask } from './roadmap.types';
import { TRACKS, STATUS_CONFIG } from './roadmap.types';

interface Props {
  task: RoadmapTask;
  allTasks: RoadmapTask[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

export default function RoadmapTaskCard({ task, allTasks, onToggleStatus, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const track = TRACKS.find(t => t.id === task.track);
  const statusCfg = STATUS_CONFIG[task.status];
  const blockedByTasks = (task.blockedBy ?? []).map(id => allTasks.find(t => t.id === id)).filter(Boolean);

  return (
    <div
      className="card-dark rounded-xl overflow-hidden transition-all duration-200 cursor-pointer select-none"
      style={{ borderLeft: `3px solid ${track?.color ?? '#1B4FD8'}` }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Main row */}
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        <button
          onClick={e => { e.stopPropagation(); onToggleStatus(task.id); }}
          className="mt-0.5 flex-shrink-0 text-muted hover:text-success transition-colors cursor-pointer"
        >
          {task.status === 'done'
            ? <CheckCircle2 size={15} className="text-success" />
            : <Circle size={15} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold leading-snug ${
            task.status === 'done' ? 'line-through text-muted/60' : 'text-heading'
          }`}>
            {task.title}
          </p>

          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${statusCfg.badge}`}>
              {statusCfg.label}
            </span>
            {task.estimate && (
              <span className="flex items-center gap-0.5 text-[9px] text-muted">
                <Clock size={9} />{task.estimate}
              </span>
            )}
          </div>
        </div>

        <span className="flex-shrink-0 text-muted/40">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="border-t border-border/30 px-3 py-2.5 space-y-2"
          onClick={e => e.stopPropagation()}
        >
          {task.desc && (
            <p className="text-muted text-[11px] leading-relaxed">{task.desc}</p>
          )}

          <div className="flex flex-wrap gap-3 text-[10px] text-muted">
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User size={10} />{task.assignee}
              </span>
            )}
            {(task.tags ?? []).length > 0 && (
              <span className="flex items-center gap-1">
                <Tag size={10} />{task.tags!.join(', ')}
              </span>
            )}
          </div>

          {blockedByTasks.length > 0 && (
            <div>
              <p className="text-[9px] text-muted/60 uppercase tracking-widest mb-1">Blocked by</p>
              <div className="flex flex-wrap gap-1">
                {blockedByTasks.map(d => (
                  <span key={d!.id}
                    className="text-[9px] bg-surface dark:bg-darkblue border border-border/40 text-muted px-1.5 py-0.5 rounded-md">
                    {d!.title.length > 24 ? d!.title.slice(0, 24) + '…' : d!.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1 text-[10px] font-semibold text-royal dark:text-bright border border-royal/20 dark:border-bright/20 bg-royal/5 dark:bg-bright/5 hover:bg-royal/10 dark:hover:bg-bright/10 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
            >
              <Edit2 size={10} /> Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-1 text-[10px] font-semibold text-error/70 border border-error/20 bg-error/5 hover:bg-error/10 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
            >
              <Trash2 size={10} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
