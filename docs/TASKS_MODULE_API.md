# خطوة للنور — Tasks Module API Documentation

## Overview

The **Tasks Module** provides a full task management system for all user roles. Every task/bug/feature/improvement gets an **auto-incremented number** (e.g. `TASK-1`, `BUG-5`, `FEAT-12`, `IMP-3`). Tasks support **assignedTo** (defaults to `Dev Ibrahim Hamed`), full CRUD, status toggle, search by name/number, and rich filtering.

---

## Base URL

```
/api/v1/tasks
```

All endpoints require **Bearer JWT authentication** via `Authorization` header.

---

## 1. Data Model

### MongoDB Collection: `tasks`

| Field           | Type         | Required | Default              | Description                                                  |
| --------------- | ------------ | -------- | -------------------- | ------------------------------------------------------------ |
| `_id`           | `ObjectId`   | auto     |                      | Primary key                                                  |
| `taskNumber`    | `Number`     | auto     | Auto-increment       | Unique sequential number per project (1, 2, 3…)              |
| `taskType`      | `String`     | ✅       | `'task'`             | `task` \| `bug` \| `feature` \| `improvement`                |
| `userId`        | `ObjectId`   | ✅       |                      | Creator of the task (ref → `users`)                          |
| `assignedTo`    | `String`     | ✅       | `Dev Ibrahim Hamed`  | Display name of the person assigned                          |
| `courseId`      | `ObjectId`   | ❌       |                      | Optional link to a course (ref → `courses`)                  |
| `title`         | `String`     | ✅       |                      | Task title (max 200 chars)                                   |
| `titleAr`       | `String`     | ❌       |                      | Arabic title                                                 |
| `description`   | `String`     | ❌       |                      | Detailed description (max 2000 chars)                        |
| `descriptionAr` | `String`     | ❌       |                      | Arabic description                                           |
| `status`        | `String`     | ✅       | `'todo'`             | `todo` \| `in_progress` \| `done`                            |
| `priority`      | `String`     | ✅       | `'medium'`           | `low` \| `medium` \| `high` \| `urgent`                     |
| `category`      | `String`     | ✅       | `'other'`            | `homework` \| `study` \| `project` \| `exam` \| `other`     |
| `tags`          | `[String]`   | ❌       | `[]`                 | Custom tags array, max 10 items, each max 50 chars           |
| `dueDate`       | `Date`       | ❌       |                      | When the task is due                                         |
| `completedAt`   | `Date`       | ❌       |                      | Auto-set when status → `done`, cleared when leaving `done`   |
| `notes`         | `String`     | ❌       | `''`                 | Personal notes (max 5000 chars)                              |
| `attachments`   | `[Object]`   | ❌       | `[]`                 | `{ url, filename, type, size }` array                        |
| `reminder`      | `Date`       | ❌       |                      | Optional reminder datetime                                   |
| `isArchived`    | `Boolean`    | ✅       | `false`              | Soft-archive flag                                            |
| `createdAt`     | `Date`       | auto     |                      | Mongoose timestamps                                          |
| `updatedAt`     | `Date`       | auto     |                      | Mongoose timestamps                                          |

### Display ID Format

Every task has a human-readable ID composed of its type prefix + number:

| `taskType`    | Prefix  | Example Display |
| ------------- | ------- | --------------- |
| `task`        | `TASK`  | `TASK-1`        |
| `bug`         | `BUG`   | `BUG-5`         |
| `feature`     | `FEAT`  | `FEAT-12`       |
| `improvement` | `IMP`   | `IMP-3`         |

The `taskNumber` is **auto-incremented** by the backend using a counter collection or `$inc` on a project-level counter document. The number is **unique per project** and never reused.

### Indexes

