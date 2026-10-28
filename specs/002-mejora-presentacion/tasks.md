---

description: "Lista de tareas de la mejora de presentación de PresupuestosPro"
---

# Tasks: Mejora de presentación de PresupuestosPro

**Input**: Documentos de diseño en `specs/002-mejora-presentacion/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Solo se añaden pruebas para la lógica nueva y pura (vigencia y recuento), dentro de `tests/pruebas.js` (plan.md, Testing). Lo visual se valida con [quickstart.md](quickstart.md). El resto de pruebas existentes NO se modifica salvo el texto renombrado.

**Organization**: Tareas agrupadas por historia de usuario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de usuario a la que pertenece (US1 a US5)

## Reglas transversales (aplican a todas las tareas)

- NO cambiar `js/calculos.js`, `js/numeracion.js`, `js/formato.js`, `js/almacen.js` ni la forma del JSON guardado (FR-019, FR-020).
- NO renombrar identificadores internos (`mis-datos`, `data-ir`, claves del JSON); solo cambia el texto visible.
- Ningún color literal fuera de `js/tema.js`; en `css/estilos.css` y `js/pdf.js` solo se usan `var(--…)` o `Tema` (FR-009).
- Todos los textos en español de España.

---

## Phase 1: Setup

**Purpose**: dejar una línea base comprobable antes de tocar nada.

- [X] T001 Abrir `pruebas.html` y anotar que todas las pruebas están en verde antes de empezar; copiar el proyecto completo fuera de la carpeta como referencia (no se versiona; no hay git).

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: tema único y módulo de vigencia, usados por varias historias.

- [X] T002 [P] Crear `js/tema.js` con el objeto `Tema` y la paleta de [contracts/tema.md](contracts/tema.md) (`texto`, `suave`, `borde`, `fondo`, `superficie`, `acento`, `acento-oscuro`, `exito`, `exito-fondo`, `aviso`, `aviso-fondo`, `error`, `error-fondo`); al cargarse debe escribir cada color como variable CSS `--<nombre>` en `document.documentElement`, y exponer `Tema.rgb(nombre)` que devuelve `[r, g, b]` para jsPDF.
- [X] T003 [P] Crear `js/vigencia.js` con `Vigencia.estado(presupuesto, hoy)` (devuelve `'caducado'` si `Calculos.fechaValidez(presupuesto.fechaEmision)` es anterior a `hoy`, comparando cadenas AAAA-MM-DD; `'vigente'` en caso contrario, incluido el último día de validez) y `Vigencia.resumen(estado, hoy)` que devuelve `{ total, vigentes, caducados, clientes, servicios }` a partir de `estado.presupuestos`, `estado.clientes` y `estado.catalogo`. Función pura, sin DOM, sin modificar `estado`.
- [X] T004 Añadir en `tests/pruebas.js` los casos de vigencia: emisión 2026-10-23 con hoy 2026-11-22 → `vigente`; con hoy 2026-11-23 → `caducado`; `resumen` con 0 presupuestos devuelve todo a 0; `vigentes + caducados === total`. Cargar `js/vigencia.js` en `pruebas.html` (después de `calculos.js`).
- [X] T005 Reescribir `css/estilos.css` como base mobile-first: bloque `:root` con tamaños `--t-xs/s/m/l/xl` (12/14/16/20/26 px) y espaciado `--e-1…--e-5` (4/8/16/24/32 px) de [contracts/tema.md](contracts/tema.md); estilos base de `body`, `h1–h3`, `main`, botones (principal, secundario, `.peligro`, `.pequeno`, desactivado, foco visible), campos de formulario (≥16 px), `.mensaje.exito/.error`, `.error-campo`, `.vacio`, `.acciones`, `.formulario`; puntos de corte 640 px y 960 px; contenido centrado con máximo 1100 px. Solo `var(--…)`, sin colores literales.
- [X] T006 Modificar `index.html`: cargar `js/tema.js` en `<head>` antes de la hoja de estilos, y cargar `js/vigencia.js` antes de los scripts de `js/ui/`.

**Checkpoint**: `pruebas.html` en verde (incluidos los casos nuevos) y la aplicación sigue abriéndose con el nuevo CSS base.

---

## Phase 3: User Story 1 - Pantalla de inicio y navegación común (Priority: P1) 🎯 MVP

**Goal**: inicio como pantalla de arranque con accesos a las cuatro secciones, y menú común con Inicio y Perfil visible en todas las pantallas.

**Independent Test**: [quickstart.md](quickstart.md), apartado 2.

- [X] T007 [US1] Modificar `index.html`: en `<nav>` añadir como primer botón `data-ir="inicio"` con el texto «Inicio» y cambiar el texto del botón `data-ir="mis-datos"` a «Perfil» (sin cambiar su `data-ir`); añadir `<section id="pantalla-inicio" hidden></section>` dentro de `<main>` y el script `js/ui/inicio.js` antes de `js/app.js`.
- [X] T008 [P] [US1] Crear `js/ui/inicio.js`: registrar `window.Pantallas.inicio` con `mostrar(seccion)` que dibuje, según [contracts/pantallas.md](contracts/pantallas.md): título «Inicio»; cuatro tarjetas de acceso («Presupuestos», «Clientes», «Catálogo», «Perfil», con las frases del contrato) que llamen a `App.ir('presupuestos' | 'clientes' | 'catalogo' | 'mis-datos')`; y el botón principal «Nuevo presupuesto» que llama a `App.ir('editor')`. Textos en español de España.
- [X] T009 [US1] Modificar `js/app.js`: la pantalla de arranque pasa de `ir('presupuestos')` a `ir('inicio')`; en `ir()`, poner `aria-current="page"` en el botón activo del menú y quitarlo de los demás (el editor sigue marcando «Presupuestos»). No cambiar `cambiar`, `mensaje` ni el resto de la lógica.
- [X] T010 [US1] En `js/ui/mis-datos.js` cambiar el título visible `Mis datos` por `Perfil`; en `js/validacion.js` cambiar solo la cadena del aviso `faltanDatos` para que diga «…en «Perfil»…»; en `tests/pruebas.js` actualizar el texto esperado de ese aviso; en `LEEME.md` sustituir «Mis datos» por «Perfil».
- [X] T011 [US1] En `css/estilos.css` dar estilo al `<header>`/`<nav>`: cabecera `position: sticky; top: 0` en `acento`; cinco entradas con alto táctil ≥ 44 px que se reparten en filas (`flex-wrap`) a 320 px y en una sola fila desde 640 px; estado activo visible (fondo/subrayado) además de `[aria-current="page"]`; tarjetas de acceso del inicio en una columna en móvil y en rejilla desde 640 px.

**Checkpoint**: se puede entrar a las cuatro secciones desde el inicio y cambiar de sección desde cualquier pantalla sin «atrás».

---

## Phase 4: User Story 2 - Resumen de actividad (Priority: P2)

**Goal**: el inicio muestra las cinco cifras y el estado vacío.

**Independent Test**: [quickstart.md](quickstart.md), apartado 2 (pasos 4 y 5).

- [X] T012 [US2] Ampliar `js/ui/inicio.js`: llamar a `Vigencia.resumen(App.estado, Formato.hoy())` y mostrar cinco cifras con etiquetas «Presupuestos», «Vigentes», «Caducados», «Clientes» y «Servicios del catálogo» antes de las tarjetas de acceso; si `total === 0`, mostrar debajo el texto «Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.» Si los datos guardados son ilegibles (`App.estaBloqueado()`, spec 001 FR-031a), no mostrar cifras inventadas: el aviso de error ya lo pinta `App.ir`, así que mantenerlo visible.
- [X] T013 [US2] En `css/estilos.css` añadir el estilo de las cifras del resumen (tarjetas en rejilla de 2 columnas en móvil y 5 desde 960 px; número grande `--t-xl`, etiqueta `--t-s` en `suave`).

**Checkpoint**: las cifras del inicio coinciden con los listados y se actualizan al volver al inicio.

---

## Phase 5: User Story 3 - Rediseño visual coherente (Priority: P2)

**Goal**: todas las pantallas con el mismo tema, tablas apiladas en móvil y jerarquía clara en el editor.

**Independent Test**: [quickstart.md](quickstart.md), apartado 4.

- [X] T014 [P] [US3] En `js/ui/clientes.js` añadir `data-label` a cada `td` («Nombre», «NIF/CIF», «Email», «Tipo») sin cambiar su texto ni su comportamiento.
- [X] T015 [P] [US3] En `js/ui/catalogo.js` añadir `data-label` a cada `td` («Servicio», «Precio habitual») sin cambiar su texto ni su comportamiento.
- [X] T016 [P] [US3] En `js/ui/editor.js` añadir `data-label` a los `td` de la tabla de líneas («Concepto», «Cantidad», «Precio unitario (€)», «Importe») y las clases de presentación necesarias para el bloque de totales; no tocar ninguna lógica de cálculo, validación ni guardado.
- [X] T017 [US3] En `css/estilos.css` completar el rediseño: tablas apiladas como tarjetas por debajo de 640 px usando `td::before { content: attr(data-label) }` y tabla normal desde 640 px; formularios en una columna en móvil y dos desde 640 px; líneas del editor como tarjetas en móvil; bloque `.totales` a todo ancho en móvil y alineado a la derecha desde 640 px, con la fila TOTAL a `--t-xl`, negrita y sobre `fondo`; cabecera del presupuesto, `.provisional`, logo previo y lista de catálogo con el nuevo tema; mensajes de error con texto y borde (no solo color); `overflow-wrap: anywhere` en celdas, títulos y nombres para que los textos largos no rompan la maquetación; foco visible en todos los controles (FR-012a).
- [X] T018 [US3] Revisar `css/estilos.css` e `index.html` y `js/ui/*.js`: no debe quedar ningún color literal (`#…`, `rgb(…)`) ni valor de espaciado fuera de la escala; usar `grep` para comprobarlo.

**Checkpoint**: a 320 px ninguna pantalla desplaza la página en horizontal y el TOTAL es la cifra más grande del editor.

---

## Phase 6: User Story 4 - Etiquetas Vigente/Caducado (Priority: P3)

**Goal**: cada presupuesto del listado muestra su estado, distinguible sin color.

**Independent Test**: [quickstart.md](quickstart.md), apartado 3.

- [X] T019 [US4] En `js/ui/presupuestos.js` añadir la columna «Estado» (con `data-label` «Estado») que muestre una etiqueta `<span class="estado vigente|caducado">` con el texto «Vigente» o «Caducado» según `Vigencia.estado(p, Formato.hoy())`; añadir además `data-label` a las demás celdas («Número», «Cliente», «Fecha de emisión», «Total»). No cambiar orden, acciones ni confirmación de borrado.
- [X] T020 [US4] En `css/estilos.css` añadir los estilos `.estado.vigente` (texto `exito` sobre `exito-fondo`, borde continuo) y `.estado.caducado` (texto `aviso` sobre `aviso-fondo`, borde discontinuo), con contraste ≥ 4,5:1.

**Checkpoint**: un presupuesto reciente sale «Vigente» y uno de hace más de 30 días «Caducado».

---

## Phase 7: User Story 5 - PDF con la misma imagen (Priority: P2)

**Goal**: PDF con el estilo del tema, mismo contenido.

**Independent Test**: [quickstart.md](quickstart.md), apartado 5.

- [X] T021 [US5] Modificar `js/pdf.js` según [contracts/pdf.md](contracts/pdf.md): colores solo desde `Tema.rgb(…)` (`doc.setTextColor`, `setDrawColor`, `setFillColor`); línea de `acento` a todo el ancho bajo la cabecera; título «PRESUPUESTO» en `acento`; etiqueta «Cliente» en `suave`; tabla con cabecera de fondo `acento` y texto blanco, solo línea inferior `borde`, importes a la derecha; cabecera de tabla repetida en cada página; fila TOTAL en negrita y mayor tamaño sobre fondo `fondo`; observaciones con título en `suave`. NO cambiar textos, orden de contenidos, nombre de archivo, ni añadir estado ni la palabra «factura».
- [X] T022 [US5] En `js/pdf.js` asegurar la robustez de FR-018: con y sin logo, con datos de perfil vacíos (la línea de acento se coloca bien), conceptos largos partidos dentro de su columna, y bloque de totales sin partir entre páginas (`comprobarSalto` con la altura completa del bloque).

**Checkpoint**: el PDF mantiene todos los elementos de la spec 001 (FR-028) y se ve coherente con la aplicación.

---

## Phase 8: Polish & validación final

- [ ] T023 Recorrer [quickstart.md](quickstart.md) apartados 1 a 6 completos (pruebas en verde, navegación, estados, 320 px y escritorio, cambio del color `acento` en `js/tema.js`, PDFs con y sin logo y con 30 líneas, y comparación de los datos antiguos).
- [ ] T024 Revisar los ítems de [checklists/ux.md](checklists/ux.md) y resolver o anotar en la spec los marcados como conflicto o ambigüedad (CHK004, CHK005, CHK014, CHK025); marcar `[x]` solo los que el revisor dé por satisfechos.
- [X] T025 Buscar con `grep` que no queda «Mis datos» en textos visibles (salvo identificadores internos) y que ningún archivo fuera de `js/tema.js` contiene colores literales. Comprobar también que no aparece `http`, `@import` ni `fonts.googleapis` en `index.html`, `css/` ni `js/` (FR-022), y comparar `js/calculos.js`, `js/numeracion.js`, `js/formato.js` y `js/almacen.js` con la copia de T001: deben ser idénticos (FR-019, FR-020).

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T006)** → historias.
- T002, T003 en paralelo; T004 después de T003; T005 independiente de T002/T003; T006 después de T002 y T003.
- **Orden en `index.html`**: T006 antes que T007 (ambos editan el archivo). **Orden en `css/estilos.css`**: T005 → T011 → T013 → T017 → T020 (no paralelizables entre sí).
- **US1 (T007–T011)** depende de Foundational. T008 en paralelo con T007; T009 y T011 después de T007.
- **US2 (T012–T013)** depende de US1 (`inicio.js`) y de T003.
- **US3 (T014–T018)** depende de T005; T014, T015 y T016 en paralelo; T017 después de ellas.
- **US4 (T019–T020)** depende de T003; T019 comparte archivo con ninguna otra tarea de historia; T020 comparte `css/estilos.css` con US1, US2 y US3, así que va después de T017.
- **US5 (T021–T022)** depende de T002 únicamente; puede hacerse en paralelo con US1–US4.
- **Polish (T023–T025)** al final.

## Parallel Example

```text
Fase 2:  T002 (js/tema.js)  ‖  T003 (js/vigencia.js)  ‖  T005 (css/estilos.css)
US3:     T014 (clientes.js) ‖  T015 (catalogo.js)     ‖  T016 (editor.js)
Tras Fase 2:  US5 (js/pdf.js)  ‖  US1 (index.html, js/ui/inicio.js, js/app.js)
```

## Implementation Strategy

1. **MVP = Foundational + US1** (T001–T011): inicio, menú común y «Perfil». Parar y validar con [quickstart.md](quickstart.md) apartado 2.
2. Añadir US2 (resumen) → US3 (rediseño) → US4 (etiquetas) → US5 (PDF); cada una se valida de forma independiente.
3. Cerrar con Polish (T023–T025).
