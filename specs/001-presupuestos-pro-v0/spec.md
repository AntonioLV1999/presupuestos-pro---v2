# Feature Specification: Presupuestos Pro v0

**Feature Branch**: `001-presupuestos-pro-v0`

**Created**: 2026-10-23

**Status**: Clarified

**Input**: User description: "Presupuestos Pro v0: herramienta local para que cualquier freelancer configure su marca, mantenga un catálogo de servicios, calcule automáticamente base imponible, IVA (21 %), retención de IRPF (15 % o 7 %) y total, numere los presupuestos por año (AAAA-NNN) con validez de 30 días, y genere un PDF que la propia persona usuaria envía por correo a sus clientes."

## Contexto de negocio

Muchos freelancers elaboran sus presupuestos en hojas de cálculo antiguas, y cada presupuesto les lleva mucho más tiempo del necesario. El objetivo de esta versión es que preparar un presupuesto completo, con todos los cálculos fiscales hechos y listo para enviar en PDF, lleve como mucho un par de minutos.

**Usuario**: cualquier freelancer o profesional autónomo, de cualquier sector, que emite presupuestos a sus clientes. No se presuponen conocimientos técnicos.
**Ejemplo de uso**: una diseñadora freelance sin conocimientos técnicos que hoy hace sus presupuestos con un Excel anticuado. Los ejemplos de este documento, como los conceptos de diseño, salen de este caso, pero nada en la aplicación es específico del diseño.
**Destinatarios del resultado**: los clientes del freelancer, que reciben el PDF por correo electrónico y nunca usan la aplicación.
**Terminología**: en este documento, «la profesional» y «la freelancer» designan a cualquier persona usuaria de la aplicación, sea cual sea su sector.

## Clarifications

### Session 2026-10-26

- Q: ¿Cómo debe abrirse y usarse la aplicación en el ordenador de la profesional? → A: Se abre en el navegador, pero funciona solo en su ordenador, sin internet ni servidores, y los datos se guardan ahí.
- Q: ¿Se guardan los datos de los clientes para reutilizarlos en presupuestos futuros? → A: Sí, en una lista simple de clientes (nombre o razón social, NIF/CIF, email y tipo). Al crear un presupuesto se elige uno o se escribe uno nuevo. Sin historial ni seguimiento.
- Q: ¿Cómo se decide si un presupuesto lleva retención del 15 % o del 7 %? → A: No hay ajuste general en los datos de la profesional. Se elige 15 % o 7 % en cada presupuesto para clientes empresa o autónomo, y por defecto se propone el 15 %.
- Q: ¿Qué pasa con la numeración si se borra un presupuesto ya guardado? → A: Se puede borrar y su número no se reutiliza nunca; queda un hueco en la numeración.
- Q: ¿Qué lista de servicios aparece en el PDF que recibe el cliente? → A: Solo las líneas de ese presupuesto, con concepto, cantidad, precio aplicado e importe. El catálogo no aparece.
- Q: ¿La aplicación es solo para diseñadoras? → A: No. Es para cualquier freelancer; la diseñadora freelance es solo el ejemplo de uso.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear un presupuesto con los cálculos automáticos (Priority: P1)

La freelancer crea un presupuesto nuevo, indica los datos del cliente y su tipo (particular, empresa o autónomo), y añade líneas con concepto, cantidad y precio unitario. La aplicación asigna el número del presupuesto, calcula la fecha de validez y muestra en todo momento la base imponible, el IVA, la retención de IRPF y el total.

**Why this priority**: Es el núcleo del problema. Sin cálculos automáticos y numeración no hay ahorro de tiempo frente a la hoja de cálculo actual.

**Independent Test**: Se puede probar por completo creando un presupuesto con líneas escritas a mano, sin catálogo ni datos de marca, y comprobando que los importes coinciden con los ejemplos de esta especificación.

**Acceptance Scenarios**:

