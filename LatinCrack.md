# 🏗️ LatinCrack Kanban - Manual de Arquitectura

Este proyecto representa la transición de una arquitectura PaaS a un ecosistema de **microservicios orquestados con Docker**.

---

## 💡 El Cambio de Paradigma: De 1996 a 2026

| Concepto | Paradigma Antiguo (2 Capas) | Paradigma Moderno (3 Capas) |
| :--- | :--- | :--- |
| **Conexión** | Cadena de conexión directa en el código. | Peticiones HTTP (Fetch/JSON) a una API. |
| **Seguridad** | Base de Datos expuesta al cliente. | Base de Datos oculta en red privada. |
| **Servidor** | Un solo ejecutable o Apache plano. | Contenedores aislados (Docker). |
| **Intermediario** | No existía. | **Nginx** (Web Server + Proxy Inverso). |

---

## 🗺️ Mapa de la Infraestructura (Nivel Feynman)

Imagina un restaurante blindado con 3 habitaciones comunicadas por un pasillo privado:

### 1. El Recepcionista (`frontend` / Nginx)
Es el único que da la cara al público (**Puerto 80**).
* **Web Server:** Entrega el "Menú" (HTML/JS de React) al navegador.
* **Proxy Inverso:** Lleva los pedidos de `/api` al cocinero (Backend) por el pasillo interno.

### 2. El Chef y Guardia (`api` / Node.js)
Es el cerebro del sistema.
* **Traductor:** Convierte los clics del Front a lenguaje SQL.
* **Seguridad:** Es el único que tiene la "llave" de la base de datos.

### 3. La Despensa Blindada (`db` / PostgreSQL)
Es la memoria del sistema.
* **Persistencia:** Gracias a los **Volúmenes de Docker**, los datos no se borran al apagar el servidor.

---

## 🛠️ Comandos de Supervivencia (SRE Cheat Sheet)

* **Ver el "latido" del sistema (Logs):**
  `docker compose logs -f api`

* **Reiniciar el edificio completo:**
  `docker compose down && docker compose up -d --build`

* **Entrar a la "Despensa" manualmente:**
  Usa **Adminer** en el puerto `8080`.
  * **Servidor:** `postgres`
  * **Usuario/DB:** `kanban_user` / `kanban_db`

---

## 🏥 Conexión con el futuro (El Proyecto RIS)

Esta estructura es tu base para el sistema médico:
1. **Frontend:** Interfaz Radiólogo (React).
2. **API:** Puente DICOM / HL7.
3. **PACS (dcm4chee):** Almacén de imágenes.

---

## ✅ Checklist de Salud

* [x] **Nginx** activo (Puerto 80).
* [x] **API** traduciendo (Puerto 3000 interno).
* [x] **Postgres** persistente (Puerto 5432 interno).
* [x] **Polling** activo (Sincronización cada 5s).

> "El código es el brazo, la arquitectura es el cuerpo. Domina la arquitectura y el código se escribirá solo con Windsurf."