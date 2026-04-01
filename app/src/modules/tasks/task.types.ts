/**
 * NourStep — Task Module Types
 * Self-contained type definitions for the Tasks feature
 */

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'homework' | 'study' | 'project' | 'exam' | 'other';
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement';

export interface TaskAttachment {
  url: string;
  filename: string;
  type: string;
  size: number;
}

export interface UserTask {
  _id: string;
  userId: string;
  taskNumber: number;       // Auto-incremented ID e.g. TASK-1, BUG-5
  taskType: TaskType;       // task | bug | feature | improvement
  assignedTo: string;       // Display name of assignee — default: "Dev Ibrahim Hamed"
  courseId?: string | { _id: string; title: string };
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  dueDate?: string;
  completedAt?: string | null;
  notes: string;
  attachments: TaskAttachment[];
  reminder?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TasksListResponse {
  success: boolean;
  data: UserTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface TaskSingleResponse {
  success: boolean;
  data: UserTask;
  message?: string;
  message_ar?: string;
}

export interface TaskStatsResponse {
  success: boolean;
  data: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
    dueSoon: number;
    byCategory: Record<TaskCategory, number>;
    byPriority: Record<TaskPriority, number>;
    completionRate: number;
    streakDays: number;
  };
}

export interface CreateTaskPayload {
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  status?: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  taskType?: TaskType;
  assignedTo?: string;
  tags?: string[];
  dueDate?: string;
  courseId?: string;
  notes?: string;
  reminder?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: TaskStatus | 'all';
  priority?: TaskPriority;
  category?: TaskCategory;
  taskType?: TaskType;
  assignedTo?: string;
  courseId?: string;
  tag?: string;
  search?: string;             // Search by title, description, or taskNumber prefix
  taskNumber?: number;         // Exact task number lookup
  dueFrom?: string;
  dueTo?: string;
  overdue?: boolean;
  archived?: boolean;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title' | 'taskNumber';
  order?: 'asc' | 'desc';
}
