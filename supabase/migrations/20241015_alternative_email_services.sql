-- Migration: Alternative Email Services Implementation
-- Date: 2024-10-15
-- Description: Schema for managing email templates, queue, logs, and providers independently of Supabase Auth emails.

BEGIN;

-- 1. Create Enums for Status Tracking
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('pending', 'processing', 'sent', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE email_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Email Templates Table with Versioning
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT,
    text_content TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    CONSTRAINT unique_template_slug_version UNIQUE (slug, version)
);

-- Index for searching templates
CREATE INDEX IF NOT EXISTS idx_email_templates_slug ON email_templates(slug);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Comments
COMMENT ON TABLE email_templates IS 'Stores email templates with version control.';
COMMENT ON COLUMN email_templates.slug IS 'Unique identifier for the template type (e.g., "welcome_email").';

-- 3. Email Queue Table for Scheduling and Retries
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES email_templates(id),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    variable_data JSONB DEFAULT '{}'::jsonb, -- Dynamic data for template injection
    status email_status DEFAULT 'pending',
    priority email_priority DEFAULT 'normal',
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempted_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Queue Processing
CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled ON email_queue(status, scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_recipient ON email_queue(recipient_email);

-- Comments
COMMENT ON TABLE email_queue IS 'Queue for outgoing emails, handling scheduling and retries.';

-- 4. Email Logs Table for Delivery Tracking
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES email_queue(id) ON DELETE SET NULL,
    provider_id TEXT, -- e.g., 'sendgrid', 'ses'
    provider_message_id TEXT,
    status TEXT NOT NULL, -- flexible status from provider (delivered, bounced, etc.)
    metadata JSONB, -- store full provider response
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Logs
CREATE INDEX IF NOT EXISTS idx_email_logs_queue_id ON email_logs(queue_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- 5. Updated_at Trigger Function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply Triggers
DROP TRIGGER IF EXISTS update_email_templates_modtime ON email_templates;
CREATE TRIGGER update_email_templates_modtime
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_queue_modtime ON email_queue;
CREATE TRIGGER update_email_queue_modtime
    BEFORE UPDATE ON email_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS) - Basic Setup
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Example: Only admins can manage templates, system/service role handles queue)
-- Note: Adjust policies based on specific application roles

-- ROLLBACK STATEMENT (Commented out for safety, meant to be run manually if needed)
/*
BEGIN;
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS email_queue;
DROP TABLE IF EXISTS email_templates;
DROP TYPE IF EXISTS email_priority;
DROP TYPE IF EXISTS email_status;
COMMIT;
*/

COMMIT;
