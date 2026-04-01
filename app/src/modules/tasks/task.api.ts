/**
 * NourStep — Task Module API Service
 * All HTTP calls for the Tasks feature
 */
import type {
  TasksListResponse,
  TaskSingleResponse,
  TaskStatsResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  TaskStatus,
} from './task.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('nourstep-auth-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ─── Create Task ─── */
export async function createTask(payload: CreateTaskPayload): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message_ar || err.message || 'Failed to create task');
  }
  return res.json();
}

/* ─── List Tasks (filtered + paginated) ─── */
export async function fetchTasks(filters: TaskFilters = {}): Promise<TasksListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.set(key, String(value));
    }
  });
  const res = await fetch(`${API_BASE}/tasks?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

/* ─── Get Single Task ─── */
export async function fetchTask(id: string): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Task not found');
  return res.json();
}

/* ─── Update Task ─── */
export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message_ar || err.message || 'Failed to update task');
  }
  return res.json();
}

/* ─── Toggle Status ─── */
export async function toggleTaskStatus(id: string, status: TaskStatus): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to toggle task status');
  return res.json();
}

/* ─── Update Notes ─── */
export async function updateTaskNotes(id: string, notes: string): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}/notes`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Failed to update notes');
  return res.json();
}

/* ─── Delete Task ─── */
export async function deleteTask(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}

/* ─── Archive / Unarchive ─── */
export async function archiveTask(id: string, isArchived: boolean): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}/archive`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isArchived }),
  });
  if (!res.ok) throw new Error('Failed to archive task');
  return res.json();
}

/* ─── Assign Task ─── */
export async function assignTask(id: string, assignedTo: string): Promise<TaskSingleResponse> {
  const res = await fetch(`${API_BASE}/tasks/${id}/assign`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ assignedTo }),
  });
  if (!res.ok) throw new Error('Failed to assign task');
  return res.json();
}

/* ─── Task Stats ─── */
export async function fetchTaskStats(): Promise<TaskStatsResponse> {
  const res = await fetch(`${API_BASE}/tasks/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

/* ─── Bulk Status Update ─── */
export async function bulkUpdateStatus(taskIds: string[], status: TaskStatus): Promise<{ updated: number }> {
  const res = await fetch(`${API_BASE}/tasks/bulk-status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ taskIds, status }),
  });
  if (!res.ok) throw new Error('Bulk update failed');
  const data = await res.json();
  return data.data;
}


