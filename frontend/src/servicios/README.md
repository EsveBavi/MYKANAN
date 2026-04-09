# Servicios Frontend

## Servicios de Conexión

### websocket.ts
Conexión WebSocket para:
- Transcripciones en tiempo real
- Alertas instantáneas
- Estado de sesión

### api.ts
Cliente HTTP para:
- Iniciar/terminar sesión
- Consultar historial
- Gestión de perfil

### storage.ts
Almacenamiento local:
- Caché de sesiones
- Preferencias de usuario
- Datos offline

### audio.ts
Procesamiento de audio:
- Captura de micrófono
- Chunking (20-40ms)
- Formato PCM mono 16kHz
