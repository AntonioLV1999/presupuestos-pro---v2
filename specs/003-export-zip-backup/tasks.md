# Tasks: Exportar todos los presupuestos en un .zip

**Input**: Design documents from `specs/003-export-zip-backup/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/copia-zip.md](contracts/copia-zip.md), [contracts/pantallas.md](contracts/pantallas.md), [quickstart.md](quickstart.md)

**Tests**: se incluyen casos en `tests/pruebas.js` para la lógica pura (`Zip` y `Exportacion`), porque CLAUDE.md exige pruebas para la lógica sin DOM. La coincidencia de los PDF y el progreso se validan a mano con el quickstart (`pruebas.html` no carga jsPDF).

**Organization**: tareas agrupadas por historia de usuario. Todo el código es JavaScript ES2020 en scripts clásicos (sin módulos), un único global por archivo, textos en español de España. Ningún archivo fuera de los listados se modifica (`pdf.js`, `almacen.js`, `app.js`, `calculos.js`, `formato.js`, `numeracion.js` y `validacion.js` NO se tocan).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin depender de tareas sin terminar)
- **[Story]**: US1, US2 o US3, según la spec

---

## Phase 1: Setup (estructura de archivos)

**Purpose**: crear los dos módulos nuevos y cargarlos en orden.

- [ ] T001 [P] Crear `js/zip.js` con el esqueleto del proyecto: comentario de cabecera en español, IIFE con `'use strict'` y `window.Zip = {};` (se rellena en T005 y T006)
- [ ] T002 [P] Crear `js/exportacion.js` con el mismo esqueleto y `window.Exportacion = {};` (se rellena en T008, T009, T010, T016 y T017)
- [ ] T003 [P] Añadir en `index.html` las etiquetas `<script src="js/zip.js"></script>` y `<script src="js/exportacion.js"></script>` justo después de `js/vigencia.js` y antes de `js/ui/inicio.js`
- [ ] T004 [P] Añadir en `pruebas.html` las mismas dos etiquetas `<script>` después de `js/validacion.js` y antes de `tests/pruebas.js`

---

## Phase 2: Foundational (empaquetador ZIP)

**Purpose**: el escritor ZIP lo necesitan todas las historias. Ver [contracts/copia-zip.md](contracts/copia-zip.md), apartado «Formato ZIP».

**⚠️ CRITICAL**: ninguna historia puede empezar hasta terminar esta fase.

- [ ] T005 Implementar `Zip.crc32(bytes)` en `js/zip.js`: recibe un `Uint8Array` y devuelve el CRC-32 (polinomio 0xEDB88320, tabla de 256 entradas calculada una vez) como entero SIN signo (`>>> 0`)
- [ ] T006 Implementar `Zip.crear(entradas)` en `js/zip.js`: recibe `[{ nombre, datos: Uint8Array }]` y devuelve un `Uint8Array` con un ZIP válido. «ZIP clásico (sin ZIP64), método 0 «almacenado» (sin compresión), versión necesaria 20», «Nombres codificados en UTF-8 con el bit 11 de las banderas activado» (usar `TextEncoder`), «CRC-32 correcto por entrada», «Fecha y hora de cada entrada: las del momento de la exportación, en formato MS-DOS y hora local». Estructura: cabecera local (0x04034b50) + datos por cada entrada; directorio central (0x02014b50); registro de fin de directorio central (0x06054b50). Estructura plana, sin carpetas. Todos los enteros en little-endian (usar `DataView`)
- [ ] T007 Añadir en `tests/pruebas.js` una sección «Zip» con casos: `Zip.crc32` de los bytes ASCII de «123456789» = `0xCBF43926` y de un array vacío = 0; `Zip.crear` con 2 entradas, una con nombre `2026-001 - Estudio García.pdf`: empieza por la firma `PK\x03\x04`, el fin de directorio central indica 2 entradas, el bit 11 de las banderas está activo, el nombre se lee de vuelta idéntico (UTF-8), el CRC y el tamaño guardados coinciden con los datos y el contenido de cada entrada se recupera byte a byte. Abrir `pruebas.html` y comprobar que todo está en verde (depende de T004, T005, T006)

**Checkpoint**: `Zip` probado; las historias pueden empezar.

---

## Phase 3: User Story 1 - Descargar una copia de todo en un solo archivo (Priority: P1) 🎯 MVP

**Goal**: con presupuestos guardados, pulsar «Exportar todo (.zip)» descarga un único .zip con un PDF por presupuesto y el archivo de datos, sin modificar nada.

**Independent Test**: con 3 presupuestos, pulsar el botón, obtener un único .zip, descomprimirlo y ver 3 PDF «número - cliente» y `datos-presupuestospro.json`; el PDF de un presupuesto coincide con el de «Descargar PDF» (quickstart pasos 2 a 6).

### Lógica pura de US1

- [ ] T008 [US1] Implementar `Exportacion.nombreZip(aaaaMmDd)` en `js/exportacion.js`: `'2026-03-15'` → `'presupuestospro-copia-2026-03-15.zip'` (FR-006)
- [ ] T009 [US1] Implementar `Exportacion.datosCopia(estado, ahora)` en `js/exportacion.js`: devuelve el texto JSON (`JSON.stringify(..., null, 2)`) de `{ "formato": "presupuestospro-copia", "version": 1, "exportadoEn": ahora.toISOString(), "datos": estado }`. «`datos` es el documento `presupuestospro.v1` tal cual está en memoria, sin transformar» (FR-005; no se copia ni se modifica el estado)
- [ ] T010 [US1] Implementar la primera versión de `Exportacion.nombresPdf(presupuestos)` en `js/exportacion.js`: devuelve un nombre por presupuesto, en el mismo orden, con la forma `<número> - <cliente>.pdf` («sin cliente: `<número>.pdf`»), usando `presupuesto.numero` y `presupuesto.cliente.nombre` tal cual (la limpieza llega en US2) (FR-007)
- [ ] T011 [US1] Añadir en `tests/pruebas.js` una sección «Exportación» con casos de T008 a T010: `nombreZip('2026-03-15')`; `datosCopia` produce un JSON que se vuelve a leer con `formato` = «presupuestospro-copia», `version` = 1, `exportadoEn` = la fecha dada y `datos` igual al estado de entrada (incluidos `profesional.logo`, `catalogo`, `clientes` y `contadores`); `nombresPdf` de un presupuesto 2026-001 de «Estudio García» → `2026-001 - Estudio García.pdf` y con nombre de cliente vacío → `2026-001.pdf`. Comprobar `pruebas.html` en verde (depende de T008, T009, T010)

### Pantalla de US1

- [ ] T012 [P] [US1] En `css/estilos.css`, si hace falta, añadir con variables `var(--…)` (sin colores literales) el estilo del texto de estado de la exportación (`.exportacion-estado`, tamaño `--t-s`, color `--suave`). El botón NO necesita clase nueva: el estilo base de `button` ya es el secundario y `button.primario` queda solo para «Nuevo presupuesto»
- [ ] T013 [US1] En `js/ui/presupuestos.js`, añadir en la barra `.acciones` de `mostrar`, junto a «Nuevo presupuesto» y ANTES del `return` de la lista vacía (para que se vea también sin presupuestos), un botón `type="button"` con texto exacto «Exportar todo (.zip)», atributo `data-guarda` y `onclick` que llame a una función `exportarTodo` (contracts/pantallas.md, apartado «Botón»)
- [ ] T014 [US1] En `js/ui/presupuestos.js`, crear la función `async function exportarTodo()` que SOLO lee `App.estado` (nunca `App.cambiar` ni `Almacen.guardar`): para cada presupuesto de `App.estado.presupuestos` genera `Pdf.construir(presupuesto, App.estado.profesional)` y toma `new Uint8Array(doc.output('arraybuffer'))`; los nombres vienen de `Exportacion.nombresPdf`; añade la entrada `datos-presupuestospro.json` con `new TextEncoder().encode(Exportacion.datosCopia(App.estado, new Date()))`; y construye el .zip con `Zip.crear`. No se pide confirmación por perfil incompleto (research.md R2)
- [ ] T015 [US1] En `js/ui/presupuestos.js`, completar `exportarTodo` con la descarga y los mensajes: `Blob` de tipo `application/zip`, `URL.createObjectURL`, enlace temporal con `download = Exportacion.nombreZip(Formato.hoy())`, clic y `URL.revokeObjectURL` diferido; éxito con `App.mensaje('Copia lista: N presupuestos guardados en <nombre>.', 'exito')` (singular «1 presupuesto guardado»); todo dentro de `try/catch` y, si falla, `App.mensaje('No se ha podido crear la copia. Tus datos no han cambiado.', 'error')` (FR-012)

**Checkpoint**: US1 funcional y comprobable por separado (con ≥ 1 presupuesto).

---

## Phase 4: User Story 2 - Nombres de archivo claros y seguros (Priority: P2)

**Goal**: los nombres de los PDF se limpian de caracteres no admitidos y nunca se repiten, de modo que el .zip siempre se descomprime.

**Independent Test**: crear un presupuesto para «Diseño/Web S.L.», exportar y comprobar que el .zip se descomprime sin errores y el PDF se llama `2026-00N - Diseño-Web S.L..pdf` (quickstart paso 3).

- [ ] T016 [US2] Implementar `Exportacion.nombreSeguro(texto)` en `js/exportacion.js`: «los caracteres no admitidos en Windows (`\ / : * ? " < >` y la barra vertical) y los de control se sustituyen por «-»», «se colapsan los espacios repetidos y se recortan espacios y puntos en los extremos», «la parte del cliente se acorta a 80 caracteres» (recortar y volver a limpiar extremos). Ejemplo: `'Diseño/Web S.L.'` → `'Diseño-Web S.L.'`
- [ ] T017 [US2] Modificar `Exportacion.nombresPdf` en `js/exportacion.js`: pasar el nombre del cliente por `nombreSeguro`; «sin cliente: `<número>.pdf`» si queda vacío; «los nombres repetidos (sin distinguir mayúsculas, como Windows) reciben « (2)», « (3)»…» antes de `.pdf`; el orden de salida es el de entrada (FR-008)
- [ ] T018 [US2] Ampliar en `tests/pruebas.js` la sección «Exportación»: `nombreSeguro('Diseño/Web S.L.')` = `'Diseño-Web S.L.'`; cada carácter no admitido (`\ / : * ? " < > |`) se sustituye; espacios repetidos colapsados; puntos y espacios de los extremos recortados; texto de 120 caracteres → 80 como máximo; solo caracteres no admitidos (`'///'`) → `'---'` (los guiones no se recortan, solo espacios y puntos); solo espacios y puntos (`' . '`) → cadena vacía y, por tanto, `nombresPdf` → `<número>.pdf`; `nombresPdf` con dos presupuestos de igual número y cliente (o que solo difieren en mayúsculas) → el segundo termina en ` (2).pdf`, un tercero en ` (3).pdf`. Comprobar `pruebas.html` en verde (depende de T016 y T017)

