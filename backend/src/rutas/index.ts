import { Router } from 'express';
import { crearSolicitudArco } from '../controladores/arco.controlador';
import { listarNumeros, obtenerEstadisticas, obtenerNumero } from '../controladores/numeros.controlador';
import { crearReporte } from '../controladores/reportes.controlador';
import { limiteArco, limiteLectura, limiteReporte } from '../middleware/tasa';

export const rutas = Router();

rutas.get('/salud', (_req, resp) => {
  resp.json({ estado: 'ok', servicio: 'mykanan-api' });
});

rutas.get('/numeros', limiteLectura, listarNumeros);
rutas.get('/numeros/:telefono', limiteLectura, obtenerNumero);
rutas.post('/reportes', limiteReporte, crearReporte);
rutas.get('/estadisticas', limiteLectura, obtenerEstadisticas);
rutas.post('/arco', limiteArco, crearSolicitudArco);
