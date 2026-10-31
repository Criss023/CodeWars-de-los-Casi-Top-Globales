import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useExpedientesStore } from '../store/expedientesStore';
import { EstadoBadge } from '../components/EstadoBadge';
import {
  agregarActividadSchema,
  cerrarExpedienteSchema,
  reabrirExpedienteSchema,
  type AgregarActividadFormData,
  type CerrarExpedienteFormData,
  type ReopenFormData,
} from '../schemas/expedienteSchema';
import type { EntradaHistorial } from '../types';

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const historialConfig = {
  apertura: {
    border: 'border-green-400',
    badge: 'bg-green-100 text-green-800',
    label: '📂 Apertura',
  },
  actividad: {
    border: 'border-blue-400',
    badge: 'bg-blue-100 text-blue-800',
    label: '📝 Actividad',
  },
  cambio_estado: {
    border: 'border-yellow-400',
    badge: 'bg-yellow-100 text-yellow-800',
    label: '🔄 Cambio de estado',
  },
  cierre: {
    border: 'border-gray-400',
    badge: 'bg-gray-100 text-gray-700',
    label: '🔒 Cierre',
  },
  reapertura: {
    border: 'border-purple-400',
    badge: 'bg-purple-100 text-purple-800',
    label: '🔓 Reapertura',
  },
} as const;

function HistorialItem({ entrada }: { entrada: EntradaHistorial }) {
  const cfg = historialConfig[entrada.tipo];
  return (
    <div className={`border-l-2 ${cfg.border} pl-4 py-2`}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-gray-400">{formatFecha(entrada.fecha)}</span>
      </div>
      <p className="text-sm text-gray-700">{entrada.descripcion}</p>
    </div>
  );
}

function Alerta({ tipo, mensaje }: { tipo: 'exito' | 'error'; mensaje: string }) {
  const estilos = {
    exito: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-700',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 ${estilos[tipo]}`}>
      {tipo === 'exito' ? '✓' : '⚠'} {mensaje}
    </div>
  );
}

