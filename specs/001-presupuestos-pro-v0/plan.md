# Implementation Plan: Presupuestos Pro v0

**Branch**: `001-presupuestos-pro-v0` | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-presupuestos-pro-v0/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Presupuestos Pro v0 permite a cualquier freelancer crear presupuestos con los cálculos de IVA (21 %) y retención de IRPF (15 % o 7 %) automáticos. Los presupuestos se numeran por año (AAAA-NNN), tienen 30 días de validez y se descargan en PDF para enviarlos por correo.

El enfoque técnico es una aplicación web estática hecha con HTML, CSS y JavaScript sin compilar. Se abre con doble clic en `index.html`, funciona sin internet y guarda todo en el `localStorage` del navegador. El PDF se genera con jsPDF, copiado dentro del proyecto. Los importes se calculan en céntimos enteros para que no haya diferencias de redondeo. Los detalles y las alternativas descartadas están en [research.md](research.md).

## Technical Context

**Language/Version**: HTML5, CSS3 y JavaScript ES2020 en scripts clásicos, sin módulos ES porque no funcionan con `file://` (R2)

**Primary Dependencies**: jsPDF 2.5.2 y jspdf-autotable 3.8.4, descargados una sola vez durante el desarrollo y copiados en `vendor/` (R4). No hay ninguna otra dependencia.

**Storage**: `localStorage` del navegador, con una clave `presupuestospro.v1` y un documento JSON (R3, [contracts/almacenamiento.md](contracts/almacenamiento.md))

**Testing**: página `pruebas.html` con un mini ejecutor de pruebas propio, que se abre en el navegador sin instalar nada (R9), más la validación manual de [quickstart.md](quickstart.md)

**Target Platform**: Google Chrome y Microsoft Edge actuales en Windows, abriendo el archivo local con `file://`

**Project Type**: aplicación web estática local de una sola página, sin backend

**Performance Goals**: los totales se recalculan sin retraso perceptible al escribir, y el PDF se genera en menos de 2 segundos. El objetivo de negocio es SC-001: un presupuesto completo en menos de 2 minutos.

**Constraints**: sin conexión a internet en tiempo de ejecución (FR-032), sin instalación, todo en español de España con formato `1.234,56 €` (FR-033), logo de 500 KB como máximo y datos dentro de los 5 MB de `localStorage`

**Scale/Scope**: una usuaria y un ordenador, del orden de cientos de presupuestos al año, cinco pantallas y 40 requisitos funcionales

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Verificación | Estado |
|-----------|--------------|--------|
| I. Simplicidad ante todo | No hay framework, ni compilación, ni servidor. Hay archivos JS planos y una sola dependencia externa, jsPDF, justificada en Complexity Tracking. Todo el estado es un único documento JSON. | ✅ Pasa |
| II. Español de España y euro | Hay un formateador propio para `1.234,56 €` y `dd/mm/aaaa` (R6), porque `Intl` no pone el punto de miles en cuatro cifras. Todos los textos de [pantallas](contracts/pantallas.md) y del [PDF](contracts/pdf.md) están en español. | ✅ Pasa |
| III. Cero alcance fantasma | Todo lo diseñado se traza a un FR o a un caso límite de la spec. Los comportamientos que surgieron en el diseño ya están escritos en la spec: el límite del logo (FR-003), el guardado previo al PDF (FR-027a), los avisos de datos dañados o sin espacio (FR-031a) y las longitudes máximas (FR-034). La petición de almacenamiento persistente no es visible para la usuaria y solo protege FR-031. | ✅ Pasa |
| IV. Verificable por una persona no técnica | [quickstart.md](quickstart.md) recorre cada criterio usando solo la aplicación, y `pruebas.html` muestra los cálculos en verde o rojo sin leer código. | ✅ Pasa |
| V. Respeto por los datos del usuario | Solo se piden los datos de la spec. No hay cuentas, claves ni secretos. Los datos nunca salen del ordenador. | ✅ Pasa |
| Restricciones del producto | Es una herramienta web para generar presupuestos en PDF. Coincide con la constitución. | ✅ Pasa |

**Revisión tras la fase 1**: el modelo de datos, los contratos y la guía de validación no introducen capas ni funcionalidades nuevas. El resultado sigue siendo ✅ en los cinco principios.

## Project Structure

### Documentation (this feature)

```text
specs/001-presupuestos-pro-v0/
├── plan.md              # Este archivo
├── research.md          # Fase 0: decisiones técnicas
├── data-model.md        # Fase 1: entidades y reglas
├── quickstart.md        # Fase 1: guía de validación
├── contracts/
│   ├── almacenamiento.md  # Formato del JSON guardado
│   ├── pantallas.md       # Pantallas, botones y mensajes
│   └── pdf.md             # Contenido y prohibiciones del PDF
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks, no creado aquí)
```

### Source Code (repository root)

```text
index.html               # La aplicación: menú y las cinco pantallas
pruebas.html             # Pruebas automáticas en el navegador
css/
└── estilos.css
js/
├── formato.js           # Importes «1.234,56 €», fechas dd/mm/aaaa, lectura de importes escritos
├── calculos.js          # Importe de línea, base, IVA, retención, total y validez (puro, sin DOM)
├── numeracion.js        # Contadores por año y asignación de AAAA-NNN (puro)
├── validacion.js        # Reglas de líneas, cliente, logo y requisitos para el PDF (puro)
├── almacen.js           # Lectura y escritura en localStorage, errores de datos y espacio
├── pdf.js               # Construcción del PDF con jsPDF según contracts/pdf.md
├── app.js               # Arranque: carga de datos, navegación entre pantallas y mensajes
└── ui/
    ├── presupuestos.js  # Pantalla de listado de presupuestos
    ├── editor.js        # Editor de presupuesto
    ├── clientes.js      # Pantalla de clientes guardados
    ├── catalogo.js      # Pantalla de catálogo
    └── mis-datos.js     # Pantalla de datos de la profesional
vendor/
├── jspdf.umd.min.js
└── jspdf.plugin.autotable.min.js
tests/
└── pruebas.js           # Casos de la spec sobre formato, calculos, numeracion y validacion
```

**Structure Decision**: proyecto único y estático en la raíz del repositorio.
- La lógica de negocio va en archivos puros, sin acceso a la pantalla ni al almacenamiento. Son `formato.js`, `calculos.js`, `numeracion.js` y `validacion.js`, y se prueban desde `pruebas.html`.
- `almacen.js`, `pdf.js`, `app.js` y los archivos de `js/ui/` hacen de capa fina sobre el navegador. Hay un archivo por pantalla para que cada historia de usuario toque archivos distintos.
- Cada archivo de `js/` expone un único objeto global, por ejemplo `window.Calculos`, y se carga en orden desde `index.html`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dependencia externa jsPDF y jspdf-autotable | FR-027 exige descargar un PDF, y SC-001 lo exige en menos de 2 minutos para una usuaria no técnica | `window.print()` obliga a elegir «Guardar como PDF» en el diálogo y a quitar los encabezados del navegador, que muestran la ruta del archivo. El riesgo de error es alto y el resultado no es uniforme. |
