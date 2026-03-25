# 🏗️ ARQUITECTURA CLOUD NATIVE - TABLERO LATINCRACK
## Informe de Health Check y Documentación Maestra

**Fecha de Análisis:** Marzo 2026  
**Entorno:** Producción en VPS Linode  
**Arquitectura:** Cloud Native 100% Dockerizada  
**Estado General:** ✅ OPERATIVO

---

## 📊 EXECUTIVE SUMMARY

El sistema ha migrado exitosamente de una arquitectura PaaS (Netlify/Supabase) a una arquitectura Cloud Native basada en microservicios containerizados. La aplicación está desplegada en un VPS de Linode utilizando Docker Compose para orquestar 4 servicios independientes que se comunican a través de una red bridge privada.

**Métricas Clave:**
- **Servicios Activos:** 4 contenedores
- **Base de Datos:** PostgreSQL 15 (Alpine)
- **Frontend:** React 19 + Vite 8 + Nginx
- **Backend:** Node.js 18 + Express
- **Uptime Target:** 99.9%

---

## 🎯 1. STACK TECNOLÓGICO ACTUAL

### 1.1 Frontend Layer

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.4 | Framework UI principal |
| **Vite** | 8.0.1 | Build tool y dev server |
| **Tailwind CSS** | 4.2.2 | Framework de estilos utility-first |
| **@tailwindcss/postcss** | 4.0.0 | Plugin PostCSS para Tailwind v4 |
| **@dnd-kit/core** | 6.3.1 | Librería de drag & drop |
| **@dnd-kit/sortable** | 10.0.0 | Extensión sortable para DnD |
| **Lucide React** | 1.0.0 | Iconos SVG optimizados |
| **Nginx** | Alpine | Servidor web de producción |

### 1.2 Backend Layer

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18-alpine | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web minimalista |
| **pg** | 8.11.3 | Driver PostgreSQL nativo |
| **CORS** | 2.8.5 | Middleware de seguridad |

### 1.3 Database Layer

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **PostgreSQL** | 15-alpine | Base de datos relacional |
| **Adminer** | latest | Interfaz web de administración |

### 1.4 Infrastructure Layer

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | 20+ | Containerización |
| **Docker Compose** | 3.8 | Orquestación de servicios |
| **Alpine Linux** | latest | Sistema operativo base (lightweight) |

### 1.5 Dependencias Legacy (Compatibilidad)

```json
"@supabase/supabase-js": "^2.100.0"  // Mantenido para compatibilidad
```

**Nota:** La dependencia de Supabase se mantiene en el código pero NO se utiliza en producción. El sistema usa el hook `useTasksWrapper` que detecta automáticamente el modo Docker.

---

## 🏥 2. HEALTH CHECK DE ARQUITECTURA

### 2.1 Análisis de Coherencia de Configuración

#### ✅ docker-compose.yml - ESTADO: SALUDABLE

**Servicios Configurados:**
```yaml
✓ postgres    - PostgreSQL 15-alpine
✓ api         - Backend Node.js
✓ frontend    - Frontend React + Nginx
✓ adminer     - DB Admin UI
```

**Red Interna:**
```yaml
✓ latincrack-network (bridge driver)
✓ Todos los servicios conectados a la misma red
✓ Comunicación interna por nombre de servicio
```

**Volúmenes Persistentes:**
```yaml
✓ postgres_data - Persistencia de base de datos
✓ init-db.sql - Script de inicialización montado
```

**Health Checks:**
```yaml
✓ PostgreSQL: pg_isready cada 10s
✓ Dependencias correctamente configuradas (depends_on)
```

**⚠️ ADVERTENCIA DETECTADA:**
```yaml
# Línea 13 del docker-compose.yml tiene un comentario innecesario:
networks:             # <--- AÑADE ESTO
  - latincrack-network
```
**Recomendación:** Limpiar comentario para producción.

#### ✅ Dockerfile (Frontend) - ESTADO: SALUDABLE

**Build Multi-Stage:**
```dockerfile
Etapa 1 (Builder): node:20-alpine
  ✓ Instalación de dependencias
  ✓ Build de producción (npm run build)
  ✓ Genera carpeta dist/

Etapa 2 (Runtime): nginx:alpine
  ✓ Copia dist/ a /usr/share/nginx/html
  ✓ Configuración personalizada de Nginx
  ✓ Expone puerto 80
```

**Optimizaciones Detectadas:**
- ✅ Multi-stage build reduce tamaño final
- ✅ Alpine Linux (imagen ligera)
- ✅ Separación build/runtime

**⚠️ INCONSISTENCIA MENOR DETECTADA:**
```dockerfile
# Línea 10: usa npm install en lugar de npm ci
RUN npm install  # ← Debería ser npm ci para builds reproducibles
```

**Recomendación:** Cambiar a `npm ci` para builds determinísticos.

#### ✅ api/Dockerfile (Backend) - ESTADO: REQUIERE ATENCIÓN

