# 🚀 Guía de Deployment - Tablero LatinCrack

## 📋 Cambios Realizados

### Morgan Logging Middleware
- **Paquete instalado:** `morgan@^1.10.0`
- **Formato:** `dev` (colorizado para desarrollo)
- **Ubicación:** `api/server.js:16`

### Formato de Logs

Morgan con formato `dev` muestra:
```
:method :url :status :response-time ms - :res[content-length]
```

**Ejemplo de salida:**
```
GET /api/tasks 200 45.123 ms - 1234
POST /api/tasks 201 89.456 ms - 567
PUT /api/tasks/abc-123 200 34.789 ms - 567
DELETE /api/tasks/abc-123 200 23.456 ms - 89
GET /health 200 2.345 ms - 52
```

**Códigos de color:**
- 🟢 Verde: 2xx (Success)
- 🔵 Cyan: 3xx (Redirect)
- 🟡 Amarillo: 4xx (Client Error)
- 🔴 Rojo: 5xx (Server Error)

---

## 🔄 Proceso de Deployment

### Opción 1: Deployment Local (Testing)

```bash
# 1. Detener servicios actuales
docker-compose down

# 2. Reconstruir solo el servicio API
docker-compose build api

# 3. Levantar servicios
docker-compose up -d

# 4. Ver logs del API en tiempo real
docker-compose logs -f api
```

### Opción 2: Deployment Completo (Rebuild All)

```bash
# 1. Detener y limpiar
docker-compose down

# 2. Reconstruir todos los servicios
docker-compose up -d --build

# 3. Verificar que todos los servicios están corriendo
docker-compose ps

# 4. Ver logs combinados
docker-compose logs -f
```

### Opción 3: Deployment en Producción (VPS Linode)

#### Paso 1: Conectar al VPS
```bash
ssh root@tu-vps-ip
# O con usuario específico:
ssh tu-usuario@tu-vps-ip
```

#### Paso 2: Navegar al Proyecto
```bash
cd /ruta/a/tu/proyecto
# Ejemplo: cd /opt/latincrack-kanban
```

#### Paso 3: Actualizar Código
```bash
# Si usas Git
git pull origin main

# O si subes archivos manualmente
# scp api/package.json root@tu-vps-ip:/ruta/proyecto/api/
# scp api/server.js root@tu-vps-ip:/ruta/proyecto/api/
```

#### Paso 4: Rebuild y Deploy
```bash
# Detener servicios
docker-compose down

# Reconstruir API (solo el servicio modificado)
docker-compose build api

# Levantar servicios
docker-compose up -d

# Verificar estado
docker-compose ps
```

#### Paso 5: Verificar Logs
```bash
# Ver logs del API
docker-compose logs -f api

# Deberías ver algo como:
# latincrack-api | 🚀 API corriendo en http://localhost:3000
# latincrack-api | 📊 Health check: http://localhost:3000/health
# latincrack-api | ✅ Conectado a PostgreSQL
```

---

## 🧪 Testing del Logging

### Test 1: Health Check
```bash
# Desde tu máquina local (si tienes acceso al VPS)
curl http://tu-vps-ip:3000/health

# Desde el VPS
curl http://localhost:3000/health

# Log esperado:
# GET /health 200 2.345 ms - 52
```

### Test 2: Obtener Tareas
```bash
curl http://tu-vps-ip:3000/api/tasks

# Log esperado:
# GET /api/tasks 200 45.123 ms - 1234
```

### Test 3: Crear Tarea
```bash
curl -X POST http://tu-vps-ip:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test desde curl",
    "description": "Probando logging",
    "priority": "high",
    "status": "todo"
  }'

# Log esperado:
# POST /api/tasks 201 89.456 ms - 567
```

### Test 4: Usar la Aplicación
1. Abre http://tu-vps-ip en el navegador
2. Crea, edita, mueve o elimina tareas
3. Observa los logs en tiempo real:
```bash
docker-compose logs -f api
```

**Verás algo como:**
```
latincrack-api | GET /api/tasks 200 45.123 ms - 1234
latincrack-api | POST /api/tasks 201 89.456 ms - 567
latincrack-api | PUT /api/tasks/abc-123 200 34.789 ms - 567
latincrack-api | GET /api/tasks 200 23.456 ms - 1234
```

---

## 📊 Monitoreo de Tráfico

### Ver Logs en Tiempo Real
```bash
# Solo API
docker-compose logs -f api

# Todos los servicios
docker-compose logs -f

# Últimas 100 líneas del API
docker-compose logs --tail=100 api

# Filtrar solo errores
docker-compose logs api | grep -i error

# Filtrar por método HTTP
docker-compose logs api | grep POST
docker-compose logs api | grep GET
```

