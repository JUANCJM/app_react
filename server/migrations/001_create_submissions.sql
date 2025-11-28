-- Migration: 001_create_submissions.sql
-- Creates the submissions table for storing form data

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on email for potential future lookups
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);

-- Add index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