```javascript
{ taskNumber: 1 }                  // fast lookup by number
{ userId: 1, status: 1 }          // user's tasks filtered by status
{ userId: 1, dueDate: 1 }         // user's tasks sorted by due date
{ userId: 1, category: 1 }        // user's tasks by category
{ userId: 1, taskType: 1 }        // user's tasks by type
{ assignedTo: 1 }                 // tasks by assignee
{ userId: 1, isArchived: 1 }      // exclude archived from default queries
{ title: 'text', description: 'text' }  // full-text search
```

---

## 2. Endpoints

### 2.1 Create Task

#### `POST /api/v1/tasks`

Creates a new task. The backend auto-generates `taskNumber`. If `assignedTo` is not provided, it defaults to `Dev Ibrahim Hamed`.

**Request Body:**

```json
{
  "title": "Fix login form validation bug",
  "titleAr": "إصلاح خطأ في نموذج تسجيل الدخول",
  "description": "Email regex not matching valid .edu domains",
  "taskType": "bug",
  "assignedTo": "Dev Ibrahim Hamed",
  "status": "todo",
  "priority": "urgent",
  "category": "project",
  "tags": ["bug", "auth", "frontend"],
  "dueDate": "2026-04-10T23:59:00Z",
  "courseId": "660f1a2b3c4d5e6f7a8b9c0d",
  "notes": "",
  "reminder": "2026-04-10T18:00:00Z"
}
```

**Field Validation:**

| Field         | Validation                                                       |
| ------------- | ---------------------------------------------------------------- |
| `title`       | Required, string, 1–200 chars, trimmed                           |
| `titleAr`     | Optional, string, 1–200 chars                                    |
| `description` | Optional, string, max 2000 chars                                 |
| `taskType`    | Optional, enum: `task`, `bug`, `feature`, `improvement`. Default `task` |
| `assignedTo`  | Optional, string, max 100 chars. Default `Dev Ibrahim Hamed`     |
| `status`      | Optional, enum: `todo`, `in_progress`, `done`. Default `todo`    |
| `priority`    | Required, enum: `low`, `medium`, `high`, `urgent`                |
| `category`    | Required, enum: `homework`, `study`, `project`, `exam`, `other`  |
| `tags`        | Optional, array of strings, max 10 items, each max 50 chars      |
| `dueDate`     | Optional, valid ISO 8601 date                                    |
| `courseId`     | Optional, valid ObjectId, must be an enrolled course             |
| `notes`       | Optional, string, max 5000 chars                                 |
| `reminder`    | Optional, valid ISO 8601 date, must be in the future             |

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Task created successfully",
  "message_ar": "تم إنشاء المهمة بنجاح",
  "data": {
    "_id": "660f1a2b3c4d5e6f7a8b9c0e",
    "taskNumber": 5,
    "taskType": "bug",
    "assignedTo": "Dev Ibrahim Hamed",
    "userId": "660a1b2c3d4e5f6a7b8c9d0e",
    "title": "Fix login form validation bug",
    "status": "todo",
    "priority": "urgent",
    "category": "project",
    "tags": ["bug", "auth", "frontend"],
    "dueDate": "2026-04-10T23:59:00Z",
    "isArchived": false,
    "completedAt": null,
    "createdAt": "2026-04-01T10:00:00Z",
    "updatedAt": "2026-04-01T10:00:00Z"
  }
}
```

| Status | Condition                    |
| ------ | ---------------------------- |
| `400`  | Validation error             |
| `401`  | Missing / invalid JWT        |
| `404`  | `courseId` not found          |

---

### 2.2 List Tasks (with filters, search, pagination)

#### `GET /api/v1/tasks`

Returns the authenticated user's tasks with full filtering, sorting, search by name or number, and pagination.

**Query Parameters:**

| Parameter    | Type     | Default     | Description                                                    |
| ------------ | -------- | ----------- | -------------------------------------------------------------- |
| `page`       | `number` | `1`         | Page number                                                    |
| `limit`      | `number` | `20`        | Items per page (max 100)                                       |
| `status`     | `string` | —           | `todo`, `in_progress`, `done`, or `all`                        |
| `priority`   | `string` | —           | `low`, `medium`, `high`, `urgent`                              |
| `category`   | `string` | —           | `homework`, `study`, `project`, `exam`, `other`                |
| `taskType`   | `string` | —           | `task`, `bug`, `feature`, `improvement`                        |
| `assignedTo` | `string` | —           | Filter by assignee name (partial match, case-insensitive)      |
| `courseId`    | `string` | —           | Filter by linked course                                        |
| `tag`        | `string` | —           | Filter tasks containing this tag                               |
| `search`     | `string` | —           | **Search by title, description, or task number**. Supports `TASK-3`, `BUG-1`, `#5`, `3`, or plain text |
| `taskNumber` | `number` | —           | Exact task number lookup                                       |
| `dueFrom`    | `string` | —           | Due date ≥ this ISO date                                       |
| `dueTo`      | `string` | —           | Due date ≤ this ISO date                                       |
| `overdue`    | `boolean`| —           | `true` → dueDate < now AND status ≠ done                      |
| `archived`   | `boolean`| `false`     | Include archived tasks                                         |
| `sortBy`     | `string` | `createdAt` | `createdAt`, `dueDate`, `priority`, `status`, `title`, `taskNumber` |
| `order`      | `string` | `desc`      | `asc` or `desc`                                                |

