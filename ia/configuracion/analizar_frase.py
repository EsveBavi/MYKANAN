"""
Script simple para analizar frases individuales de vishing
Puedes escribir una frase y te dira el nivel de riesgo
"""

from vishing_detector import VishingDetector

def analizar_frase():
    """Analiza una frase individual"""
    detector = VishingDetector()

    print("\n" + "="*60)
    print("  ANALIZADOR DE FRASES DE VISHING")
    print("="*60)
    print("\nEscribe una frase y te dire el nivel de riesgo")
    print("Escribe 'salir' para terminar\n")

    while True:
        frase = input("> ").strip()

        if not frase:
            continue

        if frase.lower() in ['salir', 'exit', 'quit']:
            print("\n[OK] Hasta pronto!")
            break

        # Crear una conversacion simulada con la frase
        dialogo = [
            {"speaker": "agente", "text": frase}
        ]

        # Analizar
        resultado = detector.analyze_conversation(dialogo)

        # Mostrar resultado resumido
        print(f"\n{resultado['emoji']} NIVEL: {resultado['risk_level']} - {resultado['risk_level_name']}")
        print(f"Riesgo: {resultado['risk_score']}%")
        print(f"Detalle: {resultado['description']}")

        if resultado['red_flags']:
            print("\nBanderas detectadas:")
            for flag in resultado['red_flags'][:5]:
                print(f"  - {flag}")

        print("-" * 40)


if __name__ == "__main__":
    analizar_frase()
