/**
 * Real Estate CRM & Multi-Portal API Verification Suite
 */

const BASE_URL = 'http://localhost:8080/api/v1';

async function req(endpoint, opts = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });

  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

let passed = 0;
let total = 0;
function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
}

async function run() {
  console.log('====================================================');
  console.log('🚀 TESTING AGENT CRM, USER PORTAL & ADMIN APIs');
  console.log('====================================================\n');

  // 1. Agent Login
  console.log('--- TEST 1: Agent Authentication & CRM Cockpit ---');
  const agentLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'agent.john@estatehub.com', password: 'Agent1234!' })
  });
  assert(agentLogin.status === 200, 'Agent login succeeded');
  const agentToken = agentLogin.data.data.token;

  // CRM Stats
  const statsRes = await req('/crm/stats', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(statsRes.status === 200, 'GET /crm/stats returned HTTP 200');
  const stats = statsRes.data.data;
  assert(stats.totalLeads > 0, `Agent has active leads: ${stats.totalLeads}`);
  assert(Number(stats.activePipelineBudget) > 0, `Active pipeline budget > 0: $${stats.activePipelineBudget}`);
  assert(stats.leadsByStage !== undefined, 'Leads by stage breakdown present');

  // Leads & Pipeline
  console.log('\n--- TEST 2: CRM Lead Pipeline & Stage Transitions ---');
  const leadsRes = await req('/crm/leads', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(leadsRes.status === 200, 'GET /crm/leads returned HTTP 200');
  const leads = leadsRes.data.data;
  assert(Array.isArray(leads) && leads.length >= 4, `CRM leads list has ${leads.length} records`);

  // Create new CRM Lead
  const newLeadRes = await req('/crm/leads', {
    method: 'POST',
    headers: { Authorization: `Bearer ${agentToken}` },
    body: JSON.stringify({
      contactName: 'Seraphina Vance',
      contactEmail: 'seraphina.vance@investcorp.com',
      contactPhone: '+1 (555) 765-4321',
      stage: 'NEW_LEAD',
      source: 'WEBSITE',
      budget: 3500000.00,
      priority: 'HOT',
      notes: 'Interested in luxury high-rise condominium with downtown views'
    })
  });
  assert(newLeadRes.status === 201 || newLeadRes.status === 200, 'POST /crm/leads created new lead');
  const createdLeadId = newLeadRes.data.data.id;

  // Update Lead Stage to SHOWING_SCHEDULED
  const stageUpdateRes = await req(`/crm/leads/${createdLeadId}/stage`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${agentToken}` },
    body: JSON.stringify({
      stage: 'SHOWING_SCHEDULED',
      notes: 'Scheduled private showing for Saturday afternoon'
    })
  });
  assert(stageUpdateRes.status === 200, 'PATCH /crm/leads/{id}/stage advanced lead');
  assert(stageUpdateRes.data.data.stage === 'SHOWING_SCHEDULED', 'Lead stage is SHOWING_SCHEDULED');

  // 2. Deals & Commission
  console.log('\n--- TEST 3: Deals Pipeline & Commission Tracking ---');
  const dealsRes = await req('/crm/deals', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(dealsRes.status === 200, 'GET /crm/deals returned HTTP 200');
  const deals = dealsRes.data.data;
  assert(Array.isArray(deals) && deals.length > 0, `Agent has ${deals.length} deals in pipeline`);

  // Contacts
  console.log('\n--- TEST 4: CRM Client Contacts Directory ---');
  const contactsRes = await req('/crm/contacts', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(contactsRes.status === 200, 'GET /crm/contacts returned HTTP 200');
  assert(contactsRes.data.data.length > 0, 'Contacts directory returned records');

  // Showings
  console.log('\n--- TEST 5: Agent Showings & Tour Schedule ---');
  const showingsRes = await req('/crm/showings', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(showingsRes.status === 200, 'GET /crm/showings returned HTTP 200');
  assert(showingsRes.data.data.length > 0, 'Agent has scheduled showings');

  // Agent Profile
  console.log('\n--- TEST 6: Agent Professional Profile ---');
  const profileRes = await req('/crm/profile', {
    headers: { Authorization: `Bearer ${agentToken}` }
  });
  assert(profileRes.status === 200, 'GET /crm/profile returned HTTP 200');
  assert(profileRes.data.data.verified === true, 'Agent is verified');

  // 3. Buyer / Client Showings & RBAC Guard
  console.log('\n--- TEST 7: Client Tour Booking & RBAC Security ---');
  const buyerLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'buyer.alice@estatehub.com', password: 'User1234!' })
  });
  assert(buyerLogin.status === 200, 'Buyer login succeeded');
  const buyerToken = buyerLogin.data.data.token;

  // Non-agent accessing CRM endpoints must receive 403 Forbidden
  const forbiddenCrmRes = await req('/crm/stats', {
    headers: { Authorization: `Bearer ${buyerToken}` }
  });
  assert(forbiddenCrmRes.status === 403, 'GET /crm/stats correctly returned HTTP 403 Forbidden for buyer');

  // Buyer books a showing on a property
  const propsRes = await req('/properties/featured');
  const propId = propsRes.data.data[0].id;
  const bookingRes = await req('/showings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${buyerToken}` },
    body: JSON.stringify({
      propertyId: propId,
      clientName: 'Alice Montgomery',
      clientEmail: 'buyer.alice@estatehub.com',
      clientPhone: '+1 (555) 234-5678',
      showingTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      showingType: 'IN_PERSON',
      notes: 'Requesting sunset viewing with agent'
    })
  });
  assert(bookingRes.status === 201 || bookingRes.status === 200, 'POST /showings booked property tour');

  // Buyer views their booked showings
  const myShowingsRes = await req('/showings/my', {
    headers: { Authorization: `Bearer ${buyerToken}` }
  });
  assert(myShowingsRes.status === 200, 'GET /showings/my returned HTTP 200');
  assert(myShowingsRes.data.data.length > 0, 'Buyer successfully retrieved booked showings');

  // 4. Admin Governance
  console.log('\n--- TEST 8: Admin Governance & Platform Oversight ---');
  const adminLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@estatehub.com', password: 'AdminSecure2026!' })
  });
  assert(adminLogin.status === 200, 'Admin login succeeded');
  const adminToken = adminLogin.data.data.token;

  const adminDashRes = await req('/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminDashRes.status === 200, 'GET /admin/dashboard returned HTTP 200');
  assert(adminDashRes.data.data.totalProperties > 0, 'Admin reports totalProperties > 0');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} CRM & MULTI-PORTAL TESTS PASSED!`);
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
