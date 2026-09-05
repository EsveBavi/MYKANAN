import { Link } from 'react-router-dom';

export default function PiePagina() {
  return (
    <footer className="w-full bg-surface-container-lowest py-unit-xl">
      <div className="max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg flex flex-col md:flex-row items-center justify-between gap-unit-md">
        <div className="flex items-center gap-unit-xs text-risk-verified">
          <span className="material-symbols-outlined text-title-sm">verified_user</span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            MyKanan protege tu privacidad: funciona 100% sin acceso a tu lista de contactos
            personales.
          </p>
        </div>
        <div className="flex items-center gap-unit-lg font-label-sm text-label-sm text-on-surface-variant">
          <Link to="/privacidad" className="hover:text-on-surface transition-colors">
            Términos de Servicio
          </Link>
          <Link to="/privacidad" className="hover:text-on-surface transition-colors">
            Política de Datos México
          </Link>
          <span>© 2026 MyKanan</span>
        </div>
      </div>
    </footer>
  );
}
