import { z } from 'zod';

export const crearExpedienteSchema = z.object({
  alias: z.string().trim().min(1, 'El nombre o alias es obligatorio'),
  descripcion: z.string().trim().min(1, 'La descripción del asunto es obligatoria'),
  responsable: z.string().trim().min(1, 'El nombre del responsable es obligatorio'),
  categoria: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.enum(['civil', 'familiar', 'laboral']).optional()
  ),
});
export type CrearExpedienteFormData = z.infer<typeof crearExpedienteSchema>;

export const agregarActividadSchema = z.object({
  descripcion: z.string().trim().min(1, 'La descripción de la actividad es obligatoria'),
  tipo: z.string().optional(),
});
export type AgregarActividadFormData = z.infer<typeof agregarActividadSchema>;

export const cerrarExpedienteSchema = z.object({
  motivoCierre: z.string().trim().min(1, 'El motivo de cierre es obligatorio'),
});
export type CerrarExpedienteFormData = z.infer<typeof cerrarExpedienteSchema>;