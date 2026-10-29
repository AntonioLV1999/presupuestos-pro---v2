# Feature Specification: Mejora de presentación de PresupuestosPro

**Feature Branch**: `002-mejora-presentacion`

**Created**: 2026-10-27

**Status**: Publicada

**Input**: User description: "Mejorar la presentación de PresupuestosPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente: (1) página de inicio con navegación a las cuatro secciones, resumen de actividad y navegación común visible en todas las páginas; (2) rediseño visual profesional y sobrio de toda la aplicación y de la plantilla del PDF, con etiquetas visuales de vigencia (Vigente, Caducado) deducidas de la fecha de validez; los estados Borrador, Enviado, Aceptado y Rechazado quedan fuera (ver Fuera de alcance). Mobile-first, español de España, sin cambios en lógica de negocio, cálculos, API ni esquema de datos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pantalla de inicio y navegación común (Priority: P1)

Al abrir la aplicación, la profesional ve una pantalla de inicio con accesos claros a Presupuestos, Clientes, Catálogo y Perfil (los datos de la profesional, que hoy se llaman «Mis datos») y un pequeño resumen de su actividad. En cualquier pantalla ve siempre una navegación común para pasar de una sección a otra sin usar el botón «atrás» del navegador.

**Why this priority**: Es el cambio funcional de la mejora: da un punto de entrada y orientación. Es independiente del rediseño visual y aporta valor por sí solo.

**Independent Test**: Abrir la aplicación, comprobar que aparece el inicio, entrar en cada una de las cuatro secciones desde el inicio y volver a cualquier otra sección usando solo la navegación común.

**Acceptance Scenarios**:

1. **Given** la aplicación recién abierta, **When** se accede a su dirección de entrada, **Then** se muestra la pantalla de inicio con cuatro accesos: Presupuestos, Clientes, Catálogo y Perfil.
2. **Given** la pantalla de inicio, **When** la profesional pulsa uno de los accesos, **Then** se abre esa sección con sus datos tal como estaban.
3. **Given** cualquier pantalla (listados, editor de presupuesto, formularios), **When** se mira la parte visible de la página, **Then** aparece la navegación común con acceso a Inicio y a las cuatro secciones, indicando cuál es la sección actual.
4. **Given** un teléfono móvil, **When** se usa la navegación común, **Then** todos sus accesos son alcanzables sin desplazamiento horizontal de la página y se pulsan con comodidad.
5. **Given** un presupuesto en edición con cambios sin guardar, **When** la profesional usa la navegación común para salir, **Then** la aplicación sale del editor sin pedir confirmación y descarta los cambios no guardados, exactamente como hace hoy; la navegación común no guarda ni pierde datos de forma distinta a la actual.

---

### User Story 2 - Resumen de actividad en el inicio (Priority: P2)

En el inicio, la profesional ve de un vistazo cuánta actividad tiene: número de presupuestos guardados, desglosado en vigentes y caducados, y el número de clientes y de servicios del catálogo.

**Why this priority**: Aporta orientación, pero el inicio y la navegación funcionan sin él.

**Independent Test**: Con presupuestos vigentes y caducados, comprobar que las cifras del inicio coinciden con el listado de presupuestos.

**Acceptance Scenarios**:

1. **Given** presupuestos guardados, **When** se abre el inicio, **Then** se muestra el número total de presupuestos y cuántos están vigentes y cuántos caducados.
2. **Given** que no hay ningún dato guardado, **When** se abre el inicio, **Then** se muestran los contadores a cero y un mensaje que invita a crear el primer presupuesto, con acceso directo.
3. **Given** que se crea, modifica o borra un presupuesto, **When** se vuelve al inicio, **Then** las cifras reflejan el cambio.

---

### User Story 3 - Rediseño visual coherente (Priority: P2)

Toda la aplicación tiene una apariencia profesional y sobria: tipografía única, paleta limitada, espaciado uniforme y jerarquía visual clara entre títulos, tablas, formularios y totales. El total de cada presupuesto destaca sobre el resto de importes.

**Why this priority**: Mejora la percepción de calidad, pero no cambia lo que se puede hacer.

**Independent Test**: Recorrer todas las pantallas en móvil y en ordenador y comprobar que comparten tipografía, colores y espaciado, y que se distingue a simple vista título, tabla, formulario y totales.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se compara con las demás, **Then** usan la misma tipografía, los mismos colores y la misma escala de espaciado.
2. **Given** un cambio de color o de tipografía decidido en el futuro, **When** se aplica en un único punto, **Then** se refleja en todas las pantallas sin tocar cada una por separado.
3. **Given** el editor de presupuesto, **When** se observan líneas y totales, **Then** los totales se distinguen claramente de las líneas y el total final es el elemento numérico más destacado.
4. **Given** un teléfono móvil, **When** se recorre cualquier pantalla, **Then** no hay desplazamiento horizontal de la página, el texto es legible sin ampliar y los controles son fáciles de pulsar.
5. **Given** mensajes de validación y error, **When** aparecen, **Then** son claramente distinguibles de la información normal y siguen en español de España.

---

### User Story 4 - Estados visuales de los presupuestos (Priority: P3)

