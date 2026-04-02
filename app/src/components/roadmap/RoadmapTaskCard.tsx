/**
 * RoadmapTaskCard — Azure DevOps Work Item card (rich light-theme colors)
 */
import { useState } from 'react';
import {
  CheckCircle2, Circle, Clock, AlertTriangle, Edit2, Trash2,
  ChevronDown, ChevronUp, User, Copy, Check, ArrowRight,
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

const STATUS_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
  'todo':        { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1',  label: 'To Do'       },
  'in-progress': { color: '#0078d4', bg: '#eff6ff', border: '#93c5fd',  label: 'In Progress' },
  'done':        { color: '#16a34a', bg: '#f0fdf4', border: '#86efac',  label: 'Done'        },
  'blocked':     { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5',  label: 'Blocked'     },
};

export default function RoadmapTaskCard({ task, allTasks, onToggleStatus, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(task.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const track     = TRACKS.find(t => t.id === task.track);
  const statusCfg = STATUS_CONFIG[task.status];
  const typeCfg   = TASK_TYPE_CONFIG[task.taskType];
  const TypeIcon  = typeCfg.icon;
  const isDone    = task.status === 'done';
  const sm        = STATUS_META[task.status] ?? STATUS_META['todo'];
  const trackColor = task.status === 'blocked' ? '#dc2626' : (track?.color ?? '#0078d4');

  const blockedByTasks = (task.blockedBy ?? [])
    .map(id => allTasks.find(t => t.id === id))
    .filter(Boolean) as RoadmapTask[];

  const parallelTasks = (task.parallel ?? [])
    .map(id => allTasks.find(t => t.id === id))
    .filter(Boolean) as RoadmapTask[];

  return (
    <div
      className="group rounded overflow-hidden transition-all duration-150 hover:shadow-md"
      style={{
        background: 'var(--theme-card)',
        border: '1px solid var(--theme-border)',
        borderLeftColor: trackColor,
        borderLeftWidth: '3px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}
    >
      {/* Main row */}
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Status toggle button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleStatus(task.id); }}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 cursor-pointer"
          title={`${statusCfg.label} — click to cycle`}
        >
          {isDone
            ? <CheckCircle2 size={15} style={{ color: sm.color }} />
            : <Circle size={15} style={{ color: sm.color }} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Type badge + ID */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
              style={{
                background: `${trackColor}18`,
                color: trackColor,
                border: `1px solid ${trackColor}35`,
              }}
            >
              <TypeIcon size={8} /> {typeCfg.label}
            </span>
            <button
              onClick={e => { e.stopPropagation(); copyId(); }}
              className="flex items-center gap-0.5 text-[9px] font-mono font-semibold transition-colors cursor-pointer"
              style={{ color: copied ? '#16a34a' : '#94a3b8' }}
              title="Copy ID"
            >
              {copied ? <Check size={8} /> : <Copy size={8} />}
              {task.id}
            </button>
          </div>

          {/* Title */}
          <p
            className="text-xs font-medium leading-snug"
            style={{
              color: isDone ? '#94a3b8' : 'var(--theme-heading)',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </p>

          {/* Status pill + estimate + blockers */}
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <span
              className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}
            >
              {sm.label}
            </span>
            {task.estimate && task.estimate !== '—' && (
              <span className="flex items-center gap-1 text-[9px]" style={{ color: '#94a3b8' }}>
                <Clock size={9} /> {task.estimate}
              </span>
            )}
            {(task.blockedBy ?? []).length > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] font-medium" style={{ color: '#dc2626' }}>
                <AlertTriangle size={9} /> {task.blockedBy!.length} blocker
              </span>
            )}
          </div>

          {/* Tags */}
          {(task.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {task.tags!.map(tag => (
                <span
                  key={tag}
                  className="text-[8px] font-medium px-1.5 py-0.5 rounded-sm border border-border/40 text-muted"
                  style={{ background: 'var(--theme-surface)' }}
                >
                  {TAG_CONFIG[tag]?.label ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover action buttons */}
        <div
          className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(task)}
            className="w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer text-muted hover:text-[#0078d4] hover:bg-[rgba(0,120,212,0.1)]"
            title="Edit"
          >
            <Edit2 size={11} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer text-muted hover:text-[#dc2626] hover:bg-[rgba(220,38,38,0.08)]"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>

        <span className="flex-shrink-0 mt-1 text-muted/40">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </span>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div
          className="border-t border-border/40 px-3 py-3 space-y-3"
          style={{ background: 'var(--theme-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {task.desc && (
            <p className="text-[11px] leading-relaxed text-muted">
              {task.desc}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-[10px] text-muted">
            {task.assignee && (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,120,212,0.1)' }}>
                  <User size={9} style={{ color: '#0078d4' }} />
                </span>
                {task.assignee}
              </span>
            )}
            {task.estimate && task.estimate !== '—' && (
              <span className="flex items-center gap-1">
                <Clock size={9} /> Estimate: {task.estimate}
              </span>
            )}
          </div>

          {blockedByTasks.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                <AlertTriangle size={9} /> Blocked by
              </p>
              <div className="flex flex-wrap gap-1">
                {blockedByTasks.map(d => (
                  <span key={d.id} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-sm"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                    <span className="font-bold font-mono">{d.id}</span>
                    <span className="truncate max-w-[90px]" style={{ color: '#94a3b8' }}>{d.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {parallelTasks.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1" style={{ color: '#0078d4' }}>
                <ArrowRight size={9} /> Runs in parallel
              </p>
              <div className="flex flex-wrap gap-1">
                {parallelTasks.map(d => (
                  <span key={d.id} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-sm"
                    style={{ background: '#eff6ff', color: '#0078d4', border: '1px solid #93c5fd' }}>
                    <span className="font-bold font-mono">{d.id}</span>
                    <span className="truncate max-w-[90px]" style={{ color: '#94a3b8' }}>{d.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-border/40">
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded cursor-pointer transition-colors"
              style={{ background: 'rgba(0,120,212,0.1)', color: '#0078d4', border: '1px solid rgba(0,120,212,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.1)'; }}
            >
              <Edit2 size={10} /> Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded cursor-pointer transition-colors"
              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)'; }}
            >
              <Trash2 size={10} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
