const Queue = require('bull');
const redis = require('redis');
const Alert = require('../models/Alert');
const User = require('../models/User');

const priceAlertQueue = new Queue('price-alerts', process.env.REDIS_URL);

// Process price alerts every 10 seconds
priceAlertQueue.process('check', 10, async (job) => {
  try {
    const priceAlerts = await Alert.findByType('price');

    for (const alert of priceAlerts) {
      const { target, condition } = alert;

      // TODO: Fetch real price from Polygon.io
      const currentPrice = 150.50; // Mock price

      // Check if condition is met
      let conditionMet = false;
      if (condition.startsWith('above_')) {
        const threshold = parseFloat(condition.split('_')[1]);
        conditionMet = currentPrice > threshold;
      } else if (condition.startsWith('below_')) {
        const threshold = parseFloat(condition.split('_')[1]);
        conditionMet = currentPrice < threshold;
      }

      if (conditionMet) {
        console.log(`Alert triggered: ${target} ${condition}`);
        // TODO: Send notification
      }
    }

    return { processed: priceAlerts.length };
  } catch (error) {
    console.error('Price alert queue error:', error);
    throw error;
  }
});

// Schedule job every 10 seconds
priceAlertQueue.add('check', {}, {
  repeat: { every: 10000 },
  removeOnComplete: true
});

module.exports = priceAlertQueue;
