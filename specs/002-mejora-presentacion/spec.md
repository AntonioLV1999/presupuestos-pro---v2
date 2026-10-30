# Feature Specification: Mejora de presentación de PresupuestosPro

**Feature Branch**: `002-mejora-presentacion-rediseño`

**Created**: 2026-10-27

**Última revisión**: 2026-10-30 (R2 — dirección visual «Despacho»)

**Status**: Revisión prevista. La 002 está **Publicada** en `main`; esta revisión pasa a **En Curso** al ejecutar `/speckit.plan` y vuelve a **Publicada** en el merge.

**Input**: User description (R1, 2026-10-27): "Mejorar la presentación de PresupuestosPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente: (1) página de inicio con navegación a las cuatro secciones, resumen de actividad y navegación común visible en todas las páginas; (2) rediseño visual profesional y sobrio de toda la aplicación y de la plantilla del PDF, con etiquetas visuales de vigencia (Vigente, Caducado) deducidas de la fecha de validez; los estados Borrador, Enviado, Aceptado y Rechazado quedan fuera (ver Fuera de alcance). Mobile-first, español de España, sin cambios en lógica de negocio, cálculos, API ni esquema de datos."

**Input** (R2, 2026-10-30): "Reescribir esta misma spec, sin crear una nueva, para sustituir la dirección visual por la dirección «Despacho» descrita en `pre-spec-despacho.md`: sistema editorial de papel cálido y tinta, con un acento burdeos de uso restringido, separación por filetes en lugar de cajas, dos familias tipográficas con papeles disjuntos y todos los números alineados. El alcance funcional de la 002 y todas sus garantías de no regresión se mantienen intactos."

## Historial de revisiones

| Rev | Fecha | Alcance |
|---|---|---|
| **R1** | 2026-10-27 | Versión publicada: inicio, navegación común, resumen de actividad, rediseño sobrio (azul marino de acento), etiquetas de vigencia y nueva plantilla de PDF. |
| **R2** | 2026-10-30 | **Esta revisión.** Sustituye la dirección visual por «Despacho». Modifica FR-008, FR-011, FR-016 y SC-006; añade FR-023 a FR-030 y SC-011 a SC-016; reescribe las historias 3, 5 y 6. **No cambia** el alcance funcional de R1 (FR-001 a FR-007) ni ninguna garantía de no regresión (FR-019 a FR-022). Origen: [`pre-spec-despacho.md`](pre-spec-despacho.md). |

> **Nota de numeración**: los requisitos FR-023 a FR-030 pertenecen a la serie propia de esta spec 002. La spec 001 tiene sus propios FR-028 a FR-030 con otro significado (contenido obligatorio del PDF); cuando esta spec se refiere a ellos lo hace siempre diciendo «spec 001, FR-0xx».

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pantalla de inicio y navegación común (Priority: P1)

Al abrir la aplicación, la profesional ve una pantalla de inicio con accesos claros a Presupuestos, Clientes, Catálogo y Perfil (los datos de la profesional, que antes se llamaban «Mis datos») y un pequeño resumen de su actividad. En cualquier pantalla ve siempre una navegación común para pasar de una sección a otra sin usar el botón «atrás» del navegador.

**Why this priority**: Es el cambio funcional de la mejora: da un punto de entrada y orientación. Es independiente del rediseño visual y aporta valor por sí solo. **Entregado en R1; R2 no lo modifica.**

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

**Why this priority**: Aporta orientación, pero el inicio y la navegación funcionan sin él. **Entregado en R1; R2 solo cambia su aspecto, no sus cifras.**

**Independent Test**: Con presupuestos vigentes y caducados, comprobar que las cifras del inicio coinciden con el listado de presupuestos.

**Acceptance Scenarios**:

1. **Given** presupuestos guardados, **When** se abre el inicio, **Then** se muestra el número total de presupuestos y cuántos están vigentes y cuántos caducados.
2. **Given** que no hay ningún dato guardado, **When** se abre el inicio, **Then** se muestran los contadores a cero y un mensaje que invita a crear el primer presupuesto, con acceso directo.
3. **Given** que se crea, modifica o borra un presupuesto, **When** se vuelve al inicio, **Then** las cifras reflejan el cambio.
4. **Given** el inicio con el resumen visible, **When** se observa junto al botón «Nuevo presupuesto», **Then** el botón forma parte visualmente de un bloque de la pantalla y no queda suelto entre dos grupos de contenido.

