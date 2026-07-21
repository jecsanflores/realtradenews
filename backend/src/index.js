require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const newsRoutes = require('./routes/news');
const alertRoutes = require('./routes/alerts');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.MOBILE_APP_URL],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'RealTradeNews API running', version: '0.1.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/alerts', alertRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RealTradeNews API listening on port ${PORT}`);
});
