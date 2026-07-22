const db = require('../db/db');

class News {
  static async create(title, source, content, url, sentiment, impact, tags, publishedAt) {
    const [news] = await db('news')
      .insert({
        title,
        source,
        content,
        url,
        sentiment,
        impact,
        tags: JSON.stringify(tags),
        published_at: publishedAt
      })
      .returning('*');
    return news;
  }

  static async findRecent(limit = 50) {
    return db('news')
      .orderBy('published_at', 'desc')
      .limit(limit)
      .map(item => ({
        ...item,
        tags: JSON.parse(item.tags || '[]')
      }));
  }

  static async findBySource(source, limit = 20) {
    return db('news')
      .where({ source })
      .orderBy('published_at', 'desc')
      .limit(limit)
      .map(item => ({
        ...item,
        tags: JSON.parse(item.tags || '[]')
      }));
  }

  static async findBySentiment(sentiment, limit = 30) {
    return db('news')
      .where({ sentiment })
      .orderBy('published_at', 'desc')
      .limit(limit)
      .map(item => ({
        ...item,
        tags: JSON.parse(item.tags || '[]')
      }));
  }

  static async findByImpact(impact, limit = 20) {
    return db('news')
      .where({ impact })
      .orderBy('published_at', 'desc')
      .limit(limit)
      .map(item => ({
        ...item,
        tags: JSON.parse(item.tags || '[]')
      }));
  }

  static async deleteOlderThan(daysAgo = 7) {
    const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return db('news').where('published_at', '<', cutoffDate).del();
  }

  static async countBySource(source) {
    const result = await db('news')
      .where({ source })
      .count('* as count')
      .first();
    return result.count;
  }
}

module.exports = News;
