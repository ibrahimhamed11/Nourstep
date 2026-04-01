/**
 * RoadmapPage — 2-Month Sprint Roadmap
 * Route: /roadmap
 *
 * Data is fetched from: GET /api/v1/roadmap/tasks
 * All CRUD ops hit the real backend (no static data).
 *
 * Features:
 *  - Loads tasks from backend on mount
 *  - Add / Edit / Delete tasks via API
 *  - Click status to cycle through: todo → in-progress → done → blocked
 *  - Search by name, number, TASK-3, tag
 *  - Filter by status / tag / track
 *  - Board / Table / Parallel views
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { RoadmapTask, Track, ViewMode, Week, Status, Tag, TaskType } from './roadmap/roadmap.types';
import {
  WEEKS, STATUS_CYCLE, getStats, taskDisplayId, TAG_CONFIG,
} from './roadmap/roadmap.types';
import {
  fetchRoadmapTasks,
  createRoadmapTask,
  updateRoadmapTask,
  toggleRoadmapTaskStatus,
  deleteRoadmapTask,
  mapBackendTask,
  generateTaskId,
  type RoadmapFilters,
} from './roadmap/roadmap.api';

import RoadmapHeader from './roadmap/RoadmapHeader';
import RoadmapStats from './roadmap/RoadmapStats';
import RoadmapWeekColumn from './roadmap/RoadmapWeekColumn';
import RoadmapTableView from './roadmap/RoadmapTableView';
import RoadmapParallelView from './roadmap/RoadmapParallelView';
import RoadmapBottomSummary from './roadmap/RoadmapBottomSummary';
import RoadmapTaskFormModal from './roadmap/RoadmapTaskFormModal';

// ─── Loading / Error skeletons ─────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin mx-auto" />
        <p className="text-muted text-sm font-medium">Loading tasks board…</p>
      </div>
    </div>
  );
}

function BackendUnavailableState() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm mx-4 card-dark rounded-2xl p-8">
        <div className="w-14 h-14 rounded-2xl bg-royal/10 border border-royal/20 flex items-center justify-center mx-auto">
          <span className="text-3xl">🚧</span>
        </div>
        <p className="text-heading font-bold text-lg">Backend Coming Soon</p>
        <p className="text-muted text-sm leading-relaxed">
          The roadmap API is not deployed yet.<br />Check back once the backend is live.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm mx-4 card-dark rounded-2xl p-8">
        <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto">
          <span className="text-error text-2xl">⚠</span>
        </div>
        <p className="text-heading font-semibold">Failed to load tasks board</p>
        <p className="text-muted text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-gradient-to-r from-royal to-bright text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  /* ── State ── */
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [activeTrack, setActiveTrack] = useState<Track | 'all'>('all');
  const [view, setView] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<Tag | 'all'>('all');
  const [weekFilter, setWeekFilter] = useState<Week | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');

  // Modal: null = closed, {} = add new, { ...task } = edit existing
  const [modalTask, setModalTask] = useState<Partial<RoadmapTask> | null>(null);

  /* ── Fetch all tasks from backend ── */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: RoadmapFilters = { limit: 200, sortBy: 'week', order: 'asc' };
      const res = await fetchRoadmapTasks(filters);
      setTasks(res.data.map(mapBackendTask));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /* ── Unique tags present in current tasks ── */
  const activeTags = useMemo(() => {
    const tagSet = new Set<Tag>();
    tasks.forEach(t => (t.tags ?? []).forEach(tag => tagSet.add(tag)));
    const allKeys = Object.keys(TAG_CONFIG) as Tag[];
    return allKeys.filter(k => tagSet.has(k));
  }, [tasks]);

  /* ── Search + Status + Tag + Week + Type filter ── */
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    if (tagFilter !== 'all') {
      result = result.filter(t => (t.tags ?? []).includes(tagFilter));
    }

    if (weekFilter !== 'all') {
      result = result.filter(t => t.week === weekFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(t => t.taskType === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(task => {
        if (task.title.toLowerCase().includes(q)) return true;
        if (task.desc.toLowerCase().includes(q)) return true;
        if (taskDisplayId(task).toLowerCase().includes(q)) return true;
        if (q.startsWith('#') && String(task.taskNumber) === q.slice(1)) return true;
        if (/^\d+$/.test(q) && String(task.taskNumber) === q) return true;
        if (task.assignee.toLowerCase().includes(q)) return true;
        if ((task.tags ?? []).some(tag => TAG_CONFIG[tag]?.label.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return result;
  }, [tasks, searchQuery, statusFilter, tagFilter, weekFilter, typeFilter]);

  const stats = useMemo(() => getStats(filteredTasks), [filteredTasks]);

  /* ── Handlers ── */

  /** Cycle status: todo → in-progress → done → blocked → todo */
  const handleToggleStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const idx = STATUS_CYCLE.indexOf(task.status);
    const nextStatus = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));

    try {
      const apiId = task._id || task.id;
      await toggleRoadmapTaskStatus(apiId, nextStatus);
    } catch (err) {
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: task.status } : t));
      console.error('Failed to toggle status:', err);
    }
  }, [tasks]);

  const handleDelete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic remove
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const apiId = task._id || task.id;
      const ok = await deleteRoadmapTask(apiId);
      if (!ok) throw new Error('Delete failed');
    } catch (err) {
      // Revert
      setTasks(prev => [...prev, task]);
      console.error('Failed to delete task:', err);
    }
  }, [tasks]);

  const handleEdit = useCallback((task: RoadmapTask) => {
    setModalTask(task);
  }, []);

  const handleAddTask = useCallback(() => {
    setModalTask({});
  }, []);

  const handleAddTaskToWeek = useCallback((week: Week) => {
    setModalTask({ week });
  }, []);

  const handleSave = useCallback(async (data: Partial<RoadmapTask>) => {
    setSaving(true);
    try {
      if (data.id && data._id) {
        // ── EDIT ──
        const res = await updateRoadmapTask(data._id, {
          title: data.title,
          desc: data.desc,
          taskType: data.taskType,
          status: data.status,
          track: data.track,
          week: data.week,
          estimate: data.estimate,
          assignee: data.assignee,
          tags: data.tags,
          parallel: data.parallel,
          blockedBy: data.blockedBy,
        });
        const updated = mapBackendTask(res.data);
        setTasks(prev => prev.map(t => t.id === data.id ? updated : t));
      } else {
        // ── ADD ──
        const maxNum = tasks.reduce((m, t) => Math.max(m, t.taskNumber), 0);
        const tentativeNumber = maxNum + 1;
        const taskId = generateTaskId(data.taskType ?? 'task', tentativeNumber);

        const res = await createRoadmapTask({
          taskId,
          taskType: data.taskType ?? 'task',
          title: data.title ?? 'Untitled',
          desc: data.desc ?? '',
          status: data.status ?? 'todo',
          track: data.track ?? 'backend',
          week: data.week ?? 1,
          estimate: data.estimate ?? '—',
          assignee: data.assignee ?? 'Dev Ibrahim Hamed',
          tags: data.tags ?? [],
          parallel: data.parallel ?? [],
          blockedBy: data.blockedBy ?? [],
        });
        const created = mapBackendTask(res.data);
        setTasks(prev => [...prev, created]);
      }
      setModalTask(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert(err instanceof Error ? err.message : 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [tasks]);

  const handleCloseModal = useCallback(() => {
    if (!saving) setModalTask(null);
  }, [saving]);

  /* ── Render ── */
  if (loading) return <LoadingState />;
  if (error === 'BACKEND_UNAVAILABLE') return <BackendUnavailableState />;
  if (error) return <ErrorState message={error} onRetry={loadTasks} />;

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <RoadmapHeader
        stats={stats}
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        weekFilter={weekFilter}
        setWeekFilter={setWeekFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        activeTags={activeTags}
        onAddTask={handleAddTask}
      />

      <main className="max-w-screen-2xl mx-auto px-4 py-8 space-y-6">
        {/* Stats + Milestones + Track Filter Pills */}
        <RoadmapStats
          tasks={filteredTasks}
          activeTrack={activeTrack}
          setActiveTrack={setActiveTrack}
        />

        {/* ── BOARD VIEW ── */}
        {view === 'board' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {WEEKS.map(w => (
              <RoadmapWeekColumn
                key={w.week}
                week={w}
                tasks={filteredTasks.filter(t => t.week === w.week)}
                allTasks={filteredTasks}
                activeTrack={activeTrack}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddTask={handleAddTaskToWeek}
              />
            ))}
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === 'table' && (
          <RoadmapTableView
            tasks={filteredTasks}
            activeTrack={activeTrack}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* ── PARALLEL VIEW ── */}
        {view === 'parallel' && (
          <RoadmapParallelView
            tasks={filteredTasks}
            activeTrack={activeTrack}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* ── Bottom Summary ── */}
        <RoadmapBottomSummary tasks={filteredTasks} />
      </main>

      {/* ── Add/Edit Modal ── */}
      <RoadmapTaskFormModal
        open={modalTask !== null}
        initial={modalTask && 'id' in modalTask ? (modalTask as RoadmapTask) : null}
        defaultWeek={modalTask?.week as Week | undefined}
        allTasks={tasks}
        onSave={handleSave}
        onClose={handleCloseModal}
      />

      {/* ── Saving overlay ── */}
      {saving && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl shadow-2xl px-8 py-5 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-royal/25 border-t-royal rounded-full animate-spin" />
            <span className="text-heading text-sm font-semibold">Saving…</span>
          </div>
        </div>
      )}
    </div>
  );
}
