-- Capture the selected Digital-UNI program with every enrollment/contact request.
alter table public.contact_submissions
  add column program text not null default 'Other Digital-UNI™ program';
