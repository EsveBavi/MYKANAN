import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuscadorTelefono from '../componentes/BuscadorTelefono';
import TarjetaNumero from '../componentes/TarjetaNumero';
import { api } from '../servicios/api';
import type { EstadisticasGlobales, NumeroResumen } from '../tipos';

type Filtro = 'todos' | 'fraude' | 'spam' | 'verificado';

const FILTROS: { valor: Filtro; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'fraude', texto: 'Fraude' },
  { valor: 'spam', texto: 'Spam / Cobranza' },
  { valor: 'verificado', texto: 'Verificados' },
];

export default function Inicio() {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [numeros, setNumeros] = useState<NumeroResumen[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<EstadisticasGlobales | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .obtenerEstadisticas()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    api
      .listarNumeros({ grupo: filtro === 'todos' ? undefined : filtro, limite: 8 })
      .then((r) => {
        setNumeros(r.numeros);
        setTotal(r.total);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [filtro]);

  const dist = stats?.distribucion;
  const distTotal = dist ? dist.fraude + dist.spam + dist.verificado : 0;
  const pct = (v: number) => (distTotal > 0 ? Math.round((v / distTotal) * 100) : 0);

  return (
    <div className="w-full max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg py-unit-2xl relative overflow-hidden">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-64 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <section className="flex flex-col items-center text-center max-w-4xl mx-auto mb-unit-3xl">
        <div className="inline-flex items-center gap-unit-xs px-unit-md py-unit-2xs rounded-full bg-surface-container-high/70 backdrop-blur-md shadow-sm mb-unit-lg">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(0,218,245,0.8)]" />
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
            Vigilancia Activa Telecom MX • Red en Tiempo Real
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg md:font-display-hero md:text-display-hero text-on-surface font-light tracking-tight max-w-3xl mb-unit-sm">
          Consulta y reporta <span className="font-semibold text-secondary">números desconocidos</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-unit-xl">
          Identificador telefónico inteligente y prevención de fraude bancario en México sin
          comprometer tu libreta de contactos personales.
        </p>
        <div className="w-full max-w-3xl">
          <BuscadorTelefono />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-unit-md sm:gap-unit-lg text-on-surface-variant mt-unit-xl">
          <div className="flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-lg bg-surface-container-low/60 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-title-sm">phonelink_lock</span>
            <span className="font-body-md text-body-md">100% Sin acceso a tus contactos</span>
          </div>
          <div className="flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-lg bg-surface-container-low/60 shadow-sm">
            <span className="material-symbols-outlined text-risk-verified text-title-sm">verified</span>
            <span className="font-body-md text-body-md">Validado por comunidad</span>
          </div>
          <div className="flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-lg bg-surface-container-low/60 shadow-sm">
            <span className="material-symbols-outlined text-tertiary text-title-sm">database</span>
            <span className="font-body-md text-body-md">Base de datos oficial MX</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <section className="lg:col-span-8 flex flex-col gap-unit-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-sm">
            <div>
              <div className="flex items-center gap-unit-xs">
                <span className="material-symbols-outlined text-secondary text-title-lg">radar</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Actividad y reportes recientes
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-unit-2xs">
                Números catalogados por la comunidad en todo el territorio nacional.
              </p>
            </div>
            <div className="inline-flex items-center bg-surface-container-dark/80 p-unit-2xs rounded-xl self-start sm:self-auto shadow-sm flex-wrap">
              {FILTROS.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => setFiltro(f.valor)}
                  className={`px-unit-sm py-unit-2xs rounded-lg font-label-caps text-label-caps transition-all ${
                    filtro === f.valor
                      ? 'bg-surface-container-high text-on-surface'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {f.texto}
                </button>
              ))}
            </div>
          </div>

          {cargando && (
            <div className="flex items-center justify-center gap-unit-sm p-unit-xl text-on-surface-variant font-body-md text-body-md">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Consultando la red MyKanan…
            </div>
          )}
          {error && !cargando && (
            <div className="p-unit-lg rounded-xl bg-risk-fraud-bg text-error font-body-md text-body-md flex items-center gap-unit-sm">
              <span className="material-symbols-outlined">cloud_off</span>
              No se pudo conectar con el servidor: {error}
            </div>
          )}
          {!cargando && !error && numeros.length === 0 && (
            <div className="p-unit-xl rounded-xl bg-surface-container-low text-center flex flex-col items-center gap-unit-sm">
              <span className="material-symbols-outlined text-headline-md text-risk-nodata">
                search_off
              </span>
              <p className="font-body-lg text-body-lg text-on-surface">Sin números en esta categoría</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Sé el primero en{' '}
                <Link to="/reportar" className="text-secondary underline">
                  reportar un número sospechoso
                </Link>
                .
              </p>
            </div>
          )}
          <div className="flex flex-col gap-unit-md">
            {!cargando && !error && numeros.map((n) => <TarjetaNumero key={n.telefono} numero={n} />)}
          </div>

          {dist && distTotal > 0 && (
            <div className="bg-surface-deck-white text-surface-container-lowest rounded-2xl p-unit-xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-md mb-unit-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-inverse-primary tracking-wider font-bold">
                    Distribución de Amenazas Telefónicas
                  </span>
                  <h3 className="font-title-lg text-title-lg font-bold text-surface-container-lowest">
                    Matriz de Incidencia Nacional
                  </h3>
                </div>
                <div className="flex items-center gap-unit-sm text-surface-container font-label-sm text-label-sm">
                  <span className="inline-flex items-center gap-unit-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-risk-fraud" /> Fraude ({pct(dist.fraude)}%)
                  </span>
                  <span className="inline-flex items-center gap-unit-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-risk-spam" /> Spam ({pct(dist.spam)}%)
                  </span>
                  <span className="inline-flex items-center gap-unit-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-risk-verified" /> Oficial (
                    {pct(dist.verificado)}%)
                  </span>
                </div>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-deck-muted overflow-hidden flex mb-unit-md">
                <div className="h-full bg-risk-fraud" style={{ width: `${pct(dist.fraude)}%` }} />
                <div className="h-full bg-risk-spam" style={{ width: `${pct(dist.spam)}%` }} />
                <div className="h-full bg-risk-verified" style={{ width: `${pct(dist.verificado)}%` }} />
              </div>
              <p className="font-label-sm text-label-sm text-surface-container">
                {total.toLocaleString('es-MX')} números catalogados contribuyen a esta matriz.
              </p>
            </div>
          )}
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-unit-lg">
          <div className="bg-surface-container-dark/90 rounded-2xl p-unit-xl shadow-xl">
            <div className="flex items-center justify-between mb-unit-md">
              <div className="flex items-center gap-unit-xs text-secondary">
                <span className="material-symbols-outlined text-title-lg">monitoring</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider font-bold">
                  Monitor Nacional MX
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-risk-verified animate-ping" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-unit-xs">
              Estadísticas en tiempo real
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-unit-lg">
              Monitoreo continuo de números denunciados y vectores de suplantación en México.
            </p>
            <div className="p-unit-md rounded-xl bg-surface-container-high/60 mb-unit-md">
              <div className="flex items-baseline justify-between">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface font-mono tracking-tight">
                  {(stats?.numeros_catalogados ?? 0).toLocaleString('es-MX')}
                </span>
                <span className="font-label-caps text-label-caps text-risk-fraud flex items-center font-bold">
                  <span className="material-symbols-outlined text-label-sm">trending_up</span> +7 días
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-unit-2xs">
                Números fraudulentos y sospechosos catalogados
              </p>
            </div>
            <div className="p-unit-md rounded-xl bg-surface-container-high/60 mb-unit-lg">
              <div className="flex items-baseline justify-between">
                <span className="font-headline-lg text-headline-lg font-bold text-tertiary font-mono tracking-tight">
                  {(stats?.reportes_7d ?? 0).toLocaleString('es-MX')}
                </span>
                <span className="font-label-caps text-label-caps text-risk-verified flex items-center font-bold">
                  <span className="material-symbols-outlined text-label-sm">check_circle</span> Última
                  semana
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-unit-2xs">
                Reportes comunitarios recibidos ({stats?.reportes_hoy ?? 0} hoy)
              </p>
            </div>
            <div className="mb-unit-lg">
              <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mb-unit-2xs">
                <span>Intensidad de llamadas sospechosas (24 hrs)</span>
              </div>
              <svg className="w-full h-14 text-secondary" fill="none" viewBox="0 0 300 60">
                <path
                  d="M0 45 L25 40 L50 48 L75 32 L100 35 L125 18 L150 24 L175 8 L200 22 L225 12 L250 30 L275 16 L300 28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M0 45 L25 40 L50 48 L75 32 L100 35 L125 18 L150 24 L175 8 L200 22 L225 12 L250 30 L275 16 L300 28 L300 60 L0 60 Z"
                  fill="#00daf5"
                  opacity="0.15"
                />
              </svg>
            </div>
            <Link
              to="/reportar"
              className="w-full py-unit-sm px-unit-md rounded-xl bg-risk-fraud hover:brightness-110 active:scale-98 text-on-surface font-title-sm text-title-sm font-semibold flex items-center justify-center gap-unit-xs transition-all shadow-[0_4px_16px_rgba(226,75,74,0.35)]"
            >
              <span className="material-symbols-outlined text-title-md">report</span>
              <span>Reportar un número no registrado</span>
            </Link>
          </div>

          <div className="bg-surface-container-low/80 rounded-2xl p-unit-lg shadow-md flex flex-col gap-unit-md">
            <div className="flex items-center gap-unit-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-title-lg">verified</span>
              </div>
              <div>
                <p className="font-title-sm text-title-sm text-on-surface font-semibold">
                  Red de Blindaje MyKanan
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Alianza de seguridad colaborativa
                </p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Al realizar tu consulta proteges a miles de usuarios activos en la República Mexicana.
              Ninguna búsqueda guarda registros de tu identidad.
            </p>
            <div className="flex items-center justify-between pt-unit-xs text-secondary font-title-sm text-title-sm">
              <Link to="/privacidad" className="hover:underline flex items-center gap-unit-2xs">
                <span>Saber más sobre el protocolo</span>
                <span className="material-symbols-outlined text-title-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
