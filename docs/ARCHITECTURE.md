# RealTradeNews - Arquitectura Técnica

## Visión General

```
Frontend (Web/Mobile)
        ↓
    API Gateway (Express)
        ↓
    ┌───────────────────┬────────────────┬──────────────┐
    ↓                   ↓                ↓              ↓
Auth Service      News Service      Alert Service   Payment Service
    ↓                   ↓                ↓              ↓
PostgreSQL          Redis Cache    Notification     Stripe API
    ↓                   ↓           Queue (Bull)
    │              External APIs         ↓
    │              - Trading Econ       Firebase
    │              - Polygon.io
    │              - Yahoo Finance
    └───────────────────────────────────┘
```

## Componentes Principales

### 1. Backend (Node.js/Express)
- **Framework**: Express.js
- **Runtime**: Node.js
- **Base de datos**: PostgreSQL
- **Caché**: Redis
- **Colas**: Bull (para procesamiento asincrónico)

### 2. Autenticación
- JWT (JSON Web Tokens)
- OAuth2 ready (Google, Apple)
- Bcrypt para hash de contraseñas

### 3. Pagos
- Stripe (processing + webhooks)
- Planes: Free, Pro ($29.99/mes), Enterprise ($99.99+/mes)
- Manejo de suscripciones

### 4. Fuentes de Datos
| Fuente | Endpoint | Frecuencia | Propósito |
|--------|----------|-----------|----------|
| Trading Economics | API pago | Minuto a minuto | Calendario económico + datos macro |
| Polygon.io | API pago | Tiempo real | Precios NYSE |
| Yahoo Finance ES | Web scraping | Cada minuto | Noticias, análisis |
| Investing.com | Web scraping | Cada minuto | Noticias alternativas |
| Casa Blanca | Scraping agenda | Diario | Eventos políticos |
| FOMC | Scraping calendario | Diario | Anuncios Fed |

### 5. Notificaciones
- Push notifications (Firebase Cloud Messaging)
- Email (SendGrid)
- In-app alerts via WebSocket

### 6. Frontend
- **Web**: React + Redux
- **Mobile**: React Native (iOS + Android)

## Base de Datos (PostgreSQL)

### Tablas Principales

```sql
-- Usuarios
users (id, email, password_hash, name, plan, created_at, updated_at)

-- Alertas
alerts (id, user_id, type, target, condition, notification_method, active, created_at)

-- Noticias (caché)
news (id, title, source, content, sentiment, impact, published_at)

-- Calendario Económico
economic_events (id, date, country, event, forecast, previous, importance, result)

-- Eventos Políticos
political_events (id, speaker, date, title, location, status, transcript_url)

-- Transacciones de Pago
subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_end)
```

## Flow de Datos en Tiempo Real

### 1. Noticias
```
Scraping Schedule (cada minuto)
  ↓
Fetch Yahoo Finance ES + Investing.com
  ↓
Parse y normalizar contenido
  ↓
Almacenar en PostgreSQL
  ↓
Cachear en Redis (60 segundos)
  ↓
Notificar a usuarios via WebSocket
```

### 2. Alertas de Precios
```
User crea alert: "Notificar si AAPL > 150"
  ↓
Almacenar en DB
  ↓
Background job (Bull Queue) cada 10 segundos
  ↓
Comparar precio actual vs condición
  ↓
Si cumple: Enviar push + email + in-app
```

### 3. Alertas de Discursos
```
Monitorear agenda de Casa Blanca + FOMC (diario)
  ↓
Si nuevo evento encontrado:
  ↓
Crear en DB
  ↓
Notificar a usuarios que pidieron alertas
  ↓
Cuando evento en vivo: Enviar notificación urgente
```

## Seguridad

- HTTPS obligatorio
- CORS configurado por origen
- Rate limiting en endpoints sensibles
- Helmet.js para headers HTTP
- Validación de entrada (express-validator)
- JWT expira en 7 días
- Stripe handles PCI compliance

## Escalabilidad

- Base de datos PostgreSQL replicable
- Redis para caché distribuido
- Bull queues para procesamiento
- WebSockets para updates en vivo
- CDN ready (imagenes, assets)

## Deployment

- AWS EC2 (backend)
- AWS RDS (PostgreSQL)
- AWS ElastiCache (Redis)
- CloudFlare (DNS + DDoS protection)

## Fase 1 Completado
✅ Estructura Express
✅ Rutas autenticación (JWT)
✅ Integración Stripe
✅ Rutas noticias, eventos, alertas
✅ Documentación arquitectura

## Fase 2 (Próxima)
- Implementar PostgreSQL + migrations
- Integrar Trading Economics API
- Scraping robusto de noticias
- Sistema de colas Bull
