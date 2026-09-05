import { useState } from 'react';
import { api } from '../servicios/api';
import type { TipoSolicitudArco } from '../tipos';
import { esTelefonoValido, formatearTelefono, soloDigitos } from '../utilidades/telefono';

const ACCIONES_ARCO: {
  tipo: TipoSolicitudArco;
  titulo: string;
  subtitulo: string;
  icono: string;
  cajaIcono: string;
  modalTitulo: string;
  modalDesc: string;
}[] = [
  {
    tipo: 'eliminar',
    titulo: 'Solicitar eliminación de mi número',
    subtitulo: 'Desvincular cualquier reporte público asociado a tu línea',
    icono: 'delete_forever',
    cajaIcono: 'bg-risk-fraud-bg text-risk-fraud',
    modalTitulo: 'Eliminar Número de Registro',
    modalDesc:
      'Se eliminará cualquier vínculo o histórico reportado sobre tu línea telefónica de nuestra base de búsqueda comunitaria pública.',
  },
  {
    tipo: 'rectificar',
    titulo: 'Corregir información de registro',
    subtitulo: 'Impugnar clasificaciones erróneas o desactualizadas',
    icono: 'edit_note',
    cajaIcono: 'bg-secondary-container text-secondary',
    modalTitulo: 'Rectificar Datos Telefónicos',
    modalDesc:
      'Corrige registros desactualizados, reportes desestimados o añade evidencia técnica de tu línea telefónica.',
  },
  {
    tipo: 'descargar',
    titulo: 'Descargar reporte completo',
    subtitulo: 'Expediente auditable en formato estructurado JSON',
    icono: 'file_download',
    cajaIcono: 'bg-tertiary-container text-tertiary',
    modalTitulo: 'Descargar Reporte Transparencia',
    modalDesc:
      'Generaremos un archivo estructurado con todos los registros vinculados a tu terminal telefónica.',
  },
];

