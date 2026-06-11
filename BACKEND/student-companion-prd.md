# Product Requirements Document
## AI-Powered Student Companion Platform

**Version:** 1.0  
**Status:** Draft  
**Stack:** Node.js · PostgreSQL · pgvector · Redis · BullMQ

---

## 1. Executive Summary

The AI-Powered Student Companion Platform is a centralized academic productivity ecosystem that replaces the fragmented collection of tools most college students rely on. It consolidates resource management, task tracking, collaboration, attendance, academic performance, and a context-aware RAG-based AI tutor into a single cohesive product.

---

## 2. Problem Statement

College students manage academic responsibilities across an average of 6–9 disconnected tools — cloud drives, note apps, group chats, LMS platforms, spreadsheets, and calendar apps. This fragmentation creates three compounding problems:

**Resource scatter:** Study materials live in different places, making retrieval slow and causing students to miss or duplicate content.

**Accountability gaps:** Task management and attendance tracking are either manual, inconsistent, or nonexistent, leading to missed deadlines and attendance violations that affect grades.

**Generic AI assistance:** Existing AI tools (ChatGPT, Copilot) have no awareness of a student's syllabus, schedule, past performance, or uploaded resources — making their guidance generic and often irrelevant.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Reduce tool-switching | Avg tools used per academic task | ≤ 2 (from ~6) |
| Improve task completion | Weekly task completion rate | ≥ 75% |
| Increase attendance accuracy | Manual attendance error rate | < 2% |
| Improve AI relevance | RAG answer relevance score (user rating) | ≥ 4.2 / 5 |
| Drive daily engagement | DAU/MAU ratio | ≥ 0.45 |
| Reduce deadline misses | Missed deadline rate | < 10% |

---

## 4. User Personas

### Primary: The Overwhelmed Undergraduate
**Name:** Arjun, 20, Computer Science sophomore  
**Pain:** Juggles 6 subjects, 3 group projects, internship prep. Uses WhatsApp, Google Drive, Notion, a physical planner, and a spreadsheet for attendance.  
**Goal:** One place to manage everything; AI that actually knows his syllabus.

### Secondary: The Project-Focused Graduate Student
**Name:** Priya, 24, M.Tech Data Science  
**Pain:** Heavy project-based coursework, needs deep collaboration on shared notes and code, and detailed performance tracking for funding reviews.  
**Goal:** Workspace-driven collaboration; GPA and performance analytics.

### Tertiary: The Part-Time Student
**Name:** Rahul, 27, evening MBA  
**Pain:** Limited time, irregular schedule. Needs quick attendance logging and AI summaries of missed lecture content.  
**Goal:** Efficiency; fast AI catch-up on what was covered.

---

## 5. Feature Specifications

### 5.1 Smart Resource Vault

**Purpose:** Centralized, categorized storage for all academic materials.

**Functional Requirements:**
- Upload PDFs, images, and plain text documents (max 50MB per file, 5GB per user)
- Store links: Google Drive, GitHub repos, YouTube videos, web URLs
- Organize resources into hierarchical categories (Course → Topic → Sub-topic)
- Tag resources with custom labels
- Full-text search across file content (via pgvector embeddings) and metadata
- Resource preview (PDF inline, link thumbnail)
- Bulk import from Google Drive (OAuth)
- Soft-delete with 30-day recovery window

**Non-Functional Requirements:**
- File indexing for RAG must complete within 60 seconds of upload
- Search query response time < 300ms

**Out of Scope (v1):** Real-time collaborative editing of documents.

---

### 5.2 Collaborative Study & Project Workspaces

**Purpose:** Shared environments for group study and project collaboration.

