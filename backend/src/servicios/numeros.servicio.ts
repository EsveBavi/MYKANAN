import type { Categoria, DetalleNumero, Nivel, NumeroFila, NumeroResumen } from '../modelos/tipos';
import { CATEGORIAS_FRAUDE, CATEGORIAS_SPAM } from '../modelos/tipos';
import { bd } from '../configuracion/baseDatos';
import { formatearTelefono, regionDeTelefono } from '../utilidades/telefono';

const hace7d = new Date(Date.now() - 7 * 86_400_000).toISOString();
const hace30d = new Date(Date.now() - 30 * 86_400_000).toISOString();

function nivelDe(fila: { verificado: number; total: number; reportes7d: number }): Nivel {
  if (fila.verificado) return 'verificado';
  if (fila.reportes7d >= 100 || fila.total >= 1000) return 'alto';
  if (fila.total >= 100) return 'medio';
  if (fila.total > 0) return 'bajo';
  return 'sin_datos';
}

function aResumen(
  fila: NumeroFila & { total_reportes: number; reportes_7d: number; categoria_dominante: Categoria | null },
): NumeroResumen {
  return {
    telefono: fila.telefono,
    formato: formatearTelefono(fila.telefono),
    nivel: nivelDe({ verificado: fila.verificado, total: fila.total_reportes, reportes7d: fila.reportes_7d }),
    categoria_dominante: fila.categoria_dominante,
    descripcion: fila.descripcion,
    total_reportes: fila.total_reportes,
    reportes_7d: fila.reportes_7d,
    verificado: fila.verificado === 1,
    etiqueta_verificacion: fila.etiqueta_verificacion,
    region: regionDeTelefono(fila.telefono),
    actualizado_en: fila.actualizado_en,
  };
}

export function consultarDetalle(telefono: string): DetalleNumero {
  bd.prepare(
    `INSERT INTO numeros (telefono, creado_en, actualizado_en) VALUES (?, ?, ?)
     ON CONFLICT(telefono) DO NOTHING`,
  ).run(telefono, new Date().toISOString(), new Date().toISOString());
  bd.prepare('UPDATE numeros SET busquedas = busquedas + 1 WHERE telefono = ?').run(telefono);

  const fila = bd
    .prepare(
      `SELECT n.*,
        (SELECT COUNT(*) FROM reportes r WHERE r.telefono = n.telefono) AS total_reportes,
        (SELECT COUNT(*) FROM reportes r WHERE r.telefono = n.telefono AND r.creado_en >= ?) AS reportes_7d,
        (SELECT r2.categoria FROM reportes r2 WHERE r2.telefono = n.telefono
           GROUP BY r2.categoria ORDER BY COUNT(*) DESC LIMIT 1) AS categoria_dominante
       FROM numeros n WHERE n.telefono = ?`,
    )
    .get(hace7d, telefono) as NumeroFila & {
    total_reportes: number;
    reportes_7d: number;
    categoria_dominante: Categoria | null;
  };

  const resumen = aResumen(fila);

  const filasCategorias = bd
    .prepare(
      'SELECT categoria, COUNT(*) AS total FROM reportes WHERE telefono = ? GROUP BY categoria ORDER BY total DESC',
    )
    .all(telefono) as { categoria: Categoria; total: number }[];
  const categorias = filasCategorias.map((c) => ({
    ...c,
    porcentaje: resumen.total_reportes > 0 ? (c.total / resumen.total_reportes) * 100 : 0,
  }));

  const conteos = bd
    .prepare(
      `SELECT date(creado_en) AS fecha, COUNT(*) AS total FROM reportes
       WHERE telefono = ? AND creado_en >= ? GROUP BY date(creado_en)`,
    )
    .all(telefono, hace30d) as { fecha: string; total: number }[];
  const porFecha = new Map(conteos.map((c) => [c.fecha, c.total]));
  const actividad_diaria: { fecha: string; total: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const fecha = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    actividad_diaria.push({ fecha, total: porFecha.get(fecha) ?? 0 });
  }

  const testimonios = bd
    .prepare(
      `SELECT id, descripcion, categoria, creado_en FROM reportes
       WHERE telefono = ? AND descripcion IS NOT NULL AND descripcion != ''
       ORDER BY creado_en DESC LIMIT 5`,
    )
    .all(telefono) as DetalleNumero['testimonios'];

  const consenso =
    categorias.length > 0 && resumen.total_reportes > 0
      ? Math.round((categorias[0].total / resumen.total_reportes) * 1000) / 10
      : 0;

  return { ...resumen, busquedas: fila.busquedas + 1, consenso, actividad_diaria, categorias, testimonios };
}

