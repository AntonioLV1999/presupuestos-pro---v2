# Contrato: pantallas y textos — dirección «Despacho» (R2)

Cambios de presentación sobre las pantallas que R1 ya entregó. **Ninguna pantalla cambia de contenido, de datos ni de comportamiento**: solo de composición, rótulos de título y clases. Ninguna pantalla llama a `App.cambiar` ni a `Almacen.guardar` por efecto de este contrato.

> **Sustituye** al contrato de pantallas de R1.

## Cabecera y navegación común (todas las pantallas)

| Qué | R1 | R2 | Requisito |
|---|---|---|---|
| Fondo de la cabecera | Banda de `acento` (azul marino) | **Papel**, con filete inferior de `borde-fuerte` | FR-023 |
| Marca «Presupuestos Pro» | Sans, blanco sobre azul | `--fuente-titulo`, en `texto`; sin bloque de fondo propio ni costura con la navegación | FR-023 |
| Etiquetas de navegación | Sans sobre azul | Sans en `suave`; la actual, en `texto` | FR-023 |
| Sección actual | Fondo `acento-oscuro` **y** filete inferior blanco | **Un único signo**: filete inferior de `acento` de 2 px y `--peso-medio`. Se retira el fondo | FR-025 |
| Indicación accesible | `aria-current="page"` | Sin cambios | FR-004 |
| Foco | Contorno blanco sobre azul | Contorno de `acento` de 3 px sobre papel | FR-012a |

La navegación sigue presente en las seis pantallas, incluido el editor, y durante la edición sigue señalando «Presupuestos» (FR-004).

## Título de pantalla (todas)

El título deja de ser un eco de la etiqueta del menú: **siempre lleva un complemento de contexto** (FR-026). Sigue siendo un `h2` y el primer encabezado del contenido.

| Pantalla | Título R1 | Título R2 | Complemento |
|---|---|---|---|
| Inicio | «Inicio» | **«Resumen de actividad»** | Nombra lo que muestra, en lugar de repetir el menú |
| Presupuestos | «Presupuestos» | **«Presupuestos»** + recuento | «3 guardados» / «1 guardado» / «Ninguno todavía» |
| Clientes | «Clientes» | **«Clientes»** + recuento | «1 guardado» / «5 guardados» / «Ninguno todavía» |
| Catálogo | «Catálogo» | **«Catálogo»** + recuento | «4 servicios» / «1 servicio» / «Ninguno todavía» |
| Perfil | «Perfil» | **«Perfil»** + complemento | «Tus datos para los presupuestos» |
| Editor | Cabecera propia | **«Presupuesto 2026-003»** o **«Nuevo presupuesto»** | Ya es contextual; solo se compone según el tema |

El recuento se compone en `--fuente` con cifras de ancho constante (FR-024), en `suave` y a `--t-s`, como línea secundaria bajo el título. Sale de los datos ya guardados; no se pide nada nuevo (FR-007).

## Inicio

| Qué | R1 | R2 | Requisito |
|---|---|---|---|
| Cifras del resumen | Cinco recuadros blancos con contorno, cifra en `acento` | Cinco bloques **sin contorno**, separados por filete y espacio; cifra en `texto`, no en el acento | FR-023, FR-030 |
| Cifras | Sans proporcional | Cifras de ancho constante | FR-024 |
| Botón «Nuevo presupuesto» | Suelto entre las dos rejillas, con tres separaciones verticales distintas | **Integrado en el bloque del resumen**, bajo las cifras y dentro de su misma zona, con separación uniforme | FR-006a |
| Accesos a las cuatro secciones | Cuatro recuadros blancos con contorno, título en `acento` | Cuatro bloques separados por filetes; título en `--fuente-titulo` y en `texto` | FR-023 |
| Mensaje de «sin datos» | Sin cambios de contenido | Sin cambios de contenido | FR-006 |
| Filete suelto al pie | Presente, sin contenido que lo justifique | **Se retira** | FR-023 |

Las cifras y el mensaje de lista vacía no cambian de valor ni de texto: siguen saliendo del mismo recuento (FR-005, SC-003).

## Presupuestos (listado)

