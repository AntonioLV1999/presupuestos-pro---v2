# Contrato: PDF (cambios de aspecto)

**El contenido, los textos, el orden y las prohibiciones de [pdf.md de la spec 001](../../001-presupuestos-pro-v0/contracts/pdf.md) no cambian**: mismos datos, mismo nombre de archivo, A4 vertical, sin la palabra «factura» y sin marcas de la aplicación. Tampoco se añade la etiqueta Vigente/Caducado.

## Aspecto

- **Colores**: solo los de la paleta de [tema.md](tema.md), leídos de `Tema` (`acento`, `texto`, `suave`, `borde`, `fondo`).
- **Tipografía**: Helvetica incluida en el PDF, con la misma jerarquía que la aplicación: título grande, datos en tamaño normal, notas en tamaño pequeño y gris suave.
- **Cabecera**: logo y datos de la profesional como ahora; debajo, una línea fina de color `acento` a todo el ancho útil.
- **Título**: «PRESUPUESTO» en `acento` y negrita; número y fechas en gris suave junto a él.
- **Cliente**: etiqueta «Cliente» en `suave` y mayúsculas pequeñas, datos en `texto`.
- **Tabla**: cabecera con fondo `acento` y texto blanco; filas con solo línea inferior `borde`; importes alineados a la derecha; sin rayado de cebra.
- **Totales**: bloque a la derecha; base e IVA en tamaño normal; fila TOTAL en negrita y mayor tamaño sobre fondo `fondo`.
- **Observaciones**: título en `suave`, texto en `texto`.

## Robustez (FR-018)

- Con y sin logo: la cabecera no deja huecos ni se solapa con el título.
- Datos de la profesional vacíos: la cabecera se omite y la línea de acento sigue colocándose bien.
- Conceptos y nombres largos: se parten en varias líneas dentro de su columna.
- Muchas líneas: la tabla continúa en la página siguiente con la cabecera repetida; el bloque de totales no se parte entre páginas.
