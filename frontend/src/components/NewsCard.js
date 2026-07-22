import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NewsCard({ news }) {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getImpactBadge = (impact) => {
    const impacts = {
      low: '📊',
      medium: '📈',
      high: '🔴',
      very_high: '🚨',
    };
    return impacts[impact] || '📊';
  };

  return (
    <div className="news-card">
      <div className="news-header">
        <span className="news-source">{news.source}</span>
        <span className="impact-badge">{getImpactBadge(news.impact)}</span>
      </div>

      <h3 className="news-title">{news.title}</h3>

      <p className="news-content">{news.content?.substring(0, 150)}...</p>

      <div className="news-footer">
        <span
          className="sentiment-badge"
          style={{ backgroundColor: getSentimentColor(news.sentiment) }}
        >
          {news.sentiment === 'positive' ? '↑ Positivo' : news.sentiment === 'negative' ? '↓ Negativo' : 'Neutral'}
        </span>

        <time className="news-time">
          {formatDistanceToNow(new Date(news.published_at), {
            addSuffix: true,
            locale: es,
          })}
        </time>
      </div>

      {news.url && (
        <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
          Leer más →
        </a>
      )}
    </div>
  );
}
