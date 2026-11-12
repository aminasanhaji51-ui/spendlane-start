create table if not exists expenses (
  id serial primary key,
  employee_email text not null,
  amount_cents integer not null check (amount_cents > 0),
  category text not null check (category in ('travel', 'meals', 'equipment', 'other')),
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
