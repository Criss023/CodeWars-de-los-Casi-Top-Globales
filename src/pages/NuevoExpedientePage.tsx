import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { crearExpedienteSchema, type CrearExpedienteFormData } from '../schemas/expedienteSchema';
import { useExpedientesStore } from '../store/expedientesStore';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">⚠ {message}</p>;
}

export function NuevoExpedientePage() {
  const navigate = useNavigate();
  const crearExpediente = useExpedientesStore((state) => state.crearExpediente);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CrearExpedienteFormData>({
    resolver: zodResolver(crearExpedienteSchema),
  });

  const onSubmit = (data: CrearExpedienteFormData) => {
    const nuevo = crearExpediente({
      alias: data.alias,
      descripcion: data.descripcion,
      responsable: data.responsable,
      categoria: data.categoria,
    });
    navigate(`/expedientes/${nuevo.id}`);
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-red-400 focus:ring-red-300 bg-red-50'
        : 'border-gray-300 focus:ring-blue-500 bg-white'
    }`;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/expedientes')}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Volver a expedientes
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Abrir nuevo expediente</h2>
        <p className="text-sm text-gray-500 mt-1">
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm"
      >
        {/* Alias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre ficticio o alias del solicitante <span className="text-red-500">*</span>
          </label>
          <input
            {...register('alias')}
            className={inputClass(!!errors.alias)}
            placeholder="Ej: María G., Cliente 01"
          />
          <FieldError message={errors.alias?.message} />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción breve del asunto <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            className={`${inputClass(!!errors.descripcion)} resize-none`}
            placeholder="Describa brevemente el asunto jurídico a tratar..."
          />
          <FieldError message={errors.descripcion?.message} />
        </div>

        {/* Responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsable <span className="text-red-500">*</span>
          </label>
          <input
            {...register('responsable')}
            className={inputClass(!!errors.responsable)}
            placeholder="Nombre del asesor o responsable asignado"
          />
          <FieldError message={errors.responsable?.message} />
        </div>

        {/* Categoría (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría{' '}
            <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </label>
          <select
            {...register('categoria')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Sin categoría —</option>
            <option value="civil">Civil</option>
            <option value="familiar">Familiar</option>
            <option value="laboral">Laboral</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60 shadow-sm"
          >
            {isSubmitting ? 'Creando...' : 'Abrir expediente'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/expedientes')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        El identificador, fecha/hora de apertura y estado inicial se generan automáticamente.
      </p>
    </div>
  );
}