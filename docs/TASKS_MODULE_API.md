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

## 10. Roadmap Tasks API (Backend)

The **Roadmap Module** manages the 2-month sprint plan (8 weeks × 4 tracks). Currently data lives in a static frontend file (`roadmap.data.ts`). This section documents the **backend API** needed to persist roadmap tasks in MongoDB so the frontend replaces its static data with real API calls.

### Base URL

```
/api/v1/roadmap/tasks
```

All endpoints require **Bearer JWT authentication** and an **admin or developer role**.

---

### 10.1 MongoDB Collection: `roadmapTasks`

| Field         | Type          | Required | Default              | Description                                                            |
| ------------- | ------------- | -------- | -------------------- | ---------------------------------------------------------------------- |
| `_id`         | `ObjectId`    | auto     |                      | Primary key                                                            |
| `taskId`      | `String`      | ✅       |                      | Short human ID (e.g. `b1-1`, `w3-2`, `custom-{timestamp}`)            |
| `taskNumber`  | `Number`      | auto     | Auto-increment       | Unique sequential number (1, 2, 3…) — never reused                    |
| `taskType`    | `String`      | ✅       | `'task'`             | `task` \| `bug` \| `feature` \| `improvement`                         |
| `title`       | `String`      | ✅       |                      | Task title (max 300 chars)                                             |
| `desc`        | `String`      | ✅       |                      | Description (max 5000 chars)                                           |
| `status`      | `String`      | ✅       | `'todo'`             | `todo` \| `in-progress` \| `done` \| `blocked`                        |
| `track`       | `String`      | ✅       |                      | `website` \| `backend` \| `mobile` \| `devops`                        |
| `week`        | `Number`      | ✅       |                      | Sprint week: `1` through `8`                                           |
| `estimate`    | `String`      | ❌       | `'—'`                | Time estimate (e.g. `'2d'`, `'4h'`, `'—'`)                            |
| `assignee`    | `String`      | ✅       | `'Dev Ibrahim Hamed'`| Person assigned                                                        |
| `tags`        | `[String]`    | ❌       | `[]`                 | Array of tag keys — see §10.2 for valid values                         |
| `parallel`    | `[String]`    | ❌       | `[]`                 | `taskId`s of tasks that can run in parallel                            |
| `blockedBy`   | `[String]`    | ❌       | `[]`                 | `taskId`s of tasks that must complete first                            |
| `completedAt` | `Date`        | ❌       | `null`               | Auto-set when status → `done`, cleared when leaving `done`             |
| `createdAt`   | `Date`        | auto     |                      | Mongoose timestamps                                                    |
| `updatedAt`   | `Date`        | auto     |                      | Mongoose timestamps                                                    |

### 10.2 Valid Tags (15 total)

```
frontend | backend | mobile | devops | firebase | aws | auth | payment
ui | api | database | testing | deploy | security | performance
```

Each tag has a display label and style — these are defined client-side in `TAG_CONFIG`. The backend only validates that tags are from this allowed set.

### 10.3 Display ID Format

| `taskType`    | Prefix  | Example   |
| ------------- | ------- | --------- |
| `task`        | `TASK`  | `TASK-1`  |
| `bug`         | `BUG`   | `BUG-5`   |
| `feature`     | `FEAT`  | `FEAT-12` |
| `improvement` | `IMP`   | `IMP-3`   |

Display ID = `{prefix}-{taskNumber}` — computed client-side, not stored in DB.

### 10.4 Indexes

```javascript
{ taskNumber: 1 }                  // unique, fast lookup by number
{ taskId: 1 }                     // unique, fast lookup by short ID
{ track: 1, week: 1 }            // board view: tasks per track+week
{ status: 1 }                    // status filter
{ 'tags': 1 }                    // tag filter
{ title: 'text', desc: 'text' }  // full-text search
{ assignee: 1 }                  // assignee filter
```

### 10.5 Mongoose Schema

