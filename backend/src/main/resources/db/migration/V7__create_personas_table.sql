CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    interview_style VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    estimated_duration_minutes INTEGER DEFAULT 30,
    system_prompt TEXT NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