---

### User Story 3 - Dirección visual «Despacho» (Priority: P1 en R2)

Toda la aplicación adopta una apariencia de **documento bien compuesto**, no de panel de herramienta: fondo de papel cálido, texto en tinta, un único color de acento usado con avaricia, y bloques separados por líneas finas y espacio en lugar de cajas con contorno. Los títulos y rótulos usan una tipografía con carácter; los textos corrientes y **todos los números** usan otra, pensada para leer cifras en columna.

**Why this priority**: Es el motivo de la revisión R2. El aspecto del presupuesto forma parte de cómo el cliente percibe a la profesional y su tarifa.

**Independent Test**: Recorrer las cinco pantallas en móvil y en ordenador y comprobar que comparten paleta, espaciado y tratamiento tipográfico; que no hay ninguna banda de color de cabecera; y que se distingue a simple vista título, tabla, formulario y totales.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se compara con las demás, **Then** usan la misma paleta, la misma escala de espaciado y las mismas dos tipografías, cada una en su papel.
2. **Given** cualquier pantalla, **When** se observa la zona superior, **Then** la navegación común aparece sobre el mismo papel que el resto de la página, sin una banda de color de fondo.
3. **Given** la navegación común, **When** se mira qué sección está activa, **Then** la sección actual se distingue por un único recurso visual, no por dos a la vez.
4. **Given** el título de una pantalla, **When** se lee junto a la navegación, **Then** no es una simple repetición de la etiqueta de la sección: aporta información adicional.
5. **Given** un cambio de color decidido en el futuro, **When** se aplica en su único punto de definición, **Then** se refleja en todas las pantallas y en el PDF sin tocar cada una por separado.
6. **Given** el editor de presupuesto, **When** se observan líneas y totales, **Then** el total final es, con diferencia, el importe más destacado de la pantalla.
7. **Given** un teléfono móvil, **When** se recorre cualquier pantalla, **Then** no hay desplazamiento horizontal, el texto es legible sin ampliar y los controles son fáciles de pulsar.
8. **Given** mensajes de validación y error, **When** aparecen, **Then** son claramente distinguibles de la información normal, no dependen solo del color y siguen en español de España.

---

### User Story 4 - Estados visuales de los presupuestos (Priority: P3)

Cada presupuesto se identifica visualmente con un estado deducido de su fecha de validez, Vigente o Caducado, mediante una etiqueta distinguible por texto y por forma, que **no se confunde con un botón**. No se guardan estados nuevos: Borrador, Enviado, Aceptado y Rechazado quedan fuera de esta mejora.

**Why this priority**: Ayuda a ver qué presupuestos han vencido, sin cambiar los datos. **R2 corrige que la etiqueta se leyera como un botón más de la fila.**

**Independent Test**: Con un presupuesto vigente y otro con la fecha de validez pasada, comprobar en el listado que cada uno muestra una etiqueta diferente, que no depende solo del color y que nadie intenta pulsarla.

**Acceptance Scenarios**:

1. **Given** el listado de presupuestos, **When** se observan, **Then** cada uno muestra la etiqueta Vigente o Caducado, diferenciable de la otra aunque la persona no distinga colores (el texto del estado siempre está visible).
2. **Given** un presupuesto cuya fecha de validez ya ha pasado, **When** se muestra, **Then** aparece como Caducado; si no ha pasado (incluido el último día de validez), aparece como Vigente.
3. **Given** una fila del listado con sus acciones, **When** se mira la etiqueta de estado junto a los botones, **Then** la etiqueta se distingue de un botón sin necesidad de leer su texto.

---

### User Story 5 - PDF con aspecto de documento (Priority: P2)

El PDF que recibe el cliente adopta la misma dirección «Despacho» que la aplicación: títulos y rótulos con carácter, datos e importes en columna alineada, separación por líneas finas y un bloque de total inequívoco. Se lee como un documento emitido por un profesional, no como un volcado de una hoja de cálculo.

**Why this priority**: Es el único contacto del cliente con el producto y el que sostiene la percepción de la tarifa.

**Independent Test**: Generar el PDF de un presupuesto y comprobar que contiene exactamente la misma información que antes, que su aspecto es coherente con la aplicación y que sigue siendo claro impreso en blanco y negro.

