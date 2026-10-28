# Research: Presupuestos Pro v0

**Fecha**: 2026-10-26 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

Cada decisión sigue el principio I de la constitución: ante dos opciones válidas, la más simple.

## R1. Forma de la aplicación

- **Decision**: Aplicación web estática formada por archivos HTML, CSS y JavaScript sin compilar. Se abre con doble clic en `index.html` desde una carpeta del ordenador. No hay servidor, ni instalación, ni proceso de compilación.
- **Rationale**: Cumple la aclaración de la spec («se abre en el navegador, funciona solo en su ordenador, sin internet ni servidores») y FR-032. Una persona no técnica solo tiene que abrir un archivo. Este equipo no tiene Node.js, y la solución no depende de él.
- **Alternatives considered**:
  - Servidor local con Node.js o Python que guarde los datos en un archivo: obliga a instalar un lenguaje y a arrancar un proceso. Es demasiado para una usuaria no técnica.
  - Framework con compilación, como React o Vue con Vite: añade herramientas y pasos sin ninguna necesidad actual de la spec.
  - Aplicación de escritorio, como Electron: descartada en la clarificación de la spec.

## R2. Carga de scripts desde archivo local

- **Decision**: Scripts clásicos (`<script src="...">`), no módulos ES. Cada archivo expone un único objeto global con nombre en español, por ejemplo `Calculos` o `Almacen`.
- **Rationale**: Los navegadores bloquean los módulos ES (`type="module"`) cuando la página se abre con `file://`. Los scripts clásicos funcionan sin servidor.
- **Alternatives considered**: módulos ES con un servidor local, descartado por R1; un único archivo gigante, que es peor de mantener.

## R3. Persistencia de datos

- **Decision**: `localStorage` del navegador, con una única clave `presupuestospro.v1` que contiene todo el estado en JSON. El logo se guarda dentro como imagen en base64, limitado a 500 KB. Al arrancar se pide `navigator.storage.persist()` para que el navegador no borre los datos por falta de espacio.
- **Rationale**: Es la opción más simple que sobrevive al cierre del navegador (FR-031, SC-005). El volumen es pequeño, porque cientos de presupuestos ocupan pocos cientos de KB, y cabe holgadamente en el límite de unos 5 MB.
- **Alternatives considered**:
  - IndexedDB: más capacidad, pero una API asíncrona y más compleja que el volumen actual no necesita.
  - Archivo en disco elegido por la usuaria (File System Access API): solo funciona en algunos navegadores y pide permisos en cada sesión.
- **Riesgos asumidos**:
  - Los datos viven en el perfil de un navegador concreto. La guía de uso indicará que se use siempre el mismo navegador y que no se borren los datos de navegación de archivos locales.
  - Si se supera el espacio disponible, la aplicación muestra un mensaje claro en vez de fallar en silencio.
  - No hay copia de seguridad, coherente con los supuestos de la spec.
- **Navegadores objetivo**: Google Chrome y Microsoft Edge actuales en Windows. Ambos conservan `localStorage` en `file://`. Firefox y Safari quedan sin verificar en v0.

## R4. Generación del PDF

- **Decision**: Librería jsPDF con su complemento jspdf-autotable, ambos copiados dentro del proyecto en la carpeta `vendor/` con versión fija. El PDF se descarga con un solo clic con el nombre `Presupuesto-2026-001.pdf`.
- **Rationale**:
  - Descarga directa y siempre igual, sin depender del diálogo de impresión. Es lo más simple para una usuaria no técnica (SC-001, FR-027).
  - Al estar dentro del proyecto, funciona sin internet (FR-032).
  - Las tablas de líneas se generan con el complemento en vez de dibujarlas a mano.
- **Alternatives considered**:
  - `window.print()` con estilos de impresión: no añade dependencias, pero obliga a elegir «Guardar como PDF» y a desactivar encabezados del navegador, que muestran la ruta del archivo. Es un riesgo alto de error para la usuaria.
  - Cargar jsPDF desde un CDN: rompe el funcionamiento sin internet.
