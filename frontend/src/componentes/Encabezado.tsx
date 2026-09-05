import { Link, NavLink } from 'react-router-dom';

const ENLACES = [
  { a: '/', texto: 'Inicio / Búsqueda' },
  { a: '/reportar', texto: 'Reportar Número' },
  { a: '/privacidad', texto: 'Privacidad y Control' },
  { a: '/base', texto: 'Base Comunitaria' },
];

export default function Encabezado() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-dark/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="h-18 max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg flex items-center justify-between">
        <Link to="/" className="flex items-center gap-unit-md">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-secondary shadow-[0_0_16px_rgba(172,200,247,0.25)]">
            <span className="material-symbols-outlined text-title-lg">shield</span>
          </div>
          <span className="font-title-lg text-title-lg tracking-tight text-on-surface font-bold lowercase">
            my kanan
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-unit-xs">
          {ENLACES.map((e) => (
            <NavLink
              key={e.a}
              to={e.a}
              end={e.a === '/'}
              className={({ isActive }) =>
                `px-unit-sm py-unit-xs rounded-lg font-title-sm text-title-sm transition-all ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {e.texto}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-unit-md">
          <Link
            to="/reportar"
            className="hidden sm:inline-flex items-center px-unit-md py-unit-xs rounded-lg bg-secondary text-on-secondary-fixed font-title-sm text-title-sm hover:brightness-110 transition-all shadow-[0_0_12px_rgba(172,200,247,0.35)]"
          >
            Reportar sospechoso
          </Link>
          <div className="hidden xl:flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-full bg-risk-verified-bg text-risk-verified font-label-caps text-label-caps">
            <span className="w-2 h-2 rounded-full bg-risk-verified animate-pulse" />
            <span>Protegido</span>
          </div>
        </div>
      </div>
    </header>
  );
}
