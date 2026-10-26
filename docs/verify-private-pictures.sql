-- Run after uploading a sample through the app. Tests database RLS with
-- simulated authenticated/anonymous request contexts, not signed Auth tokens.
-- The rejected cross-owner insert and all settings are rolled back.
begin;
select set_config('request.jwt.claims', jsonb_build_object(
  'sub', (select owner_id from storage.objects where bucket_id='olo-avatars' order by created_at limit 1),
  'role', 'authenticated'
)::text, true);
set local role authenticated;
do $test$
begin
  if not exists(select 1 from storage.objects where bucket_id='olo-avatars') then
    raise exception 'Owner read failed (upload a sample first)';
  end if;
end $test$;
select set_config('olo.test_owner', auth.uid()::text, true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $test$
begin
  if exists(select 1 from storage.objects where bucket_id='olo-avatars') then
    raise exception 'Cross-account read allowed';
  end if;
  begin
    insert into storage.objects(bucket_id,name,owner_id)
    values ('olo-avatars', current_setting('olo.test_owner') || '/isolation-test.webp', auth.uid()::text);
    raise exception 'Cross-account upload allowed';
  exception when insufficient_privilege then
    null;
  end;
end $test$;
set local role anon;
do $test$
begin
  if exists(select 1 from storage.objects where bucket_id='olo-avatars') then
    raise exception 'Anonymous read allowed';
  end if;
end $test$;
rollback;
select 'PASS: owner read; other-account read/upload and anonymous read blocked' as verification;
