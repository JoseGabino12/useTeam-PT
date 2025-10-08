# useTeam PT - Tablero Kanban colaborativo en tiempo real

Este repositorio contiene el resultado de la prueba tecnica: una aplicacion tipo Trello con tablero Kanban, colaboracion en tiempo real y exportacion de backlog mediante n8n. El proyecto esta dividido en dos aplicaciones independientes:

- `frontend/`: React + Vite + Zustand + Socket.io client.
- `backend/`: NestJS + MongoDB + Socket.io server + integracion con n8n.

## Arquitectura general

- El frontend sirve la interfaz con Vite, maneja drag & drop con `@dnd-kit` y consume la API REST y los eventos web socket.
- El backend expone endpoints REST, websockets con Socket.io y orquesta la exportacion del backlog.
- MongoDB almacena usuarios, tableros, columnas y tarjetas.
- n8n recibe la peticion de exportacion y envia el CSV por correo.

## Requisitos previos

- Node.js >= 20.x (desarrollado con Node 20).
- pnpm >= 9 (el repositorio incluye `pnpm-lock.yaml` en frontend y backend).
- MongoDB (Atlas o instancia local accesible desde el backend).
- Docker (opcional) para levantar n8n rapidamente.
- Puertos disponibles: 3000 (API y websockets), 5173 (frontend), 5678 (n8n).

## Variables de entorno

El archivo `.env.example` en la raiz actua como plantilla. Crea los archivos reales antes de ejecutar los servicios:

### Backend (`backend/.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/useTeamPT
MONGO_DB_NAME=useTeamPT
JWT_SECRET=cambia_este_valor
JWT_EXPIRES_IN=1h
N8N_WEBHOOK_URL=http://localhost:5678/webhook/export-backlog
```

- `MONGO_URI` puede apuntar a MongoDB Atlas; ajusta parametros TLS si es necesario.
- `N8N_WEBHOOK_URL` debe coincidir con el webhook que expone tu flujo en n8n.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

- Si el backend corre en otro host o puerto, actualiza este valor para que el cliente apunte al lugar correcto.

> Tip: puedes copiar `.env.example` a `backend/.env` y `frontend/.env` y luego eliminar las claves que no apliquen a cada servicio.

## Instalacion de dependencias

Instala dependencias en cada proyecto por separado porque no comparten `node_modules`:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

Tambien puedes usar npm o yarn, pero pnpm es lo recomendado para respetar los lockfiles.

## Ejecucion local

1. Asegurate de que MongoDB este disponible (local, Docker o Atlas).
2. **Backend (NestJS):**

   ```bash
   cd backend
   pnpm start:dev
   ```

   - API disponible en `http://localhost:3000/api`.
   - Websockets disponibles en `ws://localhost:3000`.
   - El servidor usa `NODE_OPTIONS=--openssl-legacy-provider` en desarrollo para compatibilidad con algunas dependencias.

3. **Frontend (React + Vite):**

   ```bash
   cd frontend
   pnpm dev
   ```

   - UI disponible en `http://localhost:5173`.

Levanta cada servicio en terminales diferentes. Los cambios se recargan automaticamente gracias a los modos watch de Vite y Nest.

### Flujos funcionales basicos

- `POST /api/auth/register`: crea usuarios (body `{"name": "...", "email": "...", "password": "..."}`).
- `POST /api/auth/login`: devuelve JWT y datos del usuario.
- `GET /api/boards/:userId`: lista tableros del usuario.
- `GET /api/boards/detail/:boardId`: devuelve columnas, tarjetas y comentarios.
- `POST /api/boards/:userId`: crea un tablero. El body sigue el DTO `CreateBoardDto`.
- `POST /api/boards/add-member/:boardId/:userId`: agrega miembros con rol `editor` o `viewer`.
- Eventos Socket.io: los clientes deben emitir `joinBoard`, `cardCreated`, `cardMoved` y `commentAdded` para compartir eventos en tiempo real.

### Exportacion de backlog

- Endpoint: `POST /api/export/backlog` con body `{"boardId": "...", "email": "destino@dominio.com"}`.
- El backend valida el tablero y dispara `N8N_WEBHOOK_URL` con `boardId` y `email`.
- Asegurate de que `N8N_WEBHOOK_URL` responda con un estado exitoso (2xx) para marcar la solicitud como aceptada.

## Automatizacion con n8n

1. Levanta n8n (Docker recomendado):

   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n:latest
   ```

2. En la UI (http://localhost:5678) crea o importa un flujo que:
   - Exponga un webhook coincidente con `N8N_WEBHOOK_URL`.
   - Consulte la API (`GET /api/boards/detail/:boardId`) para obtener el backlog.
   - Transforme la informacion a CSV (id, titulo, descripcion, columna, fecha de creacion).
   - Envie el CSV por correo al destinatario.
3. Exporta el flujo y guardalo en `n8n/` si quieres versionarlo junto con el proyecto.

Si ejecutas n8n detras de un tunnel o HTTPS, recuerda actualizar `N8N_WEBHOOK_URL`.

## Scripts utiles

### Backend

- `pnpm start:dev`: modo desarrollo con recarga.
- `pnpm start:prod`: ejecuta la build ya compilada.
- `pnpm build`: compila a `dist/`.
- `pnpm test`, `pnpm test:watch`, `pnpm test:cov`: pruebas unitarias.
- `pnpm lint`: ejecuta ESLint.
- `pnpm format`: formatea con Prettier.

### Frontend

- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: build de produccion en `dist/`.
- `pnpm preview`: previsualiza la build.
- `pnpm lint`: linting.

## Estructura del repositorio

```
useTeam-PT/
├── backend/        # API NestJS y websockets
├── frontend/       # UI React, Vite y Socket.io client
├── .env.example    # variables compartidas como referencia
└── n8n/            # espacio para workflows de exportacion
```

## Checklist para la entrega

- Verifica que backend y frontend se ejecuten sin errores y que el login/kanban funcionen extremo a extremo.
- Prueba el flujo de exportacion disparando `/api/export/backlog` contra n8n.
- Actualiza este README si hay cambios relevantes.
- Cuando la entrega este lista, invita a los evaluadores provistos y evita commits posteriores.

