import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../servicios/api';
import { CATEGORIAS, type CategoriaRiesgo, type NumeroResumen, type ReporteRespuesta } from '../tipos';
import { esTelefonoValido, soloDigitos } from '../utilidades/telefono';

export default function ReportarNumero() {
  const [params] = useSearchParams();
  const [telefono, setTelefono] = useState(soloDigitos(params.get('telefono') ?? ''));
  const [categoria, setCategoria] = useState<CategoriaRiesgo | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ReporteRespuesta | null>(null);
  const [recientes, setRecientes] = useState<NumeroResumen[]>([]);

  useEffect(() => {
    api
      .listarNumeros({ limite: 3 })
      .then((r) => setRecientes(r.numeros))
      .catch(() => undefined);
  }, []);

  const digitos = soloDigitos(telefono);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esTelefonoValido(digitos)) {
      setError('Ingresa un número válido a 10 dígitos.');
      return;
    }
    if (!categoria) {
      setError('Selecciona una categoría de riesgo antes de continuar.');
      return;
    }
    if (!consentimiento) {
      setError('Confirma la veracidad de la información para continuar.');
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      const r = await api.crearReporte({
        telefono: digitos,
        categoria,
        descripcion: descripcion.trim() || undefined,
      });
      setResultado(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const reiniciar = () => {
    setTelefono('');
    setCategoria(null);
    setDescripcion('');
    setConsentimiento(false);
    setResultado(null);
    setError(null);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute -top-32 left-1/4 w-[540px] h-[540px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] bg-tertiary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg py-unit-2xl relative">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-unit-lg mb-unit-xl">
          <div className="flex flex-col gap-unit-xs max-w-2xl">
            <div className="inline-flex items-center gap-unit-xs self-start px-unit-sm py-unit-2xs rounded-full bg-surface-container-elevated text-secondary font-label-caps text-label-caps tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span>Módulo de Defensa Comunitaria Activa</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-light tracking-tight">
              ¿Qué número deseas reportar?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Tu reporte es <span className="text-on-surface font-semibold">100% anónimo</span> y pasa
              por un filtro heurístico antes de integrarse al radar comunal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          <div className="lg:col-span-7 flex flex-col gap-unit-lg">
            <div className="relative bg-surface-deck-white text-surface-container-dark rounded-xl p-unit-lg md:p-unit-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-unit-md">
                <div className="flex items-center gap-unit-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-deck-muted flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-title-sm">add_call</span>
                  </div>
                  <span className="font-title-sm text-title-sm text-surface-container-dark uppercase tracking-wider font-semibold">
                    Registro de Amenaza
                  </span>
                </div>
                <div className="flex items-center gap-unit-2xs px-unit-sm py-unit-2xs rounded-full bg-risk-verified-bg text-risk-verified font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-label-caps icono-relleno">shield</span>
                  <span>Cifrado TLS 1.3</span>
                </div>
              </div>

              {resultado ? (
                <div className="flex flex-col items-center justify-center text-center gap-unit-md py-unit-xl animar-aparecer">
                  <div className="w-16 h-16 rounded-full bg-risk-verified-bg text-risk-verified flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-headline-lg">verified</span>
                  </div>
                  <div className="flex flex-col gap-unit-2xs">
                    <h3 className="font-headline-md text-headline-md text-surface-container-dark font-semibold">
                      Reporte Recibido y Cifrado
                    </h3>
                    <p className="font-body-md text-body-md text-outline max-w-md">
                      El número ha sido ingresado al pipeline de análisis de MyKanan. Gracias por
                      contribuir a proteger a la comunidad.
                    </p>
                  </div>
                  <div className="font-mono text-code-mono px-unit-md py-unit-xs bg-surface-deck-muted rounded-lg text-surface-container-dark">
                    Folio: <span className="font-bold">{resultado.folio}</span>
                  </div>
                  <button
                    onClick={reiniciar}
                    className="mt-unit-xs px-unit-lg py-unit-xs rounded-lg bg-surface-container-dark text-on-surface font-title-sm text-title-sm hover:brightness-125 transition-all"
                  >
                    Reportar otro número
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-unit-lg mt-unit-sm" onSubmit={enviar} noValidate>
                  <div className="flex flex-col gap-unit-2xs">
                    <label
                      className="font-title-sm text-title-sm text-surface-container-dark font-medium flex items-center justify-between"
                      htmlFor="telefono"
                    >
                      <span>Número telefónico sospechoso</span>
                      <span className="font-mono text-code-mono text-outline">Formato: 10 dígitos</span>
                    </label>
                    <div className="flex gap-unit-xs">
                      <div className="flex items-center gap-unit-2xs px-unit-md py-unit-xs bg-surface-deck-muted rounded-lg text-surface-container-dark font-title-sm text-title-sm">
                        <span className="font-mono text-code-mono font-bold">🇲🇽 +52</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          id="telefono"
                          inputMode="numeric"
                          maxLength={12}
                          placeholder="55 1234 5678"
                          value={[digitos.slice(0, 2), digitos.slice(2, 6), digitos.slice(6, 10)]
                            .filter(Boolean)
                            .join(' ')}
                          onChange={(e) => setTelefono(soloDigitos(e.target.value))}
                          className="w-full h-12 px-unit-md bg-surface-deck-muted text-surface-container-dark placeholder:text-outline font-title-sm text-title-sm rounded-lg outline-none focus:bg-surface-deck-white focus:ring-2 focus:ring-primary transition-all shadow-inner"
                        />
                        <span className="absolute right-unit-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                          phone
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-unit-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-title-sm text-title-sm text-surface-container-dark font-medium">
                        Categoría de riesgo detectada
                      </span>
                      <span className="font-label-caps text-label-caps text-outline uppercase">Selecciona una</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-unit-xs">
                      {CATEGORIAS.map((c) => (
                        <button
                          key={c.valor}
                          type="button"
                          onClick={() => setCategoria(c.valor)}
                          className={`flex items-center gap-unit-xs px-unit-sm py-unit-xs rounded-lg font-body-md text-body-md text-left transition-all ${
                            categoria === c.valor
                              ? 'bg-primary-container text-on-surface'
                              : 'bg-surface-deck-muted text-surface-container-dark hover:bg-surface-container-low hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-title-sm">{c.icono}</span>
                          <span className="font-medium">{c.etiqueta}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-unit-2xs">
                    <div className="flex items-center justify-between">
                      <label className="font-title-sm text-title-sm text-surface-container-dark font-medium" htmlFor="descripcion">
                        Detalles adicionales (Opcional)
                      </label>
                      <span className="font-label-caps text-label-caps text-outline">
                        {descripcion.length}/300 caracteres
                      </span>
                    </div>
                    <textarea
                      id="descripcion"
                      maxLength={300}
                      rows={3}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Describe brevemente cómo operan o qué te dijeron durante la llamada (ej. 'Dicen ser de soporte Banorte pidiendo token móvil')..."
                      className="w-full p-unit-md bg-surface-deck-muted text-surface-container-dark placeholder:text-outline font-body-md text-body-md rounded-lg outline-none focus:bg-surface-deck-white focus:ring-2 focus:ring-primary transition-all shadow-inner resize-none"
                    />
                  </div>

                  <div className="bg-surface-deck-muted p-unit-md rounded-lg flex items-start gap-unit-sm">
                    <input
                      id="consentimiento"
                      type="checkbox"
                      checked={consentimiento}
                      onChange={(e) => setConsentimiento(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor="consentimiento"
                      className="font-body-md text-body-md text-inverse-on-surface cursor-pointer select-none"
                    >
                      Confirmo que esta información es verídica con fines de advertencia comunitaria y
                      no contiene agravios o datos personales directos de terceros ajenos a la llamada.
                    </label>
                  </div>

                  {error && (
                    <p className="font-body-md text-body-md text-risk-fraud flex items-center gap-unit-2xs">
                      <span className="material-symbols-outlined text-title-sm">error</span>
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-unit-md pt-unit-xs">
                    <div className="flex items-center gap-unit-2xs text-outline font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-title-sm text-risk-verified">visibility_off</span>
                      <span>Sin registro de tu IP o UID</span>
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full sm:w-auto px-unit-xl py-unit-sm bg-secondary text-on-secondary-fixed font-title-sm text-title-sm rounded-lg hover:brightness-110 shadow-lg hover:shadow-[0_0_24px_rgba(172,200,247,0.4)] transition-all flex items-center justify-center gap-unit-xs disabled:opacity-60"
                    >
                      <span>{enviando ? 'Enviando…' : 'Enviar reporte anónimo'}</span>
                      <span
                        className={`material-symbols-outlined text-title-sm ${enviando ? 'animate-spin' : ''}`}
                      >
                        {enviando ? 'progress_activity' : 'send'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div className="bg-surface-container-low p-unit-lg rounded-xl flex items-center gap-unit-md shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-headline-md">sync_lock</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Validación Heurística</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Se cruzan los reportes para evitar falsos positivos.
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-low p-unit-lg rounded-xl flex items-center gap-unit-md shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-headline-md">hub</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Sincronización Inmediata</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    El número aparece en la base comunitaria al instante.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-unit-lg">
            <div className="bg-surface-container-low rounded-xl p-unit-xl shadow-md flex flex-col gap-unit-lg">
              <div className="flex items-center gap-unit-xs">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-title-sm">verified_user</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  ¿Cómo procesamos tu reporte?
                </h2>
              </div>
              <div className="flex flex-col gap-unit-md relative">
                {[
                  {
                    n: '1',
                    t: 'Anonimización irreversible',
                    d: 'No conservamos metadatos de origen ni registros de red. Tu identidad queda completamente separada del número reportado.',
                  },
                  {
                    n: '2',
                    t: 'Cruce con reportes previos',
                    d: 'El número se valida contra la base comunitaria y reportes históricos para medir su nivel de riesgo.',
                  },
                  {
                    n: '3',
                    t: 'Emisión de alerta comunitaria',
                    d: 'Al superar el umbral de concordancia, la ficha pública del número refleja el riesgo para todos los usuarios.',
                  },
                ].map((paso, i) => (
                  <div key={paso.n} className="flex gap-unit-md">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-primary-container text-tertiary flex items-center justify-center font-mono text-code-mono font-bold shrink-0">
                        {paso.n}
                      </div>
                      {i < 2 && <div className="w-0.5 flex-1 bg-surface-container-high my-1" />}
                    </div>
                    <div className="flex flex-col pb-unit-sm">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{paso.t}</span>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{paso.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-unit-md rounded-lg bg-surface-container-dark flex items-center justify-between gap-unit-sm">
                <div className="flex items-center gap-unit-xs">
                  <span className="material-symbols-outlined text-risk-verified">privacy_tip</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Cero acceso a tus contactos
                  </span>
                </div>
                <span className="font-mono text-code-mono text-tertiary font-bold">100% Blindado</span>
              </div>
            </div>

            {recientes.length > 0 && (
              <div className="bg-surface-container-dark rounded-xl p-unit-lg shadow-md flex flex-col gap-unit-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-unit-xs">
                    <span className="w-2 h-2 rounded-full bg-risk-fraud animate-pulse" />
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      Números más reportados
                    </span>
                  </div>
                  <span className="font-mono text-code-mono text-outline">En vivo</span>
                </div>
                <div className="flex flex-col gap-unit-xs">
                  {recientes.map((n) => (
                    <div key={n.telefono} className="flex items-center justify-between p-unit-xs bg-surface-container-high rounded-lg">
                      <span className="font-mono text-code-mono text-on-surface font-semibold">{n.formato}</span>
                      <span className="font-label-sm text-label-sm text-outline">
                        {n.total_reportes.toLocaleString('es-MX')} reportes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
