# Contrato: tema visual — dirección «Despacho» (R2)

Fuente única de la apariencia. Cambiar un valor aquí lo cambia en toda la aplicación y en el PDF (FR-008 a FR-011, FR-023, FR-024, FR-030, SC-006, SC-007).

> **Sustituye** al contrato de tema de R1 (azul marino, una sola familia). Ningún nombre de token se renombra: solo cambian valores y se añaden tres colores y varios tokens de forma.

## Paleta (`js/tema.js`)

Cada nombre se publica como variable CSS `--<nombre>` y queda disponible para el PDF a través de `Tema.rgb`. **Ningún otro archivo contiene colores literales.**

### Tokens existentes, revaluados

| Nombre | Valor R1 | Valor R2 | Uso |
|---|---|---|---|
| `texto` | `#1f2933` | `#1C1A17` | Tinta: texto principal, importes, cifras del resumen |
| `suave` | `#52606d` | `#6B6459` | Grafito: texto secundario, rótulos, etiquetas de campo |
| `borde` | `#d9dee3` | `#E6E1D8` | Filete fino de 1 px por defecto |
| `fondo` | `#f5f7f9` | `#FBF9F5` | Papel: fondo de la página |
| `superficie` | `#ffffff` | `#FFFFFF` | Superficies elevadas, campos, y texto sobre tinta o acento |
| `acento` | `#1f4b78` | `#8C2F39` | Burdeos de marca. **Uso restringido**, ver más abajo |
| `acento-oscuro` | `#163757` | `#6E242C` | Acento al pasar el ratón o pulsar |
| `exito` | `#1e6b34` | `#4F6B4A` | Salvia: estado Vigente y mensajes de éxito |
| `exito-fondo` | `#e6f4ea` | `#EDF2EB` | Lavado de Vigente y de éxito |
| `aviso` | `#8a5a00` | `#7C5415` | Ocre: estado Caducado y avisos |
| `aviso-fondo` | `#fff4dc` | `#F7EFE0` | Lavado de Caducado y de aviso |
| `error` | `#b42318` | `#B3261E` | Rojo de validación y de acción destructiva |
| `error-fondo` | `#fdecea` | `#FBEDEB` | Lavado de error |

### Tokens nuevos

| Nombre | Valor | Uso |
|---|---|---|
| `borde-fuerte` | `#CFC7B8` | Filete de refuerzo de 2 px: cabecera de tabla, regla del total, cierre de sección |
| `superficie-alt` | `#F4F1EA` | Cabecera de tabla, fila de total, zonas de reposo |
| `papel-hundido` | `#F2EFE7` | Resalte de fila al pasar el puntero (FR-028) |

### Reglas de uso del color

1. **El acento es escaso** (FR-030). Solo puede aparecer en: la marca de la cabecera, el filete que señala la sección actual, el botón principal, los enlaces y el importe del total. **No** se usa en las cifras del resumen de actividad, ni en los títulos de bloque, ni como fondo de ninguna banda.
2. **El error nunca rellena un botón** (FR-030). El rojo solo aparece como texto, como borde o como lavado `error-fondo`. Consecuencia comprobable: la única superficie rojiza rellena de toda la interfaz es el botón principal.
3. **Nada se comunica solo por color** (FR-012, FR-013). Los estados llevan siempre texto visible y, además, un rasgo de forma.
4. Sigue habiendo **un único botón principal por zona de acciones**; los demás son secundarios.

### Contraste mínimo

Todos los pares texto/fondo deben alcanzar **4,5:1**. Pares a medir en la fase de verificación:

`texto`/`fondo` · `texto`/`superficie` · `texto`/`superficie-alt` · `texto`/`papel-hundido` · `suave`/`superficie` · `suave`/`fondo` · `superficie`/`acento` · `exito`/`exito-fondo` · `aviso`/`aviso-fondo` · `error`/`error-fondo`

Valores calculados en [research.md](../research.md), apartado R3. El indicador de foco usa `acento`, que sobre papel supera 3:1 con holgura (FR-012a).

## Tipografía (`css/estilos.css`, bloque `:root`)

Dos familias, **papeles disjuntos y excluyentes** (FR-008). Solo familias ya instaladas en el sistema: no se descarga ninguna (FR-022).

| Token | Valor | Papel |
|---|---|---|
| `--fuente-titulo` | `Cambria, "Sitka Text", Georgia, "Times New Roman", serif` | Marca, `h2`, `h3`, rótulos de sección |
| `--fuente` | `"Segoe UI Variable Text", "Segoe UI", system-ui, Arial, sans-serif` | Cuerpo, formularios, botones, navegación **y todo dato numérico** |