Cada presupuesto se identifica visualmente con un estado deducido de su fecha de validez, Vigente o Caducado, mediante una etiqueta distinguible por color y por texto. No se guardan estados nuevos: Borrador, Enviado, Aceptado y Rechazado quedan fuera de esta mejora.

**Why this priority**: Ayuda a ver qué presupuestos han vencido, sin cambiar los datos.

**Independent Test**: Con un presupuesto vigente y otro con la fecha de validez pasada, comprobar en el listado que cada uno muestra una etiqueta diferente y que no depende solo del color.

**Acceptance Scenarios**:

1. **Given** el listado de presupuestos, **When** se observan, **Then** cada uno muestra la etiqueta Vigente o Caducado, diferenciable de la otra aunque la persona no distinga colores (el texto del estado siempre está visible).
2. **Given** un presupuesto cuya fecha de validez ya ha pasado, **When** se muestra, **Then** aparece como Caducado; si no ha pasado (incluido el último día de validez), aparece como Vigente.

---

### User Story 5 - PDF con la misma imagen profesional (Priority: P2)

El PDF que recibe el cliente adopta la misma identidad visual (tipografía, colores sobrios, jerarquía de títulos, tabla de líneas y bloque de totales) que la aplicación.

**Why this priority**: Es el documento que ve el cliente final.

**Independent Test**: Generar el PDF de un presupuesto y comprobar que contiene exactamente la misma información que antes y que su aspecto es coherente con la aplicación.

**Acceptance Scenarios**:

1. **Given** un presupuesto válido, **When** se genera el PDF, **Then** contiene todos los elementos obligatorios de la spec 001 (FR-028) con los mismos importes, y ninguna mención a «factura».
2. **Given** un PDF con y sin logo, o con datos de la profesional vacíos, **When** se genera, **Then** la maquetación sigue siendo correcta, sin huecos ni solapamientos.
3. **Given** un presupuesto con muchas líneas, **When** se genera, **Then** la tabla continúa de forma legible en varias páginas y el bloque de totales no queda cortado.
4. **Given** un presupuesto en cualquier estado, **When** se genera el PDF, **Then** el PDF no muestra la etiqueta de estado interna de la profesional.

---

### Edge Cases

- Instalación con datos ya guardados: tras la mejora, todos los datos existentes se muestran sin migración ni pérdida.
- Datos guardados ilegibles (spec 001, FR-031a): el inicio y la navegación muestran el mismo aviso y no ocultan el problema.
- Nombres de cliente o conceptos muy largos: no deben romper la maquetación en móvil ni en el PDF.
- Persona que no distingue colores: los estados y los errores no dependen solo del color.
- Pantallas estrechas (320 px de ancho): la navegación común sigue siendo utilizable.

## Requirements *(mandatory)*

### Functional Requirements

**Inicio y navegación**

- **FR-001**: Al abrir la aplicación, la pantalla mostrada por defecto DEBE ser una pantalla de inicio.
- **FR-002**: El inicio DEBE ofrecer accesos claros y diferenciados a Presupuestos, Clientes, Catálogo y Perfil.
- **FR-003**: La sección que hoy se llama «Mis datos» DEBE pasar a llamarse «Perfil» en todos los textos visibles; su contenido y comportamiento no cambian.
- **FR-004**: Todas las pantallas, incluido el editor de presupuesto, DEBEN mostrar una navegación común con acceso a Inicio y a las cuatro secciones, e indicar la sección actual. Mientras se edita un presupuesto, la sección indicada es «Presupuestos».
- **FR-005**: El inicio DEBE mostrar un resumen de actividad con: número total de presupuestos, número de presupuestos vigentes y caducados, número de clientes y número de servicios del catálogo.
- **FR-006**: Si no hay datos, el inicio DEBE mostrar contadores a cero y un acceso directo para crear el primer presupuesto.
- **FR-006a**: El inicio DEBE incluir siempre un botón «Nuevo presupuesto» que abra el editor.
- **FR-007**: El resumen DEBE calcularse solo a partir de los datos ya guardados, sin pedir ningún dato nuevo a la profesional.

**Apariencia**

- **FR-008**: La aplicación DEBE usar una única familia tipográfica con una escala de tamaños definida (título, subtítulo, texto, texto secundario).
- **FR-009**: Los colores DEBEN limitarse a una paleta reducida (neutros, un color de acento y colores para éxito, aviso y error) definida en un único lugar, de modo que cambiarla allí la cambie en toda la aplicación.
- **FR-010**: El espaciado DEBE seguir una escala uniforme definida también en un único lugar.
- **FR-011**: Títulos, tablas, formularios y bloques de totales DEBEN tener una jerarquía visual clara; el total final del presupuesto DEBE ser el importe más destacado.
- **FR-012**: Los mensajes de validación y error DEBEN ser claramente distinguibles de la información normal y no depender solo del color.
- **FR-012a**: Todos los controles interactivos (menú, botones, campos) DEBEN mostrar un indicador de foco visible y poder usarse con el teclado.
- **FR-013**: Cada presupuesto DEBE mostrar una etiqueta de estado deducida solo de su fecha de validez: «Caducado» si la fecha de validez es anterior al día actual y «Vigente» en caso contrario; el día actual es la fecha local del ordenador de la profesional. Las etiquetas DEBEN ser visualmente distintas y con el texto siempre visible. NO se almacena ningún estado nuevo ni se añaden los estados Borrador, Enviado, Aceptado y Rechazado.
- **FR-014**: El diseño DEBE seguir siendo mobile-first, sin desplazamiento horizontal de la página en anchos desde 320 px, y con controles táctiles cómodos: al menos 44 px de alto y texto base de al menos 16 px.
- **FR-015**: El diseño DEBE ser legible y utilizable también en pantallas de ordenador.

