import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Encabezado from './componentes/Encabezado';
import NavegacionMovil from './componentes/NavegacionMovil';
import PiePagina from './componentes/PiePagina';
import AlertaLlamada from './paginas/AlertaLlamada';
import BaseComunitaria from './paginas/BaseComunitaria';
import DetalleNumero from './paginas/DetalleNumero';
import Inicio from './paginas/Inicio';
import Privacidad from './paginas/Privacidad';
import ReportarNumero from './paginas/ReportarNumero';

function DesplazarArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const pantallaCompleta = pathname.startsWith('/alerta');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DesplazarArriba />
      {!pantallaCompleta && <Encabezado />}
      <main className={`flex-1 ${pantallaCompleta ? '' : 'w-full pt-18 pb-24 lg:pb-0'}`}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/numero/:telefono" element={<DetalleNumero />} />
          <Route path="/reportar" element={<ReportarNumero />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/base" element={<BaseComunitaria />} />
          <Route path="/alerta" element={<AlertaLlamada />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
      {!pantallaCompleta && (
        <>
          <PiePagina />
          <NavegacionMovil />
        </>
      )}
    </div>
  );
}
