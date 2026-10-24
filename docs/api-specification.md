# EstateHub - REST API Specification

## 1. Base URL & Protocol Standards
- **Base URL**: `/api/v1`
- **Protocol**: HTTPS / RESTful JSON
- **Authentication**: Bearer JWT in `Authorization` header (`Authorization: Bearer <token>`)

## 2. Standard Error Response Contract
All error responses adhere strictly to the following unified schema:

```json
{
  "timestamp": "2026-10-25T01:30:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Input validation failed. Please check field errors.",
  "fieldErrors": {
    "price": "Price must be positive and non-zero",
    "city": "City is mandatory"
  },
  "path": "/api/v1/properties"
}
```

## 3. Endpoints Matrix

### 3.1. Authentication & Account (`/api/v1/auth`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a new user (`ROLE_USER` or `ROLE_AGENT`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user, returns JWT and user profile |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user profile and authorities |
| `PUT` | `/api/v1/auth/profile` | Authenticated | Update user profile details (first name, phone, agency, etc.) |
| `POST` | `/api/v1/auth/change-password` | Authenticated | Change account password |

#### Request / Response Samples:
`POST /api/v1/auth/register`
```json
// Request
{
  "email": "agent.smith@example.com",
  "password": "SecurePassword123!",
  "firstName": "Smith",
  "lastName": "Agent",
  "phone": "+1-555-0199",
  "role": "ROLE_AGENT",
  "agencyName": "Metro Prime Realty",
  "licenseNumber": "RE-889911"
}
// Response (201 Created)
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "c2b64d4a-3fb7-4b71-9457-3a1b0d2d3e91",
    "email": "agent.smith@example.com",
    "firstName": "Smith",
    "lastName": "Agent",
    "role": "ROLE_AGENT",
    "status": "ACTIVE"
  }
}
```

---

### 3.2. Public Properties Catalog (`/api/v1/properties`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `GET` | `/api/v1/properties` | Public | Search/filter/sort published listings with pagination |
| `GET` | `/api/v1/properties/{id}` | Public | Detailed property view (increments view count) |
| `GET` | `/api/v1/properties/featured` | Public | Retrieve curated featured properties for homepage |
| `GET` | `/api/v1/properties/recent` | Public | Retrieve latest published listings |
| `GET` | `/api/v1/properties/locations` | Public | Distinct active cities and locality counts |
| `GET` | `/api/v1/properties/categories` | Public | Available property categories with listing counts |
| `GET` | `/api/v1/properties/amenities` | Public | Available property amenities grouped by category |

#### Query Parameters for `GET /api/v1/properties`:
- `query` (string): Free-text search matching title, locality, description
- `city` (string): Exact city match (case-insensitive)
- `locality` (string): Locality prefix/match
- `transactionType` (enum): `SALE`, `RENT`
- `propertyType` (enum): `APARTMENT`, `HOUSE`, `VILLA`, `PLOT`, etc.
- `categoryId` (UUID): Specific category filter
- `minPrice`, `maxPrice` (number): Price boundary
- `bedrooms` (integer): Minimum bedrooms
- `bathrooms` (integer): Minimum bathrooms
- `furnishingStatus` (enum): `UNFURNISHED`, `SEMI_FURNISHED`, `FULLY_FURNISHED`
- `amenityIds` (UUID list): Amenities filter
- `page` (integer, default: 0): Page number
- `size` (integer, default: 12, max: 50): Items per page
- `sort` (string, default: `createdAt,desc`): e.g., `price,asc`, `price,desc`, `createdAt,desc`

---

