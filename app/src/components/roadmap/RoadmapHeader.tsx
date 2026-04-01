/**
 * RoadmapHeader — Sticky header with progress, search, status filters, tag filters, view toggle
 * No emoji icons — plain text labels
 */
import { Rocket, Search, X, Plus, Filter } from 'lucide-react';
import type { ViewMode, Status, Tag } from './roadmap.types';
import { STATUS_CONFIG, TAG_CONFIG } from './roadmap.types';

interface Props {
  stats: { total: number; done: number; pct: number };
  view: ViewMode;
  setView: (v: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: Status | 'all';
  setStatusFilter: (s: Status | 'all') => void;
  tagFilter: Tag | 'all';
  setTagFilter: (t: Tag | 'all') => void;
  activeTags: Tag[];
  onAddTask: () => void;
}

export default function RoadmapHeader({
  stats, view, setView, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, tagFilter, setTagFilter, activeTags, onAddTask,
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 space-y-2">
        {/* Row 1: Logo, search, new task, progress, view toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Logo / title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
              <Rocket size={17} className="text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-sm">2-Month Sprint Roadmap</div>
              <div className="text-gray-400 text-[10px]">April 1 - June 2, 2026 | Website + Backend + Mobile</div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, TASK-3, BUG-1, #5, tag..."
              className="w-full text-xs border border-gray-200 rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Add task button */}
          <button onClick={onAddTask}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
            <Plus size={14} /> New Task
          </button>

          {/* Overall progress */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-gray-800 font-bold text-sm">{stats.pct}% complete</div>
              <div className="text-gray-400 text-[10px]">{stats.done}/{stats.total} tasks done</div>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
            </div>
          </div>

          {/* View toggle — no emoji */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(['board', 'table', 'parallel'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${view === v ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                {v === 'board' ? 'Board' : v === 'table' ? 'Table' : 'Parallel'}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status filter pills + Tag filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={12} className="text-gray-400" />

          {/* Status filters */}
          <button onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            All Status
          </button>
          {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${statusFilter === s ? cfg.badge : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                <Icon size={10} /> {cfg.label}
              </button>
            );
          })}

          <span className="text-gray-200 mx-1">|</span>

          {/* Tag filters — show only tags that exist in current tasks */}
          <button onClick={() => setTagFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${tagFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            All Tags
          </button>
          {activeTags.map(tag => {
            const cfg = TAG_CONFIG[tag];
            return (
              <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? 'all' : tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${tagFilter === tag ? cfg.cls : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
