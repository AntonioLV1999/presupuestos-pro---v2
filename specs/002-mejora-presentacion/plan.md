# Implementation Plan: Mejora de presentación — R2, dirección visual «Despacho»

**Branch**: `002-mejora-presentacion-rediseño` | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-mejora-presentacion/spec.md` (revisión R2)

**Origen de la revisión**: [pre-spec-despacho.md](pre-spec-despacho.md)

## Summary

R1 de esta spec ya entregó el inicio, la navegación común, el resumen de actividad, las etiquetas de vigencia y la plantilla de PDF. **R2 no añade funcionalidad**: sustituye la dirección visual por «Despacho» (papel cálido, tinta, un acento burdeos de uso restringido, separación por filetes en lugar de cajas) y corrige siete defectos concretos de legibilidad y jerarquía detectados sobre la interfaz en uso.

El trabajo se concentra en tres archivos ya existentes y en un reparto estricto de responsabilidades que el proyecto ya tiene montado: `js/tema.js` sigue siendo la **única** fuente de color (se revalúan sus 13 tokens y se añaden 3), `css/estilos.css` recibe la mayor parte del cambio (tipografía, densidad, filetes, estados) y `js/pdf.js` adopta el reparto de familias. Las pantallas de `js/ui/*.js` solo cambian en clases y rótulos; ninguna toca `App.cambiar` ni `Almacen.guardar`.

La decisión técnica que sostiene todo el rediseño es que **no se incorpora ni un byte nuevo**: las dos familias tipográficas de pantalla ya están instaladas en Windows, y las dos del PDF (`times` y `helvetica`) son familias núcleo de jsPDF. Esto mantiene intacto FR-022 (sin red, sin recursos externos) sin renunciar a la dirección.

## Technical Context

**Language/Version**: JavaScript ES2020 en scripts clásicos (sin módulos ES, sin compilación), HTML5, CSS3

**Primary Dependencies**: jsPDF 2.5.2 y jspdf-autotable 3.8.4, ya copiados en `vendor/`. **R2 no añade ninguna dependencia ni ningún archivo a `vendor/`**

**Storage**: `localStorage`, clave `presupuestospro.v1`, documento JSON único. **Sin cambios en R2**

**Testing**: `pruebas.html` (suite propia, casos en `tests/pruebas.js`) para la lógica pura; validación visual manual por [quickstart.md](quickstart.md)

**Target Platform**: Chrome y Edge actuales sobre Windows 10/11, abiertos con `file://` (doble clic en `index.html`), sin servidor y sin conexión

**Project Type**: Aplicación web local de una sola página, sin backend

**Performance Goals**: Pintado inmediato al cambiar de pantalla; el rediseño no introduce animaciones ni trabajo adicional en el pintado

**Constraints**:
- Sin red en ejecución: ninguna tipografía, icono ni hoja de estilo externa (FR-022)
- Sin archivos nuevos en `vendor/` y sin tipografías incrustadas en el PDF (FR-016)
- Mobile-first desde 320 px; controles de 44 px y texto de campo de 16 px como mínimo (FR-014)
- Contraste AA (≥ 4,5:1) en todo par texto/fondo
- Un único punto de definición para color y espaciado (FR-009, FR-010)

**Scale/Scope**: 6 pantallas (Inicio, Presupuestos, Editor, Clientes, Catálogo, Perfil) + 1 plantilla de PDF. 3 archivos con cambio sustancial, 6 pantallas con cambios menores de clases y rótulos

## Constitution Check

*GATE: debe pasar antes de la fase 0 y volver a comprobarse tras la fase 1.*

| Principio | Comprobación | Resultado |
|---|---|---|
| **I. Simplicidad ante todo** | ¿Se añade alguna capa, dependencia u opción? | **PASA.** Cero dependencias nuevas, cero archivos en `vendor/`, ningún sistema de temas ni modo oscuro. Se reutilizan los mecanismos existentes: tokens en `js/tema.js` y variables CSS. Se rechaza expresamente la librería de iconos y la fuente incrustada por ser la opción más compleja. |
| **II. Español de España y euro** | ¿Todo texto visible y todo importe siguen la norma? | **PASA.** R2 no introduce textos nuevos salvo los complementos de título de FR-026, redactados en español de España. El formateador propio de `1.234,56 €` no se toca; de hecho R2 lo refuerza alineando las cifras. |
| **III. Cero alcance fantasma** | ¿Se construye algo que no esté en la spec? | **PASA.** Buscador, filtros, ordenación, paginación, selección múltiple, iconos y modo oscuro están declarados fuera de alcance en la spec y no se implementan. Cada cambio del plan referencia un FR. |
| **IV. Verificable por una persona no técnica** | ¿Puede comprobarse cada criterio usando la app? | **PASA.** SC-001 a SC-016 se validan en [quickstart.md](quickstart.md) abriendo la aplicación y mirando un PDF impreso. Las comprobaciones técnicas (contrastes medidos, propiedades computadas) quedan como apoyo del implementador, no como criterio de éxito. |
| **V. Respeto por los datos del usuario** | ¿Se piden datos nuevos? ¿Hay secretos? | **PASA.** R2 no pide ningún dato nuevo, no escribe en `localStorage` y no introduce ninguna clave ni secreto. Es un cambio de presentación de solo lectura sobre el estado. |

**Veredicto inicial: PASA sin violaciones.** La sección *Complexity Tracking* queda vacía a propósito.

## Project Structure

### Documentation (this feature)

```text
specs/002-mejora-presentacion/
├── spec.md                  # Reescrita en R2
├── pre-spec-despacho.md     # Documento de entrada de R2
├── plan.md                  # Este archivo
├── research.md              # Fase 0 — decisiones técnicas de R2
├── data-model.md            # Fase 1 — sin cambios de datos; vista derivada del título
├── quickstart.md            # Fase 1 — validación manual de R2
├── contracts/
│   ├── tema.md              # Reescrito: paleta, tipografía, espaciado, filetes
│   ├── pantallas.md         # Reescrito: cabecera, títulos, densidad, estados
│   └── pdf.md               # Reescrito: familias por rol, tabla sin banda, total
├── checklists/
│   └── requirements.md      # Revalidado en R2
└── tasks.md                 # Fase 2 — lo genera /speckit-tasks
```

### Source Code (repository root)

```text
index.html                   # Cabecera y navegación; orden de carga de scripts sin cambios
pruebas.html                 # Misma hoja de estilos; sin cambios de lógica
css/
└── estilos.css              # CAMBIO MAYOR: tipografía, densidad, filetes, estados
js/
├── tema.js                  # CAMBIO: 13 tokens revaluados + 3 nuevos (única fuente de color)
├── pdf.js                   # CAMBIO: familias por rol, tabla sin banda, bloque de total
├── formato.js               # Sin cambios (lógica pura con pruebas)
├── calculos.js              # Sin cambios
├── numeracion.js            # Sin cambios
├── validacion.js            # Sin cambios
├── vigencia.js              # Sin cambios
├── almacen.js               # Sin cambios
├── zip.js                   # Sin cambios
├── exportacion.js           # Sin cambios
├── app.js                   # Sin cambios salvo el bloque de título si se centraliza
└── ui/
    ├── inicio.js            # Título con contexto; agrupar el botón primario (FR-006a, FR-026)
    ├── presupuestos.js      # Título con recuento; clases de fila y acciones (FR-026, FR-029)
    ├── editor.js            # Bloque de total destacado (FR-011)
    ├── clientes.js          # Título con recuento
    ├── catalogo.js          # Título con recuento
    └── mis-datos.js         # Título con complemento
vendor/                      # INTACTO: ningún archivo nuevo
tests/pruebas.js             # Sin cambios: R2 no toca lógica
```

**Structure Decision**: se mantiene íntegra la estructura del proyecto. R2 es un cambio de presentación sobre archivos existentes; no se crean carpetas, archivos ni globales nuevos. El reparto que ya impone el proyecto —lógica pura con pruebas en `formato/calculos/numeracion/validacion/vigencia`, capa fina en `almacen/pdf/app/ui`, un archivo por pantalla, un único global por archivo— se respeta sin excepción. El orden de carga de scripts de `index.html` y `pruebas.html` no cambia.

## Fases de implementación

> El detalle por tarea lo genera `/speckit-tasks`. Aquí se fija el orden y los puntos de control.

### Fase A — Tokens (base de todo lo demás)

1. Revaluar los 13 colores de `js/tema.js` y añadir `borde-fuerte`, `superficie-alt` y `papel-hundido`, según [contracts/tema.md](contracts/tema.md).
2. Añadir en el `:root` de `css/estilos.css` los tokens tipográficos (`--fuente-titulo`, `--t-2xl`, `--lh-*`, `--letra-rotulo`, `--peso-medio`) y los de forma (`--e-6`, `--radio`, `--filete`, `--filete-fuerte`).
3. **Control**: la aplicación sigue abriendo y ninguna pantalla pierde contraste de forma evidente. `grep` de colores literales en `css/estilos.css` y `js/pdf.js` sigue vacío (FR-009).

### Fase B — Tipografía y jerarquía (FR-008, FR-011, FR-024)

4. Aplicar `--fuente-titulo` a marca, `h2`, `h3` y rótulos; mantener `--fuente` en el resto.
5. Aplicar cifras de ancho constante a toda celda y todo elemento numérico: importes, fechas, cantidades e identificadores.
6. Subir el `h2` a `--t-xl` (30 px) y componer el total del editor con `--t-2xl` sobre `superficie-alt` con filete de refuerzo.
7. **Control**: en el listado, las comas decimales quedan en la misma vertical (SC-011).

### Fase C — Cabecera, navegación y títulos (FR-023, FR-025, FR-026)

8. Pasar la cabecera a papel con filete inferior; retirar el fondo de acento.
9. Dejar un único signo de sección actual: filete inferior de acento y peso medio; retirar el fondo `acento-oscuro`.
10. Añadir el complemento de contexto al título de cada pantalla, según [contracts/pantallas.md](contracts/pantallas.md).
11. Ajustar el foco visible sobre fondo claro (FR-012a).
12. **Control**: SC-012 — alguien señala en menos de 3 segundos en qué sección está.

### Fase D — Listados, estados y densidad (FR-027, FR-028, FR-029, FR-030)

13. Pasar las celdas a alineación vertical centrada y bajar el relleno vertical para que la fila quede en 52 px en escritorio, manteniendo los 44 px de los botones.
14. Rediseñar `.estado` para que no se lea como botón: forma, altura y borde distintos.
15. Añadir resalte de fila al pasar el puntero, solo donde hay puntero.
16. Separar la acción destructiva al final del grupo de acciones.
17. Sustituir las cajas con contorno (`.cifra`, `.acceso`, `.formulario.recuadro`, `.totales`) por separación con filetes y espacio; agrupar el botón «Nuevo presupuesto» en el inicio.
18. **Control**: SC-013, SC-014 y SC-016.

### Fase E — PDF (FR-016)

19. Aplicar el reparto de familias de [contracts/pdf.md](contracts/pdf.md): `times` en titulares y rótulos, `helvetica` en datos e importes.
20. Retirar la banda de acento del encabezado de la tabla de líneas y componerlo sobre `superficie-alt` con filete.
21. Rehacer el bloque de total con filete de refuerzo y `times` en negrita.
22. **Control**: SC-015 y comprobación de `€`, acentos, eñes y `º`.

### Fase F — Verificación y cierre

23. Ejecutar `pruebas.html`: debe seguir diciendo «Todas las pruebas superadas» en verde.
24. Recorrer [quickstart.md](quickstart.md) completo, incluidos 320 px, impresión en blanco y negro y el `.zip` de la spec 003.
25. Medir con una herramienta de contraste los pares listados en [contracts/tema.md](contracts/tema.md) y confirmar que todos llegan a 4,5:1.
26. Actualizar la fila de la 002 en [`specs/README.md`](../README.md) al pasar a Publicada.
27. **Mantenimiento (último paso):** actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, **una línea por decisión**, con referencia a la spec (p. ej. «[002-R2] …»). Incluir solo lo que sea transversal y aprovechable por futuras features —reparto de papeles entre las dos familias tipográficas, regla de que ningún número va en serif, restricción de uso del acento y regla de que el error nunca rellena un botón, y el hecho de que el PDF se compone con familias núcleo de jsPDF sin incrustar nada—, y **no** añadir entradas por añadir.

## Complexity Tracking

> Sin violaciones de la constitución que justificar. Sección intencionadamente vacía.

## Re-evaluación de la Constitution Check tras la fase 1

Revisados los artefactos de diseño generados (`research.md`, `data-model.md`, `contracts/*`, `quickstart.md`):

- **I. Simplicidad**: el diseño no introduce ningún mecanismo nuevo. Las tres decisiones que podrían haber añadido complejidad —librería de iconos, fuente incrustada en el PDF y sistema de temas— se han rechazado explícitamente en `research.md` con su alternativa documentada. **PASA.**
- **II. Español y euro**: los complementos de título del contrato de pantallas están redactados en español de España; el formato de importe no se toca. **PASA.**
- **III. Cero alcance fantasma**: cada apartado de los contratos referencia el FR que lo exige; no hay ningún elemento de diseño sin requisito detrás. **PASA.**
- **IV. Verificable por una persona no técnica**: `quickstart.md` valida los 16 criterios sin leer código. **PASA.**
- **V. Respeto por los datos**: `data-model.md` confirma que no cambia ninguna entidad, ningún campo y ninguna escritura. **PASA.**

**Veredicto final: PASA.** El plan queda listo para `/speckit-tasks`.
