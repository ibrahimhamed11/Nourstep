/**
 * RoadmapPage — 2-Month Sprint Roadmap to Launch + Full CRUD Task Manager
 * Route: /roadmap
 *
 * Features:
 *  - Add / Edit / Delete tasks
 *  - Click status to mark done / in-progress / todo / blocked
 *  - AssignedTo (default "Dev Ibrahim Hamed")
 *  - Search by name, number, TASK-3, tag
 *  - Filter by status (done, todo, in-progress, blocked)
 *  - Filter by tag (frontend, backend, mobile, firebase, aws, etc.)
 *  - Filter by track
 *  - Auto-generated IDs (TASK-1, BUG-5, FEAT-12, IMP-3)
 *  - Tags on tasks: Frontend, Backend, Mobile, Firebase, AWS, etc (no emoji)
 *  - Board / Table / Parallel views
 *
 * Backend = NOT started | Mobile = NOT started (React Native CLI)
 * Website = only frontend done (landing + auth UI)
 */
import { useState, useCallback, useMemo } from 'react';
import type { RoadmapTask, Track, ViewMode, Week, Status, Tag } from './roadmap/roadmap.types';
import {
  WEEKS, STATUS_CYCLE, getStats, taskDisplayId, TAG_CONFIG,
} from './roadmap/roadmap.types';
import { INITIAL_TASKS, getNextRoadmapTaskNumber } from './roadmap/roadmap.data';

import RoadmapHeader from './roadmap/RoadmapHeader';
import RoadmapStats from './roadmap/RoadmapStats';
import RoadmapWeekColumn from './roadmap/RoadmapWeekColumn';
import RoadmapTableView from './roadmap/RoadmapTableView';
import RoadmapParallelView from './roadmap/RoadmapParallelView';
import RoadmapBottomSummary from './roadmap/RoadmapBottomSummary';
import RoadmapTaskFormModal from './roadmap/RoadmapTaskFormModal';

export default function RoadmapPage() {
  /* ── State ── */
  const [tasks, setTasks] = useState<RoadmapTask[]>(() => [...INITIAL_TASKS]);
  const [activeTrack, setActiveTrack] = useState<Track | 'all'>('all');
  const [view, setView] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<Tag | 'all'>('all');

  // Modal: null = closed, {} = add new, { ...task } = edit existing
  const [modalTask, setModalTask] = useState<Partial<RoadmapTask> | null>(null);

  /* ── Unique tags present in current tasks ── */
  const activeTags = useMemo(() => {
    const tagSet = new Set<Tag>();
    tasks.forEach(t => (t.tags ?? []).forEach(tag => tagSet.add(tag)));
    // Sort by TAG_CONFIG key order
    const allKeys = Object.keys(TAG_CONFIG) as Tag[];
    return allKeys.filter(k => tagSet.has(k));
  }, [tasks]);

  /* ── Search + Status + Tag + Track Filter ── */
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Tag filter
    if (tagFilter !== 'all') {
      result = result.filter(t => (t.tags ?? []).includes(tagFilter));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(task => {
        if (task.title.toLowerCase().includes(q)) return true;
        if (task.desc.toLowerCase().includes(q)) return true;
        if (taskDisplayId(task).toLowerCase().includes(q)) return true;
        if (q.startsWith('#') && String(task.taskNumber) === q.slice(1)) return true;
        if (/^\d+$/.test(q) && String(task.taskNumber) === q) return true;
        if (task.assignee.toLowerCase().includes(q)) return true;
        // Search by tag name
        if ((task.tags ?? []).some(tag => TAG_CONFIG[tag]?.label.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return result;
  }, [tasks, searchQuery, statusFilter, tagFilter]);

  const stats = useMemo(() => getStats(filteredTasks), [filteredTasks]);

  /* ── Handlers ── */
  const handleToggleStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx = STATUS_CYCLE.indexOf(t.status);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...t, status: next };
    }));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleEdit = useCallback((task: RoadmapTask) => {
    setModalTask(task);
  }, []);

  const handleAddTask = useCallback(() => {
    setModalTask({});
  }, []);

  const handleAddTaskToWeek = useCallback((week: Week) => {
    setModalTask({ week });
  }, []);

  const handleSave = useCallback((data: Partial<RoadmapTask>) => {
    setTasks(prev => {
      // EDIT — data has id
      if (data.id) {
        return prev.map(t => t.id === data.id ? { ...t, ...data } as RoadmapTask : t);
      }
      // ADD — generate new task
      const nextNumber = getNextRoadmapTaskNumber(prev);
      const newTask: RoadmapTask = {
        id: `custom-${Date.now()}`,
        taskNumber: nextNumber,
        taskType: data.taskType ?? 'task',
        title: data.title ?? 'Untitled',
        desc: data.desc ?? '',
        status: data.status ?? 'todo',
        track: data.track ?? 'backend',
        week: data.week ?? 1,
        estimate: data.estimate ?? '',
        assignee: data.assignee ?? 'Dev Ibrahim Hamed',
        parallel: data.parallel,
        blockedBy: data.blockedBy,
        tags: data.tags,
      };
      return [...prev, newTask];
    });
    setModalTask(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalTask(null);
  }, []);

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search, status filter, tag filter, view toggle */}
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
        activeTags={activeTags}
        onAddTask={handleAddTask}
      />

      <main className="max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
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
          <RoadmapTableView tasks={filteredTasks} activeTrack={activeTrack} />
        )}

        {/* ── PARALLEL VIEW ── */}
        {view === 'parallel' && (
          <RoadmapParallelView tasks={filteredTasks} />
        )}

        {/* ── Bottom Summary ── */}
        <RoadmapBottomSummary tasks={filteredTasks} />
      </main>

      {/* ── Add/Edit Modal ── */}
      {modalTask !== null && (
        <RoadmapTaskFormModal
          task={modalTask}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
