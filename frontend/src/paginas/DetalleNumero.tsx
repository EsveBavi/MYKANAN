import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChipRiesgo from '../componentes/ChipRiesgo';
import GraficoActividad from '../componentes/GraficoActividad';
import { api } from '../servicios/api';
import { CATEGORIAS, etiquetaCategoria, type CategoriaDesglose, type DetalleNumero } from '../tipos';
import { esTelefonoValido, formatearTelefono, tiempoRelativo } from '../utilidades/telefono';

const COLOR_CATEGORIA: Record<string, string> = {
  fraude_bancario: 'bg-risk-fraud',
  extorsion: 'bg-risk-fraud',
  phishing_robo: 'bg-risk-fraud',
  cobranza_agresiva: 'bg-risk-spam',
  spam_comercial: 'bg-risk-spam',
  llamada_muda: 'bg-secondary',
  otro: 'bg-outline',
};

const FONDO_CATEGORIA: Record<string, string> = {
  fraude_bancario: 'bg-risk-fraud-bg text-risk-fraud',
  extorsion: 'bg-risk-fraud-bg text-risk-fraud',
  phishing_robo: 'bg-risk-fraud-bg text-risk-fraud',
  cobranza_agresiva: 'bg-risk-spam-bg text-risk-spam',
  spam_comercial: 'bg-risk-spam-bg text-risk-spam',
  llamada_muda: 'bg-secondary-container/40 text-secondary',
  otro: 'bg-surface-container-high text-on-surface-variant',
};

