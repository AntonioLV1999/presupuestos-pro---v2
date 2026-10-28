# Research: Exportar todos los presupuestos en un .zip

No quedaba ningún «NEEDS CLARIFICATION» en la spec; estas son las decisiones técnicas que el plan necesitaba cerrar.

## R1. Cómo crear el .zip

- **Decisión**: escritor ZIP propio y mínimo (`js/zip.js`, global `Zip`), sin compresión (método «almacenado») y con nombres en UTF-8. Lógica pura, sin DOM, con pruebas en `pruebas.html`.
- **Rationale**: no hay ninguna librería de ZIP en `vendor/` y CLAUDE.md fija jsPDF + autotable como única dependencia. El formato «almacenado» son unas 60 líneas (cabecera local, directorio central, fin de directorio y CRC-32) y lo abre con doble clic el Explorador de Windows. Los PDF de jsPDF ya van comprimidos internamente, así que deflate apenas reduciría el tamaño. Principio I (simplicidad).
- **Alternativas descartadas**:
  - *JSZip 3.10.1 en `vendor/`*: añade ~95 KB y una segunda dependencia solo para empaquetar.
  - *`CompressionStream('deflate-raw')`*: comprimiría el JSON (el logo en base64 pesa unos 0,7 MB), pero obliga a lógica asíncrona en el escritor sin necesidad actual. Se reconsiderará si el tamaño del archivo resulta un problema real.
  - *ZIP64*: innecesario; el límite clásico (65.535 archivos, 4 GB) supera con mucho los 200 presupuestos de la spec.

## R2. Reutilizar el PDF existente

- **Decisión**: llamar a `Pdf.construir(presupuesto, profesional)` (ya devuelve el documento) y obtener los bytes con `doc.output('arraybuffer')`. No se toca `pdf.js`.
- **Rationale**: es exactamente la misma función que usa «Descargar PDF», así que contenido e importes coinciden al céntimo por construcción (FR-004). Los bytes del archivo pueden diferir en la marca de fecha de creación que jsPDF escribe en los metadatos; el contenido visible es idéntico.
- **Diferencia consciente con la descarga individual**: `Validacion.requisitosPdf` pide confirmación si faltan nombre o NIF del perfil. En una copia de seguridad no se interrumpe con preguntas ni se omite ningún presupuesto: se exporta todo tal como está guardado.

## R3. Archivo de datos

- **Decisión**: un único `datos-presupuestospro.json` con una envoltura `{ formato, version, exportadoEn, datos }`, donde `datos` es el documento completo de `presupuestospro.v1` (perfil con logo, catálogo, clientes, presupuestos y contadores). Detalle en [contracts/copia-zip.md](contracts/copia-zip.md).
- **Rationale**: «toda la información» y «poder restaurar en el futuro» se cumplen volcando el estado tal cual; restaurar será volver a cargarlo, y los contadores son necesarios para que la numeración AAAA-NNN no repita números. Incluir los clientes guardados va más allá de la lista literal de la spec (presupuestos, catálogo, perfil), pero forma parte del mismo documento y una copia sin ellos no restauraría la aplicación. La envoltura con `formato` y `version` permite que la futura spec de importación reconozca y valide el archivo.
- **Alternativas descartadas**: un JSON por entidad (más piezas, más complejidad); incluir solo lo que cita la spec (copia incompleta).

## R4. Nombres de archivo seguros

- **Decisión**: función pura `Exportacion.nombreSeguro` con estas reglas:
  1. Los caracteres no admitidos en Windows (`\ / : * ? " < >` y la barra vertical) y los de control se sustituyen por «-».
  2. Se colapsan los espacios repetidos y se recortan espacios y puntos en los extremos.
  3. La parte del cliente se acorta a 80 caracteres.
  4. Si el cliente queda vacío, el PDF se llama solo con el número.
  5. Los nombres repetidos (sin distinguir mayúsculas, como Windows) reciben « (2)», « (3)»…
- **Rationale**: «Diseño/Web S.L.» → `2026-001 - Diseño-Web S.L..pdf` es legible y descomprime sin errores. El número va siempre delante, así que no hay nombres reservados de Windows (CON, NUL…).

## R5. Que se vea que trabaja con 50+ presupuestos

- **Decisión**: la orquestación es un bucle `async` en `js/ui/presupuestos.js` que genera los PDF de uno en uno y cede el control al navegador entre cada uno (`requestAnimationFrame` seguido de `setTimeout 0`). Mientras tanto muestra «Preparando la copia… 12 de 50» en una región `role="status"` y deshabilita el botón.
- **Rationale**: jsPDF es síncrono; sin ceder el control, la pantalla se congela y el texto de progreso no llega a pintarse. Deshabilitar el botón evita exportaciones simultáneas (FR-011). Sin Web Workers (Principio I).

## R6. Descarga y solo lectura

- **Decisión**: `Blob` + enlace temporal con `download` (funciona con `file://`), revocando la URL después. La exportación solo lee `App.estado`: no llama a `App.cambiar` ni a `Almacen.guardar` (FR-009).
- **Estado de datos dañados**: el botón lleva `data-guarda`, de modo que `App.ir` lo deshabilita en ese caso, igual que los botones que escriben. Con datos que no se pueden leer no hay nada fiable que exportar, y el aviso de error de carga ya se muestra.

## R7. Fecha del nombre

- **Decisión**: `Formato.hoy()` (fecha local, `AAAA-MM-DD`) → `presupuestospro-copia-AAAA-MM-DD.zip`. Si se exporta dos veces el mismo día, el propio navegador desambigua el nombre («(1)»).
