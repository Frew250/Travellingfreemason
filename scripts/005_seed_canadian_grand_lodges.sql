-- Delete existing US Grand Lodges and replace with Canadian ones
DELETE FROM public.grand_lodges;

-- Seed Canadian Grand Lodges
INSERT INTO public.grand_lodges (name, state, country) VALUES
('Grand Lodge of Alberta', 'Alberta', 'Canada'),
('Grand Lodge of British Columbia and Yukon', 'British Columbia', 'Canada'),
('Grand Lodge of Manitoba', 'Manitoba', 'Canada'),
('Grand Lodge of New Brunswick', 'New Brunswick', 'Canada'),
('Grand Lodge of Newfoundland and Labrador', 'Newfoundland and Labrador', 'Canada'),
('Grand Lodge of Nova Scotia', 'Nova Scotia', 'Canada'),
('Grand Lodge of Ontario', 'Ontario', 'Canada'),
('Grand Lodge of Prince Edward Island', 'Prince Edward Island', 'Canada'),
('Grand Lodge of Quebec', 'Quebec', 'Canada'),
('Grand Lodge of Saskatchewan', 'Saskatchewan', 'Canada'),
('Grand Lodge of the Northwest Territories', 'Northwest Territories', 'Canada'),
('Grand Lodge of Nunavut', 'Nunavut', 'Canada'),
('Grand Lodge of Yukon', 'Yukon', 'Canada')
ON CONFLICT (name) DO NOTHING;
