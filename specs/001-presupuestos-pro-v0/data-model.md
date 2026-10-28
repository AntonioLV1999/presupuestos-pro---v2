# Data Model: Presupuestos Pro v0

**Fecha**: 2026-10-26 | **Spec**: [spec.md](spec.md) | **Decisiones**: [research.md](research.md)

Todo el estado se guarda como un único documento JSON. El formato exacto está en [contracts/almacenamiento.md](contracts/almacenamiento.md).

**Convenciones**:
- Los importes van en céntimos enteros. Por ejemplo, 750,00 € se guarda como `75000`.
- Las cantidades van en centésimas enteras. Por ejemplo, 1,5 se guarda como `150` y 3 como `300`.
- Las fechas se guardan como texto `AAAA-MM-DD`, en hora local.
- Los identificadores internos son textos únicos generados al crear el registro. La usuaria nunca los ve.

## Profesional (una sola)

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| nombre | texto | No; si falta, se avisa antes del PDF | Máximo 120 caracteres |
| nif | texto | No; si falta, se avisa antes del PDF | Máximo 20 caracteres. No se valida el formato en v0 |
| telefono | texto | No | Máximo 30 caracteres |
| email | texto | No | Texto libre que solo se muestra en el PDF. No se valida el formato |
| direccion | texto | No | Máximo 200 caracteres |
| logo | imagen en base64 o vacío | No | Solo PNG o JPG, de 500 KB como máximo (FR-003) |

- No hay ningún campo de retención (FR-002).
- Si faltan el nombre o el NIF, la aplicación avisa antes de generar el PDF y deja continuar si la usuaria lo confirma (FR-030).

## Servicio del catálogo

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| id | texto | Sí | Único |
| nombre | texto | Sí | No vacío, máximo 200 caracteres |
| precioCentimos | entero | Sí | Igual o mayor que 0 |

- Editarlo o borrarlo no afecta a los presupuestos guardados (FR-007).

## Cliente guardado

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| id | texto | Sí | Único |
| nombre | texto | Sí | Nombre o razón social. No vacío, máximo 200 caracteres |
| nif | texto | No | Máximo 20 caracteres |
| email | texto | No | Texto libre que solo se muestra en el PDF. No se valida el formato |
| tipo | `particular` / `empresa` / `autonomo` | Sí | Uno de los tres |

- Borrarlo pide confirmación (FR-008a).
- Editarlo o borrarlo no afecta a los presupuestos guardados (FR-008c).

## Presupuesto

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| id | texto | Sí | Único |
| numero | texto `AAAA-NNN` | Se asigna al guardar por primera vez | Nunca cambia ni se reutiliza (FR-012, FR-013) |
| fechaEmision | fecha | Se fija al guardar por primera vez | Día del primer guardado. No editable (FR-014). Antes de guardar, el editor muestra la fecha del día como provisional |
| cliente | Cliente del presupuesto | Sí | Copia de los datos, ver abajo |
| porcentajeRetencion | `0` / `7` / `15` | Sí | Es 0 si el cliente es particular. Si no, 15 o 7, con 15 por defecto (FR-021 a FR-023) |
| lineas | lista de Línea | Al menos una para generar el PDF | Ver abajo (FR-016) |
| observaciones | texto | No | Máximo 1.000 caracteres (FR-011) |

**Valores derivados**: se calculan siempre y no se guardan.
- `fechaValidez` = fechaEmision + 30 días naturales.
- `baseCentimos` = suma de los importes de las líneas.
- `ivaCentimos` = redondear(base × 21 / 100).
- `retencionCentimos` = redondear(base × porcentajeRetencion / 100).
- `totalCentimos` = base + IVA − retención.

**Validación al guardar** (FR-015):
- El cliente debe tener nombre.
- Cada línea debe tener concepto, una cantidad mayor que 0 y un precio igual o mayor que 0.
- Se permite guardar un presupuesto sin líneas, pero no generar su PDF (FR-016 y casos límite).

## Cliente del presupuesto (incrustado en el presupuesto)

Tiene los mismos campos que el Cliente guardado, salvo el `id`, y además `clienteGuardadoId`, que es opcional y solo sirve para saber de dónde se copió. Los datos se copian al guardar y no cambian después (FR-008c).

## Línea de presupuesto (incrustada en el presupuesto)

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| concepto | texto | Sí | No vacío, máximo 200 caracteres |
| cantidadCentesimas | entero | Sí | Mayor que 0. Hasta dos decimales en pantalla |
| precioCentimos | entero | Sí | Igual o mayor que 0 |

- `importeCentimos` es derivado: redondear(cantidadCentesimas × precioCentimos / 100).
- Una línea creada desde el catálogo copia su nombre y su precio, con cantidad 1 (`100`). Después es independiente del catálogo (FR-005, FR-006).

## Contadores de numeración

Un mapa `año → último número asignado`, por ejemplo `{ "2026": 3 }`. Solo crece. Al guardar un presupuesto nuevo:

1. Se fija `fechaEmision` con la fecha local del día y se toma su año.
2. Se calcula `contadores[año] = (contadores[año] o 0) + 1`.
3. Se asigna `numero = año + "-" + contador`, con el contador rellenado a tres cifras.

## Ciclo de vida del presupuesto

No hay estados de negocio, porque la spec excluye borrador, enviado y aceptado. La única transición técnica es esta:

```text
[nuevo, sin número] --guardar (válido)--> [guardado, con número] --editar/guardar--> [guardado, mismo número]
                                                               \--borrar (confirmado)--> [eliminado; el número no vuelve]
```

## Relaciones

- Un Presupuesto contiene una copia de un Cliente y entre cero y muchas Líneas.
- Las Líneas y los Clientes de presupuesto son copias. No hay referencias vivas al Catálogo ni a la lista de Clientes.
- La Profesional no se copia en el presupuesto, así que el PDF usa siempre sus datos actuales. Es coherente con la HU3: se configura una vez y se aplica a todos los presupuestos.
