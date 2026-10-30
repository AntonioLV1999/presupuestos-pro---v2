---

description: "Tareas de la revisión R2 de la spec 002 — dirección visual «Despacho»"
---

# Tasks: Mejora de presentación — R2, dirección visual «Despacho»

**Input**: Documentos de diseño de `/specs/002-mejora-presentacion/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: la spec no pide pruebas automáticas. **Se incluye una sola tarea de prueba (T008)** porque la convención del proyecto (`CLAUDE.md`) exige pruebas para toda lógica pura de `js/formato.js`, y R2 añade allí `Formato.recuento`. El resto se valida con [quickstart.md](quickstart.md).

**Organization**: tareas agrupadas por historia de usuario de [spec.md](spec.md) para implementar y validar cada una por separado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto y sin depender de tareas pendientes)
- **[Story]**: historia de usuario a la que sirve (US2, US3…)
- Rutas relativas a la raíz del repositorio

## Path Conventions

Proyecto único sin compilación. Rutas reales: `index.html`, `pruebas.html`, `css/estilos.css`, `js/tema.js`, `js/formato.js`, `js/app.js`, `js/pdf.js`, `js/ui/*.js`, `tests/pruebas.js`. **`vendor/` no se toca en ninguna tarea.**

## Historias sin tareas de implementación

- **US1 — Inicio y navegación común**: entregada en R1. R2 no cambia su comportamiento; el cambio de aspecto de la cabecera y de la sección actual pertenece a US3 (FR-023, FR-025). Su no regresión se comprueba en **T039**.

## Reglas transversales que toda tarea debe respetar

- **Ningún color literal** fuera de `js/tema.js` (FR-009).
- **Ningún número en la familia de títulos** (`--fuente-titulo` en pantalla, `times` en el PDF), ni siquiera el total (FR-024, [research.md](research.md) R2).
- **Ninguna llamada nueva** a `App.cambiar` ni a `Almacen.guardar`: R2 es de solo lectura sobre el estado.
- **Ningún texto visible cambia** salvo los complementos de título de FR-026 y los rótulos en mayúsculas del PDF fijados en [contracts/pdf.md](contracts/pdf.md).
- **Ningún identificador interno se renombra**: claves de `Tema.colores`, `mis-datos`, `data-ir`, claves JSON.
- El orden de carga de scripts de `index.html` y `pruebas.html` no cambia.

---

## Phase 1: Setup (línea base)

**Purpose**: fijar el punto de partida para poder demostrar que R2 no rompe nada y medir la mejora.

- [ ] T001 Abrir `pruebas.html` con doble clic y confirmar que dice «Todas las pruebas superadas» en verde; si no, **parar**: la línea base ya está rota y no es responsabilidad de R2
- [ ] T002 [P] Registrar el contenido actual de `vendor/` (`git ls-files vendor/` y tamaños) para compararlo en T036; debe seguir siendo exactamente `jspdf.umd.min.js` y `jspdf.plugin.autotable.min.js`
- [ ] T003 [P] Hacer capturas «antes» de `index.html` en las seis pantallas a 1900×900 y a 320 px de ancho, contar cuántos presupuestos se ven sin desplazar en un portátil de 1366×768 (referencia de SC-014: R1 mostraba 5) y descargar un PDF de referencia; guardar todo **fuera del repositorio** (no se versiona)

---

## Phase 2: Foundational (tokens)

**Purpose**: valores de los que dependen todas las historias. Ver [contracts/tema.md](contracts/tema.md).

**⚠️ CRITICAL**: ninguna historia empieza hasta terminar esta fase.

- [ ] T004 [P] En `js/tema.js`, sustituir los valores del objeto `colores` por: `texto` `#1C1A17`, `suave` `#6B6459`, `borde` `#E6E1D8`, `fondo` `#FBF9F5`, `superficie` `#FFFFFF`, `acento` `#8C2F39`, `acento-oscuro` `#6E242C`, `exito` `#4F6B4A`, `exito-fondo` `#EDF2EB`, `aviso` `#7C5415`, `aviso-fondo` `#F7EFE0`, `error` `#B3261E`, `error-fondo` `#FBEDEB`; y **añadir** `'borde-fuerte': '#CFC7B8'`, `'superficie-alt': '#F4F1EA'`, `'papel-hundido': '#F2EFE7'`. No renombrar ni eliminar ninguna clave; no tocar `rgb()` ni el bucle que vuelca las variables CSS (los nombres con guion ya funcionan con `Tema.rgb('borde-fuerte')`)
- [ ] T005 [P] En el bloque `:root` de `css/estilos.css`: cambiar `--fuente` a `"Segoe UI Variable Text", "Segoe UI", system-ui, Arial, sans-serif`; añadir `--fuente-titulo: Cambria, "Sitka Text", Georgia, "Times New Roman", serif`; cambiar `--t-xl` de `26px` a `30px`; añadir `--t-2xl: 40px`, `--lh-apretado: 1.2`, `--lh-normal: 1.5`, `--letra-rotulo: 0.08em`, `--peso-medio: 600`, `--e-6: 48px`, `--radio: 4px`, `--filete: 1px`, `--filete-fuerte: 2px`. Mantener `--alto-tactil: 44px` y el resto de la escala sin cambios
- [ ] T006 En `css/estilos.css` (depende de T005): en `body` añadir `line-height: var(--lh-normal)` y `font-variant-numeric: tabular-nums` (FR-024: así **todo** dato numérico usa cifras de ancho constante sin marcar elemento por elemento; botones y campos lo heredan por su `font: inherit`). Añadir `h1, h2, h3 { font-family: var(--fuente-titulo); line-height: var(--lh-apretado); }`, `h2 { font-weight: 400; }` y `h1, h3 { font-weight: var(--peso-medio); }`
- [ ] T007 En `css/estilos.css` (depende de T005): sustituir `border-radius: var(--e-2)` por `border-radius: var(--radio)` **solo** en `button, .boton`, en `.mensaje` y en `input[type="text"], input[type="email"], select, textarea`. Los radios de `.formulario.recuadro`, `table:not(.totales) tr`, `.estado`, `.cifra`, `.totales` y `.lista-catalogo` se tratan en sus historias

**Checkpoint**: la aplicación abre con la paleta nueva; puede verse inconsistente hasta completar US3.

---

## Phase 3: User Story 3 — Dirección visual «Despacho» (Priority: P1 en R2) 🎯 MVP

**Goal**: papel cálido, tinta, cabecera sin banda de color, un solo signo de sección actual, títulos con contexto, bloques separados por filetes y total destacado.

**Independent Test**: recorrer las seis pantallas y comprobar que no hay banda de color en la cabecera, que la sección actual se marca solo con una línea, que ningún título repite sin más la etiqueta del menú y que el total del editor es el número más grande. Secciones 1, 2 y 5 de [quickstart.md](quickstart.md).

### Test para User Story 3 ⚠️

> Escribirlo **primero** y comprobar que **falla** antes de T009.

- [ ] T008 [P] [US3] En `tests/pruebas.js`, junto a los casos de `Formato`, añadir `caso('Recuentos para el título de pantalla', function () { … })` con: `esIgual(Formato.recuento(0, 'guardado', 'guardados'), 'Ninguno todavía')`, `esIgual(Formato.recuento(1, 'guardado', 'guardados'), '1 guardado')`, `esIgual(Formato.recuento(3, 'guardado', 'guardados'), '3 guardados')`, `esIgual(Formato.recuento(1, 'servicio', 'servicios'), '1 servicio')` y `esIgual(Formato.recuento(4, 'servicio', 'servicios'), '4 servicios')`. Abrir `pruebas.html` y confirmar que el caso **falla**

### Implementation for User Story 3

- [ ] T009 [US3] En `js/formato.js` (depende de T008), añadir la función pura `recuento(n, singular, plural)`, sin DOM, que cumpla literalmente [data-model.md](data-model.md): «Singular y plural correctos: «1 guardado» / «3 guardados», «1 servicio» / «4 servicios»» y «Caso cero: «Ninguno todavía»». Devuelve `'Ninguno todavía'` si `n === 0`, `n + ' ' + singular` si `n === 1` y `n + ' ' + plural` en otro caso. Exportarla en `window.Formato`. Reabrir `pruebas.html`: todo en verde
- [ ] T010 [P] [US3] En `js/app.js`, añadir `function titulo(texto, complemento)` que devuelva `el('div', { class: 'titulo-pantalla' }, [el('h2', { text: texto }), complemento ? el('p', { class: 'complemento', text: complemento }) : null])` (`el` ya admite hijos `null`, como hace `editor.js` en `pintarCabecera`) y exportarla como `titulo` en `window.App`. El `h2` sigue siendo el primer encabezado de la pantalla (FR-026)
- [ ] T011 [US3] En `css/estilos.css`, añadir: `.titulo-pantalla { margin: 0 0 var(--e-5); }`, `.titulo-pantalla h2 { margin: 0; }`, `.complemento { margin: var(--e-1) 0 0; font-family: var(--fuente); font-size: var(--t-s); color: var(--suave); }` y `.dato { font-family: var(--fuente); }` (para números dentro de un título, FR-024)
- [ ] T012 [P] [US3] En `js/ui/presupuestos.js`, función `mostrar`, sustituir `seccion.appendChild(App.el('h2', { text: 'Presupuestos' }))` por `seccion.appendChild(App.titulo('Presupuestos', Formato.recuento(App.estado.presupuestos.length, 'guardado', 'guardados')))`
- [ ] T013 [P] [US3] En `js/ui/clientes.js`, función de listado, sustituir el `h2` «Clientes» por `App.titulo('Clientes', Formato.recuento(App.estado.clientes.length, 'guardado', 'guardados'))`
- [ ] T014 [P] [US3] En `js/ui/catalogo.js`, función de listado, sustituir el `h2` «Catálogo» por `App.titulo('Catálogo', Formato.recuento(App.estado.catalogo.length, 'servicio', 'servicios'))`
- [ ] T015 [P] [US3] En `js/ui/mis-datos.js`, sustituir el `h2` «Perfil» por `App.titulo('Perfil', 'Tus datos para los presupuestos')`. **Mantener** el párrafo siguiente «Estos datos aparecen en todos tus presupuestos en PDF.» sin cambios
- [ ] T016 [P] [US3] En `js/ui/inicio.js`, función `mostrar`, sustituir `App.el('h2', { text: 'Inicio' })` por `App.titulo('Resumen de actividad')` (sin complemento; [contracts/pantallas.md](contracts/pantallas.md))
- [ ] T017 [P] [US3] En `js/ui/editor.js`, función `pintar`, sustituir `seccion.appendChild(App.el('h2', { text: titulo }))` para que, si hay número, el título sea `App.el('div', { class: 'titulo-pantalla' }, [App.el('h2', {}, ['Presupuesto ', App.el('span', { class: 'dato', text: borrador.numero })])])` y, si no, `App.titulo('Nuevo presupuesto')`. **Motivo**: el número no puede componerse en la serif del `h2` (FR-024). Eliminar la variable `titulo` si queda sin uso
- [ ] T018 [US3] En `css/estilos.css`, cabecera y navegación ([contracts/pantallas.md](contracts/pantallas.md)): `header` → `background: var(--fondo); color: var(--texto); border-bottom: var(--filete) solid var(--borde-fuerte);`; `header h1` → `color: var(--texto);`; `nav button` → `color: var(--suave);` y `border-bottom: var(--filete-fuerte) solid transparent` (sustituye `var(--e-1)`); `nav button:hover` → `background: transparent; color: var(--texto);`; `nav button.activo, nav button[aria-current="page"]` → `border-bottom-color: var(--acento); font-weight: var(--peso-medio); color: var(--texto); background: transparent;` (**retirar** `background: var(--acento-oscuro)`: un solo signo, FR-025); `nav button:focus-visible` → `outline-color: var(--acento);` manteniendo el desplazamiento (FR-012a)
- [ ] T019 [US3] En `css/estilos.css`, cajas → filetes (FR-023): `.formulario.recuadro` → `border: none; border-top: var(--filete) solid var(--borde); border-radius: 0; background: transparent; padding: var(--e-4) 0 0;`; `.lista-catalogo` → `border: none; border-top: var(--filete) solid var(--borde); border-bottom: var(--filete) solid var(--borde); border-radius: 0; background: transparent;`. No tocar `.logo-previo` (encuadre del logo fuera de alcance)
- [ ] T020 [US3] En `css/estilos.css`, bloque de totales del editor (FR-011): `.totales` → `border: none; border-radius: 0; background: transparent;`; `.totales tr.total td` → `font-size: var(--t-2xl); font-weight: var(--peso-medio); color: var(--texto); background: var(--superficie-alt); border-top: var(--filete-fuerte) solid var(--borde-fuerte); padding-top: var(--e-3); padding-bottom: var(--e-3);` (sustituye `--t-xl`, `bold`, `var(--fondo)` y `2px solid var(--texto)`; el importe va en **tinta**, no en el acento, porque en contabilidad el rojo se lee como saldo negativo); añadir `.totales tr.total td.numero { white-space: normal; overflow-wrap: anywhere; }` en la base y `.totales tr.total td.numero { white-space: nowrap; }` dentro de `@media (min-width: 640px)` para que un total muy largo no provoque desplazamiento horizontal a 320 px (FR-014); y en ese mismo bloque cambiar `.totales { width: 340px; … }` a `width: 420px` para que quepa el total a 40 px

**Checkpoint**: US3 completa y comprobable por sí sola. El inicio todavía muestra cifras y accesos en recuadros con el acento: se corrigen en US2.

---

## Phase 4: User Story 5 — PDF con aspecto de documento (Priority: P2)

**Goal**: el PDF adopta «Despacho» con `times` en titulares y rótulos y `helvetica` en datos, sin banda de color y sin añadir un solo byte.

**Independent Test**: generar un PDF con acentos, `ñ`, `º` y `€`; imprimirlo en blanco y negro; comprobar caracteres, ausencia de banda de color y que ningún número sale en serif. Sección 7 de [quickstart.md](quickstart.md).

> Todas las tareas de esta fase tocan solo `js/pdf.js`: van en orden, pero la fase entera puede hacerse **en paralelo con las fases 3, 5, 6 y 7**, que no tocan este archivo. Detalle en [contracts/pdf.md](contracts/pdf.md).

- [ ] T021 [US5] En `js/pdf.js`, función `cabecera`: cambiar `doc.setFont('helvetica', 'bold')` del nombre de la profesional por `doc.setFont('times', 'bold')` (la llamada siguiente a `helvetica normal` ya devuelve los datos a su familia). En `construir`, regla bajo la cabecera: `Tema.rgb('acento')` → `Tema.rgb('borde-fuerte')`
- [ ] T022 [US5] En `js/pdf.js`, función `construir`, bloque de título: componer «PRESUPUESTO» con `doc.setFont('times', 'bold')` y `texto(doc, 'texto')` en lugar de `texto(doc, 'acento')`; **justo antes** de `doc.text('Nº ' + presupuesto.numero, …)` añadir `doc.setFont('helvetica', 'bold')` para que el número no herede `times` (FR-024)
- [ ] T023 [US5] En `js/pdf.js`, rótulos de sección: para «Cliente», sustituir `doc.setFont('helvetica', 'bold')` por `doc.setFont('times', 'normal')` y el texto por `'CLIENTE'`; para «Observaciones», añadir `doc.setFont('times', 'normal')` antes de su `setFontSize(9)` y cambiar el texto a `'OBSERVACIONES'`. Las llamadas siguientes a `helvetica normal` ya existen y devuelven los datos a su familia
- [ ] T024 [US5] En `js/pdf.js`, `doc.autoTable`: sustituir `headStyles` por `{ font: 'times', fontStyle: 'bold', fillColor: Tema.rgb('superficie-alt'), textColor: Tema.rgb('texto'), lineWidth: { bottom: 0.5 }, lineColor: Tema.rgb('borde-fuerte') }`. Mantener `styles.font: 'helvetica'` del cuerpo y el `didParseCell` de alineación. Desaparece la banda de acento con texto blanco
- [ ] T025 [US5] En `js/pdf.js`, bloque de totales: `setFillColor` de `Tema.rgb('fondo')` → `Tema.rgb('superficie-alt')`; `setDrawColor` de `Tema.rgb('texto')` → `Tema.rgb('borde-fuerte')`; `setLineWidth(0.4)` → `setLineWidth(0.6)`; componer el rótulo «TOTAL» con `doc.setFont('times', 'bold')` y, **antes** de escribir el importe, `doc.setFont('helvetica', 'bold')` para que el total no salga en serif (FR-024). Las filas de base, IVA y retención siguen en `helvetica normal`

**Checkpoint**: el PDF es coherente con la dirección; `Pdf.construir` conserva firma y salida, así que el `.zip` de la spec 003 sigue funcionando sin cambios.

---

## Phase 5: User Story 6 — Listados legibles de un vistazo (Priority: P2 en R2)

**Goal**: comas alineadas, filas alineadas a la misma altura, resalte al pasar el puntero, fila de 52 px y acción destructiva separada.

**Independent Test**: con tres presupuestos de importes distintos, comprobar en escritorio que las comas quedan en la misma vertical, que los botones están a la altura del resto de la fila, que la fila se resalta y que caben al menos 8 presupuestos sin desplazar. Sección 3 de [quickstart.md](quickstart.md).

- [ ] T026 [P] [US6] En `js/ui/presupuestos.js`, función `mostrar`, añadir `class: 'ajustada'` a las celdas `td` de Número, Fecha de emisión, Estado y la celda de acciones, y a sus `th` correspondientes en el `thead`. La celda y el `th` de Total ya llevan `numero`; no tocarlos
- [ ] T027 [P] [US6] En `js/ui/clientes.js`, añadir `class: 'ajustada'` a la celda `td` de acciones del listado y a su `th` correspondiente en el `thead`
- [ ] T028 [P] [US6] En `js/ui/catalogo.js`, añadir `class: 'ajustada'` a la celda `td` de acciones del listado y a su `th` correspondiente en el `thead`
- [ ] T029 [US6] En `css/estilos.css`, listados ([research.md](research.md) R8 y R9). En la base (móvil): `table:not(.totales) tr` → `border: none; border-top: var(--filete) solid var(--borde); border-radius: 0; background: transparent;` (las tarjetas pasan a bloques separados por filete). Dentro de `@media (min-width: 640px)`: `table:not(.totales) td` → `vertical-align: middle; padding: var(--e-1) var(--e-2);` (sustituye `vertical-align: top` y `padding: var(--e-2)`: corrige el desfase de ~17 px y deja la fila en 44 + 4 + 4 = 52 px); `th` → `background: var(--superficie-alt); font-weight: var(--peso-medio); border-bottom: var(--filete-fuerte) solid var(--borde-fuerte);`; `td.numero, th.numero, td.ajustada, th.ajustada { width: 1%; white-space: nowrap; }` (las columnas se ajustan al contenido y el espacio sobrante va al cliente o al concepto); `table:not(.totales) td.numero, table:not(.totales) th.numero { padding-right: var(--e-4); }` (≥ 24 px entre Total y Estado); `td .acciones { margin: 0; flex-wrap: nowrap; }`. Añadir aparte `@media (min-width: 640px) and (hover: hover) { table:not(.totales):not(.lineas) tbody tr:hover { background: var(--papel-hundido); } }` (FR-028; sin efecto pegajoso en táctil)
- [ ] T030 [US6] En `css/estilos.css`, añadir `.acciones .peligro { margin-left: var(--e-4); }` (FR-029: la acción destructiva se separa del resto). Comprobar que «Borrar» es ya el último botón del grupo en `js/ui/presupuestos.js`, `js/ui/clientes.js` y `js/ui/catalogo.js` (lo es en R1; no hay que mover nada)

**Checkpoint**: US6 completa. Contar presupuestos visibles en 1366×768: ≥ 8 (SC-014).

---

## Phase 6: User Story 2 — Resumen de actividad (Priority: P2)

**Goal**: cifras del resumen sin recuadros ni acento, botón «Nuevo presupuesto» integrado en su bloque y accesos separados por filetes.

**Independent Test**: abrir el inicio y comprobar que el botón principal pertenece al bloque del resumen, que las cifras van en tinta, que no hay recuadros y que las cifras siguen coincidiendo con los listados. Sección 2 y 8 de [quickstart.md](quickstart.md).

- [ ] T031 [US2] En `js/ui/inicio.js`, función `mostrar`: crear `var bloque = App.el('div', { class: 'bloque-resumen' })` y meter **dentro** de él, en este orden, el `div.resumen`, el párrafo `.vacio` (si aplica) y el `div.acciones` con «Nuevo presupuesto»; añadir `bloque` a `seccion` y después el `div.accesos`. Si `App.estaBloqueado()`, el bloque contiene solo las acciones, como hoy (FR-006a)
- [ ] T032 [P] [US2] En `css/estilos.css`, inicio: `.bloque-resumen { margin-bottom: var(--e-6); }` y `.bloque-resumen .acciones { margin: var(--e-4) 0 0; }`; `.resumen` y `.accesos` → `gap: var(--e-4);`; `.cifra` → `background: transparent; border: none; border-top: var(--filete) solid var(--borde); border-radius: 0; padding: var(--e-3) 0 0;`; `.cifra-valor` → `color: var(--texto); font-weight: var(--peso-medio);` (sustituye `var(--acento)` y `bold`, FR-030); `button.acceso` → `background: transparent; border: none; border-top: var(--filete) solid var(--borde); border-radius: 0; padding: var(--e-3) var(--e-2);`; `button.acceso:hover` → `background: var(--papel-hundido);`; `button.acceso strong` → `font-family: var(--fuente-titulo); color: var(--texto);` (sustituye `var(--acento)`)
- [ ] T033 [US2] Localizar el origen del filete horizontal que aparece al pie de la pantalla de inicio sin contenido que lo justifique (captura de R1 a 1900×900, hacia y ≈ 885) revisando `css/estilos.css` y el marcado que genera `js/ui/inicio.js`, y retirarlo. Si resulta ser el borde de la propia ventana del navegador y no un elemento de la página, anotarlo en `specs/002-mejora-presentacion/checklists/requirements.md` y cerrar la tarea sin cambios

**Checkpoint**: US2 completa; con US3 cerrada, el acento ya solo aparece donde permite FR-030.

---

## Phase 7: User Story 4 — Estados visuales (Priority: P3)

**Goal**: la etiqueta Vigente / Caducado deja de leerse como un botón y sigue siendo distinguible en blanco y negro.

**Independent Test**: enseñar el listado a tres personas y pedirles que abran un presupuesto: nadie intenta pulsar la etiqueta. Pasar una captura a escala de grises: Vigente y Caducado se siguen distinguiendo. Sección 4 de [quickstart.md](quickstart.md).

- [ ] T034 [US4] En `css/estilos.css`, sustituir el bloque de `.estado` (FR-027, FR-013): `.estado { display: inline-block; padding: 0 var(--e-2); line-height: 1.8; border: var(--filete) solid transparent; border-radius: 0; font-size: var(--t-xs); font-weight: var(--peso-medio); letter-spacing: var(--letra-rotulo); text-transform: uppercase; }`, `.estado.vigente { color: var(--exito); background: var(--exito-fondo); }` y `.estado.caducado { color: var(--aviso); background: transparent; border-color: var(--aviso); border-style: dashed; }`. Resultado: unos 22 px de alto frente a los 44 de los botones, radio 0 frente a 4 px, y en gris Vigente es un bloque relleno y Caducado un contorno discontinuo. El texto del DOM («Vigente», «Caducado») no cambia

**Checkpoint**: las cinco historias con trabajo en R2 están completas.

---

## Phase 8: Polish, verificación y cierre

**Purpose**: comprobar las garantías transversales y cerrar la revisión.

- [ ] T035 [P] Ejecutar `grep -nE "#[0-9a-fA-F]{3,6}" css/estilos.css` y `grep -nE "#[0-9a-fA-F]{3,6}" js/pdf.js`: ambos sin resultados (FR-009)
- [ ] T036 [P] Ejecutar `git status --short vendor/`: sin resultados, y contenido idéntico al registrado en T002 (FR-016, FR-022)
- [ ] T037 Medir con una herramienta de contraste los diez pares de [contracts/tema.md](contracts/tema.md) (sección «Contraste mínimo») y el contorno de foco `acento` sobre `fondo` (≥ 3:1); sustituir en `specs/002-mejora-presentacion/research.md`, apartado R3, los valores aproximados «≈» por los medidos. Si algún par no llega a 4,5:1, **parar** y ajustar el valor en `js/tema.js` antes de seguir
- [ ] T038 Abrir `pruebas.html`: «Todas las pruebas superadas» en verde, incluido el caso nuevo de T008. (`pruebas.html` no carga `tema.js` ni `css/estilos.css`, así que el rediseño no le afecta; no hay que modificarlo)
- [ ] T039 Recorrer **completo** `specs/002-mejora-presentacion/quickstart.md` (secciones 1 a 8, incluida la exportación del `.zip` de la spec 003 y la no regresión de US1: navegación en las seis pantallas y salida del editor sin confirmación) y marcar cada casilla; abrir con la pestaña Red del navegador visible y comprobar que no hay **ninguna** petición
- [ ] T040 En `specs/002-mejora-presentacion/checklists/requirements.md`, retirar la nota «Pendiente de actualizar en la fase de planificación…», porque los tres contratos y el quickstart ya están reescritos para R2
- [ ] T041 **Al hacer el merge**: en `specs/002-mejora-presentacion/spec.md`, cambiar **Status** a «Publicada» (revisión R2); en `specs/README.md`, actualizar la fila de la 002 para que «Qué aporta» y «Estado» reflejen la revisión R2 (dirección visual «Despacho») y la columna «Rama» indique `002-mejora-presentacion-rediseño`
- [ ] T042 **Último paso**: actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, **una línea por decisión**, con referencia a la spec (formato «- [002] …»). Incluir solo lo transversal y aprovechable por futuras features —(1) dos familias con papeles disjuntos: `--fuente-titulo` para títulos y rótulos, `--fuente` para texto y todo número; (2) ningún número en la serif, ni en pantalla ni en el PDF; cifras tabulares en `body`; (3) el acento solo en marca, sección actual, botón principal, enlaces y total, y el color de error nunca rellena un botón; (4) el PDF usa solo familias núcleo de jsPDF (`times` titulares, `helvetica` datos), sin incrustar nada; (5) títulos de pantalla con `App.titulo(texto, complemento)` y recuentos con `Formato.recuento`—, y **no** añadir entradas por añadir

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (fase 1)**: sin dependencias.
- **Foundational (fase 2)**: depende de la fase 1. **Bloquea todas las historias.**
- **Historias (fases 3 a 7)**: dependen solo de la fase 2.
- **Polish (fase 8)**: depende de todas las historias. T041 se hace al hacer el merge y **T042 es siempre la última tarea**.

### User Story Dependencies

| Historia | Depende de | Archivos que toca | Conflicto con |
|---|---|---|---|
| **US3** (P1) | Fase 2 | `css/estilos.css`, `js/app.js`, `js/formato.js`, `tests/pruebas.js`, `js/ui/*.js` (títulos) | US6, US2, US4 en `css/estilos.css`; US6 y US2 en algunos `js/ui/*.js` |
| **US5** (P2) | Fase 2 | Solo `js/pdf.js` | **Ninguno**: totalmente independiente |
| **US6** (P2) | Fase 2 | `css/estilos.css`, `js/ui/presupuestos.js`, `clientes.js`, `catalogo.js` | US3 en los mismos archivos |
| **US2** (P2) | Fase 2 | `css/estilos.css`, `js/ui/inicio.js` | US3 en `inicio.js` y `estilos.css` |
| **US4** (P3) | Fase 2 | Solo el bloque `.estado` de `css/estilos.css` | Mínimo |

Ninguna historia necesita que otra esté terminada para funcionar. Las dependencias de la tabla son **de archivo**, no funcionales: si se trabaja en paralelo, coordinar las ediciones de `css/estilos.css`.

### Within Each User Story

- US3: T008 (prueba, debe fallar) → T009 → resto. T010 y T012–T017 en paralelo entre sí; T011, T018, T019 y T020 en orden porque comparten `css/estilos.css`.
- US5: T021 → T025 en orden (mismo archivo).
- US6: T026–T028 en paralelo; luego T029 y T030.
- US2: T031 y T032 en paralelo; T033 al final.

### Parallel Opportunities

- Fase 1: T002 y T003.
- Fase 2: T004 (`js/tema.js`) y T005 (`css/estilos.css`).
- Tras la fase 2: **US5 completa en paralelo con todo lo demás.**
- Dentro de US3: T008, T010 y T012–T017.
- Dentro de US6: T026–T028.
- Fase 8: T035 y T036.

---

## Parallel Example: User Story 3

```text
# Tras T009, todas las pantallas pueden adoptar App.titulo a la vez:
Task: "T012 [US3] Título con recuento en js/ui/presupuestos.js"
Task: "T013 [US3] Título con recuento en js/ui/clientes.js"
Task: "T014 [US3] Título con recuento en js/ui/catalogo.js"
Task: "T015 [US3] Título con complemento en js/ui/mis-datos.js"
Task: "T016 [US3] Título «Resumen de actividad» en js/ui/inicio.js"
Task: "T017 [US3] Título con número en sans en js/ui/editor.js"
```

## Parallel Example: US5 junto a US3

```text
# Mientras una persona trabaja en US3 (css/estilos.css + js/ui/*), otra puede hacer el PDF entero:
Task: "T021–T025 [US5] Reparto de familias y composición en js/pdf.js"
```

---

## Implementation Strategy

### MVP First (US3)

1. Fase 1: línea base.
2. Fase 2: tokens. **Crítica.**
3. Fase 3: US3.
4. **PARAR Y VALIDAR**: secciones 1, 2 y 5 de [quickstart.md](quickstart.md). Con esto la aplicación ya **parece** «Despacho»: papel, tinta, cabecera limpia, títulos con contexto y total destacado.

### Incremental Delivery

1. Fases 1 + 2 → base lista.
2. **US3** → la dirección visible (MVP).
3. **US5** → el PDF, que es lo único que ve el cliente; va segundo por ser el de mayor impacto externo y no chocar con nada.
4. **US6** → los listados, donde la profesional pasa más tiempo.
5. **US2** → el inicio sin recuadros.
6. **US4** → la etiqueta de estado.
7. Fase 8 → verificación completa y cierre.

Cada paso deja la aplicación funcionando y sin regresiones.

### Parallel Team Strategy

- Persona A: US3 → US6 → US2 → US4 (todas comparten `css/estilos.css`: mejor en serie).
- Persona B: US5 entera (`js/pdf.js`), en paralelo desde el final de la fase 2.

---

## Notes

- `[P]` = archivo distinto y sin dependencias pendientes.
- `[USn]` = trazabilidad con la historia de [spec.md](spec.md).
- Hacer commit tras cada tarea o grupo lógico.
- Parar en cualquier checkpoint para validar la historia por separado.
- Si una tarea obliga a tocar un archivo de lógica pura (`calculos.js`, `numeracion.js`, `validacion.js`, `vigencia.js`, `almacen.js`, `zip.js`, `exportacion.js`), **parar**: R2 no debe tocarlos.
