-- Inspected against the existing Olo Notes project before applying.
-- Private, immutable picture objects. No journal rows or existing policies change.
begin;

do $$
begin
  if exists (select 1 from storage.buckets where id = 'olo-avatars') then
    raise exception 'olo-avatars already exists; inspect its configuration before applying';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'storage.objects'::regclass) then
    raise exception 'Storage RLS must be enabled before applying';
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('olo-avatars', 'olo-avatars', false, 5242880, array['image/webp']);

create policy "Olo pictures: upload own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'olo-avatars'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and storage.extension(name) = 'webp'
);

create policy "Olo pictures: read own"
on storage.objects for select to authenticated
using (
  bucket_id = 'olo-avatars'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Used only to roll back a newly uploaded object when local persistence fails.
-- Removing/replacing a profile picture keeps historical objects intact.
create policy "Olo pictures: delete own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'olo-avatars'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

commit;
