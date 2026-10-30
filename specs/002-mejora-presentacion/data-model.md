# Data model — R2, dirección visual «Despacho»

## Resumen

**R2 no cambia ningún dato.** No se añade, se quita ni se renombra ninguna entidad, ningún campo ni ninguna clave. No hay migración. Esta revisión es de presentación y solo lee el estado (FR-019, FR-020).

| Comprobación | Resultado |
|---|---|
| Clave de `localStorage` | `presupuestospro.v1`, sin cambios |
| Forma del documento JSON | Sin cambios |
| Entidades nuevas | Ninguna |
| Campos nuevos o eliminados | Ninguno |
| Migración necesaria | No |
| Escrituras introducidas por R2 | Ninguna: ni `App.cambiar` ni `Almacen.guardar` |
| Importes | Siguen en céntimos enteros |

## Entidades existentes (sin cambios)

- **Perfil de la profesional**: nombre, NIF, teléfono, email, dirección y logo. R2 no toca su contenido ni el encuadre del logo.
- **Cliente**: nombre, NIF/CIF, email.
- **Servicio del catálogo**: concepto y precio habitual.
- **Presupuesto**: número `AAAA-NNN`, fecha de emisión, cliente, líneas (concepto, cantidad en centésimas, precio en céntimos), observaciones y contadores de numeración.

## Valores derivados (calculados al mostrar, nunca almacenados)

Siguen siendo los mismos de R1. R2 solo cambia **cómo se componen**, no cómo se calculan.

| Valor | Origen | Qué cambia en R2 |
|---|---|---|
| Estado de vigencia (Vigente / Caducado) | Fecha de validez frente a la fecha local | Solo su presentación: deja de leerse como un botón (FR-027). La regla de cálculo no se toca (FR-013). |
| Resumen de actividad | Recuento de presupuestos, vigentes, caducados, clientes y servicios | Solo su composición: las cifras dejan de ir en el color de acento y pasan a cifras de ancho constante (FR-024, FR-030). |
| Fecha de validez | Emisión + 30 días | Nada. |
| Totales del presupuesto | Base, IVA 21 %, retención de IRPF, total | Nada en el cálculo. El total gana un escalón tipográfico propio al mostrarse (FR-011). |

## Único valor derivado nuevo

**Complemento de contexto del título de pantalla** (FR-026). Es un texto corto que acompaña al título y que se obtiene de recuentos que ya existen; no se guarda, no se configura y no pide ningún dato a la profesional (FR-007).

| Pantalla | De dónde sale | Ejemplo |
|---|---|---|
| Presupuestos | Número de presupuestos guardados | «3 guardados» |
| Clientes | Número de clientes guardados | «1 guardado» |
| Catálogo | Número de servicios guardados | «4 servicios» |
| Inicio | No lleva recuento: el título nombra la pantalla | «Resumen de actividad» |
| Perfil | Texto fijo | «Tus datos para los presupuestos» |

Reglas de redacción, en español de España:

- Singular y plural correctos: «1 guardado» / «3 guardados», «1 servicio» / «4 servicios».
- Caso cero: «Ninguno todavía», coherente con el mensaje de lista vacía que ya existe.
- El número se compone con cifras de ancho constante, igual que el resto de datos numéricos (FR-024).

## Impacto en otras specs

- **Spec 001**: sin impacto. Cálculos, numeración, validaciones y límites intactos (FR-019).
- **Spec 003**: sin impacto en datos. `Pdf.construir` conserva firma y salida, así que el `.zip` sigue conteniendo los mismos archivos; sus PDF saldrán con el aspecto nuevo y el `datos-presupuestospro.json` no cambia de forma.
