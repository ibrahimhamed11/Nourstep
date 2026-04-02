/**
 * RoadmapStats — Azure DevOps-inspired stats, milestones, and track filter
 */
import {
  CheckCircle2, ArrowRight, Flag, Lock, CreditCard,
  Brain, Users2, Monitor, Rocket, Star, BarChart3,
  Clock, TrendingUp, AlertOctagon, Activity,
} from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACK_CONFIG, getStats } from './roadmap.types';

interface MilestoneDef {
  isoDate: string;
  label: string;
  icon: React.ElementType;
  color: string;
  weeks: number[];
}

const MILESTONE_DEFS: MilestoneDef[] = [
  { isoDate: '2026-04-01', label: 'Sprint Start',          icon: Rocket,     color: '#0078d4', weeks: []        },
  { isoDate: '2026-04-14', label: 'Auth + APIs live',       icon: Lock,       color: '#10B981', weeks: [1, 2]    },
  { isoDate: '2026-04-28', label: 'Courses + Payments',     icon: CreditCard, color: '#8B5CF6', weeks: [3, 4]    },
  { isoDate: '2026-05-05', label: 'AI + Gamification',      icon: Brain,      color: '#A855F7', weeks: [5]       },
  { isoDate: '2026-05-12', label: 'Live Sessions + Admin',  icon: Monitor,    color: '#F97316', weeks: [6]       },
  { isoDate: '2026-05-19', label: 'Parent + i18n + QA',     icon: Users2,     color: '#22C55E', weeks: [7]       },
  { isoDate: '2026-05-26', label: 'Staging + Perf',         icon: BarChart3,  color: '#F59E0B', weeks: [8]       },
  { isoDate: '2026-06-02', label: 'MVP LAUNCH',             icon: Star,       color: '#EF4444', weeks: [1,2,3,4,5,6,7,8] },
];

function formatMilestoneDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getMilestoneState(def: MilestoneDef, tasks: RoadmapTask[]) {
  if (def.weeks.length === 0) {
    const today = new Date();
    const [y, mo, d] = def.isoDate.split('-').map(Number);
    const passed = new Date(y, mo - 1, d) <= today;
    return { pct: passed ? 100 : 0, done: passed, inProgress: false, total: 0, doneCount: 0 };
  }
  const scoped = tasks.filter(t => def.weeks.includes(t.week));
  const total = scoped.length;
  if (total === 0) return { pct: 0, done: false, inProgress: false, total: 0, doneCount: 0 };
  const doneCount = scoped.filter(t => t.status === 'done').length;
  const inProg    = scoped.filter(t => t.status === 'in-progress').length;
  const pct       = Math.round((doneCount / total) * 100);
  return { pct, done: doneCount === total, inProgress: inProg > 0 && doneCount < total, total, doneCount };
}

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
  setActiveTrack: (t: Track | 'all') => void;
}

