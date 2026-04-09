# ROADMAP TÉCNICO - Agente de Llamadas Anti-Vishing
## Sistema de Detección en Tiempo Real con IA

---

## 🎯 OBJETIVO DEL PROYECTO

Desarrollar un agente de llamadas capaz de:
- Escuchar llamadas en tiempo real
- Transcribir con Deepgram (STT streaming)
- Analizar con IA (Groq + Llama 3/Mistral)
- Alertar visualmente en <1 segundo cuando detecte estafa

---

## 📊 EQUIPO: 15 PERSONAS EN 3 CÉLULAS

### CÉLULA IA (5 personas)
- Persona 1: Líder ML
- Persona 2: NLP Engineer
- Persona 3: Speech Engineer
- Persona 4: MLOps
- Persona 5: Fraud Analyst

### CÉLULA BACKEND (5 personas)
- Persona 6: Arquitecto Backend
- Persona 7: n8n Lead
- Persona 8: Supabase Engineer
- Persona 9: Realtime Engineer
- Persona 10: Security Engineer

### CÉLULA FRONTEND (5 personas)
- Persona 11: Lead React
- Persona 12: Realtime UI
- Persona 13: UX/UI Designer
- Persona 14: QA Automation
- Persona 15: PWA/Platform Engineer

---

## 📅 ROADMAP DE 4 SEMANAS

### 🔵 SEMANA 1: FUNDAMENTOS Y CONTRATOS
**Objetivo:** Contratos API definidos, arquitectura congelada, flujo simulado

#### ENTREGABLES:
- [ ] Esquema SQL inicial en Supabase
- [ ] RLS (Row Level Security) base implementado
- [ ] Prototipo de gateway streaming
- [ ] Prompt contract del LLM (JSON schema)
- [ ] Catálogo de reason codes
- [ ] Wireframes de los 5 niveles de riesgo
- [ ] Tablero de métricas de latencia
- [ ] Flujo end-to-end simulado con datos fake

#### CONTRATOS API A DEFINIR (CRÍTICO):
```typescript
// Eventos del sistema
StartCall      { user_id, device_id, call_metadata }
TranscriptPartial { session_id, text, is_final, timestamp }
RiskAssessment { session_id, level, score, reason_codes }
AlertRaised    { session_id, level, message }
EndCall        { session_id, disposition }
```

#### TAREAS POR PERSONA - SEMANA 1:

| Persona | Rol | Tareas Semana 1 |
|---------|-----|-----------------|
| 1 | Líder ML | Taxonomía de fraude, definición score fusionado |
| 2 | NLP Engineer | Dataset sintético, labeling guide |
| 3 | Speech Engineer | Estrategia STT Deepgram streaming |
| 4 | MLOps | Observabilidad de modelos |
| 5 | Fraud Analyst | Reason codes y reglas base |
| 6 | Arquitecto BE | Contratos de eventos, diseño gateway |
| 7 | n8n Lead | Workflows base, estructura de orquestación |
| 8 | Supabase Engineer | Schema SQL + RLS inicial |
| 9 | Realtime Engineer | Diseño canal alertas WebSocket |
| 10 | Security Engineer | Threat model inicial, gestión secretos |
| 11 | Lead React | Arquitectura PWA, estructura de proyecto |
| 12 | Realtime UI | Captura micrófono + conexión socket |
| 13 | UX/UI | Diseño visual de 5 niveles de riesgo |
| 14 | QA Automation | Test harness base |
| 15 | PWA/Platform | Permisos, installability PWA |

---

### 🟢 SEMANA 2: CAMINO CRÍTICO
**Objetivo:** Demo funcional procesando audio real con alertas en vivo

#### ENTREGABLES:
- [ ] Audio streaming desde PWA
- [ ] Deepgram integrado (parciales + finales)
- [ ] Motor de reglas rápido
- [ ] Primera clasificación con Groq
- [ ] Render de alerta en tiempo real
- [ ] Persistencia en Supabase
- [ ] Demo end-to-end con llamadas de prueba

#### OBJETIVOS DE LATENCIA:
```
Captura:       20-40ms
Gateway:       20-80ms
Deepgram STT:  150-300ms
Normalización: 10-20ms
Groq:          80-200ms
Push alerta:   20-80ms
Total:         ~500ms
```

#### TAREAS POR PERSONA - SEMANA 2:

