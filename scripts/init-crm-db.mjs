import { execSync } from 'child_process';

const sql = `
-- 1. Agent Profiles
CREATE TABLE IF NOT EXISTS agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100),
    agency_name VARCHAR(150),
    specialties VARCHAR(255),
    experience_years INT DEFAULT 1,
    commission_rate NUMERIC(5,2) DEFAULT 3.00,
    rating NUMERIC(3,2) DEFAULT 4.90,
    is_verified BOOLEAN DEFAULT TRUE,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50),
    stage VARCHAR(50) NOT NULL DEFAULT 'NEW_LEAD',
    source VARCHAR(50) DEFAULT 'WEBSITE',
    budget NUMERIC(15,2),
    priority VARCHAR(20) DEFAULT 'WARM',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRM Deals & Commission
CREATE TABLE IF NOT EXISTS crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    deal_name VARCHAR(200) NOT NULL,
    client_name VARCHAR(150) NOT NULL,
    deal_value NUMERIC(15,2) NOT NULL,
    commission_rate NUMERIC(5,2) DEFAULT 3.00,
    commission_amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    stage VARCHAR(50) DEFAULT 'OFFER_SUBMITTED',
    expected_close_date DATE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CRM Contacts
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    contact_type VARCHAR(50) DEFAULT 'BUYER',
    budget_min NUMERIC(15,2),
    budget_max NUMERIC(15,2),
    preferred_locations VARCHAR(255),
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CRM Showings & Property Tours
CREATE TABLE IF NOT EXISTS crm_showings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50),
    showing_time TIMESTAMP WITH TIME ZONE NOT NULL,
    showing_type VARCHAR(50) DEFAULT 'IN_PERSON',
    status VARCHAR(50) DEFAULT 'REQUESTED',
    notes TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CRM Interaction Notes
CREATE TABLE IF NOT EXISTS crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    note_type VARCHAR(50) DEFAULT 'GENERAL',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_crm_leads_agent ON crm_leads(agent_id, stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_agent ON crm_deals(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_agent ON crm_contacts(agent_id);
CREATE INDEX IF NOT EXISTS idx_crm_showings_agent ON crm_showings(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_showings_client ON crm_showings(client_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_entity ON crm_notes(entity_type, entity_id);
`;

try {
  execSync('"C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -U postgres -h localhost -p 5432 -d realestate_db', {
    input: sql,
    env: { ...process.env, PGPASSWORD: 'root' },
    encoding: 'utf-8'
  });
  console.log('✅ CRM database tables & indexes created successfully in realestate_db');
} catch (e) {
  console.error('❌ Failed creating CRM tables:', e.message);
  process.exit(1);
}
