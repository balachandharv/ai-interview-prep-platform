CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    interview_overview TEXT,
    difficulty VARCHAR(20),
    average_rounds INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE company_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    round_type VARCHAR(50) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 45,
    tips TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