**⚠️ DUPLICACIÓN DETECTADA:**
```dockerfile
# Líneas 8-11 duplican la instalación
RUN npm install                    # ← Línea 8
RUN npm ci --only=production       # ← Línea 11
```

**Recomendación CRÍTICA:** Eliminar línea 8, mantener solo `npm ci --only=production`.

#### ✅ nginx.conf - ESTADO: EXCELENTE

**Configuración Optimizada:**
```nginx
✓ Gzip compression habilitado
✓ SPA routing (try_files para React Router)
✓ Cache de assets estáticos (1 año)
✓ Security headers (X-Frame-Options, X-XSS-Protection)
```

**Tipos MIME Comprimidos:**
- text/plain, text/css, text/xml
- text/javascript, application/javascript
- application/json, application/xml+rss

**Cache Strategy:**
- Assets estáticos: 1 año (immutable)
- HTML: Sin cache (siempre fresh)

#### ✅ tailwind.config.js - ESTADO: SALUDABLE

**Configuración Minimalista:**
```javascript
✓ Content paths correctos (index.html, src/**/*.{js,jsx,tsx})
✓ Sin configuración innecesaria
✓ Listo para extensiones futuras
```

#### ✅ postcss.config.js - ESTADO: SALUDABLE

**Plugins Configurados:**
```javascript
✓ @tailwindcss/postcss (Tailwind v4)
✓ autoprefixer (compatibilidad cross-browser)
```

**Nota:** Configuración correcta para Tailwind CSS v4.

### 2.2 Verificación de Rastros del Stack Antiguo

#### ✅ LIMPIEZA COMPLETA - Sin Rastros Críticos

**Archivos Revisados:**

| Archivo | Estado | Observaciones |
|---------|--------|---------------|
| `docker-compose.yml` | ✅ Limpio | Sin referencias a Netlify/Supabase |
| `Dockerfile` | ✅ Limpio | Build nativo, sin deps cloud |
| `package.json` | ⚠️ Dependencia | `@supabase/supabase-js` presente pero inactiva |
| `src/hooks/useTasks.js` | ⚠️ Legacy | Hook original de Supabase mantenido |
| `src/hooks/useTasksWrapper.js` | ✅ Activo | Switch automático Docker/Supabase |
| `.env.local` | ✅ Configurado | `VITE_USE_DOCKER=true` |

**Dependencias Legacy Identificadas:**

```json
// package.json - Línea 15
"@supabase/supabase-js": "^2.100.0"
```

**Análisis:** Esta dependencia NO se usa en producción gracias al wrapper. Se puede mantener para desarrollo local o eliminar si no se planea volver a Supabase.

**Recomendación:** 
- **Opción A (Conservadora):** Mantener para flexibilidad futura
- **Opción B (Agresiva):** Eliminar con `npm uninstall @supabase/supabase-js`

### 2.3 Coherencia entre Configuraciones

#### ✅ Puertos - COHERENCIA VERIFICADA

| Servicio | docker-compose.yml | Dockerfile | Nginx | Estado |
|----------|-------------------|------------|-------|--------|
| Frontend | 80:80 | EXPOSE 80 | listen 80 | ✅ Coherente |
| API | 3000:3000 | EXPOSE 3000 | N/A | ✅ Coherente |
| PostgreSQL | 5432:5432 | N/A | N/A | ✅ Coherente |
| Adminer | 8080:8080 | N/A | N/A | ✅ Coherente |

#### ✅ Variables de Entorno - COHERENCIA VERIFICADA

**PostgreSQL Credentials:**
```yaml
docker-compose.yml (postgres):
  POSTGRES_DB: kanban_db          ✓
  POSTGRES_USER: kanban_user      ✓
  POSTGRES_PASSWORD: kanban_password_2024  ✓

docker-compose.yml (api):
  POSTGRES_HOST: postgres         ✓
  POSTGRES_DB: kanban_db          ✓
  POSTGRES_USER: kanban_user      ✓
  POSTGRES_PASSWORD: kanban_password_2024  ✓
```

**Frontend Environment:**
```yaml
docker-compose.yml (frontend):
  VITE_USE_DOCKER: true           ✓
  VITE_API_URL: http://api:3000/api  ✓
```

**⚠️ SEGURIDAD:** Contraseña por defecto detectada en producción.

**Recomendación CRÍTICA:** Cambiar `kanban_password_2024` por una contraseña segura generada con:
```bash
openssl rand -base64 32
```

---

## 📁 3. DICCIONARIO DE CARPETAS Y ARCHIVOS

### 3.1 Estructura Raíz

