/* Estado Vigente/Caducado y resumen de actividad. Funciones puras, sin DOM (FR-005, FR-013). */
(function () {
  'use strict';

  /** «caducado» si la fecha de validez es anterior a hoy; «vigente» en caso contrario (incluido el último día). */
  function estado(presupuesto, hoy) {
    return Calculos.fechaValidez(presupuesto.fechaEmision) < hoy ? 'caducado' : 'vigente';
  }

  function resumen(datos, hoy) {
    var presupuestos = datos.presupuestos || [];
    var caducados = presupuestos.filter(function (p) { return estado(p, hoy) === 'caducado'; }).length;
    return {
      total: presupuestos.length,
      vigentes: presupuestos.length - caducados,
      caducados: caducados,
      clientes: (datos.clientes || []).length,
      servicios: (datos.catalogo || []).length
    };
  }

  window.Vigencia = { estado: estado, resumen: resumen };
}());
