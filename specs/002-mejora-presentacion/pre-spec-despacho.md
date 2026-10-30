# Pre-especificación — Revisión de la spec 002: dirección visual «Despacho»

> Documento de entrada para reabrir y revisar la spec **002 — Mejora de presentación**.
> **No se abre una spec nueva**: esta revisión sustituye la dirección visual definida en
> [`spec.md`](spec.md) y reescribe sus contratos de tema, pantallas y PDF, manteniendo intactos
> su alcance funcional (inicio, navegación común, resumen de actividad, estados de vigencia) y
> todas sus garantías de no regresión.
>
> **Estado de la 002:** `Publicada` → pasa a `En Curso` al ejecutar `/speckit.plan`, y vuelve a
> `Publicada` en el merge. La fila de la 002 en [`../README.md`](../README.md) se actualiza al cerrar.

---

## Contexto y problema

La 002 cumplió lo que pedía: unificó tipografía, paleta y espaciado, y dejó una fuente única de
color en [`js/tema.js`](../../js/tema.js). El resultado es accesible y sobrio, pero la dirección
visual que eligió —neutros fríos, un único azul marino de acento, todo en cajas blancas con borde
gris— lee hoy como un panel de Bootstrap de 2013 reteñido. El problema no es incumplimiento: es
que los requisitos de la 002 están satisfechos por un diseño que ya no representa bien a la
profesional ante su cliente.

Diagnóstico concreto sobre la interfaz en uso (escritorio, 1900 × 900):

1. **Tipografía sin escala.** `--t-xl` (26 px) para el `h2` de pantalla y `--t-l` (20 px) para los
   títulos de tarjeta compiten en el mismo plano. Los importes no usan cifras tabulares, así que
   `228,00 €`, `24,39 €` y `441,65 €` no alinean las comas aunque la columna esté a la derecha.
   El identificador `2026-003` va en la misma sans proporcional que «Benito Camela».
2. **Color sin significado.** `acento` (`#1f4b78`) pinta a la vez menú, cifras del resumen, títulos
   de acceso y botón primario, tal y como permite el contrato [`contracts/tema.md`](contracts/tema.md).
   `0 Caducados` —el único número que pediría atención si no fuera cero— se pinta igual que el resto.
3. **Espaciado sin ritmo.** En Inicio, el botón «Nuevo presupuesto» de FR-006a queda huérfano entre
   la rejilla `.resumen` y la rejilla `.accesos`, sin pertenecer a ninguna de las dos.
4. **Jerarquía triplicada.** El menú común de FR-004, las cuatro tarjetas `.acceso` de FR-002 y el
   `h2` de pantalla dicen lo mismo: en el listado, el `h2` «Presupuestos» repite literalmente la
   pestaña activa «Presupuestos».
5. **Componentes ambiguos.** La etiqueta de FR-013 (`.estado.vigente`) es una píldora con borde de
   2 px, negrita y la misma altura que los botones de fila: junto a «Abrir» y «Descargar PDF» se
   lee como un cuarto botón.
6. **Estados duplicados o ausentes.** La pestaña activa se marca dos veces (fondo `acento-oscuro`
   **y** `border-bottom` blanco). Las filas de tabla no tienen `:hover` ni selección.