**Search Logic (backend):**

```javascript
// If search matches pattern: "TASK-5", "BUG-12", "FEAT-3", "IMP-1"
const prefixMatch = search.match(/^(TASK|BUG|FEAT|IMP)-?(\d+)$/i);
if (prefixMatch) {
  const typeMap = { TASK: 'task', BUG: 'bug', FEAT: 'feature', IMP: 'improvement' };
  query.taskType = typeMap[prefixMatch[1].toUpperCase()];
  query.taskNumber = parseInt(prefixMatch[2]);
}
// If search is "#5" or "5"
else if (/^#?\d+$/.test(search)) {
  query.taskNumber = parseInt(search.replace('#', ''));
}
// Otherwise: full-text search on title + description
else {
  query.$text = { $search: search };
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "660f1a2b3c4d5e6f7a8b9c0e",
      "taskNumber": 5,
      "taskType": "bug",
      "assignedTo": "Dev Ibrahim Hamed",
      "title": "Fix login form validation bug",
      "status": "todo",
      "priority": "urgent",
      "category": "project",
      "tags": ["bug", "auth", "frontend"],
      "dueDate": "2026-04-10T23:59:00Z",
      "isArchived": false,
      "completedAt": null,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### 2.3 Get Single Task

#### `GET /api/v1/tasks/:id`

Returns a single task by `_id`. Only the owner or admin can access.

**Success Response — `200 OK`:** Full task object.

| Status | Condition                         |
| ------ | --------------------------------- |
| `401`  | Missing / invalid JWT             |
| `403`  | Task belongs to another user      |
| `404`  | Task not found                    |

---

### 2.4 Update Task (Edit)

#### `PUT /api/v1/tasks/:id`

Updates any field(s) on a task. Only the owner can update. Supports editing **all fields** including `title`, `description`, `priority`, `category`, `taskType`, `assignedTo`, `dueDate`, `tags`.

> **Note:** `taskNumber` is immutable — it cannot be changed after creation.

**Request Body (partial — only include fields to update):**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "taskType": "feature",
  "assignedTo": "Dev Ibrahim Hamed",
  "priority": "medium",
  "category": "project",
  "dueDate": "2026-04-15T23:59:00Z",
  "tags": ["math", "algebra", "review"],
  "notes": "Added extra review notes"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "message_ar": "تم تحديث المهمة بنجاح",
  "data": { /* full updated task object */ }
}
```

| Status | Condition                    |
| ------ | ---------------------------- |
| `400`  | Validation error             |
| `401`  | Missing / invalid JWT        |
| `403`  | Not the task owner           |
| `404`  | Task not found               |

