-- =============================================
-- 포트폴리오 DB 스키마
-- Supabase Dashboard > SQL Editor에 붙여넣고 실행
-- =============================================

-- 1. 프로필 (1개 row만 사용)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  location text not null default '',
  cover_image text,
  profile_image text,
  company_name text,
  company_logo_url text,
  university_name text,
  university_logo_url text
);

-- 2. 프로젝트
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  tags text[] not null default '{}',
  period text not null default '',
  institution text,
  created_at timestamptz not null default now()
);

-- 3. 프로젝트 이미지 (캐러셀용)
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  "order" integer not null default 0
);

-- 4. 프로젝트 상세 섹션
create table if not exists project_details (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  subtitle text not null,
  content text not null,
  "order" integer not null default 0
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table profile enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_details enable row level security;

-- 누구나 읽기 가능
create policy "Public read profile" on profile for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read project_images" on project_images for select using (true);
create policy "Public read project_details" on project_details for select using (true);

-- 로그인한 사용자만 쓰기 가능 (관리자)
create policy "Admin insert profile" on profile for insert with check (auth.role() = 'authenticated');
create policy "Admin update profile" on profile for update using (auth.role() = 'authenticated');

create policy "Admin insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "Admin update projects" on projects for update using (auth.role() = 'authenticated');
create policy "Admin delete projects" on projects for delete using (auth.role() = 'authenticated');

create policy "Admin insert project_images" on project_images for insert with check (auth.role() = 'authenticated');
create policy "Admin update project_images" on project_images for update using (auth.role() = 'authenticated');
create policy "Admin delete project_images" on project_images for delete using (auth.role() = 'authenticated');

create policy "Admin insert project_details" on project_details for insert with check (auth.role() = 'authenticated');
create policy "Admin update project_details" on project_details for update using (auth.role() = 'authenticated');
create policy "Admin delete project_details" on project_details for delete using (auth.role() = 'authenticated');

-- =============================================
-- 초기 데이터 (프로필)
-- =============================================

insert into profile (name, role, location, company_name, university_name)
values (
  '김민수 (Minsoo Kim)',
  'Senior Product Designer | UX/UI Expert at Tech Corp',
  '서울, 대한민국',
  'Tech Corp',
  '한국대학교 (Korea University)'
)
on conflict do nothing;
