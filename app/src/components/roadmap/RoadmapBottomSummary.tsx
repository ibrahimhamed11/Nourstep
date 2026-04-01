/**
 * RoadmapBottomSummary — Bottom cards: Effort by Track, Sprint Rules, Launch Checklist
 */
import { CheckCircle2, Circle, Code2, ShieldCheck, Flag } from 'lucide-react';
import type { RoadmapTask, Track } from './roadmap.types';
import { TRACK_CONFIG } from './roadmap.types';

interface Props {
  tasks: RoadmapTask[];
}

export default function RoadmapBottomSummary({ tasks }: Props) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {/* Total effort */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
          <Code2 size={14} className="text-blue-500" /> Effort by Track
        </h3>
        {(Object.keys(TRACK_CONFIG) as Track[]).map(track => {
          const tc = TRACK_CONFIG[track];
          const trackTasks = tasks.filter(t => t.track === track);
          const TIcon = tc.icon;
          return (
            <div key={track} className="flex items-center gap-3 mb-3 last:mb-0">
              <TIcon size={13} style={{ color: tc.color }} />
              <span className="text-gray-600 text-xs flex-1">{tc.label}</span>
              <span className="text-xs font-bold text-gray-700">{trackTasks.length} tasks</span>
            </div>
          );
        })}
      </div>

      {/* Rules */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" /> Sprint Rules
        </h3>
        <ul className="space-y-2">
          {[
            'Mark task Done only when tested end-to-end',
            'Blocked task → escalate same day, don\'t wait',
            'Parallel tasks → split your day or pair-program',
            'Week review every Sunday — update statuses',
            'No new features after Week 7 — only QA fixes',
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
              <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Launch checklist */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
          <Flag size={14} className="text-red-500" /> Launch Checklist
        </h3>
        <ul className="space-y-2">
          {[
            { label: 'All Phase 1 backend routes live', done: false },
            { label: 'Auth flow E2E tested', done: true },
            { label: 'Paymob webhook verified in staging', done: false },
            { label: 'Mobile build on TestFlight / Play Internal', done: false },
            { label: 'Sentry + monitoring active', done: false },
            { label: 'Lighthouse score ≥ 90', done: false },
            { label: 'SSL + custom domain configured', done: false },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-[11px]">
              {item.done
                ? <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
                : <Circle size={11} className="text-gray-200 flex-shrink-0" />}
              <span className={item.done ? 'text-emerald-600 font-medium' : 'text-gray-500'}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
