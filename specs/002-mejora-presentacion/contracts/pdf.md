# Contrato: PDF — dirección «Despacho» (R2)

Cambios de aspecto sobre la plantilla que R1 entregó en `js/pdf.js`. **El contenido no cambia**: el PDF sigue llevando exactamente los elementos obligatorios de la spec 001 (FR-028 a FR-030), los mismos importes y ninguna mención a «factura» (FR-017, SC-010).

> **Sustituye** al contrato de PDF de R1.

## Restricción que gobierna todo el contrato

**Cero bytes añadidos.** jsPDF ofrece de serie las familias núcleo `helvetica`, `times` y `courier`, que no se incrustan en el archivo. R2 usa las dos primeras y **no incorpora ninguna tipografía ni ningún archivo a `vendor/`** (FR-016, FR-022). Incrustar una TTF queda fuera de alcance.

Todos los colores siguen viniendo de `Tema.rgb`; `js/pdf.js` no contiene ningún color literal (FR-009).

## Reparto de familias

| Elemento | R1 | R2 |
|---|---|---|
| Nombre de la profesional (cabecera) | `helvetica bold` 13 | **`times bold`** 13 |
| Datos de la profesional (NIF, teléfono, email, dirección) | `helvetica normal` 10 | `helvetica normal` 10 |
| Título «PRESUPUESTO» | `helvetica bold` 20, en `acento` | **`times bold`** 20, en `texto` |
| Número «Nº 2026-003» | `helvetica` 12, en `suave` | `helvetica` 12, en `suave` |
| Fechas de emisión y validez | `helvetica normal` 10 | `helvetica normal` 10 |
| Rótulo «Cliente» | `helvetica bold` 9, en `suave` | **`times`** 9, en `suave`, en mayúsculas |
| Datos del cliente | `helvetica normal` 10 | `helvetica normal` 10 |
| Encabezado de la tabla de líneas | `helvetica bold`, blanco sobre banda de `acento` | **`times`**, en `texto` sobre `superficie-alt` |
| Cuerpo de la tabla de líneas | `helvetica` 10 | `helvetica` 10 |
| Filas de totales (base, IVA, retención) | `helvetica normal` 10 | `helvetica normal` 10 |
| Rótulo «TOTAL» | `helvetica bold` 14 | **`times bold`** 14 |
| Importe del total | `helvetica bold` 14 | `helvetica bold` 14 |
| Rótulo «Observaciones» | `helvetica` 9, en `suave` | **`times`** 9, en `suave`, en mayúsculas |
| Texto de observaciones | `helvetica normal` 10 | `helvetica normal` 10 |

**Regla que se deriva de FR-024**: todo lo que es **dato** —importes, cantidades, fechas, el número del presupuesto, NIF, teléfono— se compone en `helvetica`. La serif se reserva a titulares y rótulos. Ningún número se compone en `times`, ni siquiera el importe del total.

## Composición

| Elemento | R1 | R2 | Requisito |
|---|---|---|---|
| Regla bajo la cabecera | Línea de `acento` de 0,6 mm | Línea de `borde-fuerte`, mismo grosor | FR-016 |
| Encabezado de la tabla de líneas | **Banda de `acento` rellena** con texto blanco | **Sin banda**: fondo `superficie-alt`, texto en `texto`, con filete inferior de `borde-fuerte` | FR-016 |
| Separadores de fila de la tabla | Filete inferior de `borde` | Sin cambios | — |
| Bloque de total | Rectángulo relleno de `fondo` con línea superior de `texto` | Rectángulo de `superficie-alt` con **filete superior de refuerzo** de `borde-fuerte` | FR-011 |
| Alineación de importes | A la derecha | Sin cambios: a la derecha | — |
| Rótulos de sección | Negrita en sans | Serif en mayúsculas, en `suave` | FR-016 |

**Ninguna banda de color rellena.** Tras el cambio, la única superficie con relleno del PDF es `superficie-alt` (encabezado de tabla y bloque de total), que es un neutro cálido. El acento deja de aparecer como fondo.

## Robustez (FR-018, sin cambios de regla)

El PDF debe seguir maquetando correctamente:

- Con y sin logo de la profesional.
- Con datos de la profesional vacíos u opcionales ausentes.
- Con nombres de cliente y conceptos muy largos.
- Con tablas que ocupan varias páginas: el encabezado se repite y el bloque de totales no queda cortado.
- Con cero líneas o con una sola.

## Caracteres

Las familias núcleo de jsPDF cubren `€`, las vocales acentuadas, `ñ` y `º` con la codificación por defecto; el PDF actual ya imprime importes en euros con `helvetica` sin incidencias. Al introducir `times` **hay que verificarlo explícitamente** en los titulares y rótulos, porque un fallo aquí sería invisible hasta que el cliente abra el documento. Comprobación en [quickstart.md](../quickstart.md).

## Impresión en blanco y negro

El PDF debe seguir siendo inequívoco impreso en escala de grises (SC-015): quién emite, para quién, número, fecha de validez y total se identifican sin depender del color. Al retirarse la banda de acento, el encabezado de la tabla pasa a distinguirse por composición y filete, no por color, lo que mejora este caso.

## Lo que no cambia

- Ningún dato, importe, rótulo de columna ni cálculo.
- El nombre de archivo `Presupuesto-AAAA-NNN.pdf`.
- La ausencia de la etiqueta de estado interna de la profesional (Vigente / Caducado) en el documento.
- La función `Pdf.construir`, que la spec 003 usa para componer el `.zip`: su firma y su salida siguen siendo las mismas, así que la copia de seguridad sigue funcionando sin tocarla.
