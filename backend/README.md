🧩 Canvas Backend (NestJS + MongoDB + WebSockets)

Este proyecto corresponde al backend del sistema Canvas, una aplicación tipo Trello que permite la creación de tableros, columnas y tarjetas colaborativas en tiempo real mediante WebSockets.
La arquitectura sigue los principios de Clean Architecture y Domain Driven Design (DDD).

⸻

🚀 Tecnologías principales
	•	NestJS — framework modular y escalable
	•	MongoDB — base de datos NoSQL
	•	Socket.IO — comunicación en tiempo real
	•	JWT — autenticación segura por token
	•	bcrypt — encriptación de contraseñas
	•	class-validator — validación de DTOs

⸻

⚙️ Requisitos previos
	•	Node.js >= 20.x
	•	pnpm (recomendado) o npm / yarn
	•	Cuenta o conexión válida de MongoDB (Atlas o local)


⸻
📦 Instalación
	1.	Clona el repositorio
  git clone https://github.com/tu-usuario/canvas-backend.git
cd canvas-backend

	2.	Instala las dependencias
  pnpm install

  3.	Crea el archivo .env en la raíz del proyecto

🔑 Variables de entorno

Tu .env debe incluir lo siguiente:
# Puerto del servidor
PORT=3000

# Configuración de MongoDB
MONGODB_URI=
MONGO_DB_NAME=

# Configuración de JWT
JWT_SECRET=
JWT_EXPIRES_IN=