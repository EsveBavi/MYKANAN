# Prompts para LLM

## Prompts Principales

### clasificacion-riesgo.prompt.md
Prompt para clasificación de nivel de riesgo (1-5)

### analisis-coercion.prompt.md
Detección de patrones coercitivos

### resumen-llamada.prompt.md
Resumen post-llamada para auditoría

### explicacion-usuario.prompt.md
Generación de explicaciones para el usuario

## Formato de Respuesta Esperado

```json
{
  "risk_level": 4,
  "score": 72.5,
  "reason_codes": ["urgencia", "solicitud_otp", "entidad_banco"],
  "evidence_spans": ["transferencia inmediata", "código de verificación"],
  "next_ui_message": "No compartas codes de verificación"
}
```
