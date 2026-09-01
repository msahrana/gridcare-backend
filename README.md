# ⚡ GridCare — Smart Load Shedding & Power Management System

---

## 📌 Project Overview

**GridCare** is a smart electricity distribution and load-shedding management backend designed to connect electricity customers, power operators, and administrators through a structured digital platform.

The system helps power authorities manage:

- Distribution zones
- Substations
- Feeders
- Service areas
- Planned load shedding
- Unexpected power outages
- Customer outage reports
- Technician assignments
- Power restoration
- Notifications
- Electricity/service payments
- Operational analytics
- Audit logs

The primary objective is to transform traditional power outage management into a **centralized, reliable, and data-driven system**.

---

# 🎯 Problem Statement

In many areas, customers do not have a reliable way to know:

- When electricity will be unavailable
- Why an unexpected outage occurred
- When power is expected to return
- Whether an outage has already been reported
- Which technician is handling the issue
- The history of outages in their area

At the same time, power operators need an organized system for:

- Managing distribution infrastructure
- Creating load-shedding schedules
- Assigning technicians
- Tracking outages
- Managing restoration
- Monitoring service areas
- Generating operational reports

### GridCare Solution

GridCare provides a centralized backend that manages the complete lifecycle:

```text
Power Grid
    │
    ▼
Distribution Zone
    │
    ▼
Substation
    │
    ▼
Feeder
    │
    ▼
Service Area
    │
    ├───────────────┐
    ▼               ▼
Planned Outage   Unexpected Outage
    │               │
    ▼               ▼
Schedule         Customer Report
    │               │
    └───────┬───────┘
            ▼
     Technician Assignment
            │
            ▼
       Investigation
            │
            ▼
          Repair
            │
            ▼
         Restored
```

---

# 👥 Primary Roles

The assignment requires **3 distinct primary roles**.

GridCare implements:

| Role       | Responsibility                                                              |
| ---------- | --------------------------------------------------------------------------- |
| `CUSTOMER` | View power schedules, report outages, make payments, track service requests |
| `OPERATOR` | Manage infrastructure, schedules, outages, technicians, and restoration     |
| `ADMIN`    | Manage users, operators, system configuration, reports, and audit logs      |

---

# 🔐 Role Permissions

## 👤 Customer

Customers can:

- Register
- Login
- Manage their profile
- View their service area
- View load-shedding schedules
- Search outage information
- Report unexpected outages
- Track outage reports
- View outage history
- Make utility/service payments
- View payment history
- Receive notifications

Customers cannot:

- Create official load-shedding schedules
- Assign technicians
- Modify substations
- Manage feeders
- Access admin APIs

---

## 🧑‍🔧 Operator

Operators can:

- Manage distribution zones
- Manage substations
- Manage feeders
- Manage service areas
- Create load-shedding schedules
- Publish schedules
- Update outage status
- Review customer outage reports
- Assign technicians
- Track repair progress
- Restore power
- Create service reports
- View operational analytics

Operators cannot:

- Manage system administrators
- Change administrative roles
- Delete audit history
- Access unrestricted system configuration

---

## 🛡️ Admin

Admins can:

- Manage users
- Manage operators
- Activate/deactivate accounts
- Manage system resources
- View system statistics
- View audit logs
- Manage outage categories
- Monitor payments
- Review operational reports
- Control platform-level settings

---

# ⚡ Core Features

## 🔐 Authentication

- Email/password registration
- Email/password login
- GCP Social Login
- JWT access tokens
- Refresh tokens
- Logout
- Password hashing
- Protected routes
- Role-based authorization
- Bearer token authentication

---

# 🗺️ Power Infrastructure Management

GridCare models the electricity distribution hierarchy:

```text
Zone
 │
 ├── Substation
 │      │
 │      ├── Feeder
 │      │      │
 │      │      └── Service Area
 │      │
 │      └── Feeder
 │
 └── Substation
```

### Infrastructure Components

- Distribution Zone
- Substation
- Feeder
- Service Area
- Customer connection

Operators can create, update, publish, deactivate, and manage infrastructure records.

---

# 📅 Load-Shedding Schedule Management

