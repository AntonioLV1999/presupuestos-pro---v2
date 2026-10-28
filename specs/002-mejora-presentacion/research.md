# Research: Mejora de presentación

No quedaban `NEEDS CLARIFICATION` tras la spec. Estas son las decisiones de diseño.

## R1. Dónde vive la paleta (FR-009, SC-007)

- **Decisión**: un único archivo `js/tema.js` con la paleta (hex). Al cargarse, la escribe como variables CSS en `:root`; `pdf.js` la lee del mismo objeto y la convierte a RGB. Tipografía y espaciado se definen como variables al principio de `estilos.css`.
- **Razón**: jsPDF no lee CSS, así que con la paleta solo en CSS habría que duplicarla. Con `tema.js`, cambiar el acento cambia la aplicación y el PDF a la vez. El script se carga en `<head>`, antes del pintado.
- **Alternativas**: paleta en CSS y copia en `pdf.js` (dos fuentes que se desincronizan); leer `getComputedStyle` desde `pdf.js` (más frágil y no funciona en `pruebas.html`).

## R2. Navegación común (FR-004, SC-002)

- **Decisión**: el `<header>` con `<nav>` ya está fuera de las pantallas, así que ya es común. Se añade el botón «Inicio», se hace pegajoso (`position: sticky`) y en móvil sus cinco botones se reparten en filas (`flex-wrap`), con alto táctil mínimo de 44 px. Desde 640 px, una sola fila. La sección activa lleva `aria-current="page"` además del estilo.
- **Razón**: sin JavaScript extra ni estado nuevo.
- **Alternativas**: barra inferior fija (no caben cinco etiquetas en 320 px); menú desplegable (un toque más para llegar a una sección, incumple SC-002).

## R3. Pantalla de inicio (FR-001 a FR-007)

- **Decisión**: nueva pantalla `inicio` registrada igual que las demás en `window.Pantallas`. `App.ir('inicio')` pasa a ser la pantalla de arranque. Contiene accesos a las cuatro secciones, cifras del resumen y un botón «Nuevo presupuesto». Sin presupuestos, un texto de bienvenida.
- **Razón**: reutiliza el mecanismo existente.

## R4. Estado Vigente/Caducado (FR-013)

- **Decisión**: función pura `Vigencia.estado(presupuesto, hoy)` en `js/vigencia.js` que devuelve `'caducado'` si `Calculos.fechaValidez(p.fechaEmision) < hoy` (fechas AAAA-MM-DD, comparables como texto) y `'vigente'` si no. `Vigencia.resumen(estadoApp, hoy)` devuelve los recuentos. `hoy` se pasa por parámetro (`Formato.hoy()` en la UI) para poder probarlo con fechas fijas. El último día de validez sigue vigente.
- **Razón**: no se guarda nada, no se toca `calculos.js` y se prueba en `pruebas.html`.
- **Alternativas**: añadirlo a `calculos.js` (viola «no tocar cálculos»); guardar el estado (descartado por el usuario, opción B).

## R5. Etiquetas accesibles (FR-012, edge case de daltonismo)

- **Decisión**: la etiqueta siempre lleva texto («Vigente»/«Caducado») y el color es un refuerzo. Vigente: verde con borde continuo; Caducado: ámbar con borde discontinuo, de modo que difieren aunque no se distingan los colores. Los errores de campo llevan texto debajo, no solo borde rojo.

## R6. Tablas en móvil (FR-014, SC-008)

- **Decisión**: por debajo de 640 px las tablas se muestran apiladas: cada fila es una tarjeta y cada celda lleva su etiqueta mediante `data-label` y `::before`. Desde 640 px, tabla normal. Las celdas de las pantallas reciben `data-label`.
- **Razón**: evita el desplazamiento horizontal sin librerías.
- **Alternativa**: contenedor con `overflow-x: auto` (la página no desborda, pero la tabla queda recortada y es peor de leer).

## R7. Tipografía (FR-008, FR-022)

- **Decisión**: pila de sistema (`system-ui, "Segoe UI", Arial, sans-serif`), sin fuentes web. Escala: 12/14/16/20/26 px. En el PDF se mantiene Helvetica (incluida en jsPDF), de la misma familia visual sin serifas.
- **Razón**: sin conexión y sin archivos extra. Incrustar una fuente aumentaría el tamaño del PDF y complicaría el proyecto.

## R8. Renombrado «Mis datos» → «Perfil» (FR-003)

- **Decisión**: solo texto visible: botón del menú, título de la pantalla, aviso de `Validacion.faltanDatos`, su caso en `pruebas.js` y `LEEME.md`. Los identificadores internos no cambian.
- **Excepción documentada**: `validacion.js` es lógica de negocio, pero el cambio es solo una cadena de texto y no altera ninguna regla.

## R9. PDF (FR-016 a FR-018)

- **Decisión**: mismo contenido y mismos textos, nuevo estilo: línea de acento bajo la cabecera, título en color de acento, cabecera de tabla en acento con texto claro, filas con separadores suaves y bloque de totales con el TOTAL destacado sobre fondo suave. Colores desde `Tema`. Sin etiqueta de estado. Detalle en [contracts/pdf.md](contracts/pdf.md).