**Checkpoint**: US1 y US2 funcionan juntas; los nombres del .zip son siempre válidos.

---

## Phase 5: User Story 3 - Aviso sin presupuestos y progreso visible (Priority: P2)

**Goal**: sin presupuestos hay un aviso claro y ninguna descarga; con muchos se ve que trabaja y no se puede lanzar otra exportación a la vez.

**Independent Test**: con 0 presupuestos, aviso y ninguna descarga (quickstart paso 7); con 50 o más, el texto de progreso avanza y el botón queda deshabilitado hasta terminar (quickstart paso 8).

- [ ] T019 [US3] En `js/ui/presupuestos.js`, al comienzo de `exportarTodo`: si `App.estado.presupuestos.length === 0`, mostrar «No hay presupuestos que exportar. Crea alguno y vuelve a intentarlo.» con `App.mensaje(texto, 'aviso')` y terminar SIN generar ni descargar nada (FR-010). En `css/estilos.css` añadir `.mensaje.aviso { background: var(--aviso-fondo); color: var(--aviso); border-color: var(--aviso); }` (las variables ya existen en el tema; sin colores literales)
- [ ] T020 [US3] En `js/ui/presupuestos.js`, añadir el progreso a `exportarTodo`: una variable de módulo que impida una segunda exportación mientras haya una en curso; deshabilitar el botón y mostrar en un `<p class="exportacion-estado" role="status">` el texto «Preparando la copia… N de M», actualizado antes de generar cada PDF; entre un PDF y el siguiente ceder el control al navegador (`await` de `requestAnimationFrame` seguido de `setTimeout(…, 0)`) para que el texto llegue a pintarse (research.md R5)
- [ ] T021 [US3] En `js/ui/presupuestos.js`, asegurar en un `finally` de `exportarTodo` que, tanto con éxito como con error, el botón se vuelve a habilitar, se quita el texto de progreso y se libera el bloqueo de exportación en curso; si la usuaria cambió de pantalla durante la exportación, actualizar nodos ya desconectados no debe provocar ningún error

