"""
MODELO PREDICTIVO DE DETECCIÓN DE VISHING
Detecta estafas telefónicas en 5 niveles de riesgo
Carga automáticamente todos los datasets JSON de la carpeta utilidades
"""

import json
import os
import re
import glob
from typing import List, Dict, Tuple
from collections import Counter
import math


class VishingDetector:
    """Detector de vishing con 5 niveles de riesgo"""

    # Palabras clave sospechosas por categoría
    RED_FLAGS_PATTERNS = {
        'urgencia': [
            r'urgente', r'inmediatamente', r'ahora mismo', r'en los próximos',
            r'5 minutos', r'10 minutos', r'hoy', r'vence hoy', r'no hay tiempo',
            r'antes de que', r'se acaba el tiempo', r'ultima oportunidad'
        ],
        'amenazas': [
            r'bloquear', r'arresto', r'policía', r'detención', r'cárcel',
            r'orden de', r'sat', r'hacienda', r'fiscalía', r'ministerio público',
            r'demanda', r'multa', r'sanción'
        ],
        'datos_sensibles': [
            r'número de tarjeta', r'cvv', r'código de seguridad', r'pin',
            r'contraseña', r'clave', r'cuenta bancaria', r'clabe',
            r'datos de tarjeta', r'verificar identidad'
        ],
        'pago_urgente': [
            r'tarjeta de regalo', r'gift card', r'oxxo', r'transferencia',
            r'pagar ahora', r'pago inmediato', r'liberar', r'impuestos',
            r'fianza', r'tarjeta de crédito'
        ],
        'acceso_remoto': [
            r'acceso remoto', r'descargar software', r'instalar programa',
            r'teamviewer', r'anydesk', r'computadora', r'virus'
        ],
        'premios': [
            r'ganador', r'premio', r'lotería', r'sorteo', r'herencia',
            r'felicidades', r'se ha seleccionado', r'claim prize'
        ],
        'secreto': [
            r'no diga a nadie', r'no cuente a', r'confidencial', r'secreto',
            r'nadie más debe saber', r'entre usted y yo'
        ]
    }

    # Patrones de llamadas legítimas
    LEGITIMATE_PATTERNS = [
        r'puede llamarnos al', r'nuestro teléfono es', r'visite nuestra sucursal',
        r'su cita es', r'confirmación', r'servicio al cliente',
        r'este llamado es grabado', r'para su seguridad', r'llamar después'
    ]

    def __init__(self, training_folder: str = None):
        """
        Inicializa el detector cargando todos los JSON de entrenamiento

        Args:
            training_folder: Carpeta con los JSON de entrenamiento
        """
        self.training_folder = training_folder or self._get_default_folder()
        self.conversations = []
        self.red_flags_database = []
        self.vocabulary = {}
        self.risk_thresholds = {
            1: 0.20,   # Nivel 1: Seguro (0-20%)
            2: 0.40,   # Nivel 2: Precaución (21-40%)
            3: 0.60,   # Nivel 3: Sospechoso (41-60%)
            4: 0.80,   # Nivel 4: Alto Riesgo (61-80%)
            5: 1.00    # Nivel 5: Vishing Confirmado (81-100%)
        }

        # Cargar todos los datasets
        self.load_all_datasets()

    def _get_default_folder(self) -> str:
        """Obtiene la carpeta predeterminada de utilidades"""
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        return os.path.join(parent_dir, 'utilidades')

    def load_all_datasets(self) -> None:
        """Carga todos los archivos JSON de la carpeta de utilidades"""
        json_files = glob.glob(os.path.join(self.training_folder, '*.json'))

        print(f"Buscando datasets en: {self.training_folder}")
        print(f"Archivos encontrados: {len(json_files)}\n")

        for json_file in json_files:
            self.load_dataset(json_file)

        print(f"\nTotal de conversaciones cargadas: {len(self.conversations)}")
        print(f"   - Fraudulentas: {sum(1 for c in self.conversations if c.get('label') == 'fraudulenta')}")
        print(f"   - Legitimas: {sum(1 for c in self.conversations if c.get('label') == 'legitima')}")

    def load_dataset(self, filepath: str) -> None:
        """Carga un dataset JSON específico"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)

            filename = os.path.basename(filepath)
            conversations = data.get('conversations', [])

            self.conversations.extend(conversations)

            # Extraer red flags del dataset
            for conv in conversations:
                if 'red_flags' in conv:
                    self.red_flags_database.extend(conv['red_flags'])

            print(f"   [OK] {filename}: {len(conversations)} conversaciones")

        except Exception as e:
            print(f"   [ERROR] Error cargando {filepath}: {e}")

    def extract_features(self, dialogue: List[Dict]) -> Dict:
        """
        Extrae características de una conversación

        Args:
            dialogue: Lista de turnos de conversación

        Returns:
            Diccionario con características extraídas
        """
        features = {
            'red_flags_detected': [],
            'urgency_count': 0,
            'threat_count': 0,
            'sensitive_data_count': 0,
            'payment_count': 0,
            'remote_access_count': 0,
            'prize_count': 0,
            'secrecy_count': 0,
            'legitimate_markers': 0,
            'agent_to_client_ratio': 0,
            'avg_urgency_position': [],
            'repeated_requests': 0
        }

        full_text = ""
        agent_turns = 0
        client_turns = 0
        sensitive_requests = []

        for i, turn in enumerate(dialogue):
            speaker = turn.get('speaker', '')
            text = turn.get('text', '').lower()
            full_text += text + " "

            if speaker == 'agente':
                agent_turns += 1
            else:
                client_turns += 1

            # Detectar patrones sospechosos
            for category, patterns in self.RED_FLAGS_PATTERNS.items():
                for pattern in patterns:
                    if re.search(pattern, text, re.IGNORECASE):
                        if category == 'urgencia':
                            features['urgency_count'] += 1
                            features['avg_urgency_position'].append(i)
                            features['red_flags_detected'].append(f"urgencia: '{pattern}'")
                        elif category == 'amenazas':
                            features['threat_count'] += 1
                            features['red_flags_detected'].append(f"amenaza: '{pattern}'")
                        elif category == 'datos_sensibles':
                            features['sensitive_data_count'] += 1
                            sensitive_requests.append(i)
                            features['red_flags_detected'].append(f"datos_sensibles: '{pattern}'")
                        elif category == 'pago_urgente':
                            features['payment_count'] += 1
                            features['red_flags_detected'].append(f"pago: '{pattern}'")
                        elif category == 'acceso_remoto':
                            features['remote_access_count'] += 1
                            features['red_flags_detected'].append(f"acceso_remoto: '{pattern}'")
                        elif category == 'premios':
                            features['prize_count'] += 1
                            features['red_flags_detected'].append(f"premio: '{pattern}'")
                        elif category == 'secreto':
                            features['secrecy_count'] += 1
                            features['red_flags_detected'].append(f"secreto: '{pattern}'")

            # Detectar patrones legítimos
            for pattern in self.LEGITIMATE_PATTERNS:
                if re.search(pattern, text, re.IGNORECASE):
                    features['legitimate_markers'] += 1

        # Calcular ratio agente-cliente
        if client_turns > 0:
            features['agent_to_client_ratio'] = agent_turns / client_turns

        # Detectar solicitudes repetidas de datos sensibles
        if len(sensitive_requests) > 1:
            features['repeated_requests'] = len(sensitive_requests)

        # Promedio de posición de urgencia (más temprano = más sospechoso)
        if features['avg_urgency_position']:
            total_turns = len(dialogue)
            features['avg_urgency_position'] = sum(features['avg_urgency_position']) / len(features['avg_urgency_position'])
            features['avg_urgency_position'] = 1 - (features['avg_urgency_position'] / total_turns)  # Invertido: 1 = al inicio
        else:
            features['avg_urgency_position'] = 0

        return features

    def calculate_risk_score(self, features: Dict) -> float:
        """
        Calcula el score de riesgo basado en las características

        Args:
            features: Características extraídas

        Returns:
            Score de riesgo (0-1)
        """
        score = 0.0

        # Pesos de cada caracteristica - aumentados para mejor deteccion
        weights = {
            'urgency': 0.25,
            'threat': 0.35,
            'sensitive_data': 0.35,
            'payment': 0.30,
            'remote_access': 0.35,
            'prize': 0.25,
            'secrecy': 0.25,
            'repeated_requests': 0.30,
            'agent_pressure': 0.15
        }

        # Urgencia - multiplicador aumentado
        if features['urgency_count'] > 0:
            urgency_score = min(features['urgency_count'] * 0.5, 1.0)
            score += urgency_score * weights['urgency']

        # Amenazas - multiplicador aumentado
        if features['threat_count'] > 0:
            threat_score = min(features['threat_count'] * 0.6, 1.0)
            score += threat_score * weights['threat']

        # Datos sensibles - multiplicador aumentado
        if features['sensitive_data_count'] > 0:
            sensitive_score = min(features['sensitive_data_count'] * 0.7, 1.0)
            score += sensitive_score * weights['sensitive_data']

        # Pago urgente - multiplicador aumentado
        if features['payment_count'] > 0:
            payment_score = min(features['payment_count'] * 0.7, 1.0)
            score += payment_score * weights['payment']

        # Acceso remoto - multiplicador aumentado
        if features['remote_access_count'] > 0:
            remote_score = min(features['remote_access_count'] * 0.8, 1.0)
            score += remote_score * weights['remote_access']

        # Premios - multiplicador aumentado
        if features['prize_count'] > 0:
            prize_score = min(features['prize_count'] * 0.7, 1.0)
            score += prize_score * weights['prize']

        # Secretismo - multiplicador aumentado
        if features['secrecy_count'] > 0:
            secrecy_score = min(features['secrecy_count'] * 0.6, 1.0)
            score += secrecy_score * weights['secrecy']

        # Solicitudes repetidas - multiplicador aumentado
        if features['repeated_requests'] > 1:
            repeated_score = min(features['repeated_requests'] * 0.4, 1.0)
            score += repeated_score * weights['repeated_requests']

        # Presion del agente (ratio alto)
        if features['agent_to_client_ratio'] > 2.0:
            score += 0.2 * weights['agent_pressure']

        # Urgencia temprana en la conversacion
        if features['avg_urgency_position'] > 0.5:
            score += 0.2

        # Reducir score por marcadores legitimos
        if features['legitimate_markers'] > 0:
            reduction = min(features['legitimate_markers'] * 0.15, 0.5)
            score = max(0, score - reduction)

        return min(score, 1.0)

    def get_risk_level(self, score: float) -> Tuple[int, str, str, str]:
        """
        Obtiene el nivel de riesgo basado en el score

        Args:
            score: Score de riesgo (0-1)

        Returns:
            Tupla (nivel, nombre, emoji, descripcion)
        """
        if score <= self.risk_thresholds[1]:
            return (1, "SEGURO", "[VERDE]", "La conversacion parece legitima")
        elif score <= self.risk_thresholds[2]:
            return (2, "PRECAUCION", "[AMARILLO]", "Algunos elementos requieren atencion")
        elif score <= self.risk_thresholds[3]:
            return (3, "SOSPECHOSO", "[NARANJA]", "Multiples indicadores de alerta")
        elif score <= self.risk_thresholds[4]:
            return (4, "ALTO RIESGO", "[ROJO]", "Patrones tipicos de vishing")
        else:
            return (5, "VISHING CONFIRMADO", "[CRITICO]", "Alta probabilidad de estafa")

    def analyze_conversation(self, dialogue: List[Dict], verbose: bool = True) -> Dict:
        """
        Analiza una conversación completa

        Args:
            dialogue: Lista de turnos de conversación
            verbose: Si True, muestra análisis detallado

        Returns:
            Diccionario con resultados del análisis
        """
        features = self.extract_features(dialogue)
        risk_score = self.calculate_risk_score(features)
        level, level_name, emoji, description = self.get_risk_level(risk_score)

        result = {
            'risk_score': round(risk_score * 100, 2),
            'risk_level': level,
            'risk_level_name': level_name,
            'emoji': emoji,
            'description': description,
            'features': features,
            'red_flags': features['red_flags_detected']
        }

        if verbose:
            self._print_analysis(result)

        return result

    def _print_analysis(self, result: Dict) -> None:
        """Imprime el análisis de forma formateada"""
        print("\n" + "="*60)
        print("  ANALISIS DE VISHING")
        print("="*60)
        print(f"\nNIVEL DE RIESGO: {result['risk_level']} - {result['risk_level_name']}")
        print(f"Score de riesgo: {result['risk_score']}%")
        print(f"{result['description']}\n")

        if result['red_flags']:
            print("BANDERAS ROJAS DETECTADAS:")
            for flag in result['red_flags'][:10]:  # Maximo 10
                print(f"   - {flag}")
            if len(result['red_flags']) > 10:
                print(f"   ... y {len(result['red_flags']) - 10} mas")
            print()

        # Estadísticas
        f = result['features']
        print("ESTADISTICAS:")
        print(f"   - Urgencias detectadas: {f['urgency_count']}")
        print(f"   - Amenazas detectadas: {f['threat_count']}")
        print(f"   - Solicitudes de datos sensibles: {f['sensitive_data_count']}")
        print(f"   - Solicitudes de pago: {f['payment_count']}")
        print(f"   - Solicitudes de acceso remoto: {f['remote_access_count']}")
        print(f"   - Menciones de premios: {f['prize_count']}")
        print(f"   - Pedidos de secreto: {f['secrecy_count']}")
        print(f"   - Marcadores legitimos: {f['legitimate_markers']}")
        print()

    def simulate_call(self) -> None:
        """Modo interactivo de simulación de llamada"""
        print("\n" + "="*60)
        print("  MODO DE SIMULACION DE LLAMADA")
        print("="*60)
        print("\nInstrucciones:")
        print("  - Escribe lo que dice la otra persona")
        print("  - Usa 'agente:' o 'a:' para hablar como el estafador")
        print("  - Usa 'cliente:' o 'c:' para hablar como la victima")
        print("  - Escribe 'analizar' para ver el analisis actual")
        print("  - Escribe 'salir' para terminar")
        print("-"*60)

        dialogue = []
        while True:
            user_input = input("\n> ").strip()

            if not user_input:
                continue

            if user_input.lower() in ['salir', 'exit', 'quit']:
                print("\nTerminando simulacion...")
                break

            if user_input.lower() == 'analizar':
                if dialogue:
                    self.analyze_conversation(dialogue)
                else:
                    print("[!] No hay conversacion para analizar aun.")
                continue

            # Procesar input
            speaker = None
            text = user_input

            if user_input.lower().startswith(('agente:', 'a:')):
                speaker = 'agente'
                text = user_input.split(':', 1)[1].strip()
            elif user_input.lower().startswith(('cliente:', 'c:')):
                speaker = 'cliente'
                text = user_input.split(':', 1)[1].strip()
            else:
                # Intentar detectar automáticamente
                if dialogue and dialogue[-1].get('speaker') == 'agente':
                    speaker = 'cliente'
                else:
                    speaker = 'agente'

            dialogue.append({'speaker': speaker, 'text': text})

            # Respuesta simulada si es el cliente
            if speaker == 'cliente':
                print(f"   [CLIENTE] {text}")

                # Analisis automatico cada 3 turnos
                if len(dialogue) % 6 == 0:
                    print("\nAnalisis intermedio:")
                    self.analyze_conversation(dialogue)
            else:
                print(f"   [AGENTE] {text}")

    def batch_analyze(self, test_conversations: List[Dict]) -> List[Dict]:
        """
        Analiza múltiples conversaciones en lote

        Args:
            test_conversations: Lista de conversaciones para analizar

        Returns:
            Lista de resultados
        """
        results = []
        for conv in test_conversations:
            dialogue = conv.get('dialogue', [])
            result = self.analyze_conversation(dialogue, verbose=False)
            result['id'] = conv.get('id', 'unknown')
            result['true_label'] = conv.get('label', 'unknown')
            results.append(result)
        return results


def main():
    """Función principal con demostración"""

    print("\n" + "="*60)
    print("  DETECTOR DE VISHING - MODELO PREDICTIVO")
    print("  Analisis de estafas telefonicas en 5 niveles")
    print("="*60)

    # Inicializar detector
    detector = VishingDetector()

    # Ejemplo de uso
    print("\n" + "="*60)
    print("  EJEMPLO DE USO")
    print("="*60)

    # Conversacion de ejemplo
    ejemplo_dialogo = [
        {"speaker": "agente", "text": "Buenos dias, le llama el departamento de seguridad de su banco"},
        {"speaker": "cliente", "text": "¿De que banco?"},
        {"speaker": "agente", "text": "De Banco Nacional, es urgente, alguien esta intentando acceder a su cuenta"},
        {"speaker": "cliente", "text": "¿Que debo hacer?"},
        {"speaker": "agente", "text": "Necesito su numero de tarjeta y el codigo CVV ahora mismo para bloquear la transaccion"},
        {"speaker": "cliente", "text": "¿Por telefono?"},
        {"speaker": "agente", "text": "Si no lo hace en 5 minutos su cuenta quedara bloqueada y perdera todo su dinero"}
    ]

    print("\nConversacion de prueba:")
    for turn in ejemplo_dialogo:
        speaker_icon = "[AGENTE]" if turn['speaker'] == 'agente' else "[CLIENTE]"
        print(f"   {speaker_icon} {turn['text']}")

    print("\nANALISIS:")
    detector.analyze_conversation(ejemplo_dialogo)

    # Modo interactivo
    print("\n" + "="*60)
    respuesta = input("\n¿Deseas entrar al modo de simulacion de llamada? (s/n): ").lower()

    if respuesta == 's':
        detector.simulate_call()

    print("\n[OK] Hasta pronto!")


if __name__ == "__main__":
    main()
