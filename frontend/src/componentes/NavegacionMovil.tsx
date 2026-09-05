import { NavLink } from 'react-router-dom';

const PESTANAS = [
  { a: '/', texto: 'Inicio', icono: 'home' },
  { a: '/base', texto: 'Base', icono: 'radar' },
  { a: '/reportar', texto: 'Reportar', icono: 'report' },
  { a: '/privacidad', texto: 'Privacidad', icono: 'security' },
];

export default function NavegacionMovil() {
  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 flex justify-around items-center px-2 py-2 rounded-full bg-secondary/95 backdrop-blur-lg shadow-xl shadow-secondary/20">
      {PESTANAS.map((p) => (
        <NavLink
          key={p.a}
          to={p.a}
          end={p.a === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-full p-2 transition-all ${
              isActive
                ? 'bg-on-secondary-fixed/10 text-on-secondary-fixed scale-110'
                : 'text-on-secondary/70 hover:text-on-secondary-fixed'
            }`
          }
        >
          <span className="material-symbols-outlined">{p.icono}</span>
          <span className="text-[10px] font-semibold mt-0.5">{p.texto}</span>
        </NavLink>
      ))}
    </nav>
  );
}