**Functional Requirements:**
- Create workspaces (personal or team, up to 20 members)
- Rich-text note editor with markdown support
- Task boards within workspaces (Kanban-style: To Do → In Progress → Done)
- Attach resources from the Smart Resource Vault to workspace items
- Member roles: Owner, Editor, Viewer
- Real-time presence indicator (who's currently viewing)
- Workspace-level activity feed (last 50 events)
- Workspace knowledge base: AI can answer questions scoped to workspace resources
- Invite via email or shareable link (expiring after 7 days)

**Non-Functional Requirements:**
- Note autosave every 10 seconds
- Concurrent editing by up to 5 users (optimistic locking, last-write-wins on conflict)

---

### 5.3 Personal Productivity & Task Analytics

**Purpose:** Individual task management with performance visibility.

**Functional Requirements:**
- Create tasks with: title, description, due date, priority (P1–P4), course tag, estimated duration
- Subtask support (one level deep)
- Recurring tasks (daily, weekly, custom)
- Mark complete, in-progress, or blocked
- Overdue detection and notification (24h before, at deadline, 1h after)
- Weekly consistency report: tasks created vs. completed, streaks, overdue rate
- Productivity heatmap (GitHub-style, last 52 weeks)
- Completion velocity chart (rolling 30-day)
- Export analytics as PDF

**Non-Functional Requirements:**
- Dashboard load time < 500ms
- Analytics computed asynchronously via BullMQ job queue

---

### 5.4 Attendance & Timetable Management

**Purpose:** Accurate attendance tracking with actionable insights.

**Functional Requirements:**
- Timetable builder: add subjects with day/time/room/faculty
- Import timetable from CSV template or manual entry
- Mark attendance: Present / Absent / Late / Cancelled
- Retroactive attendance editing (with audit log)
- Per-subject attendance percentage with color-coded status (≥75% green, 65–74% yellow, <65% red)
- "Bunk budget" calculator: how many more classes can be missed per subject while staying above threshold
- Attendance alerts: push notification when a subject drops below 75%
- Holiday/semester break configuration (excludes these from calculations)
- Monthly attendance calendar view

**Non-Functional Requirements:**
- Attendance percentage recalculated in real time on each mark action
- Timetable supports up to 10 subjects and 6 periods/day

---

### 5.5 Academic Performance & Examination Tracker

**Purpose:** Centralized academic record management.

**Functional Requirements:**
- Exam schedule: add exams with subject, date, time, duration, exam type (mid-sem, end-sem, quiz, viva)
- Syllabus tracker per subject: list topics, mark as covered/not covered, attach resources
- Marks entry: component-wise (assignments, mid-sem, end-sem, projects) with weightage
- Auto-computed subject grade and GPA/CGPA (standard 10-point scale, configurable)
- Historical performance: semester-over-semester GPA trend chart
- Target GPA calculator: "What marks do I need in remaining exams to hit 8.5 CGPA?"
- Exam countdown widget
- PDF report card export

**Non-Functional Requirements:**
- GPA recalculated on every marks entry (< 100ms)
- Support for standard grading schemes (10-point, 4-point, percentage) — configurable per institution

---

### 5.6 Personalized AI Academic Assistant

**Purpose:** Context-aware AI tutor that knows the student's own data.

**Architecture:** Retrieval-Augmented Generation (RAG) over the student's uploaded resources + structured data from other modules.

**Functional Requirements:**

_Retrieval Sources (in priority order):_
1. Workspace and vault resources (PDF chunks, notes, links)
2. Syllabus topics for the asked subject
3. Attendance and schedule context
4. Performance and marks data
5. Task and deadline context

_AI Capabilities:_
- Answer questions about uploaded study materials with source citations
- Summarize a PDF or a set of resources on a topic
- Generate quiz questions from a selected resource or topic
- Explain syllabus topics with examples
- Check upcoming exams and deadlines: "What do I have this week?"
- Attendance queries: "Can I miss DSA on Friday?"
- Performance queries: "What's my current CGPA? How much do I need in the finals?"
- Suggest a study schedule based on upcoming exams and current syllabus coverage
- Workspace-scoped Q&A (team members can query shared workspace resources)

_Technical:_
- Embedding model: text-embedding-3-small (OpenAI) or equivalent
- Vector store: pgvector on PostgreSQL
- Chunk size: 512 tokens with 64-token overlap
- Retrieval: top-8 semantic chunks + BM25 hybrid reranking
- LLM: Claude claude-sonnet-4-20250514 (via Anthropic API)
- Conversation history: last 10 turns stored in Redis, persisted to DB after session
- Response streaming via SSE (Server-Sent Events)

**Non-Functional Requirements:**
- First token latency < 1.5s
- Context window managed to stay under 100K tokens per request
- All AI responses include source citations when retrieved from documents

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js + Fastify adapter for streaming |
| Database | PostgreSQL 16 |
| Vector extension | pgvector |
| Cache / Session | Redis 7 |
| Job Queue | BullMQ (backed by Redis) |
| Auth | JWT (access 15min) + refresh tokens (30 days), stored httpOnly |
| File Storage | AWS S3 (or compatible) |
| Email | Resend |
| AI | Anthropic Claude API + OpenAI Embeddings API |
| Real-time | Socket.IO (workspace presence, notifications) |
| Migrations | node-postgres + db-migrate |

### 6.2 Service Structure (Modular Monolith → Microservices-ready)

```
src/
├── modules/
│   ├── auth/
│   ├── resources/
│   ├── workspaces/
│   ├── tasks/
│   ├── attendance/
│   ├── academics/
│   └── ai/
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── queues/
└── app.js
```

Each module owns its routes, controllers, services, and repository layer. The AI module is the only cross-cutting consumer — it reads from all other modules via internal service interfaces (not direct DB joins across module boundaries).

---

## 7. Security Requirements

- All endpoints require authentication except `/auth/register`, `/auth/login`, `/auth/refresh`
- Row-level data isolation: every query scoped to `user_id` or `workspace_id` with verified membership
- File uploads: virus-scanned via ClamAV before indexing; MIME type validation; filename sanitization
- AI queries: user context injected server-side only — client never sends user data directly to LLM
- Rate limiting: 100 req/min general, 20 req/min on AI endpoints
- Secrets in environment variables only (never committed); rotate every 90 days
- HTTPS enforced; HSTS enabled
- GDPR: data export endpoint, account deletion with cascade

---

## 8. Non-Functional Requirements (System-Wide)

| Requirement | Target |
|-------------|--------|
| API response time (p95) | < 300ms |
| AI first-token latency | < 1.5s |
| Uptime | 99.5% monthly |
| File indexing throughput | 50 files/min |
| Concurrent users (initial) | 1,000 |
| Database backup | Daily automated, 30-day retention |

---

## 9. Release Phases

### Phase 1 — Core Foundation (Weeks 1–8)
Auth, Resource Vault (upload + search), Task Management, basic UI.

### Phase 2 — Academic Modules (Weeks 9–16)
Attendance & Timetable, Exam Tracker, Syllabus Tracker, GPA calculations.

### Phase 3 — Collaboration (Weeks 17–22)
Workspaces, real-time presence, team task boards, shared resources.

### Phase 4 — AI Assistant (Weeks 23–30)
RAG pipeline, document ingestion, chat interface, performance queries, study schedule generation.

### Phase 5 — Analytics & Polish (Weeks 31–36)
Productivity analytics, performance trend charts, mobile PWA, export features.

---

## 10. Open Questions

1. Will the platform support multiple institutions with different grading schemes, or is it student-configured?
2. Should AI conversation history be shared within a workspace, or always private?
3. Is Google Calendar sync in scope for v1 timetable import?
4. What is the file retention policy for graduated/inactive users?
5. Should attendance thresholds be configurable per subject (some institutions require 85%)?

---

*Document owner: Platform Engineering  
Last updated: June 2026*
