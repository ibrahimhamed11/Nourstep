/**
 * RoadmapTaskFormModal — Add / Edit modal for roadmap tasks
 */
import { useState } from 'react';
import { Plus, X, Save, Pencil } from 'lucide-react';
import type { RoadmapTask, Status, Track, Week, TaskType, Tag } from './roadmap.types';
import {
  DEFAULT_ASSIGNEE, TASK_TYPE_CONFIG, TRACK_CONFIG, STATUS_CONFIG, TAG_CONFIG,
} from './roadmap.types';

interface Props {
  /** null = add mode, RoadmapTask = edit mode */
  task: Partial<RoadmapTask> | null;
  onSave: (data: Partial<RoadmapTask>) => void;
  onClose: () => void;
}

export default function RoadmapTaskFormModal({ task, onSave, onClose }: Props) {
  const isEdit = task !== null && !!task.id;

  const [title, setTitle] = useState(task?.title ?? '');
  const [desc, setDesc] = useState(task?.desc ?? '');
  const [taskType, setTaskType] = useState<TaskType>(task?.taskType ?? 'task');
  const [status, setStatus] = useState<Status>(task?.status ?? 'todo');
  const [track, setTrack] = useState<Track>(task?.track ?? 'backend');
  const [week, setWeek] = useState<Week>(task?.week ?? 1);
  const [estimate, setEstimate] = useState(task?.estimate ?? '');
  const [assignee, setAssignee] = useState(task?.assignee ?? DEFAULT_ASSIGNEE);
  const [tags, setTags] = useState<Tag[]>(task?.tags ?? []);

  const toggleTag = (tag: Tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      desc: desc.trim(),
      taskType,
      status,
      track,
      week,
      estimate: estimate.trim() || '—',
      assignee: assignee.trim() || DEFAULT_ASSIGNEE,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Title bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-bold text-base flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil size={16} className="text-blue-500" /> Edit Task
                {task?.taskNumber != null && task?.taskType && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border font-mono ${TASK_TYPE_CONFIG[task.taskType]?.badge ?? ''}`}>
                    {TASK_TYPE_CONFIG[task.taskType]?.prefix}-{task.taskNumber}
                  </span>
                )}
              </>
            ) : (
              <><Plus size={16} className="text-blue-500" /> New Task</>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" autoFocus />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Details..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" rows={2} />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Type</label>
              <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(TASK_TYPE_CONFIG) as TaskType[]).map(t => (
                  <option key={t} value={t}>{TASK_TYPE_CONFIG[t].prefix} — {TASK_TYPE_CONFIG[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Status)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Track + Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Track</label>
              <select value={track} onChange={e => setTrack(e.target.value as Track)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(TRACK_CONFIG) as Track[]).map(tr => (
                  <option key={tr} value={tr}>{TRACK_CONFIG[tr].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Week</label>
              <select value={week} onChange={e => setWeek(Number(e.target.value) as Week)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {([1,2,3,4,5,6,7,8] as Week[]).map(w => (
                  <option key={w} value={w}>Week {w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimate + Assigned To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Estimate</label>
              <input value={estimate} onChange={e => setEstimate(e.target.value)} placeholder="e.g. 2d, 4h"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Assigned To</label>
              <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder={DEFAULT_ASSIGNEE}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TAG_CONFIG) as Tag[]).map(tag => {
                const cfg = TAG_CONFIG[tag];
                const active = tags.includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${active ? cfg.cls : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSubmit} disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
            {isEdit ? <><Save size={14} /> Save Changes</> : <><Plus size={14} /> Add Task</>}
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
