/**
 * RoadmapHeader — Azure DevOps-inspired professional header
 */
import { useState } from 'react';
import {
  Rocket, Search, X, Plus, Filter, LayoutDashboard, TableProperties,
  GitBranch, Home, Briefcase, ChevronRight, Calendar, Layers,
  ChevronDown, SlidersHorizontal, Sun, Moon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ViewMode, Status, Tag, Week, TaskType } from './roadmap.types';
import { STATUS_CONFIG, TAG_CONFIG, WEEKS, TASK_TYPE_CONFIG } from './roadmap.types';

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
  weekFilter: Week | 'all';
  setWeekFilter: (w: Week | 'all') => void;
  typeFilter: TaskType | 'all';
  setTypeFilter: (t: TaskType | 'all') => void;
  activeTags: Tag[];
  onAddTask: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const VIEW_META = {
  board:    { icon: LayoutDashboard, label: 'Board' },
  table:    { icon: TableProperties,  label: 'Backlog' },
  parallel: { icon: GitBranch,        label: 'Sprints' },
} as const;

function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border transition-all cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-[#0078d4]/15 text-[#0078d4] border-[#0078d4]/40 dark:bg-[#2899f5]/15 dark:text-[#2899f5] dark:border-[#2899f5]/40'
          : 'text-muted/80 border-border/30 hover:border-border/60 hover:text-heading bg-transparent'
      }`}
    >
      {children}
    </button>
  );
}

export default function RoadmapHeader({
  stats, view, setView, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, tagFilter, setTagFilter,
  weekFilter, setWeekFilter, typeFilter, setTypeFilter,
  activeTags, onAddTask, theme, onToggleTheme,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFiltersCount = [
    statusFilter !== 'all',
    tagFilter !== 'all',
    weekFilter !== 'all',
    typeFilter !== 'all',
  ].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 bg-navy/98 backdrop-blur-2xl border-b border-border/50"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 4px 16px -4px rgba(0,0,0,0.08)' }}>

      {/* ── Azure-style top organization bar ── */}
      <div className="border-b border-border/30 bg-surface/30 dark:bg-darkblue/30">
        <div className="max-w-screen-2xl mx-auto px-4 h-8 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted/70">
            <Link to="/" className="flex items-center gap-1 hover:text-royal dark:hover:text-bright transition-colors cursor-pointer font-medium">
              <Home size={11} /> NourStep
            </Link>
            <ChevronRight size={9} className="text-border/60" />
            <span className="font-medium text-muted/70">Development</span>
            <ChevronRight size={9} className="text-border/60" />
            <span className="font-semibold text-heading">Sprint Board</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Link to="/"
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-muted/70 hover:text-heading hover:bg-surface/60 transition-all cursor-pointer">
              <Home size={10} /> Home
            </Link>
            <Link to="/business"
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[#0078d4] dark:text-[#2899f5] hover:bg-[#0078d4]/8 dark:hover:bg-[#2899f5]/8 transition-all cursor-pointer">
              <Briefcase size={10} /> Business
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4">

        {/* ── Main toolbar row ── */}
        <div className="flex items-center gap-2 h-12">

          {/* Brand / Project name */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0078d4] to-[#2899f5] flex items-center justify-center shadow-md shadow-[#0078d4]/30">
              <Rocket size={15} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-heading font-bold text-sm leading-tight">NourStep Board</p>
              <p className="text-muted text-[10px] leading-tight">Apr – Jun 2026</p>
            </div>
          </div>

          <div className="w-px h-5 bg-border/40 mx-1 flex-shrink-0" />

          {/* View switcher — Azure-style tab buttons */}
          <div className="flex items-stretch gap-0 h-full">
            {(['board', 'table', 'parallel'] as const).map(v => {
              const { icon: Icon, label } = VIEW_META[v];
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`relative flex items-center gap-1.5 px-3.5 text-[12px] font-medium transition-all cursor-pointer ${
                    view === v
                      ? 'text-[#0078d4] dark:text-[#2899f5] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0078d4] dark:after:bg-[#2899f5] after:rounded-t'
                      : 'text-muted hover:text-heading hover:bg-surface/40 dark:hover:bg-darkblue/40'
                  }`}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-px h-5 bg-border/40 mx-1 flex-shrink-0 hidden sm:block" />

          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-xs hidden sm:block">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, IDs, tags…"
              className="w-full text-[12px] bg-surface/50 dark:bg-darkblue/40 border border-border/40 rounded pl-7 pr-7 py-1.5 text-heading placeholder-muted/40 focus:outline-none focus:ring-1 focus:ring-[#0078d4]/50 focus:border-[#0078d4]/50 dark:focus:ring-[#2899f5]/40 dark:focus:border-[#2899f5]/40 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted/50 hover:text-heading cursor-pointer transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium border transition-all cursor-pointer flex-shrink-0 ${
              filtersOpen || activeFiltersCount > 0
                ? 'bg-[#0078d4]/10 text-[#0078d4] border-[#0078d4]/30 dark:bg-[#2899f5]/10 dark:text-[#2899f5] dark:border-[#2899f5]/30'
                : 'text-muted border-border/40 hover:border-border/60 hover:text-heading'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0078d4] dark:bg-[#2899f5] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown size={11} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className="ml-auto flex-shrink-0" />

          {/* Progress pill */}
          <div className="hidden md:flex items-center gap-2 bg-surface/50 dark:bg-darkblue/40 border border-border/30 rounded px-3 py-1.5 flex-shrink-0">
            <div className="w-20 h-1.5 bg-border/30 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-700 bg-gradient-to-r from-[#0078d4] to-[#2899f5]"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-heading">{stats.pct}%</span>
            <span className="text-[10px] text-muted">{stats.done}/{stats.total}</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center justify-center w-8 h-8 rounded text-muted border border-border/40 hover:border-border/60 hover:text-heading transition-all cursor-pointer flex-shrink-0"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* New Task CTA */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[12px] font-semibold bg-[#0078d4] hover:bg-[#106ebe] dark:bg-[#2899f5] dark:hover:bg-[#1e85d8] text-white transition-all shadow-sm shadow-[#0078d4]/25 cursor-pointer flex-shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Work Item</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* ── Filters Panel (collapsible, Azure-style filter bar) ── */}
        {filtersOpen && (
          <div className="border-t border-border/30 py-2.5 space-y-2">

            {/* Search (mobile) */}
            <div className="relative sm:hidden mb-2">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tasks, IDs, tags…"
                className="w-full text-[12px] bg-surface/50 dark:bg-darkblue/40 border border-border/40 rounded pl-7 pr-7 py-1.5 text-heading placeholder-muted/40 focus:outline-none focus:ring-1 focus:ring-[#0078d4]/50 focus:border-[#0078d4]/50 transition-all"
              />
            </div>

            {/* Status row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest w-14 flex-shrink-0 flex items-center gap-1">
                <Filter size={9} /> State
              </span>
              <FilterPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterPill>
              {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
                const cfg = STATUS_CONFIG[s];
                const Icon = cfg.icon;
                return (
                  <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}>
                    <Icon size={10} /> {cfg.label}
                  </FilterPill>
                );
              })}
            </div>

            {/* Week row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest w-14 flex-shrink-0 flex items-center gap-1">
                <Calendar size={9} /> Sprint
              </span>
              <FilterPill active={weekFilter === 'all'} onClick={() => setWeekFilter('all')}>All</FilterPill>
              {WEEKS.map(w => (
                <FilterPill key={w.week} active={weekFilter === w.week} onClick={() => setWeekFilter(weekFilter === w.week ? 'all' : w.week)}>
                  {w.label}
                </FilterPill>
              ))}
            </div>

            {/* Type row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest w-14 flex-shrink-0 flex items-center gap-1">
                <Layers size={9} /> Type
              </span>
              <FilterPill active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>All</FilterPill>
              {(Object.keys(TASK_TYPE_CONFIG) as TaskType[]).map(type => {
                const cfg = TASK_TYPE_CONFIG[type];
                const Icon = cfg.icon;
                return (
                  <FilterPill key={type} active={typeFilter === type} onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}>
                    <Icon size={10} /> {cfg.label}
                  </FilterPill>
                );
              })}
            </div>

            {/* Tags row */}
            {activeTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest w-14 flex-shrink-0">Tags</span>
                <FilterPill active={tagFilter === 'all'} onClick={() => setTagFilter('all')}>All</FilterPill>
                {activeTags.map(tag => {
                  const cfg = TAG_CONFIG[tag];
                  return (
                    <FilterPill key={tag} active={tagFilter === tag} onClick={() => setTagFilter(tagFilter === tag ? 'all' : tag)}>
                      {cfg.label}
                    </FilterPill>
                  );
                })}
              </div>
            )}

          </div>
        )}
      </div>
    </header>
  );
}
