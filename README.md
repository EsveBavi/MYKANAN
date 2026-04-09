# MYKANAN - Agente Anti-Vishing

## 🎯 Descripción
Sistema de detección de vishing en tiempo real que analiza llamadas telefónicas y alerta a los usuarios sobre posibles estafas.

## 🏗️ Arquitectura

```
MYKANAN/
├── frontend/          # React + Vite (PWA)
├── backend/           # Node.js + Express
├── ia/                # Modelos de IA (Groq + Deepgram)
└── compartido/        # Tipos y constantes compartidas
```

## 🚀 Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React, Vite, TypeScript, TailwindCSS |
| Backend | Node.js, Express, Supabase |
| IA | Groq (Llama 3/Mistral), Deepgram STT |
| Orquestación | N8N |
| Base de Datos | Supabase PostgreSQL + Realtime |

## 📊 Niveles de Riesgo

| Nivel | Score | Descripción | Alerta |
|-------|-------|-------------|--------|
| 1 | 0-19 | Normal | Sin alerta |
| 2 | 20-39 | Sospecha baja | Badge verde |
| 3 | 40-59 | Riesgo moderado | Banner naranja + vibración |
| 4 | 60-79 | Riesgo alto | Pantalla roja |
| 5 | 80+ | Fraude inminente | Full-screen "¡CUELGA AHORA!" |

## 🔒 Seguridad

- ✅ RLS (Row Level Security) en Supabase
- ✅ Sin almacenamiento de audio crudo
- ✅ Cifrado en tránsito y reposo
- ✅ Consentimiento granular
- ✅ Retención configurable

## 👥 Equipo

15 personas en 3 células:
- **Célula IA:** 5 personas
- **Célula Backend:** 5 personas
- **Célula Frontend:** 5 personas

Ver [roadmap-agente-llamadas-antivishing.md](roadmap-agente-llamadas-antivishing.md) para detalles.

## 📦 Instalación

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# IA
cd ia
npm install
```

## 📄 Licencia
Copyright © 2026 MYKANAN
