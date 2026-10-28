---

description: "Lista de tareas para implementar Presupuestos Pro v0"
---

# Tasks: Presupuestos Pro v0

**Input**: Design documents from `specs/001-presupuestos-pro-v0/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Se incluyen. El plan (R9) y [quickstart.md](quickstart.md) exigen la página `pruebas.html` con los casos de la spec en verde o rojo. Las pruebas de cada historia se escriben antes que el código y deben fallar primero.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Proyecto estático único en la raíz del repositorio: `index.html`, `pruebas.html`, `css/`, `js/`, `js/ui/`, `vendor/` y `tests/`, según [plan.md](plan.md).
- **Convenciones de todo el código**:
  - Scripts clásicos, nunca `type="module"`. Cada archivo de `js/` expone un único objeto global, como `window.Formato` o `window.Calculos`.
  - Importes en céntimos enteros y cantidades en centésimas enteras.
  - Fechas como texto `AAAA-MM-DD` en hora local.
  - Todos los textos visibles en español de España.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Crear la estructura de carpetas y archivos vacíos según [plan.md](plan.md): `index.html`, `pruebas.html`, `css/estilos.css`, `js/formato.js`, `js/calculos.js`, `js/numeracion.js`, `js/validacion.js`, `js/almacen.js`, `js/pdf.js`, `js/app.js`, `js/ui/presupuestos.js`, `js/ui/editor.js`, `js/ui/clientes.js`, `js/ui/catalogo.js`, `js/ui/mis-datos.js` y `tests/pruebas.js`
- [X] T002 [P] Descargar una sola vez jsPDF 2.5.2 desde `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js` a `vendor/jspdf.umd.min.js`, y jspdf-autotable 3.8.4 desde `https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js` a `vendor/jspdf.plugin.autotable.min.js`. Anotar ambas versiones y URLs en `vendor/VERSIONES.md`. La aplicación nunca debe cargar nada de internet en tiempo de ejecución (FR-032).
- [X] T003 [P] Escribir los estilos base en `css/estilos.css`:
  - Menú superior, secciones, tablas, formularios, botones, mensajes de error en rojo junto al campo, resumen de errores y mensaje de éxito.
  - Fuentes del sistema, sin fuentes externas. Legible a partir de 1024 px de ancho.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Crear el ejecutor de pruebas en `pruebas.html` y `tests/pruebas.js`.
  - `pruebas.html` carga, en este orden, `js/formato.js`, `js/calculos.js`, `js/numeracion.js`, `js/validacion.js` y `tests/pruebas.js`.
  - `tests/pruebas.js` define `caso(nombre, fn)` y `esIgual(obtenido, esperado)`.
  - La página pinta una fila verde o roja por caso, con el valor obtenido y el esperado si falla.
  - El resumen final dice «Todas las pruebas superadas» o «N pruebas fallidas».
  - Los casos se agrupan por secciones: Formato, Cálculos, Numeración y Validación.
- [X] T005 Añadir a `tests/pruebas.js` la sección Formato, que debe fallar antes de T006:
  - `Formato.importe`: 123456 → «1.234,56 €», 0 → «0,00 €», 100 → «1,00 €», 127200 → «1.272,00 €» y 100000000 → «1.000.000,00 €». Con -18000 → «-180,00 €», usando el guion normal.
  - `Formato.cantidad`: 150 → «1,5», 300 → «3» y 125 → «1,25».
  - `Formato.fecha`: «2026-10-23» → «23/10/2026».
  - `Formato.leerImporte`: «1.234,56» → 123456, «1.234» → 123400, «750» → 75000, «45,5» → 4550, «-5» → -500. Con «abc» o con «1,234» da `null`. El punto solo se acepta como separador de miles, en grupos de tres cifras.
  - `Formato.leerCantidad`: «1,5» → 150, «3» → 300 y «1,555» → `null`, porque admite hasta dos decimales.
- [X] T006 Implementar `window.Formato` en `js/formato.js`.
  - Debe tener `importe(centimos)`, `cantidad(centesimas)`, `fecha(aaaaMmDd)`, `leerImporte(texto)`, `leerCantidad(texto)` y `hoy()`, que devuelve la fecha local como `AAAA-MM-DD`.
  - El punto de miles se pone siempre y la coma es el separador decimal, con « €» al final (R6). No se usa `Intl.NumberFormat`.
  - Las pruebas de T005 deben quedar en verde.
- [X] T007 [P] Implementar `window.Almacen` en `js/almacen.js` según [contracts/almacenamiento.md](contracts/almacenamiento.md).
  - **Clave y estado inicial**: la clave es `presupuestospro.v1`. `estadoInicial()` devuelve `{ version: 1, profesional: { nombre: "", nif: "", telefono: "", email: "", direccion: "", logo: "" }, catalogo: [], clientes: [], presupuestos: [], contadores: {} }`.
  - **`cargar()`**: si el JSON no se puede leer, no lo sobrescribe. Devuelve un error con «No se han podido leer tus datos guardados. No se ha borrado nada.» y marca el almacén como bloqueado para escritura.
  - **`guardar(estado)`**: reescribe el documento completo. Si el navegador lanza un error de cuota, devuelve «No queda espacio para guardar. Prueba con un logo más pequeño.» y no da el cambio por guardado.
  - **`nuevoId()`**: devuelve un texto único.
  - **`pedirPersistencia()`**: llama a `navigator.storage.persist()` si existe.
  - Nunca guarda valores derivados como base, IVA, retención, total o validez.
  - Cubre FR-031 y FR-031a.
- [X] T008 Maquetar `index.html` con `lang="es"` y el título «Presupuestos Pro».
  - **Menú**: las cuatro entradas Presupuestos, Clientes, Catálogo y Mis datos.
  - **Secciones**: una `<section>` por pantalla, más la del editor, y una zona común de mensajes.
  - **Scripts**, en este orden: `vendor/jspdf.umd.min.js`, `vendor/jspdf.plugin.autotable.min.js`, `js/formato.js`, `js/calculos.js`, `js/numeracion.js`, `js/validacion.js`, `js/almacen.js`, `js/pdf.js`, `js/ui/presupuestos.js`, `js/ui/editor.js`, `js/ui/clientes.js`, `js/ui/catalogo.js`, `js/ui/mis-datos.js` y `js/app.js`.
- [X] T009 Implementar el arranque en `js/app.js`.
  - Carga el estado con `Almacen.cargar()` y llama a `Almacen.pedirPersistencia()`.
  - Si los datos están dañados, muestra el error y desactiva todos los botones de guardar.
  - Expone `App.estado` y `App.guardar()`, que llama a `Almacen.guardar` y muestra el error si falla.
  - Expone `App.ir(pantalla)` para la navegación y `App.mensaje(texto, tipo)` para los mensajes de éxito o error. `App.confirmar(texto)` usa `window.confirm`.
  - Arranca en la pantalla Presupuestos. Cada archivo de `js/ui/` se registra con `App.registrar(nombre, { mostrar })`.

**Checkpoint**: `index.html` abre sin errores en la consola de Chrome y Edge con `file://`, el menú navega entre secciones vacías y `pruebas.html` muestra la sección Formato en verde.

