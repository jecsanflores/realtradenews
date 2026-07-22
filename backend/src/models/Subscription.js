const db = require('../db/db');

class Subscription {
  static async create(userId, stripeCustomerId, stripSubId, plan, amount) {
    const [sub] = await db('subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripSubId,
        plan,
        status: 'active',
        amount,
        currency: 'USD'
      })
      .returning('*');
    return sub;
  }

  static async findByUserId(userId) {
    return db('subscriptions').where({ user_id: userId }).first();
  }

  static async findByStripeSubId(stripeSubId) {
    return db('subscriptions').where({ stripe_subscription_id: stripeSubId }).first();
  }

  static async updateStatus(stripeSubId, status, currentPeriodEnd = null) {
    return db('subscriptions')
      .where({ stripe_subscription_id: stripeSubId })
      .update({
        status,
        current_period_end: currentPeriodEnd
      })
      .returning('*');
  }

  static async cancelSubscription(userId) {
    return db('subscriptions')
      .where({ user_id: userId })
      .update({
        status: 'canceled',
        cancel_at: new Date()
      })
      .returning('*');
  }

  static async findActive() {
    return db('subscriptions')
      .where({ status: 'active' })
      .orderBy('created_at', 'desc');
  }

  static async countByPlan() {
    return db('subscriptions')
      .where({ status: 'active' })
      .groupBy('plan')
      .select('plan')
      .count('* as count');
  }
}

module.exports = Subscription;
