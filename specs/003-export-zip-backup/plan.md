# Implementation Plan: Exportar todos los presupuestos en un .zip

**Branch**: `003-export-zip-backup` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-export-zip-backup/spec.md`

## Summary

Se añade a la lista de presupuestos un botón «Exportar todo (.zip)». Al pulsarlo se genera, para cada presupuesto, el mismo PDF que ya produce `Pdf.construir`, se añade un archivo de datos con todo el documento guardado y se empaqueta en un único .zip que se descarga. Como no hay librería de ZIP en el proyecto, se escribe un empaquetador mínimo propio (sin compresión, nombres UTF-8) en lugar de añadir una dependencia. La generación cede el control al navegador entre PDF para mostrar el progreso. Es solo lectura: no cambia el modelo de datos ni escribe nada.

Decisiones, alternativas y justificación en [research.md](research.md).

## Technical Context

**Language/Version**: HTML5, CSS3 y JavaScript ES2020 en scripts clásicos (sin módulos, por `file://`). Se usa `async/await`, ya parte de ES2020.

**Primary Dependencies**: las mismas (jsPDF 2.5.2 y jspdf-autotable 3.8.4 en `vendor/`). **No se añade ninguna.**

**Storage**: sin cambios. La exportación solo lee `App.estado`; no hay migración ([data-model.md](data-model.md)).

**Testing**: `pruebas.html` (casos nuevos de `Zip` y `Exportacion`) más la validación manual de [quickstart.md](quickstart.md). La coincidencia visual de los PDF y el progreso se validan a mano, porque `pruebas.html` no carga jsPDF.

**Target Platform**: Chrome y Edge actuales en Windows, `file://`.

**Project Type**: aplicación web estática local de una sola página, sin backend.

**Performance Goals**: 3 presupuestos en menos de 2 s; 200 presupuestos terminan sin congelar la pantalla, con progreso visible tras cada PDF.

**Constraints**: sin conexión ni recursos externos; textos en español de España; el .zip debe abrirse con doble clic en el Explorador de Windows (CRC-32 y UTF-8 correctos); no modifica datos.

**Scale/Scope**: una pantalla modificada, dos módulos nuevos, un botón.

## Constitution Check

| Principio | Verificación | Estado |
|-----------|--------------|--------|
| I. Simplicidad ante todo | Sin librería nueva ni Web Workers. ZIP «almacenado» de ~60 líneas en lugar de JSZip o compresión (justificado en [R1](research.md)). Un solo archivo de datos con el estado tal cual. | ✅ Pasa |
| II. Español de España y euro | Textos del botón, avisos y progreso fijados en [pantallas.md](contracts/pantallas.md). Los importes los pinta el PDF existente con el formateador propio. | ✅ Pasa |
| III. Cero alcance fantasma | Cada elemento se traza a un FR de la spec. Sin importar, sin CSV, sin copias automáticas, sin selección de presupuestos. | ✅ Pasa |
| IV. Verificable por persona no técnica | [quickstart.md](quickstart.md) se recorre con la aplicación, el Explorador de Windows y un lector de PDF; solo el paso 1 usa `pruebas.html` (verde o rojo). | ✅ Pasa |
| V. Respeto por los datos | No se piden datos nuevos ni se envía nada fuera del ordenador; el archivo se guarda donde el usuario decida. Sin claves ni servicios externos. | ✅ Pasa |

**Revisión tras la fase 1**: el diseño no añade dependencias, datos guardados ni escrituras. ✅ en los cinco principios.

## Project Structure

### Documentation (this feature)

```text
specs/003-export-zip-backup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── copia-zip.md   # Contenido del .zip, formato ZIP, archivo de datos y funciones puras
│   └── pantallas.md   # Botón, estados y textos
├── checklists/
│   └── requirements.md
└── tasks.md           # Fase 2 (/speckit-tasks, no creado aquí)
```

### Source Code (repository root)

```text
index.html               # MODIFICA: carga zip.js y exportacion.js (antes de ui/presupuestos.js)
pruebas.html             # MODIFICA: carga zip.js y exportacion.js
css/
└── estilos.css          # MODIFICA: solo si hace falta (estilo del texto de progreso y botón secundario), con var(--…)
js/
├── zip.js               # NUEVO: escritor ZIP puro (CRC-32, cabeceras, directorio central); global Zip
├── exportacion.js       # NUEVO: lógica pura (nombre del zip, nombres seguros y únicos, JSON de datos); global Exportacion
└── ui/
    └── presupuestos.js  # MODIFICA: botón, bucle async con progreso, descarga y mensajes
tests/pruebas.js         # MODIFICA: casos de Zip y Exportacion
vendor/VERSIONES.md      # SIN CAMBIOS (no hay librería nueva)
```

`pdf.js`, `almacen.js`, `calculos.js`, `formato.js`, `numeracion.js`, `validacion.js` y `app.js` **no se tocan**.

**Structure Decision**: se mantiene la estructura de las specs 001 y 002. Lógica pura sin DOM en `zip.js` y `exportacion.js` (con pruebas); capa fina en `ui/presupuestos.js`. Cada archivo expone un único global y se carga en orden desde `index.html` y `pruebas.html`.

## Fases de implementación

1. **Núcleo puro y pruebas**: `zip.js` (CRC-32 y `crear`) y `exportacion.js` (`nombreZip`, `nombreSeguro`, `nombresPdf`, `datosCopia`), con sus casos en `tests/pruebas.js` y la carga en `pruebas.html`. Debe quedar en verde antes de seguir.
2. **Pantalla**: botón en `ui/presupuestos.js`; flujo sin presupuestos; bucle `async` con progreso y botón deshabilitado; construcción del .zip con `Pdf.construir` + `doc.output('arraybuffer')`; descarga con `Blob`; mensajes de éxito y error; carga de los scripts en `index.html`; ajustes de estilo mínimos.
3. **Verificación y cierre**:
   1. Recorrer [quickstart.md](quickstart.md) completo (incluido 50+ presupuestos y el cliente «Diseño/Web S.L.»).
   2. Actualizar `LEEME.md` con una nota breve para la usuaria (qué hace el botón y que guarde el .zip fuera del navegador).
   3. **Mantenimiento**: Actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. ‘[003] ...’). No incluyas entradas por incluir, asegúrate siempre de que es información transversal y relevante para el proyecto que pueden aprovechar futuras features.

## Complexity Tracking

Sin violaciones que justificar.
