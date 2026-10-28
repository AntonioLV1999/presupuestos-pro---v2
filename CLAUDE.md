# PresupuestosPro

App web local para que freelancers hagan presupuestos con IVA (21 %) y retención de IRPF (15 % o 7 %) automáticos, numerados AAAA-NNN y descargables en PDF.

## Stack (decisiones vigentes)
- HTML5 + CSS3 + JavaScript ES2020 en scripts clásicos. Sin módulos ES (no funcionan con `file://`), sin framework, sin compilación, sin backend.
- Datos en `localStorage`, clave `presupuestospro.v1`, un único documento JSON. Sin migraciones.
- PDF con jsPDF 2.5.2 + jspdf-autotable 3.8.4, copiados en `vendor/` (única dependencia; sin internet ni fuentes web en ejecución).
- Importes en céntimos enteros. Formateador propio `1.234,56 €` y `dd/mm/aaaa` (`Intl` falla con el punto de miles).
- Paleta única en `js/tema.js`: la usan el CSS (variables) y el PDF. CSS mobile-first, desde 320 px.
- Objetivo: Chrome/Edge actuales en Windows.

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