### Análisis de Performance
```bash
# Ver tiempos de respuesta lentos (>100ms)
docker-compose logs api | grep -E "[0-9]{3,}\.[0-9]+ ms"

# Contar peticiones por método
docker-compose logs api | grep -oE "GET|POST|PUT|DELETE" | sort | uniq -c

# Ver errores 4xx y 5xx
docker-compose logs api | grep -E " [45][0-9]{2} "
```

---

## 🔍 Troubleshooting

### Problema: Morgan no aparece en los logs

**Solución 1: Verificar que morgan está instalado**
```bash
docker exec -it latincrack-api sh
npm list morgan
# Debería mostrar: morgan@1.10.0
exit
```

**Solución 2: Reconstruir la imagen**
```bash
docker-compose down
docker-compose build --no-cache api
docker-compose up -d
```

**Solución 3: Verificar el código**
```bash
docker exec -it latincrack-api sh
cat server.js | grep morgan
# Debería mostrar:
# import morgan from 'morgan';
# app.use(morgan('dev'));
exit
```

### Problema: Logs no se ven en color

**Causa:** Docker logs no soporta colores por defecto.

**Solución:** Ver logs directamente en el contenedor:
```bash
docker exec -it latincrack-api sh
# Dentro del contenedor, los logs se verán con colores
```

### Problema: Demasiados logs

**Solución 1: Cambiar formato de morgan**
Editar `api/server.js`:
```javascript
// Cambiar de 'dev' a 'tiny' para menos verbosidad
app.use(morgan('tiny'));

// O usar 'combined' para formato Apache
app.use(morgan('combined'));
```

**Solución 2: Filtrar logs**
```bash
# Solo errores (4xx y 5xx)
docker-compose logs api | grep -E " [45][0-9]{2} "

# Solo peticiones lentas (>500ms)
docker-compose logs api | grep -E "[5-9][0-9]{2,}\.[0-9]+ ms"
```

---

## 📈 Formatos de Morgan Disponibles

Si quieres cambiar el formato, edita `api/server.js:16`:

### dev (actual)
```javascript
app.use(morgan('dev'));
// Output: GET /api/tasks 200 45.123 ms - 1234
```

### tiny (minimalista)
```javascript
app.use(morgan('tiny'));
// Output: GET /api/tasks 200 1234 - 45.123 ms
```

### combined (Apache style)
```javascript
app.use(morgan('combined'));
// Output: ::1 - - [24/Mar/2026:19:30:45 +0000] "GET /api/tasks HTTP/1.1" 200 1234
```

### common (NCSA)
```javascript
app.use(morgan('common'));
// Output: ::1 - - [24/Mar/2026:19:30:45 +0000] "GET /api/tasks HTTP/1.1" 200 1234
```

### custom (personalizado)
```javascript
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
// Output personalizado según tus necesidades
```

---

## ✅ Checklist de Deployment

### Pre-Deployment
- [x] Morgan instalado en `api/package.json`
- [x] Morgan importado en `api/server.js`
- [x] Middleware configurado con formato 'dev'
- [ ] Código commiteado a Git (si usas Git)
- [ ] Backup de base de datos realizado

### Deployment
- [ ] Conectado al VPS
- [ ] Código actualizado (git pull o scp)
- [ ] Servicios detenidos (`docker-compose down`)
- [ ] API reconstruida (`docker-compose build api`)
- [ ] Servicios levantados (`docker-compose up -d`)
- [ ] Estado verificado (`docker-compose ps`)

### Post-Deployment
- [ ] Logs visibles (`docker-compose logs -f api`)
- [ ] Health check funciona (`curl http://localhost:3000/health`)
- [ ] Peticiones GET logueadas
- [ ] Peticiones POST logueadas
- [ ] Peticiones PUT logueadas
- [ ] Peticiones DELETE logueadas
- [ ] Frontend funciona correctamente

---

## 🎯 Comandos Rápidos

```bash
# Deployment rápido (solo API)
docker-compose down && docker-compose build api && docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f api

# Verificar que morgan funciona
curl http://localhost:3000/health && docker-compose logs --tail=5 api

# Reiniciar solo el API (sin rebuild)
docker-compose restart api

# Ver últimas 50 líneas de logs
docker-compose logs --tail=50 api
```

---

## 📚 Recursos

- **Morgan Docs:** https://github.com/expressjs/morgan
- **Docker Compose Logs:** https://docs.docker.com/compose/reference/logs/
- **Express Middleware:** https://expressjs.com/en/guide/using-middleware.html

---

**Última actualización:** Marzo 2026  
**Versión:** 1.0  
**Autor:** LatinCrack DevOps Team