---

## Phase 3: User Story 1 - Crear un presupuesto con los cálculos automáticos (Priority: P1) 🎯 MVP

**Goal**: La freelancer crea un presupuesto con cliente, tipo y líneas manuales, ve los totales al momento y lo guarda con número AAAA-NNN. Puede reutilizar clientes guardados.

**Independent Test**: Crear un presupuesto con líneas escritas a mano, sin catálogo ni datos de la profesional. Comprobar los importes de la tabla de reglas de negocio, la numeración 2026-001 y 2026-002, la validez a 30 días y el relleno automático con un cliente guardado. Corresponde a los pasos 3 a 7 y 11 a 15 de [quickstart.md](quickstart.md).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [US1] Añadir a `tests/pruebas.js` la sección Cálculos:
  - **Importes de línea**: `Calculos.importeLinea(100, 75000)` = 75000, `(200, 4500)` = 9000, `(300, 12000)` = 36000, `(150, 4000)` = 6000 y `(150, 33)` = 50, redondeado.
  - **Base**: con 2 × 50,00 € y 3 × 20,00 € da 16000.
  - **Totales de una línea de 100,00 €**:
    - Particular: IVA 2100, retención 0 y total 12100.
    - Empresa al 15 %: 2100, 1500 y 10600.
    - Autónomo al 7 %: 2100, 700 y 11400.
  - **Ejemplo completo** de 1 × 750 €, 2 × 45 € y 3 × 120 €:
    - Empresa al 15 %: base 120000, IVA 25200, retención 18000 y total 127200.
    - Al 7 %: retención 8400 y total 136800.
    - Particular: total 145200.
  - **Caso de comprobación**: base 100000 al 15 % da IVA 21000, retención 15000 y total 106000.
  - **Particular con porcentaje guardado**: un particular con `porcentajeRetencion` 15 da retención 0 (CL3).
  - **Validez**: `Calculos.fechaValidez("2026-10-23")` = «2026-11-22» y `("2026-12-15")` = «2027-01-14».
