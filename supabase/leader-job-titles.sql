-- Display titles are separate from authorization roles and promotion permissions.
ALTER TABLE public.training_app_leaders ADD COLUMN IF NOT EXISTS job_title text NOT NULL DEFAULT 'Leader';
-- Set the approved personal roster titles privately in the dashboard.
