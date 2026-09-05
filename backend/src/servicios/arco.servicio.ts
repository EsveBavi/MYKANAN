import { bd } from '../configuracion/baseDatos';
import { generarFolio } from '../utilidades/telefono';

export interface EntradaArco {
  telefono: string;
  tipo: 'eliminar' | 'rectificar' | 'descargar';
  motivo?: string;
}

export function registrarSolicitud(entrada: EntradaArco): { folio: string } {
  const folio = generarFolio('ARCO');
  bd.prepare(
    'INSERT INTO solicitudes_arco (telefono, tipo, motivo, folio, creado_en) VALUES (?, ?, ?, ?, ?)',
  ).run(entrada.telefono, entrada.tipo, entrada.motivo ?? null, folio, new Date().toISOString());
  return { folio };
}
