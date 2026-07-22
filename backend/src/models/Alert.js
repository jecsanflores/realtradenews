const db = require('../db/db');

class Alert {
  static async create(userId, type, target, condition, notificationMethod) {
    const [alert] = await db('alerts')
      .insert({
        user_id: userId,
        type,
        target,
        condition,
        notification_method: notificationMethod
      })
      .returning('*');
    return alert;
  }

  static async findByUserId(userId) {
    return db('alerts')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  }

  static async findById(id) {
    return db('alerts').where({ id }).first();
  }

  static async update(id, data) {
    return db('alerts')
      .where({ id })
      .update(data)
      .returning('*');
  }

  static async delete(id) {
    return db('alerts').where({ id }).del();
  }

  static async findByType(type) {
    return db('alerts')
      .where({ type, active: true })
      .orderBy('created_at', 'desc');
  }

  static async findActiveAlerts() {
    return db('alerts')
      .where({ active: true })
      .innerJoin('users', 'alerts.user_id', 'users.id')
      .select('alerts.*', 'users.email', 'users.name');
  }
}

module.exports = Alert;