```
mi-primer-windsurf/
├── 📄 Configuración Docker
│   ├── docker-compose.yml       # Orquestador de servicios
│   ├── Dockerfile               # Build del frontend
│   ├── nginx.conf               # Configuración del servidor web
│   ├── init-db.sql              # Script de inicialización de PostgreSQL
│   └── .dockerignore            # Exclusiones del build
│
├── 📄 Configuración Frontend
│   ├── package.json             # Dependencias y scripts del frontend
│   ├── vite.config.js           # Configuración de Vite
│   ├── tailwind.config.js       # Configuración de Tailwind CSS
│   ├── postcss.config.js        # Configuración de PostCSS
│   ├── index.html               # Punto de entrada HTML
│   └── .env.local               # Variables de entorno locales
│
├── 📁 api/                      # Microservicio Backend
│   ├── Dockerfile               # Build del backend
│   ├── package.json             # Dependencias del backend
│   └── server.js                # API REST con Express
│
├── 📁 src/                      # Código fuente del frontend
│   ├── components/              # Componentes React
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilidades y configuraciones
│   ├── utils/                   # Funciones helper
│   ├── assets/                  # Recursos estáticos
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Punto de entrada React
│   └── index.css                # Estilos globales
│
└── 📄 Documentación
    ├── ARQUITECTURA_CLOUD_NATIVE.md  # Este documento
    ├── DOCKER_SETUP.md               # Guía de Docker
    ├── DOCUMENTACION_LATINCRACK.md   # Guía de desarrollo
    └── CAMBIOS_PARA_DOCKER.md        # Guía de migración
```

### 3.2 Descripción Detallada de Archivos Raíz

#### 🐳 Archivos Docker

**`docker-compose.yml`**
- **Propósito:** Orquestador maestro de la arquitectura de microservicios
- **Responsabilidades:**
  - Define 4 servicios (postgres, api, frontend, adminer)
  - Configura red bridge privada
  - Gestiona volúmenes persistentes
  - Establece dependencias entre servicios
  - Configura health checks
- **Cuándo se usa:** `docker-compose up -d`

**`Dockerfile`** (Frontend)
- **Propósito:** Receta de construcción del contenedor frontend
- **Etapas:**
  1. **Builder:** Compila React con Vite (node:20-alpine)
  2. **Runtime:** Sirve archivos estáticos con Nginx (nginx:alpine)
- **Output:** Imagen Docker optimizada (~50MB)

**`api/Dockerfile`** (Backend)
- **Propósito:** Receta de construcción del contenedor backend
- **Responsabilidades:**
  - Instala dependencias de Node.js
  - Copia servidor Express
  - Expone puerto 3000
- **Output:** Imagen Docker del API REST

**`nginx.conf`**
- **Propósito:** Configuración del servidor web Nginx
- **Características:**
  - SPA routing (todas las rutas → index.html)
  - Compresión Gzip
  - Cache de assets (1 año)
  - Security headers
- **Ubicación en contenedor:** `/etc/nginx/conf.d/default.conf`

**`init-db.sql`**
- **Propósito:** Script de inicialización de PostgreSQL
- **Ejecuta:**
  - Creación de tabla `tasks`
  - Índices para optimización
  - Triggers para `updated_at`
  - Datos de ejemplo (opcional)
- **Cuándo se ejecuta:** Primera vez que se crea el contenedor de PostgreSQL

**`.dockerignore`**
- **Propósito:** Excluir archivos del contexto de build
- **Excluye:**
  - node_modules (se reinstalan en el contenedor)
  - dist (se genera en el build)
  - .git, .env, documentación

#### ⚛️ Archivos de Configuración Frontend

**`package.json`**
- **Propósito:** Manifiesto del proyecto frontend
- **Contiene:**
  - Dependencias de producción (React, DnD Kit, etc.)
  - Dependencias de desarrollo (Vite, Tailwind, ESLint)
  - Scripts (dev, build, preview)
- **Versión Node requerida:** 18+

**`vite.config.js`**
- **Propósito:** Configuración del bundler Vite
- **Características:**
  - Plugin de React
  - Hot Module Replacement (HMR)
  - Optimización de build

**`tailwind.config.js`**
- **Propósito:** Configuración de Tailwind CSS
- **Define:**
  - Rutas de contenido para purging
  - Tema personalizado (extend)
  - Plugins adicionales

**`postcss.config.js`**
- **Propósito:** Configuración de PostCSS
- **Plugins:**
  - `@tailwindcss/postcss` (Tailwind v4)
  - `autoprefixer` (compatibilidad cross-browser)

**`index.html`**
- **Propósito:** Punto de entrada HTML
- **Características:**
  - Carga `main.jsx` como módulo ES
  - Div root para React
  - Meta tags básicos

**`.env.local`**
- **Propósito:** Variables de entorno locales (NO se commitea)
- **Variables clave:**
  - `VITE_USE_DOCKER=true` (activa modo Docker)
  - `VITE_API_URL=http://api:3000/api` (URL del backend)

### 3.3 Estructura del Directorio `src/`