**Acceptance Scenarios**:

1. **Given** un presupuesto válido, **When** se genera el PDF, **Then** contiene todos los elementos obligatorios de la spec 001 (FR-028) con los mismos importes, y ninguna mención a «factura».
2. **Given** un PDF con y sin logo, o con datos de la profesional vacíos, **When** se genera, **Then** la maquetación sigue siendo correcta, sin huecos ni solapamientos.
3. **Given** un presupuesto con muchas líneas, **When** se genera, **Then** la tabla continúa de forma legible en varias páginas y el bloque de totales no queda cortado.
4. **Given** un presupuesto en cualquier estado, **When** se genera el PDF, **Then** el PDF no muestra la etiqueta de estado interna de la profesional.
5. **Given** el PDF generado, **When** se observa la tabla de líneas, **Then** su encabezado se distingue por composición y líneas, sin una banda de color de fondo.
6. **Given** el PDF impreso en blanco y negro, **When** lo lee una persona ajena, **Then** sigue identificando sin ambigüedad quién emite, para quién, el número, la fecha de validez y el total.
7. **Given** conceptos con acentos, eñes y el símbolo del euro, **When** se genera el PDF, **Then** todos los caracteres se imprimen correctamente.

---

### User Story 6 - Listados legibles de un vistazo (Priority: P2 en R2)

En el listado de presupuestos y en los demás listados, la profesional compara importes y fechas sin esfuerzo: las cifras quedan alineadas en columna, cada fila se lee de corrido con todos sus elementos a la misma altura, la fila que tiene el ratón encima se resalta, y en una pantalla de ordenador caben más presupuestos sin desplazar la página.

**Why this priority**: Es donde la profesional pasa más tiempo y donde R1 dejó los defectos más visibles (cifras desalineadas, acciones descolgadas respecto a su fila, densidad muy baja). Es comprobable por sí solo.

**Independent Test**: Con al menos tres presupuestos de importes distintos, comprobar en una pantalla de ordenador que las comas decimales quedan en la misma vertical, que los botones de cada fila están a la misma altura que el resto de la fila y que al pasar el ratón la fila se resalta.

**Acceptance Scenarios**:

1. **Given** un listado con varios importes de distinta longitud, **When** se observa la columna de totales, **Then** las comas decimales quedan alineadas en la misma vertical y se pueden comparar de un vistazo.
2. **Given** una fila del listado, **When** se observa de izquierda a derecha, **Then** número, cliente, fecha, total, estado y botones están alineados a la misma altura, sin que ningún grupo quede descolgado.
3. **Given** un listado en una pantalla de ordenador, **When** se pasa el ratón por una fila, **Then** esa fila se resalta de forma perceptible.
4. **Given** una fila con las acciones Abrir, Descargar PDF y Borrar, **When** se observan juntas, **Then** la acción de borrar se distingue de las otras dos por algo más que el color de su texto.
5. **Given** un teléfono móvil, **When** se abre el mismo listado, **Then** sigue presentándose como tarjetas legibles, sin desplazamiento horizontal.

---

### Edge Cases

- Instalación con datos ya guardados: tras la mejora, todos los datos existentes se muestran sin migración ni pérdida.
- Datos guardados ilegibles (spec 001, FR-031a): el inicio y la navegación muestran el mismo aviso y no ocultan el problema.
- Nombres de cliente o conceptos muy largos: no deben romper la maquetación en móvil ni en el PDF.
- Persona que no distingue colores: los estados, los errores y la sección actual no dependen solo del color.
- Pantallas estrechas (320 px de ancho): la navegación común sigue siendo utilizable y los listados siguen colapsando a tarjetas.
- Ordenador donde no está instalada la tipografía de títulos preferida: el texto se compone con la alternativa del sistema prevista y la pantalla sigue siendo legible y ordenada.
- Importes de muy distinta longitud en el mismo listado (por ejemplo, 24,39 € y 1.441,65 €): la columna sigue alineada por la coma decimal.
- Presupuesto con cero líneas o con un único importe: el bloque de total sigue siendo el elemento numérico más destacado.
- PDF impreso o fotocopiado en blanco y negro: ninguna información se pierde al desaparecer el color.

## Requirements *(mandatory)*

### Functional Requirements

**Inicio y navegación** *(sin cambios en R2)*

