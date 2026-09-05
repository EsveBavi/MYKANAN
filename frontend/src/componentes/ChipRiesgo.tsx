import type { NivelRiesgo } from '../tipos';

const ESTILOS: Record<NivelRiesgo, { caja: string; punto: string; icono: string }> = {
  verificado: {
    caja: 'bg-risk-verified-bg text-risk-verified',
    punto: 'bg-risk-verified',
    icono: 'verified_user',
  },
  alto: { caja: 'bg-risk-fraud-bg text-risk-fraud', punto: 'bg-risk-fraud', icono: 'gpp_bad' },
  medio: { caja: 'bg-risk-spam-bg text-risk-spam', punto: 'bg-risk-spam', icono: 'warning' },
  bajo: {
    caja: 'bg-surface-container-high text-on-surface-variant',
    punto: 'bg-secondary',
    icono: 'info',
  },
  sin_datos: {
    caja: 'bg-risk-nodata-bg text-risk-nodata',
    punto: 'bg-risk-nodata',
    icono: 'help_outline',
  },
};

const TEXTO_NIVEL: Record<NivelRiesgo, string> = {
  verificado: 'Verificado',
  alto: 'Riesgo alto',
  medio: 'Riesgo medio',
  bajo: 'Riesgo bajo',
  sin_datos: 'Sin datos',
};

export default function ChipRiesgo({
  nivel,
  texto,
  animado = false,
}: {
  nivel: NivelRiesgo;
  texto?: string;
  animado?: boolean;
}) {
  const e = ESTILOS[nivel];
  return (
    <span
      className={`inline-flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-full font-label-caps text-label-caps ${e.caja}`}
    >
      <span className={`w-2 h-2 rounded-full ${e.punto} ${animado ? 'animate-ping' : ''}`} />
      <span className="material-symbols-outlined text-title-sm">{e.icono}</span>
      <span className="tracking-widest uppercase">{texto ?? TEXTO_NIVEL[nivel]}</span>
    </span>
  );
}