```
src/
├── components/              # Componentes React reutilizables
│   ├── Board.jsx           # Componente principal del tablero
│   ├── Column.jsx          # Columna del Kanban (To Do, Doing, Done)
│   ├── Task.jsx            # Tarjeta de tarea individual
│   ├── TaskModal.jsx       # Modal para crear/editar tareas
│   └── DeleteConfirmModal.jsx  # Modal de confirmación de eliminación
│
├── hooks/                   # Custom React Hooks
│   ├── useTasks.js         # Hook para Supabase (legacy)
│   ├── useTasksDocker.js   # Hook para PostgreSQL directo
│   ├── useTasksWrapper.js  # Switch automático Supabase/Docker
│   └── useLocalStorage.js  # Hook para localStorage (legacy)
│
├── lib/                     # Configuraciones y utilidades
│   ├── supabase.js         # Cliente de Supabase (legacy)
│   └── database.js         # Configuración dual DB
│
├── utils/                   # Funciones helper
│   ├── constants.js        # Constantes (columnas, prioridades)
│   └── taskHelpers.js      # Helpers para tareas (formateo, validación)
│
├── assets/                  # Recursos estáticos
│   └── react.svg           # Logo de React
│
├── App.jsx                  # Componente raíz de la aplicación
├── main.jsx                 # Punto de entrada de React
├── index.css                # Estilos globales + Tailwind imports
└── App.css                  # Estilos específicos del App
```

### 3.4 Estructura del Directorio `api/`

```
api/
├── Dockerfile               # Build del contenedor backend
├── package.json             # Dependencias del backend
└── server.js                # Servidor Express con API REST
    ├── Rutas implementadas:
    │   ├── GET    /api/tasks       # Obtener todas las tareas
    │   ├── POST   /api/tasks       # Crear nueva tarea
    │   ├── PUT    /api/tasks/:id   # Actualizar tarea
    │   ├── DELETE /api/tasks/:id   # Eliminar tarea
    │   └── GET    /health          # Health check
    │
    └── Conexión PostgreSQL (pg Pool)
```

---

## 🗺️ 4. MAPA DE SERVICIOS DESPLEGADOS

### 4.1 Topología de la Red Docker

```
┌─────────────────────────────────────────────────────────────┐
│                  latincrack-network (bridge)                │
│                                                             │
│  ┌─────────────────────┐                                   │
│  │   latincrack-frontend                                   │
│  │   Container ID: auto                                    │
│  ├─────────────────────┤                                   │
│  │ Image: custom (Dockerfile)                              │
│  │ Base: nginx:alpine                                      │
│  │ Port Mapping: 80:80                                     │
│  │ Restart: unless-stopped                                 │
│  │ Depends On: api                                         │
│  ├─────────────────────┤                                   │
│  │ Environment:                                            │
│  │  - VITE_USE_DOCKER=true                                 │
│  │  - VITE_API_URL=http://api:3000/api                     │
│  ├─────────────────────┤                                   │
│  │ Volumes: None (stateless)                               │
│  │ Network Alias: frontend                                 │
│  └──────────┬──────────┘                                   │
│             │                                               │
│             │ HTTP Requests                                 │
│             ▼                                               │
│  ┌─────────────────────┐                                   │
│  │   latincrack-api                                        │
│  │   Container ID: auto                                    │
│  ├─────────────────────┤                                   │
│  │ Image: custom (api/Dockerfile)                          │
│  │ Base: node:18-alpine                                    │
│  │ Port Mapping: 3000:3000                                 │
│  │ Restart: unless-stopped                                 │
│  │ Depends On: postgres (healthy)                          │
│  ├─────────────────────┤                                   │
│  │ Environment:                                            │
│  │  - POSTGRES_HOST=postgres                               │
│  │  - POSTGRES_PORT=5432                                   │
│  │  - POSTGRES_DB=kanban_db                                │
│  │  - POSTGRES_USER=kanban_user                            │
│  │  - POSTGRES_PASSWORD=kanban_password_2024               │
│  ├─────────────────────┤                                   │
│  │ Volumes: None (stateless)                               │
│  │ Network Alias: api                                      │
│  └──────────┬──────────┘                                   │
│             │                                               │
│             │ SQL Queries (pg driver)                       │
│             ▼                                               │
│  ┌─────────────────────┐                                   │
│  │   latincrack-db                                         │
│  │   Container ID: auto                                    │
│  ├─────────────────────┤                                   │
│  │ Image: postgres:15-alpine                               │
│  │ Port Mapping: 5432:5432                                 │
│  │ Restart: unless-stopped                                 │
│  ├─────────────────────┤                                   │
│  │ Environment:                                            │
│  │  - POSTGRES_DB=kanban_db                                │
│  │  - POSTGRES_USER=kanban_user                            │
│  │  - POSTGRES_PASSWORD=kanban_password_2024               │
│  ├─────────────────────┤                                   │
│  │ Volumes:                                                │
│  │  - postgres_data:/var/lib/postgresql/data (persistent) │
│  │  - ./init-db.sql:/docker-entrypoint-initdb.d/          │
│  ├─────────────────────┤                                   │
│  │ Health Check:                                           │
│  │  - Command: pg_isready -U kanban_user -d kanban_db      │
│  │  - Interval: 10s                                        │
│  │  - Timeout: 5s                                          │
│  │  - Retries: 5                                           │
│  │ Network Alias: postgres                                 │
│  └──────────┬──────────┘                                   │
│             │                                               │
│             │ SQL Queries (Adminer)                         │
│             ▲                                               │
│  ┌──────────┴──────────┐                                   │
│  │   latincrack-adminer                                    │
│  │   Container ID: auto                                    │
│  ├─────────────────────┤                                   │
│  │ Image: adminer:latest                                   │
│  │ Port Mapping: 8080:8080                                 │
│  │ Restart: unless-stopped                                 │
│  │ Depends On: postgres                                    │
│  ├─────────────────────┤                                   │
│  │ Environment:                                            │
│  │  - ADMINER_DEFAULT_SERVER=postgres                      │
│  │ Network Alias: adminer                                  │
│  └─────────────────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Tabla de Servicios

| Servicio | Contenedor | Imagen Base | Puerto Externo | Puerto Interno | Protocolo | Estado |
|----------|------------|-------------|----------------|----------------|-----------|--------|
| **Frontend** | latincrack-frontend | nginx:alpine | 80 | 80 | HTTP | ✅ Running |
| **Backend API** | latincrack-api | node:18-alpine | 3000 | 3000 | HTTP | ✅ Running |
| **Database** | latincrack-db | postgres:15-alpine | 5432 | 5432 | PostgreSQL | ✅ Running |
| **DB Admin** | latincrack-adminer | adminer:latest | 8080 | 8080 | HTTP | ✅ Running |

### 4.3 Comunicación entre Servicios

#### Comunicación Interna (dentro de latincrack-network)

```
Frontend → API:
  URL: http://api:3000/api
  Método: Resolución DNS interna de Docker
  Protocolo: HTTP
  
