import type { Request, Response } from 'express';
import { z } from 'zod';
import { registrarSolicitud } from '../servicios/arco.servicio';

const esquemaArco = z.object({
  telefono: z
    .string()
    .regex(/^\d{10}$/, 'El número debe tener exactamente 10 dígitos (México).'),
  tipo: z.enum(['eliminar', 'rectificar', 'descargar'], {
    message: 'Tipo de solicitud ARCO no válido.',
  }),
  motivo: z
    .string()
    .trim()
    .max(500, 'El motivo no puede exceder 500 caracteres.')
    .optional(),
});

export function crearSolicitudArco(req: Request, resp: Response): void {
  const cuerpo = esquemaArco.safeParse(req.body);
  if (!cuerpo.success) {
    resp.status(400).json({ error: cuerpo.error.issues[0]?.message ?? 'Datos inválidos.' });
    return;
  }
  const resultado = registrarSolicitud(cuerpo.data);
  resp.status(201).json({ ok: true as const, ...resultado });
}
