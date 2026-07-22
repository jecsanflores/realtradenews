const axios = require('axios');

class TradingEconomicsAPI {
  static baseURL = 'https://api.tradingeconomics.com';

  static async getEconomicCalendar() {
    try {
      const response = await axios.get(
        `${this.baseURL}/calendar`,
        {
          params: {
            apikey: process.env.TRADING_ECONOMICS_API_KEY,
            country: 'united states'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Trading Economics API error:', error.message);
      return [];
    }
  }

  static async getCountryIndicators(country = 'united states') {
    try {
      const response = await axios.get(
        `${this.baseURL}/country/${country}`,
        {
          params: { apikey: process.env.TRADING_ECONOMICS_API_KEY }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Trading Economics indicators error:', error.message);
      return [];
    }
  }

  static async getFedMeetings() {
    try {
      const response = await axios.get(
        `${this.baseURL}/calendar`,
        {
          params: {
            apikey: process.env.TRADING_ECONOMICS_API_KEY,
            event: 'Federal Funds Rate Decision'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Fed meetings error:', error.message);
      return [];
    }
  }

  static async parseAndFormatCalendar(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData.map(event => ({
      date: event.DateTime,
      country: event.Country,
      event: event.Event,
      forecast: event.Forecast,
      previous: event.Previous,
      actual: event.Actual,
      importance: this.getImportanceLevel(event.Importance),
      description: event.Description || ''
    }));
  }

  static getImportanceLevel(importance) {
    if (!importance) return 'low';
    if (importance >= 3) return 'very_high';
    if (importance >= 2) return 'high';
    if (importance >= 1) return 'medium';
    return 'low';
  }
}

module.exports = TradingEconomicsAPI;
