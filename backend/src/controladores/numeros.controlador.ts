import type { Request, Response } from 'express';
import { z } from 'zod';
import { estadisticas, listar, consultarDetalle } from '../servicios/numeros.servicio';

const esquemaListado = z.object({
  grupo: z.enum(['fraude', 'spam', 'verificado']).optional(),
  busqueda: z
    .string()
    .regex(/^\d{0,10}$/, 'La búsqueda solo acepta dígitos.')
    .optional(),
  limite: z.coerce.number().int().min(1).max(50).default(10),
  pagina: z.coerce.number().int().min(1).default(1),
});

export function obtenerNumero(req: Request, resp: Response): void {
  const resultado = z
    .string()
    .regex(/^\d{10}$/, 'El número debe tener exactamente 10 dígitos.')
    .safeParse(req.params.telefono);
  if (!resultado.success) {
    resp.status(400).json({ error: resultado.error.issues[0]?.message ?? 'Número inválido.' });
    return;
  }
  resp.json(consultarDetalle(resultado.data));
}

export function listarNumeros(req: Request, resp: Response): void {
  const consulta = esquemaListado.safeParse(req.query);
  if (!consulta.success) {
    resp.status(400).json({ error: consulta.error.issues[0]?.message ?? 'Parámetros inválidos.' });
    return;
  }
  resp.json(listar(consulta.data));
}

export function obtenerEstadisticas(_req: Request, resp: Response): void {
  resp.json(estadisticas());
}
