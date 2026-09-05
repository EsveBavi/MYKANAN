import rateLimit from 'express-rate-limit';

const opcionesBase = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const limiteLectura = rateLimit({
  ...opcionesBase,
  windowMs: 60_000,
  limit: 120,
  message: { error: 'Demasiadas consultas. Intenta de nuevo en un minuto.' },
});

export const limiteReporte = rateLimit({
  ...opcionesBase,
  windowMs: 15 * 60_000,
  limit: 5,
  message: { error: 'Límite de reportes alcanzado. Intenta de nuevo en 15 minutos.' },
});

export const limiteArco = rateLimit({
  ...opcionesBase,
  windowMs: 60 * 60_000,
  limit: 3,
  message: { error: 'Límite de solicitudes ARCO alcanzado. Intenta de nuevo en una hora.' },
});