**Checkpoint**: las tres historias funcionan.

---

## Phase 6: Polish y cierre

**Purpose**: validación completa y documentación.

- [ ] T022 Abrir `pruebas.html` y confirmar «Todas las pruebas superadas» en verde; recorrer entero [quickstart.md](quickstart.md) (incluido el cliente «Diseño/Web S.L.», el control de 3.604,00 € y 50 o más presupuestos) y anotar cualquier diferencia contra la spec (depende de T007, T011, T015, T018, T021)
- [ ] T023 [P] Actualizar `LEEME.md` con una nota breve para la usuaria: qué hace «Exportar todo (.zip)», qué contiene la copia y que debe guardarla fuera del navegador (otro disco o carpeta), en español de España
- [ ] T024 Actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. ‘[003] ...’). No incluyas entradas por incluir, asegúrate siempre de que es información transversal y relevante para el proyecto que pueden aprovechar futuras features.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup. Bloquea todas las historias.
- **US1 (Phase 3)**: depende de Foundational. Es el MVP.
- **US2 (Phase 4)**: depende de Foundational; modifica `nombresPdf` (T010), así que va después de US1 en `js/exportacion.js`.
- **US3 (Phase 5)**: depende de que exista `exportarTodo` (T014 y T015 de US1), porque la amplía.
- **Polish (Phase 6)**: depende de todas las historias. T024 es SIEMPRE la última tarea.