1. **Given** que no existe ningún presupuesto de 2026, **When** la freelancer guarda su primer presupuesto de 2026, **Then** el número mostrado es exactamente 2026-001.
2. **Given** que ya existe el presupuesto 2026-001, **When** guarda un segundo presupuesto en 2026, **Then** el número mostrado es exactamente 2026-002.
3. **Given** un presupuesto con una única línea de 100,00 € y un cliente particular, **When** se muestran los totales, **Then** se ve IVA 21,00 €, retención 0,00 € y total 121,00 €.
4. **Given** un presupuesto con una única línea de 100,00 € y un cliente empresa o autónomo con retención del 15 %, **When** se muestran los totales, **Then** se ve IVA 21,00 €, retención 15,00 € y total 106,00 €.
5. **Given** un presupuesto con una única línea de 100,00 € y un cliente empresa o autónomo con retención del 7 %, **When** se muestran los totales, **Then** se ve IVA 21,00 €, retención 7,00 € y total 114,00 €.
6. **Given** un presupuesto con retención aplicada a un cliente empresa o autónomo, **When** se cambia el tipo de cliente a particular, **Then** la retención pasa automáticamente a 0,00 € y deja de descontarse del total.
7. **Given** un presupuesto vacío, **When** se añaden una línea de 2 × 50,00 € y otra de 3 × 20,00 €, **Then** la base imponible mostrada es exactamente 160,00 €.
8. **Given** el presupuesto del ejemplo completo de las reglas de negocio (1 × 750,00 €, 2 × 45,00 €, 3 × 120,00 €) para una empresa con retención del 15 %, **When** se muestran los totales, **Then** se ve base 1.200,00 €, IVA 252,00 €, IRPF −180,00 € y total 1.272,00 €.
9. **Given** un presupuesto emitido el 23/10/2026, **When** se consulta su validez, **Then** la fecha de validez mostrada es el 22/11/2026.
10. **Given** un cliente guardado «Estudio Norte S.L.» de tipo empresa, **When** la freelancer lo elige al crear un presupuesto, **Then** sus datos y su tipo se rellenan solos y se propone una retención del 15 %.
11. **Given** un presupuesto para una empresa con la retención propuesta del 15 %, **When** la freelancer la cambia al 7 %, **Then** la retención y el total se recalculan al momento y los demás presupuestos no cambian.

---

### User Story 2 - Generar el PDF del presupuesto (Priority: P2)

La freelancer descarga el presupuesto en PDF para enviarlo por su cuenta por correo electrónico a su cliente. El PDF lleva sus datos y su logo, los datos del cliente, las líneas, los totales y la fecha de validez, y se identifica claramente como presupuesto.

**Why this priority**: El PDF es lo que recibe el cliente y lo que sustituye al documento actual. Depende de que exista un presupuesto válido.

**Independent Test**: Se puede probar creando un presupuesto válido, descargando el PDF y revisándolo visualmente contra la lista de contenidos obligatorios.

**Acceptance Scenarios**:

1. **Given** un presupuesto válido, **When** la freelancer genera el PDF, **Then** el documento incluye el número del presupuesto, la fecha de emisión, la fecha de validez a 30 días, los datos de la profesional, los datos del cliente, las líneas con concepto, cantidad, precio unitario e importe, y los totales.
2. **Given** cualquier PDF generado, **When** se lee completo, **Then** el documento se identifica como «Presupuesto» y la palabra «factura» no aparece en ningún sitio.
3. **Given** un presupuesto sin ninguna línea, **When** la freelancer intenta generar el PDF, **Then** la aplicación no lo genera y muestra un mensaje indicando que debe añadirse al menos una línea.
4. **Given** un presupuesto con observaciones escritas, **When** se genera el PDF, **Then** las observaciones aparecen en el documento.

---

### User Story 3 - Configurar los datos de la profesional (Priority: P3)

La freelancer introduce una sola vez su nombre, NIF, datos de contacto y logo. Desde ese momento todos sus presupuestos y PDF salen con su marca.

**Why this priority**: Evita repetir datos en cada presupuesto, pero un presupuesto se puede calcular sin ellos.

**Independent Test**: Se puede probar rellenando los datos, cerrando y volviendo a abrir la aplicación, y comprobando que siguen ahí y que aparecen en un PDF nuevo.

**Acceptance Scenarios**:

1. **Given** que la freelancer ha guardado su nombre, NIF, contacto y logo, **When** genera el PDF de cualquier presupuesto, **Then** esos datos y el logo aparecen en el documento sin haberlos escrito de nuevo.
2. **Given** que la freelancer no ha subido logo, **When** genera un PDF, **Then** el documento sale correctamente sin logo.

---

### User Story 4 - Mantener un catálogo de servicios (Priority: P4)

La freelancer guarda la lista de los servicios que ofrece con su precio habitual. Al hacer un presupuesto, elige servicios del catálogo en lugar de escribirlos cada vez.

**Why this priority**: Acelera mucho el trabajo diario, pero los presupuestos funcionan también con líneas escritas a mano.

