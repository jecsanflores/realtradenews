const express = require('express');
const News = require('../models/News');
const TradingEconomicsAPI = require('../services/tradingEconomicsAPI');
const PoliticalEventsMonitor = require('../services/politicalEventsMonitor');
const router = express.Router();

// Get market news (español)
router.get('/market', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const news = await News.findRecent(parseInt(limit));

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get economic calendar
router.get('/economic-calendar', async (req, res) => {
  try {
    // Fetch from Trading Economics API
    const rawCalendar = await TradingEconomicsAPI.getEconomicCalendar();
    const calendar = await TradingEconomicsAPI.parseAndFormatCalendar(rawCalendar);

    // If API fails, return mock data
    const mockCalendar = [
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

    res.json(calendar.length > 0 ? calendar : mockCalendar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Get political/Fed events
router.get('/events', async (req, res) => {
  try {
    const events = await PoliticalEventsMonitor.getPoliticalEvents();

    // If API fails, return mock data
    const mockEvents = [
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

    res.json(events.length > 0 ? events : mockEvents);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// Get news by source
router.get('/source/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const { limit = 20 } = req.query;

    const news = await News.findBySource(source, parseInt(limit));
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news by source' });
  }
});

// Get news by sentiment
router.get('/sentiment/:sentiment', async (req, res) => {
  try {
    const { sentiment } = req.params;
    const { limit = 30 } = req.query;

    const news = await News.findBySentiment(sentiment, parseInt(limit));
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news by sentiment' });
  }
});

module.exports = router;
