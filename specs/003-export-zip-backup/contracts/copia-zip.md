# Contrato: archivo .zip de la copia de seguridad

Es la única «interfaz» nueva: lo que la usuaria recibe y lo que la futura spec de importación podrá leer.

## Contenido del .zip

```text
presupuestospro-copia-2026-03-15.zip
├── 2026-001 - Estudio García.pdf
├── 2026-002 - Diseño-Web S.L..pdf
├── 2026-003 - Marta Ruiz.pdf
└── datos-presupuestospro.json
```

- Estructura plana: todo en la raíz, sin carpetas.
- Un PDF por presupuesto, sin excepción (vigentes y caducados, de cualquier tipo de cliente).
- Exactamente un archivo de datos.

## Formato ZIP (para `js/zip.js`)

- ZIP clásico (sin ZIP64), método 0 «almacenado» (sin compresión), versión necesaria 20.
- Nombres codificados en UTF-8 con el bit 11 de las banderas activado, para que «García» y «Diseño» se vean bien en el Explorador de Windows.
- CRC-32 correcto por entrada (si no coincide, Windows rechaza el archivo).
- Fecha y hora de cada entrada: las del momento de la exportación, en formato MS-DOS y hora local.
- Estructura: cabecera local + datos por cada entrada; directorio central; registro de fin de directorio central.

## Archivo de datos: `datos-presupuestospro.json`

JSON en UTF-8, con sangría de 2 espacios:

```json
{
  "formato": "presupuestospro-copia",
  "version": 1,
  "exportadoEn": "2026-03-15T10:42:00.000Z",
  "datos": {
    "version": 1,
    "profesional": { "nombre": "", "nif": "", "telefono": "", "email": "", "direccion": "", "logo": "data:image/png;base64,..." },
    "catalogo": [],
    "clientes": [],
    "presupuestos": [],
    "contadores": {}
  }
}
```

- `datos` es el documento `presupuestospro.v1` tal cual está en memoria, sin transformar.
- `formato` y `version` (de la copia, independiente de `datos.version`) permiten a la futura importación reconocer y validar el archivo.
- `exportadoEn` es informativo (ISO 8601, UTC).

## Reglas de nombres

Ver [research.md R4](../research.md) y [data-model.md](../data-model.md). Resumen: los caracteres no admitidos pasan a «-»; espacios colapsados; extremos recortados; cliente de 80 caracteres como máximo; repetidos con « (2)».

## Funciones puras (probadas en `pruebas.html`)

| Función | Entrada → Salida |
|---------|------------------|
| `Exportacion.nombreZip(aaaaMmDd)` | `'2026-03-15'` → `'presupuestospro-copia-2026-03-15.zip'` |
| `Exportacion.nombreSeguro(texto)` | `'Diseño/Web S.L.'` → `'Diseño-Web S.L.'` |
| `Exportacion.nombresPdf(presupuestos)` | lista de presupuestos → lista de nombres únicos, en el mismo orden |
| `Exportacion.datosCopia(estado, ahora)` | estado → texto JSON de la envoltura |
| `Zip.crc32(bytes)` | `"123456789"` en ASCII → `0xCBF43926` |
| `Zip.crear(entradas)` | `[{ nombre, datos: Uint8Array }]` → `Uint8Array` con un ZIP válido |
