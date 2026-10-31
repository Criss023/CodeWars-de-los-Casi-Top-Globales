# Bufete Popular — Sistema de Expedientes
## AI Code Wars | Tech Day UMG Boot Camp | Quinta Edición | 31 oct 2026

## 1. Ficha de análisis

### Problema
El Bufete Popular necesita un sistema para organizar expedientes de asistencia jurídica gratuita: abrir casos, registrar actividades y consultar su estado e historial.

### Usuario principal
Asesores jurídicos y personal administrativo del Bufete Popular.

### Prioridades
1. Apertura rápida de expedientes con validación estricta de campos obligatorios.
2. Búsqueda y consulta eficiente por identificador o alias.
3. Registro cronológico de actividades y cambios de estado.
4. Persistencia de datos sin necesidad de backend (localStorage).

### Datos principales
- **Expediente:** ID único auto-generado, alias del solicitante, descripción del asunto, responsable, categoría opcional, estado, fecha de apertura, historial.
- **Historial:** secuencia cronológica de aperturas, actividades y cambios de estado.
- **Actividad:** descripción obligatoria, tipo opcional, fecha y hora automáticas.

### Reglas y supuestos
- Flujo de estados unidireccional: Abierto → En seguimiento → Cerrado.
- Cierre requiere al menos una actividad registrada y motivo de cierre no vacío.
- Expediente cerrado: solo lectura; no admite actividades ni cambios de estado.
- Persistencia en localStorage mediante Zustand persist; no se requiere backend.
- Todos los datos son ficticios; la app no brinda asesoría jurídica real.
- Sin autenticación, archivos adjuntos ni reportes exportables.

## 2. Responsabilidades del equipo

| Integrante | Área de trabajo |
|---|---|
| Cristian | Setup del proyecto, TypeScript types, Zustand store, estructura de rutas, componentes base |
| Anibal | Listado de expedientes, búsqueda, formulario de apertura con validación |
| Francisco | Vista de detalle, historial cronológico, registro de actividades, cambios de estado y cierre |
| Alejandro | UI/UX con Tailwind, mensajes de confirmación/error, README completo con decisiones IA y comprobaciones |

## 3. Stack tecnológico
- React 18 + Vite + TypeScript
- React Router v6 (enrutamiento SPA)
- Zustand + persist middleware (estado global + localStorage)
- react-hook-form + Zod (formularios con validación)
- TailwindCSS (estilos responsivos)

## 4. Cómo ejecutar

```bash
npm install
npm run dev
```
Abrir en el navegador: http://localhost:5173

> Requisitos: Node.js 18 o superior.

## 5. Decisiones y uso razonado de la IA

| Decisión o necesidad | Aporte de la IA | Decisión del equipo y razón | Cómo se comprobó |
|---|---|---|---|
| *(Por completar — Alejandro)* | | | |
| | | | |
| | | | |

## 6. Comprobaciones

| Recorrido | Resultado observado | Estado |
|---|---|---|
| 1. Apertura | *(Por completar — Alejandro)* | |
| 2. Consulta | | |
| 3. Seguimiento y cierre | | |
| Persistencia al recargar | | |

## 7. Limitaciones conocidas
- Sin autenticación de usuarios.
- Sin archivos adjuntos.
- Sin reportes exportables.
- Datos almacenados solo en el navegador (localStorage); limpiar los datos del navegador borra los expedientes.