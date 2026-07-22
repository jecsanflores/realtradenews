import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EconomicCalendar({ events }) {
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'very_high': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getImportanceLabel = (importance) => {
    const labels = {
      very_high: '🚨 Crítico',
      high: '⚠️ Alto',
      medium: '📊 Medio',
      low: '📈 Bajo',
    };
    return labels[importance] || importance;
  };

  return (
    <div className="calendar-container">
      <table className="calendar-table">
        <thead>
          <tr>
            <th>Fecha & Hora</th>
            <th>País</th>
            <th>Evento</th>
            <th>Importancia</th>
            <th>Pronóstico</th>
            <th>Anterior</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, idx) => (
            <tr key={idx} className="calendar-row">
              <td className="date-cell">
                <strong>{format(new Date(event.date), 'dd MMM', { locale: es })}</strong>
                <br />
                <small>{event.time}</small>
              </td>
              <td>{event.country}</td>
              <td className="event-cell">{event.event}</td>
              <td>
                <span
                  className="importance-badge"
                  style={{ backgroundColor: getImportanceColor(event.importance) }}
                >
                  {getImportanceLabel(event.importance)}
                </span>
              </td>
              <td className="forecast">{event.forecast || '-'}</td>
              <td className="previous">{event.previous || '-'}</td>
              <td className="actual">{event.actual || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {events.length === 0 && (
        <div className="empty-state">
          <p>📅 No hay eventos económicos próximos</p>
        </div>
      )}
    </div>
  );
}
