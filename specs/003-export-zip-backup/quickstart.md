# Quickstart: validar la exportación en .zip

Se recorre solo con la aplicación, el Explorador de Windows y un lector de PDF. Referencias: [contrato del .zip](contracts/copia-zip.md), [pantalla](contracts/pantallas.md) y [modelo de datos](data-model.md).

## Requisitos previos

- Chrome o Edge actualizado, sin conexión.
- Para los pasos 2 a 6, tres presupuestos creados, uno de ellos para un cliente llamado «Diseño/Web S.L.» y otro con el ejemplo de control del Módulo 2 (total 3.604,00 €).

## 1. Pruebas automáticas

1. Abre `pruebas.html`.
2. **Esperado**: «Todas las pruebas superadas» en verde, con los casos nuevos de `Zip` y `Exportacion`: nombre del .zip para 15/03/2026, limpieza de «Diseño/Web S.L.», nombres repetidos con « (2)», CRC-32 de «123456789» = `CBF43926` y estructura del ZIP generado.

## 2. Una descarga, un archivo (SC-001)

1. En «Presupuestos» localiza el botón «Exportar todo (.zip)» junto a «Nuevo presupuesto» y púlsalo.
2. **Esperado**: se descarga **un único** archivo `presupuestospro-copia-AAAA-MM-DD.zip` con la fecha de hoy, y aparece «Copia lista: 3 presupuestos guardados en …».

## 3. Contenido (SC-001, SC-004)

1. Descomprime el .zip con doble clic (Extraer todo).
2. **Esperado**: sin errores; 3 PDF con nombre «número - cliente» (p. ej. `2026-001 - Estudio García.pdf`), el del cliente conflictivo como `… - Diseño-Web S.L..pdf`, y `datos-presupuestospro.json`. Nada más.

## 4. PDF idéntico al individual (SC-002)

1. Abre un PDF del .zip y, aparte, descarga con «Descargar PDF» el mismo presupuesto desde la lista.
2. **Esperado**: mismo aspecto, mismos textos y mismos importes al céntimo. En el del ejemplo de control, TOTAL **3.604,00 €** en ambos.

## 5. Solo lectura (SC-006)

1. Antes de exportar, anota: número de presupuestos, clientes y servicios, y el siguiente número que recibiría un presupuesto nuevo.
2. Exporta y recarga la página.
3. **Esperado**: las mismas cifras, los mismos presupuestos y el mismo siguiente número. El inicio no cambia.

## 6. Archivo de datos

1. Abre `datos-presupuestospro.json` con el Bloc de notas.
2. **Esperado**: empieza por `"formato": "presupuestospro-copia"` y contiene tus presupuestos, el catálogo, tus clientes y tu perfil con el logo (texto largo que empieza por `data:image`).

## 7. Sin presupuestos (SC-003)

1. Abre la aplicación en un perfil de navegador nuevo (sin datos) y pulsa «Exportar todo (.zip)».
2. **Esperado**: aviso «No hay presupuestos que exportar…» y ninguna descarga.

## 8. Muchos presupuestos (SC-005)

1. Con 50 o más presupuestos (puedes duplicar el mismo creando varios), pulsa el botón.
2. **Esperado**: el botón se deshabilita y el texto «Preparando la copia… N de M» avanza; al terminar se descarga el .zip y el botón vuelve a estar activo. Pulsar de nuevo durante el proceso no lanza otra exportación.

## 9. Sin logo ni datos de perfil

1. Con el perfil vacío, exporta.
2. **Esperado**: la copia se crea igualmente, sin preguntas intermedias, y los PDF se generan sin cabecera de profesional.
