export type CategoriaRiesgo =
  | 'fraude_bancario'
  | 'spam_comercial'
  | 'cobranza_agresiva'
  | 'phishing_robo'
  | 'extorsion'
  | 'llamada_muda'
  | 'otro';

export type NivelRiesgo = 'verificado' | 'alto' | 'medio' | 'bajo' | 'sin_datos';

export interface EtiquetaCategoria {
  valor: CategoriaRiesgo;
  etiqueta: string;
  icono: string;
}

export const CATEGORIAS: EtiquetaCategoria[] = [
  { valor: 'fraude_bancario', etiqueta: 'Fraude bancario', icono: 'account_balance' },
  { valor: 'spam_comercial', etiqueta: 'Spam comercial', icono: 'campaign' },
  { valor: 'cobranza_agresiva', etiqueta: 'Cobranza agresiva', icono: 'warning' },
  { valor: 'phishing_robo', etiqueta: 'Phishing / Robo', icono: 'fingerprint' },
  { valor: 'extorsion', etiqueta: 'Extorsión', icono: 'sms_failed' },
  { valor: 'llamada_muda', etiqueta: 'Llamada muda', icono: 'mic_off' },
  { valor: 'otro', etiqueta: 'Otro motivo', icono: 'more_horiz' },
];

export function etiquetaCategoria(c: CategoriaRiesgo): string {
  return CATEGORIAS.find((x) => x.valor === c)?.etiqueta ?? 'Otro';
}

export interface NumeroResumen {
  telefono: string;
  formato: string;
  nivel: NivelRiesgo;
  categoria_dominante: CategoriaRiesgo | null;
  descripcion: string | null;
  total_reportes: number;
  reportes_7d: number;
  verificado: boolean;
  etiqueta_verificacion: string | null;
  region: string;
  actualizado_en: string;
}

export interface ActividadDia {
  fecha: string;
  total: number;
}

export interface CategoriaDesglose {
  categoria: CategoriaRiesgo;
  total: number;
  porcentaje: number;
}

export interface Testimonio {
  id: number;
  descripcion: string;
  categoria: CategoriaRiesgo;
  creado_en: string;
}

export interface DetalleNumero extends NumeroResumen {
  busquedas: number;
  consenso: number;
  actividad_diaria: ActividadDia[];
  categorias: CategoriaDesglose[];
  testimonios: Testimonio[];
}

export interface EstadisticasGlobales {
  numeros_catalogados: number;
  reportes_totales: number;
  reportes_hoy: number;
  reportes_7d: number;
  distribucion: { fraude: number; spam: number; verificado: number };
}

export interface ReportePayload {
  telefono: string;
  categoria: CategoriaRiesgo;
  descripcion?: string;
}

export interface ReporteRespuesta {
  ok: true;
  id: number;
  folio: string;
}

export type TipoSolicitudArco = 'eliminar' | 'rectificar' | 'descargar';

export interface SolicitudArcoPayload {
  telefono: string;
  tipo: TipoSolicitudArco;
  motivo?: string;
}