- [X] T011 [US1] Añadir a `tests/pruebas.js` la sección Numeración, con `Numeracion.siguiente(contadores, fechaEmision)`, que devuelve `{ numero, contadores }`:
  - `({}, "2026-03-01")` → «2026-001» con `{ "2026": 1 }`.
  - `({ "2026": 1 }, …)` → «2026-002».
  - `({ "2026": 3 }, …)` → «2026-004». Representa el caso de haber borrado el 2026-002 y que no se reutilice (FR-013).
  - `({ "2026": 5 }, "2027-01-02")` → «2027-001» sin tocar el contador de 2026.
  - `({ "2026": 999 }, …)` → «2026-1000».
  - La función no modifica el objeto que recibe.
- [X] T012 [US1] Añadir a `tests/pruebas.js` la sección Validación de presupuesto:
  - Línea sin concepto → «Escribe un concepto para esta línea.»
  - Cantidad 0 o negativa → «La cantidad debe ser mayor que cero.»
  - Precio -500 → «El precio debe ser igual o superior a 0 €.»
  - Precio 0 es válido.
  - Cliente sin nombre → «Escribe el nombre o la razón social del cliente.»
  - Un presupuesto sin líneas se puede guardar, porque no hay errores de guardado.
  - Un concepto de 201 caracteres → «Este texto admite como máximo 200 caracteres.» Unas observaciones de 1.001 caracteres → «Este texto admite como máximo 1000 caracteres.» (FR-034)
  - `Validacion.normalizarRetencion("particular", 15)` = 0, `("empresa", 0)` = 15, `("autonomo", 7)` = 7 y `("empresa", 99)` = 15.

### Implementation for User Story 1

- [X] T013 [P] [US1] Implementar `window.Calculos` en `js/calculos.js`. Es puro: no accede al DOM ni al almacenamiento.
  - Constante `IVA = 21`. `redondear(x)` usa `Math.round`, válido porque todos los valores son no negativos.
  - `importeLinea(cantidadCentesimas, precioCentimos)` = redondear(cantidad × precio / 100).
  - `totales(presupuesto)` devuelve `{ baseCentimos, ivaCentimos, retencionCentimos, totalCentimos }`. Aplica retención 0 si `cliente.tipo === "particular"`, sea cual sea el porcentaje guardado.
  - `fechaValidez(fechaEmision)` suma 30 días naturales en hora local, sin usar UTC.
  - Las pruebas de T010 deben quedar en verde.
- [X] T014 [P] [US1] Implementar `window.Numeracion.siguiente(contadores, fechaEmision)` en `js/numeracion.js`, según el apartado de contadores de [data-model.md](data-model.md).
  - Toma el año de la fecha de emisión, incrementa una copia del contador y rellena el número a tres cifras.
  - Nunca decrementa.
  - Las pruebas de T011 deben quedar en verde.
- [X] T015 [P] [US1] Implementar en `js/validacion.js` las funciones `Validacion.validarLinea`, `validarCliente`, `validarPresupuesto` y `normalizarRetencion`. Las tres primeras devuelven una lista de `{ campo, mensaje }`, vacía si todo es correcto. Reglas de [data-model.md](data-model.md):
  - Concepto: «No vacío, máximo 200 caracteres».
  - `cantidadCentesimas`: «Mayor que 0».
  - `precioCentimos`: «Igual o mayor que 0».
  - Nombre del cliente: «No vacío, máximo 200 caracteres».
  - NIF del cliente: «Máximo 20 caracteres».
  - Email: texto libre, no se valida el formato.
  - Tipo: `particular` / `empresa` / `autonomo`.
  - Observaciones: «Máximo 1.000 caracteres».
  - Cualquier texto que supere su máximo devuelve «Este texto admite como máximo N caracteres.» (FR-034).
  - `normalizarRetencion(tipo, porcentaje)` devuelve 0 para particular. Para empresa o autónomo devuelve 7 si el porcentaje es 7 y 15 en cualquier otro caso.
  - Las pruebas de T012 deben quedar en verde.
