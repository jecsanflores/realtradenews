# RealTradeNews - Deployment en AWS (48 horas)

## Timeline
- **Horas 0-4**: Setup AWS infrastructure
- **Horas 4-8**: Deploy backend
- **Horas 8-12**: Deploy frontend
- **Horas 12-24**: Testing en producción
- **Horas 24-48**: Domain + SSL + Launch

---

## FASE 1: Setup AWS (Horas 0-4)

### 1. Crear Cuenta AWS
1. Ve a https://aws.amazon.com
2. Click "Create an AWS Account"
3. Email: jecsanflores@gmail.com
4. Setup billing (tarjeta de crédito)
5. Selecciona región: **us-east-1** (Virginia)

### 2. Crear EC2 Instance (Backend)
```bash
# En AWS Console:
1. Ir a EC2 → Launch Instance
2. Nombre: "realtradenews-backend"
3. AMI: Ubuntu 22.04 LTS
4. Instance type: t3.medium (costo: ~$30/mes)
5. Key pair: Crear "realtradenews-key" (guarda el .pem)
6. Security group: 
   - Allow SSH (22) from your IP
   - Allow HTTP (80) from 0.0.0.0/0
   - Allow HTTPS (443) from 0.0.0.0/0
7. Storage: 20GB gp3
8. Launch

# Guarda la IP pública (ej: 54.123.45.67)
```

### 3. Crear RDS Database (PostgreSQL)
```bash
# En AWS Console:
1. Ir a RDS → Create database
2. Engine: PostgreSQL 14
3. Deployment: Single AZ
4. DB instance class: db.t3.micro (costo: ~$10/mes)
5. Storage: 20GB gp2
6. DB name: realtradenews
7. Master username: postgres
8. Master password: [Genera contraseña segura]
9. Publicly accessible: Yes
10. Create

# Guarda el endpoint (ej: realtradenews-db.xxx.us-east-1.rds.amazonaws.com)
```

### 4. Crear ElastiCache (Redis)
```bash
# En AWS Console:
1. Ir a ElastiCache → Create cluster
2. Engine: Redis
3. Cache node type: cache.t3.micro
4. Number of nodes: 1
5. Multi-AZ: Disabled
6. Automatic failover: Disabled
7. Create

# Guarda el endpoint (ej: realtradenews-cache.xxx.cache.amazonaws.com)
```

### 5. Crear S3 Bucket (para logs)
```bash
# En AWS Console:
1. Ir a S3 → Create bucket
2. Name: realtradenews-logs-20260721
3. Region: us-east-1
4. Block all public access: ON
5. Create

# Este bucket guardará logs de la aplicación
```

---

## FASE 2: Configurar Backend en EC2 (Horas 4-8)

### 1. Conectar a EC2
```bash
# En tu terminal local:
chmod 600 ~/Downloads/realtradenews-key.pem
ssh -i ~/Downloads/realtradenews-key.pem ubuntu@54.123.45.67

# Ya estás dentro del servidor EC2
```

### 2. Instalar dependencias
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2

# Instalar Git
sudo apt install -y git

# Verificar
node --version
npm --version
```

### 3. Clonar repositorio
```bash
cd /home/ubuntu
git clone https://github.com/tu-usuario/realtradenews.git
cd realtradenews/backend
npm install
```

### 4. Configurar variables de entorno
```bash
nano .env
```

Pega esto y reemplaza con tus valores de AWS:
```
DATABASE_URL=postgresql://postgres:TU_PASS@realtradenews-db.xxx.us-east-1.rds.amazonaws.com:5432/realtradenews
REDIS_URL=redis://realtradenews-cache.xxx.cache.amazonaws.com:6379
NODE_ENV=production
PORT=3000
JWT_SECRET=generar_clave_segura_aqui_12345678
STRIPE_SECRET_KEY=sk_live_tu_clave_stripe
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_secret
TRADING_ECONOMICS_API_KEY=tu_api_key
POLYGON_API_KEY=tu_api_key
SENDGRID_API_KEY=tu_sendgrid_key
FRONTEND_URL=https://realtradenews.com
MOBILE_APP_URL=com.realtradenews.app
```

### 5. Ejecutar migraciones
```bash
cd /home/ubuntu/realtradenews/backend
npx knex migrate:latest
```

### 6. Iniciar con PM2
```bash
pm2 start src/index.js --name "realtradenews-api"
pm2 startup
pm2 save

