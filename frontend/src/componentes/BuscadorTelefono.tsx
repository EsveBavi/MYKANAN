import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { esTelefonoValido, soloDigitos } from '../utilidades/telefono';

function conMascara(digitos: string): string {
  const d = digitos.slice(0, 10);
  const partes = [d.slice(0, 2), d.slice(2, 6), d.slice(6, 10)].filter(Boolean);
  return partes.join(' ');
}

export default function BuscadorTelefono() {
  const navegar = useNavigate();
  const [valor, setValor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const digitos = soloDigitos(valor);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esTelefonoValido(digitos)) {
      setError('Ingresa los 10 dígitos del número (México).');
      return;
    }
    setError(null);
    navegar(`/numero/${digitos}`);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-surface-container-dark/95 backdrop-blur-2xl rounded-2xl p-unit-xs shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all">
        <form className="flex flex-col sm:flex-row items-center gap-unit-xs" onSubmit={enviar}>
          <div className="flex items-center flex-1 w-full px-unit-md py-unit-xs gap-unit-sm">
            <span className="material-symbols-outlined text-secondary text-title-lg select-none">
              search
            </span>
            <input
              autoComplete="off"
              inputMode="numeric"
              className="w-full bg-transparent text-on-surface font-body-lg text-body-lg placeholder:text-outline focus:outline-none tracking-wider"
              placeholder="Ingresa un número telefónico (10 dígitos)..."
              value={conMascara(digitos)}
              onChange={(e) => {
                setValor(soloDigitos(e.target.value));
                setError(null);
              }}
              aria-label="Número telefónico a consultar"
            />
            {digitos.length > 0 && (
              <button
                type="button"
                aria-label="Limpiar campo"
                className="p-unit-2xs text-outline hover:text-on-surface transition-opacity"
                onClick={() => setValor('')}
              >
                <span className="material-symbols-outlined text-title-sm">close</span>
              </button>
            )}
            <div className="hidden md:flex items-center px-unit-xs py-unit-2xs bg-surface-container-high rounded-md text-on-surface-variant font-mono text-code-mono select-none">
              MX +52
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-unit-xl py-unit-sm bg-secondary text-on-secondary font-title-sm text-title-sm rounded-xl font-semibold hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-unit-xs shadow-[0_4px_20px_rgba(172,200,247,0.35)] cursor-pointer"
          >
            <span>Consultar número</span>
            <span className="material-symbols-outlined text-title-sm">arrow_forward</span>
          </button>
        </form>
      </div>
      {error && (
        <p className="mt-unit-xs text-error font-label-sm text-label-sm flex items-center gap-unit-2xs">
          <span className="material-symbols-outlined text-title-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