- [X] T016 [US1] Construir el editor en `js/ui/editor.js`, según el apartado 2 de [contracts/pantallas.md](contracts/pantallas.md).
  - **Cabecera**: el número, o «Sin número (se asigna al guardar)» si es nuevo. Si el presupuesto no está guardado, la fecha de emisión y la de validez se calculan con `Formato.hoy()` y llevan la nota «(provisional)». Si está guardado, se muestra su `fechaEmision`. La fecha nunca se puede editar (FR-014). La validez sale de `Calculos.fechaValidez`.
  - **Cliente**: campos de nombre o razón social, NIF/CIF, email y tipo (Particular, Empresa o Autónomo).
  - **Retención**: el selector 15 % / 7 % solo se ve con Empresa o Autónomo. Propone el 15 %, también al pasar de Particular a Empresa o Autónomo (FR-023). Con Particular se oculta y la retención es 0 (FR-022).
  - **Líneas**: tabla con Concepto, Cantidad, Precio unitario, Importe y un botón para quitar la línea. Botón «Añadir línea manual». Las entradas se leen con `Formato.leerCantidad` y `Formato.leerImporte`.
  - **Observaciones**: área de texto opcional.
  - **Totales**: base, IVA (21 %), retención con signo menos y total. Se recalculan con cada evento `input` (FR-025).
  - **Botón «Volver»**: regresa a Presupuestos.
- [X] T017 [US1] Implementar «Guardar» en `js/ui/editor.js`.
  - Ejecuta `Validacion.validarPresupuesto` y muestra cada mensaje junto a su campo, más un resumen arriba. Si hay errores, no guarda (FR-015).
  - En el primer guardado fija `fechaEmision = Formato.hoy()` y, con esa fecha, asigna el número con `Numeracion.siguiente(App.estado.contadores, fechaEmision)` y guarda los contadores nuevos (FR-012, FR-014).
  - Al editar, conserva el número (FR-013).
  - Copia los datos del cliente dentro del presupuesto (FR-008c) y guarda `porcentajeRetencion` normalizado.
  - Persiste con `App.guardar()` y muestra «Presupuesto 2026-001 guardado.», con el número real.
  - Si `App.guardar()` falla, no asigna el número y conserva lo escrito.
- [X] T018 [US1] Añadir la elección de cliente guardado en `js/ui/editor.js` (FR-008b).
  - Un selector «Elegir cliente guardado» con la lista de `App.estado.clientes` y la opción «Cliente nuevo».
  - Al elegir un cliente se rellenan sus campos y su tipo, y se aplica la retención propuesta del 15 % si es empresa o autónomo.
  - Con «Cliente nuevo» aparece la casilla «Guardar en mis clientes». Si está marcada, al guardar se añade el cliente a `App.estado.clientes` con `Almacen.nuevoId()`.
  - Se guarda `cliente.clienteGuardadoId` cuando proceda.
- [X] T019 [P] [US1] Construir la pantalla Clientes en `js/ui/clientes.js`, según el apartado 3 de [contracts/pantallas.md](contracts/pantallas.md) (FR-008a).
  - Tabla con Nombre, NIF/CIF, Email y Tipo, y las acciones Nuevo, Editar y Borrar.
  - El formulario valida con `Validacion.validarCliente`.
  - Borrar pide confirmar con «¿Seguro que quieres borrar a {nombre}? Sus presupuestos no cambiarán.»
  - Editar o borrar un cliente nunca toca `App.estado.presupuestos` (FR-008c).
- [X] T020 [US1] Construir la versión mínima de la pantalla Presupuestos en `js/ui/presupuestos.js`.
  - Botón «Nuevo presupuesto», que abre el editor vacío.
  - Muestra «Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.» solo si `App.estado.presupuestos` está vacío.
  - Si hay presupuestos guardados, muestra «Tienes 1 presupuesto guardado.» o «Tienes N presupuestos guardados.», según el número real. La tabla para abrirlos se añade en US5 (T032), así que en el MVP no se pueden reabrir.

