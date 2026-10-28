# Data Model: Mejora de presentación

**No hay cambios en el modelo de datos.** El documento guardado (`presupuestospro.v1`), sus campos, su versión y el contrato [almacenamiento.md](../001-presupuestos-pro-v0/contracts/almacenamiento.md) siguen igual. No hay migración.

## Valores derivados (no se guardan)

### Estado de vigencia de un presupuesto

| Dato | Origen |
|------|--------|
| Fecha de validez | `Calculos.fechaValidez(presupuesto.fechaEmision)` (emisión + 30 días) |
| Estado | `caducado` si la fecha de validez es anterior a hoy; `vigente` en caso contrario |

- Se calcula cada vez que se muestra el listado o el inicio, con la fecha local de `Formato.hoy()`.
- Un presupuesto solo cambia de estado por el paso del tiempo, nunca por una acción de la usuaria.

### Resumen de actividad

| Cifra | Origen |
|-------|--------|
| Total de presupuestos | longitud de `estado.presupuestos` |
| Vigentes / Caducados | recuento por el estado de vigencia; su suma es siempre el total |
| Clientes | longitud de `estado.clientes` |
| Servicios del catálogo | longitud de `estado.catalogo` |

## Paleta (configuración, no datos de la usuaria)

Definida en `js/tema.js`; ver [contracts/tema.md](contracts/tema.md). No se guarda en `localStorage`.
