# Database Schema - SkillConnect

Skema database lengkap untuk semua 8 modul dengan MySQL + Sequelize.

---

## 📋 Table of Contents

- [Modul 1: User Management](#modul-1-user-management)
- [Modul 2: Service Listing & Search](#modul-2-service-listing--search)
- [Modul 3: Order & Booking System](#modul-3-order--booking-system)
- [Modul 4: Payment Gateway](#modul-4-payment-gateway)
- [Modul 5: Review & Rating System](#modul-5-review--rating-system)
- [Modul 6: Chat & Notification System](#modul-6-chat--notification-system)
- [Modul 7: Admin Dashboard & Analytics](#modul-7-admin-dashboard--analytics)
- [Modul 8: Recommendation & Personalization](#modul-8-recommendation--personalization)
- [Complete Database Schema (Merged)](#complete-database-schema-merged)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Database Indexes](#database-indexes)

---

## Modul 1: User Management

### Table: `users`

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'freelancer', 'admin') DEFAULT 'client',

  -- Profile
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  bio TEXT,

  -- Location
  city VARCHAR(100),
  province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Indonesia',

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at DATETIME,
  last_login_at DATETIME,

  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `user_tokens`

```sql
CREATE TABLE user_tokens (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  type ENUM('email_verification', 'password_reset', 'refresh_token') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `freelancer_profiles`

```sql
CREATE TABLE freelancer_profiles (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,

  -- Professional Info
  title VARCHAR(255), -- e.g., "Senior UI/UX Designer"
  skills JSON, -- ["UI Design", "Figma", "Adobe XD"]
  portfolio_url VARCHAR(255),
  hourly_rate DECIMAL(10, 2),

  -- Experience
  years_of_experience INT DEFAULT 0,
  education TEXT,
  certifications JSON,

  -- Statistics
  total_jobs_completed INT DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,

  -- Availability
  is_available BOOLEAN DEFAULT true,
  working_hours JSON, -- {"monday": "09:00-17:00", ...}

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 2: Service Listing & Search

### Table: `categories`

```sql
CREATE TABLE categories (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255), -- Icon URL or class
  parent_id CHAR(36), -- For subcategories
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `services`

```sql
CREATE TABLE services (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  freelancer_id CHAR(36) NOT NULL,
  category_id CHAR(36) NOT NULL,

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',

  -- Service Details
  delivery_time INT NOT NULL, -- in days
  revision_limit INT DEFAULT 1,

  -- Media
  thumbnail VARCHAR(255),
  images JSON, -- ["url1", "url2", "url3"]
  video_url VARCHAR(255),

  -- Requirements
  requirements TEXT, -- What client needs to provide

  -- Statistics
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,

  -- Status
  status ENUM('draft', 'active', 'paused', 'deleted') DEFAULT 'draft',

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags JSON, -- ["logo", "branding", "minimalist"]

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_rating_average (rating_average),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `service_packages`

```sql
CREATE TABLE service_packages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id CHAR(36) NOT NULL,

  -- Package Type
  type ENUM('basic', 'standard', 'premium') NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  delivery_time INT NOT NULL, -- in days
  revision_limit INT DEFAULT 1,

  -- Features
  features JSON, -- ["2 concepts", "Source file", "Commercial use"]

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_id (service_id),
  UNIQUE KEY unique_service_package (service_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 3: Order & Booking System

### Table: `orders`

```sql
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_number VARCHAR(50) NOT NULL UNIQUE, -- ORD-20250114-ABC123

  -- Parties
  client_id CHAR(36) NOT NULL,
  freelancer_id CHAR(36) NOT NULL,
  service_id CHAR(36) NOT NULL,
  package_id CHAR(36), -- NULL if service has no packages

  -- Order Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT, -- Client's specific requirements

  -- Pricing
  amount DECIMAL(10, 2) NOT NULL, -- Base amount
  platform_fee DECIMAL(10, 2) DEFAULT 0, -- 10% fee
  total_amount DECIMAL(10, 2) NOT NULL, -- amount + platform_fee

  -- Timeline
  delivery_time INT NOT NULL, -- in days
  deadline DATETIME,
  delivered_at DATETIME,
  completed_at DATETIME,
  cancelled_at DATETIME,

  -- Status
  status ENUM(
    'pending',        -- Waiting freelancer acceptance
    'accepted',       -- Freelancer accepted
    'in_progress',    -- Work in progress
    'revision',       -- Client requested revision
    'delivered',      -- Freelancer delivered work
    'completed',      -- Client accepted, order done
    'cancelled',      -- Cancelled by client/freelancer
    'disputed'        -- Dispute/problem
  ) DEFAULT 'pending',

  -- Cancellation
  cancelled_by CHAR(36), -- user_id who cancelled
  cancellation_reason TEXT,

  -- Attachments
  attachments JSON, -- Client's requirement files
  deliverables JSON, -- Freelancer's delivery files

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  FOREIGN KEY (package_id) REFERENCES service_packages(id) ON DELETE SET NULL,
  FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_number (order_number),
  INDEX idx_client_id (client_id),
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_service_id (service_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `order_milestones`

```sql
CREATE TABLE order_milestones (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE,

  status ENUM('pending', 'in_progress', 'completed', 'paid') DEFAULT 'pending',
  completed_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `order_revisions`

```sql
CREATE TABLE order_revisions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL,

  revision_number INT NOT NULL,
  requested_by CHAR(36) NOT NULL, -- client_id
  description TEXT NOT NULL,
  attachments JSON,

  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  completed_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 4: Payment Gateway

### Table: `payments`

```sql
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL, -- Payer (usually client)

  -- Transaction Info
  transaction_id VARCHAR(255) NOT NULL UNIQUE, -- TRX-20250114-ABC123
  external_transaction_id VARCHAR(255), -- From payment gateway

  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  payment_gateway_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Payment Method
  payment_method ENUM(
    'bank_transfer',
    'e_wallet',
    'credit_card',
    'debit_card',
    'qris',
    'virtual_account',
    'retail'
  ) NOT NULL,
  payment_channel VARCHAR(100), -- e.g., "BCA", "GoPay", "OVO"

  -- Payment Gateway
  payment_gateway ENUM('midtrans', 'xendit', 'manual') NOT NULL,
  payment_url TEXT, -- Redirect URL for payment

  -- Status
  status ENUM('pending', 'processing', 'success', 'failed', 'expired', 'refunded') DEFAULT 'pending',

  -- Callback Data
  callback_data JSON, -- Raw webhook data
  callback_signature VARCHAR(500),

  -- Invoice
  invoice_number VARCHAR(50) UNIQUE, -- INV-20250114-ABC123
  invoice_url VARCHAR(255),

  -- Timestamps
  paid_at DATETIME,
  expires_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `payment_methods`

```sql
CREATE TABLE payment_methods (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  type ENUM('bank_account', 'e_wallet', 'credit_card') NOT NULL,
  provider VARCHAR(100) NOT NULL, -- e.g., "BCA", "GoPay", "Visa"

  -- Bank Account
  account_number VARCHAR(50),
  account_holder_name VARCHAR(255),

  -- Card
  card_last_four VARCHAR(4),
  card_expiry VARCHAR(7), -- MM/YYYY

  -- E-Wallet
  phone_number VARCHAR(20),

  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `withdrawals`

```sql
CREATE TABLE withdrawals (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  freelancer_id CHAR(36) NOT NULL,
  payment_method_id CHAR(36) NOT NULL,

  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  admin_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL, -- amount - admin_fee

  -- Status
  status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',

  -- Admin Notes
  processed_by CHAR(36), -- admin_id
  rejection_reason TEXT,

  -- Timestamps
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  completed_at DATETIME,

  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE RESTRICT,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_status (status),
  INDEX idx_requested_at (requested_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 5: Review & Rating System

### Table: `reviews`

```sql
CREATE TABLE reviews (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL UNIQUE, -- One review per order
  service_id CHAR(36) NOT NULL,

  -- Parties
  reviewer_id CHAR(36) NOT NULL, -- Client who gives review
  reviewee_id CHAR(36) NOT NULL, -- Freelancer who receives review

  -- Rating (1-5)
  rating INT NOT NULL,

  -- Detailed Ratings (optional)
  communication_rating INT,
  service_quality_rating INT,
  delivery_time_rating INT,
  professionalism_rating INT,

  -- Review Content
  title VARCHAR(255),
  comment TEXT NOT NULL,

  -- Media
  images JSON, -- Proof of work/result

  -- Response from Freelancer
  response TEXT,
  responded_at DATETIME,

  -- Moderation
  is_approved BOOLEAN DEFAULT true,
  is_reported BOOLEAN DEFAULT false,
  report_reason TEXT,
  moderated_by CHAR(36), -- admin_id
  moderated_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_service_id (service_id),
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_reviewee_id (reviewee_id),
  INDEX idx_rating (rating),
  INDEX idx_is_approved (is_approved),
  INDEX idx_created_at (created_at),

  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `review_helpfulness`

```sql
CREATE TABLE review_helpfulness (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  review_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,

  is_helpful BOOLEAN NOT NULL, -- true = helpful, false = not helpful

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review_user (review_id, user_id),
  INDEX idx_review_id (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 6: Chat & Notification System

### Table: `conversations`

```sql
CREATE TABLE conversations (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

  -- Participants (always 2 users: client & freelancer)
  user1_id CHAR(36) NOT NULL,
  user2_id CHAR(36) NOT NULL,

  -- Related Order (optional)
  order_id CHAR(36),

  -- Last Message
  last_message TEXT,
  last_message_at DATETIME,
  last_message_by CHAR(36),

  -- Status
  is_archived BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  blocked_by CHAR(36),

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (last_message_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (blocked_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_conversation (user1_id, user2_id),
  INDEX idx_user1_id (user1_id),
  INDEX idx_user2_id (user2_id),
  INDEX idx_order_id (order_id),
  INDEX idx_last_message_at (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `messages`

```sql
CREATE TABLE messages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  conversation_id CHAR(36) NOT NULL,
  sender_id CHAR(36) NOT NULL,

  -- Content
  message TEXT NOT NULL,
  type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',

  -- Attachments
  attachments JSON, -- [{"type": "image", "url": "...", "name": "..."}]

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at DATETIME,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `notifications`

```sql
CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  -- Notification Type
  type ENUM(
    'order_created',
    'order_accepted',
    'order_completed',
    'order_cancelled',
    'payment_received',
    'payment_success',
    'new_message',
    'new_review',
    'service_approved',
    'withdrawal_processed',
    'system_announcement'
  ) NOT NULL,

  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Related Entity
  related_id CHAR(36), -- order_id, payment_id, etc.
  related_type VARCHAR(50), -- 'order', 'payment', 'message', etc.

  -- Action URL
  action_url VARCHAR(255), -- Deep link to related page

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at DATETIME,

  -- Channel
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_push BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 7: Admin Dashboard & Analytics

### Table: `admin_logs`

```sql
CREATE TABLE admin_logs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  admin_id CHAR(36) NOT NULL,

  -- Action
  action VARCHAR(100) NOT NULL, -- 'user_banned', 'service_approved', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'user', 'service', 'order', etc.
  entity_id CHAR(36) NOT NULL,

  -- Details
  description TEXT,
  old_value JSON,
  new_value JSON,

  -- Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `reports`

```sql
CREATE TABLE reports (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  reporter_id CHAR(36) NOT NULL,

  -- Reported Entity
  reported_type VARCHAR(50) NOT NULL, -- 'user', 'service', 'review', 'message'
  reported_id CHAR(36) NOT NULL,
  reported_user_id CHAR(36), -- User being reported

  -- Report Details
  reason ENUM(
    'spam',
    'inappropriate_content',
    'scam',
    'harassment',
    'copyright_violation',
    'fake_reviews',
    'other'
  ) NOT NULL,
  description TEXT NOT NULL,
  evidence JSON, -- Screenshots, URLs, etc.

  -- Status
  status ENUM('pending', 'investigating', 'resolved', 'dismissed') DEFAULT 'pending',

  -- Admin Action
  reviewed_by CHAR(36), -- admin_id
  admin_notes TEXT,
  action_taken VARCHAR(255), -- 'banned_user', 'removed_content', etc.
  resolved_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_reporter_id (reporter_id),
  INDEX idx_reported_type_id (reported_type, reported_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `system_settings`

```sql
CREATE TABLE system_settings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',

  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Can be accessed by frontend

  updated_by CHAR(36),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_setting_key (setting_key),
  INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 8: Recommendation & Personalization

### Table: `user_preferences`

```sql
CREATE TABLE user_preferences (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,

  -- Favorite Categories
  favorite_categories JSON, -- ["design", "development"]

  -- Budget Range
  min_budget DECIMAL(10, 2),
  max_budget DECIMAL(10, 2),

  -- Preferred Delivery Time
  preferred_delivery_days INT,

  -- Location Preference
  preferred_freelancer_location VARCHAR(100),

  -- Language
  preferred_language VARCHAR(50) DEFAULT 'id',

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `user_activities`

```sql
CREATE TABLE user_activities (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  -- Activity Type
  activity_type ENUM(
    'view_service',
    'search',
    'add_to_favorite',
    'remove_from_favorite',
    'create_order',
    'contact_freelancer'
  ) NOT NULL,

  -- Related Entity
  service_id CHAR(36),
  category_id CHAR(36),
  freelancer_id CHAR(36),

  -- Search Query
  search_query VARCHAR(255),

  -- Metadata
  metadata JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_service_id (service_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `favorites`

```sql
CREATE TABLE favorites (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  service_id CHAR(36) NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_service (user_id, service_id),
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `service_recommendations`

```sql
CREATE TABLE service_recommendations (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  service_id CHAR(36) NOT NULL,

  -- Recommendation Score (0-100)
  score DECIMAL(5, 2) NOT NULL,

  -- Recommendation Reason
  reason VARCHAR(255), -- "Based on your search history", "Popular in Design"
  algorithm VARCHAR(50), -- 'collaborative_filtering', 'content_based', etc.

  -- Status
  is_shown BOOLEAN DEFAULT false,
  shown_at DATETIME,
  is_clicked BOOLEAN DEFAULT false,
  clicked_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME, -- Recommendation TTL

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id),
  INDEX idx_score (score),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Complete Database Schema (Merged)

### Summary of All Tables

| # | Module | Table Name | Description |
|---|--------|------------|-------------|
| 1 | User | `users` | User accounts (client, freelancer, admin) |
| 2 | User | `user_tokens` | Email verification, password reset tokens |
| 3 | User | `freelancer_profiles` | Extended profile for freelancers |
| 4 | Service | `categories` | Service categories & subcategories |
| 5 | Service | `services` | Services offered by freelancers |
| 6 | Service | `service_packages` | Service pricing tiers (basic/standard/premium) |
| 7 | Order | `orders` | Order/booking records |
| 8 | Order | `order_milestones` | Order milestones for large projects |
| 9 | Order | `order_revisions` | Revision requests from clients |
| 10 | Payment | `payments` | Payment transactions |
| 11 | Payment | `payment_methods` | User's saved payment methods |
| 12 | Payment | `withdrawals` | Freelancer withdrawal requests |
| 13 | Review | `reviews` | Service reviews & ratings |
| 14 | Review | `review_helpfulness` | Helpful/Not helpful votes |
| 15 | Chat | `conversations` | Chat conversations between users |
| 16 | Chat | `messages` | Chat messages |
| 17 | Chat | `notifications` | User notifications |
| 18 | Admin | `admin_logs` | Admin action logs |
| 19 | Admin | `reports` | User reports (spam, scam, etc.) |
| 20 | Admin | `system_settings` | System configuration |
| 21 | Recommendation | `user_preferences` | User preferences for recommendations |
| 22 | Recommendation | `user_activities` | User activity tracking |
| 23 | Recommendation | `favorites` | User's favorite services |
| 24 | Recommendation | `service_recommendations` | Personalized recommendations |

**Total: 24 tables**

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     users       │◄─────────────────────────┐
│   (Main User)   │                          │
└────────┬────────┘                          │
         │                                   │
         │ 1:1                               │
         ↓                                   │
┌──────────────────────┐                     │
│ freelancer_profiles  │                     │
└──────────────────────┘                     │
                                             │
         ┌───────────────────────────────────┤
         │                                   │
         │ 1:N                               │
         ↓                                   │
┌─────────────────┐                          │
│   services      │                          │
│  (Freelancer)   │                          │
└────────┬────────┘                          │
         │                                   │
         │ 1:N                               │
         ↓                                   │
┌──────────────────┐                         │
│ service_packages │                         │
└──────────────────┘                         │
                                             │
         ┌───────────────────────────────────┤
         │                                   │
         │ N:1 (client)                      │
         ↓                                   │
┌─────────────────┐       1:1        ┌──────────────┐
│     orders      │◄─────────────────►│   payments   │
│                 │                   └──────────────┘
└────────┬────────┘
         │
         │ 1:1
         ↓
┌─────────────────┐
│    reviews      │
└─────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│ review_helpfulness   │
└──────────────────────┘

┌─────────────────┐       N:N        ┌──────────────────┐
│     users       │◄─────────────────►│  conversations   │
└────────┬────────┘                   └────────┬─────────┘
         │                                     │
         │                                     │ 1:N
         │                                     ↓
         │                            ┌─────────────────┐
         │                            │    messages     │
         │                            └─────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────┐
│  notifications   │
└──────────────────┘

┌─────────────────┐       N:N        ┌──────────────────┐
│     users       │◄─────────────────►│    favorites     │
└────────┬────────┘                   └──────────────────┘
         │
         │ 1:1
         ↓
┌──────────────────────┐
│  user_preferences    │
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│  user_activities     │
└──────────────────────┘
```

---

## Database Indexes

### Critical Indexes for Performance

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_active ON users(role, is_active);

-- Services (Most queried table)
CREATE INDEX idx_services_category_status ON services(category_id, status);
CREATE INDEX idx_services_freelancer_status ON services(freelancer_id, status);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_rating ON services(rating_average DESC);
CREATE FULLTEXT INDEX idx_services_search ON services(title, description);

-- Orders (Heavy JOIN table)
CREATE INDEX idx_orders_client_status ON orders(client_id, status);
CREATE INDEX idx_orders_freelancer_status ON orders(freelancer_id, status);
CREATE INDEX idx_orders_service ON orders(service_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Payments
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_service_approved ON reviews(service_id, is_approved);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Messages
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- User Activities (For ML recommendations)
CREATE INDEX idx_activities_user_type ON user_activities(user_id, activity_type);
CREATE INDEX idx_activities_service ON user_activities(service_id);
CREATE INDEX idx_activities_created ON user_activities(created_at DESC);
```

---

## Database Size Estimation

Asumsi untuk 1 tahun operasi:

| Table | Rows | Avg Size/Row | Total Size |
|-------|------|--------------|------------|
| users | 100,000 | 2 KB | 200 MB |
| services | 50,000 | 3 KB | 150 MB |
| orders | 500,000 | 2 KB | 1 GB |
| payments | 500,000 | 1.5 KB | 750 MB |
| reviews | 300,000 | 2 KB | 600 MB |
| messages | 5,000,000 | 500 B | 2.5 GB |
| notifications | 2,000,000 | 500 B | 1 GB |
| user_activities | 10,000,000 | 300 B | 3 GB |
| **Others** | - | - | 1 GB |
| **Total** | - | - | **~10 GB** |

**+ Indexes: ~30-40% overhead = 13-14 GB total**

---

## Backup Strategy

```sql
-- Daily Full Backup
mysqldump -u root -p skillconnect > backup_$(date +%Y%m%d).sql

-- Incremental Backup (Binary Logs)
FLUSH LOGS;

-- Point-in-Time Recovery
mysqlbinlog --start-datetime="2025-01-14 10:00:00" \
            --stop-datetime="2025-01-14 11:00:00" \
            binlog.000001 | mysql -u root -p skillconnect
```

---

## Migration Order

**Rekomendasi urutan membuat tables:**

1. ✅ `users` (base table)
2. ✅ `user_tokens`
3. ✅ `freelancer_profiles`
4. ✅ `categories`
5. ✅ `services`
6. ✅ `service_packages`
7. ✅ `orders`
8. ✅ `order_milestones`
9. ✅ `order_revisions`
10. ✅ `payments`
11. ✅ `payment_methods`
12. ✅ `withdrawals`
13. ✅ `reviews`
14. ✅ `review_helpfulness`
15. ✅ `conversations`
16. ✅ `messages`
17. ✅ `notifications`
18. ✅ `admin_logs`
19. ✅ `reports`
20. ✅ `system_settings`
21. ✅ `user_preferences`
22. ✅ `user_activities`
23. ✅ `favorites`
24. ✅ `service_recommendations`

---

**Database Schema Complete! 🎉**

Skema ini sudah mencakup semua 8 modul dengan relationships yang masuk akal dan optimized untuk performa.
