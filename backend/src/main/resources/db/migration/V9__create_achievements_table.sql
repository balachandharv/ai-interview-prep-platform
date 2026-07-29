CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    badge_description VARCHAR(255),
    badge_icon VARCHAR(100),
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_name)
);