**Regla dura (FR-024): ningún número se compone con `--fuente-titulo`.** Importes, fechas, cantidades e identificadores `AAAA-NNN` van siempre en `--fuente` con `font-variant-numeric: tabular-nums`. Esto incluye el total del presupuesto, que destaca por tamaño y separación, no por cambio de familia. El motivo está en [research.md](../research.md), apartado R2.

### Escala de tamaños

| Token | R1 | R2 | Uso |
|---|---|---|---|
| `--t-xs` | 12 px | `12px` | Rótulos en mayúsculas, pie de tabla |
| `--t-s` | 14 px | `14px` | Metadatos, etiquetas de formulario, botón pequeño |
| `--t-m` | 16 px | `16px` | Cuerpo y controles. **Nunca baja de 16 px en campos** (FR-014) |
| `--t-l` | 20 px | `20px` | `h3`, títulos de bloque |
| `--t-xl` | 26 px | `30px` | `h2`, título de pantalla |
| `--t-2xl` | — | `40px` | Total del presupuesto (FR-011) |

El salto entre `--t-xl` y `--t-l` es de 10 px, suficiente para que título de pantalla y título de bloque no compitan (defecto 1 del diagnóstico).

### Tokens tipográficos nuevos

| Token | Valor | Uso |
|---|---|---|
| `--lh-apretado` | `1.2` | Titulares en serif |
| `--lh-normal` | `1.5` | Cuerpo |
| `--letra-rotulo` | `0.08em` | Rótulos en mayúsculas de 12 px |
| `--peso-medio` | `600` | Sección actual y cabecera de tabla; sustituye usos sueltos de negrita |

## Espaciado, forma y densidad

- **Escala de espaciado** (sin cambios en R1, más un escalón): `--e-1` 4 px, `--e-2` 8 px, `--e-3` 16 px, `--e-4` 24 px, `--e-5` 32 px, **`--e-6` 48 px** para separar bloques mayores. Márgenes y rellenos usan solo estos valores.
- **Alto táctil**: `--alto-tactil` 44 px, sin cambios (FR-014).
- **Radio**: `--radio` 4 px, solo en controles y campos. Las superficies de contenido —tablas, bloques de sección, totales— van a **radio 0**: la dirección es de papel, no de tarjetas.
- **Filetes**: `--filete` 1 px con `borde`; `--filete-fuerte` 2 px con `borde-fuerte`.
- **Separación por filetes, no por cajas** (FR-023): los bloques que en R1 eran recuadros blancos con contorno sobre fondo gris pasan a separarse con reglas horizontales y espacio.
- **Densidad de listado** en anchos ≥ 640 px: alineación vertical centrada en todas las celdas y relleno vertical de `--e-1`, lo que deja la fila en **52 px** manteniendo los botones en 44 px (FR-028, FR-014). Ver [research.md](../research.md), apartado R8.
- **Ancho de columna** en los listados: se reparte por el contenido, no por el ancho del encabezado. La columna de total y la etiqueta de estado mantienen al menos `--e-4` de separación.

## Puntos de corte (mobile-first)

Sin cambios respecto a R1; R2 no añade ninguno.

- Base: desde 320 px, una columna; las tablas se presentan como tarjetas.
- `min-width: 640px`: navegación en una fila, tablas normales, formularios en dos columnas, densidad de listado y resalte de fila.
- `min-width: 960px`: contenido centrado con ancho máximo de 1100 px.

## Jerarquía

- `h1`: nombre de la aplicación en la cabecera, en `--fuente-titulo`.
- `h2`: título de pantalla (`--t-xl`), en `--fuente-titulo`, **siempre con un complemento de contexto** (FR-026; textos en [pantallas.md](pantallas.md)).
- `h3`: títulos de bloque (`--t-l`), en `--fuente-titulo`.
- **Cabecera**: papel con filete inferior. **No es una banda de color** (FR-023).
- **Sección actual**: un único signo visual —filete inferior de `acento` de 2 px y `--peso-medio`— además de la indicación accesible (FR-025). Se retira el fondo `acento-oscuro` que R1 usaba a la vez.
- **Total del presupuesto**: `--t-2xl`, sobre `superficie-alt`, con filete de refuerzo superior. Es el mayor tamaño numérico de la pantalla (FR-011).
- **Etiqueta de estado**: debe diferenciarse de los botones de su fila en forma, altura y tratamiento de borde, de modo que no se lea como un botón (FR-027). Conserva el texto siempre visible y un rasgo no cromático que distingue Vigente de Caducado, para seguir siendo legible en impresión en blanco y negro.
- **Acción destructiva**: al final del grupo de acciones y separada de las demás, además del color del texto (FR-029).
