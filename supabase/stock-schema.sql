create table if not exists public.user_roles (
    user_id uuid primary key references auth.users (id) on delete cascade,
    role text not null check (role = 'admin'),
    created_at timestamptz not null default now()
);

create unique index if not exists user_roles_user_id_uidx
    on public.user_roles (user_id);

alter table public.user_roles enable row level security;
revoke all on table public.user_roles from public, anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.user_roles as roles
        where roles.user_id = (select auth.uid())
          and roles.role = 'admin'
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.product_stock (
    product_id integer not null,
    size text not null check (size in (
        'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36',
        '38', '39', '40', '41', '42', '43', '44', 'onesize'
    )),
    stock integer not null default 0 check (stock >= 0),
    updated_at timestamptz not null default now(),
    primary key (product_id, size)
);

create unique index if not exists product_stock_product_size_uidx
    on public.product_stock (product_id, size);

alter table public.product_stock
    add column if not exists updated_at timestamptz not null default now();

do $$
begin
    delete from public.product_stock as seeded
    using public.product_stock as legacy
    where seeded.product_id = legacy.product_id
      and seeded.size in ('S', 'M', 'L', 'XL')
      and legacy.size in ('s', 'm', 'l', 'xl')
      and seeded.size = upper(legacy.size);

    update public.product_stock
    set size = upper(size)
    where size in ('s', 'm', 'l', 'xl');
end;
$$;

alter table public.product_stock
    drop constraint if exists product_stock_product_id_fkey;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conrelid = 'public.product_stock'::regclass
          and conname = 'product_stock_product_id_range_check'
    ) then
        alter table public.product_stock
            add constraint product_stock_product_id_range_check
            check (product_id between 1 and 24) not valid;
    end if;
end;
$$;

alter table public.product_stock
    validate constraint product_stock_product_id_range_check;

alter table public.product_stock enable row level security;
revoke all on table public.product_stock from public, anon, authenticated;
grant select on table public.product_stock to anon, authenticated;
grant update (stock, updated_at) on table public.product_stock to authenticated;

drop policy if exists "Stock is readable by shoppers" on public.product_stock;
create policy "Stock is readable by shoppers"
    on public.product_stock
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Only admins can update stock" on public.product_stock;
create policy "Only admins can update stock"
    on public.product_stock
    for update
    to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create or replace function public.restock_product(
    p_product_id integer,
    p_size text,
    p_quantity integer
)
returns integer
language plpgsql
set search_path = ''
as $$
declare
    updated_stock integer;
begin
    if p_quantity is null or p_quantity < 1 or p_quantity > 10000 then
        raise exception 'Invalid restock quantity';
    end if;

    update public.product_stock
    set stock = stock + p_quantity,
        updated_at = now()
    where product_id = p_product_id
      and size = p_size
    returning stock into updated_stock;

    if not found then
        raise exception 'Product size not found';
    end if;

    return updated_stock;
end;
$$;

revoke all on function public.restock_product(integer, text, integer) from public;
grant execute on function public.restock_product(integer, text, integer) to authenticated;

insert into public.product_stock (product_id, size, stock) values
    (1, 'S', 6), (1, 'M', 8), (1, 'L', 8), (1, 'XL', 0),
    (2, 'S', 5), (2, 'M', 7), (2, 'L', 7), (2, 'XL', 3),
    (3, 'S', 4), (3, 'M', 6), (3, 'L', 6), (3, 'XL', 2),
    (4, 'S', 4), (4, 'M', 5), (4, 'L', 3), (4, 'XL', 2),
    (5, 'S', 2), (5, 'M', 4), (5, 'L', 4), (5, 'XL', 2),
    (6, 'S', 5), (6, 'M', 5), (6, 'L', 4), (6, 'XL', 2),
    (7, 'S', 6), (7, 'M', 6), (7, 'L', 5), (7, 'XL', 3),
    (8, '28', 4), (8, '30', 5), (8, '32', 5), (8, '34', 4), (8, '36', 2),
    (9, '28', 5), (9, '30', 6), (9, '32', 7), (9, '34', 5), (9, '36', 3),
    (10, '28', 3), (10, '30', 4), (10, '32', 4), (10, '34', 2), (10, '36', 0),
    (11, 'onesize', 9), (12, 'onesize', 6), (13, 'onesize', 5), (14, 'onesize', 2),
    (15, 'S', 8), (15, 'M', 10), (15, 'L', 9), (15, 'XL', 4),
    (16, 'S', 3), (16, 'M', 5), (16, 'L', 4), (16, 'XL', 2),
    (17, 'S', 6), (17, 'M', 7), (17, 'L', 5), (17, 'XL', 3),
    (18, '28', 4), (18, '30', 6), (18, '32', 6), (18, '34', 4), (18, '36', 2),
    (19, '28', 3), (19, '30', 5), (19, '32', 5), (19, '34', 3), (19, '36', 0),
    (20, '38', 2), (20, '39', 4), (20, '40', 5), (20, '41', 4), (20, '42', 3), (20, '43', 2), (20, '44', 0),
    (21, '38', 3), (21, '39', 4), (21, '40', 4), (21, '41', 3), (21, '42', 2), (21, '43', 1), (21, '44', 1),
    (22, '38', 0), (22, '39', 2), (22, '40', 3), (22, '41', 3), (22, '42', 2), (22, '43', 2), (22, '44', 1),
    (23, '38', 2), (23, '39', 3), (23, '40', 4), (23, '41', 4), (23, '42', 3), (23, '43', 2), (23, '44', 1),
    (24, '38', 3), (24, '39', 5), (24, '40', 5), (24, '41', 4), (24, '42', 3), (24, '43', 2), (24, '44', 0)
on conflict (product_id, size) do nothing;
