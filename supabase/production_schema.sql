-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Metadata Table (Global Settings)
CREATE TABLE IF NOT EXISTS site_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown/MDX content
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table (Portfolio)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Detailed case study
    cover_image TEXT,
    technologies TEXT[] DEFAULT '{}',
    demo_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Passkey Credentials (for WebAuthn)
-- Note: Reusing/Refining existing structure if present, ensuring it matches requirements
CREATE TABLE IF NOT EXISTS passkey_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Links to auth.users if strictly enforced, or kept flexible for this custom impl
    credential_id TEXT UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    counter BIGINT DEFAULT 0,
    transports TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE passkey_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read Access (Hybrid-Static Architecture)
-- Anyone can read published content
CREATE POLICY "Public Read Posts" ON posts
    FOR SELECT USING (published = true);

CREATE POLICY "Public Read Projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Public Read Metadata" ON site_metadata
    FOR SELECT USING (true);

-- Policy: Admin Write Access
-- Only authenticated admin user can insert/update/delete
-- Assuming 'admin_user_id' is a known UUID or we check auth.uid() against a whitelist
-- For this setup, we will use a strict checks relying on Supabase Auth

-- Helper function to check if user is admin (you can replace the UUID with your actual Admin UUID)
-- OR simply check if the user is authenticated if you are the only user.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Replace with your specific User ID or simply return true for any authenticated user if single-tenant
    RETURN auth.role() = 'authenticated'; 
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Site Metadata Admin Policies
CREATE POLICY "Admin All Metadata" ON site_metadata
    FOR ALL USING (is_admin());

-- Posts Admin Policies
-- Admin can see all posts (including drafts)
CREATE POLICY "Admin Read All Posts" ON posts
    FOR SELECT USING (is_admin());

CREATE POLICY "Admin Write Posts" ON posts
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin Update Posts" ON posts
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admin Delete Posts" ON posts
    FOR DELETE USING (is_admin());

-- Projects Admin Policies
CREATE POLICY "Admin Write Projects" ON projects
    FOR ALL USING (is_admin());

-- Passkey Admin Policies
-- Only admin can manage passkeys
CREATE POLICY "Admin Manage Passkeys" ON passkey_credentials
    FOR ALL USING (is_admin());

-- 6. Indexes for Performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- 7. Realtime (Optional - Enable if using Supabase Realtime)
-- alter publication supabase_realtime add table posts;
-- alter publication supabase_realtime add table projects;
