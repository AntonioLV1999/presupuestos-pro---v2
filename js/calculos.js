/* Cálculos del presupuesto en céntimos enteros (research R5). Sin acceso a la pantalla ni al almacenamiento. */
(function () {
  'use strict';

  var IVA = 21;

  function redondear(x) {
    return Math.round(x);
  }

  /** Importe de una línea: cantidad (centésimas) × precio (céntimos) / 100. */
  function importeLinea(cantidadCentesimas, precioCentimos) {
    return redondear((cantidadCentesimas || 0) * (precioCentimos || 0) / 100);
  }

  /** Porcentaje de retención que se aplica de verdad: 0 si el cliente es particular (FR-022). */
  function porcentajeEfectivo(presupuesto) {
    if (!presupuesto.cliente || presupuesto.cliente.tipo === 'particular') { return 0; }
    return presupuesto.porcentajeRetencion === 7 ? 7 : 15;
  }

  /** Base, IVA, retención y total (FR-019 a FR-026). */
  function totales(presupuesto) {
    var base = (presupuesto.lineas || []).reduce(function (suma, l) {
      return suma + importeLinea(l.cantidadCentesimas, l.precioCentimos);
    }, 0);
    var iva = redondear(base * IVA / 100);
    var retencion = redondear(base * porcentajeEfectivo(presupuesto) / 100);
    return {
      baseCentimos: base,
      ivaCentimos: iva,
      retencionCentimos: retencion,
      totalCentimos: base + iva - retencion
    };
  }

  /** Fecha de emisión + 30 días naturales, en hora local (FR-014). */
  function fechaValidez(fechaEmision) {
    var p = String(fechaEmision).split('-');
    var d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) + 30);
    var mes = d.getMonth() + 1;
    var dia = d.getDate();
    return d.getFullYear() + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;
  }

  /** Línea nueva e independiente a partir de un servicio del catálogo (FR-005). */
  function lineaDesdeServicio(servicio) {
    return {
      concepto: servicio.nombre,
      cantidadCentesimas: 100,
      precioCentimos: servicio.precioCentimos
    };
  }

  window.Calculos = {
    IVA: IVA,
    importeLinea: importeLinea,
    porcentajeEfectivo: porcentajeEfectivo,
    totales: totales,
    fechaValidez: fechaValidez,
    lineaDesdeServicio: lineaDesdeServicio
  };
}());
