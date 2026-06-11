# API Routes - AI-Powered Student Companion Platform

**Base URL:** `/api/v1`  
**Authentication:** `Authorization: Bearer <JWT>` (except for `/auth/*`)  
**Content-Type:** `application/json`

---

## 1. Authentication

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Create a new account | `{ "email": "string", "name": "string", "password": "string" }` | `{ "id": "uuid", "email": "string", "name": "string" }` |
| POST | `/auth/login` | Login and receive JWT | `{ "email": "string", "password": "string" }` | `{ "token": "jwt_string", "user": {...} }` |
| GET | `/auth/me` | Get current user info | – | `{ "id": "uuid", "email": "string", "name": "string" }` |

---

## 2. Resource Vault

| Method | Endpoint | Description | Request Body (if any) | Response |
|--------|----------|-------------|----------------------|----------|
| GET | `/resources` | List user’s resources (paginated) | Query: `?page=1&limit=20` | `{ "data": [...], "total": 100 }` |
| POST | `/resources` | Add a new resource | `{ "title": "string", "type": "pdf|google_drive|video|github|other", "url": "string", "tags": ["string"] }` | Created resource object |
| GET | `/resources/:id` | Get resource details | – | Resource object |
| PUT | `/resources/:id` | Update resource | Same as POST (all fields optional) | Updated resource |
| DELETE | `/resources/:id` | Delete resource | – | `{ "message": "Deleted" }` |

---

## 3. Collaborative Workspaces

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/workspaces` | List user’s workspaces | – | `[{ "id": "uuid", "name": "string", "owner_id": "uuid" }]` |
| POST | `/workspaces` | Create a workspace | `{ "name": "string" }` | Created workspace object |
| GET | `/workspaces/:id` | Get workspace + members | – | Workspace object + `members: [...]` |
| PUT | `/workspaces/:id` | Update workspace | `{ "name": "string" }` | Updated workspace |
| DELETE | `/workspaces/:id` | Delete workspace | – | `{ "message": "Deleted" }` |
| POST | `/workspaces/:id/members` | Add a member | `{ "userId": "uuid" }` | `{ "message": "Member added" }` |
| DELETE | `/workspaces/:id/members/:userId` | Remove a member | – | `{ "message": "Removed" }` |
| GET | `/workspaces/:id/notes` | List all notes in workspace | Query: `?page=1` | `{ "data": [...] }` |
| POST | `/workspaces/:id/notes` | Add a note | `{ "title": "string", "content": "string" }` | Created note object |
| PUT | `/workspaces/:id/notes/:noteId` | Edit a note | `{ "title": "string", "content": "string" }` | Updated note |

---

## 4. Tasks (Personal & Workspace)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/tasks` | Get tasks (filter by `?workspaceId=uuid` & `?status=pending`) | – | `[{...}]` |
| POST | `/tasks` | Create a task | `{ "title": "string", "description": "string", "due_date": "YYYY-MM-DD", "workspaceId?": "uuid", "recurrence?": "weekly|none" }` | Created task object |
| GET | `/tasks/:id` | Get single task | – | Task object |
| PUT | `/tasks/:id` | Update task | Any of: `title`, `description`, `status`, `due_date` | Updated task |
| DELETE | `/tasks/:id` | Delete task | – | `{ "message": "Deleted" }` |
| GET | `/tasks/analytics` | Productivity stats | – | `{ "completion_rate": 0.85, "weekly_trend": [...], "total_completed": 42 }` |

---

## 5. Attendance & Timetable

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/schedule` | Get user’s class schedule | – | `[{ "id": "uuid", "course_name": "string", "day_of_week": 0-6, "start_time": "HH:MM", "end_time": "HH:MM", "location": "string" }]` |
| POST | `/schedule` | Add a class | `{ "course_name": "string", "day_of_week": 0-6, "start_time": "HH:MM", "end_time": "HH:MM", "location": "string" }` | Created class object |
| PUT | `/schedule/:id` | Update a class | Same as POST (all optional) | Updated class |
| DELETE | `/schedule/:id` | Delete a class | – | `{ "message": "Deleted" }` |
| GET | `/attendance` | Get attendance records | Query: `?classId=uuid&?from=YYYY-MM-DD&?to=YYYY-MM-DD` | `[{ "id": "uuid", "date": "YYYY-MM-DD", "status": "present|absent|cancelled" }]` |
| POST | `/attendance` | Mark attendance for a class on a date | `{ "classId": "uuid", "date": "YYYY-MM-DD", "status": "present|absent|cancelled" }` | Created record |
| PUT | `/attendance/:id` | Update status | `{ "status": "present|absent|cancelled" }` | Updated record |
| GET | `/attendance/percentage` | Compute attendance % | Query: `?courseName=string` (optional) | `{ "courseName": "string", "percentage": 87.5, "present": 14, "total": 16 }` |

---

## 6. Academic Performance

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/exams` | List exam schedules | – | `[{ "id": "uuid", "course_name": "string", "exam_date": "YYYY-MM-DD", "exam_type": "midterm|final|quiz" }]` |
| POST | `/exams` | Add an exam | `{ "course_name": "string", "exam_date": "YYYY-MM-DD", "exam_type": "midterm|final|quiz" }` | Created exam object |
| PUT | `/exams/:id` | Update exam | Any of above fields | Updated exam |
| DELETE | `/exams/:id` | Delete exam | – | `{ "message": "Deleted" }` |
| GET | `/academics` | Get academic records | Query: `?semester=Fall%202025` | `[{ "id": "uuid", "semester": "string", "course_name": "string", "credits": 3, "marks_obtained": 85.5, "total_marks": 100, "grade_letter": "A" }]` |
| POST | `/academics` | Add marks/grade | `{ "semester": "string", "course_name": "string", "credits": 3, "marks_obtained": 85.5, "total_marks": 100, "grade_letter": "A" }` | Created record |
| PUT | `/academics/:id` | Update marks | Any of above fields | Updated record |
| GET | `/academics/gpa` | Compute CGPA | – | `{ "cgpa": 3.65, "semesters": [{"semester": "Fall 2025", "gpa": 3.8}] }` |

---

## 7. AI Assistant (RAG)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/ai/chat` | Ask AI a context‑aware question | `{ "question": "string" }` | `{ "answer": "string", "sources": ["resource_title_1", ...] }` |
| GET | `/ai/conversations` | Get chat history | Query: `?limit=20` | `[{ "id": "uuid", "question": "string", "answer": "string", "created_at": "timestamp" }]` |
| POST | `/ai/refresh-embeddings` | Re‑index all user resources for RAG (async) | – | `{ "message": "Indexing started" }` |

---

## Error Responses (common)

All endpoints may return:

```json
{
  "error": "Error description",
  "statusCode": 400|401|403|404|500
}