---

### 2.5 Toggle Task Status

#### `PATCH /api/v1/tasks/:id/status`

Quick status toggle. Auto-sets `completedAt` when → `done`, clears when leaving `done`.

**Request Body:**

```json
{
  "status": "done"
}
```

**Business Logic:**
- `status` → `done`: set `completedAt = new Date()`
- `status` leaves `done`: set `completedAt = null`
- Optional: trigger notification to parent if student marks homework `done`

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Task status updated",
  "message_ar": "تم تحديث حالة المهمة",
  "data": {
    "_id": "...",
    "taskNumber": 5,
    "status": "done",
    "completedAt": "2026-04-05T14:30:00Z"
  }
}
```

---

### 2.6 Update Task Notes

#### `PATCH /api/v1/tasks/:id/notes`

Quick update for task notes only.

**Request Body:**

```json
{
  "notes": "Reviewed with teacher — need to redo problems 5, 8, 12"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Notes updated",
  "message_ar": "تم تحديث الملاحظات",
  "data": { "_id": "...", "notes": "..." }
}
```

---

### 2.7 Delete Task

#### `DELETE /api/v1/tasks/:id`

Permanently deletes a task. Only the owner can delete.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Task deleted",
  "message_ar": "تم حذف المهمة"
}
```

| Status | Condition               |
| ------ | ----------------------- |
| `401`  | Unauthenticated         |
| `403`  | Not the task owner      |
| `404`  | Task not found          |

---

### 2.8 Archive / Unarchive Task

#### `PATCH /api/v1/tasks/:id/archive`

Soft-archive a task (hide from default list, keep in DB).

**Request Body:**

```json
{ "isArchived": true }
```

---

### 2.9 Assign Task

#### `PATCH /api/v1/tasks/:id/assign`

Re-assign a task to a different person. Updates the `assignedTo` field.

**Request Body:**

```json
{
  "assignedTo": "Dev Ibrahim Hamed"
}
```

**Field Validation:**

| Field        | Validation                                    |
| ------------ | --------------------------------------------- |
| `assignedTo` | Required, string, 1–100 chars, trimmed        |

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Task assigned successfully",
  "message_ar": "تم تعيين المهمة بنجاح",
  "data": {
    "_id": "...",
    "taskNumber": 5,
    "assignedTo": "Dev Ibrahim Hamed"
  }
}
```

---

### 2.10 Task Statistics

#### `GET /api/v1/tasks/stats`

Returns aggregate counts for the current user's tasks.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "total": 42,
    "todo": 18,
    "inProgress": 8,
    "done": 16,
    "overdue": 3,
    "dueSoon": 5,
    "byCategory": { "homework": 20, "study": 10, "project": 5, "exam": 4, "other": 3 },
    "byPriority": { "urgent": 2, "high": 10, "medium": 18, "low": 12 },
    "byType": { "task": 30, "bug": 5, "feature": 4, "improvement": 3 },
    "completionRate": 38.1,
    "streakDays": 5
  }
}
```

---

### 2.11 Bulk Status Update

#### `PATCH /api/v1/tasks/bulk-status`

Update status of multiple tasks at once.

**Request Body:**

```json
{
  "taskIds": ["id1", "id2", "id3"],
  "status": "done"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "3 tasks updated",
  "message_ar": "تم تحديث 3 مهام",
  "data": { "updated": 3 }
}
```

---

## 3. Error Response Format

```json
{
  "success": false,
  "message": "English error message",
  "message_ar": "رسالة الخطأ بالعربي",
  "errors": { "fieldName": ["Validation message"] }
}
```

| HTTP Status | Usage                              |
| ----------- | ---------------------------------- |
| `400`       | Validation error                   |
| `401`       | Unauthenticated (no/invalid token) |
| `403`       | Forbidden (not task owner)         |
| `404`       | Task not found                     |
| `429`       | Rate limited                       |
| `500`       | Internal server error              |

