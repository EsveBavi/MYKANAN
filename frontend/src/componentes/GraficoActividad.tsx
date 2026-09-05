import type { ActividadDia } from '../tipos';

const W = 540;
const H = 140;
const BAR_W = 10;

function colorBarra(total: number, max: number): string {
  if (max === 0) return '#2b4870';
  const r = total / max;
  if (r >= 0.75) return '#E24B4A';
  if (r >= 0.45) return '#EF9F27';
  if (r >= 0.2) return '#acc8f7';
  return '#2b4870';
}

export default function GraficoActividad({ datos }: { datos: ActividadDia[] }) {
  if (datos.length === 0) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">
        Aún no hay actividad registrada para este número.
      </p>
    );
  }
  const max = Math.max(...datos.map((d) => d.total), 1);
  const paso = datos.length > 1 ? (W - 2 * BAR_W) / (datos.length - 1) : 0;
  const ultimo = datos[datos.length - 1];

  return (
    <div className="w-full bg-surface-container-lowest p-unit-md rounded-lg flex flex-col gap-unit-sm">
      <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
        <span>Incidentes diarios reportados por la comunidad</span>
        <span className="text-risk-fraud font-bold">
          Máx. {max} reporte{max === 1 ? '' : 's'}/día
        </span>
      </div>
      <div className="w-full h-44 overflow-hidden pt-unit-xs">
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${W} ${H}`}>
          <line stroke="#2e263c" strokeDasharray="3 3" x1="0" x2={W} y1="20" y2="20" />
          <line stroke="#2e263c" strokeDasharray="3 3" x1="0" x2={W} y1="60" y2="60" />
          <line stroke="#2e263c" strokeDasharray="3 3" x1="0" x2={W} y1="100" y2="100" />
          {datos.map((d, i) => {
            const h = Math.max((d.total / max) * (H - 20), d.total > 0 ? 6 : 2);
            const x = BAR_W + i * paso - BAR_W / 2;
            const y = H - 10 - h;
            return (
              <rect
                key={d.fecha}
                fill={colorBarra(d.total, max)}
                height={h}
                opacity={d.total > 0 ? 0.6 + 0.4 * (d.total / max) : 0.4}
                rx={2}
                width={BAR_W}
                x={x}
                y={y}
              >
                <title>{`${d.fecha}: ${d.total} reportes`}</title>
              </rect>
            );
          })}
          {ultimo.total > 0 && (
            <>
              <line
                stroke="#00daf5"
                strokeDasharray="2 2"
                strokeWidth="1.5"
                x1={BAR_W + (datos.length - 1) * paso}
                x2={BAR_W + (datos.length - 1) * paso}
                y1={H - 10 - Math.max((ultimo.total / max) * (H - 20), 6)}
                y2={H - 10}
              />
              <circle
                className="animate-pulse"
                cx={BAR_W + (datos.length - 1) * paso}
                cy={H - 10 - Math.max((ultimo.total / max) * (H - 20), 6)}
                fill="#00daf5"
                r={4}
              />
            </>
          )}
        </svg>
      </div>
      <div className="flex justify-between items-center text-on-surface-variant font-mono text-code-mono pt-unit-xs">
        <span>Hace {datos.length} días</span>
        <span>Medio</span>
        <span>Hace 7 días</span>
        <span className="text-risk-fraud font-bold">Hoy</span>
      </div>
    </div>
  );
}
