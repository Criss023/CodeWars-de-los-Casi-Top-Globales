import type { EstadoExpediente } from '../types';

const estilos: Record<EstadoExpediente, string> = {
  Abierto:          'bg-emerald-100 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-300/40',
  'En seguimiento': 'bg-amber-100  text-amber-700  border border-amber-200  ring-1 ring-amber-300/40',
  Cerrado:          'bg-slate-100  text-slate-500  border border-slate-200  ring-1 ring-slate-300/40',
};

const iconos: Record<EstadoExpediente, string> = {
  Abierto:          '🟢',
  'En seguimiento': '🟡',
  Cerrado:          '⚫',
};

export function EstadoBadge({
  estado,
  className = '',
}: {
  estado: EstadoExpediente;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold
                  px-2.5 py-1 rounded-full ${estilos[estado]} ${className}`}
    >
      <span className="text-[9px]">{iconos[estado]}</span>
      {estado}
    </span>
  );
}