**Independent Test**: Se puede probar dando de alta servicios, cerrando y volviendo a abrir la aplicación, y añadiendo uno de ellos a un presupuesto.

**Acceptance Scenarios**:

1. **Given** un servicio del catálogo «Diseño de identidad visual» a 750,00 €, **When** la freelancer lo añade a un presupuesto, **Then** aparece una línea con ese concepto, precio 750,00 € y cantidad 1.
2. **Given** una línea que viene del catálogo, **When** la freelancer cambia su precio en el presupuesto, **Then** el precio del servicio en el catálogo no cambia.
3. **Given** un servicio que no está en el catálogo, **When** la freelancer escribe a mano su concepto, cantidad y precio, **Then** la línea se incluye en los cálculos igual que una del catálogo.
4. **Given** que la freelancer edita o borra un servicio del catálogo, **When** abre un presupuesto guardado antes que usaba ese servicio, **Then** las líneas de ese presupuesto no cambian.

---

### User Story 5 - Consultar y retomar presupuestos guardados (Priority: P5)

La freelancer ve un listado de sus presupuestos guardados, puede abrir cualquiera para revisarlo, editarlo, volver a generar su PDF o borrarlo.

**Why this priority**: Garantiza que el trabajo no se pierde entre sesiones, pero no es imprescindible para crear el primer presupuesto.

**Independent Test**: Se puede probar guardando dos presupuestos, cerrando y abriendo la aplicación, y comprobando que ambos aparecen en el listado y se pueden abrir.

**Acceptance Scenarios**:

1. **Given** dos presupuestos guardados, **When** la freelancer cierra y vuelve a abrir la aplicación, **Then** ambos aparecen en el listado con su número, cliente, fecha y total.
2. **Given** un presupuesto guardado con número 2026-002, **When** se edita una de sus líneas, **Then** el número sigue siendo 2026-002 y los totales se recalculan.
3. **Given** que se borra el presupuesto 2026-002 y existe el 2026-003, **When** se guarda un presupuesto nuevo en 2026, **Then** recibe el número 2026-004 y el 2026-002 no se reutiliza.

---

### Edge Cases

- **Presupuesto sin líneas**: la aplicación no permite generar el PDF y muestra un mensaje indicando que debe añadirse al menos una línea.
- **Se borran todas las líneas de un presupuesto ya creado**: el presupuesto vuelve a ser no válido y no puede descargarse en PDF hasta que se añada al menos una línea.
- **Servicio que no está en el catálogo**: se introduce a mano con concepto, cantidad y precio, y cuenta en los cálculos como cualquier otro.
- **Retención marcada para un cliente particular**: la aplicación la ignora, la deja en 0 % y recalcula el total sin deducción.
- **Línea con cantidad 0 o negativa**: la aplicación impide guardar el presupuesto y muestra un mensaje indicando que la cantidad debe ser mayor que cero.
- **Línea con precio negativo**: la aplicación impide guardar el presupuesto y muestra un mensaje indicando que el precio debe ser igual o superior a 0 €.
- **Línea con precio 0 €**: se admite, por ejemplo para un concepto incluido sin coste.
- **Línea sin concepto**: la aplicación impide guardar el presupuesto y pide escribir un concepto.
- **Primer presupuesto de un año nuevo**: la numeración se reinicia y recibe el número 001 de ese año, por ejemplo 2027-001.
- **Cantidades con decimales**: se admiten con hasta dos decimales, por ejemplo 1,5 horas.
- **Se borra el último presupuesto del año**: su número tampoco se reutiliza. Si se borra el 2026-005 y era el último, el siguiente es el 2026-006.
- **Cliente guardado editado o borrado**: los presupuestos ya guardados conservan los datos del cliente tal como estaban.
- **Datos de la profesional sin configurar**: se puede crear y guardar el presupuesto. Antes de generar el PDF, la aplicación avisa de que faltan el nombre o el NIF y deja continuar si la profesional lo confirma. El PDF muestra solo los datos de la profesional que estén rellenos.
- **Presupuesto abierto un día y guardado otro**: la fecha de emisión es la del primer guardado. Un presupuesto empezado el 31/12/2026 y guardado el 01/01/2027 recibe fecha 01/01/2027 y número 2027-NNN.
- **Logo no válido**: si el archivo no es PNG o JPG, o pesa más de 500 KB, no se acepta y se muestra un mensaje que lo explica.
- **Texto demasiado largo**: si un campo supera su longitud máxima, no se guarda y se muestra un mensaje.
- **Datos guardados dañados**: si la aplicación no puede leer los datos guardados, no los borra ni los sobrescribe, avisa a la profesional y no permite guardar cambios.
- **Sin espacio para guardar**: si el navegador no deja guardar por falta de espacio, la aplicación lo avisa, sugiere usar un logo más pequeño y no da el cambio por guardado.

