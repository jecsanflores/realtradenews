const express = require('express');
const jwt = require('jsonwebtoken');
const Alert = require('../models/Alert');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create alert
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, target, condition, notificationMethod } = req.body;

    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alert = await Alert.create(user.id, type, target, condition, notificationMethod);
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Get user alerts
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alerts = await Alert.findByUserId(user.id);
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Update alert
router.put('/:alertId', verifyToken, async (req, res) => {
  try {
    const { alertId } = req.params;

    const user = await User.findByEmail(req.user.email);
    const alert = await Alert.findById(alertId);

    if (!alert || alert.user_id !== user.id) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await Alert.update(alertId, req.body);
    res.json(updatedAlert[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Delete alert
router.delete('/:alertId', verifyToken, async (req, res) => {
  try {
    const { alertId } = req.params;

    const user = await User.findByEmail(req.user.email);
    const alert = await Alert.findById(alertId);

    if (!alert || alert.user_id !== user.id) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await Alert.delete(alertId);
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
