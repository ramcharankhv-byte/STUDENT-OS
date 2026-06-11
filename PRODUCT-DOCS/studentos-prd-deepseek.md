# AI-Powered Student Companion Platform - Technical Design Document

## Table of Contents
1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [Workflow Diagram](#2-workflow-diagram)
3. [Database Schema & Relationships](#3-database-schema--relationships)
4. [API Routes](#4-api-routes)

---

## 1. Product Requirements Document (PRD)

### 1.1 Executive Summary
The **AI-Powered Student Companion Platform** is an all‑in‑one ecosystem that consolidates academic resources, collaboration, task management, attendance tracking, performance analytics, and an AI tutor. By unifying disconnected tools, the platform helps students save time, meet deadlines, improve attendance, and receive personalized academic guidance.

### 1.2 User Personas
- **Primary:** Undergraduate/Graduate student juggling multiple courses, projects, and extracurriculars.
- **Secondary:** Study group members collaborating on assignments or projects.

### 1.3 Core Functional Modules

| Module | Key Capabilities |
|--------|------------------|
| **Smart Resource Vault** | Store & organize Google Drive links, PDFs, videos, GitHub repos. Tag, search, preview. |
| **Collaborative Workspaces** | Shared spaces for teams: notes, tasks, file attachments, real‑time comments. |
| **Personal Productivity** | Personal tasks with deadlines, recurring options, productivity analytics (completion rate, consistency heatmaps). |
| **Attendance & Timetable** | Upload/manual schedule, mark daily attendance, record cancellations, get % alerts. |
| **Academic Performance** | Exam schedule, syllabus progress, marks entry, GPA/CGPA tracker, historical trends. |
| **AI Academic Assistant** | RAG‑based chatbot that answers course‑specific questions, summarises materials, suggests study plans using user’s timetable, attendance, grades. |

### 1.4 User Stories
- As a student, I want to link my Google Drive and upload PDFs so that I can retrieve them later from one place.
- As a student, I want to create a workspace for my capstone project, assign tasks to teammates, and share notes.
- As a student, I want to see a dashboard with my upcoming deadlines, attendance shortfall, and a quick AI summary of what I need to study today.
- As a student, I want to ask the AI “What topics in Calculus did I miss last week?” and get an answer based on my attendance and syllabus progress.

### 1.5 Non‑Functional Requirements
- **Performance:** API response < 300ms for 95% of requests.
- **Security:** JWT authentication, HTTPS, row‑level security in PostgreSQL (user isolation).
- **Scalability:** Support 10k concurrent users with Node.js clustering + read replicas.
- **AI:** RAG pipeline with vector embeddings stored in pgvector (PostgreSQL extension). Latency for AI queries < 3s.

---

## 2. Workflow Diagram

```mermaid
flowchart TD
    A[Login / Register] --> B[Dashboard]
    B --> C{Choose Module}
    
    C --> D[Resource Vault]
    D --> D1[Upload/Link Resource]
    D1 --> D2[Tag & Store]
    D2 --> D3[Search/Preview]
    
    C --> E[Collaborative Workspace]
    E --> E1[Create/Join Workspace]
    E1 --> E2[Add Notes/Tasks/Files]
    E2 --> E3[Assign Tasks to Members]
    
    C --> F[Personal Tasks]
    F --> F1[Create/Update Task]
    F1 --> F2[Set Deadline & Recurrence]
    F2 --> F3[View Analytics / Complete]
    
    C --> G[Attendance & Timetable]
    G --> G1[Setup Weekly Schedule]
    G1 --> G2[Mark Daily Attendance]
    G2 --> G3[Get % Alerts]
    
    C --> H[Exam & Performance]
    H --> H1[Enter Exam Dates]
    H1 --> H2[Log Marks / Syllabus Progress]
    H2 --> H3[View GPA Trend]
    
    C --> I[AI Assistant]
    I --> I1[Ask Question]
    I1 --> I2[RAG Retrieval from User's Data]
    I2 --> I3[Generate Context-Aware Answer]
    I3 --> I4[Suggest Next Actions]
    
    B --> J[Notifications / Reminders]