## Requirements *(mandatory)*

### Functional Requirements

**Datos de la profesional**

- **FR-001**: La aplicación DEBE permitir guardar el nombre, NIF, datos de contacto (teléfono, email y dirección) y logo de la profesional, para usarlos en todos los presupuestos.
- **FR-002**: Los datos de la profesional NO DEBEN incluir ningún ajuste de retención. El porcentaje se elige en cada presupuesto, según FR-023.
- **FR-003**: El logo DEBE ser opcional y admitir solo imágenes PNG o JPG de 500 KB como máximo. Si el archivo no cumple, la aplicación DEBE rechazarlo con un mensaje.

**Catálogo de servicios**

- **FR-004**: La aplicación DEBE permitir dar de alta, editar y borrar servicios del catálogo, cada uno con nombre y precio habitual. Borrar un servicio DEBE pedir confirmación.
- **FR-005**: Al añadir un servicio del catálogo a un presupuesto, la aplicación DEBE crear una línea con su nombre como concepto, su precio habitual como precio unitario y cantidad 1.
- **FR-006**: La aplicación DEBE permitir modificar el concepto, la cantidad y el precio de una línea sin alterar el catálogo.
- **FR-007**: Los cambios en el catálogo NO DEBEN modificar los presupuestos ya guardados.

**Presupuestos**

- **FR-008**: Cada presupuesto DEBE incluir los datos del cliente: nombre o razón social (obligatorio), NIF/CIF (opcional), email (opcional) y tipo de cliente (particular, empresa o autónomo).
- **FR-008a**: La aplicación DEBE mantener una lista simple de clientes guardados, con los mismos datos de FR-008, y permitir dar de alta, editar y borrar clientes. Borrar un cliente DEBE pedir confirmación.
- **FR-008b**: Al crear un presupuesto, la profesional DEBE poder elegir un cliente de la lista, que rellena sus datos automáticamente, o escribir uno nuevo. Al escribir uno nuevo, la aplicación DEBE ofrecer guardarlo en la lista.
- **FR-008c**: Los datos del cliente DEBEN copiarse en el presupuesto al guardarlo. Editar o borrar después un cliente de la lista NO DEBE modificar los presupuestos ya guardados.
- **FR-009**: Cada línea DEBE mostrar el concepto, la cantidad, el precio unitario y el importe de la línea.
- **FR-010**: La aplicación DEBE permitir añadir líneas desde el catálogo y líneas escritas a mano, y tratarlas igual en los cálculos.
- **FR-011**: La aplicación DEBE permitir un campo opcional de observaciones en cada presupuesto.
- **FR-012**: La aplicación DEBE asignar a cada presupuesto, al guardarlo por primera vez, un número con el formato AAAA-NNN, donde AAAA es el año de la fecha de emisión y NNN un contador de tres cifras que empieza en 001 cada año.
- **FR-013**: Los números NO DEBEN reutilizarse aunque se borre un presupuesto, y NO DEBEN cambiar al editarlo.
- **FR-014**: La fecha de emisión DEBE ser la del día en que se guarda el presupuesto por primera vez, y no es editable. Mientras no se guarde, el editor muestra la fecha del día como provisional. La fecha de validez DEBE ser la de emisión más 30 días naturales.
- **FR-015**: La aplicación DEBE impedir guardar un presupuesto con líneas sin concepto, con cantidad igual o menor que cero o con precio negativo, mostrando un mensaje que explique el problema.
- **FR-016**: La aplicación DEBE impedir generar el PDF de un presupuesto sin líneas, mostrando un mensaje que indique que debe añadirse al menos una línea.
- **FR-017**: La aplicación DEBE mostrar un listado de los presupuestos guardados, ordenado del más reciente al más antiguo, con número, cliente, fecha de emisión y total.
- **FR-018**: La aplicación DEBE permitir abrir, editar y borrar presupuestos guardados. Borrar DEBE pedir confirmación.

**Cálculos fiscales**