**PDF**

- **FR-016**: La plantilla del PDF DEBE reutilizar la misma identidad visual (tipografía, paleta, jerarquía) que la aplicación.
- **FR-017**: El PDF DEBE conservar exactamente el contenido obligatorio de la spec 001 (FR-028 a FR-030), con los mismos importes y sin la palabra «factura».
- **FR-018**: El PDF DEBE mantener una maquetación correcta con y sin logo, con datos opcionales vacíos, con textos largos y con tablas de varias páginas.

**Sin regresión**

- **FR-019**: NO DEBE cambiar ninguna regla de negocio, cálculo, numeración, validación, forma de guardar datos ni límite de la spec 001.
- **FR-020**: NO DEBE cambiar ningún dato ya guardado ni requerirse migración de datos.
- **FR-021**: Todos los textos nuevos o modificados DEBEN estar en español de España, y los importes en euros con formato español.
- **FR-022**: La aplicación DEBE seguir funcionando sin conexión, sin cuentas y sin enviar datos a ningún servidor externo; esto incluye las tipografías, que no pueden depender de recursos externos.

### Key Entities

- **Presupuesto (existente)**: sin cambios en su contenido. Se muestra con una etiqueta de estado (Vigente o Caducado) calculada al mostrarlo, sin guardarse.
- **Resumen de actividad (derivado)**: recuento de presupuestos (total, vigentes y caducados), clientes y servicios, calculado a partir de los datos guardados; no se almacena.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde la pantalla de inicio, la profesional llega a cualquiera de las cuatro secciones con un solo toque o clic.
- **SC-002**: Desde cualquier pantalla de la aplicación se puede llegar a cualquier otra sección con un solo toque o clic, sin usar el botón «atrás».
- **SC-003**: Las cifras del resumen del inicio coinciden al 100 % con el contenido real de los listados.
- **SC-004**: Los datos guardados antes de la mejora siguen disponibles sin cambios en el 100 % de los casos, y todos los escenarios de la spec 001 (importes, numeración, validaciones, PDF) dan los mismos resultados que antes.
- **SC-005**: Una persona no técnica identifica, en menos de 5 segundos y sin ayuda, el estado de cualquier presupuesto del listado.
- **SC-006**: En una revisión de todas las pantallas y del PDF solo se observa una familia tipográfica y una paleta de colores limitada.
- **SC-007**: Cambiar el color de acento en su único punto de definición se refleja en el 100 % de las pantallas.
- **SC-008**: Ninguna pantalla presenta desplazamiento horizontal de la página en un ancho de 320 px.
- **SC-009**: Tres personas no técnicas consideran, tras ver el PDF, que el documento tiene aspecto profesional y que puede enviarse a un cliente.
- **SC-010**: El 100 % de los PDF generados mantienen todos los elementos obligatorios y ninguno contiene la palabra «factura».

## Assumptions

- «Perfil» es el nuevo nombre de la sección «Mis datos» ya existente; no es una sección nueva.
- «Raíz del servidor» se interpreta como la página de entrada de la aplicación, que sigue abriéndose en el navegador del ordenador de la profesional sin necesidad de servidor ni conexión.
- Los estados Borrador, Enviado, Aceptado y Rechazado no se incluyen, en coherencia con la spec 001 y con la restricción de no cambiar datos; podrían proponerse en una spec futura.
- «Caducado» se deduce de la fecha de validez ya existente (emisión + 30 días).
- La profesional sigue siendo una única usuaria en un único ordenador.
- Estilo «profesional y sobrio»: predominio de neutros, un único color de acento, sin adornos, animaciones llamativas ni imágenes decorativas.
- El resumen se limita a recuentos simples; no se añaden estadísticas, informes ni gráficos (siguen fuera de alcance según la spec 001).
- El PDF no incluye la etiqueta de estado, por ser información interna de la profesional.

### Fuera de alcance

- Cambios en cálculos, IVA, retenciones, numeración, validaciones o límites de longitud.
- Cambios en el esquema de datos o en la forma de guardar los datos.
- Estados Borrador, Enviado, Aceptado y Rechazado y cualquier campo para guardarlos.
- Nuevas funcionalidades distintas de las descritas: inicio, navegación común, rediseño y estados visuales.
- Varias plantillas de PDF, temas seleccionables, modo oscuro o personalización de colores por la usuaria.
- Estadísticas, gráficos, informes e importes acumulados en el resumen.
- Envío de correos, cuentas, nube, facturación.
