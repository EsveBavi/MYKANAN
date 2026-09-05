export const CATEGORIAS = [
  'fraude_bancario',
  'spam_comercial',
  'cobranza_agresiva',
  'phishing_robo',
  'extorsion',
  'llamada_muda',
  'otro',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIAS_FRAUDE: readonly Categoria[] = [
  'fraude_bancario',
  'phishing_robo',
  'extorsion',
];

export const CATEGORIAS_SPAM: readonly Categoria[] = [
  'spam_comercial',
  'cobranza_agresiva',
  'llamada_muda',
];

export type Nivel = 'verificado' | 'alto' | 'medio' | 'bajo' | 'sin_datos';

export interface NumeroFila {
  telefono: string;
  verificado: number;
  etiqueta_verificacion: string | null;
  descripcion: string | null;
  busquedas: number;
  creado_en: string;
  actualizado_en: string;
}

export interface NumeroResumen {
  telefono: string;
  formato: string;
  nivel: Nivel;
  categoria_dominante: Categoria | null;
  descripcion: string | null;
  total_reportes: number;
  reportes_7d: number;
  verificado: boolean;
  etiqueta_verificacion: string | null;
  region: string;
  actualizado_en: string;
}

export interface DetalleNumero extends NumeroResumen {
  busquedas: number;
  consenso: number;
  actividad_diaria: { fecha: string; total: number }[];
  categorias: { categoria: Categoria; total: number; porcentaje: number }[];
  testimonios: { id: number; descripcion: string; categoria: Categoria; creado_en: string }[];
}