- **FR-019**: La base imponible DEBE ser la suma de los importes de todas las líneas, siendo el importe de cada línea la cantidad por el precio unitario.
- **FR-020**: El IVA DEBE ser el 21 % de la base imponible.
- **FR-021**: La retención de IRPF DEBE ser el 15 % o el 7 % de la base imponible, y solo DEBE aplicarse si el cliente es una empresa o un autónomo.
- **FR-022**: A un cliente particular NUNCA DEBE aplicársele retención. Si el tipo de cliente cambia a particular, la retención DEBE pasar a 0,00 € automáticamente.
- **FR-023**: Para clientes empresa o autónomo, la aplicación DEBE permitir elegir en cada presupuesto entre 15 % y 7 %, y DEBE proponer el 15 % por defecto, también al cambiar el tipo de cliente de particular a empresa o autónomo.
- **FR-024**: El total DEBE ser la base imponible más el IVA menos la retención.
- **FR-025**: La aplicación DEBE recalcular y mostrar los totales al momento cada vez que cambie una línea, el tipo de cliente o el porcentaje de retención.
- **FR-026**: Cada importe de línea, el IVA y la retención DEBEN redondearse a dos decimales, y el total DEBE calcularse con esos valores ya redondeados.

**PDF**

- **FR-027**: La aplicación DEBE generar un PDF de cualquier presupuesto válido, que la profesional descarga y envía por su cuenta.
- **FR-027a**: Al pedir el PDF de un presupuesto nuevo o con cambios sin guardar, la aplicación DEBE guardarlo primero, para que el PDF tenga número. Si el presupuesto no tiene líneas o no es válido, no se guarda ni se genera el PDF, y se muestran los errores. Así no se gasta un número en un presupuesto vacío.
- **FR-028**: El PDF DEBE incluir: el título «Presupuesto», el número, la fecha de emisión, la fecha de validez, los datos de la profesional que estén rellenos (nombre, NIF, contacto y logo), los datos del cliente, las líneas del presupuesto con concepto, cantidad, precio unitario aplicado e importe, la base imponible, el IVA, la retención (si la hay), el total y las observaciones (si las hay).
- **FR-029**: El PDF NO DEBE contener la palabra «factura» ni presentarse como factura.
- **FR-029a**: El PDF NO DEBE incluir el catálogo de servicios ni los precios habituales; solo las líneas del presupuesto con el precio aplicado.
- **FR-030**: Si faltan el nombre o el NIF de la profesional, la aplicación DEBE avisar antes de generar el PDF y DEBE permitir continuar si la profesional lo confirma. Los datos vacíos no aparecen en el PDF.

**Generales**

- **FR-031**: Todos los datos (profesional, catálogo, clientes guardados y presupuestos) DEBEN seguir disponibles al cerrar y volver a abrir la aplicación.
- **FR-031a**: Si los datos guardados no se pueden leer, la aplicación NO DEBE borrarlos ni sobrescribirlos. DEBE avisar a la profesional y no permitir guardar. Si no queda espacio para guardar, DEBE avisarlo y no dar el cambio por guardado.
- **FR-032**: La aplicación DEBE abrirse en el navegador y funcionar íntegramente en el ordenador de la profesional, sin conexión a internet, sin cuentas, sin contraseñas y sin enviar datos a ningún servidor externo. Todos los datos DEBEN guardarse en ese ordenador.
- **FR-033**: Todos los textos de la aplicación y del PDF DEBEN estar en español de España, y los importes DEBEN mostrarse en euros con formato español (por ejemplo, 1.234,56 €).
- **FR-034**: Los textos DEBEN respetar estas longitudes máximas, y la aplicación DEBE impedir guardar y mostrar un mensaje si se superan:

  | Dato | Máximo |
  |------|--------|
  | Nombre de la profesional | 120 caracteres |
  | NIF de la profesional, NIF/CIF del cliente | 20 caracteres |
  | Teléfono | 30 caracteres |
  | Dirección | 200 caracteres |
  | Nombre del cliente, nombre del servicio, concepto de línea | 200 caracteres |
  | Observaciones | 1.000 caracteres |

### Reglas de negocio con ejemplos

**Ejemplo completo (presupuesto 2026-001)**

| Concepto | Cantidad | Precio | Importe |
|----------|----------|--------|---------|
| Diseño de identidad visual | 1 | 750,00 € | 750,00 € |
| Licencias utilizadas para el diseño | 2 | 45,00 € | 90,00 € |
| Adaptaciones para redes sociales | 3 | 120,00 € | 360,00 € |

