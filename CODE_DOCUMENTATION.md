# Gym Website - Complete Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Models & Relationships](#database-models--relationships)
5. [Authentication System](#authentication-system)
6. [Payment System Integration](#payment-system-integration)
7. [API Routes Documentation](#api-routes-documentation)
8. [Frontend Components](#frontend-components)
9. [Admin Dashboard](#admin-dashboard)
10. [Data Flow Architecture](#data-flow-architecture)
11. [Security Implementation](#security-implementation)
12. [File-by-File Breakdown](#file-by-file-breakdown)

---

## Project Overview

This is a full-stack gym management website built with Next.js 15, featuring user authentication, membership subscriptions, payment processing via eSewa (Nepal's payment gateway), and comprehensive admin dashboard functionality.

### Key Features:
- User registration and authentication (credentials + Google OAuth)
- Membership plan management and subscription
- eSewa payment gateway integration
- Role-based access control (user/admin)
- Admin dashboard with user management, payment monitoring, and statistics
- Responsive design with TailwindCSS
- Image storage via Cloudinary
- Email notifications system

---

## Technology Stack

### Frontend:
- **Next.js 15** - React framework with App Router
- **React 19** - Component library
- **TailwindCSS 4** - CSS framework
- **NextAuth.js 4.24** - Authentication library

### Backend:
- **Next.js API Routes** - Serverless functions
- **MongoDB Atlas** - NoSQL database
- **Mongoose 8.18** - MongoDB ODM

### Third-Party Services:
- **eSewa** - Payment gateway (Nepal)
- **Cloudinary** - Image storage and CDN
- **Nodemailer** - Email service (Gmail SMTP)
- **bcryptjs** - Password hashing

---

## Project Structure

```
gym-website/
├── public/                     # Static assets (images, SVGs)
├── scripts/                    # Database seeding scripts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── (page)/            # Public pages
│   │   │   ├── AboutUs/      # About page
│   │   │   ├── ContactUs/    # Contact page
│   │   │   ├── Form/         # Contact form
│   │   │   ├── Membership-Plans/ # Plans display
│   │   │   └── Reviews/      # Reviews page
│   │   ├── api/               # Backend API routes
│   │   ├── dashboard/         # User/Admin dashboards
│   │   ├── checkout/          # Payment checkout
│   │   ├── forgot-password/   # Password recovery
│   │   ├── payment-*/         # Payment result pages
│   │   ├── reset-password/    # Password reset
│   │   ├── globals.css        # Global styles
│   │   ├── layout.jsx         # Root layout
│   │   └── page.jsx           # Home page
│   ├── components/            # Reusable React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── DashboardNav.jsx  # Dashboard navigation
│   │   ├── Footer.jsx        # Site footer
│   │   ├── LogoutButton.jsx  # Logout functionality
│   │   ├── MembershipCard.jsx # Plan display card
│   │   ├── Navbar.jsx        # Main navigation
│   │   ├── PracticeCRUD.jsx  # CRUD operations
│   │   └── ServiceCards.jsx  # Service display cards
│   ├── lib/                  # Utility functions
│   │   ├── auth.js           # NextAuth configuration
│   │   ├── cloudinary-*.js   # Image upload utilities
│   │   ├── cron.js           # Scheduled tasks
│   │   ├── email.js          # Email sending functions
│   │   ├── mongodb.js        # Database connection
│   │   └── review.js         # Review utilities
│   ├── models/               # MongoDB schemas
│   │   ├── ContactUs.js      # Contact form schema
│   │   ├── PasswordReset.js  # Password reset tokens
│   │   ├── Payment.js        # Payment records
│   │   ├── Review.js         # User reviews
│   │   ├── Subscription.js    # Membership plans
│   │   ├── Trainer.js        # Trainer information
│   │   ├── User.js           # User accounts
│   │   └── UserSubscription.js # Active subscriptions
│   └── providers/            # React context providers
│       └── SessionProvider.jsx # NextAuth session provider
├── .gitignore                # Git ignore rules
├── eslint.config.mjs        # ESLint configuration
├── next.config.js/mjs       # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## Database Models & Relationships

### 1. User Model (`src/models/User.js`)
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Hashed password (bcrypt)
  role: String,          // 'user' or 'admin'
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last update date
}
```

### 2. Subscription Model (`src/models/Subscription.js`)
```javascript
{
  name: String,           // Plan name (e.g., "Basic", "Premium")
  price: Number,          // Monthly price in NPR
  duration: Number,       // Duration in months
  features: [String],     // Array of plan features
  includesCardio: Boolean, // Cardio equipment access
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Payment Model (`src/models/Payment.js`)
```javascript
{
  userId: ObjectId,       // Reference to User
  subscriptionId: ObjectId, // Reference to Subscription
  amount: Number,         // Payment amount
  transactionId: String,  // Unique transaction UUID
  refId: String,         // eSewa reference ID
  status: String,        // 'pending', 'success', 'failed'
  createdAt: Date
}
```

### 4. UserSubscription Model (`src/models/UserSubscription.js`)
```javascript
{
  userId: ObjectId,       // Reference to User
  plan: String,          // Plan name
  amount: Number,        // Paid amount
  transactionId: String, // Payment transaction ID
  status: String,        // 'active', 'expired'
  startDate: Date,       // Subscription start date
  endDate: Date,         // Subscription end date
  createdAt: Date
}
```

### 5. Supporting Models
- **ContactUs.js**: Contact form submissions
- **Review.js**: User reviews and ratings
- **Trainer.js**: Trainer profiles with images
- **PasswordReset.js**: Password reset tokens

### Model Relationships
```
User (1) → (many) Payment
User (1) → (many) UserSubscription
Subscription (1) → (many) Payment
Payment (1) → (1) UserSubscription (via transactionId)
```

---

## Authentication System

### NextAuth.js Configuration (`src/lib/auth.js`)

The authentication system uses NextAuth.js with multiple providers:

#### 1. Credentials Provider
```javascript
// Validates user credentials against MongoDB
// Uses bcrypt for password verification
// Returns user object with role for authorization
```

#### 2. Google OAuth Provider
```javascript
// Allows Google account login
// Automatically creates/updates user in database
// Sets default role as 'user'
```

#### 3. JWT Strategy
```javascript
// Custom JWT callbacks include user role
// Session callbacks provide user data to components
// Token expiration set to 30 days
```

### Authentication Flow

#### Registration Process:
1. **Frontend**: User fills registration form (`/register`)
2. **API Route**: `/api/register` validates and processes data
3. **Password Hashing**: bcrypt with 10 salt rounds
4. **Database**: User stored with role='user'
5. **Redirect**: User sent to login page

#### Login Process:
1. **Frontend**: User submits credentials (`/login`)
2. **NextAuth**: Credentials provider validates against database
3. **JWT Generation**: Token created with user role and data
4. **Session Storage**: HTTP-only cookie stores session
5. **Role-based Redirect**: 
   - Admin users → `/dashboard/admin`
   - Regular users → `/dashboard/user`

#### Authorization Checks:
```javascript
// Server-side (API routes)
const session = await getServerSession(authOptions);
if (!session || session.user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Client-side (components)
const { data: session } = useSession();
if (session?.user?.role === "admin") {
  // Show admin features
}
```

---

## Payment System Integration

### eSewa Payment Gateway Integration

The payment system integrates with eSewa, Nepal's popular payment gateway:

#### Payment Flow Architecture:

1. **Plan Selection** (`/Membership-Plans`)
   - User selects membership plan
   - Frontend generates unique transaction UUID
   - Plan details stored in session state

2. **Payment Storage** (`/api/payment/store`)
   ```javascript
   // Creates pending payment record
   // Stores: userId, subscriptionId, amount, transactionId
   // Status: 'pending'
   ```

3. **Signature Generation** (`/api/esewa/sign`)
   ```javascript
   // Generates HMAC-SHA256 signature for eSewa
   // Prevents payment tampering
   // Includes: amount, transactionId, secret key
   ```

4. **eSewa Redirect**
   - User redirected to eSewa payment page
   - Payment parameters passed via URL
   - Signature ensures security

5. **Payment Verification** (`/api/esewa/verify`)
   ```javascript
   // eSewa calls this endpoint after payment
   // Verifies payment status and signature
   // Updates payment record to 'success'/'failed'
   // Creates UserSubscription if successful
   ```

6. **Subscription Activation**
   ```javascript
   // Creates active subscription record
   // Sets start/end dates based on plan duration
   // Sends confirmation email to user
   ```

#### Payment Security Features:
- **Cryptographic Signatures**: HMAC-SHA256 prevents tampering
- **Transaction UUIDs**: Unique identifiers prevent replay attacks
- **Server-side Verification**: All payment changes verified server-side
- **Status Tracking**: Complete payment lifecycle monitoring

---

## API Routes Documentation

### Authentication Routes

#### `/api/auth/[...nextauth]`
- **Method**: All HTTP methods
- **Purpose**: NextAuth.js handler for authentication
- **Features**: Login, logout, session management, JWT handling

#### `/api/register`
- **Method**: POST
- **Purpose**: User registration
- **Body**: `{ name, email, password }`
- **Process**: Validation → Hashing → Database storage → Response

#### `/api/login`
- **Method**: POST
- **Purpose**: User login (handled by NextAuth)
- **Features**: Credential validation, session creation

### Subscription Routes

#### `/api/subscription`
- **GET**: Fetch all available membership plans
- **POST**: Create new membership plan (admin only)
- **Body**: `{ name, price, duration, features, includesCardio }`

#### `/api/admin/subscriptions`
- **GET**: Fetch subscriptions with pagination (admin)
- **POST**: Create subscription (admin)
- **PUT**: Update subscription (admin)
- **DELETE**: Delete subscription (admin)

#### `/api/admin/subscriptions/[id]`
- **GET**: Fetch specific subscription
- **PUT**: Update specific subscription
- **DELETE**: Delete specific subscription

### Payment Routes

#### `/api/payment/store`
- **Method**: POST
- **Purpose**: Store pending payment before eSewa redirect
- **Body**: `{ userId, subscriptionId, amount, transactionId }`

#### `/api/esewa/sign`
- **Method**: POST
- **Purpose**: Generate eSewa payment signature
- **Body**: `{ amount, transactionId }`
- **Returns**: `{ signature }`

#### `/api/esewa/verify`
- **Method**: POST
- **Purpose**: Verify eSewa payment and activate subscription
- **Body**: eSewa payment response data
- **Process**: Verification → Payment update → Subscription creation

### Admin Routes

#### `/api/admin/stats`
- **Method**: GET
- **Purpose**: Dashboard statistics
- **Returns**: `{ totalUsers, activeSubscriptions, totalRevenue, recentPayments }`

#### `/api/admin/users`
- **GET**: Fetch users with search and pagination
- **POST**: Create new user
- **PUT**: Update user
- **DELETE**: Delete user

#### `/api/admin/users/[id]`
- **GET**: Fetch specific user
- **PUT**: Update specific user
- **DELETE**: Delete specific user

#### `/api/admin/payments`
- **GET**: Fetch payment history with filters
- **Features**: Status filtering, date range, pagination

#### `/api/admin/setup`
- **Method**: POST
- **Purpose**: Initialize admin account
- **Features**: Create first admin user

### Utility Routes

#### `/api/contact`
- **Method**: POST
- **Purpose**: Handle contact form submissions
- **Features**: Email notification, database storage

#### `/api/reviews`
- **GET**: Fetch all reviews
- **POST**: Create new review
- **Features**: Rating system, user association

#### `/api/trainers`
- **GET**: Fetch trainer information
- **POST**: Add new trainer (admin)
- **Features**: Image upload via Cloudinary

#### `/api/upload`
- **Method**: POST
- **Purpose**: Image upload to Cloudinary
- **Features**: Trainer photos, profile pictures

---

## Frontend Components

### Layout Components

#### `src/app/layout.jsx` (Root Layout)
```javascript
// Wraps entire application with SessionProvider
// Includes Navbar and Footer components
// Provides global styling and metadata
```

#### `src/app/dashboard/layout.jsx` (Dashboard Layout)
```javascript
// Dashboard-specific layout with DashboardNav
// Role-based content rendering
// Authentication checks
```

### Navigation Components

#### `components/Navbar.jsx`
```javascript
// Responsive navigation bar
// Dynamic auth state display
// Login/logout functionality
// Mobile menu support
```

#### `components/DashboardNav.jsx`
```javascript
// Dashboard sidebar navigation
// Role-based menu items
// Active page highlighting
// User profile section
```

### Page Components

#### Authentication Pages
- **`src/app/(auth)/login/page.jsx`**: Login form with NextAuth integration
- **`src/app/(auth)/register/page.jsx`**: Registration form with validation

#### Public Pages
- **`src/app/(page)/AboutUs/page.jsx`**: About the gym information
- **`src/app/(page)/ContactUs/page.jsx`**: Contact form and information
- **`src/app/(page)/Membership-Plans/page.jsx`**: Available membership plans
- **`src/app/(page)/Reviews/page.jsx`**: Customer reviews display

#### Dashboard Pages
- **`src/app/dashboard/admin/page.jsx`**: Admin dashboard overview
- **`src/app/dashboard/user/page.jsx`**: User dashboard profile
- **Payment pages**: Checkout, success, failure handling

### Functional Components

#### `components/MembershipCard.jsx`
```javascript
// Displays individual membership plan
// Features list and pricing
- // "Subscribe" button with payment flow
```

#### `components/LogoutButton.jsx`
```javascript
// NextAuth signOut functionality
// Session cleanup
// Redirect to home page
```

#### `components/Footer.jsx`
```javascript
// Site footer with links
// Contact information
// Social media links
```

### Admin Components

#### `components/admin/UserModal.jsx`
```javascript
// User CRUD operations modal
// Form validation
// Role assignment
```

#### `components/admin/SubscriptionModal.jsx`
```javascript
// Subscription plan management
- // Price and feature editing
// Plan creation/deletion
```

#### `components/PracticeCRUD.jsx`
```javascript
// Generic CRUD operations
// Search and sort functionality
// Pagination support
```

---

## Admin Dashboard

### Dashboard Features

#### 1. Statistics Overview (`/dashboard/admin`)
```javascript
// Real-time statistics display
// Total users count
// Active subscriptions
// Total revenue calculation
// Recent payment activity
```

#### 2. User Management (`/dashboard/admin/users`)
```javascript
// Complete user CRUD operations
// Search by name/email
// Sort by registration date/role
// Role assignment (user/admin)
// Account status management
```

#### 3. Subscription Management (`/dashboard/admin/subscriptions`)
```javascript
// Membership plan creation/editing
// Price adjustment
// Feature management
// Plan deletion with safety checks
```

#### 4. Payment Monitoring (`/dashboard/admin/payments`)
```javascript
// Transaction history display
// Payment status tracking
// Date range filtering
// Revenue analytics
// Export functionality
```

#### 5. Trainer Management (`/dashboard/admin/trainers`)
```javascript
// Trainer profile management
// Image upload via Cloudinary
// Specialization and bio editing
```

### Admin Authorization

#### Server-side Protection:
```javascript
// All admin API routes include role checks
const session = await getServerSession(authOptions);
if (!session || session.user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

#### Client-side Protection:
```javascript
// Admin components check user role
const { data: session } = useSession();
if (session?.user?.role !== "admin") {
  redirect("/dashboard/user");
}
```

### Data Management Features

#### Search Functionality:
```javascript
// Multi-field text search
// Real-time filtering
// Case-insensitive matching
// Debounced search input
```

#### Sorting Algorithms:
```javascript
// Merge sort for large datasets
// Quick sort for smaller arrays
// Client-side and server-side sorting
// Column header click sorting
```

#### Pagination:
```javascript
// Efficient data loading
// Configurable page sizes
// Navigation controls
// Total count display
```

---

## Data Flow Architecture

### Request-Response Flow

```
User Action
    ↓
Frontend Component (React)
    ↓
API Route (Next.js)
    ↓
Business Logic (JavaScript)
    ↓
Database Query (Mongoose)
    ↓
MongoDB Atlas
    ↓
Response Processing
    ↓
Frontend Update (React State)
```

### Key Data Flows

#### 1. User Registration Flow
```
Registration Form
    ↓
/api/register (POST)
    ↓
Input Validation
    ↓
Password Hashing (bcrypt)
    ↓
MongoDB User Creation
    ↓
Success Response
    ↓
Login Page Redirect
```

#### 2. Payment Processing Flow
```
Plan Selection
    ↓
Transaction UUID Generation
    ↓
/api/payment/store (POST)
    ↓
Pending Payment Record
    ↓
/api/esewa/sign (POST)
    ↓
HMAC Signature Generation
    ↓
eSewa Payment Gateway
    ↓
/api/esewa/verify (POST)
    ↓
Payment Verification
    ↓
Subscription Activation
    ↓
Email Notification
```

#### 3. Admin Dashboard Data Flow
```
Dashboard Load
    ↓
Authentication Check
    ↓
Multiple API Calls (parallel)
    ↓
Data Aggregation
    ↓
Component Rendering
    ↓
Real-time Updates
```

### External Service Integration

#### eSewa Payment Gateway:
```javascript
// HMAC-SHA256 signature generation
// Secure parameter transmission
// Server-side verification
// Status callback handling
```

#### Cloudinary Image Storage:
```javascript
// Image upload and optimization
// CDN delivery
// Transformation capabilities
// Secure URL generation
```

#### Email Service (Nodemailer):
```javascript
// Gmail SMTP integration
// Template-based emails
// Payment confirmations
// Password reset notifications
```

---

## Security Implementation

### Authentication Security

#### Password Security:
```javascript
// bcrypt hashing with 10 salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification
const isValid = await bcrypt.compare(password, user.password);
```

#### Session Security:
```javascript
// HTTP-only session cookies
// JWT token expiration (30 days)
// Secure cookie settings in production
// CSRF protection via SameSite policy
```

#### Role-based Access Control:
```javascript
// Server-side role verification
if (session.user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Client-side role checks
const { data: session } = useSession();
const isAdmin = session?.user?.role === "admin";
```

### Payment Security

#### Cryptographic Security:
```javascript
// HMAC-SHA256 signature generation
const signature = crypto
  .createHmac("sha256", secretKey)
  .update(signatureString)
  .digest("base64");
```

#### Transaction Security:
```javascript
// Unique transaction UUIDs
const transactionId = uuidv4();

// Server-side payment verification
// Status tracking prevents duplicate processing
// Amount validation prevents tampering
```

### Data Security

#### Input Validation:
```javascript
// API route input sanitization
const { name, email, password } = await req.json();

// Schema validation with Mongoose
// Required field enforcement
// Type checking and conversion
```

#### Database Security:
```javascript
// MongoDB connection with authentication
// Environment variable protection
// Error handling without data exposure
// Query injection prevention
```

#### Environment Security:
```javascript
// .env file for sensitive data
// Database credentials
// API keys and secrets
// Email configuration
```

---

## File-by-File Breakdown

### Configuration Files

#### `package.json`
```javascript
// Dependencies management
// Script definitions
// Project metadata
// Next.js 15, React 19, TailwindCSS 4
```

#### `next.config.js`
```javascript
// Next.js configuration
// Environment variables
// Image optimization settings
// Experimental features
```

#### `eslint.config.mjs`
```javascript
// Code linting rules
// React and Next.js specific rules
// JavaScript standards enforcement
```

### Database Connection

#### `src/lib/mongodb.js`
```javascript
// MongoDB Atlas connection
// Connection pooling
// Error handling
// Environment-based configuration
```

### Authentication Configuration

#### `src/lib/auth.js`
```javascript
// NextAuth.js complete configuration
// Multiple providers (credentials, Google)
// JWT strategy implementation
// Custom session callbacks
// Role-based authorization
```

#### `src/providers/SessionProvider.jsx`
```javascript
// React context provider for NextAuth
// Session state management
// Component wrapping for auth access
```

### Database Models

#### `src/models/User.js`
```javascript
// User schema definition
// Password hashing middleware
// Role validation
// Email uniqueness enforcement
```

#### `src/models/Subscription.js`
```javascript
// Membership plan schema
// Price and duration validation
// Features array structure
// Cardio equipment boolean
```

#### `src/models/Payment.js`
```javascript
// Payment transaction schema
// User and subscription references
// Status enumeration
// Transaction ID uniqueness
```

#### `src/models/UserSubscription.js`
```javascript
// Active subscription schema
// Date calculations for duration
// Status management
// User association
```

### API Routes

#### `src/app/api/auth/[...nextauth]/route.js`
```javascript
// NextAuth.js API handler
// All authentication endpoints
// Session management
// Provider configurations
```

#### `src/app/api/register/route.js`
```javascript
// User registration endpoint
// Input validation
// Password hashing
// Database creation
// Error handling
```

#### `src/app/api/payment/store/route.js`
```javascript
// Pending payment storage
// Transaction ID generation
// User authentication check
// Payment record creation
```

#### `src/app/api/esewa/sign/route.js`
```javascript
// eSewa signature generation
// HMAC-SHA256 implementation
// Security parameter assembly
// Cryptographic signing
```

#### `src/app/api/esewa/verify/route.js`
```javascript
// Payment verification endpoint
// eSewa response validation
// Signature verification
// Subscription activation
// Email notification trigger
```

#### `src/app/api/admin/stats/route.js`
```javascript
// Dashboard statistics
// User count aggregation
// Revenue calculations
// Subscription analytics
// Recent activity data
```

### Frontend Pages

#### `src/app/page.jsx` (Home)
```javascript
// Landing page component
// Hero section
// Service cards display
// Membership preview
// Navigation to registration
```

#### `src/app/(auth)/login/page.jsx`
```javascript
// Login form implementation
// NextAuth signIn integration
// Error handling and display
// Redirect after successful login
```

#### `src/app/(auth)/register/page.jsx`
```javascript
// Registration form
// Client-side validation
// Password strength indicators
// API integration
// Success/error messaging
```

#### `src/app/checkout/page.jsx`
```javascript
// Payment checkout page
// Plan summary display
// User information form
// eSewa payment initiation
// Transaction state management
```

#### `src/app/dashboard/admin/page.jsx`
```javascript
// Admin dashboard overview
// Statistics cards
// Recent activity feed
// Quick action buttons
// Navigation to management areas
```

### Components

#### `src/components/Navbar.jsx`
```javascript
// Main navigation component
// Responsive design
// Authentication state display
// Mobile menu functionality
// Role-based menu items
```

#### `src/components/MembershipCard.jsx`
```javascript
// Membership plan display
- // Feature list rendering
// Pricing information
// Subscription button
// Payment flow initiation
```

#### `src/components/admin/UserModal.jsx`
```javascript
// User management modal
// CRUD form implementation
// Input validation
// Role assignment
// API integration
```

### Utility Functions

#### `src/lib/email.js`
```javascript
// Nodemailer configuration
// Gmail SMTP setup
// Email template functions
// Payment confirmation emails
// Password reset emails
```

#### `src/lib/cloudinary.js`
```javascript
// Cloudinary configuration
// Image upload functions
// Transformation utilities
// URL generation
```

#### `src/lib/cron.js`
```javascript
// Scheduled task management
// Subscription expiration checks
// Database cleanup
// Automated notifications
```

### Scripts

#### `scripts/createAdminUser.js`
```javascript
// Admin user creation script
// Command-line utility
// Password generation
// Database initialization
```

#### `scripts/seedSubscriptions.js`
```javascript
// Subscription plan seeding
// Default plan creation
// Database population
// Development setup
```

---

## Conclusion

This gym management website demonstrates a comprehensive full-stack application with:

- **Modern Architecture**: Next.js 15 with App Router, React 19, and TailwindCSS 4
- **Robust Authentication**: Multi-provider auth with role-based access control
- **Secure Payments**: eSewa integration with cryptographic security
- **Scalable Database**: MongoDB with well-structured models and relationships
- **Admin Dashboard**: Complete management interface with real-time statistics
- **Security Best Practices**: Password hashing, JWT tokens, input validation
- **External Integrations**: Cloudinary for images, Nodemailer for emails
- **Responsive Design**: Mobile-first approach with TailwindCSS

The system handles the complete gym management lifecycle from user registration through payment processing to ongoing administration, all while maintaining security and performance standards.

---

## Development Notes

### Environment Setup
1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Set up MongoDB Atlas cluster
4. Configure eSewa payment gateway
5. Set up Cloudinary account for images
6. Configure Gmail SMTP for emails

### Running the Application
- Development: `npm run dev`
- Build: `npm run build`
- Start: `npm start`
- Lint: `npm run lint`

### Database Initialization
- Run admin creation script: `node scripts/createAdminUser.js`
- Seed subscription plans: `node scripts/seedSubscriptions.js`

This documentation provides a complete understanding of the codebase, architecture, and implementation details for future development and maintenance.