### 3.3. Property Management (Owner & Agent)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `POST` | `/api/v1/properties` | User/Agent/Admin | Create new property listing (defaults to `PENDING_REVIEW` or `DRAFT`) |
| `PUT` | `/api/v1/properties/{id}` | Owner/Admin | Update existing property details (re-triggers review if published) |
| `PATCH` | `/api/v1/properties/{id}/status` | Owner/Admin | Transition status (`SOLD`, `RENTED`, `ARCHIVED`, `PENDING_REVIEW`) |
| `DELETE` | `/api/v1/properties/{id}` | Owner/Admin | Delete/Archive property |
| `GET` | `/api/v1/users/me/properties` | Authenticated | Retrieve caller's owned properties across all statuses |
| `POST` | `/api/v1/properties/{id}/images` | Owner/Admin | Upload multi-part image(s) for property |
| `DELETE` | `/api/v1/properties/{id}/images/{imageId}` | Owner/Admin | Remove an uploaded property photo |
| `PUT` | `/api/v1/properties/{id}/images/primary/{imageId}` | Owner/Admin | Set an image as primary thumbnail |

---

### 3.4. Favorites (`/api/v1/favorites`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `GET` | `/api/v1/favorites` | Authenticated | List current user's saved properties |
| `POST` | `/api/v1/favorites/{propertyId}` | Authenticated | Save property to user favorites |
| `DELETE` | `/api/v1/favorites/{propertyId}` | Authenticated | Remove property from user favorites |
| `GET` | `/api/v1/favorites/ids` | Authenticated | Quick list of favorited property UUIDs for UI badges |

---

### 3.5. Inquiries & Leads (`/api/v1/inquiries`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `POST` | `/api/v1/inquiries` | Public/Auth | Submit an inquiry/tour request on a property |
| `GET` | `/api/v1/inquiries/sent` | Authenticated | List inquiries sent by the current user |
| `GET` | `/api/v1/inquiries/received` | Authenticated | List inquiries received by owner/agent for their properties |
| `PATCH` | `/api/v1/inquiries/{id}/status` | Recipient/Admin | Update inquiry workflow status (`NEW`, `CONTACTED`, `RESOLVED`, `CLOSED`) |
| `PUT` | `/api/v1/inquiries/{id}/notes` | Recipient/Admin | Save internal notes on a lead |

---

### 3.6. Property Reports (`/api/v1/reports`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `POST` | `/api/v1/reports` | Authenticated | Report an inaccurate/fraudulent listing |
| `GET` | `/api/v1/reports/me` | Authenticated | Track user-submitted reports |

---

### 3.7. Administration & Moderation (`/api/v1/admin`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin Only | Real aggregated statistics & KPI metrics |
| `GET` | `/api/v1/admin/properties` | Admin Only | Moderation view of all listings (filter by `PENDING_REVIEW`, etc.) |
| `POST` | `/api/v1/admin/properties/{id}/approve` | Admin Only | Approve listing -> transitions to `PUBLISHED` |
| `POST` | `/api/v1/admin/properties/{id}/reject` | Admin Only | Reject listing with mandatory reason |
| `POST` | `/api/v1/admin/properties/{id}/suspend` | Admin Only | Suspend active listing |
| `POST` | `/api/v1/admin/properties/{id}/restore` | Admin Only | Restore suspended listing |
| `GET` | `/api/v1/admin/users` | Admin Only | Paginated search of platform users |
| `PATCH` | `/api/v1/admin/users/{id}/status` | Admin Only | Toggle user status (`ACTIVE` vs `SUSPENDED`) |
| `PATCH` | `/api/v1/admin/users/{id}/role` | Admin Only | Update user role (prevents demoting last admin) |
| `GET` | `/api/v1/admin/reports` | Admin Only | Review reported listings |
| `PATCH` | `/api/v1/admin/reports/{id}/resolve` | Admin Only | Resolve or dismiss property report |
| `GET` | `/api/v1/admin/audit-logs` | Admin Only | Query immutable system audit logs |
| `GET` | `/api/v1/admin/analytics/charts` | Admin Only | Registration & publication trends data |

---

### 3.8. Notifications (`/api/v1/notifications`)

| Method | Endpoint | Access | Summary |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | Authenticated | List recent notifications for logged in user |
| `PATCH` | `/api/v1/notifications/{id}/read` | Authenticated | Mark notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | Authenticated | Mark all notifications as read |
| `GET` | `/api/v1/notifications/unread-count`| Authenticated | Unread count for UI badge |