Operators can create planned load-shedding schedules.

A schedule contains:

- Service area
- Start time
- End time
- Date
- Reason
- Priority
- Status
- Created by
- Published timestamp

### Schedule Lifecycle

```text
DRAFT
  │
  ▼
PUBLISHED
  │
  ▼
ACTIVE
  │
  ▼
COMPLETED
```

Invalid schedules are rejected through server-side validation.

For example:

- End time cannot be before start time
- Duplicate schedules are prevented
- Conflicting schedules are detected
- Deleted areas cannot receive new schedules

---

# 🚨 Unexpected Outage Management

Customers can report unexpected outages.

```text
Customer
   │
   ▼
Report Outage
   │
   ▼
System Validation
   │
   ▼
Operator Review
   │
   ▼
Technician Assignment
   │
   ▼
Investigation
   │
   ▼
Repair
   │
   ▼
Power Restored
```

### Outage Status

```text
REPORTED
   ↓
VERIFIED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
RESOLVED
```

Other terminal states may include:

```text
REJECTED
CANCELLED
```

---

# 🧑‍🔧 Technician Assignment

Operators can assign technicians to outage incidents.

The assignment system considers:

- Technician availability
- Service area
- Current workload
- Assignment status
- Existing active tasks

A technician cannot be assigned multiple conflicting active jobs.

Database transactions are used for critical assignment operations to prevent race conditions.

---

# 🔧 Power Restoration Workflow

```text
Outage Report
      ↓
Verification
      ↓
Technician Assignment
      ↓
Technician Accepts
      ↓
Work Started
      ↓
Repair Completed
      ↓
Operator Verification
      ↓
Power Restored
      ↓
Customer Notification
```

---

# 💳 Payment Integration

Payment integration is a mandatory requirement of this project.

GridCare integrates a real payment gateway such as:

- **bKash**
- **Stripe**
- **SSLCommerz**

The payment module can be used for electricity/service bill payments or applicable service charges.

### Payment Flow

```text
Customer
   │
   ▼
Create Payment
   │
   ▼
Payment Gateway
   │
   ▼
Customer Completes Payment
   │
   ▼
Success / Cancel
   │
   ▼
Backend Verification
   │
   ▼
Payment Status Update
   │
   ▼
Database
```

### Payment States

```text
PENDING
SUCCESS
FAILED
CANCELLED
```

Payment status is updated only after proper gateway verification.

> Fake/manual payment status updates are not used.

---

# 🔔 Notification System

GridCare can notify customers about:

- Upcoming load shedding
- Schedule changes
- Unexpected outages
- Power restoration
- Payment confirmation
- Service updates

Possible notification channels:

- Email
- In-app notifications
- SMS
- Push notifications

---

# 📊 Analytics & Reporting

GridCare provides operational statistics such as:

- Total customers
- Total service areas
- Active outages
- Resolved outages
- Planned outages
- Average restoration time
- Technician workload
- Outage frequency
- Payment statistics
- Area-wise outage statistics

Example:

```text
Total Customers        : 12,450
Active Outages         : 18
Today's Planned Outages: 7
Resolved Today         : 31
Average Restore Time   : 42 min
```

---

# 🔎 Search, Filtering & Pagination

List APIs support advanced querying.

Example:

```http
GET /api/v1/outages?page=1&limit=10
```

Filtering:

```http
GET /api/v1/outages?status=IN_PROGRESS
```

Sorting:

```http
GET /api/v1/outages?sortBy=createdAt&sortOrder=desc
```

Search:

```http
GET /api/v1/outages/search?q=substation
```

---

# 🗑️ Soft Delete

GridCare uses **soft deletion** instead of permanently deleting important records.

Example:

```text
deletedAt: null
```

After deletion:

```text
deletedAt: 2026-09-02T18:30:00.000Z
```

This preserves historical and audit information.

---

# 📝 Audit Logging

Critical actions are recorded in an audit log.

Audited actions include:

- User role changes
- Schedule publication
- Outage status changes
- Technician assignments
- Payment updates
- Infrastructure changes
- Account activation/deactivation

---

