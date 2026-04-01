/**
 * RoadmapStats — Track cards + Milestones + Track pills (NourStep theme)
 */
import {
  CheckCircle2, ArrowRight, Flag, Lock, CreditCard,
  Brain, Users2, Monitor, Rocket, Star, BarChart3,
  Clock,
} from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACK_CONFIG, getStats } from './roadmap.types';

/* ── Milestone definitions — weeks drive completion state ────────────────── */
interface MilestoneDef {
  isoDate: string;
  label: string;
  icon: React.ElementType;
  color: string;
  /** Which week numbers count toward this milestone's completion.
   *  Empty = date-only milestone (no tasks gate it). */
  weeks: number[];
}

const MILESTONE_DEFS: MilestoneDef[] = [
  { isoDate: '2026-04-01', label: 'Sprint Start',          icon: Rocket,     color: '#3B82F6', weeks: []        },
  { isoDate: '2026-04-14', label: 'Auth + APIs live',       icon: Lock,       color: '#10B981', weeks: [1, 2]    },
  { isoDate: '2026-04-28', label: 'Courses + Payments',     icon: CreditCard, color: '#8B5CF6', weeks: [3, 4]    },
  { isoDate: '2026-05-05', label: 'AI + Gamification',      icon: Brain,      color: '#A855F7', weeks: [5]       },
  { isoDate: '2026-05-12', label: 'Live Sessions + Admin',  icon: Monitor,    color: '#F97316', weeks: [6]       },
  { isoDate: '2026-05-19', label: 'Parent + i18n + QA',     icon: Users2,     color: '#22C55E', weeks: [7]       },
  { isoDate: '2026-05-26', label: 'Staging + Perf',         icon: BarChart3,  color: '#F59E0B', weeks: [8]       },
  { isoDate: '2026-06-02', label: 'MVP LAUNCH',             icon: Star,       color: '#EF4444', weeks: [1,2,3,4,5,6,7,8] },
];

/** Format an ISO date string (YYYY-MM-DD) to a short human label, e.g. "Apr 1" */
function formatMilestoneDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Derive completion state for a milestone from the actual task list */
function getMilestoneState(
  def: MilestoneDef,
  tasks: RoadmapTask[],
): { pct: number; done: boolean; inProgress: boolean; total: number; doneCount: number } {
  if (def.weeks.length === 0) {
    // date-only milestone — "Sprint Start"
    const today = new Date();
    const [y, mo, d] = def.isoDate.split('-').map(Number);
    const mDate = new Date(y, mo - 1, d);
    const passed = mDate <= today;
    return { pct: passed ? 100 : 0, done: passed, inProgress: false, total: 0, doneCount: 0 };
  }
  const scoped = tasks.filter(t => def.weeks.includes(t.week));
  const total = scoped.length;
  if (total === 0) return { pct: 0, done: false, inProgress: false, total: 0, doneCount: 0 };
  const doneCount  = scoped.filter(t => t.status === 'done').length;
  const inProg     = scoped.filter(t => t.status === 'in-progress').length;
  const pct        = Math.round((doneCount / total) * 100);
  return { pct, done: doneCount === total, inProgress: inProg > 0 && doneCount < total, total, doneCount };
}

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
  setActiveTrack: (t: Track | 'all') => void;
}