API → PostgreSQL:
  Host: postgres
  Puerto: 5432
  Método: Resolución DNS interna de Docker
  Protocolo: PostgreSQL Wire Protocol
  Driver: pg (node-postgres)

Adminer → PostgreSQL:
  Host: postgres
  Puerto: 5432
  Método: Resolución DNS interna de Docker
  Protocolo: PostgreSQL Wire Protocol
```

#### Comunicación Externa (desde el host/internet)

```
Usuario → Frontend:
  URL: http://localhost:80 (o IP del VPS)
  Protocolo: HTTP
  
Usuario → API (directo):
  URL: http://localhost:3000
  Protocolo: HTTP
  Uso: Health checks, debugging
  
Usuario → Adminer:
  URL: http://localhost:8080
  Protocolo: HTTP
  Uso: Administración de base de datos
  
Usuario → PostgreSQL (directo):
  Host: localhost:5432
  Protocolo: PostgreSQL
  Uso: Backups, migraciones, debugging
```

### 4.4 Dependencias de Inicio

```
Orden de Inicio (orchestrado por Docker Compose):

1. postgres
   └─ Health Check: pg_isready
      └─ Estado: HEALTHY
         ├─ 2. api (depends_on: postgres healthy)
         │  └─ 3. frontend (depends_on: api)
         └─ 4. adminer (depends_on: postgres)
```

**Tiempo estimado de inicio completo:** 15-30 segundos

### 4.5 Volúmenes y Persistencia

```
Volúmenes Nombrados:
  postgres_data:
    Driver: local
    Montado en: /var/lib/postgresql/data (dentro del contenedor)
    Propósito: Persistencia de datos de PostgreSQL
    Backup: Recomendado diario
    
Volúmenes Bind Mount:
  ./init-db.sql:
    Montado en: /docker-entrypoint-initdb.d/init-db.sql
    Propósito: Inicialización automática de la base de datos
    Ejecución: Solo en primera creación del contenedor
```

---

## 🔄 5. FLUJO DE DATOS COMPLETO

### 5.1 Flujo de una Petición GET (Obtener Tareas)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. NAVEGADOR DEL USUARIO                                        │
│    URL: http://tu-vps-ip                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP GET /
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. NGINX (latincrack-frontend:80)                               │
│    - Recibe petición HTTP                                       │
│    - Sirve /usr/share/nginx/html/index.html                     │
│    - Aplica compresión Gzip                                     │
│    - Añade security headers                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTML + JS Bundle
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. NAVEGADOR - REACT APP                                        │
│    - Carga React 19                                             │
│    - Ejecuta main.jsx                                           │
│    - Renderiza <Board />                                        │
│    - useTasksWrapper() detecta VITE_USE_DOCKER=true             │
│    - Llama a useTasksDocker()                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ fetch(http://api:3000/api/tasks)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND API (latincrack-api:3000)                            │
│    - Express recibe GET /api/tasks                              │
│    - Middleware CORS valida origen                              │
│    - Handler ejecuta:                                           │
│      pool.query('SELECT * FROM tasks ORDER BY created_at ASC')  │
└────────────────────────┬────────────────────────────────────────┘
                         │ SQL Query via pg driver
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. POSTGRESQL (latincrack-db:5432)                              │
│    - Recibe query SQL                                           │
│    - Ejecuta SELECT en tabla tasks                              │
│    - Aplica ORDER BY created_at                                 │
│    - Retorna filas (JSON)                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ Result Set (rows)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND API - RESPONSE                                       │
│    - Recibe result.rows de PostgreSQL                           │
│    - Formatea respuesta JSON                                    │
│    - Añade headers CORS                                         │
│    - res.json(result.rows)                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP 200 + JSON
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. REACT APP - STATE UPDATE                                     │
│    - fetch() recibe response                                    │
│    - Parsea JSON                                                │
│    - Mapea campos DB → Frontend:                                │
│      * status → column                                          │
│      * due_date → dueDate                                       │
│    - setTasks(formattedTasks)                                   │
│    - React re-renderiza componentes                             │
└────────────────────────┬────────────────────────────────────────┘
                         │ Virtual DOM Update
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. NAVEGADOR - UI UPDATE                                        │
│    - React actualiza DOM real                                   │
│    - Usuario ve las tareas en las columnas                      │
│    - Drag & Drop habilitado (dnd-kit)                           │
└─────────────────────────────────────────────────────────────────┘
```

