const db = require('../db/db');

class User {
  static async create(email, passwordHash, name) {
    const [user] = await db('users')
      .insert({ email, password_hash: passwordHash, name })
      .returning('*');
    return user;
  }

  static async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static async findById(id) {
    return db('users').where({ id }).first();
  }

  static async updatePlan(id, plan) {
    return db('users').where({ id }).update({ plan });
  }

  static async verifyEmail(email) {
    return db('users').where({ email }).update({ email_verified: true });
  }

  static async getProfile(email) {
    return db('users')
      .where({ email })
      .select('id', 'email', 'name', 'plan', 'email_verified', 'created_at')
      .first();
  }
}

module.exports = User;