export default function RoadmapStats({ tasks, activeTrack, setActiveTrack }: Props) {
  const trackStats = (Object.keys(TRACK_CONFIG) as Track[]).map(track => ({
    track,
    ...getStats(tasks.filter(t => t.track === track)),
    ...TRACK_CONFIG[track],
  }));

  return (
    <>
      {/* ── Track stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {trackStats.map(t => {
          const TrackIcon = t.icon;
          const isActive = activeTrack === t.track;
          return (
            <button
              key={t.track}
              onClick={() => setActiveTrack(activeTrack === t.track ? 'all' : t.track)}
              className={`card-dark rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                isActive ? 'ring-2' : ''
              }`}
              style={isActive ? { boxShadow: `0 0 0 2px ${t.color}50, 0 8px 32px ${t.color}15` } : {}}
            >
              {/* Glow accent top-right */}
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{ background: t.color }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}>
                    <TrackIcon size={13} style={{ color: t.color }} />
                  </div>
                  <span className="text-muted font-semibold text-xs">{t.label}</span>
                </div>
                <div className="text-3xl font-black mb-2" style={{ color: t.color }}>{t.pct}%</div>
                <div className="h-1.5 bg-surface dark:bg-navy rounded-full overflow-hidden mb-2.5 border border-border/20">
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${t.color}90, ${t.color})` }} />
                </div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-success font-bold">✓ {t.done}</span>
                  <span className="font-bold" style={{ color: t.color }}>▶ {t.inProgress}</span>
                  <span className="text-muted/60">○ {t.todo}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Milestones ── */}
      <div className="card-dark rounded-2xl p-5">
        <h2 className="text-heading font-bold text-sm mb-5 flex items-center gap-2">
          <Flag size={14} className="text-royal dark:text-bright" /> Key Milestones
        </h2>
        <div className="flex items-start overflow-x-auto pb-2 gap-0 scrollbar-none">
          {MILESTONE_DEFS.map((m, i, arr) => {
            const { pct, done, inProgress, total, doneCount } = getMilestoneState(m, tasks);
            const active = done || inProgress || pct > 0;
            const MIcon  = m.icon;
            const displayDate = formatMilestoneDate(m.isoDate);

            return (
              <div key={m.isoDate} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5 w-[110px]">
                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'ring-2' : 'opacity-40'}`}
                    style={{
                      background: `${m.color}15`,
                      border: `1.5px solid ${m.color}${active ? '60' : '25'}`,
                      ...(active ? { boxShadow: `0 0 14px ${m.color}30` } : {}),
                    }}>
                    <MIcon size={16} style={{ color: m.color }} />
                  </div>

                  {/* Label + date */}
                  <div className="text-center">
                    <p className={`font-bold text-[10px] leading-tight ${active ? 'text-heading' : 'text-muted/50'}`}>
                      {m.label}
                    </p>
                    <p className={`text-[9px] mt-0.5 ${active ? 'text-muted' : 'text-muted/40'}`}>
                      {displayDate}
                    </p>
                  </div>

                  {/* Progress bar (only when tasks are scoped) */}
                  {total > 0 && (
                    <div className="w-full px-1">
                      <div className="h-1 bg-surface dark:bg-navy rounded-full overflow-hidden border border-border/20">
                        <div
                          className="h-1 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}
                        />
                      </div>
                      <p className="text-[8px] text-center mt-0.5 text-muted/60 font-medium">
                        {doneCount}/{total}
                      </p>
                    </div>
                  )}

                  {/* Status badge */}
                  {done       && <CheckCircle2 size={11} className="text-success" />}
                  {inProgress && !done && <Clock size={11} className="text-bright animate-pulse" />}
                </div>
                {i < arr.length - 1 && <ArrowRight size={13} className="text-border/60 mb-10 flex-shrink-0 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Track filter pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setActiveTrack('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTrack === 'all'
              ? 'bg-royal/10 text-royal border-royal/25 dark:bg-bright/10 dark:text-bright dark:border-bright/25'
              : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
          }`}>
          All Tracks
        </button>
        {(Object.keys(TRACK_CONFIG) as Track[]).map(track => {
          const tc = TRACK_CONFIG[track];
          const TIcon = tc.icon;
          const isActive = activeTrack === track;
          return (
            <button key={track} onClick={() => setActiveTrack(activeTrack === track ? 'all' : track)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isActive ? 'shadow-sm' : 'text-muted border-border/40 hover:border-royal/25 hover:text-royal dark:hover:text-bright'
              }`}
              style={isActive ? { background: `${tc.color}12`, borderColor: `${tc.color}40`, color: tc.color } : {}}>
              <TIcon size={12} style={isActive ? { color: tc.color } : {}} />
              {tc.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