**Tiempo total estimado:** 50-200ms (dependiendo de latencia de red)

### 5.2 Flujo de una Petición POST (Crear Tarea)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USUARIO - ACCIÓN                                             │
│    - Click en botón "+" en columna                              │
│    - Abre TaskModal                                             │
│    - Rellena formulario (título, descripción, prioridad, etc.)  │
│    - Click en "Guardar"                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │ onSave(taskData)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. REACT - BOARD COMPONENT                                      │
│    - handleSaveTask() ejecutado                                 │
│    - Llama a addTask(title, description, priority, ...)         │
└────────────────────────┬────────────────────────────────────────┘
                         │ useTasksDocker.addTask()
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. REACT HOOK - useTasksDocker                                  │
│    - Construye payload JSON:                                    │
│      {                                                           │
│        title: "Nueva tarea",                                    │
│        description: "Descripción",                              │
│        priority: "high",                                        │
│        due_date: "2026-03-25",                                  │
│        tags: ["urgente"],                                       │
│        status: "todo"                                           │
│      }                                                           │
│    - fetch(http://api:3000/api/tasks, {                         │
│        method: 'POST',                                          │
│        headers: { 'Content-Type': 'application/json' },         │
│        body: JSON.stringify(payload)                            │
│      })                                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP POST + JSON Body
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND API - POST /api/tasks                                │
│    - Express recibe POST request                                │
│    - express.json() parsea body                                 │
│    - Extrae campos: title, description, priority, etc.          │
│    - Ejecuta INSERT:                                            │
│      INSERT INTO tasks (title, description, priority,           │
│                         due_date, tags, status)                 │
│      VALUES ($1, $2, $3, $4, $5, $6)                            │
│      RETURNING *                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │ SQL INSERT via pg driver
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. POSTGRESQL - INSERT                                          │
│    - Recibe INSERT statement                                    │
│    - Genera UUID para id (gen_random_uuid())                    │
│    - Establece created_at = NOW()                               │
│    - Establece updated_at = NOW()                               │
│    - Inserta fila en tabla tasks                                │
│    - RETURNING * devuelve la fila completa                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ Inserted Row
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND API - RESPONSE                                       │
│    - Recibe result.rows[0] (fila insertada)                     │
│    - res.status(201).json(result.rows[0])                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP 201 Created + JSON
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. REACT HOOK - RESPONSE HANDLING                               │
│    - fetch() recibe response                                    │
│    - Parsea JSON                                                │
│    - Mapea campos DB → Frontend                                 │
│    - Crea newTask object                                        │
│    - setTasks([...tasks, newTask])                              │
└────────────────────────┬────────────────────────────────────────┘
                         │ State Update
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. REACT - RE-RENDER                                            │
│    - Board component re-renderiza                               │
│    - Nueva tarea aparece en columna "To Do"                     │
│    - TaskModal se cierra                                        │
│    - Usuario ve la tarea creada instantáneamente                │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Flujo de Drag & Drop (Mover Tarea)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USUARIO - DRAG & DROP                                        │
│    - Mantiene presionada una tarea (250ms en móvil)             │
│    - Arrastra hacia otra columna                                │
│    - Suelta la tarea                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │ onDragEnd event
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. DND-KIT - EVENT HANDLING                                     │
│    - handleDragEnd() ejecutado                                  │
│    - Detecta columna de origen y destino                        │
│    - Llama a moveTask(taskId, newColumn)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ moveTask() → updateTask()
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. REACT HOOK - UPDATE                                          │
│    - updateTask(taskId, { column: 'doing' })                    │
│    - Mapea column → status                                      │
│    - fetch(http://api:3000/api/tasks/${taskId}, {               │
│        method: 'PUT',                                           │
│        body: JSON.stringify({ status: 'doing' })                │
│      })                                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP PUT
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND API - UPDATE                                         │
│    - Ejecuta UPDATE:                                            │
│      UPDATE tasks                                               │
│      SET status = $1, updated_at = NOW()                        │
│      WHERE id = $2                                              │
│      RETURNING *                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │ SQL UPDATE
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. POSTGRESQL - UPDATE                                          │
│    - Actualiza fila                                             │
│    - Trigger update_tasks_updated_at actualiza updated_at       │
│    - RETURNING * devuelve fila actualizada                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ Updated Row
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. REACT - UI UPDATE                                            │
│    - State actualizado optimistamente                           │
│    - Tarea ya se ve en la nueva columna (UX instantánea)        │
│    - Confirmación del backend recibida                          │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Polling para Simular Tiempo Real

