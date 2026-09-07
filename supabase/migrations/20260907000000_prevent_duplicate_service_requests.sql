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

  if exists (
    select 1
    from public.service_requests
    where request_type = p_request_type
      and fields = p_fields
      and created_at > now() - interval '15 minutes'
  ) then
    raise exception 'duplicate request';
  end if;

  insert into private.request_rate_limits (client_fingerprint)
  values (p_client_fingerprint);

  insert into public.service_requests (request_type, fields)
  values (p_request_type, p_fields)
  returning id into request_id;

  return request_id;
end;
$$;