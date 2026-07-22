import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <h1 className="nav-logo">RealTradeNews</h1>
          <div className="nav-buttons">
            <button className="nav-btn login" onClick={() => navigate('/login')}>
              Ingresar
            </button>
            <button className="nav-btn register" onClick={() => navigate('/register')}>
              Registrarse Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            ✓ Alertas en Tiempo Real para Inversionistas Inteligentes
          </h1>
          <p className="hero-subtitle">
            No es un asesor. Es información en tiempo real. Monitorea noticias económicas, reportes,
            discursos de Trump y la Fed. Recibe alertas antes que el mercado reaccione.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary-lg" onClick={() => navigate('/register')}>
              Comenzar Gratis - 14 Días
            </button>
            <button className="btn-secondary-lg" onClick={() => {
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver Características ↓
            </button>
          </div>
          <p className="hero-subtext">
            ✅ Sin tarjeta de crédito | ✅ Acceso inmediato | ✅ Cancelar en cualquier momento
          </p>
        </div>

        <div className="hero-visual">
          <div className="chart-mockup">
            <svg viewBox="0 0 400 300" className="chart-svg">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2d2d44" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />

              {/* Chart line */}
              <polyline
                points="20,250 60,200 100,180 140,160 180,120 220,100 260,140 300,80 340,90 380,60"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />

              {/* Data points */}
              <circle cx="20" cy="250" r="4" fill="#10b981"/>
              <circle cx="100" cy="180" r="4" fill="#10b981"/>
              <circle cx="220" cy="100" r="4" fill="#10b981"/>
              <circle cx="380" cy="60" r="4" fill="#10b981"/>

              {/* Labels */}
              <text x="200" y="290" textAnchor="middle" fill="#999" fontSize="12">
                Últimas 24 Horas
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">5,240</h3>
            <p className="stat-label">Inversionistas Activos</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">847K</h3>
            <p className="stat-label">Alertas Enviadas</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">$2.4B</h3>
            <p className="stat-label">Volumen Monitoreado</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">12s</h3>
            <p className="stat-label">Tiempo Promedio Alerta</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Características Principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📰</div>
            <h3>Noticias en Español</h3>
            <p>
              Recibe noticias de Wall Street, eventos económicos y análisis de mercado en tiempo real.
              Desde Yahoo Finance y Investing.com.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Alertas de Noticias en Vivo</h3>
            <p>
              Recibe notificaciones instantáneas cuando ocurren eventos económicos importantes:
              reportes de empleo, decisiones de tasas, discursos de líderes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Calendario Económico</h3>
            <p>
              Ve todos los eventos económicos importantes: reportes de empleo, decisiones de la Fed,
              datos de inflación. Con pronósticos y resultados.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Discursos Políticos</h3>
            <p>
              Sé el primero en enterarte de los anuncios de Trump y la Reserva Federal. Recibe alertas
              cuando están hablando en vivo.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🐦</div>
            <h3>Monitoreo de Líderes</h3>
            <p>
              Sigue tweets y pronunciamientos de Trump, Powell, Lagarde y otros líderes que impacten
              el mercado. Noticias antes que el mercado reaccione.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard Profesional</h3>
            <p>
              Interfaz dark-mode premium. Monitorea múltiples acciones, crea watchlists, ve históricos.
              Diseño perfecto para traders.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="testimonials">
        <h2>Lo que dicen nuestros inversionistas</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p className="testimonial-text">
              "Recibí la alerta 2 minutos antes de que bajara el precio. Pude salir con ganancia.
              Esto vale cada centavo."
            </p>
            <p className="testimonial-author">— Carlos M., Trader profesional</p>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">
              "El calendario económico es increíble. Nunca me pierdo un reporte importante.
              Mi estrategia es 10x mejor ahora."
            </p>
            <p className="testimonial-author">— Ana L., Inversora independiente</p>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">
              "En español y en tiempo real. Exactamente lo que necesitaba. Recomendación 100%."
            </p>
            <p className="testimonial-author">— Roberto S., Gestor de fondos</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2>Planes para Todos los Inversionistas</h2>
        <div className="pricing-grid">
          <div className="pricing-card free">
            <h3>Plan Gratuito</h3>
            <p className="price">$0<span>/mes</span></p>
            <ul className="features-list">
              <li>✓ Noticias con 15-30 min retardo</li>
              <li>✓ 3 watchlists</li>
              <li>✓ Alertas básicas</li>
              <li>✗ Alertas de discursos</li>
              <li>✗ Soporte prioritario</li>
            </ul>
            <button className="btn-plan" onClick={() => navigate('/register')}>
              Comenzar
            </button>
          </div>

          <div className="pricing-card pro featured">
            <span className="badge">MÁS POPULAR</span>
            <h3>Plan Pro</h3>
            <p className="price">$29.99<span>/mes</span></p>
            <ul className="features-list">
              <li>✓ Noticias económicas EN VIVO</li>
              <li>✓ Alertas de discursos (Trump, Fed, Europa)</li>
              <li>✓ Monitoreo de tweets/pronunciamientos</li>
              <li>✓ Calendario económico completo</li>
              <li>✓ Reportes: empleo, inflación, tasas, etc</li>
            </ul>
            <button className="btn-plan pro" onClick={() => navigate('/register')}>
              Probar Ahora - 14 Días Gratis
            </button>
          </div>

          <div className="pricing-card enterprise">
            <h3>Plan Enterprise</h3>
            <p className="price">$99.99+<span>/mes</span></p>
            <ul className="features-list">
              <li>✓ Todo lo del Plan Pro +</li>
              <li>✓ API access</li>
              <li>✓ Integración personalizada</li>
              <li>✓ White-label</li>
              <li>✓ Soporte prioritario 24/7</li>
            </ul>
            <button className="btn-plan" onClick={() => navigate('/register')}>
              Contactar Ventas
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final">
        <h2>¿Listo para tomar mejores decisiones de inversión?</h2>
        <p>Únete a miles de inversionistas que ya usan RealTradeNews</p>
        <button className="btn-cta-large" onClick={() => navigate('/register')}>
          Registrarse Ahora - Es Gratis
        </button>
        <p className="cta-subtext">14 días de prueba. Sin tarjeta de crédito. Cancelar en cualquier momento.</p>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 RealTradeNews. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#privacy">Privacidad</a>
            <a href="#terms">Términos</a>
            <a href="#contact">Contacto</a>
          </div>
        </div>
        <p className="disclaimer">
          Descargo de responsabilidad: RealTradeNews proporciona información de mercado.
          No es asesor financiero. Realiza tu propia investigación antes de invertir.
        </p>
      </footer>
    </div>
  );
}
