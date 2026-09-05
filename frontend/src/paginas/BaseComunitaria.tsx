import { useEffect, useState } from 'react';
import TarjetaNumero from '../componentes/TarjetaNumero';
import { api } from '../servicios/api';
import type { NumeroResumen } from '../tipos';
import { soloDigitos } from '../utilidades/telefono';

type Grupo = 'todos' | 'fraude' | 'spam' | 'verificado';

const GRUPOS: { valor: Grupo; texto: string; icono: string }[] = [
  { valor: 'todos', texto: 'Todos', icono: 'apps' },
  { valor: 'fraude', texto: 'Fraude', icono: 'gpp_bad' },
  { valor: 'spam', texto: 'Spam / Cobranza', icono: 'campaign' },
  { valor: 'verificado', texto: 'Verificados', icono: 'verified_user' },
];

const LIMITE = 10;

export default function BaseComunitaria() {
  const [grupo, setGrupo] = useState<Grupo>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [numeros, setNumeros] = useState<NumeroResumen[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);
    api
      .listarNumeros({
        grupo: grupo === 'todos' ? undefined : grupo,
        busqueda: soloDigitos(busqueda) || undefined,
        limite: LIMITE,
        pagina,
      })
      .then((r) => {
        setNumeros(r.numeros);
        setTotal(r.total);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [grupo, busqueda, pagina]);

  const hayMas = pagina * LIMITE < total;

  return (
    <div className="w-full max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg py-unit-2xl flex flex-col gap-unit-lg">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md">
        <div>
          <div className="flex items-center gap-unit-xs">
            <span className="material-symbols-outlined text-secondary text-title-lg">radar</span>
            <h1 className="font-headline-md text-headline-md text-on-surface">Base Comunitaria</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-unit-2xs">
            Listado completo de números catalogados por la comunidad. {total.toLocaleString('es-MX')}{' '}
            registros.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute left-unit-sm top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-title-lg">
            search
          </span>
          <input
            type="search"
            inputMode="numeric"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar número (10 dígitos)…"
            className="w-full pl-unit-xl pr-unit-md py-unit-xs bg-surface-container rounded-lg text-on-surface font-mono text-code-mono placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </header>

      <div className="inline-flex items-center bg-surface-container-dark/80 p-unit-2xs rounded-xl self-start shadow-sm flex-wrap gap-unit-2xs">
        {GRUPOS.map((g) => (
          <button
            key={g.valor}
            onClick={() => {
              setGrupo(g.valor);
              setPagina(1);
            }}
            className={`flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-lg font-label-caps text-label-caps transition-all ${
              grupo === g.valor
                ? 'bg-surface-container-high text-on-surface'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-title-sm">{g.icono}</span>
            {g.texto}
          </button>
        ))}
      </div>

      {cargando && (
        <div className="flex items-center justify-center gap-unit-sm p-unit-xl text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Cargando base comunitaria…
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
          <span className="material-symbols-outlined text-headline-md text-risk-nodata">search_off</span>
          <p className="font-title-lg text-title-lg text-on-surface">Sin resultados</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            No hay números que coincidan con este filtro o búsqueda.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-unit-md">
        {!cargando && !error && numeros.map((n) => <TarjetaNumero key={n.telefono} numero={n} />)}
      </div>

      {hayMas && (
        <button
          onClick={() => setPagina((p) => p + 1)}
          disabled={cargando}
          className="self-center px-unit-xl py-unit-sm rounded-lg bg-surface-container-high text-on-surface font-title-sm text-title-sm hover:bg-surface-bright transition-all disabled:opacity-60 flex items-center gap-unit-xs"
        >
          <span className="material-symbols-outlined text-title-sm">expand_more</span>
          Mostrar más ({total - pagina * LIMITE} restantes)
        </button>
      )}
    </div>
  );
}
