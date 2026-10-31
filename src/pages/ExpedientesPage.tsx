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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Expedientes</h2>
          <p className="text-sm text-[#888] mt-0.5">
            {expedientes.length} expediente{expedientes.length !== 1 ? 's' : ''} registrado{expedientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/expedientes/nuevo" className="btn-primary">
          + Nuevo expediente
        </Link>
      </div>

      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar por identificador o nombre/alias..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-[#2a2a2a] rounded-lg text-sm
                     bg-[#111] text-[#e8e8e8] placeholder-[#555]
                     focus:outline-none focus:ring-2 focus:ring-[#ff4f00]"
        />
        {busqueda && (
          <button onClick={() => setBusqueda('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white text-lg">
            ×
          </button>
        )}
      </div>

      {resultados.length === 0 ? (
        <div className="text-center py-16 bg-[#111] rounded-lg border border-dashed border-[#2a2a2a]">
          {query ? (
            <>
              <p className="text-[#ccc] mb-1">No se encontraron expedientes para <strong>"{busqueda}"</strong>.</p>
              <p className="text-sm text-[#666]">Intente con otro identificador o nombre.</p>
            </>
          ) : (
            <>
              <p className="text-[#ccc] mb-3">No hay expedientes registrados.</p>
              <Link to="/expedientes/nuevo" className="text-[#ff4f00] hover:underline text-sm font-medium">
                Abrir el primer expediente →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {resultados.map((exp) => (
            <Link key={exp.id} to={`/expedientes/${exp.id}`}
              className="block bg-[#111] border border-[#2a2a2a] rounded-lg p-5
                         hover:border-[#ff4f00]/40 hover:bg-[#161616]
                         transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs text-[#888] bg-[#1a1a1a] px-2 py-1 rounded font-mono border border-[#2a2a2a]">
                    {exp.id}
                  </code>
                  <span className="font-bold text-white group-hover:text-[#ff4f00] transition">
                    {exp.alias}
                  </span>
                </div>
                <EstadoBadge estado={exp.estado} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#888]">
                <span>Responsable: <strong className="text-[#e8e8e8]">{exp.responsable}</strong></span>
                {exp.categoria && (
                  <span className="capitalize text-[#ff4f00] bg-[#ff4f00]/10 border border-[#ff4f00]/20 px-2 py-0.5 rounded-full text-xs font-medium">
                    {exp.categoria}
                  </span>
                )}
                <span className="text-xs font-mono text-[#888]">
                  {new Date(exp.fechaApertura).toLocaleDateString('es-GT', { dateStyle: 'medium' })}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#666] line-clamp-1">{exp.descripcion}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}