- **FR-001**: Al abrir la aplicación, la pantalla mostrada por defecto DEBE ser una pantalla de inicio.
- **FR-002**: El inicio DEBE ofrecer accesos claros y diferenciados a Presupuestos, Clientes, Catálogo y Perfil.
- **FR-003**: La sección que antes se llamaba «Mis datos» DEBE llamarse «Perfil» en todos los textos visibles; su contenido y comportamiento no cambian.
- **FR-004**: Todas las pantallas, incluido el editor de presupuesto, DEBEN mostrar una navegación común con acceso a Inicio y a las cuatro secciones, e indicar la sección actual. Mientras se edita un presupuesto, la sección indicada es «Presupuestos».
- **FR-005**: El inicio DEBE mostrar un resumen de actividad con: número total de presupuestos, número de presupuestos vigentes y caducados, número de clientes y número de servicios del catálogo.
- **FR-006**: Si no hay datos, el inicio DEBE mostrar contadores a cero y un acceso directo para crear el primer presupuesto.
- **FR-006a**: El inicio DEBE incluir siempre un botón «Nuevo presupuesto» que abra el editor, integrado visualmente en un bloque de la pantalla y no suelto entre dos grupos de contenido.
- **FR-007**: El resumen DEBE calcularse solo a partir de los datos ya guardados, sin pedir ningún dato nuevo a la profesional.

**Apariencia** *(FR-008 y FR-011 revisados en R2)*

- **FR-008** *(revisado en R2)*: La aplicación DEBE usar **exactamente dos familias tipográficas con papeles disjuntos y excluyentes**: una para títulos, marca y rótulos, y otra para textos corrientes, controles y todos los datos numéricos. La escala de tamaños DEBE seguir estando definida en un único lugar y DEBE presentar un salto perceptible entre el título de pantalla y el título de bloque.
  *(R1 decía: «una única familia tipográfica».)*
- **FR-009**: Los colores DEBEN limitarse a una paleta reducida (neutros, un color de acento y colores para éxito, aviso y error) definida en un único lugar, de modo que cambiarla allí la cambie en toda la aplicación y en el PDF.
- **FR-010**: El espaciado DEBE seguir una escala uniforme definida también en un único lugar.
- **FR-011** *(revisado en R2)*: Títulos, tablas, formularios y bloques de totales DEBEN tener una jerarquía visual clara. El total final del presupuesto DEBE ocupar un escalón tipográfico propio, mayor que el de cualquier otro texto o importe de la pantalla, y DEBE estar separado del resto por una línea de refuerzo.
- **FR-012**: Los mensajes de validación y error DEBEN ser claramente distinguibles de la información normal y no depender solo del color.
- **FR-012a**: Todos los controles interactivos (navegación, botones, campos) DEBEN mostrar un indicador de foco visible y poder usarse con el teclado, también sobre fondos claros.
- **FR-013**: Cada presupuesto DEBE mostrar una etiqueta de estado deducida solo de su fecha de validez: «Caducado» si la fecha de validez es anterior al día actual y «Vigente» en caso contrario; el día actual es la fecha local del ordenador de la profesional. Las etiquetas DEBEN ser visualmente distintas y con el texto siempre visible. NO se almacena ningún estado nuevo ni se añaden los estados Borrador, Enviado, Aceptado y Rechazado.
- **FR-014**: El diseño DEBE seguir siendo mobile-first, sin desplazamiento horizontal de la página en anchos desde 320 px, y con controles táctiles cómodos: al menos 44 px de alto y texto base de al menos 16 px en los campos.
- **FR-015**: El diseño DEBE ser legible y utilizable también en pantallas de ordenador.

**Dirección visual «Despacho»** *(nuevo en R2)*

