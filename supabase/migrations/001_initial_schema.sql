-- ═══════════════════════════════════════════════════════════════
-- Nexus-PR: Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Run this in the Supabase SQL Editor or via supabase db push
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles Table ───
-- Linked to Supabase Auth users via id = auth.users.id
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT,
  avatar_url TEXT,
  github_username TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Categories Table ───
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color_hex TEXT CHECK (color_hex ~ '^#[0-9a-fA-F]{6}$'),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Blog Posts Table ───
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content_mdx TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  reading_time_minutes INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ─── Auto-update updated_at ───
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (Zero-Trust)
-- Even if the anon key is leaked, no unauthorized writes are possible.
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- ─── Profiles Policies ───
-- Anyone can read profiles
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only the profile owner can update their own profile
CREATE POLICY "profiles_update_owner"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation via auth trigger
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ─── Categories Policies ───
-- Anyone can read categories
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (admin) can manage categories
CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles));

-- ─── Blog Posts Policies ───
-- Anyone can read PUBLISHED posts
CREATE POLICY "blog_posts_select_published"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authors can see their own drafts too
CREATE POLICY "blog_posts_select_own_drafts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

-- Only the author can insert posts
CREATE POLICY "blog_posts_insert_author"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Only the author can update their own posts
CREATE POLICY "blog_posts_update_author"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Only the author can delete their own posts
CREATE POLICY "blog_posts_delete_author"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- ═══════════════════════════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP
-- When a new user signs up via Supabase Auth, auto-create a profile row.
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
