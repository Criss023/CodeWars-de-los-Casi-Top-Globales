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
- **Expediente:** ID único auto-generado (`EXP-YYYYMMDD-NNN`), alias del solicitante, descripción del asunto, responsable, categoría opcional, estado, fecha de apertura, historial.
- **Historial:** secuencia cronológica de aperturas, actividades y cambios de estado.
- **Actividad:** descripción obligatoria, tipo opcional, fecha y hora automáticas.

### Reglas y supuestos
- Flujo de estados: Abierto → En seguimiento → Cerrado → En seguimiento (reapertura permitida).
- Cierre requiere al menos una actividad registrada **y** motivo de cierre no vacío.
- Expediente cerrado: no admite actividades ni cambios de estado mientras permanezca cerrado; puede reabrirse con motivo válido.
- Reapertura solo permitida desde estado Cerrado; rechazada si está Abierto o En seguimiento.
- Persistencia en localStorage mediante Zustand persist.
- Todos los datos son ficticios; la app no brinda asesoría jurídica real.
- Sin autenticación, archivos adjuntos, ni reportes exportables.

## 2. Responsabilidades del equipo

| Integrante | Área de trabajo |
|---|---|
| Cristian | Setup del proyecto, TypeScript types, Zustand store, estructura de rutas, componentes base (Layout, EstadoBadge) |
| Anibal | Listado de expedientes con búsqueda, formulario de apertura con validación Zod |
| Francisco | Vista de detalle, historial cronológico, registro de actividades, cambios de estado y cierre |
| Alejandro | UI/UX, página 404, reapertura de expedientes (Parte 2), README completo con decisiones IA y comprobaciones |

## 3. Stack tecnológico
- React 18 + Vite + TypeScript
- React Router v6 (enrutamiento SPA)
- Zustand 4 + persist middleware (estado global + localStorage)
- react-hook-form + Zod (formularios con validación)
- TailwindCSS v3 (estilos responsivos)

## 4. Cómo ejecutar

```bash
npm install
npm run dev
```
Abrir en el navegador: **http://localhost:5173**

> **Requisitos:** Node.js 18 o superior. No se necesita backend ni configuración adicional.

Los datos se conservan en `localStorage` del navegador bajo la clave `bufete-expedientes-v1`. Recargar la página no pierde los expedientes.

## 5. Decisiones y uso razonado de la IA

| Decisión o necesidad | Aporte de la IA | Decisión del equipo y razón | Cómo se comprobó |
|---|---|---|---|
| Diseño del modelo de datos: cómo estructurar el historial de cambios | La IA propuso un arreglo `historial` dentro del expediente con entradas tipadas (`apertura`, `actividad`, `cambio_estado`, `cierre`), discriminadas por el campo `tipo` | Aceptamos la estructura porque permite mostrar la cronología completa sin tabla separada y simplifica la persistencia en localStorage con Zustand | Se probó creando expedientes, agregando actividades y cerrándolos; el historial mostró las entradas en orden correcto con sus etiquetas |
| Manejo de la validación de campos con solo espacios | La IA sugirió usar `z.string().trim().min(1, '...')` en Zod para rechazar strings de solo espacios | Aceptamos la solución; es idiomática en Zod y el `trim()` transforma el valor antes de validar la longitud mínima | Se probó enviando campos con solo espacios en blanco: el formulario rechazó el envío y mostró el mensaje de error correcto |
| Parte 2 — Reapertura de expedientes cerrados | La IA propuso extender el tipo `TipoHistorial` con un nuevo valor `reapertura` y manejar la transición `Cerrado → En seguimiento` dentro del store existente, conservando intactas todas las entradas previas de cierre | Aceptamos la estrategia: agregamos `reabrirExpediente` al store con validación explícita en la lógica (`estado !== 'Cerrado'` retorna error descriptivo, sin depender solo de la interfaz) y registramos la reapertura como entrada tipada en el historial. Así se preservan todos los cierres anteriores sin modificarlos ni reemplazarlos | Se cerró un expediente, se intentó reabrir con motivo vacío (rechazado por Zod) y desde estado Abierto (rechazado por el store). Se reabrió válidamente desde Cerrado, se agregó una actividad y se volvió a cerrar. El historial mostró ambos cierres y la reapertura con fechas y motivos. Se recargó la app y todos los datos persistieron |

## 6. Comprobaciones

| Recorrido | Resultado observado | Estado |
|---|---|---|
| **1. Apertura:** Crear dos expedientes con identificadores distintos; rechazar campos obligatorios incompletos | Se crearon `EXP-20261031-001` y `EXP-20261031-002`. Al dejar campos vacíos o con solo espacios, el formulario mostró mensajes de error específicos y no permitió el envío | ✅ Cumple |
| **2. Consulta:** Localizar por identificador y persona, abrir detalle e historial, informar búsqueda sin resultados | Se localizaron expedientes por ID y por alias. Al buscar un texto inexistente se mostró el mensaje "No se encontraron expedientes para...". El detalle y el historial abren correctamente | ✅ Cumple |
| **3. Seguimiento y cierre:** Agregar actividades, pasar a En seguimiento y cerrar; rechazar cierres inválidos; bloquear actividades en cerrado | Se agregaron actividades y se cambió el estado. Al intentar cerrar sin actividades se mostró el aviso correspondiente. Al cerrar con motivo vacío, Zod rechazó el envío. El expediente cerrado quedó en solo lectura | ✅ Cumple |
| **Persistencia al recargar** | Se recargó el navegador después de crear expedientes y registrar actividades. Todos los datos se recuperaron de localStorage sin pérdida | ✅ Cumple |
| **4. Reapertura y trazabilidad:** Rechazar motivos vacíos y reaperturas en estados incorrectos; reabrir válidamente, agregar actividad y cerrar de nuevo; conservar actividades y ambos cierres con sus fechas y motivos, incluso después de recargar | Se intentó reabrir con motivo vacío (Zod lo rechazó con mensaje de error). Se intentó reabrir un expediente en estado Abierto (el store lo rechazó antes de modificar nada). Se reabrió correctamente un expediente Cerrado con motivo válido, quedando En seguimiento. Se agregó una nueva actividad y se cerró de nuevo. El historial mostró ambos cierres y la reapertura con sus respectivas fechas, motivos y etiquetas. Al recargar la app, toda la trazabilidad persistió sin pérdida | ✅ Cumple |

## 7. Expedientes ficticios de demostración

Los expedientes `EXP-20261031-001` y `EXP-20261031-002` se crearon durante las pruebas y están disponibles en la aplicación al ejecutarla.

## 8. Limitaciones conocidas
- Sin autenticación de usuarios.
- Sin archivos adjuntos.
- Sin reportes exportables.
- Datos almacenados solo en el navegador (localStorage); limpiar los datos del sitio borra los expedientes.
- Sin filtro por estado en el listado (solo búsqueda por ID y alias).