| Caso | Base | IVA (21 %) | IRPF | Total |
|------|------|------------|------|-------|
| Empresa o autónomo, IRPF 15 % | 1.200,00 € | 252,00 € | −180,00 € | 1.272,00 € |
| Empresa o autónomo, IRPF 7 % | 1.200,00 € | 252,00 € | −84,00 € | 1.368,00 € |
| Particular | 1.200,00 € | 252,00 € | 0,00 € | 1.452,00 € |
| Caso de comprobación, IRPF 15 % | 1.000,00 € | 210,00 € | −150,00 € | 1.060,00 € |

### Key Entities *(include if feature involves data)*

- **Profesional**: la persona que emite los presupuestos. Tiene nombre, NIF, teléfono, email, dirección y logo opcional. Hay una sola.
- **Servicio del catálogo**: un servicio que la profesional ofrece habitualmente. Tiene nombre y precio habitual.
- **Presupuesto**: la propuesta económica para un cliente. Tiene número (AAAA-NNN), fecha de emisión, fecha de validez, datos del cliente, porcentaje de retención, observaciones opcionales y cero o más líneas. Se puede guardar sin líneas, pero necesita al menos una para generar el PDF. La base, el IVA, la retención y el total se derivan de sus líneas.
- **Cliente guardado**: un cliente de la lista de la profesional. Tiene nombre o razón social, NIF/CIF opcional, email opcional y tipo (particular, empresa o autónomo). No tiene historial ni seguimiento.
- **Cliente del presupuesto**: la copia de los datos del cliente dentro de cada presupuesto, con los mismos campos que el cliente guardado. No cambia aunque se edite o borre el cliente de la lista.
- **Línea de presupuesto**: un concepto dentro de un presupuesto. Tiene concepto, cantidad y precio unitario, y su importe es cantidad por precio. Es una copia independiente, aunque venga del catálogo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con sus datos y su catálogo ya configurados, la profesional crea un presupuesto de tres líneas del catálogo y descarga su PDF en menos de 2 minutos.
- **SC-002**: Los cuatro casos de la tabla de reglas de negocio y los escenarios con 100,00 € de base muestran exactamente los importes esperados, sin ninguna diferencia de céntimos.
- **SC-003**: En 10 presupuestos guardados seguidos dentro del mismo año, los números son consecutivos y sin repeticiones.
- **SC-004**: El 100 % de los PDF generados contienen todos los elementos obligatorios de FR-028 y ninguno contiene la palabra «factura».
- **SC-005**: Tras cerrar y volver a abrir la aplicación, el 100 % de los datos de la profesional, los servicios del catálogo, los clientes guardados y los presupuestos guardados siguen disponibles y sin cambios.
- **SC-006**: La profesional, sin conocimientos técnicos, completa su primer presupuesto sin ayuda externa en el primer intento.
- **SC-007**: Ningún presupuesto con una línea no válida (sin concepto, cantidad 0 o precio negativo) puede guardarse, y ningún presupuesto sin líneas puede descargarse en PDF.

## Assumptions

- La aplicación se usa en un único ordenador y por una única profesional.
- La aplicación sirve a freelancers de cualquier sector. Los textos, el catálogo y el PDF no contienen nada específico del diseño gráfico.
- No hay estados del presupuesto (borrador, enviado, aceptado, rechazado) en esta versión.
- Los emails de la profesional y del cliente son texto libre que solo se muestra en el PDF. La aplicación no envía correos ni valida su formato.
- La fecha de emisión no es editable; se toma del día del primer guardado.
- No hay copia de seguridad ni exportación de datos; mantener una copia del ordenador es responsabilidad de la profesional.

### Fuera de alcance

- Facturación de cualquier tipo, facturación electrónica y conversión de presupuestos en facturas.
- Envío de correos desde la aplicación; la profesional descarga el PDF y lo envía con su propio correo.
- Cuentas de usuario, autenticación, contraseñas y permisos.
- Almacenamiento en la nube, sincronización entre dispositivos y acceso remoto.
- Monedas distintas del euro.
- Tipos de IVA distintos del 21 % y retenciones distintas del 15 % y el 7 %.
- Presentación de impuestos, modelos fiscales e integración con la Agencia Tributaria.
- Gestión avanzada de clientes: historial, seguimiento comercial o CRM. Solo se incluye la lista simple de FR-008a.
- Personalización avanzada del PDF: editores visuales, varias plantillas, temas o estilos.
- Importación o exportación masiva de datos desde Excel u otras aplicaciones.
- Aplicación móvil y aplicación de escritorio instalable.
- Publicación en internet o acceso desde otros dispositivos.
- Estadísticas, informes de ventas y análisis de negocio.
