export type EstadoExpediente = 'Abierto' | 'En seguimiento' | 'Cerrado';
export type CategoriaExpediente = 'civil' | 'familiar' | 'laboral';
export type TipoHistorial = 'apertura' | 'actividad' | 'cambio_estado' | 'cierre' | 'reapertura';

export interface EntradaHistorial {
  id: string;
  tipo: TipoHistorial;
  descripcion: string;
  fecha: string;
  estadoAnterior?: EstadoExpediente;
  estadoNuevo?: EstadoExpediente;
  motivoCierre?: string;
  motivoReapertura?: string;
}

export interface Expediente {
  id: string;
  alias: string;
  descripcion: string;
  responsable: string;
  categoria?: CategoriaExpediente;
  estado: EstadoExpediente;
  fechaApertura: string;
  historial: EntradaHistorial[];
}

export interface CrearExpedienteInput {
  alias: string;
  descripcion: string;
  responsable: string;
  categoria?: CategoriaExpediente;
}