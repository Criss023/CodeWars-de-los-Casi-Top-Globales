import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">📋</p>
      <h2 className="text-2xl font-bold text-white mb-2">Página no encontrada</h2>
      <p className="text-[#888] mb-6">La dirección solicitada no existe en el sistema.</p>
      <Link
        to="/expedientes"
        className="inline-block bg-[#ff4f00] text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-[#ff6a20] transition"
      >
        Ir a Expedientes
      </Link>
    </div>
  );
}