- **FR-023**: La aplicación DEBE adoptar una dirección visual de documento: fondo de papel cálido, texto en tinta y separación de bloques mediante líneas finas y espacio, en lugar de contornos de caja sobre fondo gris. La navegación común NO DEBE presentarse como una banda de color.
- **FR-024**: Todo dato numérico —importes, fechas, cantidades e identificadores de presupuesto— DEBE componerse en la familia de textos, con cifras de ancho constante, de modo que las columnas numéricas queden alineadas verticalmente. Ningún número puede componerse en la familia de títulos.
- **FR-025**: La sección actual en la navegación común DEBE señalarse mediante **un único** recurso visual, además de la indicación accesible correspondiente.
- **FR-026**: El título de cada pantalla NO DEBE ser una repetición literal y aislada de la etiqueta de la sección actual: DEBE aportar información adicional de contexto. El título DEBE seguir existiendo y siendo el primer encabezado del contenido de la pantalla.
- **FR-027**: La etiqueta de estado de FR-013 NO DEBE ser confundible con un botón: DEBE diferenciarse de los botones de su misma fila en forma, altura y tratamiento de borde.
- **FR-028**: Las filas de los listados DEBEN resaltarse al situar el puntero sobre ellas, y todos los elementos de una misma fila DEBEN quedar alineados verticalmente a la misma altura.
- **FR-029**: Dentro de una misma zona de acciones, la acción destructiva DEBE distinguirse de las no destructivas por algo más que el color de su texto.
- **FR-030**: El color de acento DEBE usarse de forma restringida —marca, señal de sección actual, total y enlaces— y NO DEBE emplearse para rellenar superficies decorativas ni las cifras del resumen de actividad. El color de error y de acción destructiva NO DEBE usarse nunca como relleno de un botón, de modo que no pueda confundirse con el acento.

**PDF** *(FR-016 revisado en R2)*

- **FR-016** *(revisado en R2)*: La plantilla del PDF DEBE reutilizar la misma dirección visual que la aplicación —reparto de papeles entre las dos tipografías, paleta, jerarquía y separación por líneas—, SIN incorporar ningún archivo de tipografía nuevo ni ningún recurso adicional. El encabezado de la tabla de líneas NO DEBE presentarse como una banda de color.
- **FR-017**: El PDF DEBE conservar exactamente el contenido obligatorio de la spec 001 (FR-028 a FR-030), con los mismos importes y sin la palabra «factura».
- **FR-018**: El PDF DEBE mantener una maquetación correcta con y sin logo, con datos opcionales vacíos, con textos largos y con tablas de varias páginas.

**Sin regresión** *(sin cambios en R2)*

- **FR-019**: NO DEBE cambiar ninguna regla de negocio, cálculo, numeración, validación, forma de guardar datos ni límite de la spec 001.
- **FR-020**: NO DEBE cambiar ningún dato ya guardado ni requerirse migración de datos.
- **FR-021**: Todos los textos nuevos o modificados DEBEN estar en español de España, y los importes en euros con formato español.
- **FR-022**: La aplicación DEBE seguir funcionando sin conexión, sin cuentas y sin enviar datos a ningún servidor externo; esto incluye las tipografías, que no pueden depender de recursos externos ni descargarse.

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
- **SC-006** *(revisado en R2)*: En una revisión de todas las pantallas y del PDF solo se observan **dos** familias tipográficas, cada una en su papel declarado —una en títulos y rótulos, otra en textos y en todos los números—, y una paleta de colores limitada.
- **SC-007**: Cambiar el color de acento en su único punto de definición se refleja en el 100 % de las pantallas y en el PDF.
- **SC-008**: Ninguna pantalla presenta desplazamiento horizontal de la página en un ancho de 320 px.
- **SC-009**: Tres personas no técnicas consideran, tras ver el PDF, que el documento tiene aspecto profesional y que puede enviarse a un cliente.
- **SC-010**: El 100 % de los PDF generados mantienen todos los elementos obligatorios y ninguno contiene la palabra «factura».
- **SC-011** *(nuevo en R2)*: En un listado con al menos tres importes de distinta longitud, el 100 % de las comas decimales quedan en la misma vertical, y una persona no técnica dice cuál es el importe mayor en menos de 3 segundos sin leer cifra a cifra.
- **SC-012** *(nuevo en R2)*: Una persona no técnica señala en menos de 3 segundos en qué sección está, sin que se le indique dónde mirar.
- **SC-013** *(nuevo en R2)*: Ninguna de tres personas no técnicas intenta pulsar la etiqueta de estado de un presupuesto creyendo que es un botón.
- **SC-014** *(nuevo en R2)*: En una pantalla de ordenador portátil habitual, se ven al menos 8 presupuestos del listado sin desplazar la página, frente a los 5 de R1.
- **SC-015** *(nuevo en R2)*: Tres personas no técnicas, con el PDF impreso en blanco y negro, identifican en menos de 10 segundos quién emite, para quién es, el número, la fecha de validez y el total.
- **SC-016** *(nuevo en R2)*: Ninguna de tres personas no técnicas pulsa por error la acción de borrar cuando se les pide abrir o descargar un presupuesto del listado.

