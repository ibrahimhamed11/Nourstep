/**
 * NourStep — Roadmap Module API Service
 * All HTTP calls for the Roadmap feature
 * Backend route: /nourstep-api/roadmap/tasks
 */

import apiClient from '../../lib/apiClient';
import type { RoadmapTask, Status, Track, Week, TaskType, Tag } from './roadmap.types';

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
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params[key] = String(value);
    }
  });
  const { data } = await apiClient.get<RoadmapListResponse>('/roadmap/tasks', { params });
  return data;
}

/** GET /roadmap/tasks/stats */
export async function fetchRoadmapStats(): Promise<RoadmapStatsResponse> {
  const { data } = await apiClient.get<RoadmapStatsResponse>('/roadmap/tasks/stats');
  return data;
}

/** GET /roadmap/tasks/:id */
export async function fetchRoadmapTask(id: string): Promise<RoadmapSingleResponse> {
  const { data } = await apiClient.get<RoadmapSingleResponse>(`/roadmap/tasks/${id}`);
  return data;
}

/** POST /roadmap/tasks */
export async function createRoadmapTask(
  payload: CreateRoadmapPayload
): Promise<RoadmapSingleResponse> {
  const { data } = await apiClient.post<RoadmapSingleResponse>('/roadmap/tasks', payload);
  return data;
}

/** PUT /roadmap/tasks/:id */
export async function updateRoadmapTask(
  id: string,
  payload: UpdateRoadmapPayload
): Promise<RoadmapSingleResponse> {
  const { data } = await apiClient.put<RoadmapSingleResponse>(`/roadmap/tasks/${id}`, payload);
  return data;
}

/** PATCH /roadmap/tasks/:id/status */
export async function toggleRoadmapTaskStatus(
  id: string,
  status: Status
): Promise<RoadmapSingleResponse> {
  const { data } = await apiClient.patch<RoadmapSingleResponse>(`/roadmap/tasks/${id}/status`, { status });
  return data;
}

/** DELETE /roadmap/tasks/:id */
export async function deleteRoadmapTask(id: string): Promise<boolean> {
  const res = await apiClient.delete(`/roadmap/tasks/${id}`);
  return res.status >= 200 && res.status < 300;
}

/** POST /roadmap/tasks/seed (admin only) */
export async function seedRoadmapTasks(): Promise<{ inserted: number }> {
  const { data } = await apiClient.post<{ data: { inserted: number } }>('/roadmap/tasks/seed');
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
