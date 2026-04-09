# INTELIGENCIA ARTIFICIAL - MYKANAN

## Descripción
Módulos de IA para análisis de llamadas, detección de patrones de vishing y clasificación de riesgo.

## Tecnologías
- Groq (Llama 3 / Mistral)
- Deepgram (Speech-to-Text)
- Python/Node.js

## Estructura de Carpetas

```
ia/
├── modelos/               # Modelos de ML y clasificadores
├── prompts/               # Prompts para LLM
├── utilidades/            # Preprocesamiento y postprocesamiento
└── configuracion/         # Configuración de modelos
```

## Componentes Principales

### 1. Motor de Reglas
- Análisis léxico de keywords
- Detección de co-ocurrencias
- Scoring rápido

### 2. Clasificador LLM
- Análisis semántico profundo
- Detección de coerción
- Contexto conversacional

### 3. Fusión de Scores
- Combinación reglas + LLM
- Hysteresis para estabilidad
- Niveles de riesgo 1-5

## Uso
```bash
# Instalación de dependencias
npm install

# Entrenamiento/validación
npm run validate

# Pruebas de modelos
npm run test-models
```