# Verificar
pm2 status
curl http://localhost:3000/health
```

### 7. Configurar Nginx (proxy reverso)
```bash
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/realtradenews
```

Pega esto:
```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luego:
```bash
sudo ln -s /etc/nginx/sites-available/realtradenews /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 8. Verificar backend
```bash
curl http://54.123.45.67/health
# Deberías ver: {"status":"RealTradeNews API running","version":"0.1.0"}
```

---

## FASE 3: Deploy Frontend en S3 + CloudFront (Horas 8-12)

### 1. Build del frontend
```bash
# En tu máquina local:
cd frontend

# Editar package.json (cambiar REACT_APP_API_URL)
nano .env
```

Cambiar a:
```
REACT_APP_API_URL=https://api.realtradenews.com/api
REACT_APP_APP_NAME=RealTradeNews
```

Luego:
```bash
npm run build
# Crea la carpeta "build" con archivos optimizados
```

### 2. Crear S3 bucket para frontend
```bash
# En AWS Console:
1. Ir a S3 → Create bucket
2. Name: realtradenews-web-20260721
3. Region: us-east-1
4. Block all public access: OFF (desmarca todos)
5. Create

# Configurar para hosting estático:
1. Click en el bucket
2. Properties → Edit static website hosting
3. Enable
4. Index document: index.html
5. Error document: index.html
6. Save
```

### 3. Subir archivos
```bash
# Instalar AWS CLI si no lo tienes
pip install awscli

# Configurar credenciales
aws configure
# Ingresa: Access Key, Secret Key, Region (us-east-1)

# Subir build
cd build
aws s3 sync . s3://realtradenews-web-20260721 --delete --cache-control "max-age=31536000,public" --exclude "*.html"
aws s3 cp . s3://realtradenews-web-20260721 --recursive --exclude "*" --include "*.html" --cache-control "max-age=0,no-cache"
```

### 4. Crear CloudFront Distribution
```bash
# En AWS Console:
1. Ir a CloudFront → Create distribution
2. Origin domain: realtradenews-web-20260721.s3.us-east-1.amazonaws.com
3. S3 access: Create Origin Access Policy
4. Viewer policy: Redirect HTTP to HTTPS
5. Compress automatically: Yes
6. Create

# Guarda el Domain Name (ej: d123.cloudfront.net)
```

---

## FASE 4: Setup Dominio (Horas 12-24)

### 1. Comprar dominio
1. Ve a GoDaddy, Namecheap, o Route53
2. Busca: `realtradenews.com`
3. Compra por 1 año (~$12)
4. Guarda los nameservers

### 2. Configurar Route53 (AWS)
```bash
# En AWS Console:
1. Ir a Route53 → Create hosted zone
2. Domain: realtradenews.com
3. Create

# Copiar los nameservers dados
# Ir a tu registrador (GoDaddy) y actualizar nameservers con los de AWS

# Esperar ~24-48 horas para propagación
```

### 3. Crear registros DNS en Route53
```bash
# En Route53:
1. Click en realtradenews.com
2. Create record:
   - Name: api.realtradenews.com
   - Type: A
   - Value: 54.123.45.67 (IP de tu EC2)
   - TTL: 300

3. Create record:
   - Name: realtradenews.com
   - Type: A
   - Alias to CloudFront distribution
   - Select your distribution (d123.cloudfront.net)
   - TTL: 300