export function ExpedienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = useExpedientesStore();
  const expediente = store.getExpediente(id!);

  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);
  const [mostrarFormCierre, setMostrarFormCierre] = useState(false);
  const [mostrarFormReapertura, setMostrarFormReapertura] = useState(false);

  const actividadForm = useForm<AgregarActividadFormData>({
    resolver: zodResolver(agregarActividadSchema),
  });
  const cierreForm = useForm<CerrarExpedienteFormData>({
    resolver: zodResolver(cerrarExpedienteSchema),
  });
  const reaperturaForm = useForm<ReopenFormData>({
    resolver: zodResolver(reabrirExpedienteSchema),
  });

  if (!expediente) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-gray-500 mb-4">Expediente no encontrado.</p>
        <Link to="/expedientes" className="text-blue-600 hover:underline text-sm">
          ← Volver a expedientes
        </Link>
      </div>
    );
  }

  const mostrarExito = (msg: string) => {
    setAlerta({ tipo: 'exito', mensaje: msg });
    setTimeout(() => setAlerta(null), 4000);
  };
  const mostrarError = (msg: string) => {
    setAlerta({ tipo: 'error', mensaje: msg });
    setTimeout(() => setAlerta(null), 6000);
  };

  const onAgregarActividad = (data: AgregarActividadFormData) => {
    store.agregarActividad(expediente.id, data.descripcion, data.tipo || undefined);
    actividadForm.reset();
    mostrarExito('Actividad registrada correctamente.');
  };

  const onPasarASeguimiento = () => {
    store.pasarASeguimiento(expediente.id);
    mostrarExito('Estado actualizado a En seguimiento.');
  };

  const onCerrar = (data: CerrarExpedienteFormData) => {
    const resultado = store.cerrarExpediente(expediente.id, data.motivoCierre);
    if (resultado.ok) {
      setMostrarFormCierre(false);
      cierreForm.reset();
      mostrarExito('Expediente cerrado correctamente.');
    } else {
      mostrarError(resultado.error ?? 'No se pudo cerrar el expediente.');
    }
  };

  const onReabrir = (data: ReopenFormData) => {
    const resultado = store.reabrirExpediente(expediente.id, data.motivoReapertura);
    if (resultado.ok) {
      setMostrarFormReapertura(false);
      reaperturaForm.reset();
      mostrarExito('Expediente reabierto. Ahora está En seguimiento.');
    } else {
      mostrarError(resultado.error ?? 'No se pudo reabrir el expediente.');
    }
  };

  const estaCerrado = expediente.estado === 'Cerrado';

  return (
    <div className="max-w-3xl mx-auto">
      {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} />}

      {/* Cabecera */}
      <div className="mb-6">
        <Link to="/expedientes" className="text-blue-600 hover:underline text-sm">
          ← Volver a expedientes
        </Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
                {expediente.id}
              </code>
              <EstadoBadge estado={expediente.estado} />
              {expediente.categoria && (
                <span className="capitalize text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  {expediente.categoria}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{expediente.alias}</h2>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Información del expediente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400 text-xs block">Responsable</span>
            <span className="font-semibold text-gray-800">{expediente.responsable}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">Fecha de apertura</span>
            <span className="font-semibold text-gray-800">{formatFecha(expediente.fechaApertura)}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-400 text-xs block">Descripción del asunto</span>
            <span className="text-gray-800">{expediente.descripcion}</span>
          </div>
        </div>
      </div>

      {/* ── Expediente CERRADO: aviso + botón reabrir ── */}
      {estaCerrado && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-5 mb-5 shadow-sm">
          <div className="flex items-start gap-2 mb-4">
            <span>🔒</span>
            <p className="text-sm text-gray-600">
              Este expediente está <strong>cerrado</strong>. No admite nuevas actividades.
              Puede reabrirse si se recibe información posterior al cierre.
            </p>
          </div>

          <button
            onClick={() => setMostrarFormReapertura(!mostrarFormReapertura)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            🔓 Reabrir expediente
          </button>

          {mostrarFormReapertura && (
            <form
              onSubmit={reaperturaForm.handleSubmit(onReabrir)}
              className="mt-4 pt-4 border-t space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de reapertura <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...reaperturaForm.register('motivoReapertura')}
                  rows={2}
                  className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 transition ${
                    reaperturaForm.formState.errors.motivoReapertura
                      ? 'border-red-400 focus:ring-red-300 bg-red-50'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Indique por qué se retoma el seguimiento de este expediente..."
                />
                {reaperturaForm.formState.errors.motivoReapertura && (
                  <p className="mt-1 text-xs text-red-600">
                    ⚠ {reaperturaForm.formState.errors.motivoReapertura.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  Confirmar reapertura
                </button>
                <button
                  type="button"
                  onClick={() => { setMostrarFormReapertura(false); reaperturaForm.reset(); }}
                  className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── Acciones de estado (Abierto / En seguimiento) ── */}
      {!estaCerrado && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Cambiar estado
          </h3>

          {expediente.estado === 'Abierto' && (
            <button
              onClick={onPasarASeguimiento}
              className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition shadow-sm"
            >
              → Pasar a En seguimiento
            </button>
          )}

          {expediente.estado === 'En seguimiento' && (
            <div>
              <button
                onClick={() => setMostrarFormCierre(!mostrarFormCierre)}
                className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition shadow-sm"
              >
                🔒 Cerrar expediente
              </button>

              {mostrarFormCierre && (
                <form
                  onSubmit={cierreForm.handleSubmit(onCerrar)}
                  className="mt-4 pt-4 border-t space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo de cierre <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...cierreForm.register('motivoCierre')}
                      rows={2}
                      className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 transition ${
                        cierreForm.formState.errors.motivoCierre
                          ? 'border-red-400 focus:ring-red-300 bg-red-50'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Describa el motivo de cierre del expediente..."
                    />
                    {cierreForm.formState.errors.motivoCierre && (
                      <p className="mt-1 text-xs text-red-600">
                        ⚠ {cierreForm.formState.errors.motivoCierre.message}
                      </p>
                    )}
                  </div>
                  {!expediente.historial.some((h) => h.tipo === 'actividad') && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                      ⚠ Para cerrar el expediente debe existir al menos una actividad registrada.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition"
                    >
                      Confirmar cierre
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMostrarFormCierre(false); cierreForm.reset(); }}
                      className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Registrar actividad (solo si NO está cerrado) ── */}
      {!estaCerrado && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Registrar actividad
          </h3>
          <form onSubmit={actividadForm.handleSubmit(onAgregarActividad)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de actividad{' '}
                <span className="text-gray-400 font-normal text-xs">(opcional)</span>
              </label>
              <input
                {...actividadForm.register('tipo')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Notificación, Audiencia, Consulta..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                {...actividadForm.register('descripcion')}
                rows={2}
                className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 transition ${
                  actividadForm.formState.errors.descripcion
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Describa la actividad realizada..."
              />
              {actividadForm.formState.errors.descripcion && (
                <p className="mt-1 text-xs text-red-600">
                  ⚠ {actividadForm.formState.errors.descripcion.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition shadow-sm"
            >
              + Registrar actividad
            </button>
          </form>
        </div>
      )}

      {/* ── Historial ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Historial cronológico — {expediente.historial.length} entrada
          {expediente.historial.length !== 1 ? 's' : ''}
        </h3>
        <div className="space-y-4">
          {expediente.historial.map((entrada) => (
            <HistorialItem key={entrada.id} entrada={entrada} />
          ))}
        </div>
      </div>
    </div>
  );
}