export default function RoadmapStats({ tasks, activeTrack, setActiveTrack }: Props) {
  const overall = getStats(tasks);
  const trackStats = (Object.keys(TRACK_CONFIG) as Track[]).map(track => ({
    track,
    ...getStats(tasks.filter(t => t.track === track)),
    ...TRACK_CONFIG[track],
  }));

  return (
    <div className="space-y-4">

      {/* KPI summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Work Items',
            value: overall.total,
            icon: Activity,
            color: '#0078d4',
            sub: 'across all sprints',
          },
          {
            label: 'Completed',
            value: overall.done,
            icon: CheckCircle2,
            color: '#22C97A',
            sub: `${overall.pct}% done`,
          },
          {
            label: 'In Progress',
            value: overall.inProgress,
            icon: TrendingUp,
            color: '#F59E0B',
            sub: 'active this sprint',
          },
          {
            label: 'Blocked',
            value: overall.blocked,
            icon: AlertOctagon,
            color: overall.blocked > 0 ? '#FF4D4D' : '#22C97A',
            sub: overall.blocked > 0 ? 'needs attention' : 'all clear',
          },
        ].map(kpi => {
          const KIcon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="relative overflow-hidden rounded-lg border border-border/40 bg-[var(--theme-card)] p-4"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg" style={{ background: kpi.color }} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-muted/70 font-medium mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold leading-none" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-[10px] text-muted/50 mt-1.5">{kpi.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ background: `${kpi.color}12`, border: `1px solid ${kpi.color}25` }}>
                  <KIcon size={16} style={{ color: kpi.color }} />
                </div>
              </div>
              {kpi.label === 'Completed' && (
                <div className="mt-3 h-1 bg-border/20 rounded-full overflow-hidden">
                  <div className="h-1 rounded-full transition-all duration-700"
                    style={{ width: `${overall.pct}%`, background: kpi.color }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Track cards with filter */}
      <div className="rounded-lg border border-border/40 bg-[var(--theme-card)] overflow-hidden"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-surface/30 dark:bg-darkblue/30">
          <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">Track Progress</span>
          <span className="text-[10px] text-muted/40 ml-1">— click to filter</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/30">
          {trackStats.map(t => {
            const TrackIcon = t.icon;
            const isActive = activeTrack === t.track;
            return (
              <button
                key={t.track}
                onClick={() => setActiveTrack(activeTrack === t.track ? 'all' : t.track)}
                className={`relative flex flex-col items-start gap-2 p-4 text-left transition-all duration-150 cursor-pointer group ${
                  isActive ? 'bg-surface/60 dark:bg-darkblue/60' : 'hover:bg-surface/40 dark:hover:bg-darkblue/30'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-sm" style={{ background: t.color }} />
                )}
                <div className="flex items-center gap-2 w-full">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>
                    <TrackIcon size={12} style={{ color: t.color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-muted/80 truncate">{t.label}</span>
                  {isActive && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${t.color}15`, color: t.color }}>
                      Active
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <div className="flex items-end justify-between mb-1.5">
                    <span className="text-xl font-bold leading-none" style={{ color: t.color }}>{t.pct}%</span>
                    <span className="text-[10px] text-muted/50">{t.done}/{t.total}</span>
                  </div>
                  <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${t.color}80, ${t.color})` }} />
                  </div>
                  <div className="flex gap-3 mt-1.5 text-[9px]">
                    <span className="text-success/80">✓ {t.done}</span>
                    <span style={{ color: `${t.color}cc` }}>▶ {t.inProgress}</span>
                    <span className="text-muted/40">○ {t.todo}</span>
                    {t.blocked > 0 && <span className="text-error/70">⊘ {t.blocked}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {activeTrack !== 'all' && (
          <div className="px-4 py-2 border-t border-border/30 bg-surface/20 dark:bg-darkblue/20">
            <button
              onClick={() => setActiveTrack('all')}
              className="text-[11px] text-[#0078d4] dark:text-[#2899f5] hover:underline cursor-pointer font-medium"
            >
              ← Show all tracks
            </button>
          </div>
        )}
      </div>

      {/* Milestones timeline */}
      <div className="rounded-lg border border-border/40 bg-[var(--theme-card)] overflow-hidden"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-surface/30 dark:bg-darkblue/30">
          <Flag size={12} className="text-[#0078d4] dark:text-[#2899f5]" />
          <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">Sprint Milestones</span>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center overflow-x-auto pb-2 gap-0 scrollbar-none">
            {MILESTONE_DEFS.map((m, i, arr) => {
              const { pct, done, inProgress, total, doneCount } = getMilestoneState(m, tasks);
              const active = done || inProgress || pct > 0;
              const MIcon = m.icon;
              const displayDate = formatMilestoneDate(m.isoDate);

              return (
                <div key={m.isoDate} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1.5 w-[105px]">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${active ? '' : 'opacity-35'}`}
                      style={{
                        background: `${m.color}12`,
                        border: `1.5px solid ${m.color}${active ? '50' : '20'}`,
                        ...(active ? { boxShadow: `0 0 12px ${m.color}25` } : {}),
                      }}>
                      <MIcon size={15} style={{ color: m.color }} />
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold text-[10px] leading-tight ${active ? 'text-heading' : 'text-muted/40'}`}>
                        {m.label}
                      </p>
                      <p className={`text-[9px] mt-0.5 ${active ? 'text-muted/60' : 'text-muted/30'}`}>
                        {displayDate}
                      </p>
                    </div>
                    {total > 0 && (
                      <div className="w-full px-1.5">
                        <div className="h-1 bg-border/20 rounded-full overflow-hidden">
                          <div
                            className="h-1 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: m.color }}
                          />
                        </div>
                        <p className="text-[8px] text-center mt-0.5 text-muted/50">
                          {doneCount}/{total}
                        </p>
                      </div>
                    )}
                    {done && <CheckCircle2 size={11} className="text-success" />}
                    {inProgress && !done && <Clock size={11} className="text-[#0078d4] dark:text-[#2899f5] animate-pulse" />}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center mb-8 flex-shrink-0 mx-0.5">
                      <div className={`h-px w-4 ${done ? 'bg-success/50' : 'bg-border/30'}`} />
                      <ArrowRight size={10} className={done ? 'text-success/50' : 'text-border/40'} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
