import { execSync } from 'child_process';

const sql = `
-- 1. Agent Profile
INSERT INTO agent_profiles (id, user_id, license_number, agency_name, specialties, experience_years, commission_rate, rating, is_verified, bio)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    'CAL-DRE#01928475',
    'Sterling Luxury Real Estate Group',
    'Luxury Penthouses, Waterfront Estates, Commercial Investments',
    12,
    3.00,
    4.96,
    TRUE,
    'Top 1% luxury broker with over $120M in closed residential volume across Manhattan, Miami, and West Coast metropolitan markets.'
) ON CONFLICT (user_id) DO UPDATE SET
    license_number = EXCLUDED.license_number,
    agency_name = EXCLUDED.agency_name,
    specialties = EXCLUDED.specialties,
    is_verified = TRUE;

-- 2. CRM Contacts
INSERT INTO crm_contacts (id, agent_id, user_id, full_name, email, phone, contact_type, budget_min, budget_max, preferred_locations, notes, last_contacted_at)
VALUES 
(
    'c1111111-1111-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '897f03b2-864b-4d2b-9ccf-a31f6443a518',
    'Alice Montgomery',
    'buyer.alice@estatehub.com',
    '+1 (555) 234-5678',
    'BUYER',
    3000000.00,
    5000000.00,
    'New York, Miami Waterfront',
    'Pre-approved high net worth buyer seeking 4+ BR luxury penthouse or modern coastal villa.',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    'c2222222-2222-2222-2222-222222222222',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    'Marcus Vance',
    'marcus.vance@vancecapital.com',
    '+1 (555) 890-1234',
    'INVESTOR',
    5000000.00,
    15000000.00,
    'Austin, New York, Seattle',
    'Commercial real estate fund manager looking for cash-flowing prime assets.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    'c3333333-3333-3333-3333-333333333333',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    'Elena Rostova',
    'elena.rostova@techfounders.io',
    '+1 (555) 345-6789',
    'BUYER',
    2000000.00,
    3800000.00,
    'Miami Beach, Coconut Grove',
    'Relocating tech executive; prefers smart-home integration, dock access, and private pool.',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'c4444444-4444-4444-4444-444444444444',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '33c82fb9-c71a-4644-a069-7dd2a0435a67',
    'David Kowalski',
    'owner.david@estatehub.com',
    '+1 (555) 987-6543',
    'SELLER',
    1200000.00,
    2500000.00,
    'San Francisco, Seattle',
    'Repeat client. Looking to exchange residential portfolio via 1031 tax deferred exchange.',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- 3. CRM Leads (Kanban Pipeline across stages)
INSERT INTO crm_leads (id, agent_id, client_id, property_id, contact_name, contact_email, contact_phone, stage, source, budget, priority, notes)
VALUES
(
    '11111111-aaaa-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '897f03b2-864b-4d2b-9ccf-a31f6443a518',
    '598468c0-9d5a-4d60-9be8-f5a774c7aa8a',
    'Alice Montgomery',
    'buyer.alice@estatehub.com',
    '+1 (555) 234-5678',
    'OFFER_NEGOTIATION',
    'WEBSITE',
    4250000.00,
    'HOT',
    'Counter-offered at $4.1M with 21-day closing. Awaiting seller board review.'
),
(
    '22222222-aaaa-2222-2222-222222222222',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    '086921e3-d005-4a8d-ac37-303629a11fb8',
    'Elena Rostova',
    'elena.rostova@techfounders.io',
    '+1 (555) 345-6789',
    'SHOWING_SCHEDULED',
    'REFERRAL',
    3600000.00,
    'HOT',
    'Private yacht arrival tour confirmed for Saturday 2:00 PM.'
),
(
    '33333333-aaaa-3333-3333-333333333333',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    '516b7b62-5d17-42ee-91f2-fb7517f38f14',
    'Dr. Julian Hayes',
    'julian.hayes@medcenter.org',
    '+1 (555) 678-9012',
    'CONTACTED',
    'WEBSITE',
    1500000.00,
    'WARM',
    'Discussed school district proximity and parking garage space. Sent property brochure.'
),
(
    '44444444-aaaa-4444-4444-444444444444',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    NULL,
    'Robert Sterling Jr.',
    'r.sterling@finpartners.com',
    '+1 (555) 456-7890',
    'NEW_LEAD',
    'DIRECT',
    2800000.00,
    'WARM',
    'Inbound phone lead requesting representation on Westlake Hills luxury properties.'
),
(
    '55555555-aaaa-5555-5555-555555555555',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    '598468c0-9d5a-4d60-9be8-f5a774c7aa8a',
    'Victoria Thorne',
    'victoria@thorneholdings.co.uk',
    '+1 (555) 998-1122',
    'UNDER_CONTRACT',
    'REFERRAL',
    4200000.00,
    'HOT',
    'Contract signed, earnest money deposit wired to title escrow. Inspection scheduled.'
),
(
    '66666666-aaaa-6666-6666-666666666666',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    NULL,
    NULL,
    'Gabriel Santos',
    'gsantos@brazilinvest.br',
    '+1 (555) 771-4433',
    'CLOSED_WON',
    'ZILLOW',
    3450000.00,
    'HOT',
    'Closed on Brickell Penthouse. Client delighted, gave 5-star review.'
) ON CONFLICT (id) DO NOTHING;

-- 4. CRM Deals & Commission Pipeline
INSERT INTO crm_deals (id, agent_id, lead_id, property_id, deal_name, client_name, deal_value, commission_rate, commission_amount, status, stage, expected_close_date)
VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '11111111-aaaa-1111-1111-111111111111',
    '598468c0-9d5a-4d60-9be8-f5a774c7aa8a',
    'Hudson Yards Crown Penthouse Sale',
    'Alice Montgomery',
    4250000.00,
    3.00,
    127500.00,
    'ACTIVE',
    'OFFER_SUBMITTED',
    CURRENT_DATE + INTERVAL '30 days'
),
(
    'd2222222-2222-2222-2222-222222222222',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '55555555-aaaa-5555-5555-555555555555',
    '086921e3-d005-4a8d-ac37-303629a11fb8',
    'Coconut Grove Waterfront Villa Acquisition',
    'Victoria Thorne',
    3600000.00,
    2.50,
    90000.00,
    'ACTIVE',
    'UNDER_CONTRACT',
    CURRENT_DATE + INTERVAL '14 days'
),
(
    'd3333333-3333-3333-3333-333333333333',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '66666666-aaaa-6666-6666-666666666666',
    NULL,
    'Brickell Sky Mansion Close',
    'Gabriel Santos',
    3450000.00,
    3.00,
    103500.00,
    'WON',
    'CLOSED',
    CURRENT_DATE - INTERVAL '15 days'
) ON CONFLICT (id) DO NOTHING;

-- 5. CRM Showings & Property Tours
INSERT INTO crm_showings (id, agent_id, property_id, client_id, client_name, client_email, client_phone, showing_time, showing_type, status, notes)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '598468c0-9d5a-4d60-9be8-f5a774c7aa8a',
    '897f03b2-864b-4d2b-9ccf-a31f6443a518',
    'Alice Montgomery',
    'buyer.alice@estatehub.com',
    '+1 (555) 234-5678',
    CURRENT_TIMESTAMP + INTERVAL '1 day 2 hours',
    'IN_PERSON',
    'CONFIRMED',
    'Client requested sunset viewing from 78th floor terrace. Doorman informed.'
),
(
    'e2222222-2222-2222-2222-222222222222',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '086921e3-d005-4a8d-ac37-303629a11fb8',
    NULL,
    'Elena Rostova',
    'elena.rostova@techfounders.io',
    '+1 (555) 345-6789',
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    'IN_PERSON',
    'REQUESTED',
    'Private walkthrough requested. Needs private boat slip specs.'
),
(
    'e3333333-3333-3333-3333-333333333333',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    '516b7b62-5d17-42ee-91f2-fb7517f38f14',
    NULL,
    'Dr. Julian Hayes',
    'julian.hayes@medcenter.org',
    '+1 (555) 678-9012',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'VIRTUAL_TOUR',
    'COMPLETED',
    'Full 3D video tour conducted via Zoom. Buyer loved the garden and detached garage.'
) ON CONFLICT (id) DO NOTHING;

-- 6. CRM Interaction Notes
INSERT INTO crm_notes (id, agent_id, entity_type, entity_id, note_type, content)
VALUES
(
    'f1111111-1111-1111-1111-111111111111',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    'LEAD',
    '11111111-aaaa-1111-1111-111111111111',
    'CALL',
    '30-minute phone call with Alice Montgomery. Verified proof of funds ($5.2M liquid). Interested in closing before end of Q4.'
),
(
    'f2222222-2222-2222-2222-222222222222',
    '6c776b66-9e3f-4d17-acb5-52d7e7bd8e0b',
    'LEAD',
    '11111111-aaaa-1111-1111-111111111111',
    'MEETING',
    'In-person coffee with Alice and her wealth advisor at Hudson Yards retail lounge. Delivered condo bylaws.'
) ON CONFLICT (id) DO NOTHING;
`;

try {
  execSync('"C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -U postgres -h localhost -p 5432 -d realestate_db', {
    input: sql,
    env: { ...process.env, PGPASSWORD: 'root' },
    encoding: 'utf-8'
  });
  console.log('✅ CRM seed data successfully loaded into PostgreSQL realestate_db');
} catch (e) {
  console.error('❌ Failed seeding CRM data:', e.message);
  process.exit(1);
}
