import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpedientesStore } from '../store/expedientesStore';
import { EstadoBadge } from '../components/EstadoBadge';

export function ExpedientesPage() {
  const expedientes = useExpedientesStore((state) => state.expedientes);
  const [busqueda, setBusqueda] = useState('');

  const query = busqueda.trim().toLowerCase();
  const resultados = query
    ? expedientes.filter(
        (exp) =>
          exp.id.toLowerCase().includes(query) ||
          exp.alias.toLowerCase().includes(query)
      )
    : expedientes;

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expedientes</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {expedientes.length} expediente{expedientes.length !== 1 ? 's' : ''} registrado
            {expedientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/expedientes/nuevo"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm"
        >
          + Nuevo expediente
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar por identificador o nombre/alias..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Sin resultados */}
      {resultados.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          {query ? (
            <>
              <p className="text-gray-500 mb-1">
                No se encontraron expedientes para{' '}
                <strong>&ldquo;{busqueda}&rdquo;</strong>.
              </p>
              <p className="text-sm text-gray-400">
                Intente con otro identificador o nombre.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-3">No hay expedientes registrados.</p>
              <Link
                to="/expedientes/nuevo"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Abrir el primer expediente →
              </Link>
            </>
          )}
        </div>
      )}

      {/* Lista */}
      {resultados.length > 0 && (
        <div className="space-y-3">
          {query && (
            <p className="text-xs text-gray-500 mb-2">
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} para &ldquo;{busqueda}&rdquo;
            </p>
          )}
          {resultados.map((exp) => (
            <Link
              key={exp.id}
              to={`/expedientes/${exp.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                    {exp.id}
                  </code>
                  <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition">
                    {exp.alias}
                  </span>
                </div>
                <EstadoBadge estado={exp.estado} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span>
                  Responsable:{' '}
                  <strong className="text-gray-700">{exp.responsable}</strong>
                </span>
                {exp.categoria && (
                  <span className="capitalize text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full text-xs">
                    {exp.categoria}
                  </span>
                )}
                <span className="text-xs">
                  {new Date(exp.fechaApertura).toLocaleDateString('es-GT', {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-gray-500 line-clamp-1">{exp.descripcion}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}