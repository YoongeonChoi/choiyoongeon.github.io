-- ═══════════════════════════════════════════════════════════════
-- Nexus-PR: Add Projects Table
-- Migration: 002_add_projects_table.sql
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  role TEXT NOT NULL,
  timeline TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 999,
  stack TEXT[] DEFAULT '{}',
  impact TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '{}',
  content_mdx TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Auto-update updated_at
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read projects
CREATE POLICY "projects_select_public"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (admin) can insert
CREATE POLICY "projects_insert_admin"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

-- Only authenticated users (admin) can update
CREATE POLICY "projects_update_admin"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

-- Only authenticated users (admin) can delete
CREATE POLICY "projects_delete_admin"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles));
