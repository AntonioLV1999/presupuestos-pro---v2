# Contrato: formato de almacenamiento

**Ubicación**: `localStorage` del navegador, clave `presupuestospro.v1`. Ver [research.md](../research.md), apartado R3.
**Tipos y reglas**: [data-model.md](../data-model.md).

## Estructura

```json
{
  "version": 1,
  "profesional": {
    "nombre": "Ana Ruiz",
    "nif": "12345678Z",
    "telefono": "600 000 000",
    "email": "ana@ejemplo.es",
    "direccion": "C/ Mayor 1, 28001 Madrid",
    "logo": "data:image/png;base64,..."
  },
  "catalogo": [
    { "id": "s1", "nombre": "Diseño de identidad visual", "precioCentimos": 75000 }
  ],
  "clientes": [
    { "id": "c1", "nombre": "Estudio Norte S.L.", "nif": "B12345678", "email": "", "tipo": "empresa" }
  ],
  "presupuestos": [
    {
      "id": "p1",
      "numero": "2026-001",
      "fechaEmision": "2026-10-23",
      "cliente": { "nombre": "Estudio Norte S.L.", "nif": "B12345678", "email": "", "tipo": "empresa", "clienteGuardadoId": "c1" },
      "porcentajeRetencion": 15,
      "lineas": [
        { "concepto": "Diseño de identidad visual", "cantidadCentesimas": 100, "precioCentimos": 75000 },
        { "concepto": "Licencias utilizadas para el diseño", "cantidadCentesimas": 200, "precioCentimos": 4500 },
        { "concepto": "Adaptaciones para redes sociales", "cantidadCentesimas": 300, "precioCentimos": 12000 }
      ],
      "observaciones": ""
    }
  ],
  "contadores": { "2026": 1 }
}
```

## Reglas

- **Estado inicial**: si la clave no existe, la aplicación arranca con la profesional vacía, las listas vacías y `contadores: {}`.
- **Escritura**: se reescribe el documento completo tras cada cambio que la usuaria confirma, por ejemplo al guardar o al borrar.
- **Sin derivados**: nunca se guardan valores derivados como base, IVA, retención, total o validez. Se calculan al leer.
- **Coherencia del tipo**: `porcentajeRetencion` vale `0` si y solo si `cliente.tipo` es `particular`.
- **Datos corruptos**: si el JSON no se puede leer, la aplicación no lo sobrescribe. Muestra «No se han podido leer tus datos guardados. No se ha borrado nada.» y no permite guardar hasta que se resuelva.
- **Espacio agotado**: si el navegador rechaza la escritura, se muestra «No queda espacio para guardar. Prueba con un logo más pequeño.» y el cambio no se da por guardado.
- **Versiones**: el campo `version` permite migrar el formato en el futuro. En v0 solo existe la versión 1.
