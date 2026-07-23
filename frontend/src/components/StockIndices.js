/**
 * StockIndices Component
 * Panel de índices bursátiles con gráficos sparkline
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexCard from './IndexCard';
import '../styles/indices.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const StockIndices = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Cargar datos de índices
  useEffect(() => {
    fetchIndices();

    // Actualizar cada 60 segundos
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchIndices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/indices`);

      if (response.data.success) {
        setIndices(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch indices');
      }
    } catch (err) {
      console.error('Error fetching indices:', err);
      setError('Error loading indices');
    } finally {
      setLoading(false);
    }
  };

  // Scroll horizontal del carrusel
  const handleScroll = (direction) => {
    const container = document.getElementById('indices-carousel');
    if (container) {
      const scrollAmount = 300;
      const newPosition = scrollPosition + (direction === 'left' ? -scrollAmount : scrollAmount);

      container.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });

      setScrollPosition(newPosition);
    }
  };

  if (error) {
    return (
      <div className="indices-container">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchIndices} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="indices-container">
      <div className="indices-header">
        <h2>📈 Índices Bursátiles Principales</h2>
        <p className="indices-subtitle">Actualización en tiempo real • Últimas 20 observaciones</p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando índices...</p>
        </div>
      ) : (
        <div className="indices-carousel-wrapper">
          {/* Botón scroll izquierda */}
          <button
            className="carousel-nav left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            ◀
          </button>

          {/* Carrusel de índices */}
          <div className="indices-carousel" id="indices-carousel">
            {indices && indices.length > 0 ? (
              indices.map((index) => (
                <IndexCard key={index.symbol} index={index} />
              ))
            ) : (
              <div className="no-data">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Botón scroll derecha */}
          <button
            className="carousel-nav right"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            ▶
          </button>
        </div>
      )}

      {/* Footer con info de actualización */}
      <div className="indices-footer">
        <p className="update-info">
          🟢 En vivo • Actualizado cada 60 segundos
        </p>
        <button onClick={fetchIndices} className="refresh-button">
          🔄 Actualizar ahora
        </button>
      </div>
    </div>
  );
};

export default StockIndices;
