-- Run this in your Supabase SQL Editor

CREATE TABLE sponsors_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('sponsor', 'partner')),
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE sponsors_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sponsors_partners is viewable by everyone."
  ON sponsors_partners FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can insert sponsors_partners"
  ON sponsors_partners FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can update sponsors_partners"
  ON sponsors_partners FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can delete sponsors_partners"
  ON sponsors_partners FOR DELETE
  USING ( auth.role() = 'authenticated' );
