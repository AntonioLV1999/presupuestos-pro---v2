# PresupuestosPro

App web local para que freelancers hagan presupuestos con IVA (21 %) y retención de IRPF (15 % o 7 %) automáticos, numerados AAAA-NNN y descargables en PDF.

## Stack (decisiones vigentes)
- HTML5 + CSS3 + JavaScript ES2020 en scripts clásicos. Sin módulos ES (no funcionan con `file://`), sin framework, sin compilación, sin backend.
- Datos en `localStorage`, clave `presupuestospro.v1`, un único documento JSON. Sin migraciones.
- PDF con jsPDF 2.5.2 + jspdf-autotable 3.8.4, copiados en `vendor/` (única dependencia; sin internet ni fuentes web en ejecución).
- Importes en céntimos enteros. Formateador propio `1.234,56 €` y `dd/mm/aaaa` (`Intl` falla con el punto de miles).
- Paleta única en `js/tema.js`: la usan el CSS (variables) y el PDF. CSS mobile-first, desde 320 px.
- Objetivo: Chrome/Edge actuales en Windows.

- [003] Sin librería de ZIP: `js/zip.js` es un escritor propio (método almacenado, nombres UTF-8, CRC-32); no añadir dependencias para empaquetar.
- [003] Operaciones masivas largas (`async`): ceder el control con `requestAnimationFrame` + `setTimeout` entre pasos para pintar el progreso, y bloquear reentradas con una variable de módulo.
- [003] Nombres de archivo derivados de datos de la usuaria pasan por `Exportacion.nombreSeguro` (caracteres de Windows → «-») y se hacen únicos sin distinguir mayúsculas.
- [003] Las exportaciones solo leen `App.estado`; nunca llaman a `App.cambiar` ni `Almacen.guardar`.
- [002] Dos familias con papeles disjuntos: `--fuente-titulo` (serif del sistema) solo para títulos y rótulos; `--fuente` para el texto, los controles y **todo número**. Ningún número en la serif, tampoco en el PDF; `body` lleva `font-variant-numeric: tabular-nums`.
- [002] El color `acento` se reserva para la sección actual, el botón principal y el foco; el color `error` nunca rellena un botón (solo texto, borde o fondo suave).
- [002] El PDF usa solo las familias núcleo de jsPDF (`times` para titulares y rótulos, `helvetica` para datos e importes), sin incrustar ninguna fuente. Tras `setFont('times')`, volver a `helvetica` antes de escribir cualquier número.
- [002] Títulos de pantalla con `App.titulo(texto, complemento)`, para que el `h2` no repita el menú; los recuentos se escriben con `Formato.recuento(n, singular, plural)`.
- [002] Rejillas con `minmax(0, 1fr)`; en las tablas, `width: 1%`/`nowrap` y las acciones en una sola línea solo desde 960 px. Por debajo de ese ancho, el contenido que no se parte desborda.
- [002] La validación visual se hace con datos ficticios en un perfil de navegador aislado (ventana InPrivate o `--user-data-dir` temporal), nunca con los datos reales: no hay forma de restaurarlos.

## Arranque y pruebas
- Arrancar: doble clic en `index.html` (no hay servidor ni instalación).
- Probar: doble clic en `pruebas.html` (debe decir «Todas las pruebas superadas» en verde; casos en `tests/pruebas.js`).
- Validación manual: `specs/*/quickstart.md`.

## Convenciones
- Lógica pura sin DOM en `formato.js`, `calculos.js`, `numeracion.js`, `validacion.js`, `vigencia.js` (con pruebas). `almacen.js`, `pdf.js`, `app.js` y `js/ui/*` son capa fina; un archivo por pantalla.
- Cada archivo expone un único global (`window.Calculos`…) y se carga en orden desde `index.html` y `pruebas.html`.
- Textos visibles en español de España. Identificadores internos (`mis-datos`, claves JSON) no se renombran aunque cambie el texto («Perfil»).
- Flujo: spec → plan → tareas → implementar (comandos `/speckit-*`). No se construye nada que no esté en la spec.
- Nada de claves ni secretos en el código; no se piden datos innecesarios.

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en LEEME.md

## Spec-kit

* Antes de ejecutar el flujo de `/speckit.specify`, SIEMPRE ejecuta primero el hook `before_specify` (skill `speckit-git-feature`) para crear la rama de la feature, y espera su resultado antes de crear la spec.
* Tras completar `/speckit.specify`, verifica con `git branch --show-current` que estamos en la rama `NNN-nombre-feature` y no en `master`. Si no es así, avísame antes de continuar.
* Al ejecutar `/speckit.plan`, SIEMPRE incluye en `plan.md`, como último paso de la fase final, un paso de mantenimiento: “Actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. ‘[003] ...’). No incluyas entradas por incluir, asegúrate siempre de que es información transversal y relevante para el proyecto que pueden aprovechar futuras features.”
*Cuando se cre una nueva speck con `/speckit.specify`, dicha spec tendra el estado Prevista,cuando se ejecute `/speckit.plan`, cambia el estado de la spec a En Curso,  y en el momento de hacer el merge, pon el estado de la spec en Publicada, cuando se cierre una spec, añadela en el specs/README.md