4. Create record:
   - Name: www.realtradenews.com
   - Type: A
   - Alias to CloudFront distribution
   - Same distribution
   - TTL: 300
```

### 4. SSL Certificate (HTTPS)
```bash
# En AWS ACM:
1. Ir a Certificate Manager
2. Request a certificate
3. Domain: realtradenews.com
4. Add another domain: api.realtradenews.com, www.realtradenews.com
5. Validation: DNS
6. Click "Create records in Route53"
7. Wait for validation (~15 min)

# Luego en CloudFront:
1. Edit distribution
2. Add custom SSL certificate
3. Select el certificado creado
4. Save
```

### 5. Configurar Nginx para HTTPS
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --nginx -d api.realtradenews.com

# Editar nginx config
sudo nano /etc/nginx/sites-available/realtradenews
```

Actualizar a:
```nginx
server {
    listen 80;
    server_name api.realtradenews.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.realtradenews.com;
    
    ssl_certificate /etc/letsencrypt/live/api.realtradenews.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.realtradenews.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luego:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## FASE 5: Testing & Launch (Horas 24-48)

### 1. Verificar conectividad
```bash
# Probar backend
curl https://api.realtradenews.com/health

# Probar frontend
curl https://realtradenews.com/

# Probar login
curl -X POST https://api.realtradenews.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}'
```

### 2. Testing en navegador
1. Abre https://realtradenews.com
2. Intenta registrarte
3. Intenta login
4. Crea una alerta
5. Verifica que carguen noticias

### 3. Monitoreo
```bash
# En EC2:
pm2 logs
pm2 monit

# En CloudWatch:
1. AWS Console → CloudWatch
2. Ver métricas de EC2, RDS, ElastiCache
3. Crear alarmas si CPU > 80%
```

### 4. Setup de backups
```bash
# RDS backups: Ya automático (7 días)
# Configurar en AWS Console si quieres más

# EC2 snapshots:
1. Click en tu instancia
2. Image and templates → Create image
3. Setup snapshot automático cada 24h
```

---

## COSTOS MENSUALES ESTIMADOS

| Servicio | Costo/mes |
|----------|-----------|
| EC2 t3.medium | $30 |
| RDS PostgreSQL micro | $10 |
| ElastiCache Redis micro | $15 |
| S3 (almacenaje) | $5 |
| CloudFront (transferencia) | $10-20 |
| Route53 (DNS) | $0.50 |
| **TOTAL** | **~$70-75/mes** |

*Puedes reducir a ~$30 usando instancia más pequeña en primeras semanas*

---

## PASO POST-LAUNCH (Primeros días)

1. **Monitorea errores** - Revisa logs cada hora
2. **Comunica con primeros usuarios** - Recibe feedback
3. **Fix bugs críticos** - Responde rápido
4. **Mejora performance** - Optimiza queries lentas
5. **Escala si es necesario** - Aumenta instancia

---

## Checklist de Lanzamiento

- [ ] Cuenta AWS creada
- [ ] EC2 + RDS + ElastiCache corriendo
- [ ] Backend deployado y testeado
- [ ] Frontend en S3 + CloudFront
- [ ] Dominio comprado y DNS configurado
- [ ] SSL/HTTPS funcionando
- [ ] Login/Register probado
- [ ] Alertas funcionando
- [ ] Noticias cargando
- [ ] Stripe integrado
- [ ] Monitoreo configurado
- [ ] **🚀 LANZAMIENTO**

---

## Links Útiles

- AWS Console: https://console.aws.amazon.com
- Route53: https://console.aws.amazon.com/route53
- CloudFront: https://console.aws.amazon.com/cloudfront
- Certbot docs: https://certbot.eff.org/

---

## Soporte

Si algo falla:
1. Revisa los logs: `pm2 logs`
2. Revisa CloudWatch
3. Revisa security groups (puertos abiertos?)
4. Reinicia: `pm2 restart all`

¡Éxito! 🚀
