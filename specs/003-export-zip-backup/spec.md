# Feature Specification: Exportar todos los presupuestos en un .zip

**Feature Branch**: `003-export-zip-backup`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Exportar todos mis presupuestos en un .zip: un botón «Exportar todo (.zip)» en la lista de presupuestos que descarga un único archivo comprimido con un PDF por presupuesto (el mismo que ya genera la app) y un archivo de datos con presupuestos, catálogo y perfil (logo incluido), como copia de seguridad. Solo lectura. Importar la copia queda fuera de alcance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descargar una copia de todo en un solo archivo (Priority: P1)

La profesional, que hoy tiene todos sus datos únicamente dentro de su navegador, pulsa «Exportar todo (.zip)» en la lista de presupuestos y recibe un único archivo comprimido con todos sus presupuestos en PDF y un archivo de datos con toda su información. Lo guarda donde quiera (disco externo, carpeta de archivo) como seguro de vida frente a un formateo, un cambio de navegador o un borrado de historial.

**Why this priority**: Es la razón de ser de la funcionalidad: sin esto, perder los datos del navegador significa perderlo todo.

**Independent Test**: Con 3 presupuestos creados, pulsar el botón, comprobar que se descarga un único .zip, descomprimirlo con doble clic y ver 3 PDF y un archivo de datos.

**Acceptance Scenarios**:

1. **Given** una lista con 3 presupuestos, **When** la profesional pulsa «Exportar todo (.zip)», **Then** se descarga un único archivo .zip.
2. **Given** el .zip descargado, **When** se descomprime, **Then** contiene 3 PDF (uno por presupuesto) y un único archivo de datos, y nada más.
3. **Given** un presupuesto cualquiera, **When** se abre su PDF del .zip y se compara con el PDF que se descarga desde la app para ese mismo presupuesto, **Then** son idénticos en contenido, importes y presentación.
4. **Given** un presupuesto con el ejemplo de control del Módulo 2, **When** se exporta, **Then** su PDF del .zip muestra un total de 3.604,00 €, igual que el PDF individual.
5. **Given** cualquier estado de la aplicación, **When** se completa una exportación, **Then** presupuestos, clientes, catálogo y perfil siguen exactamente igual que antes de exportar (la exportación es solo lectura).
6. **Given** que se exporta el 15/03/2026, **When** el navegador guarda el archivo, **Then** se llama «presupuestospro-copia-2026-03-15.zip».

---

### User Story 2 - Nombres de archivo claros y seguros (Priority: P2)

Cada PDF dentro del .zip se llama con el número del presupuesto y el nombre del cliente, por ejemplo «2026-001 - Estudio García.pdf», de modo que la profesional reconozca cada presupuesto sin abrirlo. Si el nombre del cliente contiene caracteres que los archivos no admiten, se limpian para que el .zip nunca se rompa.

**Why this priority**: Hace utilizable el archivo para archivar, pero la copia ya sirve sin ello.

**Independent Test**: Crear un presupuesto para el cliente «Diseño/Web S.L.», exportar y comprobar que el .zip se descomprime sin errores y que el PDF tiene un nombre legible.

**Acceptance Scenarios**:

1. **Given** un presupuesto 2026-001 del cliente «Estudio García», **When** se exporta, **Then** su PDF se llama «2026-001 - Estudio García.pdf».
2. **Given** un cliente llamado «Diseño/Web S.L.», **When** se exporta, **Then** el .zip se descomprime sin errores y el PDF conserva un nombre reconocible con los caracteres no admitidos eliminados o sustituidos.
3. **Given** dos presupuestos cuyo nombre de archivo resultante sería idéntico tras la limpieza, **When** se exporta, **Then** ambos PDF están en el .zip sin que uno sobrescriba al otro.

---

### User Story 3 - Aviso claro cuando no hay nada que exportar y progreso visible (Priority: P2)

Si no hay presupuestos, el botón avisa con claridad de que no hay nada que exportar y no se descarga ningún archivo. Si hay muchos presupuestos (50 o más), la profesional ve que la aplicación está trabajando y sabe cuándo ha terminado.

**Why this priority**: Evita confusión y descargas vacías, pero no cambia el valor principal.

**Independent Test**: Con 0 presupuestos, pulsar el botón y comprobar el aviso y la ausencia de descarga; con 50 o más, comprobar que aparece un indicador de trabajo mientras se prepara el archivo.

**Acceptance Scenarios**:

1. **Given** que no existe ningún presupuesto, **When** se pulsa «Exportar todo (.zip)», **Then** aparece un aviso claro de que no hay nada que exportar y no se descarga ningún archivo.
2. **Given** 50 o más presupuestos, **When** se pulsa el botón, **Then** mientras se prepara el archivo se muestra un indicador visible de que está trabajando y el botón no permite lanzar una segunda exportación a la vez.
3. **Given** una exportación en curso, **When** termina, **Then** el indicador desaparece y la descarga comienza.

---

### Edge Cases

