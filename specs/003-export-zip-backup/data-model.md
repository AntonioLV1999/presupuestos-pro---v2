# Data Model: Exportar todos los presupuestos en un .zip

**No hay cambios en el modelo de datos guardado.** El documento `presupuestospro.v1` (ver [almacenamiento.md](../001-presupuestos-pro-v0/contracts/almacenamiento.md)) no cambia, no hay migración y la exportación no escribe nada en `localStorage`.

## Entidades nuevas (solo existen durante la exportación)

### Copia de seguridad (.zip)

| Atributo | Regla |
|----------|-------|
| Nombre | `presupuestospro-copia-AAAA-MM-DD.zip`, fecha local del día |
| Contenido | N PDF (N = nº de presupuestos, N ≥ 1) + 1 archivo de datos; sin carpetas, nada más |
| Se crea | Solo si N ≥ 1 |

### Entrada PDF

| Atributo | Regla |
|----------|-------|
| Nombre | `<número> - <cliente>.pdf`; cliente limpio según [R4](research.md); sin cliente: `<número>.pdf`; repetidos con « (2)», « (3)»… |
| Contenido | Resultado de `Pdf.construir` para ese presupuesto y el perfil actual |

### Entrada de datos

| Atributo | Regla |
|----------|-------|
| Nombre | `datos-presupuestospro.json` |
| Contenido | Envoltura descrita en [contracts/copia-zip.md](contracts/copia-zip.md) |

## Relación con el documento guardado

```text
estado (presupuestospro.v1)                 copia .zip
├── profesional (con logo)  ─────────────►  datos-presupuestospro.json → datos.profesional
├── catalogo                ─────────────►                              → datos.catalogo
├── clientes                ─────────────►                              → datos.clientes
├── contadores              ─────────────►                              → datos.contadores
└── presupuestos[i]         ─────────────►                              → datos.presupuestos[i]
                            └──(Pdf.construir)──►  "<número> - <cliente>.pdf"  (uno por i)
```

Todo es lectura: ningún campo se modifica, se renombra ni se normaliza al exportar.