- **Notas**:
  - Se espera que las fuentes estándar de jsPDF cubran el alfabeto español y el símbolo €. No está comprobado, y la tarea T023 lo verifica en un PDF real. Si falla, se incrusta una fuente con esos caracteres.
  - En el PDF el signo menos de la retención se escribe con el guion normal «-», porque el signo «−» no está en esas fuentes.

## R5. Aritmética monetaria y redondeo

- **Decision**:
  - Todos los importes se guardan y calculan en **céntimos enteros**.
  - Las cantidades se guardan en **centésimas enteras**, de modo que 1,5 se guarda como 150.
  - Importe de línea = `redondear(cantidad_centésimas × precio_céntimos / 100)`.
  - IVA = `redondear(base × 21 / 100)`.
  - Retención = `redondear(base × porcentaje / 100)`.
  - Total = base + IVA − retención.
  - El redondeo es al céntimo más cercano, con los medios hacia arriba. Todos los valores son no negativos.
- **Rationale**: Evita los errores de coma flotante, por ejemplo 0,1 + 0,2. Cumple FR-026 y SC-002 sin diferencias de céntimos. Los ejemplos de la spec dan exactamente los resultados esperados.

## R6. Formato de importes y fechas en español de España

- **Decision**: Un formateador propio y pequeño que produce `1.234,56 €` y fechas `dd/mm/aaaa`.
- **Rationale**: `Intl.NumberFormat('es-ES')` no pone el punto de miles en números de cuatro cifras («1234,56 €»), lo que incumple el ejemplo del principio II. Un formateador propio es determinista y fácil de probar.
- **Alternatives considered**: `Intl.NumberFormat` con `useGrouping: 'always'`, que no es fiable en todas las versiones de navegador.

## R7. Numeración AAAA-NNN sin reutilización

- **Decision**: Un contador por año guardado en el estado, `contadores: { "2026": 3 }`. Al guardar un presupuesto por primera vez se incrementa el contador del año de su fecha de emisión y se asigna el número. Borrar no decrementa nunca.
- **Rationale**: Cumple FR-012, FR-013 y los casos límite de borrado, incluido el del último presupuesto del año. Calcular «máximo existente + 1» reutilizaría el número del último presupuesto borrado.
- **Nota**: Si se superan 999 presupuestos en un año, el contador sigue con cuatro cifras, por ejemplo 2026-1000. Es un caso irreal, pero no rompe nada.

## R8. Fechas

- **Decision**: La fecha de emisión es la fecha local del día del primer guardado, guardada como texto `AAAA-MM-DD`. Así la fecha y el año del número siempre coinciden, aunque el presupuesto se empiece un día y se guarde otro. La validez se calcula sumando 30 días naturales con la fecha local.
- **Rationale**: Usar texto sin hora evita desfases por zona horaria. Comprobado con la spec: 23/10/2026 + 30 días = 22/11/2026.

## R9. Pruebas

- **Decision**: Una página `pruebas.html` que se abre en el navegador, ejecuta las pruebas de cálculo, numeración, validación y formato, y muestra en verde o rojo cada caso de la spec. No necesita instalar nada.
- **Rationale**: No hay Node.js en el equipo, y la página permite que una persona no técnica vea los resultados (principio IV). Los criterios de aceptación de la interfaz se verifican a mano siguiendo [quickstart.md](quickstart.md).
- **Alternatives considered**: `node --test` o Jest, que exigen instalar Node.js.

## R10. Interfaz

- **Decision**: Una sola página con cinco secciones a las que se llega desde un menú: Presupuestos (listado), Editar presupuesto, Clientes, Catálogo y Mis datos. Se usa HTML, CSS y JavaScript sin librerías de interfaz.
- **Rationale**: Son pocas pantallas y formularios sencillos, y una librería de interfaz no aporta nada aquí. Todos los textos están en español de España (FR-033).
