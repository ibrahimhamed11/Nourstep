/**
 * RoadmapBottomSummary — NourStep theme
 */
import { Target, AlertCircle, TrendingUp } from 'lucide-react';
import type { RoadmapTask } from './roadmap.types';
import { TRACKS } from './roadmap.types';

interface Props { tasks: RoadmapTask[] }

export default function RoadmapBottomSummary({ tasks }: Props) {
  const done      = tasks.filter(t => t.status === 'done');
  const blocked   = tasks.filter(t => t.status === 'blocked');
  const inProg    = tasks.filter(t => t.status === 'in-progress');
  const overdue   = tasks.filter(t => t.week < 1 && t.status !== 'done');

  const trackBreakdown = TRACKS.map(tr => ({
    track: tr,
    tasks: tasks.filter(t => t.track === tr.id),
    done:  tasks.filter(t => t.track === tr.id && t.status === 'done'),
  })).filter(x => x.tasks.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">

      {/* Panel 1 — Progress */}
      <div className="card-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-success/10 border border-success/20">
            <TrendingUp size={15} className="text-success" />
          </div>
          <p className="text-heading font-bold text-sm">Progress by Track</p>
        </div>
        <div className="space-y-2.5">
          {trackBreakdown.map(({ track, tasks: tt, done: dd }) => {
            const pct = tt.length ? Math.round((dd.length / tt.length) * 100) : 0;
            return (
              <div key={track.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                    <span className="w-2 h-2 rounded-full" style={{ background: track.color }} />
                    {track.name}
                  </span>
                  <span className="text-[10px] font-bold text-heading">{dd.length}/{tt.length} · {pct}%</span>
                </div>
                <div className="h-1.5 bg-surface dark:bg-navy rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: track.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 2 — Highlights */}
      <div className="card-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-royal/10 dark:bg-bright/10 border border-royal/20 dark:border-bright/20">
            <Target size={15} className="text-royal dark:text-bright" />
          </div>
          <p className="text-heading font-bold text-sm">Highlights</p>
        </div>
        <ul className="space-y-2 text-[11px]">
          <li className="flex items-center justify-between">
            <span className="text-muted">Completed</span>
            <span className="font-bold text-success">{done.length}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted">In Progress</span>
            <span className="font-bold text-royal dark:text-bright">{inProg.length}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted">Blocked</span>
            <span className={`font-bold ${blocked.length > 0 ? 'text-error/80' : 'text-success'}`}>{blocked.length}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted">Total Tasks</span>
            <span className="font-bold text-heading">{tasks.length}</span>
          </li>
        </ul>
      </div>

      {/* Panel 3 — Blockers */}
      <div className="card-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            blocked.length > 0 ? 'bg-error/10 border border-error/20' : 'bg-success/10 border border-success/20'
          }`}>
            <AlertCircle size={15} className={blocked.length > 0 ? 'text-error/70' : 'text-success'} />
          </div>
          <p className="text-heading font-bold text-sm">Blockers</p>
        </div>
        {blocked.length === 0 ? (
          <p className="text-success text-[11px] font-semibold">✓ No blockers — all clear!</p>
        ) : (
          <ul className="space-y-1.5">
            {blocked.map(t => (
              <li key={t.id} className="flex items-start gap-2 text-[11px]">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-error/70 flex-shrink-0" />
                <span className="text-muted">{t.title}</span>
              </li>
            ))}
          </ul>
        )}
        {overdue.length > 0 && (
          <div className="pt-2 border-t border-border/25">
            <p className="text-[10px] font-bold text-warning/80 uppercase tracking-widest mb-1.5">Past Due</p>
            <ul className="space-y-1">
              {overdue.map(t => (
                <li key={t.id} className="text-[11px] text-muted flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-warning/70 flex-shrink-0" />
                  {t.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
