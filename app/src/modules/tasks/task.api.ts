/**
 * NourStep — Task Module API Service
 * All HTTP calls for the Tasks feature
 */
import apiClient from '../../lib/apiClient';
import type {
  TasksListResponse,
  TaskSingleResponse,
  TaskStatsResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  TaskStatus,
} from './task.types';

/* ─── Create Task ─── */
export async function createTask(payload: CreateTaskPayload): Promise<TaskSingleResponse> {
  const { data } = await apiClient.post<TaskSingleResponse>('/tasks', payload);
  return data;
}

/* ─── List Tasks (filtered + paginated) ─── */
export async function fetchTasks(filters: TaskFilters = {}): Promise<TasksListResponse> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params[key] = String(value);
    }
  });
  const { data } = await apiClient.get<TasksListResponse>('/tasks', { params });
  return data;
}

/* ─── Get Single Task ─── */
export async function fetchTask(id: string): Promise<TaskSingleResponse> {
  const { data } = await apiClient.get<TaskSingleResponse>(`/tasks/${id}`);
  return data;
}

/* ─── Update Task ─── */
export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskSingleResponse> {
  const { data } = await apiClient.put<TaskSingleResponse>(`/tasks/${id}`, payload);
  return data;
}

/* ─── Toggle Status ─── */
export async function toggleTaskStatus(id: string, status: TaskStatus): Promise<TaskSingleResponse> {
  const { data } = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/status`, { status });
  return data;
}

/* ─── Update Notes ─── */
export async function updateTaskNotes(id: string, notes: string): Promise<TaskSingleResponse> {
  const { data } = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/notes`, { notes });
  return data;
}

/* ─── Delete Task ─── */
export async function deleteTask(id: string): Promise<boolean> {
  const res = await apiClient.delete(`/tasks/${id}`);
  return res.status >= 200 && res.status < 300;
}

/* ─── Archive / Unarchive ─── */
export async function archiveTask(id: string, isArchived: boolean): Promise<TaskSingleResponse> {
  const { data } = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/archive`, { isArchived });
  return data;
}

/* ─── Assign Task ─── */
export async function assignTask(id: string, assignedTo: string): Promise<TaskSingleResponse> {
  const { data } = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/assign`, { assignedTo });
  return data;
}

/* ─── Task Stats ─── */
export async function fetchTaskStats(): Promise<TaskStatsResponse> {
  const { data } = await apiClient.get<TaskStatsResponse>('/tasks/stats');
  return data;
}

/* ─── Bulk Status Update ─── */
export async function bulkUpdateStatus(taskIds: string[], status: TaskStatus): Promise<{ updated: number }> {
  const { data } = await apiClient.patch<{ data: { updated: number } }>('/tasks/bulk-status', { taskIds, status });
  return data.data;
}