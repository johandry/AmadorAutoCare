alter table public.service_requests
  add column status text not null default 'new'
    check (status in ('new', 'in_progress', 'completed')),
  add column completed_at timestamptz;

alter table public.service_requests
  add constraint service_requests_completed_at_check
  check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  );

create index service_requests_completed_at_idx
  on public.service_requests (completed_at)
  where status = 'completed';

create or replace function public.purge_completed_service_requests()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.service_requests
  where status = 'completed'
    and completed_at < now() - interval '90 days';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_completed_service_requests() from public, anon, authenticated;
grant execute on function public.purge_completed_service_requests() to service_role;