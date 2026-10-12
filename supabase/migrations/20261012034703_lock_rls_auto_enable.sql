-- Supabase creates public.rls_auto_enable() when "Enable automatic RLS" is on.
-- It is an event trigger function and nobody needs to call it over the API,
-- so remove the default EXECUTE grant. The event trigger keeps working.
-- The check lets this migration run on projects where the option is off.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