---

## 4. Rate Limiting

| Rule                     | Value                    |
| ------------------------ | ------------------------ |
| Create task              | 30 per hour per user     |
| List / read              | 120 per minute per user  |
| Update / toggle / assign | 60 per minute per user   |
| Bulk operations          | 10 per minute per user   |

---

## 5. Notification Triggers

| Event                     | Notify                             | Channel       |
| ------------------------- | ---------------------------------- | ------------- |
| Task due in 24h           | Assignee                           | Push + In-app |
| Task due in 1h            | Assignee                           | Push + In-app |
| Task overdue              | Assignee + Creator                 | Push + Email  |
| Task assigned to someone  | New assignee                       | Push + In-app |
| Student marks task done   | Parent (if linked)                 | In-app        |
| Teacher assigns task      | Student                            | Push + In-app |

---

## 6. Permissions

| Role      | Create | Read Own | Read Others | Update Own | Delete Own | Assign  | View Stats |
| --------- | ------ | -------- | ----------- | ---------- | ---------- | ------- | ---------- |
| Student   | ✅     | ✅       | ❌          | ✅         | ✅         | ❌      | ✅         |
| Teacher   | ✅     | ✅       | Students'*  | ✅         | ✅         | ✅      | ✅         |
| Parent    | ❌     | Children's| ❌         | ❌         | ❌         | ❌      | Children's |
| Admin     | ✅     | ✅       | ✅          | ✅         | ✅         | ✅      | ✅         |

\* Teachers can view tasks of enrolled students in their courses.

---

## 7. Backend Implementation Checklist

```
src/modules/tasks/
├── task.model.ts          # Mongoose schema + indexes + auto-increment taskNumber
├── task.controller.ts     # Route handlers
├── task.service.ts        # Business logic (incl. number generation, search logic)
├── task.routes.ts         # Express router
├── task.validation.ts     # Zod schemas for request validation
├── task.types.ts          # TypeScript interfaces
└── task.test.ts           # Supertest + Jest integration tests
```

### Task Number Auto-Increment Strategy

Use a **counters** collection:

```typescript
// counters collection
const counterSchema = new Schema({
  _id: String,        // e.g. "taskNumber"
  seq: { type: Number, default: 0 }
});

// In task.service.ts:
async function getNextTaskNumber(): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    'taskNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
```

### Mongoose Schema (reference):

```typescript
const taskSchema = new Schema({
  taskNumber:    { type: Number, required: true, unique: true, index: true },
  taskType:      { type: String, enum: ['task', 'bug', 'feature', 'improvement'], default: 'task' },
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedTo:    { type: String, required: true, default: 'Dev Ibrahim Hamed', maxlength: 100, trim: true },
  courseId:       { type: Schema.Types.ObjectId, ref: 'Course', default: null },
  title:         { type: String, required: true, maxlength: 200, trim: true },
  titleAr:       { type: String, maxlength: 200, trim: true },
  description:   { type: String, maxlength: 2000, trim: true },
  descriptionAr: { type: String, maxlength: 2000, trim: true },
  status:        { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority:      { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  category:      { type: String, enum: ['homework', 'study', 'project', 'exam', 'other'], default: 'other' },
  tags:          [{ type: String, maxlength: 50 }],
  dueDate:       { type: Date, default: null },
  completedAt:   { type: Date, default: null },
  notes:         { type: String, maxlength: 5000, default: '' },
  attachments:   [{ url: String, filename: String, type: String, size: Number }],
  reminder:      { type: Date, default: null },
  isArchived:    { type: Boolean, default: false },
}, { timestamps: true });

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, taskType: 1 });
taskSchema.index({ userId: 1, isArchived: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ title: 'text', description: 'text' });
```

---

## 8. Frontend Integration

### API Service (`src/modules/tasks/task.api.ts`):