- Sin presupuestos: aviso, sin descarga (aunque haya perfil o catálogo guardados).
- Un único presupuesto: se descarga un .zip con 1 PDF y el archivo de datos.
- 200 presupuestos: la exportación termina correctamente, aunque tarde, mostrando que trabaja.
- Cliente con caracteres no admitidos en nombres de archivo («/», «\», «:», «*», «?», «"», «<», «>», «|»): se limpian.
- Nombre de cliente vacío o formado solo por caracteres no admitidos: el PDF se nombra solo con el número.
- Nombre de cliente muy largo: se acorta para que el nombre de archivo siga siendo válido.
- Perfil sin logo o catálogo vacío: la exportación funciona igualmente y el archivo de datos refleja que no hay.
- Presupuestos de cualquier tipo de cliente (particular, empresa, autónomo) y de cualquier vigencia (vigente o caducado): todos se exportan.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La lista de presupuestos DEBE mostrar de forma visible un botón con el texto «Exportar todo (.zip)».
- **FR-002**: Al pulsarlo con al menos un presupuesto, el sistema DEBE descargar UN único archivo .zip.
- **FR-003**: El .zip DEBE contener exactamente un PDF por cada presupuesto existente y un único archivo de datos.
- **FR-004**: Cada PDF del .zip DEBE ser el mismo que la aplicación genera hoy al descargar ese presupuesto de forma individual, con idénticos importes al céntimo.
- **FR-005**: El archivo de datos DEBE incluir todos los presupuestos, el catálogo de servicios y el perfil de la profesional con su logo, con información suficiente para poder restaurar la aplicación en el futuro.
- **FR-006**: El archivo .zip DEBE llamarse «presupuestospro-copia-AAAA-MM-DD.zip» con la fecha del día de la exportación.
- **FR-007**: Cada PDF DEBE llamarse «número - cliente.pdf» (por ejemplo «2026-001 - Estudio García.pdf»).
- **FR-008**: Los caracteres no admitidos en nombres de archivo DEBEN eliminarse o sustituirse, y los nombres que resulten repetidos DEBEN distinguirse para que ningún PDF se pierda.
- **FR-009**: La exportación NO DEBE modificar ningún dato de la aplicación (presupuestos, numeración, clientes, catálogo, perfil).
- **FR-010**: Sin presupuestos, el sistema DEBE mostrar un aviso claro en español de España y NO DEBE descargar ningún archivo.
- **FR-011**: Durante la preparación del archivo, el sistema DEBE mostrar un indicador visible de que está trabajando y DEBE impedir lanzar otra exportación hasta que termine.
- **FR-012**: Si la exportación falla, el sistema DEBE avisar con un mensaje claro y dejar los datos intactos.
- **FR-013**: Todos los textos visibles de la funcionalidad DEBEN estar en español de España.

### Key Entities

- **Copia de seguridad (.zip)**: Archivo único y comprimido que reúne los PDF de todos los presupuestos y el archivo de datos; su nombre lleva la fecha de exportación.
- **PDF de presupuesto**: Documento ya existente en la aplicación, uno por presupuesto, incluido en la copia sin cambios.
- **Archivo de datos**: Archivo único con toda la información de la profesional (presupuestos, catálogo, perfil y logo), pensado para una futura restauración.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con 3 presupuestos, la profesional obtiene su copia completa con una sola pulsación y una sola descarga, y al descomprimirla ve exactamente 3 PDF y un archivo de datos.
- **SC-002**: El 100 % de los PDF del .zip coinciden en contenido e importes, al céntimo, con los que se descargan uno a uno desde la aplicación (control: total 3.604,00 €).
- **SC-003**: Con 0 presupuestos, el 100 % de las pulsaciones muestran el aviso y ninguna descarga un archivo.
- **SC-004**: Un cliente con nombre conflictivo («Diseño/Web S.L.») nunca produce un .zip que no se pueda descomprimir.
- **SC-005**: Con 50 o más presupuestos, la profesional ve en todo momento que la aplicación está trabajando y la descarga termina sin que tenga que repetir la acción.
- **SC-006**: Tras exportar, la comparación de la aplicación antes y después no muestra ninguna diferencia en sus datos.
- **SC-007**: Una persona no técnica completa la exportación y localiza el archivo descargado sin ayuda, en menos de un minuto con 3 presupuestos.

## Assumptions

- La profesional usa la aplicación en Chrome o Edge actuales en Windows; el archivo se guarda en la carpeta de descargas que ese navegador tenga configurada.
- «Archivo de datos» es una pieza interna de la copia: la profesional no necesita abrirlo ni entenderlo, y su formato lo decidirá el plan.
- El ejemplo de control del Módulo 2 (total 3.604,00 €) no consta en el repositorio; el requisito verificable es la coincidencia al céntimo con el PDF individual, y 3.604,00 € se usa como caso de comprobación manual cuando se reproduzca ese ejemplo.
- El nombre de cada PDF usa el nombre del cliente tal como figura en el presupuesto.
- La fecha del nombre del .zip es la del reloj del ordenador, en hora local.
- Todos los presupuestos se exportan sin filtros, sea cual sea su vigencia.
- Fuera de alcance: importar o restaurar la copia (será otra spec), exportar a Excel/CSV con formato contable, copias automáticas o programadas, y enviar el .zip por email o subirlo a una nube.
- Dependencia: la generación de PDF individual ya existente (spec 001) y el aspecto del PDF de la spec 002; esta funcionalidad los reutiliza sin cambiarlos.
