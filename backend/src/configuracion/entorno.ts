import 'dotenv/config';

export const entorno = {
  puerto: Number(process.env.PUERTO ?? 3001),
  origenPermitido: process.env.ORIGEN_PERMITIDO ?? 'http://localhost:5173',
  rutaDb: process.env.RUTA_DB ?? './datos/mykanan.db',
};
