"""
Script de prueba rapida del detector de vishing
Simula una conversacion y muestra el analisis
"""

from vishing_detector import VishingDetector

def test_frases_sospechosas():
    """Prueba frases tipicas de vishing"""

    detector = VishingDetector()

    # Test 1: Llamada bancaria fraudulenta
    print("\n" + "="*70)
    print("TEST 1: FRAUDE BANCARIO")
    print("="*70)

    dialogo1 = [
        {"speaker": "agente", "text": "Buenos dias, le llama el departamento de seguridad de su banco"},
        {"speaker": "cliente", "text": "¿Si?"},
        {"speaker": "agente", "text": "Hemos detectado una transaccion sospechosa, necesito su CVV ahora"},
        {"speaker": "cliente", "text": "¿Por telefono?"},
        {"speaker": "agente", "text": "Si no me lo da ahora, bloqueamos su cuenta en 5 minutos"}
    ]

    resultado1 = detector.analyze_conversation(dialogo1)
    print(f"Resultado: Nivel {resultado1['risk_level']} - {resultado1['risk_level_name']}")

    # Test 2: Premio de loteria
    print("\n" + "="*70)
    print("TEST 2: PREMIO DE LOTERIA")
    print("="*70)

    dialogo2 = [
        {"speaker": "agente", "text": "Felicidades, ha ganado 500,000 pesos"},
        {"speaker": "cliente", "text": "¿En serio?"},
        {"speaker": "agente", "text": "Solo necesita pagar 3,500 pesos de impuestos para liberar el premio"},
        {"speaker": "cliente", "text": "¿Y como hago eso?"},
        {"speaker": "agente", "text": "Haga una transferencia a esta cuenta CLABE, el premio vence hoy"}
    ]

    resultado2 = detector.analyze_conversation(dialogo2)
    print(f"Resultado: Nivel {resultado2['risk_level']} - {resultado2['risk_level_name']}")

    # Test 3: Soporte tecnico falso
    print("\n" + "="*70)
    print("TEST 3: SOPORTE TECNICO FALSO")
    print("="*70)

    dialogo3 = [
        {"speaker": "agente", "text": "Hola, le llama Microsoft, su PC tiene un virus"},
        {"speaker": "cliente", "text": "¿Virus?"},
        {"speaker": "agente", "text": "Si, descargue nuestro software y denos acceso remoto ya"},
        {"speaker": "cliente", "text": "¿Cuesta algo?"},
        {"speaker": "agente", "text": "299 pesos, pero si no lo hace ahora perdera sus archivos"}
    ]

    resultado3 = detector.analyze_conversation(dialogo3)
    print(f"Resultado: Nivel {resultado3['risk_level']} - {resultado3['risk_level_name']}")

    # Test 4: Llamada legitima
    print("\n" + "="*70)
    print("TEST 4: LLAMADA LEGITIMA")
    print("="*70)

    dialogo4 = [
        {"speaker": "agente", "text": "Buenas tardes, le llama del banco para confirmar su cita"},
        {"speaker": "cliente", "text": "¿Que cita?"},
        {"speaker": "agente", "text": "Su cita en la sucursal del martes a las 10am"},
        {"speaker": "cliente", "text": "Ah si, gracias"},
        {"speaker": "agente", "text": "Puede llamar a nuestro numero 55-1234-5678 para confirmar"}
    ]

    resultado4 = detector.analyze_conversation(dialogo4)
    print(f"Resultado: Nivel {resultado4['risk_level']} - {resultado4['risk_level_name']}")

    # Test 5: Amenaza del SAT
    print("\n" + "="*70)
    print("TEST 5: AMENAZA DEL SAT FALSA")
    print("="*70)

    dialogo5 = [
        {"speaker": "agente", "text": "Buenas tardes, le llama el SAT"},
        {"speaker": "cliente", "text": "¿Si?"},
        {"speaker": "agente", "text": "Tenemos una orden de arresto en su contra por evasión fiscal"},
        {"speaker": "cliente", "text": "¿Que?"},
        {"speaker": "agente", "text": "Pague 8,500 pesos ahora o la policia ira a su domicilio en 2 horas"}
    ]

    resultado5 = detector.analyze_conversation(dialogo5)
    print(f"Resultado: Nivel {resultado5['risk_level']} - {resultado5['risk_level_name']}")

    # Resumen
    print("\n" + "="*70)
    print("RESUMEN DE TESTS")
    print("="*70)
    print(f"Test 1 (Fraude bancario): Nivel {resultado1['risk_level']} - {resultado1['risk_score']}%")
    print(f"Test 2 (Loteria): Nivel {resultado2['risk_level']} - {resultado2['risk_score']}%")
    print(f"Test 3 (Soporte falso): Nivel {resultado3['risk_level']} - {resultado3['risk_score']}%")
    print(f"Test 4 (Legitima): Nivel {resultado4['risk_level']} - {resultado4['risk_score']}%")
    print(f"Test 5 (SAT falso): Nivel {resultado5['risk_level']} - {resultado5['risk_score']}%")

if __name__ == "__main__":
    test_frases_sospechosas()
