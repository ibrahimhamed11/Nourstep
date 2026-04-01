/**
 * RoadmapParallelView — Shows tasks that can run simultaneously per week
 */
import { Calendar, Zap } from 'lucide-react';
import type { RoadmapTask, Week } from './roadmap.types';
import { WEEKS, TRACK_CONFIG, STATUS_CONFIG } from './roadmap.types';

interface Props {
  tasks: RoadmapTask[];
}

export default function RoadmapParallelView({ tasks }: Props) {
  // Build parallel groups per week
  const parallelGroups: { week: Week; tasks: RoadmapTask[] }[] = WEEKS.map(w => ({
    week: w.week,
    tasks: tasks.filter(t => t.week === w.week && (t.parallel ?? []).length > 0),
  })).filter(g => g.tasks.length > 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Zap size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-blue-800 font-bold text-sm">How to move fastest — run these in parallel</div>
          <p className="text-blue-600 text-xs mt-1 leading-relaxed">
            These task groups can be executed simultaneously across tracks. Assign separate people or time-box your day: morning = backend, afternoon = frontend/mobile.
            Tasks marked <strong>parallel</strong> have no blocking dependency on each other within the same week.
          </p>
        </div>
      </div>

      {parallelGroups.map(({ week, tasks: ptasks }) => {
        const weekInfo = WEEKS.find(w => w.week === week)!;
        const groups: RoadmapTask[][] = [];
        const visited = new Set<string>();
        ptasks.forEach(task => {
          if (visited.has(task.id)) return;
          const group = [task, ...((task.parallel ?? []).map(id => ptasks.find(t => t.id === id)).filter(Boolean) as RoadmapTask[])];
          group.forEach(t => visited.add(t.id));
          if (group.length > 1) groups.push(group);
        });

        if (groups.length === 0) return null;

        return (
          <div key={week} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
              <Calendar size={14} className="text-gray-400" />
              <span className="font-bold text-gray-800 text-sm">{weekInfo.label} — {weekInfo.dates}</span>
              <span className="text-[10px] text-purple-500 font-bold ml-auto">{groups.length} parallel group{groups.length > 1 ? 's' : ''}</span>
            </div>
            <div className="p-5 space-y-5">
              {groups.map((group, gi) => (
                <div key={gi} className="rounded-xl border border-purple-100 bg-purple-50/30 p-4">
                  <div className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-3">
                          Parallel Group {gi + 1} — run simultaneously
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.map(task => {
                      const track = TRACK_CONFIG[task.track];
                      const status = STATUS_CONFIG[task.status];
                      const StatusIcon = status.icon;
                      const TrackIcon = track.icon;
                      return (
                        <div key={task.id} className="rounded-xl border p-3 bg-white shadow-sm"
                          style={{ borderLeftWidth: 3, borderLeftColor: track.color }}>
                          <div className="flex items-center gap-2 mb-2">
                            <TrackIcon size={12} style={{ color: track.color }} />
                            <span className="text-[10px] font-bold" style={{ color: track.color }}>{track.label}</span>
                            <StatusIcon size={11} className={`ml-auto ${status.cls}`} />
                          </div>
                          <div className="text-gray-800 font-semibold text-xs mb-1">{task.title}</div>
                          <div className="text-gray-400 text-[10px] leading-relaxed mb-2">{task.desc}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-400">{task.estimate}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${status.badge}`}>{status.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
