CREATE TABLE peer_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(id),
    user2_id UUID NOT NULL REFERENCES users(id),
    user1_role VARCHAR(20) DEFAULT 'INTERVIEWER',
    user2_role VARCHAR(20) DEFAULT 'INTERVIEWEE',
    conversation_history JSONB DEFAULT '[]',
    feedback_user1 JSONB,
    feedback_user2 JSONB,
    overall_score_user1 DECIMAL(5,2),
    overall_score_user2 DECIMAL(5,2),
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
