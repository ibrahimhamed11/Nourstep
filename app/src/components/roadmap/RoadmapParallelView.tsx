/**
 * RoadmapParallelView — Sprint parallel track view (rich light-theme colors)
 */
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACKS, WEEKS, getStats } from './roadmap.types';
import RoadmapTaskCard from './RoadmapTaskCard';

interface Props {
  tasks: RoadmapTask[];
  activeTrack: Track | 'all';
  onToggleStatus: (id: string) => void;
  onEdit: (task: RoadmapTask) => void;
  onDelete: (id: string) => void;
}

export default function RoadmapParallelView({ tasks, activeTrack, onToggleStatus, onEdit, onDelete }: Props) {
  const visibleTracks = activeTrack === 'all'
    ? TRACKS
    : TRACKS.filter(t => t.id === activeTrack);

  return (
    <div className="space-y-4">
      {WEEKS.map(week => {
        const weekTasks = tasks.filter(t => t.week === week.week);
        if (weekTasks.length === 0) return null;

        const weekStats = getStats(weekTasks);
        const pct = weekStats.pct;

        return (
          <div
            key={week.week}
            className="rounded-lg overflow-hidden"
            style={{
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              background: '#fff',
            }}
          >
            {/* ── Week header ── */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b"
              style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
            >
              <div>
                <span className="text-xs font-bold" style={{ color: '#1e293b' }}>
                  {week.label}
                </span>
                <span className="text-[10px] ml-2" style={{ color: '#94a3b8' }}>
                  {week.dates}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                {/* Status counts */}
                <div className="flex items-center gap-1.5 text-[9px] font-semibold">
                  {weekStats.done > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac' }}>
                      ✓ {weekStats.done} done
                    </span>
                  )}
                  {weekStats.inProgress > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: '#eff6ff', color: '#0078d4', border: '1px solid #93c5fd' }}>
                      ▶ {weekStats.inProgress} active
                    </span>
                  )}
                  {weekStats.blocked > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                      ⊘ {weekStats.blocked} blocked
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? '#16a34a' : '#0078d4',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>
                    {weekStats.done}/{weekStats.total}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Track columns ── */}
            <div
              className={`grid ${
                visibleTracks.length === 1 ? 'grid-cols-1' :
                visibleTracks.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 lg:grid-cols-4'
              }`}
              style={{ gap: '1px', background: '#e2e8f0' }}
            >
              {visibleTracks.map(track => {
                const trackWeekTasks = weekTasks.filter(t => t.track === track.id);
                if (trackWeekTasks.length === 0 && activeTrack !== 'all') return null;

                const tStats = getStats(trackWeekTasks);

                return (
                  <div
                    key={track.id}
                    className="flex flex-col min-w-0"
                    style={{ background: '#fff' }}
                  >
                    {/* Track label row */}
                    <div
                      className="flex items-center justify-between px-3 py-2 border-b"
                      style={{
                        borderColor: '#e2e8f0',
                        borderLeftColor: track.color,
                        borderLeftWidth: 3,
                        background: `${track.color}08`,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: track.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: track.color }}>
                          {track.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold">
                        {tStats.blocked > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full"
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                            ⊘{tStats.blocked}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-sm"
                          style={{ background: '#f1f5f9', color: '#64748b' }}>
                          {tStats.done}/{tStats.total}
                        </span>
                      </div>
                    </div>

                    {/* Track progress bar */}
                    <div className="h-[2px]" style={{ background: '#f1f5f9' }}>
                      <div
                        className="h-[2px] transition-all duration-700"
                        style={{
                          width: `${tStats.pct}%`,
                          background: track.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>

                    {/* Tasks */}
                    <div className="p-2 space-y-1.5 flex-1" style={{ minHeight: 80 }}>
                      {trackWeekTasks.length === 0 ? (
                        <p className="text-center text-[10px] py-6" style={{ color: '#cbd5e1' }}>
                          No items
                        </p>
                      ) : (
                        trackWeekTasks.map(t => (
                          <RoadmapTaskCard
                            key={t.id}
                            task={t}
                            allTasks={tasks}
                            onToggleStatus={onToggleStatus}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
