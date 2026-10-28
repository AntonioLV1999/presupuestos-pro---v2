# Quickstart: validar la mejora de presentación

Se recorre sin leer código. Referencias: [pantallas](contracts/pantallas.md), [tema](contracts/tema.md), [PDF](contracts/pdf.md) y [modelo de datos](data-model.md).

## Requisitos previos

- Chrome o Edge actualizado, sin conexión.
- Una copia de seguridad de los datos que ya tengas no es necesaria: esta mejora no los modifica, pero conviene comprobarlo en el paso 6.

## 1. Pruebas automáticas

1. Abre `pruebas.html`.
2. **Esperado**: todo en verde. Las pruebas antiguas siguen pasando sin cambios (salvo el texto del aviso, que ahora dice «Perfil») y hay casos nuevos de vigencia: emisión 23/10/2026 con «hoy» 22/11/2026 → Vigente; con «hoy» 23/11/2026 → Caducado; y el recuento suma el total.

## 2. Inicio y navegación (FR-001 a FR-007, SC-001, SC-002)

| # | Pasos | Esperado |
|---|-------|----------|
| 1 | Abre `index.html` | Aparece «Inicio» con cinco cifras y cuatro accesos |
| 2 | Pulsa cada acceso, uno por uno | Se abre la sección correspondiente; la entrada del menú queda marcada |
| 3 | Desde el editor de un presupuesto pulsa «Clientes» en el menú | Cambia de pantalla sin usar «atrás» |
| 4 | Con datos vacíos (perfil de navegador nuevo) | Cifras a 0 y mensaje de primer presupuesto |
| 5 | Crea un presupuesto y vuelve a «Inicio» | «Presupuestos» y «Vigentes» suben en 1 |
| 6 | Comprueba que ninguna pantalla muestra «Mis datos» | Siempre «Perfil» |

## 3. Estados (FR-013, SC-003, SC-005)

1. Con un presupuesto reciente y otro emitido hace más de 30 días (puedes cambiar la fecha del ordenador al día siguiente de la validez para comprobarlo), abre «Presupuestos».
2. **Esperado**: uno con «Vigente» y otro con «Caducado», distinguibles también en blanco y negro. Las cifras de «Inicio» coinciden con el listado.
3. Restablece la fecha del ordenador.

## 4. Aspecto (FR-008 a FR-015, SC-006 a SC-008)

1. Recorre las seis pantallas en un ancho de 320 px (modo móvil de las herramientas del navegador o ventana estrecha) y en pantalla completa.
2. **Esperado**: una sola tipografía y una paleta corta; ninguna barra de desplazamiento horizontal en la página; tablas apiladas en móvil; botones cómodos de pulsar; en el editor el TOTAL es la cifra más grande.
3. Cambia el valor de `acento` en `js/tema.js`, recarga y descarga un PDF. **Esperado**: el color cambia en todas las pantallas y en el PDF.

## 5. PDF (FR-016 a FR-018, SC-009, SC-010)

1. Descarga el PDF de un presupuesto con logo y de otro sin logo ni datos de perfil.
2. Descarga el de uno con 30 líneas y con un concepto de 200 caracteres.
3. **Esperado**: mismo contenido que antes, mismos importes, aspecto coherente con la aplicación, tabla en varias páginas con cabecera repetida, totales completos y sin la palabra «factura».

## 6. Sin regresión (FR-019, FR-020, SC-004)

1. Antes de instalar la mejora, anota número, cliente y total de tus presupuestos.
2. Tras instalarla, comprueba que son idénticos y que los escenarios de cálculo de la spec 001 (100,00 € de base: particular, 15 % y 7 %) siguen dando los mismos importes.
