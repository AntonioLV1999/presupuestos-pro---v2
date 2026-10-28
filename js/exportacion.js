/* Lógica pura de la exportación a .zip: nombres de archivo y archivo de datos (contracts/copia-zip.md). Sin DOM. */
(function () {
  'use strict';

  /** '2026-03-15' → 'presupuestospro-copia-2026-03-15.zip' (FR-006). */
  function nombreZip(aaaaMmDd) {
    return 'presupuestospro-copia-' + aaaaMmDd + '.zip';
  }

  /** Texto JSON de la envoltura; `datos` es el estado tal cual (FR-005). */
  function datosCopia(estado, ahora) {
    return JSON.stringify({
      formato: 'presupuestospro-copia',
      version: 1,
      exportadoEn: ahora.toISOString(),
      datos: estado
    }, null, 2);
  }

  function recortarExtremos(texto) {
    return texto.replace(/^[ .]+|[ .]+$/g, '');
  }

  /** Quita lo que Windows no admite en un nombre de archivo (FR-008). */
  function nombreSeguro(texto) {
    var limpio = String(texto == null ? '' : texto)
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .replace(/ {2,}/g, ' ');
    limpio = recortarExtremos(limpio);
    if (limpio.length > 80) { limpio = recortarExtremos(limpio.slice(0, 80)); }
    return limpio;
  }

  /** Un nombre de PDF único por presupuesto, en el mismo orden (FR-007, FR-008). */
  function nombresPdf(presupuestos) {
    var usados = {};
    return presupuestos.map(function (p) {
      var cliente = nombreSeguro(p.cliente && p.cliente.nombre);
      var base = cliente ? p.numero + ' - ' + cliente : String(p.numero);
      var nombre = base + '.pdf';
      var n = 2;
      while (usados[nombre.toLowerCase()]) {
        nombre = base + ' (' + n + ').pdf';
        n++;
      }
      usados[nombre.toLowerCase()] = true;
      return nombre;
    });
  }

  window.Exportacion = {
    nombreZip: nombreZip,
    datosCopia: datosCopia,
    nombreSeguro: nombreSeguro,
    nombresPdf: nombresPdf
  };
}());
