drop table if exists public.users;
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    working_task bigint default -1,
    working_start timestamptz default '2000-01-01 00:00:00+00' not null,
    day_running boolean default false not null,
    day_start timestamptz default '2000-01-01 00:00:00+00' not null
);

alter table public.users enable row level security;

create policy "Users can view their own profiles."
on public.users for select
using ((select auth.uid()) = id);

create policy "Users can update their own profiles."
on public.users for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger 
security definer set search_path = public
as $$
begin 
    insert into public.users (id) values (new.id);
    insert into public.tasks (user_id, name, color) values
    (new.id, 'Idling', '#008FFF');
    return new;
end;
$$ language plpgsql;

create trigger on_user_creation
after insert on auth.users
for each row execute function public.handle_new_user();


    