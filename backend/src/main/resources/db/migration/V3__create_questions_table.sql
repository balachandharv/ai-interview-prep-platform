CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    model_answer TEXT NOT NULL,
    key_points JSONB NOT NULL DEFAULT '[]',
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    role_tag VARCHAR(100),
    company_tag VARCHAR(100),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    times_answered INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
