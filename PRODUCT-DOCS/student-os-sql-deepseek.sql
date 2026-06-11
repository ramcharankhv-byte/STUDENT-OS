-- Enable pgvector extension for RAG embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Users & Auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Resource Vault
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('google_drive', 'pdf', 'video', 'github', 'other')),
    url TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Collaborative Workspace
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE workspace_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    title TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (personal or workspace)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- owner
    workspace_id UUID REFERENCES workspaces(id), -- null if personal
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
    due_date DATE,
    recurrence TEXT, -- e.g., 'weekly', 'none'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance & Timetable
CREATE TABLE class_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_name TEXT,
    day_of_week INT, -- 0=Monday..6=Sunday
    start_time TIME,
    end_time TIME,
    location TEXT
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_schedule(id),
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('present','absent','cancelled')),
    UNIQUE(user_id, class_id, date)
);

-- Academic Performance
CREATE TABLE exam_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_name TEXT,
    exam_date DATE,
    exam_type TEXT -- 'midterm', 'final', 'quiz'
);

CREATE TABLE academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    semester TEXT, -- e.g., 'Fall 2025'
    course_name TEXT,
    credits INT,
    marks_obtained DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    grade_letter CHAR(2)
);

-- AI Assistant Conversation Log
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- RAG: chunked resources with embeddings
CREATE TABLE resource_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    chunk_text TEXT,
    embedding vector(1536) -- dimension depends on embedding model (e.g., OpenAI ada-002)
);