| Persona | Rol | Tareas Semana 2 |
|---------|-----|-----------------|
| 1 | Líder ML | Prompts Groq + JSON schema |
| 2 | NLP Engineer | Extractor keywords/co-ocurrencias |
| 3 | Speech Engineer | Diarización, parciales vs finales |
| 4 | MLOps | Versionado de prompts/modelos |
| 5 | Fraud Analyst | Revisión falsos positivos iniciales |
| 6 | Arquitecto BE | Gateway streaming funcional |
| 7 | n8n Lead | Workflows persistencia + alertas |
| 8 | Supabase Engineer | Funciones y triggers |
| 9 | Realtime Engineer | Relay socket y broadcast |
| 10 | Security Engineer | Cifrado y auditoría base |
| 11 | Lead React | Navegación y estado de la app |
| 12 | Realtime UI | Alertas live en UI |
| 13 | UX/UI | Microinteracciones críticas |
| 14 | QA Automation | Tests E2E Playwright |
| 15 | PWA/Platform | Push notifications, foreground handling |

---

### 🟡 SEMANA 3: ROBUSTEZ
**Objetivo:** Reducción de falsos positivos, tolerancia a fallos, escalabilidad

#### ENTREGABLES:
- [ ] Hysteresis implementado (subir rápido, bajar lento)
- [ ] Retries e idempotencia
- [ ] Observabilidad completa
- [ ] Pruebas de carga (stress test)
- [ ] Reducción >50% de falsos positivos
- [ ] DPIA (Data Protection Impact Assessment)
- [ ] Políticas de retención

#### TAREAS POR PERSONA - SEMANA 3:

| Persona | Rol | Tareas Semana 3 |
|---------|-----|-----------------|
| 1 | Líder ML | Tuning de umbrales |
| 2 | NLP Engineer | AB tests de variantes |
| 3 | Speech Engineer | Manejo errores de STT |
| 4 | MLOps | Validación final de modelos |
| 5 | Fraud Analyst | QA semántico de casos |
| 6 | Arquitecto BE | Escalado y colas |
| 7 | n8n Lead | Retries, idempotencia |
| 8 | Supabase Engineer | Tuning de índices |
| 9 | Realtime Engineer | Pruebas de carga |
| 10 | Security Engineer | DPIA, políticas de control |
| 11 | Lead React | Polish y QA de UI |
| 12 | Realtime UI | Fallback offline mode |
| 13 | UX/UI | Pruebas con usuarios |
| 14 | QA Automation | Matrices de dispositivo/red |
| 15 | PWA/Platform | Performance móvil, batería |

---

### 🔴 SEMANA 4: ENDURECIMIENTO Y RELEASE
**Objetivo:** Seguridad, cumplimiento, operacionalización, piloto

#### ENTREGABLES:
- [ ] Retención configurable implementada
- [ ] Borrado automático de datos
- [ ] Auditoría completa
- [ ] Runbooks operacionales
- [ ] SLO de latencia documentado
- [ ] Suite E2E completa
- [ ] Piloto cerrado con usuarios reales
- [ ] Documentación de seguridad

#### TAREAS POR PERSONA - SEMANA 4:

| Persona | Rol | Tareas Semana 4 |
|---------|-----|-----------------|
| 1 | Líder ML | Optimización final de modelo |
| 2 | NLP Engineer | Release gates del modelo |
| 3 | Speech Engineer | Playbooks de STT |
| 4 | MLOps | Readiness para producción |
| 5 | Fraud Analyst | Runbooks de revisión |
| 6 | Arquitecto BE | Respaldo y retención |
| 7 | n8n Lead | Optimización de workflows |
| 8 | Supabase Engineer | Optimización regional |
| 9 | Realtime Engineer | Pentest y fixes |
| 10 | Security Engineer | Release de seguridad |
| 11 | Lead React | Tuning UX final |
| 12 | Realtime UI | Ajustes finales |
| 13 | UX/UI | Validación final |
| 14 | QA Automation | Smoke suite final |
| 15 | PWA/Platform | Store/package submission |

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                        PWA REACT/VITE                           │
│  (Captura audio + Visualización alertas + Estado de sesión)     │
└────────────────────────┬────────────────────────────────────────┘
                         │ WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GATEWAY STREAMING                            │
│  (Ingesta audiochunks 20-40ms → Deepgram → Clasificación)       │
└────┬──────────────────────────────────────────────┬────────────┘
     │                                              │
     ▼                                              ▼