7. **Densidad descompensada.** `table td { vertical-align: top }` en
   [`css/estilos.css:288`](../../css/estilos.css#L288) deja el grupo de acciones ~17 px por debajo
   de la línea base del resto de la fila, idéntico en las tres filas. Y con `main` a
   `max-width: 1100px`, el contenido acaba a media pantalla dejando ~350 px de gris muerto.

Esta revisión no toca funcionalidad: cambia **cómo se ve y cómo se lee**, en pantalla y en el PDF.

---

## Objetivo

Sustituir la dirección visual de la 002 por la dirección **«Despacho»**: un sistema editorial, de
papel cálido y tinta, donde el presupuesto que recibe el cliente parece un **documento** emitido
por un profesional establecido y no un volcado de una hoja de cálculo.

Objetivos medibles de la revisión:

- **O1.** Mantener una sola fuente de verdad de color ([`js/tema.js`](../../js/tema.js)), revaluada
  a la paleta «Despacho», sin colores literales nuevos en `css/estilos.css` ni en `js/pdf.js`.
  Se conserva la garantía SC-007 de la 002.
- **O2.** Escala tipográfica con salto real entre niveles y separación estricta de roles: serif para
  titulares y rótulos, sans con cifras tabulares para todo dato numérico. **Esto obliga a revisar
  FR-008 y SC-006**, que hoy exigen una familia única.
- **O3.** Los siete defectos del diagnóstico, corregidos y verificables uno a uno.
- **O4.** El PDF adopta la misma dirección **sin añadir bytes de fuente ni dependencias**,
  respetando FR-022.
- **O5.** Accesibilidad igual o mejor que la actual: contraste AA en todo par texto/fondo (FR-012),
  foco visible (FR-012a) y nada comunicado solo por color (FR-012, FR-013).

No es objetivo añadir funciones, pantallas ni datos. El alcance funcional de la 002 se mantiene
íntegro.

---

## Usuarios

Los mismos de la 002, sin altas ni bajas. Se detalla qué espera cada uno **de esta revisión**:

**Usuaria principal — la freelance que emite.** Trabaja en Chrome/Edge sobre Windows, abre la app
con doble clic en `index.html`, sin servidor ni conexión. Emite entre 3 y 30 presupuestos al año.
No es diseñadora y no va a configurar nada: recibe la dirección visual ya decidida (coherente con
el «Fuera de alcance» de la 002, que excluye temas seleccionables). Lo que necesita de esta
revisión es que el documento que envía **la represente**: que no parezca hecho con una plantilla
gratuita, porque el aspecto del presupuesto forma parte de cómo se percibe su tarifa.

**Usuario secundario — el cliente que recibe el PDF.** No entra nunca en la aplicación. Su único
contacto con el producto es un PDF abierto en un visor, a menudo impreso o reenviado a una
gestoría. Decide sobre un importe. Necesita localizar en segundos: quién emite, para quién, número,
fecha, validez y total. Es el usuario al que apunta SC-009 de la 002.

**Observador ocasional — gestoría o administración del cliente.** Archiva el PDF. Necesita que el
número `AAAA-NNN`, las bases, el IVA 21 % y la retención de IRPF sean inequívocos e imprimibles en
blanco y negro sin pérdida de información: ningún dato puede depender solo del color.

---

## Dirección visual elegida

### «Despacho» — editorial sobrio, papel y tinta

**Referencias:** Mercury (banca) · Stripe Invoicing.

**Idea rectora:** el producto no imita a una herramienta SaaS, imita a un **documento bien
compuesto**. Fondo de papel cálido en lugar de gris azulado, tinta casi negra en lugar de gris
oscuro, un acento burdeos usado con avaricia, filetes finos en lugar de cajas, y titulares en serif
que dan peso de autoría. Más aire arriba, más densidad en las listas.

Sigue encajando en el estilo «profesional y sobrio» que asume la 002 (predominio de neutros, un
único color de acento, sin adornos, animaciones llamativas ni imágenes decorativas).

**Consecuencias de dirección, no negociables:**

- **Desaparece la barra azul marino.** La cabecera pasa a papel con filete inferior: marca en serif
  a la izquierda, navegación común en sans. La aplicación deja de tener un «banner» de color.
  FR-004 se sigue cumpliendo: la navegación común sigue presente en todas las pantallas e indica la
  sección actual.
- **Un solo significante para la sección actual:** filete burdeos de 2 px bajo la etiqueta y peso
  600. Se elimina el fondo `acento-oscuro` del estado activo.
- **El burdeos se reserva.** Solo marca, filete de sección actual, cifra del total y enlaces. No se
  usa para pintar superficies decorativas ni para las cifras del resumen de FR-005.
- **Las tarjetas se convierten en filetes.** Se abandona el patrón «caja blanca con borde gris sobre
  fondo gris»: los bloques se separan con reglas horizontales y espacio, no con contorno.
- **Dos familias tipográficas, con roles disjuntos.** Es la desviación deliberada respecto a FR-008
  de la 002; ver la revisión de requisitos más abajo.
- **Sin modo oscuro y sin librería de iconos.** El modo oscuro ya está fuera de alcance en la 002 y
  sigue estándolo. Se permite un máximo de 6 glifos SVG inline escritos a mano, sin dependencias, y
  ninguno puede ser el único portador de información.

**Sensación objetivo en el cliente que recibe el presupuesto:** recibe un documento, no un correo.
Transmite despacho establecido, criterio y permanencia; el precio se lee como una cifra pactada y
no como una tarifa negociable. **Riesgo asumido:** puede aparentar una estructura mayor de la real.

---

## Revisión de los requisitos de la 002

Esta es la parte que convierte el documento en una revisión y no en una spec nueva.

### Requisitos que se MODIFICAN

| FR / SC | Texto actual (resumido) | Cambio |
|---|---|---|
| **FR-008** | «una única familia tipográfica con una escala de tamaños definida» | Pasa a **dos familias con roles disjuntos y excluyentes**: una serif para titulares, marca y rótulos; una sans para cuerpo, controles y **todo dato numérico**. La escala de tamaños sigue siendo obligatoria y única. |
| **SC-006** | «solo se observa una familia tipográfica y una paleta limitada» | Pasa a: «solo se observan **dos** familias tipográficas, cada una en su rol declarado, y una paleta limitada». La verificación de rol es parte del criterio. |
| **FR-011** | jerarquía clara; total final, el importe más destacado | Se mantiene y se **cuantifica**: el total usa el nuevo escalón `--t-2xl` (40 px), con regla superior de 2 px y fondo `superficie-alt`. |
| **FR-016** | el PDF reutiliza la identidad visual de la aplicación | Se mantiene y se **concreta**: `times` para titulares y rótulos, `helvetica` para datos e importes. Ambas son familias núcleo de jsPDF: cero bytes añadidos. |

### Requisitos que se MANTIENEN sin cambio y actúan como límite

FR-001 a FR-007 (inicio, navegación, resumen), FR-009 (paleta única en un solo punto),
FR-010 (escala de espaciado única), FR-012 y FR-012a (mensajes distinguibles, foco visible),
FR-013 (etiqueta Vigente/Caducado deducida de la fecha, texto siempre visible, sin estados nuevos),
FR-014 y FR-015 (mobile-first desde 320 px, 44 px táctiles, 16 px de base, usable en escritorio),
FR-017 y FR-018 (contenido y robustez del PDF), y FR-019 a FR-022 (sin regresión, español de
España, sin red ni fuentes externas).

### Requisitos que se AÑADEN

| Nuevo | Enunciado |
|---|---|
| **FR-023** | Todo dato numérico —importes, fechas, cantidades e identificadores `AAAA-NNN`— DEBE componerse en la familia sans con cifras tabulares, de modo que las columnas numéricas alineen verticalmente. Ningún número puede componerse en la familia serif. |
| **FR-024** | La sección actual en la navegación común DEBE señalarse mediante un único mecanismo visual, además del atributo accesible correspondiente. |
| **FR-025** | El título de pantalla (`h2`) NO DEBE ser una repetición literal y aislada de la etiqueta de la sección actual: debe aportar información adicional. El `h2` sigue existiendo y sigue siendo el primer encabezado de `main`. |
| **FR-026** | La etiqueta de estado de FR-013 NO DEBE ser confundible con un botón: debe diferir de los botones de su misma fila en altura, radio y grosor de borde. |
| **FR-027** | Las filas de los listados DEBEN tener un estado `:hover` visible, y todas las celdas de una fila DEBEN estar alineadas verticalmente a su centro. |
| **FR-028** | Dentro de una misma zona de acciones, la acción destructiva DEBE distinguirse de las no destructivas por algo más que el color del texto. |

> Aviso de numeración: la spec 001 usa FR-028 para el contenido obligatorio del PDF. Los FR nuevos
> de este documento son **de la 002** y se numeran en su propia serie, que hoy termina en FR-022.
> Si al redactar se prefiere evitar la coincidencia visual con 001, renumerar en bloque.

### Contratos que se REESCRIBEN

| Contrato | Alcance del cambio |
|---|---|
| [`contracts/tema.md`](contracts/tema.md) | Tabla de paleta completa (13 valores revaluados + 3 tokens nuevos), familias y escala tipográfica, jerarquía, radios y filetes. Es el contrato con más cambio. |
| [`contracts/pantallas.md`](contracts/pantallas.md) | Cabecera clara, señalización de sección actual, títulos de pantalla (FR-025), tarjetas → filetes, densidad y alineación de listados. |
| [`contracts/pdf.md`](contracts/pdf.md) | Familias por rol, cabecera de tabla sin banda de acento, bloque de total. |
| [`quickstart.md`](quickstart.md) | Nuevos pasos de validación manual (ver última sección). |

---

## Reglas de diseño (tokens)

Todo vive donde ya vive: los colores en [`js/tema.js`](../../js/tema.js) (volcados como variables
CSS y consumidos por `js/pdf.js` vía `Tema.rgb`), y el resto en el `:root` de
[`css/estilos.css`](../../css/estilos.css). Esta revisión **revalúa** tokens existentes y **añade**
algunos; **no renombra** ninguno de los 13 actuales, en coherencia con la norma del proyecto de no
renombrar identificadores internos.

### Color — revaluación de los 13 tokens existentes

| Token | Valor 002 | Valor «Despacho» | Rol |
|---|---|---|---|
| `texto` | `#1f2933` | `#1C1A17` | Tinta. Todo texto principal e importes. |
| `suave` | `#52606d` | `#6B6459` | Grafito. Rótulos, etiquetas, metadatos. |
| `borde` | `#d9dee3` | `#E6E1D8` | Filete fino (1 px) por defecto. |
| `fondo` | `#f5f7f9` | `#FBF9F5` | Papel. Fondo de la aplicación. |
| `superficie` | `#ffffff` | `#FFFFFF` | Superficies elevadas y texto sobre tinta/burdeos. |
| `acento` | `#1f4b78` | `#8C2F39` | Burdeos de marca. Uso restringido (ver arriba). |
| `acento-oscuro` | `#163757` | `#6E242C` | Hover/pressed de elementos burdeos. |
| `exito` | `#1e6b34` | `#4F6B4A` | Salvia. Estado «Vigente». |
| `exito-fondo` | `#e6f4ea` | `#EDF2EB` | Lavado de «Vigente» y mensajes de éxito. |
| `aviso` | `#8a5a00` | `#7C5415` | Ocre. Estado «Caducado» y avisos. |
| `aviso-fondo` | `#fff4dc` | `#F7EFE0` | Lavado de aviso. |
| `error` | `#b42318` | `#B3261E` | Rojo de validación y acción destructiva. |
| `error-fondo` | `#fdecea` | `#FBEDEB` | Lavado de error. |

### Color — tokens nuevos

| Token | Valor | Rol |
|---|---|---|
| `borde-fuerte` | `#CFC7B8` | Filete de 2 px: cabecera de tabla, regla del total, cierre de sección. |
| `superficie-alt` | `#F4F1EA` | Cabecera de tabla, fila de total, zonas de reposo. |
| `papel-hundido` | `#F2EFE7` | Hover de fila y de celda interactiva (FR-027). |

### Regla de desambiguación burdeos / rojo

`acento` (`#8C2F39`, oscuro y desaturado) y `error` (`#B3261E`, más claro y anaranjado) son ambos
rojizos. Para que no se confundan nunca:

- **Burdeos puede rellenar** una superficie (botón primario, filete de sección actual).
- **Rojo de error nunca rellena** un botón: `button.peligro` sigue siendo texto + borde, sin fondo.
  El rojo solo aparece como texto, borde o lavado `error-fondo` en mensajes y campos inválidos.
- Resultado verificable: en cualquier pantalla, **la única superficie rojiza rellena es el botón
  primario**. Si esta regla se rompe, la dirección se considera incumplida.

Esto es compatible con la regla de la 002 de «un único botón principal por zona de acciones».

### Tipografía

Sin fuentes web y sin descargas, como exige FR-022: solo familias instaladas en Windows 10/11 con
Chrome/Edge.

| Token | Valor | Rol |
|---|---|---|
| `--fuente-titulo` | `Cambria, "Sitka Text", Georgia, "Times New Roman", serif` | Titulares, marca, rótulos de sección, `h1`–`h3`. |
| `--fuente` | `"Segoe UI Variable Text", "Segoe UI", system-ui, Arial, sans-serif` | Cuerpo, formularios, botones **y todo dato numérico**. |

**Regla dura (FR-023):** ningún número va en serif. Georgia —presente como respaldo en la pila—
tiene cifras de estilo antiguo, no alineadas y no tabulares, lo que destrozaría una columna de
importes. Por eso importes, fechas, cantidades y el identificador `AAAA-NNN` se componen **siempre**
en la sans con `font-variant-numeric: tabular-nums`.

Escala (sustituye a la de `contracts/tema.md`):

| Token | 002 | «Despacho» | Uso |
|---|---|---|---|
| `--t-xs` | 12 px | `12px` | Rótulo en versalitas, pie de tabla. |
| `--t-s` | 14 px | `14px` | Metadatos, etiquetas de formulario, botón pequeño. |
| `--t-m` | 16 px | `16px` | Cuerpo y controles. **Nunca baja de 16 px en campos** (FR-014). |
| `--t-l` | 20 px | `20px` | `h3`, títulos de bloque. |
| `--t-xl` | 26 px | `30px` | `h2` de pantalla. |
| `--t-2xl` | — | `40px` | Total del presupuesto y cifra destacada del editor (FR-011). |

Tokens tipográficos nuevos:

| Token | Valor | Rol |
|---|---|---|
| `--lh-apretado` | `1.2` | Titulares en serif. |
| `--lh-normal` | `1.5` | Cuerpo. |
| `--letra-rotulo` | `0.08em` | Rótulos en mayúsculas de 12 px (`NÚMERO`, `EMITIDO PARA`). |
| `--peso-medio` | `600` | Sección actual, cabecera de tabla. Sustituye usos sueltos de `bold`. |

### Espaciado, filetes y densidad

- Se mantiene la escala `--e-1: 4px` … `--e-5: 32px` de la 002 y se añade `--e-6: 48px` para la
  separación entre bloques mayores de una pantalla.
- Se mantiene `--alto-tactil: 44px` (FR-014).
- Se mantienen los puntos de corte de la 002: base 320 px, `640px` y `960px`. No se añaden.
- Radio: token nuevo `--radio: 4px` para controles e inputs. Las superficies de contenido (tablas,
  bloques de sección) pasan a **radio 0**: la dirección es de papel, no de tarjetas.
- Filetes: `--filete: 1px` (`borde`) y `--filete-fuerte: 2px` (`borde-fuerte`).
- Densidad de lista en escritorio (≥ 640 px): alto de fila **≤ 56 px**, con `vertical-align: middle`
  en todas las celdas (FR-027).
- `main` mantiene `max-width: 1100px` centrado; el ancho de las columnas de tabla se reparte por el
  **contenido**, no por el ancho del encabezado.

### PDF

jsPDF solo ofrece sin incrustar las familias núcleo `helvetica`, `times` y `courier`. La dirección
se resuelve con las dos primeras y **cero bytes añadidos**, respetando FR-022:

- Titulares, marca emisora y rótulos: `times`, `bold` / `normal`.
- Datos, tabla de líneas, importes y totales: `helvetica` (como hoy).
- Reglas y filetes con `borde-fuerte`; cabecera de la tabla de líneas con `superficie-alt` y texto
  en `texto`. Hoy es `fillColor: acento` con texto blanco: **la banda de color desaparece**.
- El total se compone en `times bold` sobre `superficie-alt`, con regla superior de 2 px.
- Incrustar una fuente TTF/base64 queda **fuera de alcance**.

---

## Criterios de aceptación verificables (sí/no)

Comprobables a ojo o con herramientas de desarrollo sobre `index.html` y un PDF generado.

### Color y tokens

- [ ] **CA-01.** `js/tema.js` contiene exactamente los 13 tokens de la 002 con los valores nuevos de
      la tabla, más `borde-fuerte`, `superficie-alt` y `papel-hundido`. Ningún nombre antiguo se ha
      renombrado ni eliminado.
- [ ] **CA-02.** `grep -nE "#[0-9a-fA-F]{3,6}" css/estilos.css` no devuelve ninguna línea (FR-009).
- [ ] **CA-03.** `grep -nE "#[0-9a-fA-F]{3,6}|setFillColor\(\s*[0-9]" js/pdf.js` no devuelve ninguna
      línea: todo color del PDF sigue viniendo de `Tema.rgb`.
- [ ] **CA-04.** En ninguna pantalla existe una superficie rellena en rojo o burdeos que no sea el
      botón primario. `button.peligro` no tiene `background` distinto de `superficie`.
- [ ] **CA-05.** Ningún elemento usa ya `#1f4b78` ni `#163757`.
- [ ] **CA-06.** Cambiar `acento` en `js/tema.js` sigue reflejándose en el 100 % de las pantallas y
      en el PDF (SC-007 de la 002, sin regresión).

### Tipografía (FR-008 revisado, FR-023, SC-006 revisado)

- [ ] **CA-07.** En toda la aplicación se observan exactamente **dos** familias tipográficas.
- [ ] **CA-08.** Todo elemento que muestre un importe, una fecha, una cantidad o un número
      `AAAA-NNN` computa `font-variant-numeric: tabular-nums` y una familia de `--fuente`.
      Verificación: en el listado de presupuestos, las comas decimales de `228,00 €`, `24,39 €` y
      `441,65 €` quedan en la misma columna de píxeles.
- [ ] **CA-09.** Ningún nodo con contenido numérico computa una familia de `--fuente-titulo`.
- [ ] **CA-10.** `h2` de pantalla y título de bloque difieren al menos 10 px de tamaño (30 vs 20).
- [ ] **CA-11.** Existe `--t-2xl` y se usa en el total del editor de presupuesto, que sigue siendo
      el importe más destacado de la pantalla (FR-011).
- [ ] **CA-12.** Ningún campo de formulario baja de 16 px de tamaño de texto (FR-014).

### Jerarquía y navegación (FR-024, FR-025)

- [ ] **CA-13.** La sección actual se distingue por **un único** mecanismo visual (filete burdeos
      inferior + peso 600); no tiene `background` distinto del de la cabecera.
- [ ] **CA-14.** La cabecera no usa `acento` como fondo: es papel con filete inferior.
- [ ] **CA-15.** La navegación común sigue presente en las cinco pantallas, incluido el editor, e
      indica la sección actual; durante la edición indica «Presupuestos» (FR-004, sin regresión).
- [ ] **CA-16.** El `h2` de cada pantalla no repite literalmente y en solitario la etiqueta de la
      sección actual, y sigue siendo el primer encabezado de `main`.
- [ ] **CA-17.** En Inicio, el botón «Nuevo presupuesto» (FR-006a) pertenece visualmente a un bloque;
      no flota entre dos rejillas con tres separaciones verticales distintas.

### Componentes y estados (FR-026, FR-027, FR-028)

- [ ] **CA-18.** `.estado.vigente` y `.estado.caducado` no comparten con los botones de su fila ni
      altura, ni radio, ni grosor de borde: son distinguibles de un botón sin leer el texto.
- [ ] **CA-19.** «Vigente» y «Caducado» siguen siendo distinguibles entre sí sin depender del color
      y con el texto siempre visible (FR-013, sin regresión), incluso impresos en blanco y negro.
- [ ] **CA-20.** Las filas de los listados tienen `:hover` visible con `papel-hundido`.
- [ ] **CA-21.** `button:focus-visible` mantiene un contorno de 3 px visible sobre papel; sobre la
      cabecera clara, el contorno tiene contraste ≥ 3:1 contra su fondo (FR-012a).
- [ ] **CA-22.** Las tres acciones de fila no tienen el mismo peso visual: la destructiva se
      distingue de «Abrir» y «Descargar PDF» por algo más que el color del texto.

### Densidad y alineación

- [ ] **CA-23.** En ≥ 640 px, todas las celdas de `table:not(.totales) td` usan
      `vertical-align: middle`; el grupo de acciones queda centrado respecto al texto de su fila
      (desfase de la línea media < 2 px).
- [ ] **CA-24.** En ≥ 640 px, el alto de fila del listado de presupuestos es ≤ 56 px.
- [ ] **CA-25.** La columna «Total» y la etiqueta de estado tienen ≥ `--e-4` (24 px) de separación.
- [ ] **CA-26.** No queda ningún filete suelto al pie de la pantalla de Inicio sin contenido que lo
      justifique.

### Accesibilidad (bloqueante)

- [ ] **CA-27.** Contraste ≥ 4,5:1, medido, en todos estos pares: `texto`/`fondo`,
      `texto`/`superficie`, `suave`/`superficie`, `suave`/`fondo`, `superficie`/`acento`,
      `exito`/`exito-fondo`, `aviso`/`aviso-fondo`, `error`/`error-fondo`,
      `texto`/`superficie-alt`, `texto`/`papel-hundido`. Mantiene el mínimo del contrato de tema.
- [ ] **CA-28.** Ningún estado ni validación se comunica solo por color (FR-012, FR-013).
- [ ] **CA-29.** Los glifos SVG inline (máximo 6) son decorativos (`aria-hidden="true"`) y van
      siempre acompañados de texto.

### PDF (FR-016 revisado)

- [ ] **CA-30.** El PDF usa `times` en titulares y rótulos, y `helvetica` en datos, importes y tabla
      de líneas.
- [ ] **CA-31.** `vendor/` no incorpora ningún archivo nuevo y no se incrusta ninguna fuente (FR-022).
- [ ] **CA-32.** Los caracteres `€`, `á`, `é`, `í`, `ó`, `ú`, `ñ` y `º` se imprimen correctamente en
      ambas familias (verificación manual con acentos en el concepto).
- [ ] **CA-33.** El PDF no contiene bandas de color rellenas salvo `superficie-alt`; la cabecera de
      la tabla de líneas ya no es una banda `acento` con texto blanco.
- [ ] **CA-34.** El PDF conserva todos los elementos obligatorios de 001 (FR-028) y no contiene la
      palabra «factura» (FR-017, SC-010).
- [ ] **CA-35.** La maquetación sigue siendo correcta con y sin logo, con datos opcionales vacíos,
      con textos largos y con tabla de varias páginas sin cortar el bloque de totales (FR-018).
- [ ] **CA-36.** El PDF sigue sin mostrar la etiqueta de estado interna de la profesional.
- [ ] **CA-37.** El PDF es legible e inequívoco impreso en escala de grises.

### Compatibilidad y no regresión (FR-019 a FR-022)

- [ ] **CA-38.** `pruebas.html` sigue mostrando «Todas las pruebas superadas» en verde.
- [ ] **CA-39.** La aplicación sigue abriéndose con doble clic en `index.html` bajo `file://`, sin
      servidor, sin módulos ES y sin peticiones de red (pestaña Red vacía).
- [ ] **CA-40.** `localStorage` sigue usando la clave `presupuestospro.v1` y el documento JSON no
      cambia de forma; los datos guardados antes del cambio se muestran sin migración.
- [ ] **CA-41.** A 320 px de ancho no hay desplazamiento horizontal y las tablas siguen colapsando
      a tarjetas (FR-014, SC-008).
- [ ] **CA-42.** Las cifras del resumen de Inicio siguen coincidiendo con los listados (SC-003).
- [ ] **CA-43.** Los quickstarts de [001](../001-presupuestos-pro-v0/quickstart.md),
      [002](quickstart.md) y [003](../003-export-zip-backup/quickstart.md) se superan sin cambios
      funcionales.

---

## Fuera de alcance

Se hereda íntegro el «Fuera de alcance» de la 002 (cálculos, IVA, retenciones, numeración,
validaciones, esquema de datos, estados Borrador/Enviado/Aceptado/Rechazado, varias plantillas de
PDF, temas seleccionables, modo oscuro, personalización de colores, estadísticas, gráficos,
informes, correo, cuentas, nube y facturación). A eso se añade, específico de esta revisión:

**Visual:**

- Librerías de iconos, fuentes web y fuentes incrustadas en el PDF (TTF/base64): cualquier recurso
  que requiera red o añada peso a `vendor/`.
- Rediseño del logo de la usuaria o de su tratamiento más allá del encuadre actual.
- Animaciones, transiciones elaboradas, ilustraciones y estados vacíos ilustrados.
- Nuevos puntos de ruptura responsive: se mantienen 640 px y 960 px.

**Funcional:**

- Buscador, filtros, ordenación por columna, paginación, selección múltiple y acciones masivas en
  el listado de presupuestos. Son funcionalidad, no dirección de arte: spec aparte.
- Importar o restaurar la copia de seguridad de la [spec 003](../003-export-zip-backup/spec.md).
- Renombrado de identificadores internos (`mis-datos`, claves JSON, nombres de los tokens de color).
- Internacionalización: los textos visibles siguen en español de España (FR-021).

---

## Secciones adicionales

### Superficie de cambio prevista

| Archivo | Naturaleza del cambio |
|---|---|
| [`js/tema.js`](../../js/tema.js) | Revaluación de los 13 colores + 3 tokens nuevos. Sigue siendo la única fuente de color. |
| [`css/estilos.css`](../../css/estilos.css) | Tokens tipográficos y de espaciado nuevos; cabecera, navegación, tarjetas → filetes, densidad de tabla, estados. Es el archivo con más cambio. |
| `js/pdf.js` | Familias `times`/`helvetica` por rol, cabecera de tabla sin banda de acento, bloque de total. |
| `index.html` / `pruebas.html` | Solo si la cabecera o los rótulos requieren marcado nuevo (p. ej. el contexto del `h2` de FR-025). Sin cambios en el orden de carga de scripts. |
| `js/ui/*.js` | Solo clases y rótulos. Ninguna llamada nueva a `App.cambiar` ni a `Almacen.guardar`. |
| `specs/002-mejora-presentacion/*` | `spec.md` (FR-008, FR-011, FR-016, SC-006 + FR-023 a FR-028), los tres contratos y `quickstart.md`. |
| [`specs/README.md`](../README.md) | Actualizar la fila de la 002: sigue publicada, con la dirección visual revisada. |

### Relación con las otras specs

- **[001](../001-presupuestos-pro-v0/spec.md):** no se toca. Sigue afectada solo en apariencia, como
  ya anota el índice.
- **[003](../003-export-zip-backup/spec.md):** no se toca y no requiere cambios. El `.zip` seguirá
  conteniendo los mismos archivos, con el PDF ya rediseñado; conviene verificarlo (CA-43).

### Riesgos

| Riesgo | Impacto | Mitigación prevista |
|---|---|---|
| Burdeos de marca confundido con rojo de error | Alto | Regla de desambiguación (CA-04). Repliegue: botón primario en `texto` (tinta) y burdeos solo como filete. |
| Dos familias tipográficas erosionan la coherencia que buscaba la 002 | Medio | FR-023 con roles disjuntos y excluyentes, verificado por CA-07 y CA-09. |
| `times` en el PDF puede leerse como «Word por defecto» en vez de «documento» | Medio | Compensar con composición (rótulos en versalitas, filetes, aire), no con la fuente. Validar con un PDF real antes de cerrar la revisión. |
| Cambria no está instalada en un Windows sin Office | Bajo | La pila cae a Sitka Text → Georgia → Times New Roman, todas presentes en Windows 10/11. Ningún número depende de la serif (CA-09). |
| Papel cálido (`#FBF9F5`) visto amarillento en pantallas mal calibradas | Bajo | Saturación muy baja; validar en un segundo monitor. |
| Pérdida de contraste al pasar de barra azul a cabecera clara | Medio | CA-21 y CA-27 lo bloquean explícitamente. |

### Decisiones abiertas para `/speckit.clarify`

1. **FR-025:** ¿cómo deja el `h2` de duplicar la sección actual? ¿Contador de elementos
   («Presupuestos · 3»), rótulo de contexto, o bloque de título tipo documento con antetítulo?
2. ¿Se usan los seis glifos SVG permitidos, o la dirección se mantiene estrictamente sin iconos?
3. **FR-028:** ¿la acción destructiva se separa por posición y separador al final del grupo, o por
   menor peso tipográfico frente a las otras dos?
4. La cifra del total (`--t-2xl`) queda en sans por FR-023. Conviene confirmar que se acepta para
   el número más visible del documento, pese a ser el sitio donde más tentaría la serif.
5. Numeración de los FR nuevos: mantener FR-023…FR-028 dentro de la serie de la 002 o renumerar
   para evitar la coincidencia visual con FR-028 de la 001.

### Validación manual

Ampliar [`quickstart.md`](quickstart.md) de la 002 con, al menos: abrir `index.html` con doble clic;
recorrer las cinco pantallas a 1900 px y a 320 px; comprobar la alineación de comas decimales en el
listado; generar un PDF con acentos y `€` en los conceptos; imprimirlo en escala de grises; exportar
el `.zip` de la 003 y comprobar que los PDF que contiene son los rediseñados; y ejecutar
`pruebas.html`.
