# Contrato: pantallas y mensajes

Es una sola página con un menú fijo de cuatro entradas: **Presupuestos**, **Clientes**, **Catálogo** y **Mis datos**. Todos los textos están en español de España (FR-033). Los importes se muestran como `1.234,56 €` y las fechas como `dd/mm/aaaa`.

## 1. Presupuestos (pantalla inicial)

- **Botón «Nuevo presupuesto»**: abre el editor vacío.
- **Tabla**: columnas Número, Cliente, Fecha de emisión y Total, del más reciente al más antiguo (FR-017).
- **Acciones por fila**: Abrir, Descargar PDF y Borrar.
- **Al borrar**: se pide confirmar con «¿Seguro que quieres borrar el presupuesto 2026-002? Su número no se volverá a usar.» (FR-018, FR-013).
- **Sin presupuestos**: se muestra «Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.»
- **Versión mínima, antes de la tabla de US5**: si hay presupuestos guardados se muestra «Tienes 1 presupuesto guardado.» o «Tienes N presupuestos guardados.» La versión entregada ya incluye la tabla, así que este mensaje no aparece.

## 2. Editor de presupuesto

- **Cabecera**: muestra el número, o «Sin número (se asigna al guardar)» si es nuevo, la fecha de emisión y la fecha de validez. En un presupuesto sin guardar, ambas fechas se calculan con el día actual y llevan la nota «(provisional)».
- **Cliente**:
  - Un selector «Elegir cliente guardado» y la opción «Cliente nuevo».
  - Campos: nombre o razón social, NIF/CIF, email y tipo (Particular, Empresa o Autónomo).
  - Al elegir un cliente guardado, sus datos se rellenan solos (FR-008b).
  - Con un cliente nuevo aparece la casilla «Guardar en mis clientes».
- **Retención**:
  - Solo se ve si el tipo es Empresa o Autónomo. Hay un selector con 15 % y 7 %, y por defecto el 15 % (FR-023).
  - Si el tipo cambia a Particular, se oculta y la retención pasa a 0,00 € (FR-022).
- **Líneas**:
  - Una tabla con Concepto, Cantidad, Precio unitario, Importe y un botón para quitar la línea.
  - Botones «Añadir del catálogo» y «Añadir línea manual» (FR-005, FR-010).
- **Observaciones**: un área de texto opcional (FR-011).
- **Totales**: base imponible, IVA (21 %), retención (−) y total. Se recalculan al momento con cada cambio (FR-025).
- **Botones**: «Guardar», «Descargar PDF» y «Volver».

**Mensajes de validación**: aparecen junto al campo y además se resumen arriba al pulsar Guardar.

| Situación | Mensaje |
|-----------|---------|
| Cliente sin nombre | «Escribe el nombre o la razón social del cliente.» |
| Línea sin concepto | «Escribe un concepto para esta línea.» |
| Cantidad 0 o negativa | «La cantidad debe ser mayor que cero.» |
| Precio negativo | «El precio debe ser igual o superior a 0 €.» |
| Descargar PDF sin líneas | «Añade al menos una línea para poder descargar el presupuesto.» |
| Descargar PDF sin nombre o NIF de la profesional | Aviso con confirmación, que no bloquea (FR-030): «Faltan tus datos (nombre y NIF). Puedes completarlos en «Mis datos». ¿Descargar el PDF igualmente?» |
| Guardado correcto | «Presupuesto 2026-001 guardado.» |
| Texto demasiado largo | «Este texto admite como máximo N caracteres.» |
| Cantidad que no es un número | «Escribe una cantidad válida, por ejemplo 1 o 1,5.» |
| Precio que no es un número | «Escribe un precio válido, por ejemplo 45 o 45,50.» |
| Resumen arriba al pulsar Guardar con errores | «No se ha podido guardar. Revisa estos datos:», seguido de la lista de mensajes |

**Otros textos del editor**:
- **Sin líneas**: «Todavía no hay líneas. Añade una desde el catálogo o escríbela a mano.»
- **Catálogo vacío**: el botón «Añadir del catálogo» está desactivado y su ayuda dice «Tu catálogo está vacío. Añade servicios en «Catálogo».»
- **Observaciones**: el campo vacío muestra «Opcional. Por ejemplo, forma de pago o condiciones.»

- «Descargar PDF» comprueba primero que hay al menos una línea. Si no la hay, muestra el mensaje y no guarda nada, para no gastar un número. Si la hay, guarda el presupuesto si es válido y tiene cambios, para que el PDF tenga número, y después muestra el aviso de datos si procede.

## 3. Clientes

- **Gestión**: tabla con Nombre, NIF/CIF, Email y Tipo, con las acciones Nuevo, Editar y Borrar (FR-008a).
- **Al borrar**: se pide confirmar con «¿Seguro que quieres borrar a {nombre}? Sus presupuestos no cambiarán.»
- **Formulario**: los botones «Nuevo cliente» y «Editar» abren un formulario con «Guardar» y «Cancelar».
- **Sin clientes**: se muestra «Todavía no tienes clientes guardados.»

## 4. Catálogo

- **Gestión**: tabla con Servicio y Precio habitual, con las acciones Nuevo, Editar y Borrar (FR-004).
- **Al borrar**: se pide confirmar con «¿Seguro que quieres borrar «{nombre}» del catálogo? Tus presupuestos no cambiarán.»
- **Validación**: un nombre vacío muestra «Escribe el nombre del servicio.» Un precio negativo o ilegible y un texto demasiado largo usan los mismos mensajes que en el editor.
- **Formulario**: los botones «Nuevo servicio» y «Editar» abren un formulario con «Guardar» y «Cancelar».
- **Sin servicios**: se muestra «Todavía no tienes servicios en el catálogo.»

## 5. Mis datos

- **Campos**: nombre, NIF, teléfono, email, dirección y logo, con vista previa y un botón «Quitar logo» (FR-001, FR-003).
- **Logo no válido**: si el archivo no es PNG o JPG, o supera los 500 KB, se muestra «El logo debe ser una imagen PNG o JPG de 500 KB como máximo.»
- **Botón «Guardar»**: muestra «Tus datos se han guardado.»
- **Textos de ayuda**: «Estos datos aparecen en todos tus presupuestos en PDF.» y, si no hay logo, «Sin logo.»
- **Texto demasiado largo**: usa el mismo mensaje que en el editor.
