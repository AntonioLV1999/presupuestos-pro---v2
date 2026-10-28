# Implementation Plan: Mejora de presentación de PresupuestosPro

**Branch**: `002-mejora-presentacion` (sin repositorio git; solo carpeta de spec) | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-mejora-presentacion/spec.md`. Indicación adicional: esta feature solo cambia la capa de presentación de una aplicación ya implementada.

## Summary

Se añade una pantalla de inicio con resumen de actividad, se amplía el menú existente con «Inicio» y se renombra «Mis datos» a «Perfil». Se reescribe la hoja de estilos con enfoque mobile-first y se unifica la paleta en un único archivo de tema que usan tanto la hoja de estilos como el PDF. Los presupuestos muestran una etiqueta «Vigente» o «Caducado» calculada al mostrarlos.

No se toca el modelo de datos, ni `localStorage`, ni los módulos de cálculo, numeración, almacén y formato. Detalles y alternativas descartadas en [research.md](research.md).

## Technical Context

**Language/Version**: HTML5, CSS3 y JavaScript ES2020 en scripts clásicos, igual que la spec 001 (sin módulos, por `file://`)

**Primary Dependencies**: las mismas (jsPDF 2.5.2 y jspdf-autotable 3.8.4 en `vendor/`). No se añade ninguna, ni fuentes web.

**Storage**: sin cambios. Mismo documento `presupuestospro.v1`; no hay migración ([data-model.md](data-model.md))

**Testing**: `pruebas.html` (se añaden casos de vigencia y recuento) más la validación manual de [quickstart.md](quickstart.md)

**Target Platform**: Chrome y Edge actuales, `file://`. Anchos desde 320 px hasta escritorio.

**Project Type**: aplicación web estática local de una sola página, sin backend

**Performance Goals**: sin cambios perceptibles; el inicio se pinta al instante con cientos de presupuestos y el PDF sigue tardando menos de 2 segundos

**Constraints**: sin conexión, sin recursos externos (fuentes incluidas), textos en español de España, sin desplazamiento horizontal de la página a 320 px

**Scale/Scope**: seis pantallas (las cinco existentes más el inicio), un archivo de tema, una hoja de estilos y una plantilla de PDF

## Constitution Check

| Principio | Verificación | Estado |
|-----------|--------------|--------|
| I. Simplicidad ante todo | Sin frameworks ni preprocesadores. Un archivo de tema (`tema.js`) como única fuente de la paleta, porque la necesitan a la vez CSS y PDF. Un módulo puro pequeño (`vigencia.js`). El inicio es una pantalla más de las existentes. | ✅ Pasa |
| II. Español de España y euro | Los textos nuevos están en [pantallas.md](contracts/pantallas.md), en español de España. Importes con el formateador existente. | ✅ Pasa |
| III. Cero alcance fantasma | Cada elemento se traza a un FR de la spec. Sin modo oscuro, sin estados guardados, sin gráficos. | ✅ Pasa |
| IV. Verificable por persona no técnica | [quickstart.md](quickstart.md) se recorre solo con la aplicación, el PDF y las pruebas en verde/rojo. | ✅ Pasa |
| V. Respeto por los datos | No se pide ni guarda ningún dato nuevo. Sin claves ni servicios externos. | ✅ Pasa |

**Revisión tras la fase 1**: el diseño no añade dependencias ni datos. ✅ en los cinco principios.

## Project Structure

### Documentation (this feature)

```text
specs/002-mejora-presentacion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── pantallas.md   # Inicio, menú, etiquetas y textos
│   ├── tema.md        # Paleta, tipografía y espaciado
│   └── pdf.md         # Cambios de aspecto del PDF (contenido sin cambios)
├── checklists/
│   ├── requirements.md
│   └── ux.md
└── tasks.md           # Fase 2 (/speckit-tasks, no creado aquí)
```

### Source Code (repository root)

```text
index.html               # MODIFICA: menú con Inicio y Perfil, sección del inicio, carga de tema.js y vigencia.js
pruebas.html             # MODIFICA: carga vigencia.js
css/
└── estilos.css          # REESCRIBE: mobile-first, solo var(--…), sin colores literales
js/
├── tema.js              # NUEVO: única definición de la paleta; la vuelca como variables CSS y la ofrece al PDF
├── vigencia.js          # NUEVO: estado Vigente/Caducado y recuento (puro, sin DOM)
├── pdf.js               # MODIFICA: solo estilos (colores del tema, jerarquía, tabla, totales)
├── app.js               # MODIFICA: pantalla inicial = inicio; aria-current en el menú
├── validacion.js        # MODIFICA: solo el texto «Mis datos» → «Perfil» en un aviso
└── ui/
    ├── inicio.js        # NUEVO: pantalla de inicio
    ├── presupuestos.js  # MODIFICA: etiqueta de estado y data-label en celdas
    ├── editor.js        # MODIFICA: solo clases/estructura de presentación (líneas, totales)
    ├── clientes.js      # MODIFICA: data-label en celdas
    ├── catalogo.js      # MODIFICA: data-label en celdas
    └── mis-datos.js     # MODIFICA: título «Perfil»
tests/pruebas.js         # MODIFICA: casos de vigencia y aviso renombrado
LEEME.md                 # MODIFICA: «Mis datos» → «Perfil»
```

**Structure Decision**: se mantiene la estructura de la spec 001. Los identificadores internos (`mis-datos`, `data-ir`, nombres de archivo y claves del JSON) NO se renombran; solo cambia el texto visible. Cálculos, numeración, formato y almacén no se tocan.

## Complexity Tracking

Sin violaciones que justificar.
