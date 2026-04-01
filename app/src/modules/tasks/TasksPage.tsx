/**
 * TasksPage — Personal Task Manager
 * Route: /tasks
 * Full CRUD: add, edit, toggle done, delete, filter, sort, stats
 * Features: auto task-number, taskType (TASK/BUG/FEAT/IMP), assignedTo
 * Search by name, number, assignee, or tag.  Default assignee: Dev Ibrahim Hamed
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2, Circle, Clock,
  Plus, X, Save, Trash2, StickyNote, Filter, Pencil,
  ArrowLeft, ArrowUpDown, User,
  ListTodo, ClipboardCheck, BookOpen, GraduationCap, Folder,
  ChevronDown, ChevronRight, Search, Hash, Copy, Check,
  Flame, ArrowUp, ArrowDown, Minus,
  CalendarClock, Tag,
  Bug, Lightbulb, Sparkles, SquareKanban,
} from 'lucide-react';
import type {
  UserTask, TaskStatus, TaskPriority, TaskCategory, TaskType,
} from './task.types';
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  updateTaskNotes,
  deleteTask,
} from './task.api';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const DEFAULT_ASSIGNEE = 'Dev Ibrahim Hamed';

/* ─────────────────────────────────────────────────────────────
   CONFIG MAPS
───────────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: LucideIcon; cls: string; badge: string }> = {
  todo:        { label: 'To Do',       icon: Circle,       cls: 'text-gray-400',   badge: 'bg-gray-50 text-gray-500 border-gray-200' },
  in_progress: { label: 'In Progress', icon: Clock,        cls: 'text-blue-500',   badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  done:        { label: 'Done',        icon: CheckCircle2, cls: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: LucideIcon; cls: string; badge: string }> = {
  low:    { label: 'Low',    icon: ArrowDown, cls: 'text-gray-400',   badge: 'bg-gray-50 text-gray-500 border-gray-200' },
  medium: { label: 'Medium', icon: Minus,     cls: 'text-blue-400',   badge: 'bg-blue-50 text-blue-500 border-blue-200' },
  high:   { label: 'High',   icon: ArrowUp,   cls: 'text-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
  urgent: { label: 'Urgent', icon: Flame,     cls: 'text-red-500',    badge: 'bg-red-50 text-red-600 border-red-200' },
};

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; icon: LucideIcon; cls: string }> = {
  homework: { label: 'Homework', icon: ListTodo,       cls: 'text-blue-500' },
  study:    { label: 'Study',    icon: BookOpen,       cls: 'text-purple-500' },
  project:  { label: 'Project',  icon: ClipboardCheck, cls: 'text-emerald-500' },
  exam:     { label: 'Exam',     icon: GraduationCap,  cls: 'text-amber-500' },
  other:    { label: 'Other',    icon: Folder,         cls: 'text-gray-500' },
};

const TYPE_CONFIG: Record<TaskType, { label: string; prefix: string; icon: LucideIcon; cls: string; badge: string }> = {
  task:        { label: 'Task',        prefix: 'TASK', icon: SquareKanban, cls: 'text-blue-600',    badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  bug:         { label: 'Bug',         prefix: 'BUG',  icon: Bug,          cls: 'text-red-600',     badge: 'bg-red-50 text-red-600 border-red-200' },
  feature:     { label: 'Feature',     prefix: 'FEAT', icon: Lightbulb,    cls: 'text-amber-600',   badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  improvement: { label: 'Improvement', prefix: 'IMP',  icon: Sparkles,     cls: 'text-purple-600',  badge: 'bg-purple-50 text-purple-600 border-purple-200' },
};

const STATUS_CYCLE: TaskStatus[] = ['todo', 'in_progress', 'done'];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function tid(task: UserTask): string {
  return `${TYPE_CONFIG[task.taskType].prefix}-${task.taskNumber}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function dueDateLabel(dateStr?: string): { text: string; cls: string } | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  const hrs = Math.round(diff / (1000 * 60 * 60));
  if (hrs < 0) return { text: `Overdue by ${Math.abs(hrs)}h`, cls: 'text-red-500' };
  if (hrs < 24) return { text: `Due in ${hrs}h`, cls: 'text-orange-500' };
  const days = Math.round(hrs / 24);
  return { text: `Due in ${days}d`, cls: 'text-gray-400' };
}

/* ─────────────────────────────────────────────────────────────
   TASK ROW COMPONENT
───────────────────────────────────────────────────────────── */
function TaskRow({ task, onToggle, onDelete, onUpdateNotes, onEdit }: {
  task: UserTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onEdit: (task: UserTask) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const sc = STATUS_CONFIG[task.status];
  const pc = PRIORITY_CONFIG[task.priority];
  const cc = CATEGORY_CONFIG[task.category];
  const tc = TYPE_CONFIG[task.taskType];
  const StatusIcon = sc.icon;
  const PriorityIcon = pc.icon;
  const CatIcon = cc.icon;
  const TypeIcon = tc.icon;
  const due = dueDateLabel(task.dueDate);
  const taskLabel = tid(task);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(taskLabel);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(task._id, notesDraft);
    setEditingNotes(false);
  };

  return (
    <div className={`rounded-xl border bg-white shadow-sm transition-all ${expanded ? 'shadow-md ring-1 ring-blue-100' : 'hover:shadow-md'} ${task.status === 'done' ? 'opacity-70' : ''}`}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Toggle status */}
        <button onClick={() => onToggle(task._id)}
          className="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
          title={`Status: ${sc.label} — click to cycle`}>
          <StatusIcon size={20} className={sc.cls} />
        </button>

        {/* Content */}
        <button className="flex-1 min-w-0 text-left cursor-pointer" onClick={() => setExpanded(o => !o)}>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Task number badge — clickable to copy */}
            <button onClick={handleCopyId} title={`Copy ${taskLabel}`}
              className={`text-[9px] font-black px-1.5 py-0.5 rounded border font-mono inline-flex items-center gap-0.5 transition-all cursor-pointer hover:scale-105 ${tc.badge}`}>
              <TypeIcon size={8} className="inline -mt-px" /> {taskLabel}
              {copied ? <Check size={7} className="text-emerald-500" /> : <Copy size={7} className="opacity-40" />}
            </button>
            <span className={`font-semibold text-sm leading-snug ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${pc.badge}`}>
              <PriorityIcon size={8} className="inline -mt-px" /> {pc.label}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
              <CatIcon size={8} className="inline -mt-px" /> {cc.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {/* Assigned to */}
            <span className="text-[10px] text-violet-500 inline-flex items-center gap-0.5 font-medium">
              <User size={9} /> {task.assignedTo}
            </span>
            {due && (
              <span className={`text-[10px] font-medium inline-flex items-center gap-0.5 ${due.cls}`}>
                <CalendarClock size={9} /> {due.text}
              </span>
            )}
            {task.tags.length > 0 && (
              <span className="text-[10px] text-gray-400 inline-flex items-center gap-0.5">
                <Tag size={9} /> {task.tags.join(', ')}
              </span>
            )}
            {task.notes && (
              <span className="text-[10px] text-cyan-500 inline-flex items-center gap-0.5">
                <StickyNote size={9} /> note
              </span>
            )}
            <span className="text-[10px] text-gray-300">{timeAgo(task.createdAt)}</span>
          </div>
        </button>

        {/* Expand */}
        <button onClick={() => setExpanded(o => !o)} className="flex-shrink-0 text-gray-300 hover:text-gray-500 cursor-pointer">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-3">
          {/* Task meta header */}
          <div className="flex items-center gap-3 flex-wrap text-[10px]">
            <span className={`font-black px-2 py-0.5 rounded border font-mono ${tc.badge}`}>
              <TypeIcon size={9} className="inline -mt-px" /> {taskLabel}
            </span>
            <span className="text-violet-500 font-medium inline-flex items-center gap-0.5">
              <User size={10} /> Assigned: <strong>{task.assignedTo}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">Created {timeAgo(task.createdAt)}</span>
            {task.updatedAt !== task.createdAt && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">Updated {timeAgo(task.updatedAt)}</span>
              </>
            )}
          </div>

          {task.description && (
            <p className="text-gray-500 text-xs leading-relaxed">{task.description}</p>
          )}

          {/* Status quick buttons — pick any status directly */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status:</span>
            {STATUS_CYCLE.map(s => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              const active = task.status === s;
              return (
                <button key={s} onClick={() => { if (!active) onToggle(task._id); }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${active ? cfg.badge : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  <Icon size={10} /> {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-cyan-100 bg-cyan-50/40 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest flex items-center gap-1">
                <StickyNote size={10} /> Notes
              </div>
              {!editingNotes && (
                <button onClick={() => { setEditingNotes(true); setNotesDraft(task.notes); }}
                  className="text-[9px] font-bold text-cyan-500 hover:text-cyan-700 cursor-pointer flex items-center gap-0.5">
                  <Pencil size={9} /> {task.notes ? 'Edit' : 'Add note'}
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                  className="w-full text-xs text-gray-700 bg-white border border-cyan-200 rounded-md px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  rows={3} placeholder="Add notes, reminders, or context..." autoFocus />
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveNotes}
                    className="text-[10px] font-bold text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer">
                    <Save size={10} /> Save
                  </button>
                  <button onClick={() => setEditingNotes(false)}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer flex items-center gap-1">
                    <X size={10} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed">
                {task.notes || <span className="italic text-gray-300">No notes yet</span>}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button onClick={() => onEdit(task)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-blue-500 border border-blue-100 hover:bg-blue-50 transition-all cursor-pointer">
              <Pencil size={10} /> Edit Task
            </button>

            {confirmDelete ? (
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] text-red-500 font-bold">Delete?</span>
                <button onClick={() => onDelete(task._id)}
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

/* ─────────────────────────────────────────────────────────────
   TASK FORM MODAL  (shared for Add + Edit)
───────────────────────────────────────────────────────────── */
function TaskFormModal({ task, onSave, onClose }: {
  task: Partial<UserTask> | null;  // null = add mode
  onSave: (data: Partial<UserTask>) => void;
  onClose: () => void;
}) {
  const isEdit = task !== null && !!task._id;
  const [title, setTitle] = useState(task?.title ?? '');
  const [desc, setDesc] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? 'project');
  const [taskType, setTaskType] = useState<TaskType>(task?.taskType ?? 'task');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? DEFAULT_ASSIGNEE);
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 16) : '');
  const [tags, setTags] = useState(task?.tags?.join(', ') ?? '');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      description: desc.trim() || undefined,
      priority,
      category,
      taskType,
      assignedTo: assignedTo.trim() || DEFAULT_ASSIGNEE,
      dueDate: dueDate || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-bold text-base flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil size={16} className="text-blue-500" /> Edit Task
                {task?.taskNumber != null && task?.taskType && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border font-mono ${TYPE_CONFIG[task.taskType as TaskType]?.badge ?? ''}`}>
                    {TYPE_CONFIG[task.taskType as TaskType]?.prefix}-{task.taskNumber}
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

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Type</label>
              <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(TYPE_CONFIG) as TaskType[]).map(t => <option key={t} value={t}>{TYPE_CONFIG[t].prefix} — {TYPE_CONFIG[t].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
              </select>
            </div>
          </div>

          {/* Category + Assigned To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Assigned To</label>
              <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder={DEFAULT_ASSIGNEE}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          {/* Due Date + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Due Date</label>
              <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Tags (comma-separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="frontend, bug"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>

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

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'taskNumber'>('createdAt');

  // Modal state: undefined = closed, null = add, UserTask = edit
  const [modalTask, setModalTask] = useState<Partial<UserTask> | null | undefined>(undefined);

  /* ── Load tasks from backend ── */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTasks({ limit: 200, page: 1 });
      setTasks(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /* ── Handlers ── */
  const handleToggle = useCallback(async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === id
      ? { ...t, status: next, completedAt: next === 'done' ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }
      : t
    ));
    try {
      await toggleTaskStatus(id, next);
    } catch {
      // Revert on failure
      setTasks(prev => prev.map(t => t._id === id ? task : t));
    }
  }, [tasks]);

  const handleDelete = useCallback(async (id: string) => {
    const snapshot = tasks;
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await deleteTask(id);
    } catch {
      setTasks(snapshot);
    }
  }, [tasks]);

  const handleUpdateNotes = useCallback(async (id: string, notes: string) => {
    const snapshot = tasks;
    setTasks(prev => prev.map(t => t._id === id ? { ...t, notes, updatedAt: new Date().toISOString() } : t));
    try {
      await updateTaskNotes(id, notes);
    } catch {
      setTasks(snapshot);
    }
  }, [tasks]);

  const handleSaveModal = useCallback(async (data: Partial<UserTask>) => {
    try {
      if (data._id) {
        // ── EDIT existing
        const res = await updateTask(data._id, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          category: data.category,
          taskType: data.taskType,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
          tags: data.tags,
        });
        setTasks(prev => prev.map(t => t._id === data._id ? res.data : t));
      } else {
        // ── ADD new
        const res = await createTask({
          title: data.title ?? 'Untitled',
          description: data.description,
          priority: data.priority ?? 'medium',
          category: data.category ?? 'project',
          taskType: data.taskType ?? 'task',
          assignedTo: data.assignedTo ?? DEFAULT_ASSIGNEE,
          tags: data.tags ?? [],
          dueDate: data.dueDate,
        });
        setTasks(prev => [res.data, ...prev]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save task');
    }
    setModalTask(undefined);
  }, []);



  /* ── Computed ── */
  const priorityOrder: Record<TaskPriority, number> = useMemo(() => ({ urgent: 0, high: 1, medium: 2, low: 3 }), []);

  const filtered = useMemo(() => {
    let result = tasks.filter(t => !t.isArchived);
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter);
    if (categoryFilter !== 'all') result = result.filter(t => t.category === categoryFilter);
    if (typeFilter !== 'all') result = result.filter(t => t.taskType === typeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      // Search by number: "#5", "3"
      const numMatch = q.match(/^#?(\d+)$/);
      // Search by prefix+number: "TASK-3", "BUG-1", "FEAT-2", "IMP-4"
      const prefixMatch = q.match(/^(task|bug|feat|imp)-?(\d+)$/i);

      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        result = result.filter(t => t.taskNumber === num);
      } else if (prefixMatch) {
        const prefix = prefixMatch[1].toUpperCase();
        const num = parseInt(prefixMatch[2], 10);
        result = result.filter(t => TYPE_CONFIG[t.taskType].prefix === prefix && t.taskNumber === num);
      } else {
        result = result.filter(t =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q)) ||
          t.assignedTo.toLowerCase().includes(q) ||
          tid(t).toLowerCase().includes(q)
        );
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'taskNumber') return b.taskNumber - a.taskNumber;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [tasks, statusFilter, priorityFilter, categoryFilter, typeFilter, searchQuery, sortBy, priorityOrder]);

  const stats = useMemo(() => {
    const active = tasks.filter(t => !t.isArchived);
    const overdue = active.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
    return {
      total: active.length,
      todo: active.filter(t => t.status === 'todo').length,
      inProgress: active.filter(t => t.status === 'in_progress').length,
      done: active.filter(t => t.status === 'done').length,
      overdue,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-sm font-medium">Loading tasks…</p>
          </div>
        </div>
      )}

      {/* Backend Unavailable State */}
      {!loading && error === 'BACKEND_UNAVAILABLE' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm mx-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
              <span className="text-3xl">🚧</span>
            </div>
            <p className="text-gray-800 font-bold text-lg">Backend Coming Soon</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              The tasks API is not deployed yet.<br />Check back once the backend is live.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && error !== 'BACKEND_UNAVAILABLE' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm mx-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">⚠</span>
            </div>
            <p className="text-gray-800 font-semibold">Failed to load tasks</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button onClick={loadTasks}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 font-bold text-base">My Tasks</h1>
            <p className="text-gray-400 text-[10px]">
              {stats.total} tasks &middot; {stats.done} done &middot;{' '}
              {stats.overdue > 0 ? <span className="text-red-500 font-bold">{stats.overdue} overdue</span> : 'none overdue'}
            </p>
          </div>
          <button onClick={() => setModalTask(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
            <Plus size={14} /> New Task
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3">
          {([
            { key: 'all' as const,         label: 'All',         count: stats.total,      color: 'text-gray-800', bg: 'bg-white' },
            { key: 'todo' as const,        label: 'To Do',       count: stats.todo,       color: 'text-gray-500', bg: 'bg-gray-50' },
            { key: 'in_progress' as const, label: 'In Progress', count: stats.inProgress, color: 'text-blue-600', bg: 'bg-blue-50' },
            { key: 'done' as const,        label: 'Done',        count: stats.done,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ] as const).map(s => (
            <button key={s.key}
              onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
              className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${statusFilter === s.key ? `ring-2 ring-blue-400 ring-offset-1 ${s.bg}` : 'bg-white border-gray-200 hover:shadow-sm'}`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
              <div className="text-[10px] font-bold text-gray-400 mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, #number, TASK-3, BUG-1..."
              className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Filter size={9} /> Filters:</span>

            {/* Type filter */}
            {(Object.keys(TYPE_CONFIG) as TaskType[]).map(t => {
              const cfg = TYPE_CONFIG[t];
              const TIcon = cfg.icon;
              return (
                <button key={t} onClick={() => setTypeFilter(typeFilter === t ? 'all' : t)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${typeFilter === t ? cfg.badge : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  <TIcon size={9} /> {cfg.prefix}
                </button>
              );
            })}

            <span className="text-gray-200">|</span>

            {/* Priority filter */}
            {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(p => {
              const cfg = PRIORITY_CONFIG[p];
              const PIcon = cfg.icon;
              return (
                <button key={p} onClick={() => setPriorityFilter(priorityFilter === p ? 'all' : p)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${priorityFilter === p ? cfg.badge : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  <PIcon size={9} /> {cfg.label}
                </button>
              );
            })}

            <span className="text-gray-200">|</span>

            {/* Category filter */}
            {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(c => {
              const cfg = CATEGORY_CONFIG[c];
              const CIcon = cfg.icon;
              return (
                <button key={c} onClick={() => setCategoryFilter(categoryFilter === c ? 'all' : c)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${categoryFilter === c ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  <CIcon size={9} /> {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><ArrowUpDown size={9} /> Sort:</span>
            {([
              { key: 'createdAt' as const, label: 'Newest' },
              { key: 'taskNumber' as const, label: 'Number' },
              { key: 'dueDate' as const, label: 'Due Date' },
              { key: 'priority' as const, label: 'Priority' },
            ]).map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${sortBy === s.key ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Hash size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No tasks match your filters</p>
              <button onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setCategoryFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
                className="text-blue-500 text-xs font-bold mt-2 hover:underline cursor-pointer">
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map(task => (
              <TaskRow key={task._id} task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdateNotes={handleUpdateNotes}
                onEdit={t => setModalTask(t)} />
            ))
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {modalTask !== undefined && (
        <TaskFormModal task={modalTask} onSave={handleSaveModal} onClose={() => setModalTask(undefined)} />
      )}
    </div>
      )}
    </div>
  );
}
