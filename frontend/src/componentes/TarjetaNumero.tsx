import { Link } from 'react-router-dom';
import type { NumeroResumen } from '../tipos';
import { etiquetaCategoria } from '../tipos';
import { tiempoRelativo } from '../utilidades/telefono';
import ChipRiesgo from './ChipRiesgo';

const ICONO_NIVEL: Record<string, { icono: string; caja: string; glow: string }> = {
  alto: {
    icono: 'gpp_bad',
    caja: 'bg-risk-fraud-bg text-risk-fraud',
    glow: 'shadow-[0_0_12px_rgba(226,75,74,0.3)]',
  },
  medio: {
    icono: 'warning',
    caja: 'bg-risk-spam-bg text-risk-spam',
    glow: 'shadow-[0_0_12px_rgba(239,159,39,0.25)]',
  },
  verificado: {
    icono: 'verified_user',
    caja: 'bg-risk-verified-bg text-risk-verified',
    glow: 'shadow-[0_0_12px_rgba(29,158,117,0.25)]',
  },
  bajo: { icono: 'phone', caja: 'bg-surface-container-high text-secondary', glow: '' },
  sin_datos: { icono: 'help_outline', caja: 'bg-risk-nodata-bg text-risk-nodata', glow: '' },
};

const COLOR_CONTEO: Record<string, string> = {
  alto: 'text-risk-fraud',
  medio: 'text-risk-spam',
  verificado: 'text-risk-verified',
  bajo: 'text-secondary',
  sin_datos: 'text-on-surface-variant',
};

export default function TarjetaNumero({ numero }: { numero: NumeroResumen }) {
  const est = ICONO_NIVEL[numero.nivel] ?? ICONO_NIVEL.sin_datos;
  const etiqueta = numero.verificado
    ? (numero.etiqueta_verificacion ?? 'Línea verificada')
    : numero.categoria_dominante
      ? etiquetaCategoria(numero.categoria_dominante)
      : 'Sin reportes';

  return (
    <article className="group bg-surface-container-low/90 hover:bg-surface-container rounded-2xl p-unit-lg shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-md">
        <div className="flex items-start sm:items-center gap-unit-md">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${est.caja} ${est.glow}`}
          >
            <span className="material-symbols-outlined text-headline-md icono-relleno">{est.icono}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-unit-xs flex-wrap mb-unit-2xs">
              <Link
                to={`/numero/${numero.telefono}`}
                className="font-title-lg text-title-lg font-semibold tracking-wide text-on-surface font-mono hover:text-secondary transition-colors"
              >
                {numero.formato}
              </Link>
              <ChipRiesgo
                nivel={numero.nivel}
                texto={etiqueta}
                animado={numero.nivel === 'alto'}
              />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">
              {numero.descripcion ?? 'Sin descripciones de la comunidad todavía.'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-unit-md pt-unit-xs sm:pt-0 border-t sm:border-t-0 border-outline-variant/30 sm:border-none">
          <div className="text-left sm:text-right">
            <p className={`font-title-sm text-title-sm font-semibold ${COLOR_CONTEO[numero.nivel] ?? ''}`}>
              {numero.verificado
                ? 'Validación certificada'
                : `${numero.total_reportes.toLocaleString('es-MX')} reportes`}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center sm:justify-end gap-unit-2xs">
              <span className="material-symbols-outlined text-label-sm">schedule</span>
              {tiempoRelativo(numero.actualizado_en)} • {numero.region}
            </p>
          </div>
          <Link
            to={`/numero/${numero.telefono}`}
            aria-label={`Ver detalles de ${numero.formato}`}
            className="p-unit-xs rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all group-hover:bg-secondary group-hover:text-on-secondary shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-title-lg">chevron_right</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
