/**
 * RoadmapParallelView — NourStep theme
 */
import { Info } from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACKS, WEEKS } from './roadmap.types';
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
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-royal/8 dark:bg-bright/8 border border-royal/15 dark:border-bright/15 rounded-2xl px-4 py-3">
        <Info size={15} className="text-royal dark:text-bright flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-heading font-bold text-xs">Parallel View</p>
          <p className="text-muted text-[11px] mt-0.5">
            Tasks that share the same week are shown side-by-side per track.
            Switch to Board view for a per-week column layout.
          </p>
        </div>
      </div>

      {WEEKS.map(week => {
        const weekTasks = tasks.filter(t => t.week === week.week);
        if (weekTasks.length === 0) return null;

        return (
          <div key={week.week} className="card-dark rounded-2xl overflow-hidden">
            {/* Week header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-surface/50 dark:bg-darkblue/40">
              <div>
                <span className="font-bold text-sm text-heading">{week.label}</span>
                <span className="text-muted text-[10px] ml-2">{week.dates}</span>
              </div>
              <span className="text-[10px] font-bold text-muted">
                {weekTasks.filter(t => t.status === 'done').length}/{weekTasks.length} done
              </span>
            </div>

            {/* Track columns */}
            <div className={`grid gap-3 p-4 ${
              visibleTracks.length === 1 ? 'grid-cols-1' :
              visibleTracks.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {visibleTracks.map(track => {
                const trackWeekTasks = weekTasks.filter(t => t.track === track.id);
                if (trackWeekTasks.length === 0 && activeTrack !== 'all') return null;

                return (
                  <div key={track.id}
                    className="bg-surface/40 dark:bg-darkblue/30 border border-border/25 rounded-xl overflow-hidden">
                    {/* Track pill */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/20">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: track.color }} />
                      <span className="text-[10px] font-black text-heading uppercase tracking-widest">{track.name}</span>
                      <span className="ml-auto text-[9px] text-muted">
                        {trackWeekTasks.filter(t => t.status === 'done').length}/{trackWeekTasks.length}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="p-2 space-y-2">
                      {trackWeekTasks.length === 0 ? (
                        <p className="text-center text-muted/40 text-[10px] py-4">No tasks</p>
                      ) : (
                        trackWeekTasks.map(t => (
                          <RoadmapTaskCard key={t.id} task={t} allTasks={tasks}
                            onToggleStatus={onToggleStatus} onEdit={onEdit} onDelete={onDelete} />
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