# 🧱 System Architecture

```text
                         ┌──────────────────────┐
                         │       Client         │
                         │ Postman / Frontend   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Express API     │
                         │     /api/v1/...      │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
              Middleware       Controllers        Validation
                   │                │                │
                   │                ▼                │
                   │            Services             │
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                         ┌──────────┴───────────┐
                         │       Prisma         │
                         │         ORM          │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             PostgreSQL          Redis          Cloudinary
               Database          Cache           Storage
                  │
                  ▼
           Payment Gateway
         bKash / Stripe / SSL
```

---

# 🛠️ Technology Stack

| Technology                  | Purpose                     |
| --------------------------- | --------------------------- |
| Node.js                     | JavaScript runtime          |
| TypeScript                  | Static typing               |
| Express.js                  | REST API framework          |
| PostgreSQL                  | Relational database         |
| Prisma                      | ORM                         |
| Zod                         | Input validation            |
| JWT                         | Authentication              |
| bcrypt                      | Password hashing            |
| Redis                       | Caching / rate limiting     |
| Helmet                      | Security headers            |
| express-rate-limit          | API rate limiting           |
| Multer                      | File upload handling        |
| Cloudinary                  | File/image storage          |
| Nodemailer / Resend         | Email notifications         |
| bKash / Stripe / SSLCommerz | Payment processing          |
| Postman                     | API testing & documentation |
| Render / Vercel             | Deployment                  |

---

# 📁 Project Structure

```text
gridcare-backend/
│
├── src/
│   ├── app/
│   │   ├── module/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   └── auth.interface.ts
│   │   │   │
│   │   │   ├── user/
│   │   │   ├── zone/
│   │   │   ├── substation/
│   │   │   ├── feeder/
│   │   │   ├── area/
│   │   │   ├── schedule/
│   │   │   ├── outage/
│   │   │   ├── technician/
│   │   │   ├── assignment/
│   │   │   ├── payment/
│   │   │   ├── notification/
│   │   │   ├── audit/
│   │   │   └── admin/
│   │   │
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── config/
│   ├── errors/
│   ├── helpers/
│   ├── interface/
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── tests/
│
├── uploads/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── biome.json
└── README.md
```

---

# 🗄️ Database Design

The primary database relationship:

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Customer      Operator
 │              │
 │              ├──────────► Technician
 │              │
 │              ├──────────► Schedule
 │              │
 │              └──────────► Outage
 │                              │
 │                              ▼
 │                         Assignment
 │
 ├──────────────► Payment
 │
 └──────────────► Notification


Zone
 │
 └──► Substation
         │
         └──► Feeder
                │
                └──► Area
                       │
                       ├──► Customer
                       ├──► Schedule
                       └──► Outage
```

### Core Models

```text
User
Zone
Substation
Feeder
Area
Technician
Schedule
Outage
Assignment
Payment
Notification
AuditLog
```

---

# 🔗 API Documentation

Base URL:

```text
/api/v1
```

## Authentication APIs

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/google
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
POST   /api/v1/auth/change-password
```

---

## User/Profile APIs

```http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/notifications
GET    /api/v1/users/payment-history
```

---

## Zone APIs

```http
POST   /api/v1/zones
GET    /api/v1/zones
GET    /api/v1/zones/:id
PATCH  /api/v1/zones/:id
DELETE /api/v1/zones/:id
```

---

## Substation APIs

```http
POST   /api/v1/substations
GET    /api/v1/substations
GET    /api/v1/substations/:id
PATCH  /api/v1/substations/:id
DELETE /api/v1/substations/:id
```

---

## Feeder & Area APIs

```http
POST   /api/v1/feeders
GET    /api/v1/feeders
PATCH  /api/v1/feeders/:id
DELETE /api/v1/feeders/:id

POST   /api/v1/areas
GET    /api/v1/areas
GET    /api/v1/areas/:id
PATCH  /api/v1/areas/:id
DELETE /api/v1/areas/:id
```

---

## Load-Shedding Schedule APIs

