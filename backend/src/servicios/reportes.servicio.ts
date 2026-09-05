import { bd } from '../configuracion/baseDatos';
import { generarFolio } from '../utilidades/telefono';
import type { Categoria } from '../modelos/tipos';

export interface EntradaReporte {
  telefono: string;
  categoria: Categoria;
  descripcion?: string;
}

export function crear(entrada: EntradaReporte): { id: number; folio: string } {
  const ahora = new Date().toISOString();
  const folio = generarFolio();
  const transaccion = bd.transaction(() => {
    bd.prepare(
      'INSERT INTO numeros (telefono, creado_en, actualizado_en) VALUES (?, ?, ?) ON CONFLICT(telefono) DO NOTHING',
    ).run(entrada.telefono, ahora, ahora);
    const resultado = bd
      .prepare('INSERT INTO reportes (telefono, categoria, descripcion, creado_en) VALUES (?, ?, ?, ?)')
      .run(entrada.telefono, entrada.categoria, entrada.descripcion ?? null, ahora);
    bd.prepare('UPDATE numeros SET actualizado_en = ? WHERE telefono = ?').run(ahora, entrada.telefono);
    return { id: Number(resultado.lastInsertRowid), folio };
  });
  return transaccion();
}
