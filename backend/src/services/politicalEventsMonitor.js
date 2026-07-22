const axios = require('axios');
const cheerio = require('cheerio');

class PoliticalEventsMonitor {
  static async getWhiteHouseSchedule() {
    try {
      // White House official schedule endpoint
      const response = await axios.get(
        'https://www.whitehouse.gov/briefing-room/speeches-remarks/',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        }
      );

      const $ = cheerio.load(response.data);
      const events = [];

      $('article').each((index, element) => {
        if (index >= 15) return;

        const titleEl = $(element).find('h2, h3');
        const dateEl = $(element).find('time, .published-date');
        const linkEl = $(element).find('a');

        const title = titleEl.text().trim();
        const date = dateEl.attr('datetime') || dateEl.text();
        const url = linkEl.attr('href');

        if (title && date) {
          events.push({
            type: 'speech',
            speaker: 'Donald Trump',
            title,
            date: new Date(date),
            url,
            status: this.getEventStatus(new Date(date))
          });
        }
      });

      return events;
    } catch (error) {
      console.error('White House schedule error:', error.message);
      return [];
    }
  }

  static async getFOMCSchedule() {
    try {
      // Federal Reserve FOMC meeting calendar
      const response = await axios.get(
        'https://www.federalreserve.gov/monetarypolicy/fomccalendar.htm',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        }
      );

      const $ = cheerio.load(response.data);
      const events = [];

      $('table tr').each((index, element) => {
        const tds = $(element).find('td');
        if (tds.length < 2) return;

        const dateText = $(tds[0]).text().trim();
        const meetingType = $(tds[1]).text().trim();

        if (dateText && (meetingType.includes('Meeting') || meetingType.includes('Decision'))) {
          events.push({
            type: 'monetary-policy',
            speaker: 'Jerome Powell',
            title: `FOMC ${meetingType}`,
            date: this.parseDateText(dateText),
            status: this.getEventStatus(this.parseDateText(dateText))
          });
        }
      });

      return events;
    } catch (error) {
      console.error('FOMC schedule error:', error.message);
      return [];
    }
  }

  static parseDateText(text) {
    // Parse various date formats from government websites
    try {
      return new Date(text);
    } catch (e) {
      return new Date();
    }
  }

  static getEventStatus(eventDate) {
    const now = new Date();
    if (eventDate > now) return 'upcoming';
    if (eventDate.getTime() + 3600000 > now) return 'in_progress'; // 1 hour window
    return 'completed';
  }

  static async monitorTrumpSpeeches() {
    try {
      const whiteHouseEvents = await this.getWhiteHouseSchedule();
      const trumpSpeeches = whiteHouseEvents.filter(e => e.speaker === 'Donald Trump');
      return trumpSpeeches;
    } catch (error) {
      console.error('Trump speeches monitor error:', error);
      return [];
    }
  }

  static async monitorFedAnnouncements() {
    try {
      const fomc = await this.getFOMCSchedule();
      return fomc;
    } catch (error) {
      console.error('Fed announcements monitor error:', error);
      return [];
    }
  }

  static async getPoliticalEvents() {
    try {
      const [trumpEvents, fedEvents] = await Promise.all([
        this.monitorTrumpSpeeches(),
        this.monitorFedAnnouncements()
      ]);

      return [...trumpEvents, ...fedEvents].sort((a, b) => a.date - b.date);
    } catch (error) {
      console.error('Error fetching political events:', error);
      return [];
    }
  }
}

module.exports = PoliticalEventsMonitor;
