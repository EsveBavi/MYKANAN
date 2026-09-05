export function esTelefonoValido(valor: unknown): valor is string {
  return typeof valor === 'string' && /^\d{10}$/.test(valor);
}

export function formatearTelefono(telefono: string): string {
  return `+52 ${telefono.slice(0, 2)} ${telefono.slice(2, 6)} ${telefono.slice(6)}`;
}

const LADAS: Record<string, string> = {
  '55': 'CDMX / Zona Centro',
  '56': 'CDMX / Zona Centro',
  '81': 'Monterrey / Nuevo León',
  '33': 'Guadalajara / Jalisco',
  '222': 'Puebla',
  '664': 'Tijuana / B.C.',
  '998': 'Cancún / Q. Roo',
};

export function regionDeTelefono(telefono: string): string {
  return LADAS[telefono.slice(0, 3)] ?? LADAS[telefono.slice(0, 2)] ?? 'México';
}

export function generarFolio(prefijo = 'MK'): string {
  const azar = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefijo}-${azar}`;
}