**Checkpoint**: User Story 1 es completamente funcional. Las secciones Cálculos, Numeración y Validación de `pruebas.html` están en verde, y se cumplen los escenarios 1 a 11 de la HU1 de la spec.

---

## Phase 4: User Story 2 - Generar el PDF del presupuesto (Priority: P2)

**Goal**: Descargar con un clic un PDF que cumpla [contracts/pdf.md](contracts/pdf.md), sin la palabra «factura».

**Independent Test**: Con un presupuesto válido de US1, pulsar «Descargar PDF» y revisar el archivo contra [contracts/pdf.md](contracts/pdf.md). Corresponde a los pasos 8, 13, 17 y 18 de [quickstart.md](quickstart.md). Sin datos de la profesional aparece el aviso y se puede continuar, así que no depende de US3.

### Tests for User Story 2 ⚠️

- [X] T021 [US2] Añadir a `tests/pruebas.js` la sección Requisitos del PDF, con `Validacion.requisitosPdf(presupuesto, profesional)`, que devuelve `{ bloqueo, aviso }`:
  - Sin líneas → bloqueo «Añade al menos una línea para poder descargar el presupuesto.»
  - Con líneas y la profesional sin nombre o NIF → bloqueo `null` y aviso «Faltan tus datos (nombre y NIF). Puedes completarlos en «Mis datos». ¿Descargar el PDF igualmente?»
  - Con todo completo → ambos `null`.

### Implementation for User Story 2

- [X] T022 [US2] Implementar `Validacion.requisitosPdf` en `js/validacion.js` (FR-016, FR-030). Las pruebas de T021 deben quedar en verde.
- [X] T023 [P] [US2] Implementar `window.Pdf.generar(presupuesto, profesional)` en `js/pdf.js` con `window.jspdf.jsPDF` y el complemento autotable, siguiendo [contracts/pdf.md](contracts/pdf.md) punto por punto.
  - **Página**: A4 vertical.
  - **Cabecera**: el logo si existe, con formato PNG o JPEG según el prefijo del dataURL y escalado a 40 mm de alto como máximo. Debajo van el nombre, el NIF, el teléfono, el email y la dirección, omitiendo los vacíos.
  - **Título y fechas**: «PRESUPUESTO» y «Nº 2026-001». Después, «Fecha de emisión: dd/mm/aaaa» y «Válido hasta: dd/mm/aaaa».
  - **Cliente**: bloque «Cliente» con el nombre, y el NIF/CIF y el email si existen.
  - **Tabla de líneas**: columnas Concepto, Cantidad, Precio unitario e Importe, formateadas con `Formato`.
  - **Totales**, a la derecha:
    - Base imponible.
    - IVA (21 %).
    - «Retención IRPF (15 %)» o «(7 %)» con «-180,00 €» usando el guion normal, solo si es mayor que 0.
    - TOTAL en negrita.
  - **Observaciones**: solo si existen.
  - **Archivo**: se guarda como `Presupuesto-AAAA-NNN.pdf`.
  - **Prohibiciones**: ningún texto fijo contiene «factura» y no aparece ninguna marca de la aplicación (FR-028, FR-029, FR-029a).
  - **Datos vacíos**: si la profesional no tiene datos, la cabecera queda vacía y el resto del PDF se genera igual (FR-030).
  - **Caracteres**: generar un PDF de prueba con «Diseño», «Adaptación», «Ñandú» y «1.234,56 €», y comprobar que todo se ve bien. Si alguno falla, incrustar una fuente con esos caracteres en `vendor/` y anotarla en `vendor/VERSIONES.md` (research R4).
- [X] T024 [US2] Añadir el botón «Descargar PDF» en `js/ui/editor.js`.
  - Primero evalúa `Validacion.requisitosPdf`. Si hay bloqueo, por ejemplo porque no hay líneas, muestra el mensaje y no guarda nada, para no gastar un número (FR-016, FR-027a).
  - Si el presupuesto es nuevo o tiene cambios, lo guarda como en T017, para que tenga número. Si hay errores de validación, no continúa (FR-027a).
  - Después, si `requisitosPdf` devolvió un aviso, lo muestra. Si hay aviso, pide confirmación con `App.confirmar` y continúa solo si se acepta.
  - Por último llama a `Pdf.generar(presupuesto, App.estado.profesional)`.

