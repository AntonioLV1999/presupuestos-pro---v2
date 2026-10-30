# Quickstart — validación manual de R2, dirección «Despacho»

Guía de comprobación de la revisión. **No hace falta leer código ni usar herramientas técnicas** salvo en el apartado final, que es apoyo del implementador y no criterio de éxito (constitución, principio IV).

## Requisitos previos

- Windows 10/11 con Chrome o Edge actualizado.
- Una impresora o la vista previa de impresión del navegador para el apartado del PDF.
- Datos de prueba: al menos **3 presupuestos** de importes distintos (por ejemplo 24,39 €, 228,00 € y 1.441,65 €), uno de ellos con fecha de validez pasada, **1 cliente** y **1 servicio** en el catálogo. Conviene que algún concepto lleve acentos y eñes.

## Arranque

1. Doble clic en `index.html`. No hace falta servidor, instalación ni conexión.
2. Doble clic en `pruebas.html`. **Debe decir «Todas las pruebas superadas» en verde.** Si no, parar: R2 no debe tocar lógica.

---

## 1. Dirección visual (SC-006)

- [ ] La cabecera **no es una banda de color**: está sobre el mismo papel que el resto de la página, separada por una línea fina.
- [ ] El fondo de la aplicación es un papel cálido, no un gris azulado.
- [ ] No quedan recuadros blancos con contorno sobre fondo gris: los bloques se separan con líneas y espacio.
- [ ] Recorriendo las seis pantallas se ven **solo dos tipografías**: una en marca y títulos, otra en textos, controles y números.
- [ ] Ningún número aparece compuesto con la tipografía de títulos, **ni siquiera el total del presupuesto**.
- [ ] El color rojizo oscuro solo aparece en la marca, en la señal de sección actual, en el botón principal, en los enlaces y en el total.

## 2. Navegación y títulos (SC-012)

- [ ] Pide a alguien que mire la pantalla y diga **en menos de 3 segundos** en qué sección está, sin indicarle dónde mirar.
- [ ] La sección actual se marca con **un solo recurso**: una línea bajo su nombre. No tiene además un fondo distinto.
- [ ] Entra en cada una de las seis pantallas y comprueba que el título **no repite sin más** la etiqueta del menú:
  - Inicio → «Resumen de actividad»
  - Presupuestos → «Presupuestos» con el recuento debajo
  - Clientes → «Clientes» con el recuento
  - Catálogo → «Catálogo» con el recuento
  - Perfil → «Perfil» con su complemento
  - Editor → «Presupuesto 2026-00X» o «Nuevo presupuesto»
- [ ] Los recuentos coinciden con lo que hay en cada listado (SC-003).
- [ ] Borra todos los datos de una sección y comprueba que el recuento dice «Ninguno todavía».
- [ ] Recorre la navegación con el teclado (tabulador): **todos** los accesos muestran un contorno de foco claramente visible sobre el papel.
- [ ] Entra en el editor y comprueba que la navegación sigue visible y sigue señalando «Presupuestos».
- [ ] Con un presupuesto a medio editar, sal con la navegación: debe salir sin pedir confirmación, igual que antes.

## 3. Listado de presupuestos (SC-011, SC-013, SC-014, SC-016)

- [ ] **Comas alineadas**: en la columna de totales, las comas decimales de los tres importes quedan en la misma vertical. Pide a alguien que diga cuál es el mayor: debe tardar menos de 3 segundos sin leer cifra a cifra.
- [ ] **Fila alineada**: número, cliente, fecha, total, estado y botones están a la misma altura. Ningún grupo queda descolgado hacia abajo.
- [ ] **Resalte**: al pasar el ratón por una fila, esa fila se resalta de forma perceptible.
- [ ] **Densidad**: en un portátil normal se ven **al menos 8 presupuestos** sin desplazar la página.
- [ ] **La etiqueta no es un botón**: enséñale la fila a tres personas y pídeles que abran un presupuesto. Ninguna debe intentar pulsar «Vigente» o «Caducado».
- [ ] **Borrar se distingue**: pídeles que descarguen el PDF de un presupuesto. Ninguna debe pulsar «Borrar» por error. La acción de borrar está al final del grupo y separada de las otras dos.
- [ ] Los números de presupuesto (`2026-001`, `2026-002`…) quedan alineados entre sí.

## 4. Estados de vigencia (SC-005)

