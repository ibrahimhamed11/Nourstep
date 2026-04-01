/**
 * Roadmap Module — Shared Types, Constants & Configs
 */
import {
  CheckCircle2, Circle, Clock, AlertCircle,
  Globe, Server, Smartphone, Layers,
  Bug, Lightbulb, Sparkles, SquareKanban,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   CORE TYPES
───────────────────────────────────────────────────────────── */
export type Status = 'done' | 'in-progress' | 'todo' | 'blocked';
export type Track = 'website' | 'backend' | 'mobile' | 'devops';
export type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement';
export type ViewMode = 'board' | 'table' | 'parallel';
export type Tag = 'frontend' | 'backend' | 'mobile' | 'devops' | 'firebase' | 'aws' | 'auth' | 'payment' | 'ui' | 'api' | 'database' | 'testing' | 'deploy' | 'security' | 'performance';

export const DEFAULT_ASSIGNEE = 'Dev Ibrahim Hamed';

export interface RoadmapTask {
  /** Frontend display id e.g. "b1-1" or "TASK-42" */
  id: string;
  /** MongoDB _id from backend (set when loaded from API) */
  _id?: string;
  taskNumber: number;
  taskType: TaskType;
  title: string;
  desc: string;
  status: Status;
  track: Track;
  week: Week;
  parallel?: string[];
  blockedBy?: string[];
  estimate: string;
  assignee: string;
  tags?: Tag[];
  completedAt?: string | null;
}

/* ─────────────────────────────────────────────────────────────
   TAG CONFIG — plain text, no emoji
───────────────────────────────────────────────────────────── */
export const TAG_CONFIG: Record<Tag, { label: string; cls: string }> = {
  frontend:    { label: 'Frontend',     cls: 'bg-sky/10 text-sky border-sky/30' },
  backend:     { label: 'Backend',      cls: 'bg-success/10 text-success border-success/30' },
  mobile:      { label: 'Mobile',       cls: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  devops:      { label: 'DevOps',       cls: 'bg-warning/10 text-warning border-warning/30' },
  firebase:    { label: 'Firebase',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  aws:         { label: 'AWS',          cls: 'bg-warning/10 text-warning border-warning/30' },
  auth:        { label: 'Auth',         cls: 'bg-bright/10 text-bright border-bright/30' },
  payment:     { label: 'Payment',      cls: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  ui:          { label: 'UI',           cls: 'bg-sky/10 text-sky border-sky/30' },
  api:         { label: 'API',          cls: 'bg-success/10 text-success border-success/30' },
  database:    { label: 'Database',     cls: 'bg-royal/10 text-bright border-bright/30' },
  testing:     { label: 'Testing',      cls: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
  deploy:      { label: 'Deploy',       cls: 'bg-error/10 text-error border-error/30' },
  security:    { label: 'Security',     cls: 'bg-error/10 text-error border-error/30' },
  performance: { label: 'Performance',  cls: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
};

/* ─────────────────────────────────────────────────────────────
   WEEK LABELS
───────────────────────────────────────────────────────────── */
export const WEEKS: { week: Week; label: string; dates: string }[] = [
  { week: 1, label: 'Week 1', dates: 'Apr 1–7' },
  { week: 2, label: 'Week 2', dates: 'Apr 8–14' },
  { week: 3, label: 'Week 3', dates: 'Apr 15–21' },
  { week: 4, label: 'Week 4', dates: 'Apr 22–28' },
  { week: 5, label: 'Week 5', dates: 'Apr 29–May 5' },
  { week: 6, label: 'Week 6', dates: 'May 6–12' },
  { week: 7, label: 'Week 7', dates: 'May 13–19' },
  { week: 8, label: 'Week 8', dates: 'May 20–31' },
];

/* ─────────────────────────────────────────────────────────────
   TASK TYPE CONFIG
───────────────────────────────────────────────────────────── */
export const TASK_TYPE_CONFIG: Record<TaskType, { label: string; prefix: string; icon: React.ElementType; cls: string; badge: string }> = {
  task:        { label: 'Task',        prefix: 'TASK', icon: SquareKanban, cls: 'text-bright',          badge: 'bg-bright/10 text-bright border-bright/30' },
  bug:         { label: 'Bug',         prefix: 'BUG',  icon: Bug,          cls: 'text-error',            badge: 'bg-error/10 text-error border-error/30' },
  feature:     { label: 'Feature',     prefix: 'FEAT', icon: Lightbulb,    cls: 'text-warning',          badge: 'bg-warning/10 text-warning border-warning/30' },
  improvement: { label: 'Improvement', prefix: 'IMP',  icon: Sparkles,     cls: 'text-violet-400',       badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
};

/* ─────────────────────────────────────────────────────────────
   TRACK CONFIG
───────────────────────────────────────────────────────────── */
export const TRACK_CONFIG: Record<Track, { label: string; icon: React.ElementType; color: string; bg: string; border: string; dot: string }> = {
  website:  { label: 'Website / Frontend', icon: Globe,      color: '#2563EB', bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-500' },
  backend:  { label: 'Backend / API',      icon: Server,     color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  mobile:   { label: 'Mobile App',         icon: Smartphone, color: '#8B5CF6', bg: 'bg-purple-50',  border: 'border-purple-200',  dot: 'bg-purple-500' },
  devops:   { label: 'DevOps / Infra',     icon: Layers,     color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500' },
};

/* ─────────────────────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────────────────────── */
export const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; cls: string; badge: string }> = {
  done:          { label: 'Done',        icon: CheckCircle2, cls: 'text-success',    badge: 'bg-success/10 text-success border-success/30' },
  'in-progress': { label: 'In Progress', icon: Clock,        cls: 'text-bright',     badge: 'bg-bright/10 text-bright border-bright/30' },
  todo:          { label: 'To Do',       icon: Circle,       cls: 'text-muted',      badge: 'bg-surface text-muted border-border/40' },
  blocked:       { label: 'Blocked',     icon: AlertCircle,  cls: 'text-error',      badge: 'bg-error/10 text-error border-error/30' },
};

export const STATUS_CYCLE: Status[] = ['todo', 'in-progress', 'done', 'blocked'];

/* ─────────────────────────────────────────────────────────────
   TRACKS — convenience array for components
───────────────────────────────────────────────────────────── */
export const TRACKS: { id: Track; name: string; color: string }[] = (
  Object.keys(TRACK_CONFIG) as Track[]
).map(key => ({
  id: key,
  name: TRACK_CONFIG[key].label,
  color: TRACK_CONFIG[key].color,
}));

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
export function taskDisplayId(task: RoadmapTask): string {
  return `${TASK_TYPE_CONFIG[task.taskType].prefix}-${task.taskNumber}`;
}

export function getStats(tasks: RoadmapTask[]) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const blocked = tasks.filter(t => t.status === 'blocked').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, blocked, todo: total - done - inProgress - blocked, pct };
}
