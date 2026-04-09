# BACKEND - MYKANAN

## Descripción
Servidor backend con Node.js para orquestación, procesamiento de eventos y persistencia de datos.

## Tecnologías
- Node.js 20+
- Express
- Supabase (PostgreSQL + Realtime)
- N8N (Orquestación de workflows)
- WebSockets

## Estructura de Carpetas

```
backend/
├── src/
│   ├── controladores/     # Lógica de negocio por endpoint
│   ├── servicios/         # Servicios externos (Deepgram, Groq)
│   ├── modelos/           # Modelos de datos
│   ├── rutas/             # Definición de rutas API
│   ├── middleware/        # Middleware de autenticación y validación
│   ├── utilidades/        # Funciones auxiliares
│   └── configuracion/     # Variables de entorno y configs
```

## Instalación
```bash
npm install
npm run dev
```

## Scripts Disponibles
- `npm run dev` - Servidor en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm run start` - Servidor en producción