| Qué | R1 | R2 | Requisito |
|---|---|---|---|
| Cabecera de tabla | Texto en negrita sobre `fondo` | Rótulo en `--peso-medio` sobre `superficie-alt`, con filete de refuerzo inferior | FR-023 |
| Alineación de celdas | Arriba: el grupo de acciones queda ~17 px descolgado | **Centrada**: todos los elementos de la fila a la misma altura | FR-028 |
| Alto de fila | ~86 px | **52 px desde 960 px**, con los botones manteniendo 44 px. Entre 640 y 959 px las acciones pueden pasar a una segunda línea para no provocar desplazamiento horizontal | FR-028, FR-014 |
| Resalte de fila | No existe | `papel-hundido` al pasar el puntero, solo ≥ 640 px y con puntero real | FR-028 |
| Columna «Total» | Alineada a la derecha, cifras proporcionales | Alineada a la derecha, **cifras de ancho constante**: las comas quedan en la misma vertical | FR-024 |
| Separación Total / Estado | ~20 px | Al menos `--e-4` | FR-023 |
| Identificador `2026-003` | Sans proporcional | Cifras de ancho constante | FR-024 |
| Etiqueta de estado | Píldora con borde de 2 px, misma altura que los botones: se lee como un cuarto botón | **Distinta de un botón** en forma, altura y borde; sin aspecto pulsable | FR-027 |
| Vigente / Caducado | Distintos por color y por trazo del borde | Sin cambios de regla: texto siempre visible y rasgo no cromático que los separa | FR-013 |
| Acciones de fila | «Abrir», «Descargar PDF», «Borrar», los tres idénticos salvo el color del texto | «Borrar» **al final del grupo y separada** de las otras dos, además del color | FR-029 |
| Botones «Nuevo presupuesto» y «Exportar todo (.zip)» | Sin cambios de texto ni de comportamiento | Sin cambios de texto ni de comportamiento | — |
| Móvil (< 640 px) | Tarjetas | Sin cambios: siguen siendo tarjetas | FR-014 |

## Editor de presupuesto

| Qué | R1 | R2 | Requisito |
|---|---|---|---|
| Bloque de totales | Recuadro con contorno y radio, total a `--t-xl` sobre `fondo` | **Sin contorno**: filete de refuerzo superior, total a `--t-2xl` sobre `superficie-alt` | FR-011 |
| Importe del total | Negrita, sans | `--t-2xl`, en `--fuente` con cifras de ancho constante; es el mayor número de la pantalla | FR-011, FR-024 |
| Tabla de líneas | Celdas con contorno de tarjeta | Separación por filetes; campos conservan su radio de control | FR-023 |
| Importes y cantidades de cada línea | Sans proporcional | Cifras de ancho constante | FR-024 |
| Campos y validación | Sin cambios de regla | Sin cambios de regla; el campo inválido sigue sin depender solo del color | FR-012 |
| Lista del catálogo | Recuadro con contorno | Separación por filetes | FR-023 |

## Clientes, Catálogo y Perfil

| Qué | R1 | R2 | Requisito |
|---|---|---|---|
| Título | Etiqueta de sección | Con complemento de contexto (tabla de arriba) | FR-026 |
| Formularios en recuadro | Recuadro blanco con contorno | Separación por filetes y espacio | FR-023 |
| Listados | Igual que Presupuestos en R1 | Misma densidad, alineación y resalte que Presupuestos | FR-028 |
| Acción de borrar | Igual peso que las demás | Al final del grupo y separada | FR-029 |
| Vista previa del logo (Perfil) | Con borde | Sin cambios de comportamiento; el encuadre no se rediseña | Fuera de alcance |

## Mensajes y estados del sistema

Sin cambios de regla respecto a R1: los mensajes de éxito, aviso y error siguen siendo claramente distinguibles de la información normal, no dependen solo del color y siguen en español de España (FR-012, FR-021). Solo cambian sus colores, que pasan a los valores de [tema.md](tema.md).

El aviso de datos guardados ilegibles (spec 001, FR-031a) se sigue mostrando igual y no se oculta.

## Lo que no cambia

- Ningún texto de botón, mensaje o etiqueta de campo, salvo los complementos de título de FR-026.
- Ningún identificador interno: `mis-datos`, `data-ir`, claves JSON y nombres de token se mantienen.
- El orden de carga de scripts de `index.html` y `pruebas.html`.
- El comportamiento de salida del editor sin confirmación (FR-004, escenario 5 de la historia 1).
- Los puntos de corte responsive.
