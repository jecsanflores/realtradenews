import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { newsService, alertService } from '../services/api';
import NewsCard from '../components/NewsCard';
import EconomicCalendar from '../components/EconomicCalendar';
import PoliticalEvents from '../components/PoliticalEvents';
import AlertsWidget from '../components/AlertsWidget';
import StockIndices from '../components/StockIndices';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [news, setNews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [economicEvents, setEconomicEvents] = useState([]);
  const [politicalEvents, setPoliticalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, alertsRes, eventsRes, politicalRes] = await Promise.all([
        newsService.getMarketNews(30),
        alertService.getAlerts(),
        newsService.getEconomicCalendar(),
        newsService.getPoliticalEvents(),
      ]);

      setNews(newsRes.data || []);
      setAlerts(alertsRes.data || []);
      setEconomicEvents(eventsRes.data || []);
      setPoliticalEvents(politicalRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>RealTradeNews</h1>
          <div className="header-actions">
            <span className="user-info">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              📰 Noticias
            </button>
            <button
              className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              🔔 Mis Alertas ({alerts.length})
            </button>
            <button
              className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              📅 Calendario Económico
            </button>
            <button
              className={`nav-item ${activeTab === 'political' ? 'active' : ''}`}
              onClick={() => setActiveTab('political')}
            >
              🎤 Discursos (Trump/Fed)
            </button>
            <button
              className={`nav-item ${activeTab === 'indices' ? 'active' : ''}`}
              onClick={() => setActiveTab('indices')}
            >
              📊 Índices Bursátiles
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {loading && <div className="loading">Cargando datos...</div>}

          {!loading && activeTab === 'news' && (
            <div className="tab-content">
              <h2>Noticias de Mercado - En Tiempo Real</h2>
              <div className="news-grid">
                {news.map((item, idx) => (
                  <NewsCard key={idx} news={item} />
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === 'alerts' && (
            <div className="tab-content">
              <AlertsWidget alerts={alerts} onRefresh={fetchData} />
            </div>
          )}

          {!loading && activeTab === 'calendar' && (
            <div className="tab-content">
              <h2>Calendario Económico</h2>
              <EconomicCalendar events={economicEvents} />
            </div>
          )}

          {!loading && activeTab === 'political' && (
            <div className="tab-content">
              <h2>Discursos Políticos & Fed</h2>
              <PoliticalEvents events={politicalEvents} />
            </div>
          )}

          {!loading && activeTab === 'indices' && (
            <div className="tab-content">
              <StockIndices />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
