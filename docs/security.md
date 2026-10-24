# EstateHub - Security Architecture & Hardening Guide

## 1. Authentication & Token Lifecycle
EstateHub implements stateless JWT (JSON Web Token) authentication using HMAC-SHA256 signing keys.
- **Access Tokens**: Short-to-medium lifespan with strict expiration claims.
- **Storage Strategy**: Tokens are kept in memory and client-side secure store, passed via standard HTTP Bearer header (`Authorization: Bearer <jwt>`).
- **Signature Security**: Tokens are signed using a minimum 256-bit secret key specified via environment variable (`JWT_SECRET`).
- **Password Hashing**: Passwords are encrypted using BCrypt with work factor 12 before persistence.

## 2. Role-Based Access Control (RBAC) & Authorization
- Every protected endpoint requires specific authorities checked at both Spring Security `SecurityFilterChain` and method-level `@PreAuthorize` annotations.
- Roles:
  - `ROLE_USER`: General registered buyers and individual owners.
  - `ROLE_AGENT`: Real estate professionals managing multiple listings and client inquiries.
  - `ROLE_ADMIN`: Platform operators with moderation and audit powers.
- **Resource Ownership Validation**:
  - Ownership is checked on the server inside service logic.
  - Users can only edit or delete properties where `property.owner.id == currentUser.id`, unless the caller is `ROLE_ADMIN`.
  - Inquiries can only be viewed by the inquiry sender or the property owner/recipient.

## 3. Threat Mitigation Matrix

| Vulnerability | Attack Vector | EstateHub Defense |
|---|---|---|
| **SQL Injection** | Malicious input in queries | 100% Parameterized JPA / CriteriaBuilder queries. No raw string SQL concatenation. |
| **XSS** | Script injection via title / description | React automatic JSX escaping + backend sanitization of text inputs. |
| **CSRF** | Cross-site unauthorized request | Stateless Bearer token architecture immune to browser auto-attached credential forgery. |
| **IDOR** | Tampering with UUIDs in request paths | Strict DB-level ownership checking in business layer before executing mutations. |
| **Mass Assignment** | Setting unprivileged fields (e.g. role/status) | Dedicated request DTOs restricting writable fields from clients. |
| **File Upload Exploits** | Executable/malicious image uploads | Strict MIME-type checking, file size bounds (max 10MB), and randomized UUID filenames. |
| **Path Traversal** | Manipulating filename path characters | Discarding client filenames; files are stored strictly by generated UUIDs. |
| **Privilege Escalation** | Self-assigning `ROLE_ADMIN` | Public registration accepts only `ROLE_USER` or `ROLE_AGENT`. `ROLE_ADMIN` can only be bootstrapped or granted by existing Admins. |
| **Admin Lockout** | Demoting or suspending last admin | Backend validation guarantees at least one active Admin exists at all times. |

## 4. Bootstrap Administrator
For local and initial deployment, the administrator account is bootstrapped deterministically through environment variables:
- `ADMIN_EMAIL` (default: `admin@estatehub.com`)
- `ADMIN_PASSWORD` (default: `AdminSecure2026!`)
- `ADMIN_FIRST_NAME` (default: `System`)
- `ADMIN_LAST_NAME` (default: `Administrator`)

The bootstrap process checks for the existence of an administrator user and creates one if missing, ensuring no hardcoded credentials remain active without administrative knowledge.