```
┌─────────────────────────────────────────────────────────────────┐
│ REACT HOOK - useEffect                                          │
│                                                                 │
│ useEffect(() => {                                               │
│   fetchTasks();  // ← Fetch inicial                             │
│                                                                 │
│   const interval = setInterval(fetchTasks, 5000);  // ← Polling │
│                                                                 │
│   return () => clearInterval(interval);  // ← Cleanup           │
│ }, []);                                                          │
│                                                                 │
│ Cada 5 segundos:                                                │
│   1. Fetch GET /api/tasks                                       │
│   2. Compara con state actual                                   │
│   3. Si hay cambios, actualiza UI                               │
│   4. Usuario ve cambios de otros dispositivos                   │
└─────────────────────────────────────────────────────────────────┘
```

**Nota:** En Supabase se usaban subscripciones en tiempo real. En Docker se usa polling cada 5 segundos como alternativa simple.

---

## 📈 6. MÉTRICAS Y MONITOREO

### 6.1 Health Checks Configurados

```bash
# PostgreSQL Health Check
docker exec latincrack-db pg_isready -U kanban_user -d kanban_db

# API Health Check
curl http://localhost:3000/health

# Frontend Health Check
curl -I http://localhost

# Adminer Health Check
curl -I http://localhost:8080
```

### 6.2 Comandos de Monitoreo

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api

# Ver uso de recursos
docker stats

# Ver estado de servicios
docker-compose ps

# Ver redes
docker network ls
docker network inspect latincrack-network

# Ver volúmenes
docker volume ls
docker volume inspect mi-primer-windsurf_postgres_data
```

### 6.3 Métricas Clave a Monitorear

| Métrica | Comando | Umbral Crítico |
|---------|---------|----------------|
| CPU Usage | `docker stats` | > 80% |
| Memory Usage | `docker stats` | > 90% |
| Disk Usage | `docker system df` | > 85% |
| DB Connections | `SELECT count(*) FROM pg_stat_activity;` | > 80 |
| API Response Time | `curl -w "@curl-format.txt" http://localhost:3000/health` | > 500ms |

---

## 🔒 7. SEGURIDAD Y MEJORES PRÁCTICAS

### 7.1 Vulnerabilidades Detectadas

| Severidad | Descripción | Ubicación | Recomendación |
|-----------|-------------|-----------|---------------|
| 🔴 **ALTA** | Contraseña por defecto en producción | `docker-compose.yml:12` | Cambiar `kanban_password_2024` |
| 🟡 **MEDIA** | Puerto PostgreSQL expuesto | `docker-compose.yml:15-16` | Comentar en producción |
| 🟡 **MEDIA** | Adminer expuesto públicamente | `docker-compose.yml:69-70` | Restringir acceso o eliminar |
| 🟢 **BAJA** | Dependencia legacy de Supabase | `package.json:15` | Opcional: eliminar |

### 7.2 Recomendaciones de Seguridad

#### Inmediatas (Críticas)

1. **Cambiar contraseña de PostgreSQL:**
```bash
# Generar contraseña segura
openssl rand -base64 32

# Actualizar en docker-compose.yml
POSTGRES_PASSWORD: <nueva_contraseña_generada>
```

2. **No exponer PostgreSQL públicamente:**
```yaml
# Comentar en docker-compose.yml (producción)
# ports:
#   - "5432:5432"
```

3. **Proteger Adminer con autenticación:**
```yaml
# Opción 1: Eliminar en producción
# Opción 2: Usar Nginx reverse proxy con auth básica
```

#### Mediano Plazo

4. **Implementar HTTPS con Let's Encrypt:**
```bash
# Usar Certbot + Nginx reverse proxy
sudo certbot --nginx -d tu-dominio.com
```

5. **Configurar firewall:**
```bash
# UFW en Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp  # Bloquear acceso directo a API
sudo ufw deny 5432/tcp  # Bloquear acceso directo a PostgreSQL
sudo ufw enable
```

6. **Limitar recursos de contenedores:**
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

