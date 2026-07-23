/**
 * Stock Indices Routes
 * Endpoints para obtener datos de índices bursátiles
 */

const express = require('express');
const router = express.Router();
const stockIndicesAPI = require('../services/stockIndicesAPI');

/**
 * GET /api/indices
 * Obtener todos los índices principales
 */
router.get('/', async (req, res) => {
  try {
    const indices = await stockIndicesAPI.getAllIndices();
    res.json({
      success: true,
      count: indices.length,
      data: indices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all indices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indices',
      message: error.message
    });
  }
});

/**
 * GET /api/indices/:symbol
 * Obtener índice específico con datos históricos
 * Ejemplo: /api/indices/SPX
 */
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const index = await stockIndicesAPI.getIndexBySymbol(symbol);

    res.json({
      success: true,
      data: index,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching index ${req.params.symbol}:`, error);
    res.status(404).json({
      success: false,
      error: 'Index not found',
      message: error.message
    });
  }
});

module.exports = router;