```http
POST   /api/v1/schedules
GET    /api/v1/schedules
GET    /api/v1/schedules/:id
PATCH  /api/v1/schedules/:id
DELETE /api/v1/schedules/:id

PATCH  /api/v1/schedules/:id/publish
PATCH  /api/v1/schedules/:id/cancel

GET    /api/v1/schedules/today
GET    /api/v1/schedules/search?q=area
```

---

## Outage APIs

```http
POST   /api/v1/outages
GET    /api/v1/outages
GET    /api/v1/outages/:id
PATCH  /api/v1/outages/:id
DELETE /api/v1/outages/:id

PATCH  /api/v1/outages/:id/verify
PATCH  /api/v1/outages/:id/status
POST   /api/v1/outages/:id/assign
POST   /api/v1/outages/:id/restore

GET    /api/v1/outages/my-reports
GET    /api/v1/outages/search?q=feeder
```

---

## Technician APIs

```http
POST   /api/v1/technicians
GET    /api/v1/technicians
GET    /api/v1/technicians/:id
PATCH  /api/v1/technicians/:id
DELETE /api/v1/technicians/:id

GET    /api/v1/technicians/:id/assignments
PATCH  /api/v1/technicians/:id/availability
```

---

## Payment APIs

```http
POST   /api/v1/payments/initiate
GET    /api/v1/payments/:id
POST   /api/v1/payments/success
POST   /api/v1/payments/cancel
POST   /api/v1/payments/webhook
GET    /api/v1/payments/my-payments
```

---

## Admin APIs

```http
GET    /api/v1/admin/dashboard-stats
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:id/status
PATCH  /api/v1/admin/users/:id/role
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/reports
```

> GridCare provides significantly more than the assignment's required **20 meaningful APIs**.

---

# 📦 Standard API Response

Every API follows a consistent response format.

### Success

```json
{
    "success": true,
    "message": "Schedule retrieved successfully",
    "data": {
        "id": "schedule-id",
        "status": "PUBLISHED"
    }
}
```

