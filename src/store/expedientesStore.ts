import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expediente, EntradaHistorial, CrearExpedienteInput, CategoriaExpediente } from '../types';

interface ExpedientesStore {
  expedientes: Expediente[];
  contador: number;
  crearExpediente: (data: CrearExpedienteInput) => Expediente;
  agregarActividad: (expedienteId: string, descripcion: string, tipo?: string) => void;
  pasarASeguimiento: (expedienteId: string) => void;
  cerrarExpediente: (expedienteId: string, motivoCierre: string) => { ok: boolean; error?: string };
  reabrirExpediente: (expedienteId: string, motivoReapertura: string) => { ok: boolean; error?: string };
  getExpediente: (id: string) => Expediente | undefined;
}

const generarId = (contador: number): string => {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `EXP-${fecha}-${String(contador).padStart(3, '0')}`;
};

const uid = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useExpedientesStore = create<ExpedientesStore>()(
  persist(
    (set, get) => ({
      expedientes: [],
      contador: 1,

      getExpediente: (id) => get().expedientes.find((e) => e.id === id),

      crearExpediente: (data) => {
        const { contador } = get();
        const now = new Date().toISOString();
        const id = generarId(contador);

        const entradaApertura: EntradaHistorial = {
          id: uid(),
          tipo: 'apertura',
          descripcion: 'Expediente abierto.',
          fecha: now,
          estadoNuevo: 'Abierto',
        };

        const expediente: Expediente = {
          id,
          alias: data.alias.trim(),
          descripcion: data.descripcion.trim(),
          responsable: data.responsable.trim(),
          categoria: data.categoria as CategoriaExpediente | undefined,
          estado: 'Abierto',
          fechaApertura: now,
          historial: [entradaApertura],
        };

        set((state) => ({
          expedientes: [expediente, ...state.expedientes],
          contador: state.contador + 1,
        }));

        return expediente;
      },

      agregarActividad: (expedienteId, descripcion, tipo) => {
        const exp = get().expedientes.find((e) => e.id === expedienteId);
        if (!exp || exp.estado === 'Cerrado') return;

        const now = new Date().toISOString();
        const entrada: EntradaHistorial = {
          id: uid(),
          tipo: 'actividad',
          descripcion: tipo ? `[${tipo}] ${descripcion.trim()}` : descripcion.trim(),
          fecha: now,
        };

        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, historial: [...e.historial, entrada] }
              : e
          ),
        }));
      },

      pasarASeguimiento: (expedienteId) => {
        const exp = get().expedientes.find((e) => e.id === expedienteId);
        if (!exp || exp.estado !== 'Abierto') return;

        const now = new Date().toISOString();
        const entrada: EntradaHistorial = {
          id: uid(),
          tipo: 'cambio_estado',
          descripcion: 'Estado cambiado a En seguimiento.',
          fecha: now,
          estadoAnterior: 'Abierto',
          estadoNuevo: 'En seguimiento',
        };

        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, estado: 'En seguimiento', historial: [...e.historial, entrada] }
              : e
          ),
        }));
      },

      cerrarExpediente: (expedienteId, motivoCierre) => {
        const exp = get().expedientes.find((e) => e.id === expedienteId);
        if (!exp) return { ok: false, error: 'Expediente no encontrado.' };
        if (exp.estado !== 'En seguimiento')
          return { ok: false, error: 'Solo se pueden cerrar expedientes En seguimiento.' };

        const tieneActividades = exp.historial.some((h) => h.tipo === 'actividad');
        if (!tieneActividades)
          return { ok: false, error: 'Debe existir al menos una actividad registrada antes de cerrar.' };

        const now = new Date().toISOString();
        const entrada: EntradaHistorial = {
          id: uid(),
          tipo: 'cierre',
          descripcion: `Expediente cerrado. Motivo: ${motivoCierre.trim()}`,
          fecha: now,
          estadoAnterior: 'En seguimiento',
          estadoNuevo: 'Cerrado',
          motivoCierre: motivoCierre.trim(),
        };

        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, estado: 'Cerrado', historial: [...e.historial, entrada] }
              : e
          ),
        }));

        return { ok: true };
      },

      // ── NUEVO: Parte 2 ──
      reabrirExpediente: (expedienteId, motivoReapertura) => {
        const exp = get().expedientes.find((e) => e.id === expedienteId);
        if (!exp) return { ok: false, error: 'Expediente no encontrado.' };
        if (exp.estado !== 'Cerrado')
          return { ok: false, error: 'Solo se pueden reabrir expedientes en estado Cerrado.' };

        const now = new Date().toISOString();
        const entrada: EntradaHistorial = {
          id: uid(),
          tipo: 'reapertura',
          descripcion: `Expediente reabierto para continuar seguimiento. Motivo: ${motivoReapertura.trim()}`,
          fecha: now,
          estadoAnterior: 'Cerrado',
          estadoNuevo: 'En seguimiento',
          motivoReapertura: motivoReapertura.trim(),
        };

        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, estado: 'En seguimiento', historial: [...e.historial, entrada] }
              : e
          ),
        }));

        return { ok: true };
      },
    }),
    { name: 'bufete-expedientes-v1' }
  )
);