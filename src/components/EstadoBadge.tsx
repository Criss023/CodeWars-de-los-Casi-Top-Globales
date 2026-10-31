import type { EstadoExpediente } from '../types';

const estilos: Record<EstadoExpediente, string> = {
  Abierto:          'bg-emerald-950 text-emerald-400 border border-emerald-800',
  'En seguimiento': 'bg-amber-950  text-amber-400  border border-amber-800',
  Cerrado:          'bg-[#222]     text-[#999]     border border-[#333]',
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