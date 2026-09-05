import type { Request, Response } from 'express';
import { z } from 'zod';
import { CATEGORIAS } from '../modelos/tipos';
import { crear } from '../servicios/reportes.servicio';

const esquemaReporte = z.object({
  telefono: z
    .string()
    .regex(/^\d{10}$/, 'El número debe tener exactamente 10 dígitos (México).'),
  categoria: z.enum(CATEGORIAS, { message: 'Categoría de riesgo no válida.' }),
  descripcion: z
    .string()
    .trim()
    .max(300, 'La descripción no puede exceder 300 caracteres.')
    .optional(),
});

export function crearReporte(req: Request, resp: Response): void {
  const cuerpo = esquemaReporte.safeParse(req.body);
  if (!cuerpo.success) {
    resp.status(400).json({ error: cuerpo.error.issues[0]?.message ?? 'Datos inválidos.' });
    return;
  }
  const resultado = crear(cuerpo.data);
  resp.status(201).json({ ok: true as const, ...resultado });
}
