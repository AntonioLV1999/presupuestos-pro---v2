# Contrato: documento PDF

- **Nombre del archivo**: `Presupuesto-AAAA-NNN.pdf`, por ejemplo `Presupuesto-2026-001.pdf`.
- **Formato**: A4 vertical.
- **Idioma**: todo en español de España.

## Contenido, de arriba abajo

1. **Cabecera de la profesional**: el logo si existe (FR-003), el nombre, el NIF, el teléfono, el email y la dirección. Solo se muestran los datos rellenos. Si la profesional no tiene ningún dato, la cabecera queda vacía y el resto del PDF se genera igual (FR-030).
2. **Título**: «PRESUPUESTO», con el número `Nº 2026-001`.
3. **Fechas**: «Fecha de emisión: 23/10/2026» y «Válido hasta: 22/11/2026».
4. **Cliente**: la etiqueta «Cliente», el nombre o razón social, y el NIF/CIF y el email si existen.
5. **Tabla de líneas**: columnas Concepto, Cantidad, Precio unitario e Importe. Solo aparecen las líneas del presupuesto, nunca el catálogo (FR-029a).
6. **Totales**, alineados a la derecha:
   - Base imponible: 1.200,00 €
   - IVA (21 %): 252,00 €
   - Retención IRPF (15 %): -180,00 €. Esta fila solo aparece si la retención es mayor que 0.
   - **TOTAL: 1.272,00 €**
7. **Observaciones**, solo si existen.

## Prohibiciones

- La palabra «factura» no aparece en ninguna forma: ni en el título, ni en los textos fijos, ni en el nombre del archivo (FR-029). La aplicación no revisa lo que escribe la propia usuaria en conceptos u observaciones.
- No hay ningún texto, logo ni marca de la propia aplicación.
- Las cantidades se muestran sin decimales si son enteras y con coma decimal si no lo son, por ejemplo «1,5».
