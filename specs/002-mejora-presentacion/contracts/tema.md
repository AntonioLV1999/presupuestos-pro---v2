# Contrato: tema visual

Fuente única de la apariencia. Cambiar un valor aquí lo cambia en toda la aplicación y en el PDF (FR-008 a FR-010, SC-006, SC-007).

## Paleta (`js/tema.js`)

Cada nombre se publica como variable CSS `--<nombre>` y está disponible para el PDF. Ningún otro archivo contiene colores literales.

| Nombre | Valor inicial | Uso |
|--------|---------------|-----|
| `texto` | `#1f2933` | Texto principal |
| `suave` | `#52606d` | Texto secundario, etiquetas |
| `borde` | `#d9dee3` | Líneas y bordes |
| `fondo` | `#f5f7f9` | Fondo de página y bloques |
| `superficie` | `#ffffff` | Tarjetas, campos |
| `acento` | `#1f4b78` | Menú, botón principal, títulos del PDF |
| `acento-oscuro` | `#163757` | Estado al pasar el ratón |
| `exito` / `exito-fondo` | `#1e6b34` / `#e6f4ea` | Mensajes de éxito, estado Vigente |
| `aviso` / `aviso-fondo` | `#8a5a00` / `#fff4dc` | Estado Caducado |
| `error` / `error-fondo` | `#b42318` / `#fdecea` | Errores y acciones de borrar |

Los pares texto/fondo deben cumplir contraste mínimo 4,5:1.

## Tipografía y espaciado (`css/estilos.css`, bloque `:root`)

- **Familia**: `system-ui, "Segoe UI", Arial, sans-serif`.
- **Tamaños**: `--t-xs` 12 px, `--t-s` 14 px, `--t-m` 16 px, `--t-l` 20 px, `--t-xl` 26 px (el texto base nunca baja de 16 px en campos, para evitar el zoom en móvil).
- **Espaciado**: `--e-1` 4 px, `--e-2` 8 px, `--e-3` 16 px, `--e-4` 24 px, `--e-5` 32 px. Los márgenes y rellenos usan solo estos valores.

## Puntos de corte (mobile-first)

- Base: de 320 px en adelante, una columna.
- `min-width: 640px`: menú en una fila, tablas normales, formularios en dos columnas.
- `min-width: 960px`: contenido centrado con ancho máximo de 1100 px.

## Jerarquía

- `h1`: nombre de la aplicación en el menú. `h2`: título de pantalla (`--t-xl`). `h3`: bloques (`--t-l`).
- Total del presupuesto: el mayor tamaño numérico de la pantalla, en negrita, sobre `fondo`.
- Un único botón principal (`acento`) por zona de acciones; los demás son secundarios; borrar usa `error`.