export interface OpcionesListado {
  grupo?: 'fraude' | 'spam' | 'verificado';
  busqueda?: string;
  limite: number;
  pagina: number;
}

export function listar(opciones: OpcionesListado): { total: number; numeros: NumeroResumen[] } {
  const filtros: string[] = [];
  const params: unknown[] = [];

  if (opciones.grupo === 'verificado') {
    filtros.push('n.verificado = 1');
  } else if (opciones.grupo === 'fraude' || opciones.grupo === 'spam') {
    const cats = opciones.grupo === 'fraude' ? CATEGORIAS_FRAUDE : CATEGORIAS_SPAM;
    filtros.push(
      `EXISTS (SELECT 1 FROM reportes r WHERE r.telefono = n.telefono AND r.categoria IN (${cats.map(() => '?').join(',')}))`,
    );
    params.push(...cats);
  }
  if (opciones.busqueda) {
    filtros.push('n.telefono LIKE ?');
    params.push(`%${opciones.busqueda}%`);
  }
  const donde = filtros.length > 0 ? `WHERE ${filtros.join(' AND ')}` : '';

  const filaTotal = bd
    .prepare(`SELECT COUNT(*) AS n FROM numeros n ${donde}`)
    .get(...params) as { n: number };

  const filas = bd
    .prepare(
      `SELECT n.*,
        (SELECT COUNT(*) FROM reportes r WHERE r.telefono = n.telefono) AS total_reportes,
        (SELECT COUNT(*) FROM reportes r WHERE r.telefono = n.telefono AND r.creado_en >= ?) AS reportes_7d,
        (SELECT r2.categoria FROM reportes r2 WHERE r2.telefono = n.telefono
           GROUP BY r2.categoria ORDER BY COUNT(*) DESC LIMIT 1) AS categoria_dominante
       FROM numeros n ${donde}
       ORDER BY total_reportes DESC, n.actualizado_en DESC
       LIMIT ? OFFSET ?`,
    )
    .all(hace7d, ...params, opciones.limite, (opciones.pagina - 1) * opciones.limite) as (NumeroFila & {
    total_reportes: number;
    reportes_7d: number;
    categoria_dominante: Categoria | null;
  })[];

  return { total: filaTotal.n, numeros: filas.map(aResumen) };
}

export function estadisticas() {
  const numerosCatalogados = bd
    .prepare(
      `SELECT COUNT(*) AS n FROM numeros n
       WHERE n.verificado = 1
          OR EXISTS (SELECT 1 FROM reportes r WHERE r.telefono = n.telefono)`,
    )
    .get() as { n: number };
  const totalReportes = bd.prepare('SELECT COUNT(*) AS n FROM reportes').get() as { n: number };
  const hoy = bd
    .prepare(`SELECT COUNT(*) AS n FROM reportes WHERE creado_en >= datetime('now', 'start of day')`)
    .get() as { n: number };
  const ultimaSemana = bd
    .prepare('SELECT COUNT(*) AS n FROM reportes WHERE creado_en >= ?')
    .get(hace7d) as { n: number };

  const conteoPor = (cats: readonly Categoria[]) =>
    (
      bd
        .prepare(
          `SELECT COUNT(*) AS n FROM reportes WHERE categoria IN (${cats.map(() => '?').join(',')})`,
        )
        .get(...cats) as { n: number }
    ).n;

  const verificados = bd.prepare('SELECT COUNT(*) AS n FROM numeros WHERE verificado = 1').get() as {
    n: number;
  };

  return {
    numeros_catalogados: numerosCatalogados.n,
    reportes_totales: totalReportes.n,
    reportes_hoy: hoy.n,
    reportes_7d: ultimaSemana.n,
    distribucion: {
      fraude: conteoPor(CATEGORIAS_FRAUDE),
      spam: conteoPor(CATEGORIAS_SPAM),
      verificado: verificados.n,
    },
  };
}
