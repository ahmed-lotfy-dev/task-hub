-- Add soft delete support to activities table
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;

-- Create index for faster queries on deleted_at
CREATE INDEX IF NOT EXISTS "activities_deleted_at_idx" ON "activities" ("deleted_at");