7. **Usar secrets de Docker:**
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  postgres:
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
```

---

## 🎯 8. CONCLUSIONES Y RECOMENDACIONES

### 8.1 Estado General de la Arquitectura

**✅ PUNTOS FUERTES:**
- Arquitectura de microservicios bien diseñada
- Separación clara de responsabilidades
- Configuración Docker coherente y funcional
- Build multi-stage optimizado
- Nginx correctamente configurado
- Health checks implementados
- Red privada aislada
- Persistencia de datos configurada

**⚠️ ÁREAS DE MEJORA:**
- Seguridad: Contraseñas por defecto
- Seguridad: Puertos innecesarios expuestos
- Build: Duplicación en api/Dockerfile
- Optimización: Dependencia legacy de Supabase
- Monitoreo: Falta logging centralizado
- Backup: No hay estrategia de backup automatizada

### 8.2 Roadmap de Mejoras

#### Fase 1: Seguridad (URGENTE - 1 semana)
- [ ] Cambiar todas las contraseñas por defecto
- [ ] Cerrar puertos innecesarios en producción
- [ ] Implementar HTTPS con Let's Encrypt
- [ ] Configurar firewall (UFW)
- [ ] Eliminar o proteger Adminer

#### Fase 2: Optimización (2 semanas)
- [ ] Corregir duplicación en api/Dockerfile
- [ ] Cambiar `npm install` a `npm ci` en Dockerfile
- [ ] Eliminar dependencia de Supabase si no se usa
- [ ] Implementar rate limiting en API
- [ ] Configurar límites de recursos

#### Fase 3: Observabilidad (1 mes)
- [ ] Implementar logging centralizado (ELK Stack o Loki)
- [ ] Configurar métricas con Prometheus
- [ ] Dashboard de monitoreo con Grafana
- [ ] Alertas automáticas (email/Slack)

#### Fase 4: Resiliencia (2 meses)
- [ ] Backups automáticos de PostgreSQL
- [ ] Estrategia de disaster recovery
- [ ] Implementar CI/CD (GitHub Actions)
- [ ] Tests automatizados
- [ ] Blue-green deployment

### 8.3 Checklist de Producción

```
Pre-Deployment:
  [✅] Docker y Docker Compose instalados
  [✅] Servicios levantados correctamente
  [✅] Health checks pasando
  [⚠️] Contraseñas cambiadas (PENDIENTE)
  [⚠️] Puertos innecesarios cerrados (PENDIENTE)
  [❌] HTTPS configurado (PENDIENTE)
  [❌] Firewall configurado (PENDIENTE)
  [❌] Backups automatizados (PENDIENTE)

Post-Deployment:
  [✅] Aplicación accesible desde internet
  [✅] Frontend carga correctamente
  [✅] API responde a peticiones
  [✅] Base de datos persistente
  [⚠️] Monitoreo configurado (BÁSICO)
  [❌] Alertas configuradas (PENDIENTE)
  [❌] Documentación de runbooks (PENDIENTE)
```

### 8.4 Estimación de Costos (Linode VPS)

| Recurso | Especificación | Costo Mensual (USD) |
|---------|----------------|---------------------|
| VPS Linode | 2 CPU, 4GB RAM, 80GB SSD | $12/mes |
| Dominio | .com/.net | $12/año ($1/mes) |
| SSL Certificate | Let's Encrypt | Gratis |
| **Total Estimado** | | **~$13/mes** |

**Comparación con Supabase:**
- Supabase Free Tier: $0/mes (con límites)
- Supabase Pro: $25/mes
- **Ahorro con VPS:** $12-13/mes vs $25/mes

---

## 📚 9. REFERENCIAS Y RECURSOS

### Documentación Oficial
- **Docker:** https://docs.docker.com
- **Docker Compose:** https://docs.docker.com/compose
- **PostgreSQL:** https://www.postgresql.org/docs
- **Nginx:** https://nginx.org/en/docs
- **Node.js:** https://nodejs.org/docs
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

### Documentación del Proyecto
- `DOCKER_SETUP.md` - Guía completa de Docker
- `DOCUMENTACION_LATINCRACK.md` - Guía de desarrollo
- `CAMBIOS_PARA_DOCKER.md` - Guía de migración

### Comandos de Referencia Rápida

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir
docker-compose up -d --build

# Backup de base de datos
docker exec latincrack-db pg_dump -U kanban_user kanban_db > backup.sql

# Restaurar backup
docker exec -i latincrack-db psql -U kanban_user kanban_db < backup.sql

# Acceder a PostgreSQL
docker exec -it latincrack-db psql -U kanban_user -d kanban_db

# Ver uso de recursos
docker stats

# Limpiar sistema
docker system prune -a
```

---

## ✅ CERTIFICACIÓN DE ARQUITECTURA

**Estado del Sistema:** ✅ OPERATIVO CON OBSERVACIONES

**Nivel de Madurez:** 3/5 (Funcional en Producción)

**Próximos Pasos Críticos:**
1. Implementar cambios de seguridad (Fase 1)
2. Configurar backups automáticos
3. Implementar monitoreo básico

**Firmado por:** Cascade AI - Arquitecto DevOps  
**Fecha:** Marzo 2026  
**Versión del Documento:** 1.0

---

**FIN DEL INFORME**
