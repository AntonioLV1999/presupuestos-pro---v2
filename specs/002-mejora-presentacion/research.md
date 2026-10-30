# Research — R2, dirección visual «Despacho»

Fase 0 del [plan](plan.md). Decisiones técnicas que la spec deja abiertas a propósito, resueltas aquí para que la implementación no tenga que improvisar. Todas se toman bajo dos restricciones duras: **sin red en ejecución** (FR-022) y **sin archivos nuevos** en el proyecto (FR-016).

---

## R1 — Qué tipografías se pueden usar sin descargar nada

**Decisión**

| Papel | Pila |
|---|---|
| Títulos, marca y rótulos | `Cambria, "Sitka Text", Georgia, "Times New Roman", serif` |
| Textos, controles y **todos los números** | `"Segoe UI Variable Text", "Segoe UI", system-ui, Arial, sans-serif` |

**Rationale**: la plataforma objetivo es Chrome/Edge sobre Windows 10/11 abierto con `file://`. Las cuatro serif de la pila vienen con el sistema o con Office, así que la cascada siempre resuelve sin descargar nada. Cambria encabeza la pila porque es la única de las cuatro con cifras alineadas y de ancho constante, lo que la hace la menos peligrosa si alguien compusiera un número en ella por error.

**Alternatives considered**:
- *Una sola familia (lo que pedía R1)*: descartado porque es justo lo que la revisión viene a cambiar; sin contraste de familia no hay dirección editorial.
- *Descargar una serif de calidad (woff2 en el repo)*: descartado por FR-022 y por el principio de simplicidad. Añade peso, un archivo que mantener y un punto de fallo bajo `file://`.
- *Georgia a la cabeza de la pila*: descartado. Ver R2.

---

## R2 — Por qué ningún número va en la serif

**Decisión**: FR-024 prohíbe componer cualquier número con `--fuente-titulo`, **incluido el total del presupuesto**, que destaca por tamaño y separación y no por cambio de familia.

**Rationale**: Georgia —que está en la pila de respaldo y es la serif que más se usa como alternativa en Windows— compone cifras de **estilo antiguo**: de altura desigual y, sobre todo, de ancho desigual. Una columna de importes compuesta en Georgia no alinea nunca, por mucho que la celda esté alineada a la derecha. Como no se puede garantizar qué eslabón de la pila resolverá en cada ordenador, la única regla segura es que la serif no toque números. Esto resuelve además el defecto 1 del diagnóstico de la spec.

Para las cifras se usa `font-variant-numeric: tabular-nums`, que Segoe UI y Segoe UI Variable soportan. Si la cascada cae hasta Arial, sus cifras ya son de ancho constante por construcción, así que el resultado se mantiene.

**Alternatives considered**:
- *Serif solo en el total*: descartado. Es el número más visible del documento; si alguna vez cae en Georgia, queda con cifras desiguales justo en el sitio donde más se nota.
- *Forzar una familia monoespaciada para los identificadores*: descartado por simplicidad. Son una tercera familia y FR-008 fija exactamente dos.

---

## R3 — Paleta «Despacho» y contraste

**Decisión**: los 13 tokens existentes se revalúan y se añaden 3. Valores y papeles completos en [contracts/tema.md](contracts/tema.md).

**Rationale**: el proyecto ya tiene el mecanismo correcto —un único objeto en `js/tema.js` que se vuelca como variables CSS y alimenta el PDF por `Tema.rgb`—, así que R2 no necesita inventar nada: basta cambiar valores y añadir tres papeles que antes no existían (filete de refuerzo, superficie de reposo y resalte de fila). No se renombra ningún token, en coherencia con la norma del proyecto de no renombrar identificadores internos aunque cambie el texto visible.

Contrastes calculados sobre los valores elegidos (pendientes de confirmar con herramienta en la fase F):

| Par | Ratio | AA (4,5:1) |
|---|---|---|
| `texto` sobre `fondo` | ≈ 16,5:1 | ✔ |
| `texto` sobre `superficie` | ≈ 17,4:1 | ✔ |
| `texto` sobre `superficie-alt` | ≈ 15,4:1 | ✔ |
| `texto` sobre `papel-hundido` | ≈ 14,2:1 | ✔ |
| `suave` sobre `papel-hundido` | ≈ 4,8:1 | ✔ |
| `papel-hundido` frente a `fondo` *(superficie, umbral 1,15:1)* | ≈ 1,16:1 | ✔ |
| `suave` sobre `superficie` | ≈ 5,9:1 | ✔ |
| `suave` sobre `fondo` | ≈ 5,6:1 | ✔ |
| `superficie` sobre `acento` | ≈ 8,1:1 | ✔ |
| `exito` sobre `exito-fondo` | ≈ 5,2:1 | ✔ |
| `aviso` sobre `aviso-fondo` | ≈ 5,9:1 | ✔ |
| `error` sobre `error-fondo` | ≈ 5,7:1 | ✔ |