```typescript
import { Schema, model } from 'mongoose';

const VALID_TAGS = [
  'frontend', 'backend', 'mobile', 'devops', 'firebase', 'aws',
  'auth', 'payment', 'ui', 'api', 'database', 'testing',
  'deploy', 'security', 'performance',
];

const roadmapTaskSchema = new Schema({
  taskId:      { type: String, required: true, unique: true, trim: true },
  taskNumber:  { type: Number, required: true, unique: true, index: true },
  taskType:    { type: String, enum: ['task', 'bug', 'feature', 'improvement'], default: 'task' },
  title:       { type: String, required: true, maxlength: 300, trim: true },
  desc:        { type: String, required: true, maxlength: 5000, trim: true },
  status:      { type: String, enum: ['todo', 'in-progress', 'done', 'blocked'], default: 'todo' },
  track:       { type: String, enum: ['website', 'backend', 'mobile', 'devops'], required: true },
  week:        { type: Number, min: 1, max: 8, required: true },
  estimate:    { type: String, default: '—', maxlength: 20 },
  assignee:    { type: String, default: 'Dev Ibrahim Hamed', maxlength: 100, trim: true },
  tags:        [{ type: String, enum: VALID_TAGS }],
  parallel:    [{ type: String, trim: true }],
  blockedBy:   [{ type: String, trim: true }],
  completedAt: { type: Date, default: null },
}, { timestamps: true });

roadmapTaskSchema.index({ track: 1, week: 1 });
roadmapTaskSchema.index({ status: 1 });
roadmapTaskSchema.index({ tags: 1 });
roadmapTaskSchema.index({ assignee: 1 });
roadmapTaskSchema.index({ title: 'text', desc: 'text' });

export const RoadmapTask = model('RoadmapTask', roadmapTaskSchema);
```

### 10.6 Task Number Auto-Increment

Use a shared **counters** collection (same as the Tasks Module):

```typescript
async function getNextRoadmapTaskNumber(): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    'roadmapTaskNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
```

---

## 11. Roadmap Tasks — API Endpoints

### 11.1 List Roadmap Tasks (with filters, search, pagination)

#### `GET /api/v1/roadmap/tasks`

Returns all roadmap tasks with full filtering.

**Query Parameters:**

| Parameter  | Type     | Default     | Description                                                           |
| ---------- | -------- | ----------- | --------------------------------------------------------------------- |
| `page`     | `number` | `1`         | Page number                                                           |
| `limit`    | `number` | `100`       | Items per page (max 200) — default 100 to load full roadmap           |
| `status`   | `string` | —           | `todo`, `in-progress`, `done`, `blocked`, or `all`                    |
| `track`    | `string` | —           | `website`, `backend`, `mobile`, `devops`                              |
| `week`     | `number` | —           | `1` through `8`                                                       |
| `tag`      | `string` | —           | Filter tasks containing this tag (can pass multiple: `tag=aws&tag=api`) |
| `search`   | `string` | —           | Search by title, desc, assignee, or task number (see §11.2)           |
| `assignee` | `string` | —           | Partial match on assignee name (case-insensitive)                     |
| `sortBy`   | `string` | `week`      | `week`, `taskNumber`, `status`, `track`, `createdAt`                  |
| `order`    | `string` | `asc`       | `asc` or `desc`                                                      |

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "660f1a2b3c4d5e6f7a8b9c0e",
      "taskId": "b1-1",
      "taskNumber": 1,
      "taskType": "task",
      "title": "Backend project scaffold",
      "desc": "Node.js 20 + Express 5, TypeScript, src/modules ...",
      "status": "todo",
      "track": "backend",
      "week": 1,
      "estimate": "4h",
      "assignee": "Dev Ibrahim Hamed",
      "tags": ["backend", "api"],
      "parallel": [],
      "blockedBy": [],
      "completedAt": null,
      "createdAt": "2026-04-01T00:00:00Z",
      "updatedAt": "2026-04-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 64,
    "totalPages": 1,
    "hasMore": false
  },
  "stats": {
    "total": 64,
    "done": 3,
    "inProgress": 0,
    "todo": 61,
    "blocked": 0,
    "pct": 5
  }
}
```

### 11.2 Search Logic (Backend)

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
// Otherwise: full-text search on title + desc + assignee
else {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { desc: { $regex: search, $options: 'i' } },
    { assignee: { $regex: search, $options: 'i' } },
  ];
}
```

---

### 11.3 Get Single Roadmap Task

#### `GET /api/v1/roadmap/tasks/:id`

Returns a single task by `_id` or `taskId`.

**Success Response — `200 OK`:** Full task object.

