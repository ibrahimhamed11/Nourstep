/**
 * NourStep — Roadmap Module API Service
 * All HTTP calls for the Roadmap feature
 * Backend route: /api/v1/roadmap/tasks
 */

import type { RoadmapTask, Status, Track, Week, TaskType, Tag } from './roadmap.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('nourstep-auth-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface RoadmapTaskBackend {
  _id: string;
  taskId: string;
  taskNumber: number;
  taskType: TaskType;
  title: string;
  desc: string;
  status: Status;
  track: Track;
  week: Week;
  estimate: string;
  assignee: string;
  tags: Tag[];
  parallel: string[];
  blockedBy: string[];
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapListResponse {
  success: boolean;
  data: RoadmapTaskBackend[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  stats: {
    total: number;
    done: number;
    inProgress: number;
    todo: number;
    blocked: number;
    pct: number;
  };
}

export interface RoadmapSingleResponse {
  success: boolean;
  data: RoadmapTaskBackend;
  message?: string;
  message_ar?: string;
}

export interface RoadmapStatsResponse {
  success: boolean;
  data: {
    total: number;
    done: number;
    inProgress: number;
    todo: number;
    blocked: number;
    completionPct: number;
    byTrack: Record<string, { total: number; done: number; todo: number }>;
    byWeek: Record<number, { total: number; done: number; todo: number }>;
    byTag: Record<string, number>;
  };
}

export interface RoadmapFilters {
  page?: number;
  limit?: number;
  status?: Status | 'all';
  track?: Track;
  week?: number;
  tag?: Tag;
  search?: string;
  assignee?: string;
  sortBy?: 'week' | 'taskNumber' | 'status' | 'track' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateRoadmapPayload {
  taskId: string;
  taskType?: TaskType;
  title: string;
  desc: string;
  status?: Status;
  track: Track;
  week: number;
  estimate?: string;
  assignee?: string;
  tags?: Tag[];
  parallel?: string[];
  blockedBy?: string[];
}

export interface UpdateRoadmapPayload extends Partial<Omit<CreateRoadmapPayload, 'taskId'>> {}

// ─── Map backend shape → frontend RoadmapTask ─────────────────────────────────

export function mapBackendTask(t: RoadmapTaskBackend): RoadmapTask {
  return {
    id: t.taskId,
    _id: t._id,
    taskNumber: t.taskNumber,
    taskType: t.taskType,
    title: t.title,
    desc: t.desc,
    status: t.status,
    track: t.track,
    week: t.week as Week,
    estimate: t.estimate,
    assignee: t.assignee,
    tags: t.tags,
    parallel: t.parallel,
    blockedBy: t.blockedBy,
    completedAt: t.completedAt,
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /roadmap/tasks — list with filters */
export async function fetchRoadmapTasks(
  filters: RoadmapFilters = {}
): Promise<RoadmapListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.set(key, String(value));
    }
  });
  const res = await fetch(`${API_BASE}/roadmap/tasks?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch roadmap tasks');
  }
  return res.json();
}

/** GET /roadmap/tasks/stats */
export async function fetchRoadmapStats(): Promise<RoadmapStatsResponse> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch roadmap stats');
  return res.json();
}

/** GET /roadmap/tasks/:id */
export async function fetchRoadmapTask(id: string): Promise<RoadmapSingleResponse> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Roadmap task not found');
  return res.json();
}

/** POST /roadmap/tasks */
export async function createRoadmapTask(
  payload: CreateRoadmapPayload
): Promise<RoadmapSingleResponse> {
  const res = await fetch(`${API_BASE}/roadmap/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message_ar || err.message || 'Failed to create roadmap task');
  }
  return res.json();
}

/** PUT /roadmap/tasks/:id */
export async function updateRoadmapTask(
  id: string,
  payload: UpdateRoadmapPayload
): Promise<RoadmapSingleResponse> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message_ar || err.message || 'Failed to update roadmap task');
  }
  return res.json();
}

/** PATCH /roadmap/tasks/:id/status */
export async function toggleRoadmapTaskStatus(
  id: string,
  status: Status
): Promise<RoadmapSingleResponse> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update status');
  }
  return res.json();
}

/** DELETE /roadmap/tasks/:id */
export async function deleteRoadmapTask(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

/** POST /roadmap/tasks/seed (admin only) */
export async function seedRoadmapTasks(): Promise<{ inserted: number }> {
  const res = await fetch(`${API_BASE}/roadmap/tasks/seed`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to seed roadmap tasks');
  }
  const data = await res.json();
  return data.data;
}

/** Generates a taskId from the task's type prefix + number e.g. "TASK-42" */
export function generateTaskId(taskType: TaskType, taskNumber: number): string {
  const prefixes: Record<TaskType, string> = {
    task: 'TASK',
    bug: 'BUG',
    feature: 'FEAT',
    improvement: 'IMP',
    hotfix: 'HOT',
  };
  return `${prefixes[taskType] ?? 'TASK'}-${taskNumber}`;
}
