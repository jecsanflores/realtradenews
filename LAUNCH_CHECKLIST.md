# 🚀 RealTradeNews - Launch Checklist (48 horas)

## Día 1: Infrastructure & Backend (24 horas)

### Mañana (6 horas) - AWS Setup
- [ ] Crear cuenta AWS (AWS Console)
- [ ] Crear EC2 instance (t3.medium, Ubuntu 22.04)
  - Guarda: Public IP (ej: 54.123.45.67)
- [ ] Crear RDS PostgreSQL (db.t3.micro)
  - Guarda: DB endpoint, master password
- [ ] Crear ElastiCache Redis
  - Guarda: Redis endpoint
- [ ] Crear S3 buckets (logs + frontend)

### Medio Día (6 horas) - Backend Deploy
- [ ] SSH a tu EC2
- [ ] Instalar Node.js + PM2 + Nginx
- [ ] Clonar repositorio
- [ ] Crear .env con credenciales AWS
- [ ] Correr migraciones: `npx knex migrate:latest`
- [ ] Iniciar con PM2: `pm2 start src/index.js`
- [ ] Configurar Nginx
- [ ] Verificar: `curl http://IP:3000/health`

### Tarde (6 horas) - Frontend & Dominio
- [ ] En tu máquina: `npm run build` en frontend/
- [ ] Subir build a S3
- [ ] Crear CloudFront distribution
- [ ] Comprar dominio (realtradenews.com)
- [ ] Setear Route53 en AWS

---

## Día 2: SSL & Launch (24 horas)

### Mañana (6 horas) - DNS & SSL
- [ ] Cambiar nameservers en registrador
- [ ] Crear registros DNS en Route53
  - api.realtradenews.com → EC2 IP
  - realtradenews.com → CloudFront
  - www.realtradenews.com → CloudFront
- [ ] Crear certificado SSL en AWS ACM
- [ ] Configurar SSL en Nginx

### Medio Día (6 horas) - Testing
- [ ] Probar: https://realtradenews.com (debería cargar frontend)
- [ ] Probar: https://api.realtradenews.com/health
- [ ] Prueba login (crear cuenta)
- [ ] Prueba crear una alerta
- [ ] Prueba ver noticias

### Tarde (6 horas) - Production Ready
- [ ] Configurar PM2 para auto-restart
- [ ] Setup CloudWatch monitoring
- [ ] Configurar backups automáticos
- [ ] Documentar contraseñas en password manager
- [ ] Actualizar STRIPE_SECRET_KEY con claves de producción

### Noche (6 horas) - Launch! 🚀
- [ ] Último test completo
- [ ] Anunciar en redes sociales
- [ ] Enviar email a primeros usuarios
- [ ] Monitorear logs en tiempo real
- [ ] Responder feedback
- [ ] **CELEBRAR!** 🎉

---

## Archivos Clave a Tener Lista

```
✅ realtradenews-key.pem    (SSH key)
✅ AWS credentials          (Access key + secret)
✅ .env (backend)           (Todas las credenciales)
✅ Dominio comprado         (realtradenews.com)
✅ Build folder (frontend)  (npm run build)
✅ Stripe API keys          (prod keys)
✅ Base de datos backup     (para seguridad)
```

---

## Comandos Rápidos

### SSH a tu servidor
```bash
ssh -i realtradenews-key.pem ubuntu@54.123.45.67
```

### Ver logs
```bash
pm2 logs
```

### Reiniciar backend
```bash
pm2 restart all
```

### Subir archivos a S3
```bash
aws s3 sync build/ s3://realtradenews-web-20260721 --delete
```

### Check SSL
```bash
curl -I https://api.realtradenews.com/health
```

---

## En caso de Problema

| Problema | Solución |
|----------|----------|
| Backend no responde | `pm2 restart all` |
| DNS no resuelve | Esperar 24-48h, revisar Route53 |
| SSL error | Revisar certificado en ACM |
| Base de datos error | Revisar security group RDS |
| Frontend no carga | Revissar CloudFront cache |

---

## Costos Día 1
- Dominio: ~$12 (anual)
- AWS: ~$2-5 (first day)

## Costos Mensales
- Total: ~$75/mes
- Break-even: ~$1,000 en ventas/mes (con Plan Pro $30)

---

## Después del Lanzamiento

**Día 1**: Monitorea cada hora  
**Día 2-3**: Monitorea 2x diaria  
**Semana 1**: Recopila feedback  
**Semana 2**: Implementa mejoras críticas  

---

✅ **Listo para lanzar?**

Cuando completés todos los checks, estarás vendiendo a inversionistas reales.

**Tiempo total**: 48 horas  
**Costo**: ~$20-50  
**Ingresos potenciales**: Ilimitados 🚀
