/**
 * RoadmapHeader — matches NourStep site theme (bg-navy, dark/light tokens)
 */
import { Rocket, Search, X, Plus, Filter, LayoutDashboard, TableProperties, GitBranch } from 'lucide-react';
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

const VIEW_META = {
  board:    { icon: LayoutDashboard, label: 'Board' },
  table:    { icon: TableProperties,  label: 'Table' },
  parallel: { icon: GitBranch,        label: 'Parallel' },
} as const;

export default function RoadmapHeader({
  stats, view, setView, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, tagFilter, setTagFilter, activeTags, onAddTask,
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_0_0_rgba(61,139,255,0.1),0_4px_24px_-4px_rgba(0,0,0,0.12)]">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 space-y-2.5">

        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal to-bright flex items-center justify-center shadow-lg shadow-royal/30">
              <Rocket size={18} className="text-white" />
            </div>
            <div>
              <p className="text-heading font-bold text-sm">2-Month Sprint Roadmap</p>
              <p className="text-muted text-[10px]">Apr 1 – Jun 2, 2026 · Website · Backend · Mobile</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/60" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, TASK-3, BUG-1, tag…"
              className="w-full text-xs bg-surface/60 dark:bg-darkblue/50 border border-border/50 rounded-xl pl-8 pr-8 py-2 text-heading placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-royal/30 focus:border-royal/40 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-heading cursor-pointer transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* New Task */}
          <button onClick={onAddTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-royal to-bright text-white hover:from-bright hover:to-royal transition-all shadow-md shadow-royal/25 cursor-pointer">
            <Plus size={14} /> New Task
          </button>

          {/* Progress */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-heading font-bold text-sm">{stats.pct}% complete</p>
              <p className="text-muted text-[10px]">{stats.done} / {stats.total} done</p>
            </div>
            <div className="w-28 h-2 bg-surface dark:bg-darkblue rounded-full overflow-hidden border border-border/30">
              <div
                className="h-2 bg-gradient-to-r from-royal to-sky rounded-full transition-all duration-700"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-surface dark:bg-darkblue border border-border/40 rounded-xl p-1">
            {(['board', 'table', 'parallel'] as const).map(v => {
              const { icon: Icon, label } = VIEW_META[v];
              return (
                <button key={v} onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    view === v
                      ? 'bg-gradient-to-r from-royal to-bright text-white shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}>
                  <Icon size={11} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter size={11} className="text-muted/60 mr-1" />

          <button onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-royal/10 text-royal border-royal/25 dark:bg-bright/10 dark:text-bright dark:border-bright/25'
                : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
            }`}>
            All Status
          </button>
          {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  statusFilter === s ? cfg.badge : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
                }`}>
                <Icon size={10} /> {cfg.label}
              </button>
            );
          })}

          <span className="text-border/50 mx-1 select-none">·</span>

          <button onClick={() => setTagFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              tagFilter === 'all'
                ? 'bg-royal/10 text-royal border-royal/25 dark:bg-bright/10 dark:text-bright dark:border-bright/25'
                : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
            }`}>
            All Tags
          </button>
          {activeTags.map(tag => {
            const cfg = TAG_CONFIG[tag];
            return (
              <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? 'all' : tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  tagFilter === tag ? cfg.cls : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
                }`}>
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