### User Story Dependencies

- **US1 (P1)**: sin dependencias de otras historias.
- **US2 (P2)**: se prueba por separado con funciones puras; en la aplicación mejora los nombres de US1.
- **US3 (P2)**: amplía el flujo de US1; el aviso de «sin presupuestos» y el progreso se comprueban por separado.

### Within Each Story

- Lógica pura y sus pruebas antes que la pantalla.
- Varias tareas del mismo archivo (`js/exportacion.js`, `js/ui/presupuestos.js`, `tests/pruebas.js`, `css/estilos.css`) van en secuencia, no en paralelo.

### Parallel Opportunities

- Setup: T001, T002, T003 y T004 en paralelo (archivos distintos).
- T012 (CSS) en paralelo con T008 a T011.
- T023 (`LEEME.md`) en paralelo con T022.

---

## Parallel Example: Setup

```text
Task: "Crear js/zip.js con el esqueleto del proyecto"        (T001)
Task: "Crear js/exportacion.js con el mismo esqueleto"       (T002)
Task: "Añadir las etiquetas <script> en index.html"          (T003)
Task: "Añadir las etiquetas <script> en pruebas.html"        (T004)
```

---

## Implementation Strategy

### MVP First (solo US1)

1. Setup (T001 a T004) y Foundational (T005 a T007).
2. US1 (T008 a T015).
3. **PARAR y validar**: quickstart pasos 2 a 6 con presupuestos de nombre normal. Sin US3, con 0 presupuestos se descargaría un .zip solo con el archivo de datos: no se debe entregar así.

### Entrega incremental

1. Setup + Foundational → empaquetador probado.
2. US1 → copia descargable (MVP).
3. US2 → nombres siempre válidos.
4. US3 → aviso sin datos y progreso (la funcionalidad queda completa).
5. Polish → quickstart completo, `LEEME.md` y `CLAUDE.md`.

---

## Notes

- Cada tarea cita el archivo; los textos visibles son exactamente los de [contracts/pantallas.md](contracts/pantallas.md).
- Sin librerías nuevas; `vendor/VERSIONES.md` no cambia.
- Commit tras cada tarea o grupo lógico.
- No se construye nada que no esté en la spec (importar, CSV, copias automáticas y envío por email quedan fuera).
