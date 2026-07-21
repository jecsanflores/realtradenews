# RealTradeNews

Real-time financial news and alerts platform for NYSE investors in Spanish.

**Status**: Phase 1 - Foundation (In Progress)

## Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 6+
- npm or yarn

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys and database credentials

# Start development server
npm run dev
```

## Project Structure

```
RealTradeNews/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   └── index.js     # Main server
│   └── package.json
├── frontend/            # React web app (Phase 3)
├── mobile/              # React Native app (Phase 3)
├── docs/
│   └── ARCHITECTURE.md   # System design
└── README.md
```

## Development Phases

### Phase 1: Foundation ✅ Starting
- [x] Express.js structure
- [x] JWT authentication
- [x] Stripe integration
- [x] API routes (news, alerts, payments)
- [ ] PostgreSQL + migrations
- [ ] Redis caching
- [ ] Bull job queues

### Phase 2: Backend Integration (Weeks 5-8)
- Trading Economics API
- Web scraping (Yahoo Finance, Investing.com)
- Political/Fed event monitoring
- Real-time alert system

### Phase 3: Frontend (Weeks 9-12)
- React dashboard
- React Native mobile app
- Push notifications
- Watchlists & charts

### Phase 4: Polish & Launch (Weeks 13-16)
- Security testing
- Performance optimization
- Beta release
- Marketing site

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user (auth required)

### News & Markets
- `GET /api/news/market` - Market news (Spanish)
- `GET /api/news/economic-calendar` - Economic events
- `GET /api/news/events` - Political/Fed speeches
- `GET /api/news/prices/:symbol` - Stock price

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts/:email` - List user alerts
- `PUT /api/alerts/:alertId` - Update alert
- `DELETE /api/alerts/:alertId` - Delete alert

### Payment
- `POST /api/payment/create-checkout-session` - Start subscription
- `POST /api/payment/webhook` - Stripe webhooks
- `GET /api/payment/status/:email` - Check subscription

## Environment Variables

See `.env.example` for required configuration:
- Database URL
- Redis URL
- JWT secret
- Stripe keys
- API keys (Trading Economics, Polygon, etc.)

## Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | Delayed data, 3 watchlists |
| Pro | $29.99/mo | Real-time data, unlimited watchlists |
| Enterprise | $99.99+/mo | API access, white-label |

## Technology Stack

**Backend**: Node.js, Express, PostgreSQL, Redis, Bull

**Frontend**: React, Redux (Phase 3)

**Mobile**: React Native (Phase 3)

**Payments**: Stripe

**Infrastructure**: AWS (EC2, RDS, ElastiCache)

## Security

- HTTPS only
- JWT authentication
- Rate limiting
- CORS protection
- Helmet.js headers
- Stripe PCI compliance

## Contributing

This is a private commercial project. Contact Jecsan Flores for development.

## License

Proprietary - RealTradeNews™

## Contact

**Owner**: Jecsan Flores  
**Email**: jecsanflores@gmail.com

---

**Last Updated**: July 21, 2026  
**Version**: 0.1.0-alpha
