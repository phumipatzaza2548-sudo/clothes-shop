create table if not exists public.store_orders (
    id uuid primary key,
    user_id uuid not null references auth.users (id) on delete restrict,
    customer_name text,
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected')),
    bank text not null check (bank in ('kbank', 'scb')),
    total_amount integer not null check (total_amount > 0),
    slip_path text unique,
    slip_expires_at timestamptz not null,
    submission_fingerprint text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.store_orders
    add column if not exists customer_name text;

update public.store_orders as orders
set customer_name = coalesce(
    nullif(btrim(users.raw_user_meta_data ->> 'fullname'), ''),
    nullif(btrim(users.raw_user_meta_data ->> 'username'), '')
)
from auth.users as users
where orders.user_id = users.id
  and orders.customer_name is null
  and coalesce(
      nullif(btrim(users.raw_user_meta_data ->> 'fullname'), ''),
      nullif(btrim(users.raw_user_meta_data ->> 'username'), '')
  ) is not null;

create index if not exists store_orders_user_created_idx
    on public.store_orders (user_id, created_at desc);
create index if not exists store_orders_status_created_idx
    on public.store_orders (status, created_at);
create index if not exists store_orders_slip_expiry_idx
    on public.store_orders (slip_expires_at)
    where slip_path is not null;

create table if not exists public.store_order_items (
    order_id uuid not null references public.store_orders (id) on delete cascade,
    product_id integer not null check (product_id between 1 and 24),
    size text not null,
    quantity integer not null check (quantity between 1 and 10000),
    unit_price integer not null check (unit_price > 0),
    primary key (order_id, product_id, size)
);

alter table public.store_orders enable row level security;
alter table public.store_order_items enable row level security;
revoke all on table public.store_orders from public, anon, authenticated;
revoke all on table public.store_order_items from public, anon, authenticated;
grant select on table public.store_orders to authenticated;
grant select on table public.store_order_items to authenticated;

drop policy if exists "Customers and admins can read permitted orders" on public.store_orders;
create policy "Customers and admins can read permitted orders"
    on public.store_orders
    for select
    to authenticated
    using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Customers and admins can read permitted order items" on public.store_order_items;
create policy "Customers and admins can read permitted order items"
    on public.store_order_items
    for select
    to authenticated
    using (
        exists (
            select 1
            from public.store_orders as orders
            where orders.id = store_order_items.order_id
              and (
                  orders.user_id = (select auth.uid())
                  or (select public.is_admin())
              )
        )
    );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'payment-slips',
    'payment-slips',
    false,
    8388608,
    array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Customers upload their own payment slips" on storage.objects;
create policy "Customers upload their own payment slips"
    on storage.objects
    for insert
    to authenticated
    with check (
        bucket_id = 'payment-slips'
        and (storage.foldername(name))[1] = (select auth.uid())::text
        and name ~ (
            '^' || (select auth.uid())::text
            || '/[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$'
        )
    );

drop policy if exists "Order owners and admins read unexpired payment slips" on storage.objects;
create policy "Order owners and admins read unexpired payment slips"
    on storage.objects
    for select
    to authenticated
    using (
        bucket_id = 'payment-slips'
        and exists (
            select 1
            from public.store_orders as orders
            where orders.slip_path = storage.objects.name
              and orders.slip_expires_at > now()
              and (
                  orders.user_id = (select auth.uid())
                  or (select public.is_admin())
              )
        )
    );

drop policy if exists "Admins can delete payment slips" on storage.objects;
create policy "Admins can delete payment slips"
    on storage.objects
    for delete
    to authenticated
    using (
        bucket_id = 'payment-slips'
        and (select public.is_admin())
    );

drop policy if exists "Customers delete unattached payment slips" on storage.objects;
create policy "Customers delete unattached payment slips"
    on storage.objects
    for delete
    to authenticated
    using (
        bucket_id = 'payment-slips'
        and (storage.foldername(name))[1] = (select auth.uid())::text
        and not exists (
            select 1
            from public.store_orders as orders
            where orders.slip_path = storage.objects.name
        )
    );

create or replace function public.submit_store_order(
    p_order_id uuid,
    p_items jsonb,
    p_slip_path text,
    p_bank text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    order_item jsonb;
    product_id integer;
    product_size text;
    item_quantity integer;
    unit_price integer;
    order_total bigint := 0;
    v_customer_name text;
    canonical_items jsonb := '[]'::jsonb;
    request_fingerprint text;
    existing_order public.store_orders%rowtype;
begin
    if (select auth.uid()) is null then
        raise exception 'Authentication required';
    end if;

    select coalesce(
        nullif(btrim(users.raw_user_meta_data ->> 'fullname'), ''),
        nullif(btrim(users.raw_user_meta_data ->> 'username'), ''),
        nullif(split_part(users.email, '@', 1), ''),
        'ลูกค้า'
    )
    into v_customer_name
    from auth.users as users
    where users.id = (select auth.uid());

    if p_order_id is null
        or p_items is null
        or p_slip_path is null
        or p_bank is null
        or jsonb_typeof(p_items) <> 'array'
        or jsonb_array_length(p_items) < 1
        or jsonb_array_length(p_items) > 50
        or p_bank not in ('kbank', 'scb')
        or p_slip_path !~ (
            '^' || (select auth.uid())::text || '/'
            || p_order_id::text || '\.(png|jpg|jpeg|webp)$'
        ) then
        raise exception 'Invalid order request';
    end if;

    if not exists (
        select 1
        from storage.objects
        where bucket_id = 'payment-slips'
          and name = p_slip_path
    ) then
        raise exception 'Payment slip not found';
    end if;

    for order_item in
        select value
        from jsonb_array_elements(p_items)
    loop
        begin
            product_id := (order_item ->> 'product_id')::integer;
            product_size := order_item ->> 'size';
            item_quantity := (order_item ->> 'quantity')::integer;
        exception
            when invalid_text_representation or numeric_value_out_of_range then
                raise exception 'Invalid order item';
        end;

        if product_size is null then
            raise exception 'Invalid product size';
        elsif product_id between 1 and 7 or product_id between 15 and 17 then
            if product_size not in ('S', 'M', 'L', 'XL') then
                raise exception 'Invalid product size';
            end if;
        elsif product_id between 8 and 10 or product_id between 18 and 19 then
            if product_size not in ('28', '30', '32', '34', '36') then
                raise exception 'Invalid product size';
            end if;
        elsif product_id between 11 and 14 then
            if product_size <> 'onesize' then
                raise exception 'Invalid product size';
            end if;
        elsif product_id between 20 and 24 then
            if product_size not in ('38', '39', '40', '41', '42', '43', '44') then
                raise exception 'Invalid product size';
            end if;
        else
            raise exception 'Invalid product';
        end if;

        if item_quantity is null or item_quantity < 1 or item_quantity > 10000 then
            raise exception 'Invalid order quantity';
        end if;

        unit_price := case product_id
            when 1 then 150
            when 2 then 150
            when 3 then 500
            when 4 then 700
            when 5 then 300
            when 6 then 200
            when 7 then 150
            when 8 then 300
            when 9 then 350
            when 10 then 350
            when 11 then 250
            when 12 then 250
            when 13 then 250
            when 14 then 250
            when 15 then 190
            when 16 then 420
            when 17 then 180
            when 18 then 290
            when 19 then 450
            when 20 then 1290
            when 21 then 1190
            when 22 then 1490
            when 23 then 1590
            when 24 then 1690
        end;

        order_total := order_total + (unit_price * item_quantity);
        canonical_items := canonical_items || jsonb_build_array(jsonb_build_object(
            'product_id', product_id,
            'size', product_size,
            'quantity', item_quantity,
            'unit_price', unit_price
        ));
    end loop;

    if order_total < 1 or order_total > 2147483647 then
        raise exception 'Invalid order total';
    end if;

    request_fingerprint := md5(canonical_items::text || p_bank || p_slip_path);
    select *
    into existing_order
    from public.store_orders
    where id = p_order_id
    for update;

    if found then
        if existing_order.user_id <> (select auth.uid())
            or existing_order.submission_fingerprint <> request_fingerprint then
            raise exception 'Order id already used for a different request';
        end if;

        return jsonb_build_object(
            'id', existing_order.id,
            'status', existing_order.status,
            'total_amount', existing_order.total_amount,
            'created_at', existing_order.created_at,
            'slip_expires_at', existing_order.slip_expires_at
        );
    end if;

    if exists (
        select 1
        from jsonb_to_recordset(canonical_items) as requested(
            product_id integer,
            size text,
            quantity integer
        )
        left join public.product_stock as stock
          on stock.product_id = requested.product_id
         and stock.size = requested.size
        where stock.product_id is null
           or stock.stock < requested.quantity
    ) then
        raise exception 'Insufficient stock for this order';
    end if;

    insert into public.store_orders (
        id,
        user_id,
        customer_name,
        status,
        bank,
        total_amount,
        slip_path,
        slip_expires_at,
        submission_fingerprint
    )
    values (
        p_order_id,
        (select auth.uid()),
        v_customer_name,
        'pending',
        p_bank,
        order_total::integer,
        p_slip_path,
        now() + interval '15 days',
        request_fingerprint
    );

    insert into public.store_order_items (order_id, product_id, size, quantity, unit_price)
    select
        p_order_id,
        (item ->> 'product_id')::integer,
        item ->> 'size',
        (item ->> 'quantity')::integer,
        (item ->> 'unit_price')::integer
    from jsonb_array_elements(canonical_items) as items(item);

    return jsonb_build_object(
        'id', p_order_id,
        'status', 'pending',
        'total_amount', order_total::integer,
        'created_at', now(),
        'slip_expires_at', now() + interval '15 days'
    );
end;
$$;

create or replace function public.approve_store_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    order_status text;
    slip_expiry timestamptz;
    order_slip_path text;
begin
    if not coalesce((select public.is_admin()), false) then
        raise exception 'Admin access required';
    end if;

    select status, slip_expires_at, slip_path
    into order_status, slip_expiry, order_slip_path
    from public.store_orders
    where id = p_order_id
    for update;

    if not found or order_status <> 'pending' then
        raise exception 'Order is not pending';
    end if;
    if order_slip_path is null or slip_expiry <= now() then
        raise exception 'Payment slip has expired';
    end if;

    perform stock.product_id
    from public.product_stock as stock
    join public.store_order_items as items
      on items.product_id = stock.product_id
     and items.size = stock.size
    where items.order_id = p_order_id
    order by stock.product_id, stock.size
    for update of stock;

    if exists (
        select 1
        from public.store_order_items as items
        left join public.product_stock as stock
          on stock.product_id = items.product_id
         and stock.size = items.size
        where items.order_id = p_order_id
          and stock.product_id is null
    ) then
        raise exception 'Stock record not found';
    end if;

    if exists (
        select 1
        from public.product_stock as stock
        join public.store_order_items as items
          on items.product_id = stock.product_id
         and items.size = stock.size
        where items.order_id = p_order_id
          and stock.stock < items.quantity
    ) then
        raise exception 'Insufficient stock to approve order';
    end if;

    update public.product_stock as stock
    set stock = stock.stock - items.quantity,
        updated_at = now()
    from public.store_order_items as items
    where items.order_id = p_order_id
      and items.product_id = stock.product_id
      and items.size = stock.size;

    update public.store_orders
    set status = 'approved',
        updated_at = now()
    where id = p_order_id;

    return jsonb_build_object('id', p_order_id, 'status', 'approved');
end;
$$;

create or replace function public.reject_store_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not coalesce((select public.is_admin()), false) then
        raise exception 'Admin access required';
    end if;

    update public.store_orders
    set status = 'rejected',
        updated_at = now()
    where id = p_order_id
      and status = 'pending';

    if not found then
        raise exception 'Order is not pending';
    end if;

    return jsonb_build_object('id', p_order_id, 'status', 'rejected');
end;
$$;

revoke all on function public.submit_store_order(uuid, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.approve_store_order(uuid) from public, anon, authenticated;
revoke all on function public.reject_store_order(uuid) from public, anon, authenticated;
grant execute on function public.submit_store_order(uuid, jsonb, text, text) to authenticated;
grant execute on function public.approve_store_order(uuid) to authenticated;
grant execute on function public.reject_store_order(uuid) to authenticated;
