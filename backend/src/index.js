require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const newsRoutes = require('./routes/news');
const alertRoutes = require('./routes/alerts');
const indicesRoutes = require('./routes/indices');
const priceAlertQueue = require('./queue/priceAlertQueue');
const NewsScraper = require('./services/newsScraper');
const TradingEconomicsAPI = require('./services/tradingEconomicsAPI');
const PoliticalEventsMonitor = require('./services/politicalEventsMonitor');

const app = express();

// Run migrations on startup
(async () => {
  try {
    console.log('Running database migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
})();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.MOBILE_APP_URL],
  credentials: true
}));
app.use(express.json());

// Serve frontend static files
const frontendBuildPath = path.join(__dirname, '../../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
}

// Initialize background jobs
console.log('Initializing background jobs...');

// Fetch news every minute
setInterval(() => {
  NewsScraper.fetchAndStoreNews();
}, 60000);

// Fetch political events every hour
setInterval(async () => {
  try {
    const events = await PoliticalEventsMonitor.getPoliticalEvents();
    console.log(`Found ${events.length} political/fed events`);
  } catch (error) {
    console.error('Error fetching political events:', error);
  }
}, 3600000);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'RealTradeNews API running', version: '0.1.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/indices', indicesRoutes);

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RealTradeNews API listening on port ${PORT}`);
});
