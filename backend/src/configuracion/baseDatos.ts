import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { entorno } from './entorno';

mkdirSync(dirname(resolve(entorno.rutaDb)), { recursive: true });

export const bd = new Database(entorno.rutaDb);
bd.pragma('journal_mode = WAL');
bd.pragma('foreign_keys = ON');

bd.exec(`
CREATE TABLE IF NOT EXISTS numeros (
  telefono TEXT PRIMARY KEY,
  verificado INTEGER NOT NULL DEFAULT 0,
  etiqueta_verificacion TEXT,
  descripcion TEXT,
  busquedas INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telefono TEXT NOT NULL REFERENCES numeros(telefono) ON DELETE CASCADE,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  creado_en TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reportes_telefono ON reportes(telefono, creado_en);
CREATE INDEX IF NOT EXISTS idx_reportes_categoria ON reportes(telefono, categoria);

CREATE TABLE IF NOT EXISTS solicitudes_arco (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telefono TEXT NOT NULL,
  tipo TEXT NOT NULL,
  motivo TEXT,
  folio TEXT NOT NULL UNIQUE,
  creado_en TEXT NOT NULL
);
`);

interface Semilla {
  telefono: string;
  descripcion?: string;
  verificado?: number;
  etiqueta?: string;
  total?: number;
  distribucion?: [string, number][];
  dias?: number;
  recientes7d?: number;
}

const SEMILLAS: Semilla[] = [
  {
    telefono: '5512345678',
    descripcion: 'Posible fraude bancario y suplantación de identidad institucional',
    total: 1500,
    recientes7d: 312,
    dias: 30,
    distribucion: [
      ['extorsion', 0.481],
      ['fraude_bancario', 0.359],
      ['llamada_muda', 0.16],
    ],
  },
  {
    telefono: '8198765432',
    descripcion: 'Llamadas automatizadas de cobranza a deshoras buscando a terceros',
    total: 638,
    dias: 45,
    distribucion: [
      ['cobranza_agresiva', 0.7],
      ['spam_comercial', 0.2],
      ['llamada_muda', 0.1],
    ],
  },
  { telefono: '3344556677', verificado: 1, etiqueta: 'Línea Oficial Santander' },
  {
    telefono: '5511223344',
    descripcion: 'SMiShing con URLs apócrifas simulando entrega de paquetería',
    total: 2110,
    dias: 45,
    distribucion: [
      ['phishing_robo', 0.6],
      ['extorsion', 0.3],
      ['otro', 0.1],
    ],
  },
  {
    telefono: '5527189034',
    descripcion: 'Suplantación de soporte bancario solicitando token móvil',
    total: 214,
    dias: 30,
    distribucion: [
      ['fraude_bancario', 0.85],
      ['otro', 0.15],
    ],
  },
  {
    telefono: '6641239876',
    descripcion: 'Llamadas mudas recurrentes para verificar líneas activas',
    total: 88,
    dias: 30,
    distribucion: [['llamada_muda', 1]],
  },
  {
    telefono: '3312004455',
    descripcion: 'Ofertas comerciales insistentes de planes telefónicos',
    total: 54,
    dias: 30,
    distribucion: [['spam_comercial', 1]],
  },
];

function mulberry32(semilla: number) {
  return () => {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FRASES = [
  'Dicen ser de soporte del banco y piden el token digital para "cancelar" una compra.',
  'Amenazan con cargos no reconocidos y simulan un conmutador bancario. Muy agresivos.',
  'Marcaron más de 6 veces en 20 minutos; si contestas, ponen música y cuelgan.',
  'Ofrecen un premio de un sorteo que nunca participé y piden datos para "liberar" el depósito.',
  'Se hacen pasar por mensajería con un paquete retenido y solicitan una transferencia.',
  'Grabación automática de cobranza aunque la deuda no es mía, a todas horas.',
];

function poblar(): void {
  const total = (bd.prepare('SELECT COUNT(*) AS n FROM numeros').get() as { n: number }).n;
  if (total > 0) return;

  const azar = mulberry32(20260903);
  const ahora = Date.now();
  const insertarNumero = bd.prepare(
    `INSERT INTO numeros (telefono, verificado, etiqueta_verificacion, descripcion, creado_en, actualizado_en)
     VALUES (@telefono, @verificado, @etiqueta, @descripcion, @creado_en, @actualizado_en)`,
  );
  const insertarReporte = bd.prepare(
    'INSERT INTO reportes (telefono, categoria, descripcion, creado_en) VALUES (?, ?, ?, ?)',
  );

  const transaccion = bd.transaction(() => {
    for (const s of SEMILLAS) {
      const creado = new Date(ahora - (s.dias ?? 30) * 86_400_000).toISOString();
      insertarNumero.run({
        telefono: s.telefono,
        verificado: s.verificado ?? 0,
        etiqueta: s.etiqueta ?? null,
        descripcion: s.descripcion ?? null,
        creado_en: creado,
        actualizado_en: creado,
      });
      if (!s.total) continue;

      const dist = s.distribucion ?? [['otro', 1]];
      const fraccion7d = s.recientes7d ? s.recientes7d / s.total : 0;
      for (let i = 0; i < s.total; i++) {
        const r = azar();
        let diasAtras: number;
        if (r < fraccion7d) {
          diasAtras = azar() * 7;
        } else {
          diasAtras = 7 + azar() * ((s.dias ?? 30) - 7);
        }
        const ms = diasAtras * 86_400_000 + azar() * 13 * 3_600_000 + 8 * 3_600_000;
        let acumulado = 0;
        const dado = azar();
        let categoria = dist[dist.length - 1][0];
        for (const [cat, peso] of dist) {
          acumulado += peso;
          if (dado <= acumulado) {
            categoria = cat;
            break;
          }
        }
        const descripcion = azar() < 0.03 ? FRASES[Math.floor(azar() * FRASES.length)] : null;
        insertarReporte.run(s.telefono, categoria, descripcion, new Date(ahora - ms).toISOString());
      }
    }
  });
  transaccion();
}

poblar();