| Function                      | Endpoint                          | Method  |
| ----------------------------- | --------------------------------- | ------- |
| `createTask(data)`            | `POST /api/v1/tasks`              | POST    |
| `fetchTasks(filters)`         | `GET /api/v1/tasks`               | GET     |
| `fetchTask(id)`               | `GET /api/v1/tasks/:id`           | GET     |
| `updateTask(id, data)`        | `PUT /api/v1/tasks/:id`           | PUT     |
| `toggleStatus(id, status)`    | `PATCH /api/v1/tasks/:id/status`  | PATCH   |
| `updateNotes(id, notes)`      | `PATCH /api/v1/tasks/:id/notes`   | PATCH   |
| `deleteTask(id)`              | `DELETE /api/v1/tasks/:id`        | DELETE  |
| `archiveTask(id, flag)`       | `PATCH /api/v1/tasks/:id/archive` | PATCH   |
| `assignTask(id, assignedTo)`  | `PATCH /api/v1/tasks/:id/assign`  | PATCH   |
| `fetchStats()`                | `GET /api/v1/tasks/stats`         | GET     |
| `bulkStatus(ids, status)`     | `PATCH /api/v1/tasks/bulk-status` | PATCH   |

### Frontend Search Implementation

Search input supports multiple formats:

| Input       | Behavior                                        |
| ----------- | ----------------------------------------------- |
| `#5`        | Find task with `taskNumber === 5`               |
| `3`         | Find task with `taskNumber === 3`               |
| `TASK-3`    | Find task type `task` + number `3`              |
| `BUG-1`     | Find task type `bug` + number `1`               |
| `FEAT-12`   | Find task type `feature` + number `12`          |
| `IMP-4`     | Find task type `improvement` + number `4`       |
| `login`     | Full-text search on title, description, tags, assignee |

---

## 9. Endpoint Summary

| Endpoint                           | Method   | Auth     | Purpose                    |
| ---------------------------------- | -------- | -------- | -------------------------- |
| `/api/v1/tasks`                    | `POST`   | JWT      | Create task                |
| `/api/v1/tasks`                    | `GET`    | JWT      | List tasks (filtered)      |
| `/api/v1/tasks/stats`              | `GET`    | JWT      | Aggregate statistics       |
| `/api/v1/tasks/bulk-status`        | `PATCH`  | JWT      | Bulk status update         |
| `/api/v1/tasks/:id`               | `GET`    | JWT      | Get single task            |
| `/api/v1/tasks/:id`               | `PUT`    | JWT      | Update (edit) task         |
| `/api/v1/tasks/:id`               | `DELETE` | JWT      | Delete task                |
| `/api/v1/tasks/:id/status`        | `PATCH`  | JWT      | Toggle status              |
| `/api/v1/tasks/:id/notes`         | `PATCH`  | JWT      | Update notes               |
| `/api/v1/tasks/:id/archive`       | `PATCH`  | JWT      | Archive / unarchive        |
| `/api/v1/tasks/:id/assign`        | `PATCH`  | JWT      | Assign to person           |

---

## 10. Roadmap Integration

The project's **Roadmap page** (`/roadmap`) also uses a task-based data model to manage the 2-month sprint plan. The roadmap tasks are **client-side only** (no backend API yet) and share similar concepts with the Tasks Module.

### 10.1 RoadmapTask Data Model (Frontend)