┌─────────────────┐                      ┌──────────────────────┐
│   DEEPGRAM STT  │                      │   GROQ + LLAMA 3    │
│  (Streaming WS) │                      │  (Clasificación)     │
└────────┬────────┘                      └──────────┬───────────┘
         │                                          │
         └──────────────┬───────────────────────────┘
                        ▼
              ┌─────────────────────┐
              │  MOTOR DE REGLAS    │
              │ (Score rápido)      │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │   FUSIÓN DE SCORE   │
              │ (Reglas + LLM)      │
              └──────┬──────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│ RUTA CALIENTE   │      │  RUTA FRÍA      │
│ (Alerta <1s)    │      │ (Persistencia)  │
└────────┬────────┘      └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  ALERTA PWA     │      │     SUPABASE    │
│ "¡CUELGA AHORA!"│      │ (PostgreSQL +   │
└─────────────────┘      │  Realtime + RLS)│
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      N8N        │
                         │ (Orquestación, │
                         │  auditoría,    │
                         │  workflows)    │
                         └─────────────────┘
```

---

## 🔐 SEGURIDAD Y PRIVACIDAD (CRÍTICO)

### CONTROLES OBLIGATORIOS:
- ✅ **NO** almacenar audio crudo por defecto
- ✅ Solo transcript + features + hashes
- ✅ TLS en tránsito, cifrado AES-256 en reposo
- ✅ RLS en todas las tablas con `auth.uid()`
- ✅ Service role solo en backend/Edge Functions
- ✅ Secretos separados: Supabase, Deepgram, Groq
- ✅ Consentimiento granular (4 niveles)

### CONSENTIMIENTO GRANULAR:
1. Procesamiento para detección antifraude
2. Retención de transcript
3. Retención de audio (opt-in)
4. Uso para mejora del modelo (opt-in)

### RETENCIÓN DE DATOS:
- Transcripts: 30-90 días (configurable)
- Audio crudo: Solo con consentimiento explícito
- Borrado automático de activaciones accidentales
- Auditoría inmutable

---

## 📊 5 NIVELES DE RIESGO

| Nivel | Score | Semántica | Trigger Técnico | Acción UI |
|-------|-------|-----------|-----------------|-----------|
| **1** | 0-19 | Normal | Conversación cotidiana, sin urgencia | Sin alerta |
| **2** | 20-39 | Sospecha baja | Keyword sensible aislada, tono insistente leve | Badge verde "Mantente alerta" |
| **3** | 40-59 | Riesgo moderado | Urgencia + dato personal + "no cuelgue" | Banner naranja + vibración |
| **4** | 60-79 | Riesgo alto | Banco/gobierno + OTP/transferencia + presión | Pantalla roja "No compartas nada" |
| **5** | 80+ | Fraude inminente | Coerción explícita, transferencia inmediata, MFA | Full-screen "¡CUELGA AHORA!" |

### KEYWORDS POR CATEGORÍA:

**Identidad:** código, NIP, OTP, token, verificacíon, contraseña, CVV

**Coerción:** urgente, en este momento, última oportunidad, bloquearemos, demanda, embargo

**Manipulación:** no cuelgue, no diga a nadie, descargue app, comparta pantalla, AnyDesk, TeamViewer

**Financieras:** transferencia, SPEI, cargo no reconocido, devolución, comisión, liberar pago

---

## 🗄️ ESQUEMA DE DATOS (SUPABASE)

```sql
-- Perfil de usuario
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  phone_hash TEXT,
  locale TEXT,
  risk_sensitivity SMALLINT DEFAULT 3,
  created_at TIMESTAMPTZ
);

-- Sesión de llamada
CREATE TABLE call_sessions (
  id UUID PRIMARY KEY,
  user_id UUID,
  device_id UUID,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  direction TEXT,
  counterparty_hash TEXT,
  status TEXT,
  current_risk_level SMALLINT,
  current_score NUMERIC(5,2),
  final_disposition TEXT
);

-- Segmentos de transcripción
CREATE TABLE transcript_segments (
  id UUID PRIMARY KEY,
  call_session_id UUID,
  chunk_seq INT,
  speaker TEXT,
  text TEXT,
  is_final BOOL,
  confidence NUMERIC(4,3),
  started_ms INT,
  ended_ms INT
);

