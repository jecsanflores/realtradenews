# Phase 1 - Foundation & Core Infrastructure (Weeks 1-4)

## Overview
Establish the backend foundation with authentication, payments, and API structure ready for data integration in Phase 2.

**Target Completion**: August 18, 2026

---

## Completed ✅

### Week 1: Project Setup
- [x] Initialize Git repository
- [x] Create project structure (backend/frontend/mobile/docs)
- [x] Setup Express.js server with middleware
- [x] Configure CORS, Helmet, environment variables
- [x] Create routing structure

### Week 1: Authentication System
- [x] JWT implementation (register, login, token verify)
- [x] Password hashing with bcryptjs
- [x] User profile endpoint
- [x] Input validation with express-validator

### Week 1: Payment Integration
- [x] Stripe API setup
- [x] Checkout session creation
- [x] Webhook handling for subscriptions
- [x] Subscription status endpoint

### Week 1: API Routes
- [x] News routes (market, calendar, events, prices)
- [x] Alerts routes (CRUD)
- [x] Placeholder data for testing

---

## In Progress 🔄

### Week 2: Database Layer (STARTING THIS WEEK)

#### PostgreSQL Setup
- [ ] Install PostgreSQL locally / AWS RDS
- [ ] Create database schema
- [ ] Write Knex migrations:
  - `001_create_users_table.js`
  - `002_create_alerts_table.js`
  - `003_create_news_cache_table.js`
  - `004_create_economic_events_table.js`
  - `005_create_subscriptions_table.js`

#### Database Models
- [ ] User model with queries (create, find, update)
- [ ] Alert model (CRUD operations)
- [ ] News model (insert, fetch, purge old)
- [ ] Subscription model (create, update, cancel)

**Files to create**:
```
backend/src/db/
├── config.js              # Database connection
├── migrations/            # Knex migration files
└── models/
    ├── User.js
    ├── Alert.js
    ├── News.js
    └── Subscription.js
```

---

## Week 3: Caching & Queues

### Redis Setup
- [ ] Connect Redis client
- [ ] Implement cache layer for:
  - Stock prices (60s TTL)
  - News articles (300s TTL)
  - Economic events (3600s TTL)

### Bull Job Queues
- [ ] Setup Bull queue processor
- [ ] Jobs to create:
  - `check-price-alerts` (every 10 seconds)
  - `fetch-market-news` (every 60 seconds)
  - `check-political-events` (every 300 seconds)
  - `send-notifications` (as needed)

**Files to create**:
```
backend/src/
├── cache.js               # Redis client wrapper
└── jobs/
    ├── priceAlerts.js
    ├── marketNews.js
    ├── politicalEvents.js
    └── notifications.js
```

---

## Week 4: Testing & Documentation

### Unit Tests
- [ ] Auth route tests (register, login, verify)
- [ ] Payment route tests (checkout, webhook)
- [ ] Database model tests
- [ ] Validation tests

### Integration Tests
- [ ] Full auth flow
- [ ] Payment flow
- [ ] Alert creation → notification

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema diagram
- [ ] Setup guide for new developers
- [ ] Environment variables guide

---

## NEXT IMMEDIATE TASKS (DO THIS WEEK)

### Task 1: PostgreSQL Setup
```bash
# Create local PostgreSQL database
createdb realtradenews

# OR on AWS RDS:
# Use AWS Console to create PostgreSQL 14 instance
```

**Deliverable**: Database connection working, connection string in .env

### Task 2: Knex Configuration
```bash
cd backend
npm install knex@latest
npx knex init
```

**File to create**: `backend/knexfile.js` with development/production configs

### Task 3: Create First Migration
```bash
npx knex migrate:make create_users_table
```

Create schema:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Task 4: Update Auth Routes
Replace in-memory users with PostgreSQL queries:
- `backend/src/models/User.js` - Database queries
- Update `backend/src/routes/auth.js` - Use User model

### Task 5: Redis Connection
```bash
npm install redis
```

Create: `backend/src/cache.js` - Redis client wrapper

---

## Success Criteria for Phase 1

By end of Week 4, you should have:

✅ Backend API running (`npm run dev`)

✅ Database working:
```bash
# Test connection
psql -U user realtradenews -c "SELECT * FROM users;"
```

✅ Authentication flow end-to-end:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'
```

✅ Payment integration (webhook simulation):
```bash
# Create checkout
curl -X POST http://localhost:3000/api/payment/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro","email":"test@test.com"}'
```

✅ Alerts CRUD working with database

✅ Tests passing (npm test)

---

## Dependencies to Install (Week 2)

```bash
cd backend
npm install pg knex redis bull node-cron
npm install --save-dev jest supertest
```

---

## AWS Setup Checklist (if using cloud)

- [ ] Create AWS account
- [ ] Setup RDS PostgreSQL 14
- [ ] Setup ElastiCache Redis
- [ ] Setup EC2 instance for backend (optional, use local first)
- [ ] Setup S3 bucket for logs
- [ ] Create IAM user with appropriate permissions

**Cost estimate Phase 1**: ~$150-200/month (RDS micro + ElastiCache)

---

## Communication & Checkpoints

**Weekly sync**: Every Friday at 6 PM (your time)

- Week 2 (July 28): Database + models done
- Week 3 (Aug 4): Queues + caching done
- Week 4 (Aug 11): Tests + docs done
- **Phase 1 Complete (Aug 18)**

Questions or blockers? Message anytime.

---

## Notes for Jecsan

1. **Database credentials**: Once created, add to `.env` (don't commit!)
2. **Stripe test mode**: Use test keys from Stripe dashboard until Phase 4
3. **Local development**: Can use `docker-compose.yml` to run PostgreSQL + Redis locally (I can set this up)
4. **Deployment**: Don't worry about this until Phase 2 — we'll use AWS later

---

**Updated**: July 21, 2026  
**Status**: Phase 1 Starting - Ready for Week 2
