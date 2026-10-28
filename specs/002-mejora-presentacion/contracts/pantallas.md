# Contrato: pantallas y textos (cambios sobre la spec 001)

Solo se describe lo que cambia respecto a [pantallas.md de la spec 001](../../001-presupuestos-pro-v0/contracts/pantallas.md). Todo lo demás (botones, validaciones, mensajes) permanece igual. Textos en español de España.

## Menú común (todas las pantallas)

- Cabecera pegajosa con el nombre «Presupuestos Pro» y cinco entradas, en este orden: **Inicio**, **Presupuestos**, **Clientes**, **Catálogo**, **Perfil**.
- La entrada de la sección actual se marca visualmente y con `aria-current="page"`. El editor de presupuesto marca «Presupuestos».
- En 320 px las cinco entradas se reparten en dos filas sin desplazamiento horizontal. Cada entrada mide al menos 44 px de alto.
- Se comporta igual que hoy: pulsarlo cambia de pantalla; en el editor no añade avisos nuevos de cambios sin guardar.

## Inicio (pantalla de arranque)

1. Título «Inicio».
2. **Resumen de actividad**, cinco cifras con su etiqueta (vigentes + caducados = presupuestos):
   - «Presupuestos» (total)
   - «Vigentes»
   - «Caducados»
   - «Clientes»
   - «Servicios del catálogo»
3. **Accesos**: cuatro tarjetas pulsables, «Presupuestos», «Clientes», «Catálogo» y «Perfil», cada una con una frase corta:
   - Presupuestos: «Crea, abre y descarga tus presupuestos.»
   - Clientes: «Tu lista de clientes guardados.»
   - Catálogo: «Tus servicios y precios habituales.»
   - Perfil: «Tus datos y tu logo para los presupuestos.»
4. Botón principal «Nuevo presupuesto», que abre el editor vacío.
5. **Sin presupuestos**: las cifras salen a 0 y aparece «Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.»
6. **Datos ilegibles** (spec 001, FR-031a): se muestra el mismo aviso de error de siempre y los botones de guardado siguen bloqueados.

## Presupuestos (listado)

- Nueva columna/línea **Estado** con una etiqueta: «Vigente» o «Caducado» (y nunca otro valor).
- En móvil, cada presupuesto es una tarjeta con las etiquetas de campo (Número, Cliente, Fecha de emisión, Total, Estado).
- El resto (orden, Abrir, Descargar PDF, Borrar y su confirmación) no cambia.

## Perfil

- Es la pantalla de «Mis datos» con el título «Perfil». Mismos campos y comportamiento.
- Aviso de datos incompletos antes del PDF, con el nuevo nombre: «Faltan tus datos (nombre y NIF). Puedes completarlos en «Perfil». ¿Descargar el PDF igualmente?»

## Editor, Clientes y Catálogo

- Sin cambios de campos ni de comportamiento; solo apariencia con el tema.
- Editor: las líneas se apilan como tarjetas en móvil; el bloque de totales ocupa todo el ancho en móvil y se alinea a la derecha desde 640 px; el **TOTAL** es la cifra más grande.
- Errores: texto bajo el campo, además del borde, en `error`.
