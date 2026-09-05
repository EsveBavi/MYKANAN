import type {
  DetalleNumero,
  EstadisticasGlobales,
  NumeroResumen,
  ReportePayload,
  ReporteRespuesta,
  SolicitudArcoPayload,
} from '../tipos';

const BASE = '/api';

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!resp.ok) {
    const cuerpo = (await resp.json().catch(() => null)) as { error?: string } | null;
    throw new Error(cuerpo?.error ?? `Error ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export interface FiltrosListado {
  grupo?: string;
  busqueda?: string;
  limite?: number;
  pagina?: number;
}

export const api = {
  obtenerNumero: (telefono: string) => pedir<DetalleNumero>(`/numeros/${telefono}`),

  listarNumeros: (filtros: FiltrosListado = {}) => {
    const q = new URLSearchParams();
    if (filtros.grupo) q.set('grupo', filtros.grupo);
    if (filtros.busqueda) q.set('busqueda', filtros.busqueda);
    if (filtros.limite) q.set('limite', String(filtros.limite));
    if (filtros.pagina) q.set('pagina', String(filtros.pagina));
    const s = q.toString();
    return pedir<{ total: number; numeros: NumeroResumen[] }>(`/numeros${s ? `?${s}` : ''}`);
  },

  crearReporte: (payload: ReportePayload) =>
    pedir<ReporteRespuesta>('/reportes', { method: 'POST', body: JSON.stringify(payload) }),

  obtenerEstadisticas: () => pedir<EstadisticasGlobales>('/estadisticas'),

  enviarSolicitudArco: (payload: SolicitudArcoPayload) =>
    pedir<{ ok: true; folio: string }>('/arco', { method: 'POST', body: JSON.stringify(payload) }),
};
