const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../models/News');

class NewsScraper {
  static async scrapeYahooFinanceES() {
    try {
      const response = await axios.get('https://es.finance.yahoo.com', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      // Parse news items (adjust selectors based on actual HTML)
      $('a[data-test="internal-link"]').each((index, element) => {
        if (index >= 10) return; // Limit to 10 articles

        const title = $(element).text().trim();
        const url = $(element).attr('href');
        const source = 'Yahoo Finance ES';

        if (title && url) {
          articles.push({
            title,
            url,
            source,
            sentiment: 'neutral', // Will be analyzed later
            impact: 'medium'
          });
        }
      });

      return articles;
    } catch (error) {
      console.error('Yahoo Finance scraping error:', error.message);
      return [];
    }
  }

  static async scrapeInvestingCom() {
    try {
      const response = await axios.get('https://es.investing.com/news/latest-news', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      // Parse news items (adjust selectors based on actual HTML)
      $('article').each((index, element) => {
        if (index >= 10) return;

        const titleEl = $(element).find('a[data-test="internal-link"]');
        const title = titleEl.text().trim();
        const url = titleEl.attr('href');
        const source = 'Investing.com';

        if (title && url) {
          articles.push({
            title,
            url: url.startsWith('http') ? url : `https://investing.com${url}`,
            source,
            sentiment: 'neutral',
            impact: 'medium'
          });
        }
      });

      return articles;
    } catch (error) {
      console.error('Investing.com scraping error:', error.message);
      return [];
    }
  }

  static async storeNews(articles) {
    try {
      for (const article of articles) {
        await News.create(
          article.title,
          article.source,
          article.content || article.title,
          article.url,
          article.sentiment || 'neutral',
          article.impact || 'medium',
          article.tags || ['market'],
          new Date()
        );
      }

      console.log(`Stored ${articles.length} news articles`);
    } catch (error) {
      console.error('Error storing news:', error);
    }
  }

  static async cleanOldNews() {
    try {
      await News.deleteOlderThan(7); // Delete older than 7 days
      console.log('Cleaned old news articles');
    } catch (error) {
      console.error('Error cleaning old news:', error);
    }
  }

  static async fetchAndStoreNews() {
    try {
      console.log('Fetching latest news...');

      const yahooArticles = await this.scrapeYahooFinanceES();
      const investingArticles = await this.scrapeInvestingCom();

      const allArticles = [...yahooArticles, ...investingArticles];

      if (allArticles.length > 0) {
        await this.storeNews(allArticles);
      }

      // Clean old news every hour
      if (Math.random() < 0.1) {
        await this.cleanOldNews();
      }
    } catch (error) {
      console.error('Fatal error in news scraper:', error);
    }
  }
}

module.exports = NewsScraper;
