/**
 * RoadmapTaskCard — NourStep theme, full data display
 */
import { useState } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp,
  Edit2, Trash2, Clock, User, Link2, AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import type { RoadmapTask } from './roadmap.types';
import { TRACKS, STATUS_CONFIG, TASK_TYPE_CONFIG, TAG_CONFIG } from './roadmap.types';

interface Props {
  task: RoadmapTask;
  allTasks: RoadmapTask[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

export default function RoadmapTaskCard({ task, allTasks, onToggleStatus, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const track      = TRACKS.find(t => t.id === task.track);
  const statusCfg  = STATUS_CONFIG[task.status];
  const typeCfg    = TASK_TYPE_CONFIG[task.taskType];
  const TypeIcon   = typeCfg.icon;

  const blockedByTasks = (task.blockedBy ?? [])
    .map(id => allTasks.find(t => t.id === id))
    .filter(Boolean) as RoadmapTask[];

  const parallelTasks = (task.parallel ?? [])
    .map(id => allTasks.find(t => t.id === id))
    .filter(Boolean) as RoadmapTask[];

  const isDone = task.status === 'done';

  return (
    <div
      className={`card-dark rounded-xl overflow-hidden transition-all duration-200 select-none ${
        task.status === 'blocked' ? 'ring-1 ring-error/30' : ''
      }`}
      style={{ borderLeft: `3px solid ${track?.color ?? '#1B4FD8'}` }}
    >
      {/* ── Collapsed / always-visible row ── */}
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Status toggle */}
        <button
          onClick={e => { e.stopPropagation(); onToggleStatus(task.id); }}
          className="mt-0.5 flex-shrink-0 text-muted hover:text-success transition-colors cursor-pointer"
          title={`Status: ${statusCfg.label} — click to cycle`}
        >
          {isDone
            ? <CheckCircle2 size={15} className="text-success" />
            : <Circle size={15} className={statusCfg.cls} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Task ID + type */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[9px] font-black uppercase tracking-widest ${typeCfg.cls}`}>
              {task.id}
            </span>
            <span className={`flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded border ${typeCfg.badge}`}>
              <TypeIcon size={8} />{typeCfg.label}
            </span>
          </div>

          {/* Title */}
          <p className={`text-xs font-semibold leading-snug ${
            isDone ? 'line-through text-muted/60' : 'text-heading'
          }`}>
            {task.title}
          </p>

          {/* Status + estimate row */}
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${statusCfg.badge}`}>
              {statusCfg.label}
            </span>
            {task.estimate && task.estimate !== '—' && (
              <span className="flex items-center gap-0.5 text-[9px] text-muted">
                <Clock size={9} />{task.estimate}
              </span>
            )}
            {(task.blockedBy ?? []).length > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] text-error/70">
                <AlertTriangle size={9} />{task.blockedBy!.length}
              </span>
            )}
          </div>

          {/* Tags — always visible */}
          {(task.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {task.tags!.map(tag => (
                <span key={tag}
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${TAG_CONFIG[tag]?.cls ?? 'bg-surface text-muted border-border/40'}`}>
                  {TAG_CONFIG[tag]?.label ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <span className="flex-shrink-0 text-muted/30 mt-1">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div
          className="border-t border-border/30 px-3 py-2.5 space-y-2.5"
          onClick={e => e.stopPropagation()}
        >
          {/* Description */}
          {task.desc && (
            <p className="text-muted text-[11px] leading-relaxed">{task.desc}</p>
          )}

          {/* Assignee + estimate */}
          <div className="flex flex-wrap gap-3 text-[10px] text-muted">
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User size={10} className="flex-shrink-0" />{task.assignee}
              </span>
            )}
            {task.estimate && task.estimate !== '—' && (
              <span className="flex items-center gap-1">
                <Clock size={10} className="flex-shrink-0" />Est: {task.estimate}
              </span>
            )}
          </div>

          {/* Blocked by */}
          {blockedByTasks.length > 0 && (
            <div>
              <p className="text-[9px] font-black text-error/70 uppercase tracking-widest mb-1 flex items-center gap-1">
                <AlertTriangle size={9} /> Blocked by
              </p>
              <div className="flex flex-wrap gap-1">
                {blockedByTasks.map(d => {
                  const dTrack = TRACKS.find(t => t.id === d.track);
                  return (
                    <span key={d.id}
                      className="flex items-center gap-1 text-[9px] bg-error/8 border border-error/20 text-error/80 px-1.5 py-0.5 rounded-md"
                      style={{ borderLeftColor: dTrack?.color, borderLeftWidth: 2 }}>
                      <span className="font-black">{d.id}</span>
                      <span className="text-muted/70 truncate max-w-[80px]">{d.title}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Parallel tasks */}
          {parallelTasks.length > 0 && (
            <div>
              <p className="text-[9px] font-black text-royal/70 dark:text-bright/70 uppercase tracking-widest mb-1 flex items-center gap-1">
                <ArrowRight size={9} /> Runs in parallel
              </p>
              <div className="flex flex-wrap gap-1">
                {parallelTasks.map(d => {
                  const dTrack = TRACKS.find(t => t.id === d.track);
                  return (
                    <span key={d.id}
                      className="flex items-center gap-1 text-[9px] bg-royal/8 dark:bg-bright/8 border border-royal/20 dark:border-bright/20 text-royal/80 dark:text-bright/80 px-1.5 py-0.5 rounded-md"
                      style={{ borderLeftColor: dTrack?.color, borderLeftWidth: 2 }}>
                      <span className="font-black">{d.id}</span>
                      <span className="text-muted/70 truncate max-w-[80px]">{d.title}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer: linked IDs pill + actions */}
          <div className="flex items-center justify-between pt-1 border-t border-border/20">
            <div className="flex items-center gap-1 text-[9px] text-muted/50">
              <Link2 size={9} />
              <span>{task.id}</span>
              {task.taskNumber && <span>· #{task.taskNumber}</span>}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onEdit(task)}
                className="flex items-center gap-1 text-[10px] font-semibold text-royal dark:text-bright border border-royal/20 dark:border-bright/20 bg-royal/5 dark:bg-bright/5 hover:bg-royal/10 dark:hover:bg-bright/10 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
              >
                <Edit2 size={9} /> Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-1 text-[10px] font-semibold text-error/70 border border-error/20 bg-error/5 hover:bg-error/10 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
              >
                <Trash2 size={9} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