| Status | Condition            |
| ------ | -------------------- |
| `401`  | Missing / invalid JWT|
| `404`  | Task not found       |

---

### 11.4 Create Roadmap Task

#### `POST /api/v1/roadmap/tasks`

Creates a new roadmap task. Backend auto-generates `taskNumber`.

**Request Body:**

```json
{
  "taskId": "custom-1717654321",
  "taskType": "task",
  "title": "New feature module",
  "desc": "Description of the new task",
  "status": "todo",
  "track": "backend",
  "week": 3,
  "estimate": "2d",
  "assignee": "Dev Ibrahim Hamed",
  "tags": ["backend", "api"],
  "parallel": ["b3-1"],
  "blockedBy": ["b2-3"]
}
```

**Field Validation:**

| Field       | Validation                                                                        |
| ----------- | --------------------------------------------------------------------------------- |
| `taskId`    | Required, string, unique, 1–50 chars                                              |
| `taskType`  | Optional, enum: `task`, `bug`, `feature`, `improvement`. Default `task`            |
| `title`     | Required, string, 1–300 chars, trimmed                                             |
| `desc`      | Required, string, 1–5000 chars, trimmed                                            |
| `status`    | Optional, enum: `todo`, `in-progress`, `done`, `blocked`. Default `todo`           |
| `track`     | Required, enum: `website`, `backend`, `mobile`, `devops`                           |
| `week`      | Required, number, 1–8                                                              |
| `estimate`  | Optional, string, max 20 chars. Default `'—'`                                      |
| `assignee`  | Optional, string, max 100 chars. Default `'Dev Ibrahim Hamed'`                     |
| `tags`      | Optional, array of valid tag strings (see §10.2), max 10                           |
| `parallel`  | Optional, array of `taskId` strings                                                |
| `blockedBy` | Optional, array of `taskId` strings                                                |

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Roadmap task created successfully",
  "message_ar": "تم إنشاء مهمة خارطة الطريق بنجاح",
  "data": {
    "_id": "660f1a2b3c4d5e6f7a8b9c0e",
    "taskId": "custom-1717654321",
    "taskNumber": 56,
    "taskType": "task",
    "title": "New feature module",
    "status": "todo",
    "track": "backend",
    "week": 3,
    "estimate": "2d",
    "assignee": "Dev Ibrahim Hamed",
    "tags": ["backend", "api"],
    "parallel": ["b3-1"],
    "blockedBy": ["b2-3"],
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
| `409`  | Duplicate `taskId`           |

---

### 11.5 Update Roadmap Task

#### `PUT /api/v1/roadmap/tasks/:id`

Updates any field(s) on a roadmap task. Accepts `_id` or `taskId` as `:id` param.

> **Note:** `taskNumber` is immutable — it cannot be changed after creation.

**Request Body (partial — only include fields to update):**

```json
{
  "title": "Updated title",
  "desc": "Updated description",
  "status": "in-progress",
  "track": "website",
  "week": 4,
  "estimate": "3d",
  "tags": ["frontend", "ui", "api"],
  "parallel": [],
  "blockedBy": ["b3-1"]
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Roadmap task updated successfully",
  "message_ar": "تم تحديث مهمة خارطة الطريق بنجاح",
  "data": { /* full updated task object */ }
}
```

| Status | Condition                    |
| ------ | ---------------------------- |
| `400`  | Validation error             |
| `401`  | Missing / invalid JWT        |
| `404`  | Task not found               |

---

### 11.6 Toggle Roadmap Task Status

#### `PATCH /api/v1/roadmap/tasks/:id/status`

Quick status cycle. Auto-sets `completedAt` when → `done`, clears when leaving `done`.

**Request Body:**

```json
{
  "status": "done"
}
```

**Business Logic:**
- `status` → `done`: set `completedAt = new Date()`
- `status` leaves `done`: set `completedAt = null`
- `status` → `blocked`: optionally validate that `blockedBy` is not empty

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Roadmap task status updated",
  "message_ar": "تم تحديث حالة مهمة خارطة الطريق",
  "data": {
    "_id": "...",
    "taskId": "b1-1",
    "taskNumber": 1,
    "status": "done",
    "completedAt": "2026-04-05T14:30:00Z"
  }
}
```

---

### 11.7 Delete Roadmap Task

#### `DELETE /api/v1/roadmap/tasks/:id`

Permanently deletes a roadmap task. Accepts `_id` or `taskId`.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Roadmap task deleted",
  "message_ar": "تم حذف مهمة خارطة الطريق"
}
```

