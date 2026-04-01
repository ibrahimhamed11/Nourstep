/**
 * RoadmapTaskCard — Single task card with CRUD actions
 * Supports: expand/collapse, status toggle, edit, delete, copy ID, assignee display
 */
import { useState } from 'react';
import {
  ChevronDown, ChevronRight, Pencil, Trash2, Copy, Check, User,
} from 'lucide-react';
import type { RoadmapTask } from './roadmap.types';
import {
  TRACK_CONFIG, STATUS_CONFIG, STATUS_CYCLE, TASK_TYPE_CONFIG, TAG_CONFIG, taskDisplayId,
} from './roadmap.types';

interface Props {
  task: RoadmapTask;
  allTasks: RoadmapTask[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

export default function RoadmapTaskCard({ task, allTasks, onToggleStatus, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const track = TRACK_CONFIG[task.track];
  const status = STATUS_CONFIG[task.status];
  const StatusIcon = status.icon;
  const tc = TASK_TYPE_CONFIG[task.taskType];
  const TypeIcon = tc.icon;
  const label = taskDisplayId(task);

  const blockingTasks = (task.blockedBy ?? []).map(id => allTasks.find(t => t.id === id)?.title ?? id);
  const parallelTasks = (task.parallel ?? []).map(id => allTasks.find(t => t.id === id)?.title ?? id);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(task.id);
  };

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm transition-all ${open ? 'shadow-md ring-1 ring-blue-100' : ''} ${task.status === 'done' ? 'opacity-70' : ''}`}
      style={{ borderLeftWidth: 3, borderLeftColor: track.color }}
    >
      {/* ── Main row ── */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        {/* Status icon — click cycles */}
        <span onClick={handleCycleStatus} title={`Status: ${status.label} — click to cycle`}
          className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform">
          <StatusIcon size={15} className={status.cls} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Task ID badge */}
            <span onClick={handleCopyId} title={`Copy ${label}`}
              className={`text-[9px] font-black px-1.5 py-0.5 rounded border font-mono inline-flex items-center gap-0.5 hover:scale-105 transition-all cursor-pointer ${tc.badge}`}>
              <TypeIcon size={8} className="inline -mt-px" /> {label}
              {copied ? <Check size={7} className="text-emerald-500" /> : <Copy size={7} className="opacity-40" />}
            </span>
            <span className={`text-gray-800 font-semibold text-xs leading-snug ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${status.badge}`}>{status.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-violet-500 inline-flex items-center gap-0.5 font-medium">
              <User size={9} /> {task.assignee}
            </span>
            <span className="text-[10px] text-gray-400">| {task.estimate}</span>
            {(task.tags ?? []).map(tag => (
              <span key={tag} className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${TAG_CONFIG[tag]?.cls ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                {TAG_CONFIG[tag]?.label ?? tag}
              </span>
            ))}
            {task.parallel && task.parallel.length > 0 && (
              <span className="text-[10px] text-purple-500 font-medium">parallel</span>
            )}
            {task.blockedBy && task.blockedBy.length > 0 && (
              <span className="text-[10px] text-amber-500 font-medium">depends on {task.blockedBy.length}</span>
            )}
          </div>
        </div>

        {open
          ? <ChevronDown size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
          : <ChevronRight size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>

      {/* ── Expanded detail ── */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-3">
          <p className="text-gray-500 text-[11px] leading-relaxed">{task.desc}</p>

          {/* Status quick-switch */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status:</span>
            {STATUS_CYCLE.map(s => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              const active = task.status === s;
              return (
                <button key={s} onClick={() => { if (!active) onToggleStatus(task.id); }}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${active ? cfg.badge : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  <Icon size={9} /> {cfg.label}
                </button>
              );
            })}
          </div>

          {parallelTasks.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-purple-500 uppercase tracking-widest mb-1">Can run in parallel with</div>
              <div className="flex flex-wrap gap-1">
                {parallelTasks.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700">{t}</span>
                ))}
              </div>
            </div>
          )}

          {blockingTasks.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1">Blocked by</div>
              <div className="flex flex-wrap gap-1">
                {blockingTasks.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <button onClick={() => onEdit(task)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-blue-500 border border-blue-100 hover:bg-blue-50 transition-all cursor-pointer">
              <Pencil size={10} /> Edit
            </button>

            {confirmDelete ? (
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] text-red-500 font-bold">Delete?</span>
                <button onClick={() => onDelete(task.id)}
                  className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-md cursor-pointer">Yes</button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 px-2.5 py-1 cursor-pointer">No</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-400 border border-red-100 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
                <Trash2 size={10} /> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
