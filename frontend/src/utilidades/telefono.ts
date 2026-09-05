const LADAS: Record<string, string> = {
  '55': 'CDMX / Zona Centro',
  '56': 'CDMX / Zona Centro',
  '81': 'Monterrey / Nuevo León',
  '33': 'Guadalajara / Jalisco',
  '222': 'Puebla',
  '664': 'Tijuana / B.C.',
  '998': 'Cancún / Q. Roo',
};

export function soloDigitos(entrada: string): string {
  return entrada.replace(/\D/g, '');
}

export function normalizarTelefono(entrada: string): string | null {
  let d = soloDigitos(entrada);
  if (d.length === 12 && d.startsWith('52')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('52')) d = d.slice(2);
  return esTelefonoValido(d) ? d : null;
}

export function esTelefonoValido(entrada: string): boolean {
  return /^\d{10}$/.test(entrada);
}

export function formatearTelefono(telefono: string): string {
  if (!esTelefonoValido(telefono)) return telefono;
  return `+52 ${telefono.slice(0, 2)} ${telefono.slice(2, 6)} ${telefono.slice(6)}`;
}

export function regionDeTelefono(telefono: string): string {
  return LADAS[telefono.slice(0, 3)] ?? LADAS[telefono.slice(0, 2)] ?? 'México';
}

export function telefonoOculto(telefono: string): string {
  if (!esTelefonoValido(telefono)) return telefono;
  return `+52 ${telefono.slice(0, 2)} ${telefono.slice(2, 6)} ••••`;
}

export function tiempoRelativo(fechaIso: string): string {
  const diff = Date.now() - new Date(fechaIso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'hace instantes';
  if (min < 60) return `hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const dias = Math.floor(hrs / 24);
  if (dias === 1) return 'ayer';
  return `hace ${dias} días`;
}