| Status | Condition               |
| ------ | ----------------------- |
| `401`  | Unauthenticated         |
| `404`  | Task not found          |

---

### 11.8 Seed Roadmap Tasks (Initial Data)

#### `POST /api/v1/roadmap/tasks/seed`

Bulk-inserts the initial ~64 roadmap tasks into the database. This is an **admin-only** endpoint used once (or to reset data). It drops all existing roadmap tasks and inserts the seed data.

**Request Body:** None (seed data is hardcoded in the backend service).

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "64 roadmap tasks seeded successfully",
  "message_ar": "تم إدخال 64 مهمة لخارطة الطريق بنجاح",
  "data": {
    "inserted": 64,
    "counterReset": 64
  }
}
```

| Status | Condition                 |
| ------ | ------------------------- |
| `401`  | Unauthenticated           |
| `403`  | Not admin                 |

---

### 11.9 Roadmap Statistics

#### `GET /api/v1/roadmap/tasks/stats`

Returns aggregate counts for the roadmap.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "total": 64,
    "done": 3,
    "inProgress": 0,
    "todo": 61,
    "blocked": 0,
    "completionPct": 5,
    "byTrack": {
      "website": { "total": 21, "done": 3, "todo": 18 },
      "backend": { "total": 24, "done": 0, "todo": 24 },
      "mobile": { "total": 15, "done": 0, "todo": 15 },
      "devops": { "total": 4, "done": 0, "todo": 4 }
    },
    "byWeek": {
      "1": { "total": 9, "done": 2, "todo": 7 },
      "2": { "total": 8, "done": 1, "todo": 7 },
      "3": { "total": 6, "done": 0, "todo": 6 },
      "4": { "total": 8, "done": 0, "todo": 8 },
      "5": { "total": 8, "done": 0, "todo": 8 },
      "6": { "total": 9, "done": 0, "todo": 9 },
      "7": { "total": 9, "done": 0, "todo": 9 },
      "8": { "total": 8, "done": 0, "todo": 8 }
    },
    "byTag": {
      "backend": 22, "frontend": 15, "mobile": 13, "api": 18,
      "ui": 14, "auth": 8, "aws": 8, "firebase": 6, "payment": 3,
      "database": 4, "security": 4, "testing": 3, "deploy": 5,
      "devops": 3, "performance": 3
    }
  }
}
```

---

## 12. Roadmap Endpoint Summary

| Endpoint                                | Method   | Auth     | Purpose                         |
| --------------------------------------- | -------- | -------- | ------------------------------- |
| `/api/v1/roadmap/tasks`                 | `GET`    | JWT      | List tasks (filtered, paginated)|
| `/api/v1/roadmap/tasks`                 | `POST`   | JWT      | Create a roadmap task           |
| `/api/v1/roadmap/tasks/stats`           | `GET`    | JWT      | Aggregate statistics            |
| `/api/v1/roadmap/tasks/seed`            | `POST`   | JWT+Admin| Seed initial 64 tasks           |
| `/api/v1/roadmap/tasks/:id`             | `GET`    | JWT      | Get single task                 |
| `/api/v1/roadmap/tasks/:id`             | `PUT`    | JWT      | Update (edit) task              |
| `/api/v1/roadmap/tasks/:id`             | `DELETE` | JWT      | Delete task                     |
| `/api/v1/roadmap/tasks/:id/status`      | `PATCH`  | JWT      | Toggle status                   |

---

## 13. Frontend → Backend Migration Guide

When the backend is ready, update the frontend to fetch from the API instead of static data:

### 13.1 Replace Static Data

