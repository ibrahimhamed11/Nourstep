/**
 * RoadmapTaskFormModal — NourStep theme
 */
import { useState, useEffect, useRef } from 'react';
import { X, GitBranch, ChevronDown } from 'lucide-react';
import type { RoadmapTask, Track, Week, Tag } from './roadmap.types';
import { TRACKS, WEEKS, TAG_CONFIG } from './roadmap.types';

interface FormState {
  title: string;
  desc: string;
  track: Track;
  week: Week;
  status: RoadmapTask['status'];
  assignee: string;
  estimate: string;
  tags: Tag[];
  blockedBy: string[];
  parallel: string[];
}

const BLANK: FormState = {
  title: '', desc: '', track: 'backend', week: 1,
  status: 'todo', assignee: '', estimate: '', tags: [],
  blockedBy: [], parallel: [],
};

interface Props {
  open: boolean;
  initial?: RoadmapTask | null;
  defaultWeek?: Week;
  allTasks?: RoadmapTask[];
  onSave: (data: Partial<RoadmapTask>) => void;
  onClose: () => void;
}

/* ── Small multi-select dropdown for task IDs ── */
function TaskMultiSelect({
  label, icon: Icon, color, value, onChange, tasks, excludeId,
}: {
  label: string;
  icon: React.ElementType;
  color: string;
  value: string[];
  onChange: (v: string[]) => void;
  tasks: RoadmapTask[];
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = tasks.filter(t => t.id !== excludeId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id]);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1">
        <Icon size={10} style={{ color }} /> {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-surface/60 dark:bg-darkblue/60 border border-border/50 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-royal/30 focus:border-royal/40 transition-all cursor-pointer"
      >
        <span className="flex flex-wrap gap-1 flex-1 min-w-0">
          {value.length === 0
            ? <span className="text-muted/40 text-xs">None selected</span>
            : value.map(id => (
              <span key={id} className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{ background: `${color}18`, color, borderColor: `${color}40` }}>
                {id}
              </span>
            ))}
        </span>
        <ChevronDown size={13} className={`text-muted/50 flex-shrink-0 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl shadow-2xl max-h-52 overflow-y-auto">
          {options.length === 0 ? (
            <p className="text-muted/50 text-xs text-center py-4">No other tasks</p>
          ) : (
            options.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggle(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-surface/60 dark:hover:bg-darkblue/60 ${
                  value.includes(t.id) ? 'bg-surface/80 dark:bg-darkblue/80' : ''
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                  value.includes(t.id)
                    ? 'border-transparent'
                    : 'border-border/50 bg-transparent'
                }`}
                  style={value.includes(t.id) ? { background: color, borderColor: color } : {}}>
                  {value.includes(t.id) && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2 h-2">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="text-[9px] font-black mr-1.5" style={{ color }}>{t.id}</span>
                  <span className="text-heading text-xs truncate">{t.title}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapTaskFormModal({ open, initial, defaultWeek, allTasks = [], onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(BLANK);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        title: initial.title,
        desc: initial.desc ?? '',
        track: initial.track,
        week: initial.week,
        status: initial.status,
        assignee: initial.assignee ?? '',
        estimate: initial.estimate ?? '',
        tags: (initial.tags ?? []) as Tag[],
        blockedBy: initial.blockedBy ?? [],
        parallel: initial.parallel ?? [],
      });
    } else {
      setForm({ ...BLANK, week: defaultWeek ?? 1 });
    }
  }, [open, initial, defaultWeek]);

  if (!open) return null;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggleTag = (tag: Tag) =>
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...(initial ?? {}),
      title: form.title.trim(),
      desc: form.desc.trim(),
      track: form.track,
      week: form.week,
      status: form.status,
      assignee: form.assignee.trim() || initial?.assignee,
      estimate: form.estimate.trim() || initial?.estimate,
      tags: form.tags,
      blockedBy: form.blockedBy,
      parallel: form.parallel,
    });
  };

  const inputCls = "w-full bg-surface/60 dark:bg-darkblue/60 border border-border/50 text-heading text-sm rounded-xl px-3 py-2.5 placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-royal/30 focus:border-royal/40 transition-all";
  const labelCls = "block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border)]">
          <h2 className="text-heading font-bold text-base">
            {initial ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-muted hover:text-heading hover:bg-surface dark:hover:bg-darkblue transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className={labelCls}>Task Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="What needs to be done?" className={inputCls} required />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.desc} onChange={e => set('desc', e.target.value)}
              placeholder="Optional details..." rows={2} className={`${inputCls} resize-none`} />
          </div>

          {/* Track + Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Track</label>
              <select value={form.track} onChange={e => set('track', e.target.value as Track)} className={inputCls}>
                {TRACKS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Week</label>
              <select value={form.week} onChange={e => set('week', Number(e.target.value) as Week)} className={inputCls}>
                {WEEKS.map(w => <option key={w.week} value={w.week}>{w.label}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value as RoadmapTask['status'])} className={inputCls}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Assignee + Estimate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Assignee</label>
              <input value={form.assignee} onChange={e => set('assignee', e.target.value)}
                placeholder="e.g. Islam" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estimate</label>
              <input value={form.estimate} onChange={e => set('estimate', e.target.value)}
                placeholder="e.g. 3d" className={inputCls} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TAG_CONFIG) as Tag[]).map(key => (
                <button key={key} type="button" onClick={() => toggleTag(key)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    form.tags.includes(key)
                      ? 'bg-royal/15 text-royal dark:bg-bright/15 dark:text-bright border-royal/25 dark:border-bright/20'
                      : 'text-muted border-border/40 hover:border-royal/25 dark:hover:border-bright/25 hover:text-heading'
                  }`}>
                  {TAG_CONFIG[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Blocked By + Parallel */}
          <div className="grid grid-cols-2 gap-3">
            <TaskMultiSelect
              label="Blocked By"
              icon={GitBranch}
              color="#FF4D4D"
              value={form.blockedBy}
              onChange={v => set('blockedBy', v)}
              tasks={allTasks}
              excludeId={initial?.id}
            />
            <TaskMultiSelect
              label="Runs in Parallel"
              icon={GitBranch}
              color="#3D8BFF"
              value={form.parallel}
              onChange={v => set('parallel', v)}
              tasks={allTasks}
              excludeId={initial?.id}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-[var(--theme-border)]">
            <button type="submit"
              className="flex-1 bg-gradient-to-r from-royal to-bright text-white font-bold text-sm py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
              {initial ? 'Save Changes' : 'Add Task'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 text-muted border border-border/40 font-semibold text-sm rounded-xl hover:text-heading hover:border-border/70 transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