## Assumptions

*(De R1, vigentes)*

- «Perfil» es el nombre de la sección «Mis datos» ya existente; no es una sección nueva.
- La página de entrada de la aplicación se abre en el navegador del ordenador de la profesional sin necesidad de servidor ni conexión.
- Los estados Borrador, Enviado, Aceptado y Rechazado no se incluyen, en coherencia con la spec 001 y con la restricción de no cambiar datos; podrían proponerse en una spec futura.
- «Caducado» se deduce de la fecha de validez ya existente (emisión + 30 días).
- La profesional sigue siendo una única usuaria en un único ordenador.
- El resumen se limita a recuentos simples; no se añaden estadísticas, informes ni gráficos.
- El PDF no incluye la etiqueta de estado, por ser información interna de la profesional.

*(Nuevas o revisadas en R2)*

- **Estilo «profesional y sobrio»** se concreta como la dirección «Despacho»: papel cálido, tinta, un único acento de uso restringido, separación por líneas finas, sin adornos, sin animaciones llamativas y sin imágenes decorativas. Sigue habiendo un único color de acento.
- Los valores concretos de la dirección (colores, familias tipográficas, tamaños, grosores de línea y densidades) se fijan en el contrato de tema y no en esta spec, para que FR-009 y FR-010 sigan teniendo un único punto de definición.
- Las dos tipografías se eligen entre las ya instaladas en el sistema operativo objetivo, con alternativas de respaldo; no se descarga ninguna (FR-022).
- La tipografía de títulos no se usa en ningún número porque las alternativas de respaldo habituales componen cifras de ancho desigual, lo que rompería la alineación exigida por FR-024. **Esto incluye el total del presupuesto**, que destaca por tamaño y separación, no por cambio de familia.
- El PDF se resuelve con las tipografías que su generador ya ofrece de serie, sin incrustar archivos nuevos (FR-016, FR-022).
- **Sin iconos**: la dirección se expresa solo con tipografía, color y líneas. No se incorpora ninguna librería de iconos ni se dibujan glifos propios, en aplicación del principio de simplicidad de la constitución.
- **Título de pantalla (FR-026)**: por defecto, el título incorpora el recuento de elementos de la sección (por ejemplo, «Presupuestos · 3»). Alternativas revisables en `/speckit-clarify`.
- **Acción destructiva (FR-029)**: por defecto se distingue por su posición al final del grupo de acciones, separada de las demás, además del color. Alternativa revisable en `/speckit-clarify`.
- Se mantienen los mismos puntos de corte responsive de R1; la revisión no añade ninguno.
- La relación con la spec 003 no cambia: el paquete `.zip` seguirá conteniendo los mismos archivos, con el PDF ya rediseñado.

### Fuera de alcance

*(De R1, vigentes)*

- Cambios en cálculos, IVA, retenciones, numeración, validaciones o límites de longitud.
- Cambios en el esquema de datos o en la forma de guardar los datos.
- Estados Borrador, Enviado, Aceptado y Rechazado y cualquier campo para guardarlos.
- Nuevas funcionalidades distintas de las descritas: inicio, navegación común, rediseño y estados visuales.
- Varias plantillas de PDF, temas seleccionables, modo oscuro o personalización de colores por la usuaria.
- Estadísticas, gráficos, informes e importes acumulados en el resumen.
- Envío de correos, cuentas, nube, facturación.

*(Añadido en R2)*

- Librerías de iconos, tipografías descargadas y tipografías incrustadas en el PDF: cualquier recurso que requiera red o añada archivos nuevos al proyecto.
- Rediseño del logo de la profesional o de su tratamiento más allá del encuadre actual.
- Animaciones, transiciones elaboradas, ilustraciones y pantallas vacías ilustradas.
- Nuevos puntos de corte responsive.
- Buscador, filtros, ordenación por columna, paginación, selección múltiple y acciones masivas en el listado de presupuestos: son funcionalidad, no dirección visual, y corresponden a una spec aparte.
- Importar o restaurar la copia de seguridad de la spec 003.
- Renombrado de identificadores internos.
- Internacionalización: los textos visibles siguen en español de España.