### Error

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "startTime",
            "message": "Start time is required"
        }
    ]
}
```

---

# 🧪 Validation

All applicable `POST`, `PATCH`, and `PUT` endpoints use server-side validation.

Example:

```typescript
const createScheduleSchema = z.object({
    areaId: z.string().uuid(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    reason: z.string().min(5).max(500),
});
```

Validation handles:

- Required fields
- UUID validation
- Date validation
- Enum validation
- String length
- Number ranges
- Email format
- Duplicate records
- Business-specific constraints

---

# 🔒 Security

GridCare follows secure backend practices.

### Authentication

```text
Client
  │
  ▼
Bearer Access Token
  │
  ▼
Authentication Middleware
  │
  ▼
JWT Verification
  │
  ▼
Role Authorization
  │
  ▼
Controller
```

### Security Features

- Password hashing with bcrypt
- JWT authentication
- Refresh token rotation
- Bearer token protection
- Role-based authorization
- Helmet security headers
- CORS configuration
- Rate limiting
- Request validation
- Secure environment variables
- Sensitive data protection
- Centralized error handling
- Payment verification
- Database transactions

---

# ⚡ Performance & Concurrency

GridCare uses several strategies to improve performance.

### PostgreSQL Indexing

Indexes are added to frequently queried fields such as:

```text
email
role
status
areaId
feederId
substationId
startTime
createdAt
paymentStatus
```

### Prisma Optimization

Queries use:

```typescript
select;
include;
where;
orderBy;
take;
skip;
```

Only required data is returned where possible.

### Redis

Redis can be used for:

- Frequently requested schedules
- Area information
- Dashboard statistics
- Rate limiting
- Temporary state
- Frequently accessed public data

---

# 🔄 Transaction Management

Critical operations use Prisma transactions.

Example:

```text
Create Outage
     │
     ├── Create Assignment
     │
     ├── Update Technician
     │
     ├── Update Outage Status
     │
     └── Create Audit Log
```

If any operation fails:

```text
ROLLBACK
```

This prevents inconsistent database states.

---

# 🧠 Important Business Rules

GridCare implements meaningful business logic beyond CRUD.

### Schedule Rules

- Schedule must have a valid time range
- End time must be after start time
- Overlapping schedules should be prevented
- Only operators can publish schedules
- Deleted areas cannot receive schedules

### Outage Rules

- Customers can report outages
- Operators verify outage reports
- Only operators can assign technicians
- Technicians cannot accept conflicting active assignments
- Resolved outages cannot return to active status without proper authorization

### Payment Rules

- Payment starts in `PENDING`
- Gateway response must be verified
- Payment cannot be manually marked as successful
- Duplicate payment attempts are prevented
- Successful payments are immutable except through authorized reconciliation

---

# 🗑️ Error Handling

GridCare uses centralized error handling.

Handled errors include:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
PrismaClientKnownRequestError
PrismaClientValidationError
PaymentError
InternalServerError
```

Example:

```json
{
    "success": false,
    "message": "You are not authorized to perform this action",
    "errors": []
}
```

---

# 📮 Postman API Documentation

A complete Postman collection will contain:

```text
GridCare API
│
├── Authentication
├── Users
├── Zones
├── Substations
├── Feeders
├── Areas
├── Schedules
├── Outages
├── Technicians
├── Assignments
├── Payments
├── Notifications
└── Admin
```

### Postman Environment

```text
BASE_URL
ACCESS_TOKEN
REFRESH_TOKEN
USER_ID
ZONE_ID
SUBSTATION_ID
FEEDER_ID
AREA_ID
SCHEDULE_ID
OUTAGE_ID
PAYMENT_ID
```

---

# 🚀 Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/gridcare-backend.git

cd gridcare-backend
```

---

# 🧬 Prisma Setup

Generate Prisma Client:

```bash
pnpm prisma generate
```

Create migration:

```bash
pnpm prisma migrate dev --name init
```

Seed database:

```bash
pnpm prisma db seed
```

Open Prisma Studio:

```bash
pnpm prisma studio
```

---

# ▶️ Run Locally

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Production:

```bash
pnpm start
```

Server:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api/v1
```

---

# 🧪 Testing

GridCare is designed to be tested using:

- Postman
- Thunder Client
- REST Client
- Automated tests

Test cases include:

### Authentication

- Valid registration
- Duplicate email
- Invalid password
- Invalid login
- Expired token
- Missing token

### Authorization

- Customer accessing operator endpoint
- Operator accessing admin endpoint
- Admin accessing protected resources

Expected response:

```http
403 Forbidden
```

### Business Logic

- Duplicate schedule
- Invalid schedule time
- Double technician assignment
- Invalid outage transition
- Duplicate payment

### Validation

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email address"
        }
    ]
}
```

---

# 📊 Example API Workflow

## Customer Flow

```text
Register
   ↓
Login
   ↓
Get Profile
   ↓
View Area
   ↓
View Today's Schedule
   ↓
Report Unexpected Outage
   ↓
Track Outage
   ↓
Make Payment
   ↓
View Payment Status
```

## Operator Flow

```text
Login
   ↓
View Assigned Areas
   ↓
Create Load-Shedding Schedule
   ↓
Publish Schedule
   ↓
Review Outage
   ↓
Assign Technician
   ↓
Monitor Repair
   ↓
Restore Power
   ↓
View Analytics
```

## Admin Flow

```text
Login
   ↓
Dashboard
   ↓
Manage Users
   ↓
Manage Operators
   ↓
View System Statistics
   ↓
Monitor Payments
   ↓
Review Audit Logs
   ↓
Generate Reports
```

---

# 📈 Dashboard Statistics

Admin dashboard example:

```text
┌────────────────────────────────────────────┐
│              GRIDCARE ADMIN                │
├────────────────────────────────────────────┤
│                                            │
│ Customers              12,450              │
│ Operators                 84               │
│ Service Areas            126               │
│ Active Outages            18               │
│ Today's Outages           31               │
│ Resolved Outages          27               │
│                                            │
│ Average Restoration       42 min           │
│ Monthly Payments          ৳1.8M            │
│                                            │
└────────────────────────────────────────────┘
```

````

Use:

```text
.env.example
````

for documentation.

---

# 📦 Seed Data

Development seed data should include:

