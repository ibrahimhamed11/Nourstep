/**
 * NourStep — Task Module API Service
 * All HTTP calls for the Tasks feature
 */
import type {
  UserTask,
  TasksListResponse,
  TaskSingleResponse,
  TaskStatsResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  TaskStatus,
} from './task.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const DEFAULT_ASSIGNEE = 'Dev Ibrahim Hamed';

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

/* ──────────────────────────────────────────────────────────
   DUMMY DATA — Remove when backend is ready
────────────────────────────────────────────────────────── */
let _nextTaskNumber = 7; // increments from here for new local tasks

export function getNextTaskNumber(): number {
  return _nextTaskNumber++;
}

export function getDummyTasks(): UserTask[] {
  const now = Date.now();
  return [
    {
      _id: 'demo-1',
      userId: 'u1',
      taskNumber: 1,
      taskType: 'task',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Complete Algebra Chapter 5',
      titleAr: 'إكمال الجبر الفصل الخامس',
      description: 'Pages 120-135, odd-numbered problems',
      status: 'todo',
      priority: 'high',
      category: 'homework',
      tags: ['math', 'algebra'],
      dueDate: new Date(now + 1000 * 60 * 60 * 48).toISOString(),
      completedAt: null,
      notes: '',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      _id: 'demo-2',
      userId: 'u1',
      taskNumber: 2,
      taskType: 'task',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Review Physics Notes',
      titleAr: 'مراجعة ملاحظات الفيزياء',
      description: 'Chapters 1-3 for the mid-term exam',
      status: 'in_progress',
      priority: 'medium',
      category: 'study',
      tags: ['physics', 'exam-prep'],
      dueDate: new Date(now + 1000 * 60 * 60 * 72).toISOString(),
      completedAt: null,
      notes: 'Focus on Newton\'s laws and thermodynamics',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      _id: 'demo-3',
      userId: 'u1',
      taskNumber: 3,
      taskType: 'bug',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Fix login form validation bug',
      titleAr: 'إصلاح خطأ في نموذج تسجيل الدخول',
      description: 'Email regex not matching valid .edu domains',
      status: 'todo',
      priority: 'urgent',
      category: 'project',
      tags: ['bug', 'auth', 'frontend'],
      dueDate: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
      completedAt: null,
      notes: 'Reported by QA — affects registration flow',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      _id: 'demo-4',
      userId: 'u1',
      taskNumber: 4,
      taskType: 'feature',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Add Firebase push notifications',
      titleAr: 'إضافة إشعارات فايربيس',
      description: 'Integrate FCM for real-time push on mobile & web',
      status: 'todo',
      priority: 'high',
      category: 'project',
      tags: ['firebase', 'notifications', 'backend'],
      dueDate: new Date(now + 1000 * 60 * 60 * 120).toISOString(),
      completedAt: null,
      notes: 'Need to set up Firebase project first',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 16).toISOString(),
    },
    {
      _id: 'demo-5',
      userId: 'u1',
      taskNumber: 5,
      taskType: 'improvement',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Optimize task list rendering',
      titleAr: 'تحسين عرض قائمة المهام',
      description: 'Virtualize long lists and memoize heavy components',
      status: 'in_progress',
      priority: 'medium',
      category: 'project',
      tags: ['performance', 'frontend'],
      dueDate: new Date(now + 1000 * 60 * 60 * 96).toISOString(),
      completedAt: null,
      notes: '',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      _id: 'demo-6',
      userId: 'u1',
      taskNumber: 6,
      taskType: 'task',
      assignedTo: DEFAULT_ASSIGNEE,
      title: 'Write unit tests for task module API',
      titleAr: 'كتابة اختبارات وحدة لوحدة المهام',
      description: 'Cover CRUD + edge cases with Jest + Supertest',
      status: 'done',
      priority: 'low',
      category: 'project',
      tags: ['testing', 'backend'],
      dueDate: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      completedAt: new Date(now - 1000 * 60 * 60 * 52).toISOString(),
      notes: 'All 24 tests passing',
      attachments: [],
      isArchived: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 52).toISOString(),
    },
  ];
}