**Checkpoint**: Las historias 1 y 2 funcionan. El PDF descargado cumple el contrato y se genera sin conexión a internet.

---

## Phase 5: User Story 3 - Configurar los datos de la profesional (Priority: P3)

**Goal**: La profesional introduce una vez su nombre, NIF, contacto y logo, y aparecen en todos los PDF.

**Independent Test**: Rellenar «Mis datos» con logo, cerrar y reabrir el navegador, comprobar que todo sigue ahí y que aparece en un PDF nuevo. Comprobar que sin logo el PDF sale bien. Corresponde al paso 1 de [quickstart.md](quickstart.md).

### Tests for User Story 3 ⚠️

- [X] T025 [US3] Añadir a `tests/pruebas.js` la sección Validación de datos y logo:
  - `Validacion.validarLogo({ type: "image/gif", size: 1000 })` → «El logo debe ser una imagen PNG o JPG de 500 KB como máximo.» Lo mismo con `{ type: "image/png", size: 600 * 1024 }`.
  - `{ type: "image/jpeg", size: 100 * 1024 }` es válido.
  - `Validacion.validarProfesional` rechaza un nombre de 121 caracteres, acepta todos los campos vacíos y acepta cualquier texto en el email, como «ana@», porque el email no se valida.

### Implementation for User Story 3

- [X] T026 [US3] Implementar en `js/validacion.js` las funciones `validarLogo(archivo)` y `validarProfesional(datos)`. Reglas de [data-model.md](data-model.md):
  - Nombre: «Máximo 120 caracteres».
  - NIF: «Máximo 20 caracteres. No se valida el formato en v0».
  - Teléfono: «Máximo 30 caracteres».
  - Email: texto libre, no se valida el formato.
  - Dirección: «Máximo 200 caracteres».
  - Logo: «Solo PNG o JPG, de 500 KB como máximo».
  - Las pruebas de T025 deben quedar en verde.
- [X] T027 [P] [US3] Construir la pantalla Mis datos en `js/ui/mis-datos.js`, según el apartado 5 de [contracts/pantallas.md](contracts/pantallas.md).
  - Campos: nombre, NIF, teléfono, email y dirección.
  - El logo se elige con un selector de archivo que acepta PNG y JPG. Se valida con `Validacion.validarLogo`, se lee con `FileReader` como dataURL y se muestra una vista previa. Hay un botón «Quitar logo».
  - «Guardar» persiste con `App.guardar()` y muestra «Tus datos se han guardado.»
  - No hay ningún campo de retención (FR-002).

**Checkpoint**: Los datos y el logo persisten tras reiniciar el navegador y aparecen en el PDF de US2.

---

## Phase 6: User Story 4 - Mantener un catálogo de servicios (Priority: P4)

**Goal**: Mantener el catálogo y añadir sus servicios a un presupuesto como líneas independientes.

**Independent Test**: Dar de alta servicios, reiniciar el navegador, añadir uno a un presupuesto y cambiar su precio en la línea sin que cambie el catálogo. Corresponde a los pasos 2, 4 y 16 de [quickstart.md](quickstart.md).

### Tests for User Story 4 ⚠️

- [X] T028 [US4] Añadir a `tests/pruebas.js` la sección Catálogo:
  - `Validacion.validarServicio` rechaza un nombre vacío y `precioCentimos` -1, y acepta un precio 0.
  - `Calculos.lineaDesdeServicio({ nombre: "Diseño de identidad visual", precioCentimos: 75000 })` devuelve `{ concepto: "Diseño de identidad visual", cantidadCentesimas: 100, precioCentimos: 75000 }` como objeto nuevo, sin referencia al servicio.

### Implementation for User Story 4

- [X] T029 [US4] Implementar `Validacion.validarServicio` en `js/validacion.js` y `Calculos.lineaDesdeServicio` en `js/calculos.js` (FR-005).
  - Nombre: «No vacío, máximo 200 caracteres».
  - `precioCentimos`: «Igual o mayor que 0».
  - Las pruebas de T028 deben quedar en verde.
