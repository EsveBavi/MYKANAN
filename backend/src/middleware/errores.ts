import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function manejarErrores(
  error: unknown,
  _req: Request,
  resp: Response,
  _siguiente: NextFunction,
): void {
  if (error instanceof ZodError) {
    const primera = error.issues[0];
    resp.status(400).json({ error: primera?.message ?? 'Datos inválidos.' });
    return;
  }
  console.error('[mykanan]', error);
  resp.status(500).json({ error: 'Error interno del servidor.' });
}

export function noEncontrado(_req: Request, resp: Response): void {
  resp.status(404).json({ error: 'Ruta no encontrada.' });
}