```typescript
// BEFORE (roadmap.data.ts) — remove INITIAL_TASKS static array
// AFTER (roadmap.api.ts) — new API service

import axios from 'axios';

const API = '/api/v1/roadmap/tasks';

export const roadmapApi = {
  list:         (params?: Record<string, string>) => axios.get(API, { params }),
  get:          (id: string) => axios.get(`${API}/${id}`),
  create:       (data: Partial<RoadmapTask>) => axios.post(API, data),
  update:       (id: string, data: Partial<RoadmapTask>) => axios.put(`${API}/${id}`, data),
  toggleStatus: (id: string, status: string) => axios.patch(`${API}/${id}/status`, { status }),
  remove:       (id: string) => axios.delete(`${API}/${id}`),
  stats:        () => axios.get(`${API}/stats`),
  seed:         () => axios.post(`${API}/seed`),
};
```

### 13.2 Update RoadmapPage.tsx

```typescript
// Replace useState(INITIAL_TASKS) with API fetch:
const [tasks, setTasks] = useState<RoadmapTask[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  roadmapApi.list().then(res => {
    setTasks(res.data.data);
    setLoading(false);
  });
}, []);

// Replace local handlers with API calls:
const handleSave = async (task: Partial<RoadmapTask>) => {
  if (modalTask) {
    const res = await roadmapApi.update(modalTask.id, task);
    setTasks(prev => prev.map(t => t.id === modalTask.id ? res.data.data : t));
  } else {
    const res = await roadmapApi.create(task);
    setTasks(prev => [...prev, res.data.data]);
  }
  setModalTask(undefined);
};

const handleDelete = async (id: string) => {
  await roadmapApi.remove(id);
  setTasks(prev => prev.filter(t => t.id !== id));
};

const handleToggleStatus = async (id: string) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const nextIdx = (STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length;
  const res = await roadmapApi.toggleStatus(id, STATUS_CYCLE[nextIdx]);
  setTasks(prev => prev.map(t => t.id === id ? { ...t, ...res.data.data } : t));
};
```

### 13.3 Field Mapping (Frontend ↔ Backend)

| Frontend Field | Backend Field | Notes                                      |
| -------------- | ------------- | ------------------------------------------ |
| `id`           | `taskId`      | Short human-readable ID (e.g. `b1-1`)      |
| `taskNumber`   | `taskNumber`  | Same — auto-incremented                     |
| `taskType`     | `taskType`    | Same enum values                            |
| `title`        | `title`       | Same                                        |
| `desc`         | `desc`        | Same                                        |
| `status`       | `status`      | Same enum values                            |
| `track`        | `track`       | Same enum values                            |
| `week`         | `week`        | Same (1–8)                                  |
| `estimate`     | `estimate`    | Same                                        |
| `assignee`     | `assignee`    | Same — default `Dev Ibrahim Hamed`          |
| `tags`         | `tags`        | Same — array of tag strings                 |
| `parallel`     | `parallel`    | Same — array of `taskId` strings            |
| `blockedBy`    | `blockedBy`   | Same — array of `taskId` strings            |
| —              | `_id`         | MongoDB ObjectId (backend only)             |
| —              | `completedAt` | Auto-managed by backend on status changes   |
| —              | `createdAt`   | Mongoose timestamp                          |
| —              | `updatedAt`   | Mongoose timestamp                          |

---

## 14. Backend Implementation Checklist — Roadmap Module

```
src/modules/roadmap/
├── roadmapTask.model.ts       # Mongoose schema (§10.5) + indexes
├── roadmapTask.controller.ts  # Route handlers (list, get, create, update, delete, toggle, seed, stats)
├── roadmapTask.service.ts     # Business logic (number generation, search, seed data, stats aggregation)
├── roadmapTask.routes.ts      # Express router
├── roadmapTask.validation.ts  # Zod schemas for request validation
├── roadmapTask.types.ts       # TypeScript interfaces
├── roadmapTask.seed.ts        # Seed data (all 64 tasks — copy from scripts/seed-roadmap.ts)
└── roadmapTask.test.ts        # Supertest + Jest integration tests
```

---

## 15. Seed Script

A standalone seed script is provided at `scripts/seed-roadmap.ts` to insert all 64 initial roadmap tasks into MongoDB. Run it with:

```bash
npx ts-node scripts/seed-roadmap.ts
```

Or use the seed endpoint: `POST /api/v1/roadmap/tasks/seed` (admin only).

See `scripts/seed-roadmap.ts` for the complete task data ready for MongoDB insertion.

---

## 16. Environment Variables

```env
# Existing — no extra env vars needed for roadmap module:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
```
