import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../servicios/api';
import type { DetalleNumero, NumeroResumen } from '../tipos';
import { esTelefonoValido } from '../utilidades/telefono';

export default function AlertaLlamada() {
  const [params] = useSearchParams();
  const telefonoParam = params.get('telefono') ?? '';
  const [detalle, setDetalle] = useState<DetalleNumero | null>(null);
  const [sugerencias, setSugerencias] = useState<NumeroResumen[]>([]);
  const [cargando, setCargando] = useState(esTelefonoValido(telefonoParam));

  useEffect(() => {
    if (esTelefonoValido(telefonoParam)) {
      setCargando(true);
      api
        .obtenerNumero(telefonoParam)
        .then(setDetalle)
        .catch(() => setDetalle(null))
        .finally(() => setCargando(false));
    } else {
      api
        .listarNumeros({ grupo: 'fraude', limite: 4 })
        .then((r) => setSugerencias(r.numeros))
        .catch(() => undefined);
      setCargando(false);
    }
  }, [telefonoParam]);

  const enPeligro = detalle && detalle.nivel === 'alto';

  return (
    <div className="min-h-screen bg-primary-container flex flex-col items-center justify-between p-unit-lg relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(226,75,74,0.25),transparent_60%)]" />

      <div className="h-8 w-full" />

      {cargando ? (
        <div className="flex items-center gap-unit-sm text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Verificando número entrante…
        </div>
      ) : !detalle ? (
        <div className="relative z-10 flex flex-col items-center text-center gap-unit-lg max-w-md w-full animar-aparecer">
          <div className="flex items-center gap-2 bg-surface-container-high/60 px-4 py-2 rounded-full border border-outline-variant/40">
            <span className="material-symbols-outlined text-secondary text-title-md">phone_in_talk</span>
            <span className="font-title-sm text-title-sm text-on-surface">Simulador de Alerta de Llamada</span>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Selecciona un número reportado para probar la pantalla de alerta en tiempo real:
          </p>
          <div className="flex flex-col gap-unit-xs w-full">
            {sugerencias.map((s) => (
              <Link
                key={s.telefono}
                to={`/alerta?telefono=${s.telefono}`}
                className="flex items-center justify-between p-unit-md rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors"
              >
                <span className="font-mono text-code-mono text-on-surface font-bold">{s.formato}</span>
                <span className="font-label-sm text-label-sm text-risk-fraud">
                  {s.total_reportes.toLocaleString('es-MX')} reportes
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center gap-unit-xl w-full max-w-md animar-aparecer">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border animate-pulse ${
              enPeligro ? 'bg-error/15 border-error/30' : 'bg-surface-container-high border-outline-variant/40'
            }`}
          >
            <span
              className={`material-symbols-outlined text-title-md icono-relleno ${enPeligro ? 'text-error' : 'text-risk-verified'}`}
            >
              {enPeligro ? 'warning' : 'verified_user'}
            </span>
            <span
              className={`font-title-md text-title-md font-semibold uppercase tracking-wider ${enPeligro ? 'text-error' : 'text-risk-verified'}`}
            >
              {enPeligro ? 'Llamada Sospechosa' : 'Llamada Verificada'}
            </span>
          </div>

          <div className="text-center flex flex-col gap-4">
            <h1 className="font-display-hero text-display-hero text-white font-bold tracking-tight font-mono">
              {detalle.formato}
            </h1>
            <p
              className={`font-headline-lg-mobile text-headline-lg-mobile font-medium ${enPeligro ? 'text-error' : 'text-risk-verified'}`}
            >
              {detalle.descripcion ?? 'Sin clasificación de riesgo'}
            </p>
            <div className="inline-block bg-surface-container/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-surface-variant/50 mx-auto">
              <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center justify-center gap-2">
                <span className={`material-symbols-outlined icono-relleno ${enPeligro ? 'text-error' : 'text-risk-verified'}`}>
                  report
                </span>
                Reportado <strong>{detalle.total_reportes.toLocaleString('es-MX')}</strong> veces por la
                comunidad
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <button
              onClick={() => alert(`Número ${detalle.formato} bloqueado en tu dispositivo (demo).`)}
              className="flex-1 bg-risk-fraud text-white font-title-md text-title-md py-4 rounded-xl flex justify-center items-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-risk-fraud/20 active:scale-95"
            >
              <span className="material-symbols-outlined icono-relleno">block</span>
              Bloquear
            </button>
            <Link
              to={`/numero/${detalle.telefono}`}
              className="flex-1 bg-transparent border-2 border-primary-fixed/30 text-primary-fixed font-title-md text-title-md py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-primary-fixed/10 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">visibility</span>
              Ver ficha
            </Link>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-on-surface-variant/60 pb-8 mt-8">
        <span className="material-symbols-outlined text-label-sm">lock</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">
          MyKanan funciona sin acceso a tus contactos
        </span>
      </div>
    </div>
  );
}
