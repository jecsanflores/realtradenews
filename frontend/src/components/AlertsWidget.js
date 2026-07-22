import React, { useState } from 'react';
import { alertService } from '../services/api';

export default function AlertsWidget({ alerts, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'price',
    target: '',
    condition: '',
    notificationMethod: 'both',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await alertService.createAlert(
        formData.type,
        formData.target,
        formData.condition,
        formData.notificationMethod
      );

      setFormData({
        type: 'price',
        target: '',
        condition: '',
        notificationMethod: 'both',
      });
      setShowForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (alertId) => {
    try {
      await alertService.deleteAlert(alertId);
      onRefresh();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const getAlertIcon = (type) => {
    const icons = {
      price: '💰',
      news: '📰',
      political: '🎤',
      economic: '📊',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="alerts-widget">
      <div className="alerts-header">
        <h2>Mis Alertas Activas</h2>
        <button
          className="btn-create-alert"
          onClick={() => setShowForm(!showForm)}
        >
          + Nueva Alerta
        </button>
      </div>

      {showForm && (
        <form className="alert-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Alerta</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="price">Precio de Acción</option>
                <option value="news">Noticia / Palabra Clave</option>
                <option value="political">Discurso Político</option>
                <option value="economic">Evento Económico</option>
              </select>
            </div>

            <div className="form-group">
              <label>Destino (ej: AAPL, MSFT, COVID)</label>
              <input
                type="text"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="AAPL"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Condición</label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                placeholder="above_150, mentions, any_speech"
                required
              />
            </div>

            <div className="form-group">
              <label>Notificación</label>
              <select
                name="notificationMethod"
                value={formData.notificationMethod}
                onChange={handleChange}
              >
                <option value="push">Push</option>
                <option value="email">Email</option>
                <option value="both">Ambas</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Alerta'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className="alert-content">
              <span className="alert-icon">{getAlertIcon(alert.type)}</span>
              <div className="alert-info">
                <h3>{alert.target}</h3>
                <p>
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} • {alert.condition}
                </p>
                <small>
                  {alert.notification_method === 'both' ? '🔔📧' : alert.notification_method === 'push' ? '🔔' : '📧'}
                </small>
              </div>
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(alert.id)}
              title="Eliminar alerta"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {alerts.length === 0 && !showForm && (
        <div className="empty-state">
          <p>🔔 No tienes alertas configuradas</p>
          <p className="subtitle">Crea tu primera alerta para recibir notificaciones</p>
        </div>
      )}
    </div>
  );
}
