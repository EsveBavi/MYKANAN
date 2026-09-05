# MODELO PREDICTIVO DE VISHING

Sistema de deteccion de estafas telefonicas (vishing) con 5 niveles de riesgo.

## 📁 ARCHIVOS

- `vishing_detector.py` - Modelo principal con todos los algoritmos
- `test_vishing.py` - Script de prueba con ejemplos
- `analizar_frase.py` - Analiza frases individuales en tiempo real

## 🎯 5 NIVELES DE RIESGO

| Nivel | Nombre | Rango | Descripcion |
|-------|--------|-------|-------------|
| 1 | SEGURO | 0-20% | La conversacion parece legitima |
| 2 | PRECAUCION | 21-40% | Algunos elementos requieren atencion |
| 3 | SOSPECHOSO | 41-60% | Multiples indicadores de alerta |
| 4 | ALTO RIESGO | 61-80% | Patrones tipicos de vishing |
| 5 | VISHING CONFIRMADO | 81-100% | Alta probabilidad de estafa |

## 🚀 COMO USAR

### Opcion 1: Analizar una frase individual
```bash
python analizar_frase.py
```

Luego escribe frases como:
- "Necesito tu numero de tarjeta ahora"
- "Felicidades has ganado un premio"
- "Buenos tardes le llama el banco para confirmar su cita"

### Opcion 2: Ejecutar pruebas
```bash
python test_vishing.py
```

### Opcion 3: Usar el modelo en tu codigo
```python
from vishing_detector import VishingDetector

# Crear detector
detector = VishingDetector()

# Conversacion a analizar
conversacion = [
    {"speaker": "agente", "text": "Buenos dias, le llama seguridad del banco"},
    {"speaker": "cliente", "text": "¿Si?"},
    {"speaker": "agente", "text": "Necesito su CVV ahora mismo o bloqueamos su cuenta"}
]

# Analizar
resultado = detector.analyze_conversation(conversacion)

# Ver resultado
print(f"Nivel: {resultado['risk_level']}")
print(f"Riesgo: {resultado['risk_score']}%")
print(f"Banderas: {resultado['red_flags']}")
```

## 🔍 DETECTA

- **Urgencias artificiales**: "ahora mismo", "5 minutos", "hoy"
- **Amenazas**: "policia", "arresto", "SAT", "demanda"
- **Datos sensibles**: "tarjeta", "CVV", "PIN", "contrasena"
- **Pagos urgentes**: "tarjeta de regalo", "transferencia"
- **Acceso remoto**: "TeamViewer", "acceso remoto", "virus"
- **Promesas de premios**: "loteria", "sorteo", "felicidades"
- **Secretismo**: "no diga a nadie", "secreto"

## 📊 DATASETS

El modelo carga automaticamente TODOS los archivos JSON de la carpeta `utilidades`.
No importa como se llamen, los leerá todos.

Formato esperado del JSON:
```json
{
  "dataset_info": {...},
  "conversations": [
    {
      "id": "FRAUD_001",
      "label": "fraudulenta",
      "type": "bancario",
      "risk_score": 0.97,
      "red_flags": [...],
      "dialogue": [
        {"speaker": "agente", "text": "..."},
        {"speaker": "cliente", "text": "..."}
      ]
    }
  ]
}
```

## ⚙️ CONFIGURACION

Puedes ajustar los umbrales en el codigo:
```python
self.risk_thresholds = {
    1: 0.20,   # Nivel 1
    2: 0.40,   # Nivel 2
    3: 0.60,   # Nivel 3
    4: 0.80,   # Nivel 4
    5: 1.00    # Nivel 5
}
```

## 📈 RESULTADOS DE TESTS

| Test | Nivel | Riesgo | Resultado |
|------|-------|--------|-----------|
| Fraude bancario | 2 | 37% | ⚠️ Precaucion |
| Premio loteria | 5 | 100% | ✅ Vishing confirmado |
| Soporte falso | 2 | 35% | ⚠️ Precaucion |
| Llamada legitima | 1 | 0% | ✅ Seguro |
| SAT falso | 2 | 35% | ⚠️ Precaucion |

---

**Autor**: Modelo predictivo de vishing
**Version**: 1.0
**Fecha**: 2025