- [X] T030 [P] [US4] Construir la pantalla Catálogo en `js/ui/catalogo.js`, según el apartado 4 de [contracts/pantallas.md](contracts/pantallas.md) (FR-004).
  - Tabla con Servicio y Precio habitual, y las acciones Nuevo, Editar y Borrar. Borrar pide confirmar con «¿Seguro que quieres borrar «{nombre}» del catálogo? Tus presupuestos no cambiarán.»
  - Valida con `Validacion.validarServicio` y persiste con `App.guardar()`.
  - Nunca modifica `App.estado.presupuestos` (FR-007).
- [X] T031 [US4] Añadir el botón «Añadir del catálogo» en `js/ui/editor.js`.
  - Abre una lista de los servicios con su precio. Al elegir uno, se añade `Calculos.lineaDesdeServicio(servicio)` y se recalculan los totales.
  - La línea queda editable y es independiente del catálogo (FR-006).
  - El botón está desactivado si el catálogo está vacío.

**Checkpoint**: Con el catálogo creado, un presupuesto de tres líneas del catálogo se crea y descarga en menos de 2 minutos (SC-001).

---

## Phase 7: User Story 5 - Consultar y retomar presupuestos guardados (Priority: P5)

**Goal**: Listar los presupuestos guardados y poder abrirlos, editarlos, descargarlos de nuevo o borrarlos sin reutilizar su número.

**Independent Test**: Guardar dos presupuestos, reiniciar el navegador, verlos en el listado, editar uno conservando su número, y borrar otro comprobando que su número no se reutiliza. Corresponde a los pasos 9 y 10 de [quickstart.md](quickstart.md).

### Implementation for User Story 5

- [X] T032 [US5] Completar la tabla de la pantalla Presupuestos en `js/ui/presupuestos.js` (FR-017, FR-018).
  - Columnas Número, Cliente, Fecha de emisión y Total. El total se calcula con `Calculos.totales` y se muestra con `Formato.importe`.
  - El orden es por `fechaEmision` descendente y, a igual fecha, por número descendente.
  - **Acciones por fila**:
    - Abrir: lleva al editor con ese presupuesto.
    - Descargar PDF: sigue el mismo flujo de requisitos y aviso que T024.
    - Borrar: pide confirmar con «¿Seguro que quieres borrar el presupuesto 2026-002? Su número no se volverá a usar.» Lo quita de `App.estado.presupuestos` sin tocar `App.estado.contadores` y llama a `App.guardar()`.
- [X] T033 [US5] Permitir abrir un presupuesto existente en `js/ui/editor.js`.
  - Carga una copia del presupuesto con su número y su fecha de emisión original, y recalcula los totales.
  - Al guardar, conserva el número (FR-013).
  - «Volver» regresa al listado actualizado.

**Checkpoint**: Las cinco historias funcionan de forma independiente.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Escribir la guía de uso en español de España, para una persona no técnica, en `LEEME.md`:
  - Cómo abrir `index.html` con doble clic.
  - Usar siempre el mismo navegador, Chrome o Edge.
  - No borrar los datos de navegación, porque ahí se guardan los presupuestos.
  - La aplicación funciona sin internet.
  - Cómo comprobar los cálculos abriendo `pruebas.html`.
- [X] T035 Buscar «factura», sin distinguir mayúsculas, en `index.html`, `js/`, `js/ui/` y `css/`. Debe haber cero apariciones (FR-029).
- [X] T036 Revisar que todos los textos visibles de `index.html` y `js/ui/*.js` coinciden exactamente con los mensajes de [contracts/pantallas.md](contracts/pantallas.md) y están en español de España (FR-033).
- [X] T037 Abrir `pruebas.html` en Chrome y en Edge y confirmar «Todas las pruebas superadas» (SC-002).
- [ ] T038 Ejecutar los 22 pasos de [quickstart.md](quickstart.md) en Chrome y en Edge, y anotar el resultado de cada paso al final de `specs/001-presupuestos-pro-v0/quickstart.md`. El paso 20 es una prueba con una persona sin conocimientos técnicos que solo cuenta con `LEEME.md` (SC-006).
  - Estado a 2026-10-27: 19 de 22 pasos verificados de forma automática en Chrome y Edge. Quedan pendientes el 19 (cronómetro), el 20 (persona no técnica) y la parte manual del 21 (selector de archivos). Los resultados están al final de quickstart.md.
