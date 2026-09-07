create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('estimate', 'appointment')),
  fields jsonb not null,
  created_at timestamptz not null default now()
);

create schema if not exists private;

create table private.request_rate_limits (
  id bigint generated always as identity primary key,
  client_fingerprint text not null,
  created_at timestamptz not null default now()
);

alter table public.service_requests enable row level security;
alter table private.request_rate_limits enable row level security;

create or replace function public.submit_service_request(
  p_request_type text,
  p_fields jsonb,
  p_client_fingerprint text
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  request_id uuid;
begin
  if (
    select count(*)
    from private.request_rate_limits
    where client_fingerprint = p_client_fingerprint
      and created_at > now() - interval '15 minutes'
  ) >= 5 then
    raise exception 'rate limit exceeded';
  end if;

  insert into private.request_rate_limits (client_fingerprint)
  values (p_client_fingerprint);

  insert into public.service_requests (request_type, fields)
  values (p_request_type, p_fields)
  returning id into request_id;

  return request_id;
end;
$$;

revoke all on table public.service_requests from anon, authenticated;
revoke all on table private.request_rate_limits from anon, authenticated;
revoke all on function public.submit_service_request(text, jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_service_request(text, jsonb, text) to service_role;