-- Evaluaciones de riesgo
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY,
  call_session_id UUID,
  segment_id UUID,
  rule_score NUMERIC(5,2),
  llm_score NUMERIC(5,2),
  fused_score NUMERIC(5,2),
  risk_level SMALLINT,
  reason_codes JSONB,
  sentiment JSONB,
  urgency JSONB,
  model_name TEXT,
  latency_ms INT,
  created_at TIMESTAMPTZ
);

-- Alertas mostradas
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  call_session_id UUID,
  assessment_id UUID,
  level SMALLINT,
  headline TEXT,
  body TEXT,
  acknowledged_at TIMESTAMPTZ,
  delivered_via TEXT,
  delivered_at TIMESTAMPTZ
);

-- Reglas configurables
CREATE TABLE risk_rules (
  id UUID PRIMARY KEY,
  name TEXT,
  level SMALLINT,
  weight NUMERIC(5,2),
  pattern TEXT,
  language TEXT,
  active BOOL
);
```

---

## ⚡ FLUJO N8N (ORQUESTACIÓN)

```text
1. Webhook StartCall → Recibe user_id, device_id, metadata
2. Supabase Create Session → Inserta call_sessions, devuelve 202
3. Respond to Webhook → Confirma session_id, endpoint streaming
4. Gateway Streaming → WebSocket con Deepgram (chunks 20-40ms)
5. Transcript Event Webhook → Recibe lotes cada 300-500ms
6. Code Normalize → Limpia fillers, ventana 5-8s
7. Code Rule Engine → Score rápido por reglas
8. HTTP Request Groq → Clasificación LLM con JSON
9. Merge/Fuse → Combina rule_score + llm_score
10. IF Risk Changed → ¿Cambió el nivel?
11. Supabase Insert Assessment → Persiste evaluación
12. Supabase Insert Alert → Alerta persistente
13. HTTP Request Relay → Push inmediato por WebSocket
14. IF Level >= 4 → Crea caso en review_queue
15. Webhook EndCall → Cierra sesión, consolida, resume
```

---

## 🚨 DECISIONES ARQUITECTÓNICAS CLAVE

### ❌ NO HACER:
- n8n procesando cada chunk de audio
- Almacenar audio crudo por defecto
- Usar solo LLM sin reglas rápidas
- Esperar a persistencia para alertar

### ✅ SÍ HACER:
- Gateway streaming dedicado + n8n orquestador
- Clasificación 2 etapas (reglas → LLM)
- Hysteresis (subir rápido, bajar lento)
- Ventana deslizante 5-8 segundos
- JSON estricto del LLM
- Ruta caliente (alerta) vs ruta fría (DB)
- WebSockets persistentes
- Prompts ultra-cortos (últimos 2-3 turnos)

---

## 📈 MÉTRICAS DE ÉXITO

### TÉCNICAS:
- Latencia p50: <500ms
- Latencia p95: <800ms
- Uptime: >99.5%
- Falsos positivos: <5%
- Falsos negativos: <2%

### DE NEGOCIO:
- Usuarios activos
- Llamadas procesadas
- Alertas generadas
- Tasa de confirmación de fraude
- Satisfacción del usuario

---

## 📝 RECURSOS Y REFERENCIAS

- Deepgram Streaming: https://developers.deepgram.com/docs/measuring-streaming-latency
- Supabase Realtime: https://supabase.com/docs/guides/realtime/architecture
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Groq + Llama 3: https://groq.com/blog/the-official-llama-api-accelerated-by-groq
- n8n Webhooks: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- GDPR Voice: https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf

---

## ✅ CHECKLIST FINAL

### ANTES DEL RELEASE:
- [ ] Todos los RLS implementados y probados
- [ ] Pruebas de penetración completadas
- [ ] DPIA aprobada
- [ ] SLOs documentados
- [ ] Runbooks completos
- [ ] Suite E2E pasando
- [ ] Piloto cerrado exitoso
- [ ] Documentación de seguridad
- [ ] Política de retención implementada
- [ ] Borrado automático probado
- [ ] Consentimiento granular implementado
- [ ] Monitoreo y alertas operacionales

---

**Documento generado para desarrollo de Agente de Llamadas Anti-Vishing**
**Stack: React + Vite (PWA) | N8N | Supabase | Groq + Llama 3 | Deepgram**
**Equipo: 15 personas en 3 células (IA, Backend, Frontend)**
**Duración: 4 semanas**
