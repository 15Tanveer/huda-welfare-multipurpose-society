-- newsletter_subscribers previously only had an admin *read* policy
-- (0002_rls.sql) alongside the public insert policy — there was no way
-- for an admin to remove a subscriber (e.g. honoring an unsubscribe
-- request, or cleaning up a duplicate/typo'd email) without going
-- around RLS entirely. Adds the missing admin delete policy, matching
-- the read-write-for-authenticated pattern used everywhere else.

create policy "newsletter_subscribers_admin_delete"
  on public.newsletter_subscribers for delete
  to authenticated
  using (true);