export default function DetalleNumero() {
  const { telefono = '' } = useParams();
  const [detalle, setDetalle] = useState<DetalleNumero | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [modalTitular, setModalTitular] = useState(false);

  useEffect(() => {
    if (!esTelefonoValido(telefono)) {
      setError('Número inválido: debe tener 10 dígitos.');
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    api
      .obtenerNumero(telefono)
      .then(setDetalle)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [telefono]);

  const copiar = () => {
    navigator.clipboard?.writeText(formatearTelefono(telefono));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };

  if (cargando) {
    return (
      <div className="max-w-max-width-content mx-auto px-margin-desktop py-unit-3xl flex items-center justify-center gap-unit-sm text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Consultando telemetría del número…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-max-width-content mx-auto px-margin-desktop py-unit-3xl flex flex-col items-center gap-unit-md text-center">
        <span className="material-symbols-outlined text-headline-md text-error">error</span>
        <p className="font-title-lg text-title-lg text-on-surface">{error}</p>
        <Link
          to="/"
          className="px-unit-lg py-unit-xs rounded-lg bg-secondary text-on-secondary-fixed font-title-sm text-title-sm"
        >
          Volver a la búsqueda
        </Link>
      </div>
    );
  }

  if (!detalle) return null;

  const nivel = detalle.nivel;
  const subtitulo = detalle.verificado
    ? (detalle.etiqueta_verificacion ?? 'Línea verificada oficialmente')
    : detalle.descripcion
      ? detalle.descripcion
      : detalle.categoria_dominante
        ? `Reportado por: ${etiquetaCategoria(detalle.categoria_dominante)}`
        : 'Sin reportes de la comunidad hasta el momento';

  const desglose: CategoriaDesglose[] = detalle.categorias;

  return (
    <div className="w-full max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg py-unit-xl flex flex-col gap-unit-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-unit-md">
        <nav className="flex items-center gap-unit-xs font-body-md text-body-md flex-wrap">
          <Link
            to="/"
            className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-unit-2xs"
          >
            <span className="material-symbols-outlined text-title-sm">home</span>
            <span>Inicio</span>
          </Link>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant">Consulta</span>
          <span className="text-outline">/</span>
          <span className="text-secondary font-mono text-code-mono font-bold tracking-wider bg-surface-container px-unit-xs py-unit-2xs rounded">
            {detalle.formato}
          </span>
        </nav>
        <div className="flex items-center gap-unit-sm">
          <div className="flex items-center gap-unit-xs px-unit-sm py-unit-2xs bg-surface-container rounded-full text-on-surface-variant font-label-caps text-label-caps">
            <span className={`w-2 h-2 rounded-full ${nivel === 'sin_datos' ? 'bg-risk-nodata' : 'bg-risk-fraud animate-ping'}`} />
            <span>Actualizado {tiempoRelativo(detalle.actualizado_en)}</span>
          </div>
          <button
            onClick={copiar}
            className="flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all text-label-sm font-label-sm"
          >
            <span className="material-symbols-outlined text-title-sm text-risk-verified">
              {copiado ? 'done' : 'content_copy'}
            </span>
            <span>{copiado ? '¡Copiado!' : 'Copiar datos'}</span>
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-xl bg-surface-container-dark p-unit-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div
          className={`absolute -right-16 -bottom-16 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            nivel === 'alto' ? 'bg-risk-fraud/10' : nivel === 'verificado' ? 'bg-risk-verified/10' : 'bg-primary-container/60'
          }`}
        />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-primary-container/60 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-unit-xl">
          <div className="flex flex-col gap-unit-sm max-w-3xl">
            <div className="flex flex-wrap items-center gap-unit-sm">
              <ChipRiesgo nivel={nivel} animado={nivel === 'alto'} />
              {detalle.consenso > 0 && (
                <div className="inline-flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-full bg-surface-container text-tertiary-fixed-dim font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-title-sm">shield_with_heart</span>
                  <span>Consenso Comunitario {detalle.consenso}%</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface flex flex-wrap items-center gap-unit-sm font-mono">
                {detalle.formato}
                <span className="text-risk-fraud text-title-lg font-title-lg px-unit-xs py-unit-2xs rounded bg-risk-fraud-bg font-normal">
                  MEX • {detalle.region}
                </span>
              </h1>
              <p
                className={`font-title-lg text-title-lg font-medium flex items-start gap-unit-xs mt-unit-2xs ${
                  nivel === 'verificado' ? 'text-risk-verified' : nivel === 'sin_datos' ? 'text-on-surface' : 'text-error'
                }`}
              >
                <span className="material-symbols-outlined text-title-lg mt-0.5">
                  {nivel === 'verificado' ? 'verified_user' : nivel === 'sin_datos' ? 'help_outline' : 'report'}
                </span>
                {subtitulo}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-y-unit-2xs gap-x-unit-md text-on-surface-variant font-body-md text-body-md pt-unit-xs">
              <span className="flex items-center gap-unit-2xs text-on-surface font-semibold">
                <span className="material-symbols-outlined text-secondary text-title-sm">campaign</span>
                {detalle.reportes_7d.toLocaleString('es-MX')} reportes en los últimos 7 días
              </span>
              <span className="text-outline">•</span>
              <span className="flex items-center gap-unit-2xs">
                <span className="material-symbols-outlined text-title-sm">visibility</span>
                {detalle.busquedas.toLocaleString('es-MX')} búsquedas registradas
              </span>
              <span className="text-outline">•</span>
              <span className="flex items-center gap-unit-2xs">
                <span className="material-symbols-outlined text-title-sm">functions</span>
                {detalle.total_reportes.toLocaleString('es-MX')} reportes totales
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row xl:flex-col gap-unit-sm shrink-0 min-w-[260px]">
            <Link
              to={`/reportar?telefono=${detalle.telefono}`}
              className="w-full inline-flex items-center justify-center gap-unit-xs px-unit-lg py-unit-sm rounded-lg bg-secondary text-on-secondary-fixed font-title-sm text-title-sm font-bold shadow-[0_0_20px_rgba(172,200,247,0.35)] hover:brightness-110 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-title-sm">add_alert</span>
              <span>Reportar este número</span>
            </Link>
            <button
              onClick={() => setModalTitular(true)}
              className="w-full inline-flex items-center justify-center gap-unit-xs px-unit-lg py-unit-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright font-title-sm text-title-sm transition-all"
            >
              <span className="material-symbols-outlined text-title-sm text-on-surface-variant">verified</span>
              <span>Soy el titular legítimo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-lg items-start">
        <div className="lg:col-span-7 flex flex-col gap-unit-lg">
          <div className="rounded-xl bg-surface-container p-unit-lg shadow-xl flex flex-col gap-unit-md">
            <div className="flex items-center justify-between pb-unit-xs">
              <div>
                <span className="font-label-caps text-label-caps text-secondary tracking-wider block">
                  TELEMETRÍA CRONOLÓGICA
                </span>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                  Frecuencia de Reportes (Últimos 30 Días)
                </h2>
              </div>
            </div>
            <GraficoActividad datos={detalle.actividad_diaria} />
          </div>

          {desglose.length > 0 && (
            <div className="rounded-xl bg-surface-container p-unit-lg shadow-xl flex flex-col gap-unit-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary tracking-wider block">
                    ANÁLISIS DE MODUS OPERANDI
                  </span>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    Desglose de Motivos Reportados
                  </h2>
                </div>
                <span className="font-label-caps text-label-caps bg-surface-container-high px-unit-sm py-unit-2xs rounded text-on-surface-variant">
                  Total: {detalle.total_reportes.toLocaleString('es-MX')} incidentes
                </span>
              </div>
              <div className="flex flex-col gap-unit-sm">
                {desglose.map((c) => {
                  const meta = CATEGORIAS.find((x) => x.valor === c.categoria);
                  return (
                    <div key={c.categoria} className="bg-surface-container-low p-unit-md rounded-lg flex flex-col gap-unit-xs">
                      <div className="flex justify-between items-center gap-unit-sm">
                        <div className="flex items-center gap-unit-xs min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${FONDO_CATEGORIA[c.categoria] ?? FONDO_CATEGORIA.otro}`}
                          >
                            <span className="material-symbols-outlined text-title-sm">{meta?.icono ?? 'more_horiz'}</span>
                          </div>
                          <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                            {meta?.etiqueta ?? etiquetaCategoria(c.categoria)}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-title-sm text-title-sm font-bold text-on-surface">
                            {c.total.toLocaleString('es-MX')} reportes
                          </span>
                          <span className="block font-label-caps text-label-caps text-on-surface-variant">
                            {c.porcentaje.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${COLOR_CATEGORIA[c.categoria] ?? 'bg-outline'}`}
                          style={{ width: `${c.porcentaje}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-surface-container-low p-unit-lg flex flex-col md:flex-row items-center justify-between gap-unit-md">
            <div className="flex items-center gap-unit-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-headline-md">cell_tower</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-outline">DATOS DE RED Y ORIGEN</span>
                <h4 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Región estimada: {detalle.region}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Clasificación basada en la lada de la línea (Ladas MX).
                </p>
              </div>
            </div>
            <span className="px-unit-sm py-unit-2xs rounded bg-surface-container-high font-mono text-code-mono text-on-surface">
              +52 {detalle.telefono.slice(0, 2)}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-unit-lg">
          <div className="rounded-xl bg-surface-deck-white text-surface-container-dark p-unit-lg shadow-[0_12px_32px_-4px_rgba(18,11,31,0.28)] flex flex-col gap-unit-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-2xs">
                <span className="material-symbols-outlined text-inverse-primary text-title-lg">forum</span>
                <h2 className="font-title-lg text-title-lg font-bold tracking-tight text-surface-container-dark">
                  Notas de la Comunidad
                </h2>
              </div>
              <span className="font-label-caps text-label-caps bg-surface-deck-muted px-unit-xs py-unit-2xs rounded text-outline-variant font-bold">
                ANÓNIMO Y MODERADO
              </span>
            </div>
            <p className="font-body-md text-body-md text-outline-variant">
              Declaraciones de ciudadanos que han interactuado directamente con esta numeración:
            </p>
            <div className="flex flex-col gap-unit-sm">
              {detalle.testimonios.length === 0 && (
                <p className="font-body-md text-body-md text-outline-variant italic">
                  Aún no hay testimonios para este número.
                </p>
              )}
              {detalle.testimonios.map((t) => (
                <div
                  key={t.id}
                  className="p-unit-sm rounded-lg bg-surface-deck-muted/70 flex flex-col gap-unit-2xs transition-colors hover:bg-surface-deck-muted"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm font-bold text-surface-container-dark flex items-center gap-unit-2xs">
                      <span className="w-2 h-2 rounded-full bg-risk-fraud" />
                      Usuario anónimo
                    </span>
                    <span className="font-mono text-code-mono text-outline">{tiempoRelativo(t.creado_en)}</span>
                  </div>
                  <p className="font-body-md text-body-md text-surface-container font-medium italic">
                    “{t.descripcion}”
                  </p>
                  <div className="pt-unit-2xs text-outline-variant font-label-caps text-label-caps">
                    {etiquetaCategoria(t.categoria)}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to={`/reportar?telefono=${detalle.telefono}`}
              className="mt-unit-xs w-full py-unit-xs px-unit-sm text-center rounded-lg bg-surface-container-dark text-on-surface font-title-sm text-title-sm hover:bg-surface-container-elevated transition-colors flex items-center justify-center gap-unit-xs"
            >
              <span className="material-symbols-outlined text-title-sm">add_comment</span>
              <span>Añadir mi experiencia con este número</span>
            </Link>
          </div>

          <div className="rounded-xl bg-surface-container-high p-unit-lg flex flex-col gap-unit-md shadow-lg">
            <div className="flex items-center gap-unit-xs text-on-surface">
              <span className="material-symbols-outlined text-tertiary text-title-lg">health_and_safety</span>
              <h3 className="font-title-sm text-title-sm font-bold">Recomendaciones de Seguridad Inmediata</h3>
            </div>
            <ul className="flex flex-col gap-unit-sm font-body-md text-body-md text-on-surface-variant">
              {nivel === 'verificado' ? (
                <li className="flex items-start gap-unit-xs">
                  <span className="material-symbols-outlined text-risk-verified text-title-sm mt-0.5">check_circle</span>
                  <span>
                    <strong>Línea verificada:</strong> esta numeración cuenta con validación oficial. Aun
                    así, desconfía si te solicitan tokens, NIPs o pagos.
                  </span>
                </li>
              ) : (
                <>
                  <li className="flex items-start gap-unit-xs">
                    <span className="material-symbols-outlined text-risk-fraud text-title-sm mt-0.5">block</span>
                    <span>
                      <strong>Bloquear llamadas entrantes:</strong> añade este número de inmediato a la
                      lista negra en los ajustes de tu teléfono.
                    </span>
                  </li>
                  <li className="flex items-start gap-unit-xs">
                    <span className="material-symbols-outlined text-tertiary text-title-sm mt-0.5">password</span>
                    <span>
                      <strong>Nunca compartas tokens ni NIPs:</strong> ninguna entidad financiera legítima
                      solicita claves dinámicas por llamada telefónica.
                    </span>
                  </li>
                  <li className="flex items-start gap-unit-xs">
                    <span className="material-symbols-outlined text-secondary text-title-sm mt-0.5">verified_user</span>
                    <span>
                      <strong>Comunícate por canales oficiales:</strong> si tienes dudas, cuelga y marca al
                      reverso de tu tarjeta bancaria.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-risk-verified-bg/60 p-unit-md flex items-start gap-unit-sm">
            <div className="w-10 h-10 rounded-lg bg-risk-verified/20 flex items-center justify-center text-risk-verified shrink-0">
              <span className="material-symbols-outlined text-title-lg">lock</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-sm text-title-sm text-risk-verified font-bold">Privacidad Blindada MyKanan</h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs mt-unit-2xs">
                Esta consulta no expone tu número ni tus contactos. MyKanan no registra tu IP ni tu
                ubicación, y tu libreta telefónica nunca es leída.
              </p>
            </div>
          </div>
        </div>
      </div>

      {modalTitular && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-unit-md">
          <div className="w-full max-w-xl rounded-xl bg-surface-container-elevated p-unit-xl flex flex-col gap-unit-md shadow-2xl relative animar-aparecer">
            <button
              onClick={() => setModalTitular(false)}
              className="absolute top-unit-md right-unit-md w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-title-sm">close</span>
            </button>
            <div className="flex items-center gap-unit-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-title-lg">verified</span>
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Acreditación de Titularidad</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Reclamar el número {detalle.formato}
                </p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Si eres el propietario legítimo de este número o representas a una institución afectada
              por suplantación de identidad (spoofing), puedes iniciar el proceso de verificación
              mediante prueba OTP o constancia de operador.
            </p>
            <div className="flex flex-col gap-unit-xs">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="correo-titular">
                Correo corporativo o personal del titular
              </label>
              <input
                id="correo-titular"
                type="email"
                placeholder="ejemplo@correo.com.mx"
                className="w-full px-unit-md py-unit-xs rounded-lg bg-surface-container-dark text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex items-center justify-end gap-unit-sm pt-unit-xs">
              <button
                onClick={() => setModalTitular(false)}
                className="px-unit-md py-unit-xs rounded-lg bg-surface-container text-on-surface font-title-sm text-title-sm hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setModalTitular(false);
                  alert('Solicitud registrada. En el MVP la verificación OTP se activará próximamente.');
                }}
                className="px-unit-md py-unit-xs rounded-lg bg-secondary text-on-secondary-fixed font-title-sm text-title-sm font-bold shadow-md hover:brightness-110"
              >
                Solicitar Verificación OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
