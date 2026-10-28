/* Formato de importes, cantidades y fechas en español de España (research R6). */
(function () {
  'use strict';

  var NUMERO = /^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/;

  function conMiles(entero) {
    return String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function dosCifras(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /** 123456 -> «1.234,56 €». Siempre con punto de miles. */
  function importe(centimos) {
    var valor = Math.round(Number(centimos) || 0);
    var signo = valor < 0 ? '-' : '';
    var absoluto = Math.abs(valor);
    return signo + conMiles(Math.floor(absoluto / 100)) + ',' + dosCifras(absoluto % 100) + ' €';
  }

  /** 150 -> «1,5»; 300 -> «3»; 125 -> «1,25». */
  function cantidad(centesimas) {
    var valor = Math.round(Number(centesimas) || 0);
    var signo = valor < 0 ? '-' : '';
    var absoluto = Math.abs(valor);
    var entero = conMiles(Math.floor(absoluto / 100));
    var decimales = absoluto % 100;
    if (decimales === 0) { return signo + entero; }
    return signo + entero + ',' + dosCifras(decimales).replace(/0$/, '');
  }

  /** «2026-10-23» -> «23/10/2026». */
  function fecha(aaaaMmDd) {
    var partes = String(aaaaMmDd || '').split('-');
    if (partes.length !== 3) { return ''; }
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  /** Convierte un texto con hasta dos decimales en un entero de centésimas, o null si no es válido. */
  function leerCentesimas(texto) {
    var limpio = String(texto == null ? '' : texto).replace(/€/g, '').replace(/\s+/g, '');
    var negativo = false;
    if (limpio.charAt(0) === '-') {
      negativo = true;
      limpio = limpio.slice(1);
    }
    var partes = NUMERO.exec(limpio);
    if (!partes) { return null; }
    var entero = parseInt(partes[1].replace(/\./g, ''), 10);
    var decimales = partes[2] ? parseInt((partes[2] + '0').slice(0, 2), 10) : 0;
    var valor = entero * 100 + decimales;
    return negativo ? -valor : valor;
  }

  /** «1.234,56» -> 123456 céntimos. */
  function leerImporte(texto) {
    return leerCentesimas(texto);
  }

  /** «1,5» -> 150 centésimas. */
  function leerCantidad(texto) {
    return leerCentesimas(texto);
  }

  /** Fecha local de hoy como «AAAA-MM-DD». */
  function hoy() {
    var d = new Date();
    return d.getFullYear() + '-' + dosCifras(d.getMonth() + 1) + '-' + dosCifras(d.getDate());
  }

  /** Texto para mostrar un importe o una cantidad en un campo editable (sin « €»). */
  function importeEditable(centimos) {
    return importe(centimos).replace(' €', '');
  }

  window.Formato = {
    importe: importe,
    cantidad: cantidad,
    fecha: fecha,
    leerImporte: leerImporte,
    leerCantidad: leerCantidad,
    hoy: hoy,
    importeEditable: importeEditable
  };
}());
