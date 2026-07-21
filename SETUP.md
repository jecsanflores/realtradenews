# RealTradeNews - Setup Guide

## Phase 1 Initial Setup (Follow This Order)

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project
cd ~/Desktop/Jecsan

# Install backend dependencies
cd backend
npm install

cd ..
```

### Step 2: Setup Docker (PostgreSQL + Redis)

If you have Docker installed:

```bash
# Start PostgreSQL and Redis in background
docker-compose up -d

# Verify containers are running
docker ps
```

If you DON'T have Docker, install it first:
- **Mac**: Download Docker Desktop from https://www.docker.com/products/docker-desktop

---

### Step 3: Setup Environment Variables

```bash
cd backend

# Copy example to actual .env
cp .env.example .env
```

Edit `.env` and make sure it has:

```
DATABASE_URL=postgresql://jecsan:dev_password_change_in_production@localhost:5432/realtradenews
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345678
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here
```

### Step 4: Install Knex (Database Tool)

```bash
cd backend
npm install knex pg
```

### Step 5: Run Database Migrations

```bash
cd backend

# Run all migrations
npx knex migrate:latest

# Verify tables were created
psql postgresql://jecsan:dev_password_change_in_production@localhost:5432/realtradenews -c "\dt"
```

You should see tables:
- `users`
- `alerts`
- `news`
- `economic_events`
- `subscriptions`

### Step 6: Start Development Server

```bash
cd backend
npm run dev
```

You should see:
```
RealTradeNews API listening on port 3000
```

### Step 7: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"RealTradeNews API running","version":"0.1.0"}
```

---

## Testing the Auth System

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123456",
    "name":"Jecsan Flores"
  }'
```

Response should be:
```json
{"message":"User registered successfully"}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123456"
  }'
```

Response:
```json
{
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user":{"email":"test@example.com","name":"Jecsan Flores","plan":"free"}
}
```

### Get Profile (Using Token)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing Alerts

### Create an Alert

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "type":"price",
    "target":"AAPL",
    "condition":"above_150",
    "notificationMethod":"both"
  }'
```

### Get User Alerts

```bash
curl http://localhost:3000/api/alerts/test@example.com
```

---

## Testing News Routes

```bash
# Market news
curl http://localhost:3000/api/news/market

# Economic calendar
curl http://localhost:3000/api/news/economic-calendar

# Political events
curl http://localhost:3000/api/news/events

# Stock price
curl http://localhost:3000/api/news/prices/AAPL
```

---

## Database Management

### Connect to PostgreSQL directly

```bash
psql postgresql://jecsan:dev_password_change_in_production@localhost:5432/realtradenews
```

Once connected, you can:

```sql
-- View all users
SELECT * FROM users;

-- View all alerts for a user
SELECT * FROM alerts WHERE user_id = 1;

-- Count records
SELECT COUNT(*) FROM users;

-- Exit
\q
```

### View Redis Cache

```bash
redis-cli

# In Redis CLI
KEYS *
GET key_name
FLUSHALL  # Clear all cache (use carefully!)
EXIT
```

---

## Troubleshooting

### "Cannot connect to PostgreSQL"
- Check Docker containers: `docker ps`
- Restart: `docker-compose restart postgres`
- Verify credentials in .env

### "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### "Migrations failed"
```bash
# Rollback last migration
npx knex migrate:rollback

# Check migration status
npx knex migrate:status

# Run specific migration
npx knex migrate:up
```

### "JWT_SECRET not found"
- Make sure .env file exists in backend/
- Restart server: `npm run dev`

---

## Next Steps (Week 2)

Once setup is complete:

1. ✅ Database connected
2. ✅ Auth working
3. ✅ API endpoints responding
4. **Next**: Create User model (database queries)
5. **Next**: Connect auth routes to actual database

See `docs/PHASE1_CHECKLIST.md` for detailed tasks.

---

## Quick Reference

| Command | What it does |
|---------|------------|
| `npm run dev` | Start backend server (with auto-reload) |
| `npm test` | Run tests |
| `npx knex migrate:latest` | Run all pending migrations |
| `npx knex migrate:rollback` | Undo last migration |
| `docker-compose up -d` | Start PostgreSQL + Redis |
| `docker-compose down` | Stop containers |
| `docker ps` | List running containers |

---

## Support

If you get stuck on any step, message me with:
1. The error message
2. What you were trying to do
3. Your OS (Mac/Windows/Linux)

I'm here to help! 🚀

---

**Last Updated**: July 21, 2026  
**For**: Jecsan Flores (jecsanflores@gmail.com)
