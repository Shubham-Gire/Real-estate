/**
 * EstateHub End-to-End API Integration & Workflow Verification Suite
 * Tests full system workflows against the live Spring Boot + PostgreSQL backend:
 * 1. Health check & public metadata
 * 2. Search & filtering with JPA specifications
 * 3. User registration & JWT authentication
 * 4. User profile management
 * 5. Property listing creation (status lifecycle: PENDING_REVIEW)
 * 6. Guest inquiry submission & owner lead tracking
 * 7. Favorite & unfavorite workflows
 * 8. RBAC security enforcement (403 for non-admin on admin endpoints)
 * 9. Admin listing moderation (approve / reject with mandatory reason)
 * 10. Admin analytics dashboard & audit logs
 */

const BASE_URL = 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return { status: res.status, ok: res.ok, data };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 STARTING ESTATEHUB END-TO-END WORKFLOW SUITE');
  console.log('====================================================\n');

  // TEST 1: Public Categories & Amenities
  console.log('--- TEST 1: Master Metadata (Categories & Amenities) ---');
  const catRes = await request('/categories');
  assert(catRes.status === 200, 'GET /categories returned HTTP 200');
  assert(Array.isArray(catRes.data.data) && catRes.data.data.length >= 4, 'Categories list contains at least 4 seeded categories');
  const luxuryPenthouseCat = catRes.data.data.find(c => c.name.toLowerCase().includes('penthouse') || c.name.toLowerCase().includes('apartment'));
  const testCategoryId = luxuryPenthouseCat ? luxuryPenthouseCat.id : catRes.data.data[0].id;

  const amenRes = await request('/amenities');
  assert(amenRes.status === 200, 'GET /amenities returned HTTP 200');
  assert(Array.isArray(amenRes.data.data) && amenRes.data.data.length >= 6, 'Amenities list contains at least 6 seeded amenities');
  const testAmenityIds = amenRes.data.data.slice(0, 3).map(a => a.id);

  // TEST 2: Public Property Search, Filtering, and Pagination
  console.log('\n--- TEST 2: Public Property Search & Filters ---');
  const searchRes = await request('/properties?page=0&size=5&transactionType=SALE&city=New%20York');
  assert(searchRes.status === 200, 'GET /properties with query filters returned HTTP 200');
  assert(searchRes.data.success === true, 'Response payload marked success: true');
  assert(Array.isArray(searchRes.data.data.content), 'Returned paginated content array');

  // Featured Properties
  const featRes = await request('/properties/featured');
  assert(featRes.status === 200, 'GET /properties/featured returned HTTP 200');
  assert(featRes.data.data.length > 0, 'Featured properties exist in database');
  const featuredPropertyId = featRes.data.data[0].id;

  // Single Property Detail
  const detailRes = await request(`/properties/${featuredPropertyId}`);
  assert(detailRes.status === 200, `GET /properties/${featuredPropertyId} returned HTTP 200`);
  assert(detailRes.data.data.title !== undefined, 'Property details include title');
  assert(detailRes.data.data.ownerName !== undefined, 'Property details include owner details');

  // TEST 3: User Registration & Authentication
  console.log('\n--- TEST 3: User Registration & Authentication ---');
  const randomSuffix = Math.floor(Math.random() * 100000);
  const newEmail = `verifier.${randomSuffix}@testdomain.com`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: newEmail,
      password: 'Password123!',
      firstName: 'Workflow',
      lastName: 'Verifier',
      phone: '+1 555 019 9999',
      role: 'ROLE_USER'
    })
  });
  assert(regRes.status === 200 || regRes.status === 201, 'POST /auth/register returned HTTP 200/201');
  assert(regRes.data.data.token !== undefined, 'Registration returned valid JWT token');
  const newUserToken = regRes.data.data.token;

  // Login with newly created user
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: newEmail,
      password: 'Password123!'
    })
  });
  assert(loginRes.status === 200, 'POST /auth/login with new credentials succeeded');
  assert(loginRes.data.data.email === newEmail, 'Login response matched user email');

  // TEST 4: Authenticated User Profile Management
  console.log('\n--- TEST 4: User Profile Management ---');
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  assert(meRes.status === 200, 'GET /auth/me returned HTTP 200');
  assert(meRes.data.data.firstName === 'Workflow', 'User first name matches profile');

  const updateProfileRes = await request('/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${newUserToken}` },
    body: JSON.stringify({
      firstName: 'Workflow',
      lastName: 'Verifier Updated',
      phone: '+1 555 999 0000',
      bio: 'Verified property investor and owner'
    })
  });
  assert(updateProfileRes.status === 200, 'PUT /auth/profile updated profile successfully');
  assert(updateProfileRes.data.data.bio === 'Verified property investor and owner', 'Bio persisted');

  // TEST 5: Property Creation Lifecycle
  console.log('\n--- TEST 5: Property Listing Creation by Owner ---');
  const createPropRes = await request('/properties', {
    method: 'POST',
    headers: { Authorization: `Bearer ${newUserToken}` },
    body: JSON.stringify({
      title: `Spectacular Verified Penthouse #${randomSuffix}`,
      description: 'Luxury high-rise residence with panoramic vistas and bespoke designer finishes throughout.',
      transactionType: 'SALE',
      propertyType: 'APARTMENT',
      price: 1850000.00,
      deposit: 0,
      city: 'Chicago',
      locality: 'Gold Coast',
      address: '1000 N Lake Shore Dr',
      postalCode: '60611',
      latitude: 41.9022,
      longitude: -87.6256,
      bedrooms: 3,
      bathrooms: 3,
      builtUpSqft: 2800.0,
      carpetSqft: 2500.0,
      floorNumber: 24,
      totalFloors: 30,
      furnishingStatus: 'FURNISHED',
      parkingAvailable: true,
      categoryId: testCategoryId,
      amenityIds: testAmenityIds
    })
  });

  assert(createPropRes.status === 200 || createPropRes.status === 201, 'POST /properties returned HTTP 200/201');
  const createdProperty = createPropRes.data.data;
  assert(createdProperty.id !== undefined, 'Created property assigned UUID');
  assert(createdProperty.status === 'PENDING_REVIEW', 'Property listing created in PENDING_REVIEW status');
  const createdPropId = createdProperty.id;

  // TEST 6: Inquiries & Leads Workflow
  console.log('\n--- TEST 6: Guest Inquiry Submission ---');
  const inquiryRes = await request('/inquiries', {
    method: 'POST',
    body: JSON.stringify({
      propertyId: createdPropId,
      name: 'Interested Buyer',
      email: 'buyer.lead@example.com',
      phone: '+1 555 777 8888',
      message: 'Hello, I am interested in scheduling a private viewing for this listing. Please contact me.'
    })
  });
  assert(inquiryRes.status === 200 || inquiryRes.status === 201, 'POST /inquiries submitted successfully');

  // Verify owner received the inquiry
  const ownerInquiriesRes = await request('/inquiries/received', {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  assert(ownerInquiriesRes.status === 200, 'GET /inquiries/received returned HTTP 200');
  const receivedList = ownerInquiriesRes.data.data.content || ownerInquiriesRes.data.data;
  assert(Array.isArray(receivedList), 'Owner inquiries returned list');
  const foundLead = receivedList.find(inq => inq.propertyId === createdPropId);
  assert(foundLead !== undefined, 'Owner successfully received lead for their newly created property');

  // Update lead status
  if (foundLead) {
    const updateLeadRes = await request(`/inquiries/${foundLead.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${newUserToken}` },
      body: JSON.stringify({ status: 'CONTACTED' })
    });
    assert(updateLeadRes.status === 200, 'PATCH /inquiries/{id}/status updated lead to CONTACTED');
  }

  // TEST 7: Favorites Workflow
  console.log('\n--- TEST 7: Favorites Toggle & Fetch ---');
  const favToggleRes = await request(`/favorites/${featuredPropertyId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  assert(favToggleRes.status === 200, 'POST /favorites/{id} toggled favorite on');

  const myFavsRes = await request('/favorites', {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  assert(myFavsRes.status === 200, 'GET /favorites returned HTTP 200');
  const favList = myFavsRes.data.data.content || myFavsRes.data.data;
  const isFav = Array.isArray(favList) && favList.some(f => f.id === featuredPropertyId);
  assert(isFav, 'Featured property found in user favorites list');

  // TEST 8: RBAC Security Enforcement
  console.log('\n--- TEST 8: RBAC Security & Non-Admin Rejection ---');
  const nonAdminAccessRes = await request('/admin/dashboard', {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  assert(nonAdminAccessRes.status === 403, 'GET /admin/dashboard returned HTTP 403 Forbidden for non-admin');

  // TEST 9: Admin Authentication & Moderation
  console.log('\n--- TEST 9: Admin Authentication & Property Moderation ---');
  const adminLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@estatehub.com',
      password: 'AdminSecure2026!'
    })
  });
  assert(adminLoginRes.status === 200, 'POST /auth/login for administrator succeeded');
  const adminToken = adminLoginRes.data.data.token;

  // Admin Moderation Queue
  const modQueueRes = await request('/admin/properties?status=PENDING_REVIEW', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(modQueueRes.status === 200, 'GET /admin/properties?status=PENDING_REVIEW returned HTTP 200');
  const foundPending = modQueueRes.data.data.content.find(p => p.id === createdPropId);
  assert(foundPending !== undefined, 'Newly submitted property listed in Admin Moderation queue');

  // Test Admin Rejection with missing reason (should fail validation)
  const emptyReasonRejectRes = await request(`/admin/properties/${createdPropId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ reason: '' })
  });
  assert(emptyReasonRejectRes.status === 400, 'POST /admin/properties/{id}/reject with empty reason rejected with HTTP 400 Bad Request');

  // Admin approves the listing
  const approveRes = await request(`/admin/properties/${createdPropId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(approveRes.status === 200, 'POST /admin/properties/{id}/approve succeeded');

  // Verify property is now publicly discoverable and status is PUBLISHED
  const publicPropCheck = await request(`/properties/${createdPropId}`);
  assert(publicPropCheck.status === 200, 'Newly approved property is now publicly accessible');
  assert(publicPropCheck.data.data.status === 'PUBLISHED', 'Public status is PUBLISHED');

  // TEST 10: Admin Dashboard Analytics & Audit Logs
  console.log('\n--- TEST 10: Admin Dashboard KPIs & Audit Logging ---');
  const adminStatsRes = await request('/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminStatsRes.status === 200, 'GET /admin/dashboard returned HTTP 200');
  assert(adminStatsRes.data.data.totalProperties > 0, 'Admin metrics report totalProperties > 0');
  assert(adminStatsRes.data.data.totalUsers > 0, 'Admin metrics report totalUsers > 0');

  const auditRes = await request('/admin/audit-logs?page=0&size=10', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(auditRes.status === 200, 'GET /admin/audit-logs returned HTTP 200');
  assert(auditRes.data.data.content.length > 0, 'Audit logs recorded platform activities');
  const recentAudit = auditRes.data.data.content.find(a => a.entityId === createdPropId);
  assert(recentAudit !== undefined, 'Audit log contains record for approved property');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} END-TO-END WORKFLOW TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runTestSuite().catch(err => {
  console.error('\n❌ WORKFLOW TEST SUITE FAILED:', err);
  process.exit(1);
});
