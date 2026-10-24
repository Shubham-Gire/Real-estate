-- EstateHub Schema Migration V1
-- Normalized schema for production property marketplace

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    phone VARCHAR(25),
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(512),
    agency_name VARCHAR(150),
    license_number VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ROLE_USER', 'ROLE_AGENT', 'ROLE_ADMIN')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'))
);

-- 2. PROPERTY CATEGORIES TABLE
CREATE TABLE property_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_property_categories_name UNIQUE (name),
    CONSTRAINT uq_property_categories_slug UNIQUE (slug)
);

-- 3. AMENITIES TABLE
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    icon VARCHAR(50),
    CONSTRAINT uq_amenities_name UNIQUE (name)
);

-- 4. PROPERTIES TABLE
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES property_categories(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    property_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    price NUMERIC(14,2) NOT NULL,
    deposit NUMERIC(14,2) DEFAULT 0,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(120) NOT NULL,
    postal_code VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    bedrooms INT NOT NULL DEFAULT 0,
    bathrooms INT NOT NULL DEFAULT 0,
    built_up_sqft NUMERIC(10,2),
    carpet_sqft NUMERIC(10,2),
    floor_number INT,
    total_floors INT,
    furnishing_status VARCHAR(30) DEFAULT 'UNFURNISHED',
    parking_available BOOLEAN DEFAULT FALSE,
    availability_date DATE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count BIGINT NOT NULL DEFAULT 0,
    rejection_reason TEXT,
    moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_properties_price CHECK (price >= 0),
    CONSTRAINT chk_properties_deposit CHECK (deposit >= 0),
    CONSTRAINT chk_properties_bedrooms CHECK (bedrooms >= 0),
    CONSTRAINT chk_properties_bathrooms CHECK (bathrooms >= 0),
    CONSTRAINT chk_properties_transaction_type CHECK (transaction_type IN ('SALE', 'RENT')),
    CONSTRAINT chk_properties_status CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'SUSPENDED', 'SOLD', 'RENTED', 'ARCHIVED'))
);

-- 5. PROPERTY IMAGES TABLE
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    storage_key VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. PROPERTY AMENITIES JUNCTION TABLE
CREATE TABLE property_amenities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 7. FAVORITES TABLE
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_favorite UNIQUE (user_id, property_id)
);

-- 8. INQUIRIES TABLE
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(25),
    message TEXT NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inquiries_status CHECK (status IN ('NEW', 'CONTACTED', 'RESOLVED', 'CLOSED'))
);

-- 9. PROPERTY REPORTS TABLE
CREATE TABLE property_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_reports_status CHECK (status IN ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'))
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    link_url VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(180),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_category_id ON properties(category_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_is_featured ON properties(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_search ON properties(status, transaction_type, city, price) WHERE status = 'PUBLISHED';

CREATE INDEX idx_property_images_property ON property_images(property_id, display_order ASC);
CREATE INDEX idx_property_images_is_primary ON property_images(property_id, is_primary) WHERE is_primary = TRUE;

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);

CREATE INDEX idx_inquiries_recipient ON inquiries(recipient_id, created_at DESC);
CREATE INDEX idx_inquiries_sender ON inquiries(sender_id, created_at DESC);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
