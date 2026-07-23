/**
 * IndexCard Component
 * Tarjeta individual para cada índice bursátil
 */

import React from 'react';
import Sparkline from './Sparkline';
import '../styles/indices.css';

const IndexCard = ({ index }) => {
  const isPositive = index.change >= 0;
  const changeSymbol = isPositive ? '▲' : '▼';
  const changeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className={`index-card ${isPositive ? 'up' : 'down'}`}>
      {/* Header con nombre y símbolo */}
      <div className="index-header">
        <div>
          <h3 className="index-name">{index.name}</h3>
          <p className="index-symbol">{index.symbol}</p>
        </div>
      </div>

      {/* Precio actual */}
      <div className="index-price">
        ${index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Cambio y porcentaje */}
      <div className="index-change" style={{ color: changeColor }}>
        <span className="change-symbol">{changeSymbol}</span>
        <span className="change-amount">${Math.abs(index.change).toFixed(2)}</span>
        <span className="change-percent">({index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)</span>
      </div>

      {/* Gráfico sparkline */}
      <div className="index-sparkline">
        <Sparkline
          data={index.historicalData}
          isPositive={isPositive}
        />
      </div>

      {/* Footer con hora y max/min */}
      <div className="index-footer">
        <span className="index-time">H: ${index.high.toFixed(2)}</span>
        <span className="index-time">L: ${index.low.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default IndexCard;