**Corrección tras `/speckit-analyze`**: `papel-hundido` pasa de `#F2EFE7` a `#EDE8DC`. El valor inicial solo daba ~1,09:1 frente a `fondo`, y el resalte de fila (FR-028, historia 6, escenario 3) corría el riesgo de no percibirse en pantallas de portátil corrientes. El nuevo valor llega a ~1,16:1 y mantiene el contraste AA de todo texto que se pinta encima.

**Alternatives considered**:
- *Mantener el azul y limitarse a corregir espaciado y densidad*: habría resuelto los defectos 3, 5, 6 y 7 pero no el 2 (color sin significado) ni la sensación de documento, que es el objetivo de R2.
- *Añadir un segundo acento para los datos*: descartado; FR-030 va en dirección contraria, restringir el acento en vez de multiplicarlo.

---

## R4 — Burdeos de marca frente a rojo de error

**Decisión**: regla de forma, no de color. **El acento puede rellenar una superficie** (botón primario, filete de sección actual). **El error nunca rellena un botón**: aparece solo como texto, borde o lavado de fondo en mensajes y campos inválidos. Consecuencia verificable: la única superficie rojiza rellena de la interfaz es el botón primario.

**Rationale**: `acento` (#8C2F39) y `error` (#B3261E) son ambos rojizos y el ojo no siempre los separa, sobre todo en la misma fila. Separarlos por tono exigiría desaturar la marca hasta perderla. Separarlos por **forma** es gratis, no depende de la percepción del color —lo que además ayuda a FR-012— y encaja con la regla que la 002 ya tenía de un único botón principal por zona de acciones. El estado actual del código ya cumple la mitad: `button.peligro` es texto y borde, sin fondo.

**Repliegue documentado**: si en la validación con personas el botón primario burdeos se sigue confundiendo con una acción destructiva, el botón primario pasa a tinta (`texto`) y el burdeos queda solo como filete. No requiere cambios estructurales, solo dos valores.

**Alternatives considered**:
- *Cambiar el acento a otro tono*: descartado, la dirección «Despacho» se sostiene sobre el burdeos.
- *Añadir un icono de advertencia a la acción destructiva*: descartado por la decisión de no usar iconos (R6).

---

## R5 — Tipografías del PDF sin incrustar nada

**Decisión**: `times` para titulares, marca emisora y rótulos; `helvetica` para datos, tabla de líneas, importes y totales.

**Rationale**: jsPDF ofrece de serie las familias núcleo `helvetica`, `times` y `courier`, que no se incrustan en el archivo y por tanto **no añaden un solo byte** ni obligan a tocar `vendor/`. Esto permite llevar al PDF el mismo reparto de papeles que la pantalla —serif para titulares, sans para datos— cumpliendo FR-016 y FR-022 sin excepciones. El código ya usa `helvetica` en todas partes, así que el cambio es aditivo: se introduce `times` solo donde toca.

La codificación por defecto de las familias núcleo cubre `€`, vocales acentuadas, `ñ` y `º`; el PDF actual ya imprime importes en euros con `helvetica` sin problema. Aun así se valida explícitamente en el quickstart, porque es el punto donde un fallo sería invisible hasta llegar al cliente.

**Alternatives considered**:
- *Incrustar una TTF en base64*: descartado. Es la opción que más calidad tipográfica daría y la que más contradice la constitución: añade un archivo grande, una dependencia de mantenimiento y peso a cada PDF generado, incluidos los del `.zip` de la spec 003.
- *Dejar el PDF en `helvetica` y aplicar «Despacho» solo en pantalla*: descartado. El PDF es el único contacto del cliente con el producto; dejarlo fuera vacía la revisión de su propósito.

---

## R6 — Sin iconos

**Decisión**: la dirección se expresa solo con tipografía, color, espacio y filetes. No se incorpora ninguna librería de iconos ni se dibujan glifos propios.

**Rationale**: el documento de pre-especificación dejaba abierta la puerta a un máximo de seis glifos dibujados a mano. Se cierra. Un icono dibujado a mano es código nuevo que mantener, debe declararse decorativo y acompañarse siempre de texto para no romper FR-012, y no resuelve ningún defecto del diagnóstico: los siete se corrigen con tipografía, densidad y jerarquía. El principio de simplicidad de la constitución decide el empate.

**Alternatives considered**: un juego mínimo de iconos para las acciones de fila; descartado porque FR-029 ya se resuelve por posición y separación, que es más barato y no depende de que el icono se entienda.

---

## R7 — Cómo deja el título de duplicar la sección (FR-026)

**Decisión**: el título de cada pantalla lleva siempre un complemento de contexto, normalmente un recuento. Textos exactos en [contracts/pantallas.md](contracts/pantallas.md).

**Rationale**: la alternativa de suprimir el título rompería el orden de encabezados y perjudicaría a quien navega con lector de pantalla; la spec exige expresamente que el título siga existiendo y siga siendo el primer encabezado del contenido. Añadir un recuento cuesta nada —el resumen de actividad ya calcula esas cifras con `Vigencia.resumen`—, elimina la repetición y además aporta información útil en el sitio donde antes solo había eco.

«Inicio» recibe un trato distinto: no tiene nada que contar, así que su título pasa a nombrar lo que la pantalla muestra en lugar de repetir la etiqueta del menú.

**Alternatives considered**:
- *Antetítulo en versalitas sobre el título*: bonito y muy coherente con la dirección, pero añade un elemento más a cada pantalla sin aportar dato. Se descarta por simplicidad; queda como opción si en la validación el recuento resulta insuficiente.
- *Ocultar visualmente el título dejándolo solo para lectores de pantalla*: descartado, contradice la spec.

---

## R8 — Densidad de fila compatible con los 44 px táctiles

**Decisión**: en anchos ≥ 640 px, las celdas pasan a alineación vertical centrada y su relleno vertical baja al escalón menor de la escala de espaciado. Con los botones de acción manteniendo sus 44 px, la fila queda en **52 px** sin tocar el mínimo táctil de FR-014. Las reglas que impiden partir líneas —columnas ajustadas al contenido y acciones en una sola línea— se aplican **solo desde 960 px**; entre 640 y 959 px las acciones pueden pasar a una segunda línea.

**Rationale**: el defecto 7 del diagnóstico tiene dos causas independientes. La primera es que las celdas se alinean arriba, lo que descuelga el grupo de botones respecto al texto de su fila; se corrige centrando. La segunda es el exceso de relleno: 44 px de botón más 8 px arriba y 8 px abajo dan 60 px por fila. Bajando el relleno a 4 px se llega a 52 px sin reducir ningún control.

**Por qué el umbral de 960 px**: en el listado de presupuestos, las columnas que no deben partirse (número, fecha, total, estado) más las tres acciones con su separación suman unos **720 px**. A 640 px de ventana, el contenido útil es de unos 592 px. Si esas columnas no pueden partirse ya desde 640 px, la tabla desborda y aparece desplazamiento horizontal entre ~640 y ~800 px, en contra de FR-014. A partir de 960 px hay más de 900 px útiles y cabe con holgura.

**Cuántas filas caben** *(cálculo corregido tras `/speckit-analyze`)*: la primera versión de este apartado decía que en una pantalla de 768 px de alto cabían 9 presupuestos. **Era un error**: no descontaba la interfaz del navegador ni la parte de la página que queda por encima de la tabla. Cálculo corregido para una ventana maximizada en una pantalla de 1366 × 768:

| | R1 | R2 |
|---|---|---|
| Alto útil de la ventana (pantalla − barra de tareas − interfaz del navegador) | ≈ 630 px | ≈ 630 px |
| Por encima de la primera fila (cabecera, relleno, título, barra de acciones, `thead`) | ≈ 260 px | ≈ 290 px (el título gana la línea del recuento) |
| Alto de fila | 86 px | 52 px |
| **Filas visibles** | **≈ 4** | **≈ 6** |

La mejora real es de **≈ 1,5×**, no de 8 filas absolutas. Por eso SC-014 se expresa en relación con la línea base que se mide en T003 y no como una cifra fija. El margen es justo: si la medición se queda corta, la primera palanca es bajar el margen inferior del bloque de título de `--e-5` a `--e-4`, que no toca ningún mínimo táctil ni de legibilidad.

En móvil no aplica: por debajo de 640 px las tablas siguen colapsando a bloques, como en R1.

**Alternatives considered**: reducir los botones de acción por debajo de 44 px en escritorio; descartado porque FR-014 no distingue entre tamaños de pantalla y la profesional puede usar un portátil táctil.

---

## R9 — Resalte de fila sin estropear el móvil

**Decisión**: el resalte al pasar el puntero se aplica solo a partir de 640 px y solo en dispositivos con puntero real.

**Rationale**: en un móvil no hay puntero; un estado de resalte se queda «pegado» tras tocar y confunde. Además, por debajo de 640 px la fila ni siquiera es una fila: es una tarjeta. Limitar el estado evita ambos problemas sin lógica adicional.

**Alternatives considered**: aplicar el resalte siempre; descartado por el efecto pegajoso en táctil.

---

## Resumen de decisiones

| # | Decisión | Requisito que la obliga |
|---|---|---|
| R1 | Dos pilas tipográficas, solo familias ya instaladas | FR-008, FR-022 |
| R2 | Ningún número en la serif; cifras de ancho constante | FR-024 |
| R3 | 13 tokens revaluados + 3 nuevos, sin renombrar ninguno | FR-009, FR-023 |
| R4 | El error nunca rellena un botón; el acento sí puede | FR-030 |
| R5 | PDF con `times` y `helvetica`, familias núcleo, cero bytes | FR-016, FR-022 |
| R6 | Sin iconos | Constitución I |
| R7 | Título con complemento de contexto | FR-026 |
| R8 | Fila de 52 px con botones de 44 px; sin partir líneas solo desde 960 px | FR-028, FR-014, SC-014 |
| R9 | Resalte de fila solo con puntero y ≥ 640 px | FR-028 |

**Ningún `NEEDS CLARIFICATION` queda abierto.**
