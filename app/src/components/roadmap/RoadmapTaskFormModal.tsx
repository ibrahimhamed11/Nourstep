/**
 * RoadmapTaskFormModal — NourStep theme
 */
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
}

const BLANK: FormState = {
  title: '', desc: '', track: 'backend', week: 1,
  status: 'todo', assignee: '', estimate: '', tags: [],
};

interface Props {
  open: boolean;
  initial?: RoadmapTask | null;
  defaultWeek?: Week;
  onSave: (data: Partial<RoadmapTask>) => void;
  onClose: () => void;
}

export default function RoadmapTaskFormModal({ open, initial, defaultWeek, onSave, onClose }: Props) {
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
