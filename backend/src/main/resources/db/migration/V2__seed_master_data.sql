-- EstateHub Master Seed Data Migration V2
-- Seeds property categories and amenities

-- 1. SEED PROPERTY CATEGORIES
INSERT INTO property_categories (id, name, slug, description, icon, display_order, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Apartments', 'apartments', 'Modern residential apartments and flats in prime urban locations', 'Building2', 1, true),
    ('11111111-1111-1111-1111-111111111102', 'Villas & Mansions', 'villas', 'Spacious luxury villas with private gardens and premium finishes', 'Home', 2, true),
    ('11111111-1111-1111-1111-111111111103', 'Houses & Townhomes', 'houses', 'Cozy family houses, townhomes and independent residences', 'Warehouse', 3, true),
    ('11111111-1111-1111-1111-111111111104', 'Commercial', 'commercial', 'Commercial complexes, retail spaces and high-traffic storefronts', 'Store', 4, true),
    ('11111111-1111-1111-1111-111111111105', 'Modern Offices', 'offices', 'Corporate office spaces, tech parks and coworking suites', 'Briefcase', 5, true),
    ('11111111-1111-1111-1111-111111111106', 'Residential Plots', 'plots', 'Developed plots and land parcels ready for customized construction', 'MapPin', 6, true),
    ('11111111-1111-1111-1111-111111111107', 'Luxury Penthouses', 'penthouses', 'Skyline penthouses featuring panoramic city views and private terraces', 'Crown', 7, true),
    ('11111111-1111-1111-1111-111111111108', 'Studio Apartments', 'studios', 'Compact, efficient studio units perfect for singles and students', 'Compass', 8, true)
ON CONFLICT (name) DO NOTHING;

-- 2. SEED AMENITIES
INSERT INTO amenities (id, name, category, icon)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'Swimming Pool', 'Recreation', 'Waves'),
    ('22222222-2222-2222-2222-222222222202', 'Gymnasium & Fitness', 'Recreation', 'Dumbbell'),
    ('22222222-2222-2222-2222-222222222203', '24/7 Security & CCTV', 'Safety', 'ShieldCheck'),
    ('22222222-2222-2222-2222-222222222204', '100% Power Backup', 'Utilities', 'Zap'),
    ('22222222-2222-2222-2222-222222222205', 'Covered Car Parking', 'Convenience', 'Car'),
    ('22222222-2222-2222-2222-222222222206', 'High-Speed Elevators', 'Convenience', 'ArrowUpDown'),
    ('22222222-2222-2222-2222-222222222207', 'Private Balcony', 'Outdoor', 'Sun'),
    ('22222222-2222-2222-2222-222222222208', 'Central Air Conditioning', 'Utilities', 'Wind'),
    ('22222222-2222-2222-2222-222222222209', 'High Speed Fiber WiFi', 'Connectivity', 'Wifi'),
    ('22222222-2222-2222-2222-222222222210', 'Landscaped Garden', 'Outdoor', 'Trees'),
    ('22222222-2222-2222-2222-222222222211', 'Pet Friendly', 'Convenience', 'HeartHandshake'),
    ('22222222-2222-2222-2222-222222222212', 'EV Charging Station', 'Eco', 'BatteryCharging'),
    ('22222222-2222-2222-2222-222222222213', 'Smart Home Automation', 'Tech', 'Cpu'),
    ('22222222-2222-2222-2222-222222222214', 'Children Play Area', 'Recreation', 'Smile')
ON CONFLICT (name) DO NOTHING;
