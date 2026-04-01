/**
 * RoadmapStats — Track stats cards + Milestone strip + Track filter pills
 */
import {
  CheckCircle2, ArrowRight, Flag, Lock, CreditCard,
  Brain, Users2, Monitor, Rocket, Star, BarChart3,
} from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACK_CONFIG, getStats } from './roadmap.types';

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
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {trackStats.map(t => {
          const TrackIcon = t.icon;
          return (
            <button key={t.track} onClick={() => setActiveTrack(activeTrack === t.track ? 'all' : t.track)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer hover:shadow-md ${activeTrack === t.track ? `${t.bg} ${t.border} shadow-md` : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <TrackIcon size={14} style={{ color: t.color }} />
                <span className="text-gray-700 font-bold text-xs">{t.label}</span>
              </div>
              <div className="text-2xl font-black mb-1" style={{ color: t.color }}>{t.pct}%</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-1.5 rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
              </div>
              <div className="flex gap-2 text-[10px] text-gray-400">
                <span className="text-emerald-600 font-bold">✓ {t.done}</span>
                <span className="text-blue-500 font-bold">▶ {t.inProgress}</span>
                <span>○ {t.todo}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Milestone Strip ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
          <Flag size={14} className="text-blue-500" /> Key Milestones
        </h2>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {[
            { date: 'Apr 1',  label: 'Sprint Start',         icon: Rocket,     color: '#2563EB', done: true },
            { date: 'Apr 14', label: 'Auth + User APIs live', icon: Lock,       color: '#10B981', done: true },
            { date: 'Apr 28', label: 'Courses + Payments',    icon: CreditCard, color: '#8B5CF6', done: false },
            { date: 'May 5',  label: 'AI + Gamification',     icon: Brain,      color: '#A855F7', done: false },
            { date: 'May 12', label: 'Live Sessions + Admin', icon: Monitor,    color: '#F97316', done: false },
            { date: 'May 19', label: 'Parent + i18n + QA',    icon: Users2,     color: '#22C55E', done: false },
            { date: 'May 26', label: 'Staging Deploy + Perf', icon: BarChart3,  color: '#F59E0B', done: false },
            { date: 'Jun 2',  label: '🎉 LAUNCH — MVP',       icon: Star,       color: '#EF4444', done: false },
          ].map((m, i, arr) => {
            const MIcon = m.icon;
            return (
              <div key={i} className="flex items-center gap-0 flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5 w-28">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${m.done ? 'opacity-100' : 'opacity-60'}`}
                    style={{ backgroundColor: m.color + '18', border: `2px solid ${m.color}40` }}>
                    <MIcon size={15} style={{ color: m.color }} />
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 font-bold text-[10px]">{m.label}</div>
                    <div className="text-gray-400 text-[9px]">{m.date}</div>
                  </div>
                  {m.done && <CheckCircle2 size={11} className="text-emerald-500" />}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={14} className="text-gray-200 mb-6 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Track filter pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setActiveTrack('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeTrack === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
          All tracks
        </button>
        {(Object.keys(TRACK_CONFIG) as Track[]).map(track => {
          const tc = TRACK_CONFIG[track];
          const TIcon = tc.icon;
          return (
            <button key={track} onClick={() => setActiveTrack(activeTrack === track ? 'all' : track)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeTrack === track ? `${tc.bg} ${tc.border}` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
              style={activeTrack === track ? { color: tc.color } : {}}>
              <TIcon size={12} /> {tc.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
