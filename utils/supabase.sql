-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.shopping_list (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone NOT NULL,
  name character varying,
  updated_at timestamp without time zone,
  status character varying,
  owner_id_fk uuid DEFAULT gen_random_uuid(),
  CONSTRAINT shopping_list_pkey PRIMARY KEY (id),
  CONSTRAINT shopping_list_owner_id_fk_fkey FOREIGN KEY (owner_id_fk) REFERENCES auth.users(id)
);
CREATE TABLE public.shopping_list_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  text character varying,
  bought boolean,
  quantity numeric,
  unit character varying,
  shopping_list_id_fk uuid DEFAULT gen_random_uuid(),
  CONSTRAINT shopping_list_items_pkey PRIMARY KEY (id),
  CONSTRAINT shopping_list_items_shopping_list_id_fk_fkey FOREIGN KEY (shopping_list_id_fk) REFERENCES public.shopping_list(id)
);
CREATE TABLE public.synced_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT gen_random_uuid(),
  guest_id uuid DEFAULT gen_random_uuid(),
  description character varying,
  CONSTRAINT synced_users_pkey PRIMARY KEY (id),
  CONSTRAINT synced_users_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES auth.users(id),
  CONSTRAINT synced_users_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);

create or replace function has_cred_for_list( p_list_id in uuid )
returns boolean
language plpgsql
security definer -- will run as the creator
as $$
begin
  return exists (
    select 1 
    from public."shopping_list" sl
    where (select auth.uid()) = sl.owner_id_fk
    and p_list_id = sl.id
  );
end;
$$;

