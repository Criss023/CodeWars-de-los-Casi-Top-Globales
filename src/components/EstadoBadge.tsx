import type { EstadoExpediente } from '../types';

const estilos: Record<EstadoExpediente, string> = {
  Abierto: 'bg-green-100 text-green-800 border border-green-300',
  'En seguimiento': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Cerrado: 'bg-gray-100 text-gray-600 border border-gray-300',
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
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${estilos[estado]} ${className}`}
    >
      {estado}
    </span>
  );
}