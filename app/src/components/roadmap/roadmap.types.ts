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
  id: string;
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
}

/* ─────────────────────────────────────────────────────────────
   TAG CONFIG — plain text, no emoji
───────────────────────────────────────────────────────────── */
export const TAG_CONFIG: Record<Tag, { label: string; cls: string }> = {
  frontend:    { label: 'Frontend',     cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  backend:     { label: 'Backend',      cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  mobile:      { label: 'Mobile',       cls: 'bg-purple-50 text-purple-600 border-purple-200' },
  devops:      { label: 'DevOps',       cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  firebase:    { label: 'Firebase',     cls: 'bg-orange-50 text-orange-600 border-orange-200' },
  aws:         { label: 'AWS',          cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  auth:        { label: 'Auth',         cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  payment:     { label: 'Payment',      cls: 'bg-pink-50 text-pink-600 border-pink-200' },
  ui:          { label: 'UI',           cls: 'bg-sky-50 text-sky-600 border-sky-200' },
  api:         { label: 'API',          cls: 'bg-teal-50 text-teal-600 border-teal-200' },
  database:    { label: 'Database',     cls: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  testing:     { label: 'Testing',      cls: 'bg-lime-50 text-lime-700 border-lime-200' },
  deploy:      { label: 'Deploy',       cls: 'bg-rose-50 text-rose-600 border-rose-200' },
  security:    { label: 'Security',     cls: 'bg-red-50 text-red-600 border-red-200' },
  performance: { label: 'Performance',  cls: 'bg-violet-50 text-violet-600 border-violet-200' },
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
  task:        { label: 'Task',        prefix: 'TASK', icon: SquareKanban, cls: 'text-blue-600',   badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  bug:         { label: 'Bug',         prefix: 'BUG',  icon: Bug,          cls: 'text-red-600',    badge: 'bg-red-50 text-red-600 border-red-200' },
  feature:     { label: 'Feature',     prefix: 'FEAT', icon: Lightbulb,    cls: 'text-amber-600',  badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  improvement: { label: 'Improvement', prefix: 'IMP',  icon: Sparkles,     cls: 'text-purple-600', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
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
  done:          { label: 'Done',        icon: CheckCircle2, cls: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'in-progress': { label: 'In Progress', icon: Clock,        cls: 'text-blue-500',    badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  todo:          { label: 'To Do',       icon: Circle,       cls: 'text-gray-300',    badge: 'bg-gray-100 text-gray-500 border-gray-200' },
  blocked:       { label: 'Blocked',     icon: AlertCircle,  cls: 'text-red-400',     badge: 'bg-red-100 text-red-600 border-red-200' },
};

export const STATUS_CYCLE: Status[] = ['todo', 'in-progress', 'done', 'blocked'];

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
