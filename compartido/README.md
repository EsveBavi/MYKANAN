# COMPARTIDO - MYKANAN

## Descripción
Código y tipos compartidos entre frontend, backend e IA.

## Contenido

### tipos/
- Definiciones TypeScript compartidas
- Interfaces de eventos y mensajes
- Tipos de dominio

### constantes/
- Niveles de riesgo
- Keywords de vishing
- Configuraciones globales
- Códigos de error

## Ejemplo de Tipos Compartidos

```typescript
// Niveles de riesgo
export enum NivelRiesgo {
  NORMAL = 1,
  SOSPECHA_BAJA = 2,
  RIESGO_MODERADO = 3,
  RIESGO_ALTO = 4,
  FRAUDE_INMINENTE = 5
}

// Eventos del sistema
export interface EventoSesion {
  tipo: 'INICIO' | 'TRANSCRIPCION' | 'EVALUACION' | 'ALERTA' | 'FIN';
  sesionId: string;
  timestamp: number;
}
```