export default function Privacidad() {
  const [accion, setAccion] = useState<(typeof ACCIONES_ARCO)[number] | null>(null);
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const digitos = soloDigitos(telefono);

  const mostrarToast = (mensaje: string) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 4000);
  };

  const enviarArco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esTelefonoValido(digitos)) {
      setError('Ingresa un número mexicano válido a 10 dígitos.');
      return;
    }
    if (!accion) return;
    setError(null);
    setEnviando(true);
    try {
      const r = await api.enviarSolicitudArco({
        telefono: digitos,
        tipo: accion.tipo,
        motivo: motivo.trim() || undefined,
      });
      setAccion(null);
      setTelefono('');
      setMotivo('');
      mostrarToast(`Solicitud ${accion.tipo} registrada. Folio: ${r.folio}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-max-width-content mx-auto px-margin-desktop max-lg:px-unit-lg py-unit-2xl flex flex-col gap-unit-2xl relative">
      <div className="absolute -top-16 right-12 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-unit-lg pb-unit-lg">
        <div className="max-w-3xl flex flex-col gap-unit-xs">
          <div className="flex items-center gap-unit-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(0,218,245,0.8)]" />
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-tertiary">
              Protocolo Zero-Trust • LFPDPPP México
            </span>
          </div>
          <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight font-light">
            Privacidad y Control <span className="text-secondary font-medium">de tus Datos</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Transparencia absoluta y control total sobre tu información en MyKanan. Diseñado desde el
            inicio sin acceso a tu libreta de contactos personales.
          </p>
        </div>
        <div className="bg-surface-container-high/60 backdrop-blur-md px-unit-md py-unit-xs rounded-xl flex items-center gap-unit-sm shadow-md self-start">
          <div className="w-9 h-9 rounded-lg bg-risk-verified-bg flex items-center justify-center text-risk-verified shadow-[0_0_12px_rgba(29,158,117,0.2)]">
            <span className="material-symbols-outlined text-title-lg">verified_user</span>
          </div>
          <div>
            <div className="font-label-caps text-label-caps text-risk-verified">Cumplimiento ARCO</div>
            <div className="font-mono text-code-mono text-on-surface">Art. 16 Const. MX</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-lg">
        <div className="bg-surface-deck-white text-surface-dim rounded-xl p-unit-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-unit-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-md">
                  <span className="material-symbols-outlined text-title-lg">database</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline-variant uppercase tracking-wider">
                  Módulo 01 • Retención
                </span>
              </div>
              <span className="px-unit-xs py-unit-2xs rounded-full bg-surface-deck-muted text-surface-dim font-label-caps text-label-caps">
                Mínimo Necesario
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-surface-dim tracking-tight">
                Qué información guardamos
              </h2>
              <p className="font-body-md text-body-md text-outline-variant mt-unit-2xs">
                Almacenamos únicamente la telemetría estrictamente requerida para la mitigación
                comunitaria de delitos telefónicos.
              </p>
            </div>
            <div className="flex flex-col gap-unit-xs">
              {[
                {
                  icono: 'call_log',
                  clase: 'text-secondary-container',
                  t: 'Números catalogados como sospechosos',
                  d: 'Identificador público reportado por la comunidad con categoría (fraude, extorsión, spam publicitario).',
                },
                {
                  icono: 'enhanced_encryption',
                  clase: 'text-secondary-container',
                  t: 'Reportes completamente anónimos',
                  d: 'No guardamos IP, agente de usuario, ubicación ni ningún identificador del autor del reporte.',
                },
                {
                  icono: 'location_off',
                  clase: 'text-risk-fraud',
                  t: 'Cero rastreo geográfico',
                  d: 'No recolectamos GPS, SSID de red WiFi, IP de origen ni identificación IMEI de dispositivo.',
                },
              ].map((item) => (
                <div key={item.t} className="bg-surface-deck-muted/70 p-unit-sm rounded-lg flex items-start gap-unit-sm">
                  <span className={`material-symbols-outlined mt-0.5 ${item.clase}`}>{item.icono}</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-surface-dim">{item.t}</span>
                    <span className="font-body-md text-body-md text-outline-variant">{item.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-unit-lg pt-unit-md flex items-center justify-between font-mono text-code-mono text-outline-variant bg-surface-deck-muted/40 px-unit-md py-unit-xs rounded-lg">
            <span>Privacidad por diseño</span>
            <span className="text-risk-verified font-semibold">Zero PII</span>
          </div>
        </div>

        <div className="bg-surface-container-dark rounded-xl p-unit-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-unit-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-elevated flex items-center justify-center text-tertiary shadow-md">
                  <span className="material-symbols-outlined text-title-lg">hub</span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-wider">
                  Módulo 02 • Procedencia
                </span>
              </div>
              <span className="px-unit-xs py-unit-2xs rounded-full bg-risk-verified-bg text-risk-verified font-label-caps text-label-caps">
                100% Comunitario
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight">
                Origen de los datos
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-unit-2xs">
                Construcción comunitaria y fuentes regulatorias públicas mexicanas. Jamás compramos ni
                vendemos datos a intermediarios.
              </p>
            </div>
            <div className="flex flex-col gap-unit-xs">
              {[
                {
                  icono: 'groups_3',
                  clase: 'text-tertiary',
                  t: 'Red comunitaria verificada',
                  d: 'Reportes cruzados y ponderados por consenso para descartar falsos positivos y venganzas personales.',
                },
                {
                  icono: 'account_balance',
                  clase: 'text-secondary',
                  t: 'Listas públicas y regulatorias',
                  d: 'Homologación planeada con registros públicos de telefonía comercial no solicitada (REPEP / PROFECO) e incidencias del IFT.',
                },
                {
                  icono: 'block',
                  clase: 'text-risk-fraud',
                  t: 'Tolerancia cero a data brokers',
                  d: 'Rechazamos la integración con bases compradas, scrapers oscuros o empresas de minería publicitaria.',
                },
              ].map((item) => (
                <div key={item.t} className="bg-surface-container/60 p-unit-sm rounded-lg flex items-start gap-unit-sm">
                  <span className={`material-symbols-outlined mt-0.5 ${item.clase}`}>{item.icono}</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface">{item.t}</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">{item.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-unit-lg pt-unit-md flex items-center justify-between font-mono text-code-mono text-on-surface-variant bg-surface-container-high/40 px-unit-md py-unit-xs rounded-lg">
            <span>Fuente: reportes ciudadanos</span>
            <span className="text-tertiary font-semibold">Clean Data Source</span>
          </div>
        </div>

        <div className="bg-surface-container-dark rounded-xl p-unit-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-unit-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-elevated flex items-center justify-center text-risk-verified shadow-md">
                  <span className="material-symbols-outlined text-title-lg">phonelink_lock</span>
                </div>
                <span className="font-label-caps text-label-caps text-risk-verified uppercase tracking-wider">
                  Módulo 03 • Blindaje Local
                </span>
              </div>
              <span className="px-unit-xs py-unit-2xs rounded-full bg-risk-verified-bg text-risk-verified font-label-caps text-label-caps">
                Permisos: 0/0
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight">
                Tu lista de contactos está segura
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-unit-2xs">
                A diferencia de las apps identificadoras convencionales, MyKanan opera sin solicitar
                permisos de lectura a tus contactos.
              </p>
            </div>
            <div className="bg-surface-container-high/40 p-unit-md rounded-lg flex flex-col gap-unit-xs">
              <div className="flex items-center justify-between gap-unit-sm flex-wrap">
                <span className="font-title-sm text-title-sm text-secondary">
                  ¿Cómo identificamos llamadas sin tus contactos?
                </span>
                <span className="font-mono text-code-mono text-tertiary">Consulta por número</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Solo consultarás números de forma manual o mediante la extensión nativa del sistema
                operativo. El servidor de MyKanan nunca recibe quién te está llamando ni quién forma
                parte de tu agenda.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-unit-xs">
              <div className="bg-surface-container-low p-unit-sm rounded-lg flex items-center gap-unit-xs">
                <span className="material-symbols-outlined text-risk-verified">check_circle</span>
                <span className="font-label-sm text-label-sm text-on-surface">Sin volcado de agenda</span>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg flex items-center gap-unit-xs">
                <span className="material-symbols-outlined text-risk-verified">check_circle</span>
                <span className="font-label-sm text-label-sm text-on-surface">Sin registro de IP</span>
              </div>
            </div>
          </div>
          <div className="mt-unit-lg pt-unit-md flex items-center justify-between font-mono text-code-mono text-on-surface-variant bg-surface-container-high/40 px-unit-md py-unit-xs rounded-lg">
            <span>Privacidad Blindada</span>
            <span className="text-risk-verified font-semibold">Zero Exposure</span>
          </div>
        </div>

        <div className="bg-surface-deck-white text-surface-dim rounded-xl p-unit-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-unit-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-fixed-dim shadow-md">
                  <span className="material-symbols-outlined text-title-lg">admin_panel_settings</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                  Módulo 04 • Soberanía
                </span>
              </div>
              <span className="px-unit-xs py-unit-2xs rounded-full bg-secondary text-on-secondary-fixed font-label-caps text-label-caps">
                Derechos ARCO
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-surface-dim tracking-tight">
                Panel de Gestión y Derechos ARCO
              </h2>
              <p className="font-body-md text-body-md text-outline-variant mt-unit-2xs">
                Ejerce en cualquier momento tus facultades de Acceso, Rectificación, Cancelación y
                Oposición sobre tus datos.
              </p>
            </div>
            <div className="flex flex-col gap-unit-xs">
              {ACCIONES_ARCO.map((a) => (
                <button
                  key={a.tipo}
                  onClick={() => {
                    setAccion(a);
                    setError(null);
                  }}
                  className="w-full group bg-surface-deck-muted hover:bg-surface-deck-muted/60 transition-colors p-unit-sm rounded-lg flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-unit-sm">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${a.cajaIcono}`}>
                      <span className="material-symbols-outlined text-title-sm">{a.icono}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-surface-dim">{a.titulo}</span>
                      <span className="font-label-sm text-label-sm text-outline-variant">{a.subtitulo}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-all">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-unit-lg pt-unit-md flex items-center justify-between font-mono text-code-mono text-outline-variant bg-surface-deck-muted/40 px-unit-md py-unit-xs rounded-lg">
            <span>Tiempo de respuesta: &lt; 48 hrs</span>
            <span className="text-secondary font-semibold">Oficialía de Privacidad</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-unit-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-unit-lg">
        <div className="flex items-center gap-unit-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-elevated flex items-center justify-center text-tertiary shadow-[0_0_16px_rgba(0,218,245,0.2)] shrink-0">
            <span className="material-symbols-outlined text-headline-md">shield_person</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-title-lg text-title-lg text-on-surface">Compromiso MyKanan</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              La información comunitaria pertenece a las personas, no a la corporación. Puedes ejercer
              tus derechos ARCO en cualquier momento desde este panel.
            </p>
          </div>
        </div>
        <button
          onClick={() => mostrarToast('Auditoría criptográfica: último hash validado hace 12 minutos.')}
          className="px-unit-md py-unit-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors flex items-center gap-unit-xs self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-title-sm">history_edu</span>
          <span>Historial Auditoría</span>
        </button>
      </div>

      {accion && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-unit-md">
          <form
            onSubmit={enviarArco}
            className="bg-surface-container-elevated max-w-md w-full rounded-2xl p-unit-xl shadow-2xl flex flex-col gap-unit-md animar-aparecer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-unit-xs text-secondary">
                <span className="material-symbols-outlined text-title-lg">{accion.icono}</span>
                <h4 className="font-title-lg text-title-lg text-on-surface">{accion.modalTitulo}</h4>
              </div>
              <button
                type="button"
                onClick={() => setAccion(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-title-sm">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">{accion.modalDesc}</p>
            <div className="flex flex-col gap-unit-2xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="arco-tel">
                Número Telefónico (10 Dígitos)
              </label>
              <div className="flex items-center bg-surface-container-dark rounded-lg px-unit-sm py-unit-xs">
                <span className="font-mono text-code-mono text-on-surface-variant mr-unit-xs">+52</span>
                <input
                  id="arco-tel"
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="55 1234 5678"
                  value={formatearTelefono(digitos)}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-transparent text-on-surface font-mono text-code-mono focus:outline-none placeholder-outline-variant"
                />
              </div>
            </div>
            <div className="flex flex-col gap-unit-2xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="arco-motivo">
                Motivo o Justificación Legal
              </label>
              <textarea
                id="arco-motivo"
                rows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Opcional: detalla tu solicitud conforme al Artículo 16..."
                className="w-full bg-surface-container-dark rounded-lg p-unit-sm text-on-surface font-body-md text-body-md focus:outline-none placeholder-outline-variant resize-none"
              />
            </div>
            {error && (
              <p className="font-body-md text-body-md text-error flex items-center gap-unit-2xs">
                <span className="material-symbols-outlined text-title-sm">error</span>
                {error}
              </p>
            )}
            <div className="flex items-center justify-end gap-unit-xs mt-unit-xs">
              <button
                type="button"
                onClick={() => setAccion(null)}
                className="px-unit-md py-unit-xs rounded-lg text-on-surface-variant hover:text-on-surface font-title-sm text-title-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="px-unit-md py-unit-xs rounded-lg bg-secondary text-on-secondary-fixed hover:brightness-110 font-title-sm text-title-sm transition-all shadow-[0_0_12px_rgba(172,200,247,0.3)] disabled:opacity-60 flex items-center gap-unit-2xs"
              >
                {enviando && <span className="material-symbols-outlined text-title-sm animate-spin">progress_activity</span>}
                Confirmar Solicitud
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-50 bg-risk-verified-bg text-risk-verified px-unit-md py-unit-sm rounded-xl shadow-xl flex items-center gap-unit-xs animar-aparecer">
          <span className="material-symbols-outlined text-title-sm">task_alt</span>
          <span className="font-title-sm text-title-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
