const express = require('express');
const axios = require('axios');
const router = express.Router();

// Simulated news database (replace with actual DB)
const newsCache = [];

// Get market news (español)
router.get('/market', async (req, res) => {
  try {
    // TODO: Integrate with Trading Economics API + Web scraping
    // For now, return cached data structure

    const news = [
      {
        id: 1,
        title: 'Wall Street abre con ganancias en temporada de resultados',
        source: 'El Financiero',
        timestamp: new Date(),
        sentiment: 'positive',
        impact: 'medium',
        tags: ['NYSE', 'indices'],
        content: 'Los mercados avanzan mientras los inversionistas se enfocan en la temporada de reportes corporativos...'
      },
      {
        id: 2,
        title: 'Banco Central mantiene tasas de interés sin cambios',
        source: 'Trading Economics',
        timestamp: new Date(),
        sentiment: 'neutral',
        impact: 'high',
        tags: ['Fed', 'rates'],
        content: 'El presidente de la Reserva Federal confirmó la política monetaria actual...'
      }
    ];

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get economic calendar
router.get('/economic-calendar', async (req, res) => {
  try {
    // TODO: Integrate Trading Economics API
    const calendar = [
      {
        id: 1,
        date: new Date(),
        time: '14:30',
        country: 'USA',
        event: 'Initial Jobless Claims',
        forecast: '220K',
        previous: '225K',
        importance: 'high',
        unit: 'thousands'
      },
      {
        id: 2,
        date: new Date(Date.now() + 86400000),
        time: '13:00',
        country: 'USA',
        event: 'FOMC Decision',
        forecast: 'No change',
        previous: '5.33%',
        importance: 'very_high',
        unit: 'percent'
      }
    ];

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Get political/Fed events
router.get('/events', async (req, res) => {
  try {
    // TODO: Monitor House calendar + FOMC calendar
    const events = [
      {
        id: 1,
        type: 'speech',
        speaker: 'Donald Trump',
        title: 'Campaign Rally in Nevada',
        date: new Date(),
        time: '19:00 PT',
        location: 'Las Vegas Convention Center',
        status: 'upcoming'
      },
      {
        id: 2,
        type: 'speech',
        speaker: 'Jerome Powell (Fed Chair)',
        title: 'Congressional Testimony on Monetary Policy',
        date: new Date(Date.now() + 172800000),
        time: '10:00 ET',
        location: 'U.S. Senate',
        status: 'upcoming'
      }
    ];

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get stock prices (real-time)
router.get('/prices/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // TODO: Integrate Polygon.io API

    const price = {
      symbol: symbol.toUpperCase(),
      price: 150.25,
      change: 2.50,
      changePercent: 1.69,
      timestamp: new Date(),
      dataSource: 'Polygon.io'
    };

    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

module.exports = router;
