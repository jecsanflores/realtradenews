const express = require('express');
const router = express.Router();

// Simulated database
const userAlerts = new Map();

// Create alert
router.post('/', async (req, res) => {
  try {
    const { email, type, target, condition, notificationMethod } = req.body;

    const alert = {
      id: Date.now(),
      email,
      type, // 'price', 'news', 'political', 'economic'
      target, // symbol, keyword, speaker
      condition, // e.g., 'above_150', 'mentions_tech', 'any_speech'
      notificationMethod, // 'push', 'email', 'both'
      active: true,
      createdAt: new Date()
    };

    if (!userAlerts.has(email)) {
      userAlerts.set(email, []);
    }
    userAlerts.get(email).push(alert);

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Get user alerts
router.get('/:email', async (req, res) => {
  try {
    const alerts = userAlerts.get(req.params.email) || [];
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Update alert
router.put('/:alertId', async (req, res) => {
  try {
    const { email } = req.body;
    const alerts = userAlerts.get(email) || [];
    const alert = alerts.find(a => a.id === parseInt(req.params.alertId));

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    Object.assign(alert, req.body);
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Delete alert
router.delete('/:alertId', async (req, res) => {
  try {
    const { email } = req.body;
    const alerts = userAlerts.get(email) || [];
    const index = alerts.findIndex(a => a.id === parseInt(req.params.alertId));

    if (index === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alerts.splice(index, 1);
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
