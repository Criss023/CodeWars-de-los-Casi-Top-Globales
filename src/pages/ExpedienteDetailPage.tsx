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
  apertura:      { border: 'border-emerald-700', badge: 'bg-emerald-950 text-emerald-400', label: '📂 Apertura' },
  actividad:     { border: 'border-blue-700',    badge: 'bg-blue-950 text-blue-400',       label: '📝 Actividad' },
  cambio_estado: { border: 'border-amber-700',   badge: 'bg-amber-950 text-amber-400',     label: '🔄 Cambio de estado' },
  cierre:        { border: 'border-[#333]',      badge: 'bg-[#1a1a1a] text-[#888]',        label: '🔒 Cierre' },
  reapertura:    { border: 'border-violet-700',  badge: 'bg-violet-950 text-violet-400',   label: '🔓 Reapertura' },
} as const;

function HistorialItem({ entrada }: { entrada: EntradaHistorial }) {
  const cfg = historialConfig[entrada.tipo];
  return (
    <div className={`border-l-2 ${cfg.border} pl-4 py-2`}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-[#555] font-mono">{formatFecha(entrada.fecha)}</span>
      </div>
      <p className="text-sm text-[#ccc]">{entrada.descripcion}</p>
    </div>
  );
}

function Alerta({ tipo, mensaje }: { tipo: 'exito' | 'error'; mensaje: string }) {
  const estilos = {
    exito: 'bg-emerald-950 border-emerald-700 text-emerald-400',
    error: 'bg-red-950 border-red-700 text-red-400',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 ${estilos[tipo]}`}>
      {tipo === 'exito' ? '✓' : '⚠'} {mensaje}
    </div>
  );
}

const ic = (err: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-sm bg-[#111] text-[#e8e8e8]
  placeholder-[#555] resize-none focus:outline-none focus:ring-2 transition
  ${err ? 'border-red-600 focus:ring-red-600' : 'border-[#2a2a2a] focus:ring-[#ff4f00]'}`;

export function ExpedienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = useExpedientesStore();
  const expediente = store.getExpediente(id!);

  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);
  const [mostrarFormCierre, setMostrarFormCierre] = useState(false);
  const [mostrarFormReapertura, setMostrarFormReapertura] = useState(false);

  const actividadForm = useForm<AgregarActividadFormData>({ resolver: zodResolver(agregarActividadSchema) });
  const cierreForm    = useForm<CerrarExpedienteFormData>({ resolver: zodResolver(cerrarExpedienteSchema) });
  const reaperturaForm = useForm<ReopenFormData>({ resolver: zodResolver(reabrirExpedienteSchema) });

  if (!expediente) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-[#888] mb-4">Expediente no encontrado.</p>
        <Link to="/expedientes" className="text-[#ff4f00] hover:underline text-sm">
          ← Volver a expedientes
        </Link>
      </div>
    );
  }

  const mostrarExito = (msg: string) => { setAlerta({ tipo: 'exito', mensaje: msg }); setTimeout(() => setAlerta(null), 4000); };
  const mostrarError = (msg: string) => { setAlerta({ tipo: 'error', mensaje: msg }); setTimeout(() => setAlerta(null), 6000); };

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
    if (resultado.ok) { setMostrarFormCierre(false); cierreForm.reset(); mostrarExito('Expediente cerrado correctamente.'); }
    else mostrarError(resultado.error ?? 'No se pudo cerrar el expediente.');
  };

  const onReabrir = (data: ReopenFormData) => {
    const resultado = store.reabrirExpediente(expediente.id, data.motivoReapertura);
    if (resultado.ok) { setMostrarFormReapertura(false); reaperturaForm.reset(); mostrarExito('Expediente reabierto. Ahora está En seguimiento.'); }
    else mostrarError(resultado.error ?? 'No se pudo reabrir el expediente.');
  };

  const estaCerrado = expediente.estado === 'Cerrado';

  return (
    <div className="max-w-3xl mx-auto">
      {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} />}

      {/* Cabecera */}
      <div className="mb-6">
        <Link to="/expedientes" className="text-[#ff4f00] hover:underline text-sm">
          ← Volver a expedientes
        </Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <code className="text-xs text-[#888] bg-[#1a1a1a] px-2 py-1 rounded font-mono border border-[#2a2a2a]">
                {expediente.id}
              </code>
              <EstadoBadge estado={expediente.estado} />
              {expediente.categoria && (
                <span className="capitalize text-xs text-[#ff4f00] bg-[#ff4f00]/10 border border-[#ff4f00]/20 px-2 py-0.5 rounded-full">
                  {expediente.categoria}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{expediente.alias}</h2>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 mb-5">
        <h3 className="section-label">Información del expediente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#555] text-xs block">Responsable</span>
            <span className="font-semibold text-[#e8e8e8]">{expediente.responsable}</span>
          </div>
          <div>
            <span className="text-[#555] text-xs block">Fecha de apertura</span>
            <span className="font-semibold text-[#e8e8e8] font-mono text-xs">{formatFecha(expediente.fechaApertura)}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#555] text-xs block">Descripción del asunto</span>
            <span className="text-[#ccc]">{expediente.descripcion}</span>
          </div>
        </div>
      </div>

      {/* Expediente CERRADO */}
      {estaCerrado && (
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 mb-5">
          <div className="flex items-start gap-2 mb-4">
            <span>🔒</span>
            <p className="text-sm text-[#888]">
              Este expediente está <strong className="text-[#ccc]">cerrado</strong>. No admite nuevas actividades.
              Puede reabrirse si se recibe información posterior al cierre.
            </p>
          </div>
          <button onClick={() => setMostrarFormReapertura(!mostrarFormReapertura)} className="btn-purple">
            🔓 Reabrir expediente
          </button>
          {mostrarFormReapertura && (
            <form onSubmit={reaperturaForm.handleSubmit(onReabrir)} className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#ccc] mb-1">
                  Motivo de reapertura <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...reaperturaForm.register('motivoReapertura')}
                  rows={2}
                  className={ic(!!reaperturaForm.formState.errors.motivoReapertura)}
                  placeholder="Indique por qué se retoma el seguimiento..."
                />
                {reaperturaForm.formState.errors.motivoReapertura && (
                  <p className="mt-1 text-xs text-red-400">⚠ {reaperturaForm.formState.errors.motivoReapertura.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-purple">Confirmar reapertura</button>
                <button type="button" onClick={() => { setMostrarFormReapertura(false); reaperturaForm.reset(); }} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Cambiar estado */}
      {!estaCerrado && (
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 mb-5">
          <h3 className="section-label">Cambiar estado</h3>
          {expediente.estado === 'Abierto' && (
            <button onClick={onPasarASeguimiento} className="btn-warning">
              → Pasar a En seguimiento
            </button>
          )}
          {expediente.estado === 'En seguimiento' && (
            <div>
              <button onClick={() => setMostrarFormCierre(!mostrarFormCierre)} className="btn-danger">
                🔒 Cerrar expediente
              </button>
              {mostrarFormCierre && (
                <form onSubmit={cierreForm.handleSubmit(onCerrar)} className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#ccc] mb-1">
                      Motivo de cierre <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...cierreForm.register('motivoCierre')}
                      rows={2}
                      className={ic(!!cierreForm.formState.errors.motivoCierre)}
                      placeholder="Describa el motivo de cierre..."
                    />
                    {cierreForm.formState.errors.motivoCierre && (
                      <p className="mt-1 text-xs text-red-400">⚠ {cierreForm.formState.errors.motivoCierre.message}</p>
                    )}
                  </div>
                  {!expediente.historial.some((h) => h.tipo === 'actividad') && (
                    <p className="text-xs text-amber-400 bg-amber-950 border border-amber-800 px-3 py-2 rounded-lg">
                      ⚠ Para cerrar el expediente debe existir al menos una actividad registrada.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" className="btn-danger">Confirmar cierre</button>
                    <button type="button" onClick={() => { setMostrarFormCierre(false); cierreForm.reset(); }} className="btn-secondary">Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Registrar actividad */}
      {!estaCerrado && (
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 mb-5">
          <h3 className="section-label">Registrar actividad</h3>
          <form onSubmit={actividadForm.handleSubmit(onAgregarActividad)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">
                Tipo de actividad <span className="text-[#555] text-xs">(opcional)</span>
              </label>
              <input
                {...actividadForm.register('tipo')}
                className="w-full border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm bg-[#111] text-[#e8e8e8] placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#ff4f00]"
                placeholder="Ej: Notificación, Audiencia, Consulta..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">
                Descripción <span className="text-red-400">*</span>
              </label>
              <textarea
                {...actividadForm.register('descripcion')}
                rows={2}
                className={ic(!!actividadForm.formState.errors.descripcion)}
                placeholder="Describa la actividad realizada..."
              />
              {actividadForm.formState.errors.descripcion && (
                <p className="mt-1 text-xs text-red-400">⚠ {actividadForm.formState.errors.descripcion.message}</p>
              )}
            </div>
            <button type="submit" className="btn-primary">+ Registrar actividad</button>
          </form>
        </div>
      )}

      {/* Historial */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5">
        <h3 className="section-label">
          Historial cronológico — {expediente.historial.length} entrada{expediente.historial.length !== 1 ? 's' : ''}
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