- [X] T039 Repasar el Constitution Check de [plan.md](plan.md) contra el código final. No debe haber funciones fuera de la spec (principio III) ni dependencias aparte de las de `vendor/` (principio I).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (fase 1)**: no depende de nada.
- **Foundational (fase 2)**: depende de Setup y bloquea todas las historias.
- **Historias (fases 3 a 7)**: dependen de la fase 2. Se recomienda hacerlas en orden de prioridad, de P1 a P5.
- **Polish (fase 8)**: depende de todas las historias.

### User Story Dependencies

- **US1 (P1)**: depende solo de la fase 2.
- **US2 (P2)**: necesita un presupuesto guardado, así que depende de US1. No depende de US3, porque la falta de datos de la profesional solo genera un aviso.
- **US3 (P3)**: el formulario es independiente tras la fase 2. Para verlo en el PDF hace falta US2.
- **US4 (P4)**: la pantalla Catálogo es independiente tras la fase 2. T031 depende del editor de US1.
- **US5 (P5)**: depende de US1 para guardar y editar, y de US2 para descargar desde el listado.

### Within Each User Story

- Las pruebas en `tests/pruebas.js` se escriben primero y deben fallar.
- Después van las funciones puras de `js/`, la pantalla y su integración en el editor.
- Varias tareas comparten archivo: `tests/pruebas.js` (T005, T010, T011, T012, T021, T025, T028), `js/validacion.js` (T015, T022, T026, T029) y `js/ui/editor.js` (T016, T017, T018, T024, T031, T033). Las tareas que comparten archivo se hacen en orden y no van en paralelo.

### Parallel Opportunities

- **Setup**: T002 y T003.
- **Foundational**: T004 y T007 en paralelo. T006 va después de T005, y T008 y T009 van al final.
- **US1**: T013, T014 y T015 son archivos distintos y van en paralelo cuando T010, T011 y T012 estén escritas. T019, en `clientes.js`, va en paralelo con T016 a T018, en `editor.js`.
- **US2**: T023, en `pdf.js`, va en paralelo con T021 y T022.
- **Entre historias**: T027 (`mis-datos.js`) y T030 (`catalogo.js`) pueden hacerse en paralelo con el trabajo de US1 o US2 en `editor.js`.

---

## Parallel Example: User Story 1

```text
# Tras escribir las pruebas T010, T011 y T012 en tests/pruebas.js, lanzar a la vez:
Task: "T013 Implementar window.Calculos en js/calculos.js"
Task: "T014 Implementar window.Numeracion en js/numeracion.js"
Task: "T015 Implementar las validaciones de presupuesto en js/validacion.js"

# En paralelo con el editor (T016 a T018, en js/ui/editor.js):
Task: "T019 Construir la pantalla Clientes en js/ui/clientes.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar la fase 1 de Setup.
2. Completar la fase 2 Foundational, que bloquea todo lo demás.
3. Completar la fase 3, de la US1.
4. **Parar y validar**: `pruebas.html` en verde y los escenarios de la HU1 comprobados a mano.
5. Enseñar la versión a la usuaria de ejemplo. Ya calcula, numera y guarda presupuestos. Todavía no genera el PDF ni permite reabrir los presupuestos guardados, que llegan con US2 y US5.

### Incremental Delivery

1. Setup y Foundational dejan la base lista.
2. US1 calcula y numera presupuestos. Es el MVP.
3. US2 añade el PDF, que ya sustituye al Excel actual.
4. US3 pone la marca de la profesional en el PDF.
5. US4 añade el catálogo y la rapidez de SC-001.
6. US5 añade el listado, la edición y el borrado.
7. Polish cierra con la guía, las revisiones y la validación completa.

---

## Notes

- [P] marca tareas en archivos distintos y sin dependencias pendientes.
- [USn] enlaza cada tarea con su historia de la spec.
- Se valida cada checkpoint antes de pasar a la siguiente fase.
- El proyecto no es un repositorio git. Si se inicializa, conviene hacer un commit por tarea o por grupo lógico.
- No se debe añadir nada que no esté en la spec (principio III). Cualquier idea nueva se propone primero para la spec.
