-- Supabase Database Schema
-- Run this in the Supabase SQL Editor to create the required tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  slug text not null unique,
  description text,
  color text default '#8b5cf6'
);

-- Tags table
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  slug text not null unique
);

-- Posts table
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  category_id uuid references public.categories(id) on delete set null,
  author_id text not null,
  published boolean default false,
  published_at timestamp with time zone,
  read_time integer default 0,
  views integer default 0
);

-- Post tags junction table
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  description text not null,
  image text,
  tech_stack text[] default '{}',
  problem text,
  solution text,
  reflection text,
  github_url text,
  live_url text,
  featured boolean default false,
  "order" integer default 0
);

-- Passkeys table for WebAuthn
create table public.passkeys (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text not null,
  credential_id text not null unique,
  public_key text not null,
  counter integer default 0,
  device_type text,
  backed_up boolean default false,
  transports text[]
);

-- Indexes for performance
create index idx_posts_slug on public.posts(slug);
create index idx_posts_published on public.posts(published, published_at);
create index idx_posts_category on public.posts(category_id);
create index idx_projects_slug on public.projects(slug);
create index idx_projects_featured on public.projects(featured, "order");
create index idx_passkeys_user on public.passkeys(user_id);
create index idx_passkeys_credential on public.passkeys(credential_id);

-- Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.projects enable row level security;
alter table public.passkeys enable row level security;

-- Public read access for published content
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read tags" on public.tags for select using (true);
create policy "Public can read published posts" on public.posts for select using (published = true);
create policy "Public can read post_tags" on public.post_tags for select using (true);
create policy "Public can read projects" on public.projects for select using (true);

-- Service role has full access (for admin operations)
create policy "Service role full access categories" on public.categories for all using (auth.role() = 'service_role');
create policy "Service role full access tags" on public.tags for all using (auth.role() = 'service_role');
create policy "Service role full access posts" on public.posts for all using (auth.role() = 'service_role');
create policy "Service role full access post_tags" on public.post_tags for all using (auth.role() = 'service_role');
create policy "Service role full access projects" on public.projects for all using (auth.role() = 'service_role');
create policy "Service role full access passkeys" on public.passkeys for all using (auth.role() = 'service_role');

-- Trigger to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Sample data
insert into public.categories (name, slug, description, color) values
  ('Development', 'development', 'Technical articles about software development', '#8b5cf6'),
  ('Design', 'design', 'UI/UX design and visual aesthetics', '#ec4899'),
  ('Security', 'security', 'Web security and authentication', '#10b981'),
  ('Career', 'career', 'Professional growth and industry insights', '#f59e0b');

insert into public.tags (name, slug) values
  ('Next.js', 'nextjs'),
  ('TypeScript', 'typescript'),
  ('React', 'react'),
  ('WebGPU', 'webgpu'),
  ('WebAuthn', 'webauthn'),
  ('CSS', 'css'),
  ('Animation', 'animation'),
  ('Design Systems', 'design-systems');
