-- Row Level Security policies (0002_rls.sql) control which *rows* a role
-- can touch, but Postgres also requires baseline table-level GRANTs before
-- RLS is even evaluated. Supabase's Dashboard/table editor sets these up
-- automatically when you create a table through it; the previous
-- migrations created every table via plain `create table` and never
-- granted anon/authenticated the underlying privileges, so every
-- operation was blocked at the GRANT level before RLS policies ran at
-- all (Postgres error 42501 "permission denied for table ...").
--
-- This mirrors the grants Supabase sets up by default for a project, and
-- makes them explicit going forward: both for the existing tables now,
-- and for any table a future migration creates, via ALTER DEFAULT
-- PRIVILEGES. RLS policies remain the real access-control layer — these
-- grants are deliberately broad (full CRUD to anon and authenticated)
-- because a role with no matching RLS policy for an operation still gets
-- 0 rows (read) or a row-security violation (write), never unintended
-- access.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on all tables in schema public
  to anon, authenticated;

grant usage, select on all sequences in schema public
  to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;

alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