| Field         | Type                               | Default              | Description                                          |
| ------------- | ---------------------------------- | -------------------- | ---------------------------------------------------- |
| `id`          | `string`                           | —                    | Unique ID (e.g. `b1-1`, `w3-2`, `custom-{timestamp}`) |
| `taskNumber`  | `number`                           | Auto-increment       | Sequential number (1, 2, 3…)                          |
| `taskType`    | `TaskType`                         | `'task'`             | `task` \| `bug` \| `feature` \| `improvement`        |
| `title`       | `string`                           | —                    | Task title                                            |
| `desc`        | `string`                           | —                    | Description                                           |
| `status`      | `Status`                           | `'todo'`             | `done` \| `in-progress` \| `todo` \| `blocked`       |
| `track`       | `Track`                            | —                    | `website` \| `backend` \| `mobile` \| `devops`       |
| `week`        | `Week`                             | —                    | `1` through `8`                                       |
| `estimate`    | `string`                           | —                    | e.g. `'2d'`, `'4h'`, `'—'`                           |
| `assignee`    | `string`                           | `'Dev Ibrahim Hamed'`| Person assigned to the task                           |
| `parallel`    | `string[]` (optional)              | —                    | IDs of tasks that can run in parallel                 |
| `blockedBy`   | `string[]` (optional)              | —                    | IDs of tasks that must complete first                 |

### 10.2 Display ID Format

Same convention as the Tasks Module:

| Type         | Prefix | Example  |
| ------------ | ------ | -------- |
| task         | TASK   | TASK-1   |
| bug          | BUG    | BUG-5    |
| feature      | FEAT   | FEAT-12  |
| improvement  | IMP    | IMP-3    |

### 10.3 CRUD Operations (Client-Side)

| Operation       | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| **Create**      | Open modal via "New Task" button or "+" per week column; auto-assigns `taskNumber` |
| **Read**        | Board view (week columns), Table view (sortable), Parallel view (grouped)       |
| **Update**      | Click pencil icon on task card → edit modal; click status icon → cycle status    |
| **Delete**      | Click trash icon → confirm dialog → remove from state                           |

### 10.4 Search Capabilities

The roadmap search bar supports:

| Query Format | Matches                                                |
| ------------ | ------------------------------------------------------ |
| `auth`       | Title or description containing "auth"                 |
| `#5`         | Task with `taskNumber === 5`                           |
| `5`          | Same as above (pure number)                            |
| `TASK-3`     | Task type `task` + number `3`                          |
| `BUG-1`      | Task type `bug` + number `1`                           |
| `Ibrahim`    | Assignee name containing "Ibrahim"                     |

### 10.5 Views

| View       | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| **Board**  | 8 week columns, each showing tasks filtered by active track, with progress |
| **Table**  | Full table with ID, title, track, week, assignee, estimate, status columns |
| **Parallel** | Groups tasks per week that can run simultaneously across tracks           |

### 10.6 Component Architecture

```
src/components/
  RoadmapPage.tsx              ← Main orchestrator (state, handlers, layout)
  roadmap/
    index.ts                   ← Barrel exports
    roadmap.types.ts           ← Types, constants, configs (RoadmapTask, Status, Track, etc.)
    roadmap.data.ts            ← Initial 48 tasks + getNextRoadmapTaskNumber()
    RoadmapHeader.tsx          ← Sticky header: progress, search, view toggle, new task btn
    RoadmapStats.tsx           ← Track stats cards, milestone strip, filter pills
    RoadmapWeekColumn.tsx      ← Board view week column with task cards + "add" button
    RoadmapTaskCard.tsx        ← Expandable task card with status toggle, edit, delete, copy ID
    RoadmapTableView.tsx       ← Table view with all task columns
    RoadmapParallelView.tsx    ← Parallel groups per week
    RoadmapBottomSummary.tsx   ← Effort by track, sprint rules, launch checklist
    RoadmapTaskFormModal.tsx   ← Add/edit modal (all fields, default assignee)
```

### 10.7 Future: Connect Roadmap to Backend API

When the backend is ready, roadmap tasks can be persisted by:

1. Creating a `roadmapTasks` collection with the same schema as above
2. Using the same `/api/v1/tasks` endpoints with an additional `source: 'roadmap'` field
3. Or creating a separate `/api/v1/roadmap/tasks` namespace

---

## 11. Environment Variables

```env
# No extra env vars needed — uses existing:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
```
