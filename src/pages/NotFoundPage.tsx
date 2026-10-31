import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">📋</p>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Página no encontrada</h2>
      <p className="text-gray-500 mb-6">La dirección solicitada no existe en el sistema.</p>
      <Link
        to="/expedientes"
        className="inline-block bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
      >
        Ir a Expedientes
      </Link>
    </div>
  );
}