- [ ] Un presupuesto con la fecha de validez pasada aparece como **Caducado**; el resto, como **Vigente**.
- [ ] El texto del estado está siempre visible.
- [ ] En una captura de pantalla pasada a blanco y negro, Vigente y Caducado **se siguen distinguiendo**.
- [ ] Alguien no técnico identifica el estado de cualquier presupuesto en menos de 5 segundos.

## 5. Editor de presupuesto (SC-011)

- [ ] El **total** es, con diferencia, el número más grande de la pantalla, sobre un fondo de reposo y con una línea de refuerzo encima.
- [ ] El total está compuesto en la tipografía de textos, no en la de títulos.
- [ ] Las cantidades y los importes de las líneas quedan alineados en columna.
- [ ] Provoca un error de validación (deja un campo obligatorio vacío): el aviso se distingue del texto normal **y no depende solo del color**.

## 6. Móvil y pantallas estrechas (SC-008)

- [ ] Reduce la ventana a 320 px de ancho. **No aparece desplazamiento horizontal** en ninguna de las seis pantallas.
- [ ] Los listados se presentan como tarjetas legibles.
- [ ] El texto se lee sin ampliar y los botones se pulsan con comodidad.
- [ ] En táctil, ninguna fila se queda «resaltada» después de tocarla.

## 7. PDF (SC-009, SC-010, SC-015)

Genera el PDF de un presupuesto que tenga acentos, eñes y el símbolo del euro en algún concepto.

- [ ] **Caracteres**: `€`, `á é í ó ú`, `ñ` y `º` se imprimen correctamente, tanto en los titulares como en los datos.
- [ ] **Sin banda de color**: el encabezado de la tabla de líneas se distingue por composición y línea, no por un fondo de color.
- [ ] El título «PRESUPUESTO» y los rótulos están en la tipografía con serifa; los importes y las fechas, en la otra.
- [ ] Ningún importe está compuesto con la tipografía de titulares.
- [ ] El bloque de total está separado por una línea de refuerzo y se identifica de inmediato.
- [ ] El PDF **no contiene la palabra «factura»** y conserva todos los elementos obligatorios.
- [ ] El PDF **no muestra** la etiqueta Vigente ni Caducado.
- [ ] **Imprime en blanco y negro**: tres personas deben identificar en menos de 10 segundos quién emite, para quién es, el número, la fecha de validez y el total.
- [ ] Muestra el PDF a tres personas no técnicas: deben considerarlo profesional y enviable a un cliente.

### Robustez del PDF

- [ ] Genera uno **sin logo** en el perfil: la maquetación sigue correcta, sin huecos.
- [ ] Genera uno con el perfil **casi vacío**: sigue correcta.
- [ ] Genera uno con un **concepto muy largo** y un nombre de cliente muy largo: no se rompe nada.
- [ ] Genera uno con **muchas líneas** (más de una página): el encabezado se repite y el bloque de totales no queda cortado.

## 8. No regresión (SC-004)

- [ ] Todos los datos que ya tenías guardados siguen ahí, sin pedir ninguna conversión.
- [ ] Crea, edita y borra un presupuesto: numeración, importes, IVA y retención dan los mismos resultados que antes.
- [ ] Pulsa **«Exportar todo (.zip)»**: la copia se descarga igual, contiene un PDF por presupuesto y el archivo de datos. **Abre uno de esos PDF y comprueba que tiene el aspecto nuevo.**
- [ ] Recorre los quickstarts de la spec 001 y de la spec 003: se superan sin cambios funcionales.
- [ ] Abre la aplicación sin conexión a internet: funciona exactamente igual.

---

## Apoyo para el implementador (no es criterio de éxito)

Comprobaciones técnicas que conviene hacer antes de dar la fase por cerrada:

- `grep -nE "#[0-9a-fA-F]{3,6}" css/estilos.css` → sin resultados. Todo color sale de `js/tema.js` (FR-009).
- `grep -nE "#[0-9a-fA-F]{3,6}" js/pdf.js` → sin resultados.
- `js/tema.js` contiene los 13 nombres de siempre, con valores nuevos, más `borde-fuerte`, `superficie-alt` y `papel-hundido`. Ningún nombre renombrado ni eliminado.
- `vendor/` no tiene ningún archivo nuevo (FR-016, FR-022).
- Con la pestaña Red abierta, recargar `index.html` no genera **ninguna** petición.
- Medir con una herramienta de contraste los diez pares listados en [contracts/tema.md](contracts/tema.md): todos deben llegar a 4,5:1.
- En el listado, el alto de fila en escritorio es de unos 52 px y los botones conservan 44 px.
