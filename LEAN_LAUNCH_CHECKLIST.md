# 🚀 LEAN Launch Checklist - $6/mes (5 HORAS)

## DÍA 1: Setup (3 horas)

### Mañana (30 min)
- [ ] Crear cuenta Vercel (vercel.com) → GitHub auth
- [ ] Deploy frontend:
  - [ ] New Project → Select realtradenews repo
  - [ ] Framework: React
  - [ ] Env var: `REACT_APP_API_URL=https://[tu-railway].up.railway.app/api`
  - [ ] Deploy
  - [ ] Vercel da URL automática

### Medio día (30 min) 
- [ ] Crear Supabase (supabase.com) → GitHub auth
- [ ] New Project → realtradenews
- [ ] Copy DATABASE_URL
- [ ] Create table (migrations)

### Tarde (2 horas)
- [ ] Crear Railway (railway.app) → GitHub auth
- [ ] New Project → realtradenews repo
- [ ] Auto-detecta Node.js
- [ ] Variables de entorno:
  ```
  DATABASE_URL=[de Supabase]
  REDIS_URL=[próximo paso]
  NODE_ENV=production
  JWT_SECRET=[generar]
  STRIPE_SECRET_KEY=[tu key]
  FRONTEND_URL=[Vercel URL o future domain]
  PORT=3000
  ```
- [ ] Deploy automático
- [ ] Copiar Railway domain (ej: realtradenews-api.up.railway.app)

### Noche (30 min)
- [ ] Crear Upstash (upstash.com)
- [ ] New DB → realtradenews-cache
- [ ] Copy REDIS_URL
- [ ] Pegar en Railway variables
- [ ] Railway auto-redeploy

---

## DÍA 2: Domain & Launch (2 horas)

### Mañana (1 hora)
- [ ] Comprar dominio realtradenews.com
  - [ ] Ir a Namecheap.com
  - [ ] Buscar: realtradenews.com
  - [ ] Comprar por 1 año (~$0.92/mes)

- [ ] Conectar a Vercel:
  - [ ] En Vercel → Settings → Domains
  - [ ] Add Custom Domain: realtradenews.com
  - [ ] Copiar nameservers
  - [ ] En Namecheap: Cambiar nameservers
  - [ ] Esperar propagación (5-30 min)
  - [ ] ✅ Vercel HTTPS automático

### Tarde (1 hora)
- [ ] Conectar Railway a dominio (opcional para MVP):
  - Opción A: Usar subdomain gratis: api.realtradenews.up.railway.app
  - Opción B: Custom domain en Railway ($10, hazlo luego)
  - Por ahora: Usa Opción A

- [ ] Test todo:
  - [ ] Abre https://realtradenews.com (debería cargar frontend)
  - [ ] Abre https://[railway-domain]/health (backend)
  - [ ] Intenta registrarte
  - [ ] Intenta login
  - [ ] Intenta crear alerta

- [ ] **🚀 LAUNCH**
  - [ ] Verifica una vez más que todo funciona
  - [ ] Activa Stripe en producción
  - [ ] Anuncia en redes

---

## URLs después de Lanzar

```
🌐 Frontend:     https://realtradenews.com
🔌 API:          https://[railway-domain].up.railway.app
💰 Manage:       Vercel Dashboard
📊 Monitor:      Railway Dashboard
📦 Database:     Supabase Dashboard
💾 Cache:        Upstash Dashboard
```

---

## Costos Mensuales

| Servicio | Costo |
|----------|-------|
| Vercel | $0 |
| Railway | $5 |
| Supabase | $0 |
| Upstash | $0 |
| Sendgrid | $0 |
| Namecheap | $0.92 |
| **TOTAL** | **$5.92/mes** |

---

## Cuando Escalar (después de lanzar)

| Milestone | Action | Costo |
|-----------|--------|-------|
| 100 users | Nada, escala automático | $5.92 |
| 500 users | Railway: upgrade tier | $15-20 |
| 5K users | Considerar AWS | $50-100 |

---

## Problemas Comunes & Solución

| Problema | Solución |
|----------|----------|
| Frontend no carga | Verificar Vercel deploy logs |
| Backend error 502 | Revisar Railway logs |
| Database connection error | Copiar DATABASE_URL correctamente |
| Redis connection error | Verificar Upstash REDIS_URL |
| Domain no resuelve | Esperar 24h propagación DNS |

---

## Ventaja Principal

**En lugar de:**
- Esperar 48 horas
- Gastar $75/mes
- Configurar 10 servicios AWS
- Riesgo de no vender

**Haces:**
- Lanzar en 5 horas
- Gastar $6/mes
- 4 servicios super fáciles
- Cero riesgo financiero

**Si consigues 1 usuario Pro que pague $29.99:**
- Ya pagaste el dominio
- Ya tienes ganancia

---

## MAÑANA A LAS 6PM ESTARÁS VENDIENDO 🚀

¿Empezamos?

1. Copia este checklist
2. Abre 4 tabs: Vercel, Supabase, Railway, Upstash
3. Sigue cada paso
4. En 5 horas: LIVE

¡Vamos!
