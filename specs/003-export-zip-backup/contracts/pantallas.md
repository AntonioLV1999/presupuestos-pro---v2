# Contrato: pantalla de presupuestos (cambios)

Solo cambia la pantalla «Presupuestos» ([presupuestos.js](../../../js/ui/presupuestos.js)). Textos en español de España.

## Botón

- Texto exacto: **«Exportar todo (.zip)»**.
- Ubicación: en la barra de acciones de la cabecera de la lista, junto a «Nuevo presupuesto». Visible también con la lista vacía.
- Estilo: secundario (no compite con «Nuevo presupuesto», que sigue siendo el primario).
- Con datos dañados queda deshabilitado (lleva `data-guarda`).

## Estados y textos

| Situación | Qué ve la usuaria |
|-----------|-------------------|
| Sin presupuestos | Mensaje: «No hay presupuestos que exportar. Crea alguno y vuelve a intentarlo.» No se descarga nada. |
| Preparando | Botón deshabilitado; texto de estado «Preparando la copia… 12 de 50» (región `role="status"`, se actualiza tras cada PDF) |
| Éxito | Se descarga el .zip y aparece: «Copia lista: 3 presupuestos guardados en presupuestospro-copia-2026-03-15.zip.» (en singular: «1 presupuesto guardado») |
| Error | Mensaje de error: «No se ha podido crear la copia. Tus datos no han cambiado.» El botón vuelve a habilitarse. |

## Garantías

- No se llama a `App.cambiar` ni a `Almacen.guardar`.
- Al terminar (con éxito o error) los datos quedan como estaban.
- Una sola exportación a la vez.
