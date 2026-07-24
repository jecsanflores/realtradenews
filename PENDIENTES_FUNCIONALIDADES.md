# RealTradeNews - Funcionalidades Pendientes y Próximos Pasos

## 🚀 Estado Actual
✅ **COMPLETADO:**
- Landing page profesional
- Sistema de registro/login funcional
- Autenticación JWT
- Base de datos PostgreSQL conectada
- Dashboard básico
- Menú de navegación

❌ **PENDIENTE:**
- Panel de noticias sin datos
- Panel de administración para ver leads
- Configuración de fuentes de datos

---

## 1. **Problema: Noticias Vacías** 📰

### Descripción
El panel "Noticias de Mercado - En Tiempo Real" está vacío. No se están cargando noticias.

### Causa Probable
El web scraper en `backend/src/services/newsScraper.js` no está ejecutándose o no tiene acceso a las fuentes de datos.

### Servicios Involucrados
- **Yahoo Finance**: No está retornando datos
- **Trading Economics API**: Podría necesitar API key
- **Web Scraper**: Podría estar bloqueado por CORS o permisos

### Próximos Pasos
1. Verificar logs del servidor para errores del scraper
2. Configurar API keys si son necesarias
3. Implementar alternative de noticias (RSS feed, API pública)
4. Agregar retry logic para fallos de conexión

---

## 2. **Funcionalidad: Panel de Administración / Leads** 👥

### Descripción
Necesitamos crear una interfaz para que el admin (Jecsan) pueda ver:
- Todos los usuarios registrados
- Email de cada usuario
- Nombre, plan, fecha de registro
- Estado de la suscripción
- Opción de exportar leads a CSV

### Solución Propuesta

#### Opción A: Dashboard Admin Simple (RECOMENDADA)
- Nueva ruta: `/admin`
- Tabla mostrando usuarios
- Filtros por plan/fecha
- Export a CSV
- **Tiempo**: 2-3 horas

#### Opción B: API Endpoint + CLI
- Crear endpoint: `GET /api/admin/users`
- CLI tool para exportar usuarios
- **Tiempo**: 1 hora

#### Opción C: Acceso Directo a Base de Datos
- Usar pgAdmin (Supabase)
- **Ventaja**: Funciona ahora sin desarrollo
- **Desventaja**: No es user-friendly

### Implementación
```javascript
// Agregar a backend/src/routes/auth.js o nuevo archivo admin.js
router.get('/admin/users', verificarAdmin, async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'email', 'name', 'plan', 'created_at', 'email_verified')
      .orderBy('created_at', 'desc');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
```

---

## 3. **Recomendación: Próximas Acciones**

### Orden de Prioridad
1. **CRÍTICO**: Arreglar noticias (usuarios necesitan datos)
2. **IMPORTANTE**: Panel de leads (para tracking de usuarios)
3. **NICE-TO-HAVE**: Más fuentes de noticias

### Timeline
- **Hoy**: Diagnosticar problema de noticias
- **Mañana**: Implementar panel de admin básico
- **Esta semana**: Integrar más fuentes de noticias

---

## 4. **Recursos de Datos Disponibles**

### Noticias
- Yahoo Finance (Cheerio scraper)
- Trading Economics API
- RSS feeds públicas
- Alpha Vantage (si la configuramos)

### Leads
- Base de datos: Tabla `users` en Supabase
- Información: email, name, plan, created_at

---

## 5. **Contacto para Soporte**
Para implementar estas funcionalidades, contacta con el Agent de Replit.
