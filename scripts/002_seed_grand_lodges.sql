-- Create grand_lodges table
CREATE TABLE IF NOT EXISTS public.grand_lodges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.grand_lodges ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view grand lodges (public reference data)
CREATE POLICY "public_select_grand_lodges" ON public.grand_lodges
  FOR SELECT USING (true);

-- Seed Grand Lodges data for all US states
INSERT INTO public.grand_lodges (name, state, country) VALUES
  ('Grand Lodge of Alabama', 'Alabama', 'USA'),
  ('Grand Lodge of Alaska', 'Alaska', 'USA'),
  ('Grand Lodge of Arizona', 'Arizona', 'USA'),
  ('Grand Lodge of Arkansas', 'Arkansas', 'USA'),
  ('Grand Lodge of California', 'California', 'USA'),
  ('Grand Lodge of Colorado', 'Colorado', 'USA'),
  ('Grand Lodge of Connecticut', 'Connecticut', 'USA'),
  ('Grand Lodge of Delaware', 'Delaware', 'USA'),
  ('Grand Lodge of Florida', 'Florida', 'USA'),
  ('Grand Lodge of Georgia', 'Georgia', 'USA'),
  ('Grand Lodge of Hawaii', 'Hawaii', 'USA'),
  ('Grand Lodge of Idaho', 'Idaho', 'USA'),
  ('Grand Lodge of Illinois', 'Illinois', 'USA'),
  ('Grand Lodge of Indiana', 'Indiana', 'USA'),
  ('Grand Lodge of Iowa', 'Iowa', 'USA'),
  ('Grand Lodge of Kansas', 'Kansas', 'USA'),
  ('Grand Lodge of Kentucky', 'Kentucky', 'USA'),
  ('Grand Lodge of Louisiana', 'Louisiana', 'USA'),
  ('Grand Lodge of Maine', 'Maine', 'USA'),
  ('Grand Lodge of Maryland', 'Maryland', 'USA'),
  ('Grand Lodge of Massachusetts', 'Massachusetts', 'USA'),
  ('Grand Lodge of Michigan', 'Michigan', 'USA'),
  ('Grand Lodge of Minnesota', 'Minnesota', 'USA'),
  ('Grand Lodge of Mississippi', 'Mississippi', 'USA'),
  ('Grand Lodge of Missouri', 'Missouri', 'USA'),
  ('Grand Lodge of Montana', 'Montana', 'USA'),
  ('Grand Lodge of Nebraska', 'Nebraska', 'USA'),
  ('Grand Lodge of Nevada', 'Nevada', 'USA'),
  ('Grand Lodge of New Hampshire', 'New Hampshire', 'USA'),
  ('Grand Lodge of New Jersey', 'New Jersey', 'USA'),
  ('Grand Lodge of New Mexico', 'New Mexico', 'USA'),
  ('Grand Lodge of New York', 'New York', 'USA'),
  ('Grand Lodge of North Carolina', 'North Carolina', 'USA'),
  ('Grand Lodge of North Dakota', 'North Dakota', 'USA'),
  ('Grand Lodge of Ohio', 'Ohio', 'USA'),
  ('Grand Lodge of Oklahoma', 'Oklahoma', 'USA'),
  ('Grand Lodge of Oregon', 'Oregon', 'USA'),
  ('Grand Lodge of Pennsylvania', 'Pennsylvania', 'USA'),
  ('Grand Lodge of Rhode Island', 'Rhode Island', 'USA'),
  ('Grand Lodge of South Carolina', 'South Carolina', 'USA'),
  ('Grand Lodge of South Dakota', 'South Dakota', 'USA'),
  ('Grand Lodge of Tennessee', 'Tennessee', 'USA'),
  ('Grand Lodge of Texas', 'Texas', 'USA'),
  ('Grand Lodge of Utah', 'Utah', 'USA'),
  ('Grand Lodge of Vermont', 'Vermont', 'USA'),
  ('Grand Lodge of Virginia', 'Virginia', 'USA'),
  ('Grand Lodge of Washington', 'Washington', 'USA'),
  ('Grand Lodge of West Virginia', 'West Virginia', 'USA'),
  ('Grand Lodge of Wisconsin', 'Wisconsin', 'USA'),
  ('Grand Lodge of Wyoming', 'Wyoming', 'USA'),
  ('Grand Lodge of the District of Columbia', 'District of Columbia', 'USA')
ON CONFLICT (name) DO NOTHING;
