# Quickstart: validar Presupuestos Pro v0

Esta guía prueba la aplicación de principio a fin, sin leer código (principio IV de la constitución). Referencias: [pantallas](contracts/pantallas.md), [PDF](contracts/pdf.md) y [almacenamiento](contracts/almacenamiento.md).

## Requisitos previos

- Windows con Google Chrome o Microsoft Edge actualizado.
- La carpeta del proyecto copiada en el ordenador. No hay nada que instalar ni hace falta conexión a internet.

## 1. Pruebas automáticas de cálculo

1. Abre `pruebas.html` con doble clic.
2. **Resultado esperado**: todas las filas aparecen en verde y el resumen dice «Todas las pruebas superadas». Las pruebas cubren:
   - Los cuatro casos de la tabla de reglas de negocio de la spec.
   - Los escenarios de 100,00 € para particular, 15 % y 7 %.
   - Las dos líneas que suman una base de 160,00 €.
   - La validez: 23/10/2026 + 30 días = 22/11/2026.
   - La numeración: 2026-001, 2026-002, sin reutilizar números borrados y con reinicio en 2027-001.
   - El formato «1.234,56 €».
   - Las validaciones de cantidad 0, precio negativo y concepto vacío.

## 2. Validación manual en la aplicación

Abre `index.html` con doble clic. Para empezar desde cero, usa un perfil del navegador sin datos previos de esta aplicación.

| # | Pasos | Resultado esperado | Spec |
|---|-------|--------------------|------|
| 1 | En «Mis datos», rellena nombre, NIF, teléfono, email y dirección, sube un logo PNG y guarda. Cierra el navegador y vuelve a abrir `index.html` | Los datos y el logo siguen ahí | HU3, FR-031 |
| 2 | En «Catálogo», crea «Diseño de identidad visual» a 750,00 €, «Licencias utilizadas para el diseño» a 45,00 € y «Adaptaciones para redes sociales» a 120,00 € | Aparecen en la tabla con formato «750,00 €» | HU4 |
| 3 | En «Clientes», crea «Estudio Norte S.L.» de tipo Empresa | Aparece en la lista | FR-008a |
| 4 | Pulsa «Nuevo presupuesto», elige a Estudio Norte y añade los tres servicios del catálogo con cantidades 1, 2 y 3 | Retención propuesta del 15 %. Base 1.200,00 €, IVA 252,00 €, retención -180,00 € y total 1.272,00 € | HU1, escenarios 8 y 10 |
| 5 | Cambia la retención al 7 % | Retención -84,00 € y total 1.368,00 € | Tabla de reglas |
| 6 | Cambia el tipo de cliente a Particular | La retención desaparece y el total es 1.452,00 € | FR-022 |
| 7 | Vuelve a Empresa con el 15 % y pulsa Guardar | Se ve «Presupuesto AAAA-001 guardado.», con el año actual | FR-012 |
| 8 | Pulsa «Descargar PDF» y abre el archivo | Se llama `Presupuesto-AAAA-001.pdf` y cumple [contracts/pdf.md](contracts/pdf.md). No aparece la palabra «factura» ni el catálogo | HU2, FR-028, FR-029, FR-029a |
| 9 | Crea un segundo presupuesto válido y guárdalo | Recibe el número AAAA-002 | Escenario 2 |
| 10 | Borra el AAAA-002, confirma y crea otro presupuesto | El nuevo recibe AAAA-003 | FR-013 |
| 11 | En un presupuesto nuevo, añade una línea manual con cantidad 0 y pulsa Guardar | Aparece «La cantidad debe ser mayor que cero.» y no se guarda | Casos límite |
| 12 | Pon un precio de -5 € y pulsa Guardar | Aparece «El precio debe ser igual o superior a 0 €.» y no se guarda | Casos límite |
| 13 | Quita todas las líneas y pulsa «Descargar PDF» | Aparece «Añade al menos una línea para poder descargar el presupuesto.» | FR-016 |
| 14 | Añade una línea manual de 1,5 × 40,00 € | El importe es 60,00 € | Cantidades decimales |
| 15 | Edita Estudio Norte en «Clientes», cambia el nombre y abre el AAAA-001 | El presupuesto conserva el nombre original | FR-008c |
| 16 | Cambia el precio de un servicio en «Catálogo» y abre el AAAA-001 | Las líneas no cambian | FR-007 |
| 17 | Borra el nombre en «Mis datos» e intenta descargar un PDF. Acepta el aviso | Aparece el aviso de que faltan tus datos. Al aceptar, el PDF se descarga sin nombre y con el resto de tus datos | FR-030 |
| 18 | Desconecta internet y repite el paso 8 | El PDF se descarga igual | FR-032 |
| 19 | Con los datos y el catálogo ya creados, cronometra la creación de un presupuesto de tres líneas del catálogo hasta descargar el PDF | Menos de 2 minutos | SC-001 |
| 20 | Entrega a una persona sin conocimientos técnicos solo `LEEME.md`, y pídele que cree y descargue su primer presupuesto sin ayuda | Lo completa en el primer intento sin preguntar | SC-006 |
| 21 | En «Mis datos», intenta subir un logo GIF o una imagen de más de 500 KB | Aparece «El logo debe ser una imagen PNG o JPG de 500 KB como máximo.» y no se guarda | FR-003 |
| 22 | Abre el PDF del paso 8 y revisa los conceptos con tildes y ñ y el símbolo € | Todos los caracteres se ven correctamente | FR-033 |

## Criterio de terminado

Las pruebas automáticas aparecen todas en verde y los 22 pasos manuales dan el resultado esperado.

## Resultados de la validación (2026-10-27)

Se ejecutó en Chrome y Edge para Windows, con los navegadores en modo sin ventana. Una página de prueba cargó la aplicación real, pulsó sus botones y rellenó sus campos como lo haría la usuaria. Dio 75 comprobaciones correctas en cada navegador. `pruebas.html` dio «Todas las pruebas superadas (44 casos)» en los dos.

| # | Resultado | Cómo se comprobó |
|---|-----------|------------------|
| 1 | ✅ | Datos guardados y aplicación reabierta en otra sesión del navegador: los datos siguen ahí. El logo se comprobó en el PDF. |
| 2 a 7 | ✅ | Automático. Importes 1.272,00 €, 1.368,00 € y 1.452,00 €, y número AAAA-001. |
| 8 | ✅ | Automático, más una revisión visual del PDF dibujado: título, número, fechas, cliente, líneas, totales y observaciones. Sin «factura» y sin catálogo. |
| 9 y 10 | ✅ | Automático: 002, se borra y el siguiente es 003. |
| 11 a 14 | ✅ | Automático: mensajes de cantidad 0, precio negativo y PDF sin líneas, e importe de 60,00 €. |
| 15 y 16 | ✅ | Automático: el presupuesto conserva el nombre del cliente y el precio originales. |
| 17 | ✅ | Automático: aparece el aviso y, al aceptarlo, se genera el PDF sin los datos vacíos. |
| 18 | ✅ | El código no contiene ninguna dirección de internet y las librerías están en `vendor/`. Falta repetirlo a mano con la conexión desactivada. |
| 19 | ⏳ Pendiente | Requiere cronometrar a una persona. |
| 20 | ⏳ Pendiente | Requiere una persona sin conocimientos técnicos (SC-006). |
| 21 | ⏳ Parcial | El rechazo del GIF y del archivo de más de 500 KB está cubierto en `pruebas.html`. Falta probarlo a mano con el selector de archivos. |
| 22 | ✅ | PDF revisado visualmente: la ñ, las tildes, el símbolo º y el € se ven bien. |
