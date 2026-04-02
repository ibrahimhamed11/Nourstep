/**
 * RoadmapTaskFormModal — Azure DevOps Work Item dialog style
 */
import { useState, useEffect, useRef } from 'react';
import { X, GitBranch, ChevronDown } from 'lucide-react';
import type { RoadmapTask, Track, Week, Tag, TaskType } from './roadmap.types';
import { TRACKS, WEEKS, TAG_CONFIG, TASK_TYPE_CONFIG } from './roadmap.types';

interface FormState {
  title: string;
  desc: string;
  taskType: TaskType;
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
  title: '', desc: '', taskType: 'task', track: 'backend', week: 1,
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
      <label className="block text-[11px] font-semibold text-muted/60 uppercase tracking-widest mb-1.5 flex items-center gap-1">
        <Icon size={10} style={{ color }} /> {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-surface/50 dark:bg-darkblue/50 border border-border/40 text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0078d4]/50 transition-all cursor-pointer"
      >
        <span className="flex flex-wrap gap-1 flex-1 min-w-0">
          {value.length === 0
            ? <span className="text-muted/40 text-xs">None selected</span>
            : value.map(id => (
              <span key={id} className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border"
                style={{ background: `${color}15`, color, borderColor: `${color}30` }}>
                {id}
              </span>
            ))}
        </span>
        <ChevronDown size={12} className={`text-muted/50 flex-shrink-0 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--theme-card)] border border-border/40 rounded shadow-xl max-h-48 overflow-y-auto">
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
                <span
                  className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0 border transition-colors ${
                    value.includes(t.id) ? 'border-transparent' : 'border-border/50 bg-transparent'
                  }`}
                  style={value.includes(t.id) ? { background: color, borderColor: color } : {}}
                >
                  {value.includes(t.id) && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2 h-2">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold mr-1.5" style={{ color }}>{t.id}</span>
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

const STATUS_OPTIONS = [
  { value: 'todo',        label: 'To Do',       color: '#9e9e9e' },
  { value: 'in-progress', label: 'In Progress',  color: '#0078d4' },
  { value: 'done',        label: 'Done',         color: '#22C97A' },
  { value: 'blocked',     label: 'Blocked',      color: '#FF4D4D' },
];

export default function RoadmapTaskFormModal({ open, initial, defaultWeek, allTasks = [], onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(BLANK);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        title: initial.title,
        desc: initial.desc ?? '',
        taskType: initial.taskType ?? 'task',
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
      taskType: form.taskType,
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

  const inputCls = "w-full bg-surface/50 dark:bg-darkblue/50 border border-border/40 text-heading text-sm rounded px-3 py-2 placeholder:text-muted/40 focus:outline-none focus:ring-1 focus:ring-[#0078d4]/50 focus:border-[#0078d4]/40 transition-all";
  const labelCls = "block text-[11px] font-semibold text-muted/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-lg bg-[var(--theme-card)] border border-border/40 sm:rounded-lg shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[85vh] flex flex-col"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>

        {/* Azure DevOps-style dialog header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30 bg-surface/30 dark:bg-darkblue/30 flex-shrink-0">
          <div>
            <h2 className="text-heading font-semibold text-sm">
              {initial ? `Edit Work Item · ${initial.id}` : 'New Work Item'}
            </h2>
            <p className="text-muted/50 text-[10px] mt-0.5">
              {initial ? 'Modify the work item details below' : 'Create a new work item for the sprint board'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-heading hover:bg-surface dark:hover:bg-darkblue transition-all cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">

            {/* Title */}
            <div>
              <label className={labelCls}>Title *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="What needs to be done?"
                className={inputCls}
                required
                autoFocus
              />
            </div>

            {/* Task Type pills */}
            <div>
              <label className={labelCls}>Work Item Type</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TASK_TYPE_CONFIG) as TaskType[]).map(type => {
                  const cfg = TASK_TYPE_CONFIG[type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => set('taskType', type)}
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all ${
                        form.taskType === type
                          ? cfg.badge
                          : 'text-muted/70 border-border/40 hover:border-border/60 hover:text-heading bg-transparent'
                      }`}
                    >
                      <Icon size={11} /> {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={form.desc}
                onChange={e => set('desc', e.target.value)}
                placeholder="Add details, steps, links, or notes…"
                rows={4}
                className={`${inputCls} resize-y min-h-[80px] max-h-[300px]`}
              />
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
                <label className={labelCls}>Sprint</label>
                <select value={form.week} onChange={e => set('week', Number(e.target.value) as Week)} className={inputCls}>
                  {WEEKS.map(w => <option key={w.week} value={w.week}>{w.label} · {w.dates}</option>)}
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>State</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set('status', s.value as RoadmapTask['status'])}
                    className="text-[10px] font-semibold px-3 py-1.5 rounded-sm border cursor-pointer transition-all"
                    style={{
                      background: form.status === s.value ? `${s.color}15` : 'transparent',
                      color: form.status === s.value ? s.color : undefined,
                      borderColor: form.status === s.value ? `${s.color}35` : undefined,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee + Estimate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Assigned To</label>
                <input value={form.assignee} onChange={e => set('assignee', e.target.value)}
                  placeholder="e.g. Islam" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Estimate</label>
                <input value={form.estimate} onChange={e => set('estimate', e.target.value)}
                  placeholder="e.g. 3d, 4h" className={inputCls} />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>Tags / Area</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TAG_CONFIG) as Tag[]).map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleTag(key)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-sm border cursor-pointer transition-all ${
                      form.tags.includes(key)
                        ? 'bg-[#0078d4]/12 text-[#0078d4] dark:text-[#2899f5] border-[#0078d4]/25 dark:border-[#2899f5]/20'
                        : 'text-muted/60 border-border/30 hover:border-border/60 hover:text-heading bg-transparent'
                    }`}
                  >
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
                color="#0078d4"
                value={form.parallel}
                onChange={v => set('parallel', v)}
                tasks={allTasks}
                excludeId={initial?.id}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-2 px-5 py-3.5 border-t border-border/30 bg-surface/20 dark:bg-darkblue/20 flex-shrink-0">
            <button
              type="submit"
              className="flex-1 bg-[#0078d4] hover:bg-[#106ebe] text-white font-semibold text-sm py-2 rounded transition-colors cursor-pointer"
            >
              {initial ? 'Save Changes' : 'Create Work Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 text-muted border border-border/40 font-medium text-sm rounded hover:text-heading hover:border-border/60 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
