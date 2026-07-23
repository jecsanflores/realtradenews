/**
 * Stock Indices API Service
 * Obtiene datos reales de índices bursátiles
 */

const axios = require('axios');

// Datos mock para desarrollo (sin API key)
// En producción, integrar con: Alpha Vantage, Finnhub, o Yahoo Finance
const mockIndices = {
  'SPX': {
    symbol: 'SPX',
    name: 'S&P 500',
    price: 5234.80,
    change: 45.25,
    changePercent: 0.87,
    high: 5240.00,
    low: 5195.50,
    open: 5189.00,
  },
  'INDU': {
    symbol: 'INDU',
    name: 'Dow Jones Industrial Average',
    price: 41250.60,
    change: -120.45,
    changePercent: -0.29,
    high: 41400.00,
    low: 41180.00,
    open: 41371.05,
  },
  'CCMP': {
    symbol: 'CCMP',
    name: 'Nasdaq Composite',
    price: 16432.45,
    change: 89.12,
    changePercent: 0.54,
    high: 16450.00,
    low: 16340.00,
    open: 16343.33,
  },
  'RUT': {
    symbol: 'RUT',
    name: 'Russell 2000',
    price: 2048.35,
    change: 12.50,
    changePercent: 0.61,
    high: 2055.00,
    low: 2030.00,
    open: 2035.85,
  },
  'VIX': {
    symbol: 'VIX',
    name: 'Volatility Index',
    price: 19.94,
    change: 3.30,
    changePercent: 19.83,
    high: 20.50,
    low: 16.80,
    open: 16.64,
  },
  'GOLD': {
    symbol: 'GOLD',
    name: 'Gold (USD/oz)',
    price: 4058.80,
    change: -53.10,
    changePercent: -1.30,
    high: 4120.00,
    low: 4045.00,
    open: 4111.90,
  },
  'EURUSD': {
    symbol: 'EURUSD',
    name: 'EUR/USD',
    price: 1.0950,
    change: 0.0045,
    changePercent: 0.41,
    high: 1.0975,
    low: 1.0920,
    open: 1.0905,
  },
  'WTIC': {
    symbol: 'WTIC',
    name: 'WTI Crude Oil',
    price: 92.10,
    change: 5.27,
    changePercent: 6.07,
    high: 93.50,
    low: 87.00,
    open: 86.83,
  },
};

// Generar datos históricos para gráficos sparkline (últimos 20 puntos)
function generateHistoricalData(basePrice) {
  const data = [];
  let price = basePrice;

  for (let i = 0; i < 20; i++) {
    // Variación aleatoria pequeña
    const variation = (Math.random() - 0.5) * (basePrice * 0.02);
    price = Math.max(price + variation, basePrice * 0.95);
    data.push({
      timestamp: new Date(Date.now() - (20 - i) * 3600000).toISOString(),
      price: parseFloat(price.toFixed(2))
    });
  }

  return data;
}

/**
 * Obtener todos los índices principales
 * @returns {Promise<Array>} Array de índices con datos completos
 */
async function getAllIndices() {
  try {
    const indices = Object.values(mockIndices).map(index => ({
      ...index,
      timestamp: new Date().toISOString(),
      historicalData: generateHistoricalData(index.price)
    }));

    console.log(`[StockIndicesAPI] Fetched ${indices.length} indices`);
    return indices;
  } catch (error) {
    console.error('[StockIndicesAPI] Error fetching indices:', error);
    throw error;
  }
}

/**
 * Obtener índice específico con histórico
 * @param {string} symbol - Símbolo del índice (SPX, INDU, etc)
 * @returns {Promise<Object>} Datos del índice
 */
async function getIndexBySymbol(symbol) {
  try {
    const index = mockIndices[symbol.toUpperCase()];

    if (!index) {
      throw new Error(`Index ${symbol} not found`);
    }

    const indexData = {
      ...index,
      timestamp: new Date().toISOString(),
      historicalData: generateHistoricalData(index.price)
    };

    console.log(`[StockIndicesAPI] Fetched index: ${symbol}`);
    return indexData;
  } catch (error) {
    console.error(`[StockIndicesAPI] Error fetching index ${symbol}:`, error);
    throw error;
  }
}

module.exports = {
  getAllIndices,
  getIndexBySymbol
};