```text
1 Admin
2 Operators
Several Customers
Several Zones
Substations
Feeders
Service Areas
Technicians
Sample Schedules
Sample Outages
Sample Payments
```

### Demo Admin

```text
Email    : admin@gridcare.com
Password : [SET SECURE DEMO PASSWORD]
Role     : ADMIN
```

> Create a dedicated demo credential for evaluation. Never use a personal password.

---

#### 2. Architecture

Explain:

```text
Routes
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

#### 3. Customer Demo

Show:

```text
Login
↓
View Schedule
↓
Report Outage
↓
Track Outage
↓
Payment
```

#### 4. Operator Demo

Show:

```text
Login
↓
Create Schedule
↓
Publish Schedule
↓
Review Outage
↓
Assign Technician
↓
Restore Power
```

#### 5. Admin Demo

Show:

```text
Login
↓
Dashboard
↓
User Management
↓
Statistics
↓
Audit Logs
```

#### 6. Security Demo

Show:

```text
Customer → Admin API
       ↓
   403 Forbidden
```

#### 7. Validation Demo

Send invalid data:

```json
{
    "startTime": "invalid-date"
}
```

Show structured validation response.

#### 8. Payment Demo

Demonstrate:

```text
Payment Initiation
       ↓
Gateway
       ↓
Success/Cancel
       ↓
Verification
       ↓
Database Status
```

#### 9. Technical Challenge

Explain one important challenge, such as:

- Preventing schedule conflicts
- Transaction-safe technician assignment
- Payment webhook verification
- Redis caching
- Complex Prisma relationships

---

# 🏆 Assignment Compliance

GridCare is designed to satisfy the major assignment requirements.

| Requirement            | GridCare |
| ---------------------- | -------- |
| 3 Primary Roles        | ✅       |
| 20+ Meaningful APIs    | ✅       |
| PostgreSQL             | ✅       |
| Prisma ORM             | ✅       |
| JWT Authentication     | ✅       |
| GCP Social Login       | ✅       |
| RBAC                   | ✅       |
| Zod Validation         | ✅       |
| Structured Responses   | ✅       |
| Pagination             | ✅       |
| Filtering              | ✅       |
| Search                 | ✅       |
| Soft Delete            | ✅       |
| Audit Logs             | ✅       |
| Transactions           | ✅       |
| Database Indexing      | ✅       |
| Redis                  | ✅       |
| Real Payment Gateway   | ✅       |
| Rate Limiting          | ✅       |
| Helmet                 | ✅       |
| CORS                   | ✅       |
| Postman Documentation  | ✅       |
| Production Deployment  | ✅       |
| 20+ Meaningful Commits | ✅       |
| API Walkthrough Video  | ✅       |

---

# 📸 Project Screenshots

Since this is a backend-focused project, screenshots can demonstrate the API through Postman.

Recommended screenshots:

```text
docs/
├── postman/
│   ├── authentication.png
│   ├── customer-flow.png
│   ├── operator-flow.png
│   ├── admin-flow.png
│   ├── validation-error.png
│   ├── unauthorized.png
│   └── payment-flow.png
│
└── architecture/
    └── system-architecture.png
```

---

# 🚀 Future Improvements

Future versions may include:

- Real-time outage updates
- WebSocket-based notifications
- Mobile application
- Smart load forecasting
- AI-assisted outage prediction
- IoT smart-meter integration
- Geographic information system (GIS)
- Automated load balancing
- SMS gateway
- Push notifications
- Advanced power-consumption analytics
- Machine-learning-based outage prediction
- Multi-utility support

---

# 🤝 Contributing

Contributions are welcome.

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Commit changes

```bash
git add .
git commit -m "feat: add your feature"
```

### Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Bug Reports

When reporting a bug, provide:

- Description
- Steps to reproduce
- Expected result
- Actual result
- API endpoint
- Request body
- Response
- Environment

Never include:

- Passwords
- JWT tokens
- API keys
- Payment secrets
- Database credentials

---

# 📄 License

This project is developed for educational and portfolio purposes.

Licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sayed Anower Hossain Rana**

Backend / Full-Stack Developer

---
