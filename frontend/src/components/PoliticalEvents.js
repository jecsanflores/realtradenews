import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PoliticalEvents({ events }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#3b82f6';
      case 'in_progress': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: '⏳ Próximo',
      in_progress: '🔴 En vivo',
      completed: '✅ Completado',
    };
    return labels[status] || status;
  };

  const getSpeakerIcon = (speaker) => {
    if (speaker?.includes('Trump')) return '🗣️';
    if (speaker?.includes('Powell') || speaker?.includes('Fed')) return '🏦';
    return '🎤';
  };

  return (
    <div className="political-events">
      <div className="events-list">
        {events.map((event, idx) => (
          <div key={idx} className="event-item">
            <div className="event-header">
              <span className="speaker-icon">{getSpeakerIcon(event.speaker)}</span>
              <div className="event-title-section">
                <h3>{event.title}</h3>
                <p className="speaker-name">{event.speaker}</p>
              </div>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(event.status) }}
              >
                {getStatusLabel(event.status)}
              </span>
            </div>

            <div className="event-details">
              <div className="detail">
                <strong>📅 Fecha:</strong> {format(new Date(event.date), 'PPP - HH:mm', { locale: es })}
              </div>
              {event.location && (
                <div className="detail">
                  <strong>📍 Ubicación:</strong> {event.location}
                </div>
              )}
              {event.description && (
                <div className="detail">
                  <strong>📝 Descripción:</strong> {event.description}
                </div>
              )}
            </div>

            {event.url && (
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">
                Ver transcripción →
              </a>
            )}
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="empty-state">
          <p>🎤 No hay discursos próximos de Trump o la Fed</p>
        </div>
      )}
    </div>
  );
}
